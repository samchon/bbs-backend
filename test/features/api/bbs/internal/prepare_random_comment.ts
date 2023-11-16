import { ArrayUtil, RandomGenerator } from "@nestia/e2e";
import { randint } from "tstl";

import { IBbsArticleComment } from "@samchon/bbs-api/lib/structures/bbs/IBbsArticleComment";

import { prepare_random_file } from "./prepare_random_file";

export const prepare_random_comment = (
  password: string,
): IBbsArticleComment.IUpdate => ({
  password,
  body: RandomGenerator.content()()(),
  format: "txt",
  files: ArrayUtil.repeat(randint(0, 3))(() => prepare_random_file()),
});
