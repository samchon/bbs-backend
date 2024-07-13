import { DynamicExecutor } from "@nestia/e2e";
import chalk from "chalk";
import { sleep_for } from "tstl";

import BbsApi from "@samchon/bbs-api";

import { BbsBackend } from "../src/BbsBackend";
import { BbsConfiguration } from "../src/BbsConfiguration";
import { BbsGlobal } from "../src/BbsGlobal";
import { BbsSetupWizard } from "../src/setup/BbsSetupWizard";
import { ArgumentParser } from "../src/utils/ArgumentParser";
import { StopWatch } from "./internal/StopWatch";

interface IOptions {
  reset: boolean;
  include?: string[];
  exclude?: string[];
  trace: boolean;
}

const getOptions = () =>
  ArgumentParser.parse<IOptions>(async (command, prompt, action) => {
    command.option("--reset <true|false>", "reset local DB or not");
    command.option("--include <string...>", "include feature files");
    command.option("--exclude <string...>", "exclude feature files");
    command.option("--trace <boolean>", "trace detailed errors");

    return action(async (options) => {
      if (typeof options.reset === "string")
        options.reset = options.reset === "true";
      options.reset ??= await prompt.boolean("reset")("Reset local DB");
      options.trace = options.trace !== ("false" as any);
      return options as IOptions;
    });
  });

const main = async (): Promise<void> => {
  // CONFIGURE
  const options: IOptions = await getOptions();
  BbsGlobal.testing = true;

  if (options.reset) {
    await StopWatch.trace("Reset DB")(BbsSetupWizard.schema);
    await StopWatch.trace("Seed Data")(BbsSetupWizard.seed);
  }

  // OPEN SERVER
  const backend: BbsBackend = new BbsBackend();
  await backend.open();

  // DO TEST
  const connection: BbsApi.IConnection = {
    host: `http://127.0.0.1:${BbsConfiguration.API_PORT()}`,
  };
  const report: DynamicExecutor.IReport = await DynamicExecutor.validate({
    prefix: "test",
    location: __dirname + "/features",
    parameters: () => [{ ...connection }],
    filter: (func) =>
      (!options.include?.length ||
        (options.include ?? []).some((str) => func.includes(str))) &&
      (!options.exclude?.length ||
        (options.exclude ?? []).every((str) => !func.includes(str))),
    onComplete: (exec) => {
      const trace = (str: string) =>
        console.log(`  - ${chalk.green(exec.name)}: ${str}`);
      if (exec.error === null) {
        const elapsed: number =
          new Date(exec.completed_at).getTime() -
          new Date(exec.started_at).getTime();
        trace(`${chalk.yellow(elapsed.toLocaleString())} ms`);
      } else trace(chalk.red(exec.error.name));
    },
  });

  // TERMINATE
  await sleep_for(2500); // WAIT FOR BACKGROUND EVENTS
  await backend.close();

  const exceptions: Error[] = report.executions
    .filter((exec) => exec.error !== null)
    .map((exec) => exec.error!);
  if (exceptions.length === 0) {
    console.log("Success");
    console.log("Elapsed time", report.time.toLocaleString(), `ms`);
  } else {
    if (options.trace !== false) for (const exp of exceptions) console.log(exp);
    console.log("Failed");
    console.log("Elapsed time", report.time.toLocaleString(), `ms`);
    process.exit(-1);
  }
};
main().catch((exp) => {
  console.log(exp);
  process.exit(-1);
});
