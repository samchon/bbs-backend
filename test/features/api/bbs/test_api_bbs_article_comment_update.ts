import { ArrayUtil, RandomGenerator, TestValidator } from "@nestia/e2e";

import BbsApi from "@samchon/bbs-api/lib/index";
import { IBbsArticle } from "@samchon/bbs-api/lib/structures/bbs/IBbsArticle";
import { IBbsArticleComment } from "@samchon/bbs-api/lib/structures/bbs/IBbsArticleComment";

import { generate_random_article } from "./internal/generate_random_article";
import { generate_random_comment } from "./internal/generate_random_comment";
import { prepare_random_comment } from "./internal/prepare_random_comment";

export const test_api_bbs_article_comment_update = async (
  connection: BbsApi.IConnection,
): Promise<void> => {
  const article: IBbsArticle = await generate_random_article(connection);

  const password: string = RandomGenerator.alphaNumeric(8);
  const comment: IBbsArticleComment = await generate_random_comment(
    connection,
    article,
    password,
  );

  const inputs: IBbsArticleComment.IUpdate[] = ArrayUtil.repeat(4)(() =>
    prepare_random_comment(password),
  );
  for (const i of inputs) {
    const snapshot: IBbsArticleComment.ISnapshot =
      await BbsApi.functional.bbs.articles.comments.update(connection, {
        articleId: article.id,
        id: comment.id,
        body: i,
      });
    comment.snapshots.push(snapshot);
    TestValidator.equals("snapshot")({
      format: i.format,
      body: i.body,
      files: i.files,
    })(snapshot);
  }

  const read: IBbsArticleComment =
    await BbsApi.functional.bbs.articles.comments.at(connection, {
      articleId: article.id,
      id: comment.id,
    });
  TestValidator.equals("read")(read)(comment);
};
