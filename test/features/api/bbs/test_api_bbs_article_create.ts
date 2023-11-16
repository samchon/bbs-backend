import { ArrayUtil, RandomGenerator, TestValidator } from "@nestia/e2e";
import { randint } from "tstl";
import typia from "typia";

import api from "@samchon/bbs-api/lib/index";
import { IBbsArticle } from "@samchon/bbs-api/lib/structures/bbs/IBbsArticle";

import { prepare_random_file } from "./internal/prepare_random_file";

export const test_api_bbs_article_create = async (
  connection: api.IConnection,
): Promise<void> => {
  const input: IBbsArticle.ICreate = {
    writer: RandomGenerator.name(),
    password: RandomGenerator.alphaNumeric(8),
    title: RandomGenerator.paragraph()(),
    body: RandomGenerator.content()()(),
    format: "md",
    files: ArrayUtil.repeat(randint(0, 3))(() => prepare_random_file()),
  };
  const article: IBbsArticle = await api.functional.bbs.articles.create(
    connection,
    input,
  );
  typia.assertEquals(article);

  TestValidator.equals("create")({
    snapshots: [
      {
        format: input.format,
        title: input.title,
        body: input.body,
        files: input.files,
      },
    ],
    writer: input.writer,
  })(article);

  const read: IBbsArticle = await api.functional.bbs.articles.at(
    connection,
    article.id,
  );
  typia.assertEquals(read);
  TestValidator.equals("read")(read)(article);
};
