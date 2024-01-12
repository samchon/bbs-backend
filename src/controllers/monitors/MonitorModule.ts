import { EncryptedModule } from "@nestia/core";

import { BbsGlobal } from "../../BbsGlobal";
import { MonitorHealthController } from "./MonitorHealthController";
import { MonitorPerformanceController } from "./MonitorPerformanceController";
import { MonitorSystemController } from "./MonitorSystemController";

@EncryptedModule(
  {
    controllers: [
      MonitorHealthController,
      MonitorPerformanceController,
      MonitorSystemController,
    ],
  },
  () => ({
    key: BbsGlobal.env.BBS_API_ENCRYPTION_KEY,
    iv: BbsGlobal.env.BBS_API_ENCRYPTION_IV,
  }),
)
export class MonitorModule {}
