import { RandomGenerator, TestValidator } from "@nestia/e2e";

import BbsApi from "@samchon/bbs-api/lib/index";
import { IBbsArticle } from "@samchon/bbs-api/lib/structures/bbs/IBbsArticle";
import { IBbsArticleComment } from "@samchon/bbs-api/lib/structures/bbs/IBbsArticleComment";

import { generate_random_article } from "./internal/generate_random_article";
import { generate_random_comment } from "./internal/generate_random_comment";
import { prepare_random_comment } from "./internal/prepare_random_comment";

export const test_api_bbs_article_comment_password = async (
  connection: BbsApi.IConnection,
): Promise<void> => {
  const article: IBbsArticle = await generate_random_article(connection);

  const password: string = RandomGenerator.alphaNumeric(8);
  const comment: IBbsArticleComment = await generate_random_comment(
    connection,
    article,
    password,
  );

  await TestValidator.httpError("update", 403, () =>
    BbsApi.functional.bbs.articles.comments.update(connection, {
      articleId: article.id,
      id: comment.id,
      body: prepare_random_comment("invalid-password"),
    }),
  );

  await TestValidator.httpError("erase", 403, () =>
    BbsApi.functional.bbs.articles.comments.erase(connection, {
      articleId: article.id,
      id: comment.id,
      body: {
        password: "invalid-password",
      },
    }),
  );
};
