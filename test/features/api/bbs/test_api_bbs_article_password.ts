import { RandomGenerator, TestValidator } from "@nestia/e2e";

import BbsApi from "@samchon/bbs-api/lib/index";
import { IBbsArticle } from "@samchon/bbs-api/lib/structures/bbs/IBbsArticle";

import { generate_random_article } from "./internal/generate_random_article";
import { prepare_random_article } from "./internal/prepare_random_article";

export const test_api_bbs_article_password = async (
  connection: BbsApi.IConnection,
): Promise<void> => {
  const password: string = RandomGenerator.alphaNumeric(8);
  const article: IBbsArticle = await generate_random_article(
    connection,
    password,
  );

  await TestValidator.httpError("update")(403)(() =>
    BbsApi.functional.bbs.articles.update(
      connection,
      article.id,
      prepare_random_article("invalid-password"),
    ),
  );

  await TestValidator.httpError("erase")(403)(() =>
    BbsApi.functional.bbs.articles.erase(connection, article.id, {
      password: "invalid-password",
    }),
  );
};
