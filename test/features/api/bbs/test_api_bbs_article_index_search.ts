import { ArrayUtil, RandomGenerator, TestValidator } from "@nestia/e2e";
import typia from "typia";

import BbsApi from "@samchon/bbs-api/lib/index";
import { IBbsArticle } from "@samchon/bbs-api/lib/structures/bbs/IBbsArticle";
import { IPage } from "@samchon/bbs-api/lib/structures/common/IPage";

import { generate_random_article } from "./internal/generate_random_article";

export const test_api_bbs_article_index_search = async (
  connection: BbsApi.IConnection,
): Promise<void> => {
  await ArrayUtil.asyncRepeat(REPEAT)(() =>
    generate_random_article(connection),
  );

  const expected: IPage<IBbsArticle.IAbridge> =
    await BbsApi.functional.bbs.articles.abridges(connection, {
      limit: REPEAT,
    });
  typia.assertEquals(expected);

  const validator = TestValidator.search("search")(
    async (search: IBbsArticle.IRequest.ISearch) => {
      const page: IPage<IBbsArticle.IAbridge> =
        await BbsApi.functional.bbs.articles.abridges(connection, {
          search,
          limit: REPEAT,
        });
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
    fields: ["title"],
    values: (arc) => [arc.title],
    request: ([title]) => ({ title }),
    filter: (arc, [title]) => arc.title.includes(title),
  });
  await validator({
    fields: ["title_or_body"],
    values: (arc) => [RandomGenerator.pick([arc.title, arc.body])],
    request: ([title_or_body]) => ({ title_or_body }),
    filter: (arc, [value]) =>
      arc.title.includes(value) || arc.body.includes(value),
  });
};

const REPEAT = 25;
