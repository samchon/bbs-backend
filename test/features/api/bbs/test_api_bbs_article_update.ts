import { ArrayUtil, RandomGenerator, TestValidator } from "@nestia/e2e";
import typia from "typia";

import api from "@samchon/bbs-api/lib/index";
import { IBbsArticle } from "@samchon/bbs-api/lib/structures/bbs/IBbsArticle";

import { generate_random_article } from "./internal/generate_random_article";
import { prepare_random_article } from "./internal/prepare_random_article";

export const test_api_bbs_article_update = async (
  connection: api.IConnection,
): Promise<void> => {
  const password: string = RandomGenerator.alphaNumeric(8);
  const article: IBbsArticle = await generate_random_article(
    connection,
    password,
  );

  const inputs: IBbsArticle.IUpdate[] = ArrayUtil.repeat(4)(() =>
    prepare_random_article(password),
  );
  for (const i of inputs) {
    const snapshot: IBbsArticle.ISnapshot =
      await api.functional.bbs.articles.update(connection, article.id, i);
    article.snapshots.push(typia.assertEquals(snapshot));
    TestValidator.equals("snapshot")({
      format: i.format,
      title: i.title,
      body: i.body,
      files: i.files,
    })(snapshot);
  }

  const read: IBbsArticle = await api.functional.bbs.articles.at(
    connection,
    article.id,
  );
  typia.assertEquals(read);
  TestValidator.equals("read")(read)(article);
};
