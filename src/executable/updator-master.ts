import { BbsUpdator } from "../BbsUpdator";

async function main(): Promise<void> {
  await BbsUpdator.master();
  await BbsUpdator.slave("127.0.0.1");
}
main().catch((exp) => {
  console.log(exp);
  process.exit(-1);
});
