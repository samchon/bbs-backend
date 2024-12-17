import cp from "child_process";

import { BbsGlobal } from "../BbsGlobal";

export namespace BbsSetupWizard {
  export async function schema(): Promise<void> {
    if (BbsGlobal.testing === false)
      throw new Error(
        "Erron on SetupWizard.schema(): unable to reset database in non-test mode.",
      );
    const execute = (type: string) => (argv: string) =>
      cp.execSync(
        `npx prisma migrate ${type} --schema=prisma/schema.prisma ${argv}`,
        { stdio: "inherit" },
      );
    execute("reset")("--force");
    execute("dev")("--name init");

    await BbsGlobal.prisma.$executeRawUnsafe(
      `GRANT SELECT ON ALL TABLES IN SCHEMA ${BbsGlobal.env.BBS_POSTGRES_SCHEMA} TO ${BbsGlobal.env.BBS_POSTGRES_USERNAME_READONLY}`,
    );
  }

  export async function seed(): Promise<void> {}
}
