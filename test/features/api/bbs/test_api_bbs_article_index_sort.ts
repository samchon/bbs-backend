import { ArrayUtil, GaffComparator, TestValidator } from "@nestia/e2e";
import typia from "typia";

import api from "@samchon/bbs-api/lib/index";
import { IBbsArticle } from "@samchon/bbs-api/lib/structures/bbs/IBbsArticle";
import { IPage } from "@samchon/bbs-api/lib/structures/common/IPage";

import { generate_random_article } from "./internal/generate_random_article";

export const test_api_bbs_article_index_sort = async (
  connection: api.IConnection,
): Promise<void> => {
  await ArrayUtil.asyncRepeat(REPEAT)(() =>
    generate_random_article(connection),
  );

  const validator = TestValidator.sort("questions.index")<
    IBbsArticle.ISummary,
    IBbsArticle.IRequest.SortableColumns,
    IPage.Sort<IBbsArticle.IRequest.SortableColumns>
  >(async (input: IPage.Sort<IBbsArticle.IRequest.SortableColumns>) => {
    const page: IPage<IBbsArticle.ISummary> =
      await api.functional.bbs.articles.index(connection, {
        limit: REPEAT,
        sort: input,
      });
    return typia.assertEquals(page).data;
  });

  const components = [
    validator("created_at")(GaffComparator.dates((x) => x.created_at)),
    validator("updated_at")(GaffComparator.dates((x) => x.updated_at)),
    validator("title")(GaffComparator.strings((x) => x.title)),
    validator("writer")(GaffComparator.strings((x) => x.writer)),
  ];
  for (const comp of components) {
    await comp("+");
    await comp("-");
  }
};

const REPEAT = 25;
