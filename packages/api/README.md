# SDK for Client Developers
## Outline
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/samchon/bbs-backend/tree/master/LICENSE)
[![npm version](https://img.shields.io/npm/v/@samchon/bbs-api.svg)](https://www.npmjs.com/package/@samchon/bbs-api)
[![Build Status](https://github.com/samchon/bbs-backend/workflows/build/badge.svg)](https://github.com/samchon/bbs-backend/actions?query=workflow%3Abuild)
[![Guide Documents](https://img.shields.io/badge/guide-documents-forestgreen)](https://nestia.io/docs/)

[`@samchon/bbs-backend`](https://github.com/samchon/bbs-backend) provides SDK (Software Development Kit) for convenience.

For the client developers who are connecting to this backend server, [`@samchon/bbs-backend`](https://github.com/samchon/bbs-backend) provides not API documents like the Swagger, but provides the API interaction library, one of the typical SDK (Software Development Kit) for the convenience.

With the SDK, client developers never need to re-define the duplicated API interfaces. Just utilize the provided interfaces and asynchronous functions defined in the SDK. It would be much convenient than any other Rest API solutions.

```bash
npm install --save @samchon/bbs-api
```




## Usage
Import the `@samchon/bbs-api` and enjoy the auto-completion.

```typescript
import { ArrayUtil, RandomGenerator, TestValidator } from "@nestia/e2e";
import { randint } from "tstl";
import typia from "typia";

import api from "@samchon/bbs-api/lib/index";
import { IBbsArticle } from "@samchon/bbs-api/lib/structures/bbs/IBbsArticle";

import { prepare_random_file } from "./internal/prepare_random_file";

export const test_api_bbs_article_create = async (
  connection: api.IConnection,
): Promise<void> => {
  // PREPARE INPUT DATA
  const input: IBbsArticle.ICreate = {
    writer: RandomGenerator.name(),
    password: RandomGenerator.alphaNumeric(8),
    title: RandomGenerator.paragraph(),
    body: RandomGenerator.content(),
    format: "md",
    files: ArrayUtil.repeat(randint(0, 3), () => prepare_random_file()),
  };

  // DO CREATE
  const article: IBbsArticle = await api.functional.bbs.articles.create(
    connection,
    input,
  );
  typia.assertEquals(article);

  // VALIDATE WHETHER EXACT DATA IS INSERTED
  TestValidator.equals("create")({
    snapshots: [
      {
        format: input.format,
        title: input.title,
        body: input.body,
        files: input.files,
      },
    ],
    writer: input.writer,
  })(article);

  // COMPARE WITH READ DATA
  const read: IBbsArticle = await api.functional.bbs.articles.at(
    connection,
    article.id,
  );
  typia.assertEquals(read);
  TestValidator.equals("read")(read)(article);
};
```