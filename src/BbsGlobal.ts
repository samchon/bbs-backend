import { PrismaBetterSQLite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import dotenvExpand from "dotenv-expand";
import { Singleton } from "tstl";
import typia from "typia";

interface IEnvironments {
  BBS_MODE: "local" | "dev" | "real";
  BBS_API_PORT: `${number}`;
  BBS_SYSTEM_PASSWORD: string;
  BBS_SQLITE_FILE: string;
}
const environments = new Singleton(() => {
  const env = dotenv.config();
  dotenvExpand.expand(env);
  return typia.assert<IEnvironments>(process.env);
});

/**
 * Global variables of the server.
 *
 * @author Samchon
 */
export class BbsGlobal {
  public static testing: boolean = false;

  public static readonly prisma: PrismaClient = new PrismaClient({
    adapter: new PrismaBetterSQLite3({
      url: environments.get().BBS_SQLITE_FILE,
    }),
  });

  public static get env(): IEnvironments {
    return environments.get();
  }

  /**
   * Current mode.
   *
   *   - local: The server is on your local machine.
   *   - dev: The server is for the developer.
   *   - real: The server is for the real service.
   */
  public static get mode(): "local" | "dev" | "real" {
    return (modeWrapper.value ??= environments.get().BBS_MODE);
  }

  /**
   * Set current mode.
   *
   * @param mode The new mode
   */
  public static setMode(mode: typeof BbsGlobal.mode): void {
    typia.assert<typeof mode>(mode);
    modeWrapper.value = mode;
  }
}
interface IMode {
  value?: "local" | "dev" | "real";
}
const modeWrapper: IMode = {};
