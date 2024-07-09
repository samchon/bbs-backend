import { DynamicBenchmarker } from "@nestia/benchmark";

import { BbsConfiguration } from "../../src/BbsConfiguration";

DynamicBenchmarker.servant({
  connection: {
    host: `http://127.0.0.1:${BbsConfiguration.API_PORT()}`,
  },
  location: `${__dirname}/../features`,
  parameters: (connection) => [connection],
  prefix: "test_api_",
}).catch((exp) => {
  console.error(exp);
  process.exit(-1);
});
