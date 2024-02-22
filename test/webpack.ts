import { DynamicExecutor } from "@nestia/e2e";
import cp from "child_process";
import fs from "fs";
import { sleep_for } from "tstl";

import { BbsConfiguration } from "../src/BbsConfiguration";
import BbsApi from "../src/api";

const webpackTest = async (): Promise<void> => {
  if (fs.existsSync(BbsConfiguration.ROOT + "/dist/server.js") === false)
    throw new Error("Run npm run webpack command first.");

  // START BACKEND SERVER
  const backend = cp.fork("server.js", {
    cwd: `${BbsConfiguration.ROOT}/dist`,
  });
  await sleep_for(2_500);

  // DO TEST
  const connection: BbsApi.IConnection = {
    host: `http://127.0.0.1:${BbsConfiguration.API_PORT()}`,
  };
  const report: DynamicExecutor.IReport = await DynamicExecutor.validate({
    prefix: "test",
    parameters: () => [
      {
        host: connection.host,
        encryption: connection.encryption,
      },
    ],
  })(__dirname + "/features");

  backend.kill();

  // REPORT EXCEPTIONS
  const exceptions: Error[] = report.executions
    .filter((exec) => exec.error !== null)
    .map((exec) => exec.error!);
  if (exceptions.length === 0) {
    console.log("Success");
    console.log("Elapsed time", report.time.toLocaleString(), `ms`);
  } else {
    for (const exp of exceptions) console.log(exp);
    console.log("Failed");
    console.log("Elapsed time", report.time.toLocaleString(), `ms`);
  }
};
webpackTest().catch((exp) => {
  console.log(exp);
  process.exit(-1);
});
