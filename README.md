# Backend of Bullet-in Board System
## 1. Outline
### 1.1. Introduction
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/samchon/bbs-backend/tree/master/LICENSE)
[![npm version](https://badge.fury.io/js/@samchon/bbs-api.svg)](https://www.npmjs.com/package/@samchon/bbs-api)
[![Build Status](https://github.com/samchon/bbs-backend/workflows/build/badge.svg)](https://github.com/samchon/bbs-backend/actions?query=workflow%3Abuild)

Example project for below stacks:

  - [NestJS](https://nestjs.com)
  - [Prisma](https://www.prisma.io)

Also, it guides how to utilize my helper libraries for above stacks:

  - [typia](https://github.com/samchon/typia)
  - [nestia](https://github.com/samchon/nestia)
  - [prisma-markdown](https://github.com/samchon/prisma-markdown)

### 1.2. NPM Scripts
List of the run commands defined in the [package.json](package.json) are like below:

  - Test
    - `test`: Start test program, it needs `build:test` or `dev` before
  - Build
    - `build`: Build everything of below SDK/Main/Test
    - `build:sdk`: Build SDK library in local, but not publish
    - `build:main`: Build the main program
    - `build:test`: Build the test automation program
  - Deploy
    - `package:api`: Build and publish the SDK library
    - `schema`: Reset the DB schema
    - `start`: Start the main program
  - Webpack
    - `webpack`: Build to a single JS file with Webpack
    - `webpack:prune`: Prune the `devDependencies` stably
    - `webpack:start`: Start the webpack built main program

### 1.3. Directory Structures
  - [.vscode/launch.json](.vscode/launch.json): Configuration for debugging
  - [packages/](packages/): Packages to publish as private npm modules
    - [packages/api/](packages/api): Client [SDK](#32-software-development-kit) library for the client developers
  - [**docs/**](docs/): Documents like ERD (Entity Relationship Diagram)
  - [src/](src/): TypeScript Source directory
    - [src/api/](src/api/): Client SDK that would be published to the `@samchon/bbs-api`
      - [**src/api/functional/**](src/api/functional/): API functions generated by the [`nestia`](https://github.com/samchon/nestia)
      - [**src/api/structures/**](src/api/structures/): DTO structures
    - [src/controllers/](src/controllers/): Controller classes of the Main Program
    - [src/providers/](src/providers/): Service providers (bridge between DB and controllers)
    - [src/executable/](src/executable/): Executable programs
    - [**src/schema.prisma**](src/schema.prisma): Prisma Schema File
  - [**test/**](test/): Test Automation Program
  - [.env](.env): Environment variables




## 2. Setup
### 2.1. NodeJS
https://nodejs.org/en/

Install NodeJS (+v20).

### 2.2. PostgreSQL
> ```bash
> bash postgres.sh
>```
>
> If you've installed Docker, then run the script above.

Otherwise, visit below PostgreSQL official site and install it manually.

https://www.enterprisedb.com/downloads/postgres-postgresql-downloads

After that, run the `npm run schema <root-account> <password>` command. 

Database schema for BBS backend system would be automatically constructed.

```bash
npm run schema postgres root
```

### 2.3. Repository
From now on, you can start the backend server development, right now. 

Just download this project through the git clone command and install dependencies by the npm install command. After those preparations, you can start the development by typing the `npm run dev` command.

```bash
# CLONE REPOSITORY
git clone https://github.com/samchon/bbs-backend
cd bbs-backend

# INSTALL DEPENDENCIES
npm install

# START DEVELOPMENT
npm run dev
```




## 3. Development
### 3.1. Definition
![ERD](https://camo.githubusercontent.com/c27066086a51d6ff1e3158231e1081fbe4b67f5ffc3fcdeb558b0d0ecbaa9c5f/68747470733a2f2f6769746875622d70726f64756374696f6e2d757365722d61737365742d3632313064662e73332e616d617a6f6e6177732e636f6d2f31333135383730392f3236383137353434312d38306361396338652d346339362d346465622d613863622d3637346539383435656266362e706e67)

If you want to add a new feature or update ordinary thing in the API level, you should write the code down to the matched *API controller*, who is stored in the [src/controllers](src/controllers) directory as the [Main Program](#34-main-program). 

However, **Wrtn** does not recommend to writing code down into the [Main Program](#34-main-program) first, without any consideration. Instead, **Wrtn** recommends to declare the definition first and implement the [Main Program](#34-main-program) later.

Therefore, if you want to add a new feature in the API level, define the matched data entity in the [src/models](src/models) and [src/api/structures](src/api/structures) directories. After the data entity definition, declare function header in the matched API controller class in the [src/controllers](src/controllers). Note that, it's only the declaration, header only, not meaning to implement the function body.

After those declarations, build the client [SDK](#32-software-development-kit) through the `npm run build:api` command and implement the [Test Automation Program](#33-test-automation-program) using the [SDK](#32-software-development-kit) with use case scenarios. Development of the [Main Program](#34-main-program) should be started after those preparations are all being ready. Of course, the [Main Program](#34-main-program) can be verified with the pre-developed [Test Automation Program](#33-test-automation-program) in everytime.

  - Declare data entity (`prisma` schema file)
  - Design API function types, without main program implementation
  - Build the client [SDK](32-sdk)
  - Implement the [Test Automation Program](#33-test-automation-program)
  - Develop the [Main Program](#34-main-program)
  - Validate the [Main Program](#34-main-program) through the [Test Automation Program](#33-test-automation-program)
  - Deploy to the Dev and Real servers.

### 3.2. Software Development Kit
[`@wrtn/hub-backend`](https://gitlab.wrtn.club/wrtn/hub-backend) provides SDK (Software Development Kit) for convenience.

For the client developers who are connecting to this backend server, [`@wrtn/hub-backend`](https://gitlab.wrtn.club/wrtn/hub-backend) provides not API documents like the Swagger, but provides the API interaction library, one of the typical SDK (Software Development Kit) for the convenience.

With the SDK, client developers never need to re-define the duplicated API interfaces, by reading Swagger Documents. Just utilize the provided interfaces and asynchronous functions defined in the SDK. It would be much convenient than any other Rest API solutions.

To build the SDK in local, just type the `npm run build:sdk` command. The SDK would be generated by [`nestia`](https://github.com/samchon/nestia), by analyzing source code of the [controller](src/controllers) classes in the compilation level, automatically. Otherwise you want to publish the SDK .ibrary, run the `npm run package:api` command instead.

```bash
# BUILD SDK IN LOCAL
npm run build:sdk

# BUILD SDK AND PUBLISH IT TO THE NPM
npm run package:api
```

When the SDK has been published, client programmers can interact with this backend server very easily. Just let them to install the SDK and call the SDK functions with the `await` symbol like below.

![nestia-sdk-demo](https://user-images.githubusercontent.com/13158709/215004990-368c589d-7101-404e-b81b-fbc936382f05.gif)

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
    title: RandomGenerator.paragraph()(),
    body: RandomGenerator.content()()(),
    format: "md",
    files: ArrayUtil.repeat(randint(0, 3))(() => prepare_random_file()),
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

### 3.3. Test Automation Program
> TDD (Test Driven Development) with SDK

After the [Definition](#31-definition) and client [SDK](#32-software-development-kit) generation, you've to design the use-case scenario and implement a test automation program who represents the use-case scenario and guarantees the [Main Program](#34-main-program).

To add a new test function in the Test Automation Program, create a new TS file under the [test/features](test/features) directory following the below category and implement the test scenario function with representative function name and `export` symbol. I think many all of the ordinary files wrote in the [test/features](test/features) directory would be good sample for you. Therefore, I will not describe how the make the test function detaily.

Anyway, you've to remind that, the Test Automation Program resets the DB schema whenever being run. Therefore, you've to be careful if import data has been stored in the local (or dev) DB server. To avoid the resetting the DB, configure the `skipReset` option like below.

Also, the Test Automation Program runs all of the test functions placed into the [test/features](test/features) directory. However, those full testing may consume too much time. Therefore, if you want to reduce the testing time by specializing some test functions, use the `include` option like below.

  - `include`: test only restricted functions who is containing the special keyword.
  - `exclude`: exclude some functions who is containing the special keyword.
  - `reset`: do not reset the DB

```bash
# test without db reset
npm run test -- --reset false

# include or exclude some features
npm run test -- --include comment
npm run test -- --include create update erase
npm run test -- --include index create update issue --exclude comment sort
```

### 3.4. Main Program
After [Definition](#31-definition), client [SDK](#32-software-development-kit) building and [Test Automation Program](#33-test-automation-program) are all prepared, finally you can develop the Main Program. Also, when you've completed the Main Program implementation, it would better to validate the implementation through the pre-built [SDK](#32-software-development-kit) and [Test Automation Program](#33-test-automation-program).

However, do not commit a mistake that writing source codes only in the [controller](src/controllers) classes. The API Controller must have a role that only intermediation. The main source code should be write down separately following the directory categorizing. For example, source code about DB I/O should be written into the [src/providers](src/providers) directory.



