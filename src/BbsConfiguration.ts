import { ExceptionManager } from "@nestia/core";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import path from "path";

import { ErrorProvider } from "./providers/bbs/ErrorProvider";

import { BbsGlobal } from "./BbsGlobal";

const EXTENSION = __filename.substr(-2);
if (EXTENSION === "js") require("source-map-support").install();

export namespace BbsConfiguration {
  export const ROOT = (() => {
    const splitted: string[] = __dirname.split(path.sep);
    return splitted.at(-1) === "src" && splitted.at(-2) === "bin"
      ? path.resolve(__dirname + "/../..")
      : path.resolve(__dirname + "/..");
  })();

  export const API_PORT = () => Number(BbsGlobal.env.BBS_API_PORT);
  export const UPDATOR_PORT = () => Number(BbsGlobal.env.BBS_UPDATOR_PORT);
  export const MASTER_IP = () =>
    BbsGlobal.mode === "local"
      ? "127.0.0.1"
      : BbsGlobal.mode === "dev"
      ? "your-dev-server-ip"
      : "your-real-server-master-ip";
  export const SYSTEM_PASSWORD = () => BbsGlobal.env.BBS_SYSTEM_PASSWORD;
}

ExceptionManager.insert(PrismaClientKnownRequestError, (exp) => {
  switch (exp.code) {
    case "P2025":
      return ErrorProvider.notFound(exp.message);
    case "P2002": // UNIQUE CONSTRAINT
      return ErrorProvider.conflict(exp.message);
    default:
      return ErrorProvider.internal(exp.message);
  }
});