import { INestiaConfig } from "@nestia/sdk";
import { NestFactory } from "@nestjs/core";

import { BbsModule } from "./src/BbsModule";

export const NESTIA_CONFIG: INestiaConfig = {
  input: () => NestFactory.create(BbsModule),
  output: "src/api",
  swagger: {
    output: "packages/api/swagger.json",
    servers: [
      {
        url: "http://localhost:37001",
        description: "Local Server",
      },
    ],
    beautify: true,
  },
  simulate: true,
};
export default NESTIA_CONFIG;
