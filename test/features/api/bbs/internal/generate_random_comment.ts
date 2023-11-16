import { RandomGenerator } from "@nestia/e2e";
import typia from "typia";

import api from "@samchon/bbs-api/lib/index";
import { IBbsArticle } from "@samchon/bbs-api/lib/structures/bbs/IBbsArticle";
import { IBbsArticleComment } from "@samchon/bbs-api/lib/structures/bbs/IBbsArticleComment";

import { prepare_random_comment } from "./prepare_random_comment";

export const generate_random_comment = async (
  connection: api.IConnection,
  article: IBbsArticle,
  password?: string,
): Promise<IBbsArticleComment> => {
  const comment: IBbsArticleComment =
    await api.functional.bbs.articles.comments.create(connection, article.id, {
      writer: RandomGenerator.name(),
      ...prepare_random_comment(password ?? RandomGenerator.alphaNumeric(8)),
    });
  return typia.assertEquals(comment);
};
