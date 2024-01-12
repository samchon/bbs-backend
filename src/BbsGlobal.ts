import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import dotenvExpand from "dotenv-expand";
import { Singleton } from "tstl";
import typia from "typia";

/**
 * Global variables of the server.
 *
 * @author Samchon
 */
export class BbsGlobal {
  public static testing: boolean = false;

  public static readonly prisma: PrismaClient = new PrismaClient();

  public static get env(): BbsGlobal.IEnvironments {
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
export namespace BbsGlobal {
  export interface IEnvironments {
    BBS_MODE: "local" | "dev" | "real";
    BBS_API_PORT: `${number}`;
    BBS_API_ENCRYPTION_KEY: string;
    BBS_API_ENCRYPTION_IV: string;
    BBS_SYSTEM_PASSWORD: string;

    BBS_POSTGRES_HOST: string;
    BBS_POSTGRES_PORT: `${number}`;
    BBS_POSTGRES_DATABASE: string;
    BBS_POSTGRES_SCHEMA: string;
    BBS_POSTGRES_USERNAME: string;
    BBS_POSTGRES_USERNAME_READONLY: string;
    BBS_POSTGRES_PASSWORD: string;
  }
}

interface IMode {
  value?: "local" | "dev" | "real";
}
const modeWrapper: IMode = {};
const environments = new Singleton(() => {
  const env = dotenv.config();
  dotenvExpand.expand(env);
  return typia.assert<BbsGlobal.IEnvironments>(process.env);
});
