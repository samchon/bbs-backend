import { Prisma } from "@prisma/client";
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
      Prisma.validator<Prisma.bbs_article_commentsFindManyArgs>()({
        include: {
          snapshots: BbsArticleCommentSnapshotProvider.json.select(),
        } as const,
      });
  }

  /* -----------------------------------------------------------
    READERS
  ----------------------------------------------------------- */
  export const index =
    (article: IEntity) =>
    async (
      input: IBbsArticleComment.IRequest,
    ): Promise<IPage<IBbsArticleComment>> => {
      await BbsGlobal.prisma.bbs_articles.findFirstOrThrow({
        where: {
          id: article.id,
          deleted_at: null,
        },
      });
      return PaginationUtil.paginate({
        schema: BbsGlobal.prisma.bbs_article_comments,
        payload: json.select(),
        transform: json.transform,
      })({
        where: {
          AND: [{ deleted_at: null }, ...search(input.search ?? {})],
        },
        orderBy: input.sort?.length
          ? PaginationUtil.orderBy(orderBy)(input.sort)
          : [{ created_at: "asc" }],
      })(input);
    };

  export const at =
    (article: IEntity) =>
    async (id: string): Promise<IBbsArticleComment> => {
      const record =
        await BbsGlobal.prisma.bbs_article_comments.findFirstOrThrow({
          where: {
            id,
            deleted_at: null,
            article: {
              id: article.id,
              deleted_at: null,
            },
          },
          ...json.select(),
        });
      return json.transform(record);
    };

  const search = (input: IBbsArticleComment.IRequest.ISearch | undefined) =>
    Prisma.validator<Prisma.bbs_article_commentsWhereInput["AND"]>()([
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
    ]);

  const orderBy = (
    key: IBbsArticleComment.IRequest.SortableColumns,
    value: "asc" | "desc",
  ) =>
    Prisma.validator<Prisma.bbs_article_commentsOrderByWithRelationInput>()(
      key === "writer"
        ? { writer: value }
        : {
            created_at: value,
          },
    );

  /* -----------------------------------------------------------
    WRITERS
  ----------------------------------------------------------- */
  export const create =
    (article: IEntity) =>
    async (
      input: IBbsArticleComment.ICreate,
      ip: string,
    ): Promise<IBbsArticleComment> => {
      await BbsGlobal.prisma.bbs_articles.findFirstOrThrow({
        where: {
          id: article.id,
          deleted_at: null,
        },
      });

      const snapshot = BbsArticleCommentSnapshotProvider.collect(input, ip);
      const record = await BbsGlobal.prisma.bbs_article_comments.create({
        data: {
          id: v4(),
          writer: input.writer,
          article: {
            connect: { id: article.id },
          },
          snapshots: {
            create: [snapshot],
          },
          created_at: new Date(),
          password: await BcryptUtil.hash(input.password),
        },
        ...json.select(),
      });
      return json.transform(record);
    };

  export const update =
    (article: IEntity) =>
    (id: string) =>
    async (
      input: IBbsArticleComment.IUpdate,
      ip: string,
    ): Promise<IBbsArticleComment.ISnapshot> => {
      const comment =
        await BbsGlobal.prisma.bbs_article_comments.findFirstOrThrow({
          where: {
            id,
            deleted_at: null,
            article: {
              id: article.id,
              deleted_at: null,
            },
          },
        });
      if (
        false ===
        (await BcryptUtil.equals({
          input: input.password,
          hashed: comment.password,
        }))
      )
        throw ErrorProvider.forbidden({
          accessor: "input.password",
          message: "Wrong password.",
        });
      return BbsArticleCommentSnapshotProvider.create(comment)(input, ip);
    };

  export const erase =
    (article: IEntity) =>
    (id: string) =>
    async (input: IBbsArticleComment.IErase): Promise<void> => {
      const record =
        await BbsGlobal.prisma.bbs_article_comments.findFirstOrThrow({
          where: {
            id,
            deleted_at: null,
            article: {
              id: article.id,
              deleted_at: null,
            },
          },
        });
      if (
        false ===
        (await BcryptUtil.equals({
          input: input.password,
          hashed: record.password,
        }))
      )
        throw ErrorProvider.forbidden({
          accessor: "input.password",
          message: "Wrong password.",
        });

      await BbsGlobal.prisma.bbs_article_comments.update({
        where: {
          id,
        },
        data: {
          deleted_at: new Date(),
        },
      });
    };
}
