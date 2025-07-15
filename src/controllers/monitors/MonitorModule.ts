import { Module } from "@nestjs/common";

import { MonitorHealthController } from "./MonitorHealthController";

@Module({
  controllers: [MonitorHealthController],
})
export class MonitorModule {}
