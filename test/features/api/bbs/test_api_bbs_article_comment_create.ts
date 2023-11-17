import { ArrayUtil, RandomGenerator, TestValidator } from "@nestia/e2e";
import { randint } from "tstl";
import typia from "typia";

import BbsApi from "@samchon/bbs-api/lib/index";
import { IBbsArticle } from "@samchon/bbs-api/lib/structures/bbs/IBbsArticle";
import { IBbsArticleComment } from "@samchon/bbs-api/lib/structures/bbs/IBbsArticleComment";

import { generate_random_article } from "./internal/generate_random_article";
import { prepare_random_file } from "./internal/prepare_random_file";

export const test_api_bbs_article_comment_create = async (
  connection: BbsApi.IConnection,
): Promise<void> => {
  const article: IBbsArticle = await generate_random_article(connection);

  const input: IBbsArticleComment.ICreate = {
    writer: RandomGenerator.name(),
    password: RandomGenerator.alphaNumeric(8),
    body: RandomGenerator.content()()(),
    format: "md",
    files: ArrayUtil.repeat(randint(0, 3))(() => prepare_random_file()),
  };
  const comment: IBbsArticleComment =
    await BbsApi.functional.bbs.articles.comments.create(
      connection,
      article.id,
      input,
    );
  typia.assertEquals(article);

  TestValidator.equals("create")({
    snapshots: [
      {
        format: input.format,
        body: input.body,
        files: input.files,
      },
    ],
    writer: input.writer,
  })(comment);

  const read: IBbsArticleComment =
    await BbsApi.functional.bbs.articles.comments.at(
      connection,
      article.id,
      comment.id,
    );
  typia.assertEquals(read);
  TestValidator.equals("read")(read)(comment);
};
