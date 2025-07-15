import { ArrayUtil, RandomGenerator, TestValidator } from "@nestia/e2e";
import { randint } from "tstl";

import BbsApi from "@samchon/bbs-api/lib/index";
import { IBbsArticle } from "@samchon/bbs-api/lib/structures/bbs/IBbsArticle";
import { IBbsArticleComment } from "@samchon/bbs-api/lib/structures/bbs/IBbsArticleComment";

import { generate_random_article } from "./internal/generate_random_article";
import { prepare_random_file } from "./internal/prepare_random_file";

export const test_api_bbs_article_comment_create = async (
  connection: BbsApi.IConnection,
): Promise<void> => {
  const article: IBbsArticle = await generate_random_article(connection);

  const body: IBbsArticleComment.ICreate = {
    writer: RandomGenerator.name(),
    password: RandomGenerator.alphaNumeric(8),
    body: RandomGenerator.content()()(),
    format: "md",
    files: ArrayUtil.repeat(randint(0, 3))(() => prepare_random_file()),
  };
  const comment: IBbsArticleComment =
    await BbsApi.functional.bbs.articles.comments.create(connection, {
      articleId: article.id,
      body,
    });

  TestValidator.equals("create")({
    snapshots: [
      {
        format: body.format,
        body: body.body,
        files: body.files,
      },
    ],
    writer: body.writer,
  })(comment);

  const read: IBbsArticleComment =
    await BbsApi.functional.bbs.articles.comments.at(connection, {
      articleId: article.id,
      id: comment.id,
    });
  TestValidator.equals("read")(read)(comment);
};
