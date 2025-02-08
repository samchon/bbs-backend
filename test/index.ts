import { BbsBackend } from "../src/BbsBackend";
import { BbsGlobal } from "../src/BbsGlobal";
import { TestAutomation } from "./TestAutomation";

const main = async (): Promise<void> => {
  BbsGlobal.testing = true;
  await TestAutomation.execute({
    open: async () => {
      const backend: BbsBackend = new BbsBackend();
      await backend.open();
      return backend;
    },
    close: (backend) => backend.close(),
  });
};
main().catch((exp) => {
  console.log(exp);
  process.exit(-1);
});
