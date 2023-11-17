import { RandomGenerator, TestValidator } from "@nestia/e2e";

import BbsApi from "@samchon/bbs-api/lib/index";
import { IBbsArticle } from "@samchon/bbs-api/lib/structures/bbs/IBbsArticle";
import { IBbsArticleComment } from "@samchon/bbs-api/lib/structures/bbs/IBbsArticleComment";

import { generate_random_article } from "./internal/generate_random_article";
import { generate_random_comment } from "./internal/generate_random_comment";

export const test_api_bbs_article_comment_erase = async (
  connection: BbsApi.IConnection,
): Promise<void> => {
  const article: IBbsArticle = await generate_random_article(connection);
  const password: string = RandomGenerator.alphaNumeric(8);
  const comment: IBbsArticleComment = await generate_random_comment(
    connection,
    article,
    password,
  );
  await BbsApi.functional.bbs.articles.comments.erase(
    connection,
    article.id,
    comment.id,
    { password },
  );
  await TestValidator.httpError("erase")(404)(() =>
    BbsApi.functional.bbs.articles.comments.at(
      connection,
      article.id,
      comment.id,
    ),
  );
};
