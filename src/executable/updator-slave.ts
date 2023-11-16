import { BbsUpdator } from "../BbsUpdator";

async function main(): Promise<void> {
  await BbsUpdator.slave();
}
main().catch((exp) => {
  console.error(exp);
  process.exit(-1);
});
