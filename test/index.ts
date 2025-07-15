import { BbsBackend } from "../src/BbsBackend";
import { BbsGlobal } from "../src/BbsGlobal";
import { TestAutomation } from "./helpers/TestAutomation";
import { TestAutomationStdio } from "./helpers/TestAutomationStdio";

const main = async (): Promise<void> => {
  BbsGlobal.testing = true;
  await TestAutomation.execute({
    open: async () => {
      const backend: BbsBackend = new BbsBackend();
      await backend.open();
      return backend;
    },
    close: (backend) => backend.close(),
    options: await TestAutomationStdio.getOptions(),
    onComplete: TestAutomationStdio.onComplete,
    onReset: TestAutomationStdio.onReset(new Date()),
  });
};
main().catch((exp) => {
  console.log(exp);
  process.exit(-1);
});
