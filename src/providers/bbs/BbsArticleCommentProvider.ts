import { Prisma } from "@prisma/sdk";
import { v4 } from "uuid";

import { IBbsArticleComment } from "@samchon/bbs-api/lib/structures/bbs/IBbsArticleComment";
import { IEntity } from "@samchon/bbs-api/lib/structures/common/IEntity";
import { IPage } from "@samchon/bbs-api/lib/structures/common/IPage";

import { BbsGlobal } from "../../BbsGlobal";
import { BcryptUtil } from "../../utils/BcryptUtil";
import { PaginationUtil } from "../../utils/PaginationUtil";
import { BbsArticleCommentSnapshotProvider } from "./BbsArticleCommentSnapshotProvider";
import { ErrorProvider } from "./ErrorProvider";

export namespace BbsArticleCommentProvider {
  /* -----------------------------------------------------------
    TRANSFORMERS
  ----------------------------------------------------------- */
  export namespace json {
    export const transform = (
      input: Prisma.bbs_article_commentsGetPayload<ReturnType<typeof select>>,
    ): IBbsArticleComment => ({
      id: input.id,
      parent_id: input.parent_id,
      writer: input.writer,
      snapshots: input.snapshots
        .sort((a, b) => a.created_at.getTime() - b.created_at.getTime())
        .map(BbsArticleCommentSnapshotProvider.json.transform),
      created_at: input.created_at.toISOString(),
    });
    export const select = () =>
      ({
        include: {
          snapshots: BbsArticleCommentSnapshotProvider.json.select(),
        } as const,
      }) satisfies Prisma.bbs_article_commentsFindManyArgs;
  }

  /* -----------------------------------------------------------
    READERS
  ----------------------------------------------------------- */
  export const index = async (props: {
    article: IEntity;
    body: IBbsArticleComment.IRequest;
  }): Promise<IPage<IBbsArticleComment>> => {
    await BbsGlobal.prisma.bbs_articles.findFirstOrThrow({
      where: {
        id: props.article.id,
        deleted_at: null,
      },
    });
    return PaginationUtil.paginate({
      schema: BbsGlobal.prisma.bbs_article_comments,
      payload: json.select(),
      transform: json.transform,
    })({
      where: {
        AND: [{ deleted_at: null }, ...search(props.body.search ?? {})],
      },
      orderBy: props.body.sort?.length
        ? PaginationUtil.orderBy(orderBy)(props.body.sort)
        : [{ created_at: "asc" }],
    })(props.body);
  };

  export const at = async (props: {
    article: IEntity;
    id: string;
  }): Promise<IBbsArticleComment> => {
    const record = await BbsGlobal.prisma.bbs_article_comments.findFirstOrThrow(
      {
        where: {
          id: props.id,
          deleted_at: null,
          article: {
            id: props.article.id,
            deleted_at: null,
          },
        },
        ...json.select(),
      },
    );
    return json.transform(record);
  };

  const search = (input: IBbsArticleComment.IRequest.ISearch | undefined) =>
    [
      ...(input?.writer?.length
        ? [
            {
              writer: {
                contains: input.writer,
              },
            },
          ]
        : []),
      ...(input?.body?.length
        ? [
            {
              snapshots: {
                some: {
                  body: {
                    contains: input.body,
                  },
                },
              },
            },
          ]
        : []),
    ] satisfies Prisma.bbs_article_commentsWhereInput["AND"];

  const orderBy = (
    key: IBbsArticleComment.IRequest.SortableColumns,
    value: "asc" | "desc",
  ) =>
    (key === "writer"
      ? { writer: value }
      : {
          created_at: value,
        }) satisfies Prisma.bbs_article_commentsOrderByWithRelationInput;

  /* -----------------------------------------------------------
    WRITERS
  ----------------------------------------------------------- */
  export const create = async (props: {
    article: IEntity;
    body: IBbsArticleComment.ICreate;
    ip: string;
  }): Promise<IBbsArticleComment> => {
    await BbsGlobal.prisma.bbs_articles.findFirstOrThrow({
      where: {
        id: props.article.id,
        deleted_at: null,
      },
    });

    const snapshot = BbsArticleCommentSnapshotProvider.collect(props);
    const record = await BbsGlobal.prisma.bbs_article_comments.create({
      data: {
        id: v4(),
        writer: props.body.writer,
        article: {
          connect: {
            id: props.article.id,
          },
        },
        snapshots: {
          create: [snapshot],
        },
        created_at: new Date(),
        password: await BcryptUtil.hash(props.body.password),
      },
      ...json.select(),
    });
    return json.transform(record);
  };

  export const update = async (props: {
    article: IEntity;
    id: string;
    body: IBbsArticleComment.IUpdate;
    ip: string;
  }): Promise<IBbsArticleComment.ISnapshot> => {
    const comment =
      await BbsGlobal.prisma.bbs_article_comments.findFirstOrThrow({
        where: {
          id: props.id,
          deleted_at: null,
          article: {
            id: props.article.id,
            deleted_at: null,
          },
        },
      });
    if (
      false ===
      (await BcryptUtil.equals({
        input: props.body.password,
        hashed: comment.password,
      }))
    )
      throw ErrorProvider.forbidden({
        accessor: "input.password",
        message: "Wrong password.",
      });
    return BbsArticleCommentSnapshotProvider.create({
      comment: { id: comment.id },
      body: props.body,
      ip: props.ip,
    });
  };

  export const erase = async (props: {
    article: IEntity;
    id: string;
    body: IBbsArticleComment.IErase;
  }): Promise<void> => {
    const record = await BbsGlobal.prisma.bbs_article_comments.findFirstOrThrow(
      {
        where: {
          id: props.id,
          deleted_at: null,
          article: {
            id: props.article.id,
            deleted_at: null,
          },
        },
      },
    );
    if (
      false ===
      (await BcryptUtil.equals({
        input: props.body.password,
        hashed: record.password,
      }))
    )
      throw ErrorProvider.forbidden({
        accessor: "input.password",
        message: "Wrong password.",
      });

    await BbsGlobal.prisma.bbs_article_comments.update({
      where: {
        id: props.id,
      },
      data: {
        deleted_at: new Date(),
      },
    });
  };
}
