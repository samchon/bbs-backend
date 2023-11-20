import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import dotenvExpand from "dotenv-expand";
import { MutexConnector } from "mutex-server";
import { MutableSingleton, Singleton } from "tstl";
import typia from "typia";

import { BbsConfiguration } from "./BbsConfiguration";

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

  public static readonly critical: MutableSingleton<
    MutexConnector<string, null>
  > = new MutableSingleton(async () => {
    const connector: MutexConnector<string, null> = new MutexConnector(
      BbsConfiguration.SYSTEM_PASSWORD(),
      null,
    );
    await connector.connect(
      `ws://${BbsConfiguration.MASTER_IP()}:${BbsConfiguration.UPDATOR_PORT()}/api`,
    );
    return connector;
  });
}
export namespace BbsGlobal {
  export interface IEnvironments {
    BBS_MODE: "local" | "dev" | "real";
    BBS_UPDATOR_PORT: `${number}`;
    BBS_API_PORT: `${number}`;
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
