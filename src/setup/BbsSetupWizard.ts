import cp from "child_process";

import { BbsConfiguration } from "../BbsConfiguration";
import { BbsGlobal } from "../BbsGlobal";

export namespace BbsSetupWizard {
  export async function schema(): Promise<void> {
    if (BbsGlobal.testing === false)
      throw new Error(
        "Error on SetupWizard.schema(): unable to reset database in non-test mode.",
      );
    const execute = (type: string) => (argv: string) =>
      cp.execSync(`prisma migrate ${type} --schema=prisma/schema ${argv}`, {
        stdio: "overlapped",
        cwd: BbsConfiguration.ROOT,
      });
    execute("reset")("--force");
    execute("dev")("--name init");
  }

  export async function seed(): Promise<void> {}
}
