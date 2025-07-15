import { ArrayUtil, RandomGenerator, TestValidator } from "@nestia/e2e";
import { randint } from "tstl";

import BbsApi from "@samchon/bbs-api/lib/index";
import { IBbsArticle } from "@samchon/bbs-api/lib/structures/bbs/IBbsArticle";

import { prepare_random_file } from "./internal/prepare_random_file";

export const test_api_bbs_article_create = async (
  connection: BbsApi.IConnection,
): Promise<void> => {
  // PREPARE INPUT DATA
  const input: IBbsArticle.ICreate = {
    writer: RandomGenerator.name(),
    password: RandomGenerator.alphaNumeric(8),
    title: RandomGenerator.paragraph()(),
    body: RandomGenerator.content()()(),
    format: "md",
    files: ArrayUtil.repeat(randint(0, 3))(() => prepare_random_file()),
  };

  // DO CREATE
  const article: IBbsArticle = await BbsApi.functional.bbs.articles.create(
    connection,
    {
      body: input,
    },
  );

  // VALIDATE WHETHER EXACT DATA IS INSERTED
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

  // COMPARE WITH READ DATA
  const read: IBbsArticle = await BbsApi.functional.bbs.articles.at(
    connection,
    {
      id: article.id,
    },
  );
  TestValidator.equals("read")(read)(article);
};
