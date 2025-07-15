import { RandomGenerator } from "@nestia/e2e";
import typia from "typia";

import BbsApi from "@samchon/bbs-api/lib/index";
import { IBbsArticle } from "@samchon/bbs-api/lib/structures/bbs/IBbsArticle";

import { prepare_random_article } from "./prepare_random_article";

export const generate_random_article = async (
  connection: BbsApi.IConnection,
  password?: string,
): Promise<IBbsArticle> => {
  const article: IBbsArticle = await BbsApi.functional.bbs.articles.create(
    connection,
    {
      body: {
        ...prepare_random_article(password ?? RandomGenerator.alphaNumeric(8)),
        writer: RandomGenerator.name(),
      },
    },
  );
  return typia.assertEquals(article);
};
