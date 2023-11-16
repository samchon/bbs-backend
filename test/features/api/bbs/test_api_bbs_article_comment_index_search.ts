import { ArrayUtil, TestValidator } from "@nestia/e2e";
import typia from "typia";

import api from "@samchon/bbs-api/lib/index";
import { IBbsArticle } from "@samchon/bbs-api/lib/structures/bbs/IBbsArticle";
import { IBbsArticleComment } from "@samchon/bbs-api/lib/structures/bbs/IBbsArticleComment";
import { IPage } from "@samchon/bbs-api/lib/structures/common/IPage";

import { generate_random_article } from "./internal/generate_random_article";
import { generate_random_comment } from "./internal/generate_random_comment";

export const test_api_bbs_article_comment_index_search = async (
  connection: api.IConnection,
): Promise<void> => {
  const article: IBbsArticle = await generate_random_article(connection);
  await ArrayUtil.asyncRepeat(REPEAT)(() =>
    generate_random_comment(connection, article),
  );

  const expected: IPage<IBbsArticleComment> =
    await api.functional.bbs.articles.comments.index(connection, article.id, {
      limit: REPEAT,
    });
  typia.assertEquals(expected);

  const validator = TestValidator.search("search")(
    async (search: IBbsArticle.IRequest.ISearch) => {
      const page: IPage<IBbsArticleComment> =
        await api.functional.bbs.articles.comments.index(
          connection,
          article.id,
          {
            search,
            limit: REPEAT,
          },
        );
      return typia.assertEquals(page).data;
    },
  )(expected.data, 2);

  await validator({
    fields: ["writer"],
    values: (arc) => [arc.writer],
    request: ([writer]) => ({ writer }),
    filter: (arc, [name]) => arc.writer.includes(name),
  });
  await validator({
    fields: ["body"],
    values: (arc) => [arc.snapshots.at(-1)!.body],
    request: ([body]) => ({ body }),
    filter: (arc, [title]) => arc.snapshots.some((s) => s.body.includes(title)),
  });
};

const REPEAT = 25;
