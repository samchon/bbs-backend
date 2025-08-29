import { ArrayUtil, GaffComparator, TestValidator } from "@nestia/e2e";

import BbsApi from "@samchon/bbs-api/lib/index";
import { IBbsArticle } from "@samchon/bbs-api/lib/structures/bbs/IBbsArticle";
import { IBbsArticleComment } from "@samchon/bbs-api/lib/structures/bbs/IBbsArticleComment";
import { IPage } from "@samchon/bbs-api/lib/structures/common/IPage";

import { generate_random_article } from "./internal/generate_random_article";
import { generate_random_comment } from "./internal/generate_random_comment";

export const test_api_bbs_article_comment_index_sort = async (
  connection: BbsApi.IConnection,
): Promise<void> => {
  const article: IBbsArticle = await generate_random_article(connection);

  await ArrayUtil.asyncRepeat(REPEAT, () =>
    generate_random_comment(connection, article),
  );

  const validator = TestValidator.sort<
    IBbsArticleComment,
    IBbsArticleComment.IRequest.SortableColumns,
    IPage.Sort<IBbsArticleComment.IRequest.SortableColumns>
  >(
    "questions.index",
    async (input: IPage.Sort<IBbsArticleComment.IRequest.SortableColumns>) => {
      const page: IPage<IBbsArticleComment> =
        await BbsApi.functional.bbs.articles.comments.index(connection, {
          articleId: article.id,
          body: {
            limit: REPEAT,
            sort: input,
          },
        });
      return page.data;
    },
  );

  const components = [
    validator("created_at")(GaffComparator.dates((x) => x.created_at)),
    validator("writer")(GaffComparator.strings((x) => x.writer)),
  ];
  for (const comp of components) {
    await comp("+");
    await comp("-");
  }
};

const REPEAT = 25;
