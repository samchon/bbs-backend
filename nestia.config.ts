import { INestiaConfig } from "@nestia/sdk";
import { NestFactory } from "@nestjs/core";
import { FastifyAdapter } from "@nestjs/platform-fastify";

import { BbsModule } from "./src/BbsModule";

export const NESTIA_CONFIG: INestiaConfig = {
  input: () => NestFactory.create(BbsModule, new FastifyAdapter()),
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
  primitive: false,
  simulate: true,
};
export default NESTIA_CONFIG;
