import { ArrayUtil, RandomGenerator } from "@nestia/e2e";
import { randint } from "tstl";

import { IBbsArticle } from "@samchon/bbs-api/lib/structures/bbs/IBbsArticle";

import { prepare_random_file } from "./prepare_random_file";

export const prepare_random_article = (
  password: string,
): IBbsArticle.IUpdate => ({
  password,
  title: RandomGenerator.paragraph(),
  body: RandomGenerator.content(),
  format: "txt",
  files: ArrayUtil.repeat(randint(0, 3), () => prepare_random_file()),
});
