import { RandomGenerator, TestValidator } from "@nestia/e2e";

import api from "@samchon/bbs-api/lib/index";
import { IBbsArticle } from "@samchon/bbs-api/lib/structures/bbs/IBbsArticle";

import { generate_random_article } from "./internal/generate_random_article";

export const test_api_bbs_article_erase = async (
  connection: api.IConnection,
): Promise<void> => {
  const password: string = RandomGenerator.alphaNumeric(8);
  const article: IBbsArticle = await generate_random_article(
    connection,
    password,
  );
  await api.functional.bbs.articles.erase(connection, article.id, { password });
  await TestValidator.httpError("erase")(404)(() =>
    api.functional.bbs.articles.at(connection, article.id),
  );
};
