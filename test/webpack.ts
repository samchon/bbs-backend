import cp from "child_process";
import { sleep_for } from "tstl";

import { BbsConfiguration } from "../src/BbsConfiguration";
import { BbsGlobal } from "../src/BbsGlobal";
import api from "../src/api";
import { TestAutomation } from "./TestAutomation";

const wait = async (): Promise<void> => {
  const connection: api.IConnection = {
    host: `http://localhost:${BbsConfiguration.API_PORT()}`,
  };
  while (true)
    try {
      await api.functional.monitors.health.get(connection);
      return;
    } catch {
      await sleep_for(100);
    }
};

const main = async (): Promise<void> => {
  BbsGlobal.testing = true;
  await TestAutomation.execute({
    open: async () => {
      const backend: cp.ChildProcess = cp.fork(
        `${BbsConfiguration.ROOT}/dist/server.js`,
        {
          cwd: `${BbsConfiguration.ROOT}/dist`,
        },
      );
      await wait();
      return backend;
    },
    close: async (backend) => {
      backend.kill();
    },
  });
};
main().catch((exp) => {
  console.log(exp);
  process.exit(-1);
});
