import { Module } from "@nestjs/common";

import { BbsArticleCommentsController } from "./controllers/bbs/BbsArticleCommentsController";
import { BbsArticlesController } from "./controllers/bbs/BbsArticlesController";
import { MonitorModule } from "./controllers/monitors/MonitorModule";

@Module({
  imports: [MonitorModule],
  controllers: [BbsArticlesController, BbsArticleCommentsController],
})
export class BbsModule {}
