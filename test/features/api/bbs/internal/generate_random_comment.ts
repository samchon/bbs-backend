import { RandomGenerator } from "@nestia/e2e";
import typia from "typia";

import BbsApi from "@samchon/bbs-api/lib/index";
import { IBbsArticle } from "@samchon/bbs-api/lib/structures/bbs/IBbsArticle";
import { IBbsArticleComment } from "@samchon/bbs-api/lib/structures/bbs/IBbsArticleComment";

import { prepare_random_comment } from "./prepare_random_comment";

export const generate_random_comment = async (
  connection: BbsApi.IConnection,
  article: IBbsArticle,
  password?: string,
): Promise<IBbsArticleComment> => {
  const comment: IBbsArticleComment =
    await BbsApi.functional.bbs.articles.comments.create(connection, {
      articleId: article.id,
      body: {
        ...prepare_random_comment(password ?? RandomGenerator.alphaNumeric(8)),
        writer: RandomGenerator.name(),
      },
    });
  return typia.assertEquals(comment);
};
