import { Prisma } from "@prisma/client";
import { v4 } from "uuid";

import { IBbsArticle } from "@samchon/bbs-api/lib/structures/bbs/IBbsArticle";
import { IPage } from "@samchon/bbs-api/lib/structures/common/IPage";

import { BbsGlobal } from "../../BbsGlobal";
import { BcryptUtil } from "../../utils/BcryptUtil";
import { PaginationUtil } from "../../utils/PaginationUtil";
import { AttachmentFileProvider } from "../common/AttachmentFileProvider";
import { BbsArticleSnapshotProvider } from "./BbsArticleSnapshotProvider";
import { ErrorProvider } from "./ErrorProvider";

export namespace BbsArticleProvider {
  /* -----------------------------------------------------------
    TRANSFORMERS
  ----------------------------------------------------------- */
  export namespace json {
    export const transform = (
      input: Prisma.bbs_articlesGetPayload<ReturnType<typeof select>>,
    ): IBbsArticle => ({
      id: input.id,
      writer: input.writer,
      snapshots: input.snapshots
        .sort((a, b) => a.created_at.getTime() - b.created_at.getTime())
        .map(BbsArticleSnapshotProvider.json.transform),
      created_at: input.created_at.toISOString(),
    });

    export const select = () =>
      ({
        include: {
          snapshots: BbsArticleSnapshotProvider.json.select(),
        } as const,
      }) satisfies Prisma.bbs_articlesFindManyArgs;
  }

  export namespace abridge {
    export const transform = (
      input: Prisma.bbs_articlesGetPayload<ReturnType<typeof select>>,
    ): IBbsArticle.IAbridge => ({
      id: input.id,
      writer: input.writer,
      title: input.mv_last!.snapshot.title,
      body: input.mv_last!.snapshot.body,
      format: input.mv_last!.snapshot.format as IBbsArticle.Format,
      created_at: input.created_at.toISOString(),
      updated_at: input.mv_last!.snapshot.created_at.toISOString(),
      files: input.mv_last!.snapshot.to_files.map((p) =>
        AttachmentFileProvider.json.transform(p.file),
      ),
    });
    export const select = () =>
      ({
        include: {
          mv_last: {
            include: {
              snapshot: {
                include: {
                  to_files: {
                    include: {
                      file: AttachmentFileProvider.json.select(),
                    },
                  },
                },
              },
            },
          },
        } as const,
      }) satisfies Prisma.bbs_articlesFindManyArgs;
  }

  export namespace summarize {
    export const transform = (
      input: Prisma.bbs_articlesGetPayload<ReturnType<typeof select>>,
    ): IBbsArticle.ISummary => ({
      id: input.id,
      writer: input.writer,
      title: input.mv_last!.snapshot.title,
      created_at: input.created_at.toISOString(),
      updated_at: input.mv_last!.snapshot.created_at.toISOString(),
    });
    export const select = () =>
      ({
        include: {
          mv_last: {
            include: {
              snapshot: {
                select: {
                  title: true,
                  created_at: true,
                },
              },
            },
          },
        } as const,
      }) satisfies Prisma.bbs_articlesFindManyArgs;
  }

  /* -----------------------------------------------------------
    READERS
  ----------------------------------------------------------- */
  export const index = (
    input: IBbsArticle.IRequest,
  ): Promise<IPage<IBbsArticle.ISummary>> =>
    PaginationUtil.paginate({
      schema: BbsGlobal.prisma.bbs_articles,
      payload: summarize.select(),
      transform: summarize.transform,
    })({
      where: {
        AND: [{ deleted_at: null }, ...search(input.search ?? {})],
      },
      orderBy: input.sort?.length
        ? PaginationUtil.orderBy(orderBy)(input.sort)
        : [{ created_at: "desc" }],
    })(input);

  export const abridges = (
    input: IBbsArticle.IRequest,
  ): Promise<IPage<IBbsArticle.IAbridge>> =>
    PaginationUtil.paginate({
      schema: BbsGlobal.prisma.bbs_articles,
      payload: abridge.select(),
      transform: abridge.transform,
    })({
      where: {
        AND: [{ deleted_at: null }, ...search(input.search ?? {})],
      },
      orderBy: input.sort?.length
        ? PaginationUtil.orderBy(orderBy)(input.sort)
        : [{ created_at: "desc" }],
    })(input);

  export const at = async (id: string): Promise<IBbsArticle> => {
    const record = await BbsGlobal.prisma.bbs_articles.findFirstOrThrow({
      where: {
        id,
        deleted_at: null,
      },
      ...json.select(),
    });
    return json.transform(record);
  };

  const search = (input: IBbsArticle.IRequest.ISearch | undefined) =>
    [
      ...(input?.writer?.length
        ? [{ writer: { contains: input.writer } }]
        : []),
      ...(input?.title?.length
        ? [
            {
              mv_last: {
                snapshot: {
                  title: { contains: input.title },
                },
              },
            },
          ]
        : []),
      ...(input?.body?.length
        ? [
            {
              mv_last: {
                snapshot: {
                  body: {
                    contains: input.body,
                  },
                },
              },
            },
          ]
        : []),
      ...(input?.title_or_body?.length
        ? [
            {
              OR: [
                {
                  mv_last: {
                    snapshot: {
                      title: {
                        contains: input.title_or_body,
                      },
                    },
                  },
                },
                {
                  mv_last: {
                    snapshot: {
                      body: {
                        contains: input.title_or_body,
                      },
                    },
                  },
                },
              ],
            },
          ]
        : []),
      ...(input?.from?.length
        ? [
            {
              created_at: {
                gte: new Date(input.from),
              },
            },
          ]
        : []),
      ...(input?.to?.length
        ? [
            {
              created_at: {
                lte: new Date(input.to),
              },
            },
          ]
        : []),
    ] satisfies Prisma.bbs_articlesWhereInput["AND"];

  const orderBy = (
    key: IBbsArticle.IRequest.SortableColumns,
    value: "asc" | "desc",
  ) =>
    (key === "writer"
      ? { writer: value }
      : key === "title"
        ? { mv_last: { snapshot: { title: value } } }
        : key === "created_at"
          ? { created_at: value }
          : // updated_at
            {
              mv_last: { snapshot: { created_at: value } },
            }) satisfies Prisma.bbs_articlesOrderByWithRelationInput;

  /* -----------------------------------------------------------
    WRITERS
  ----------------------------------------------------------- */
  export const create = async (props: {
    body: IBbsArticle.ICreate;
    ip: string;
  }): Promise<IBbsArticle> => {
    const snapshot = BbsArticleSnapshotProvider.collect(props);
    const record = await BbsGlobal.prisma.bbs_articles.create({
      data: {
        id: v4(),
        writer: props.body.writer,
        created_at: new Date(),
        password: await BcryptUtil.hash(props.body.password),
        snapshots: {
          create: [snapshot],
        },
        mv_last: {
          create: {
            bbs_article_snapshot_id: snapshot.id,
          },
        },
      },
      ...json.select(),
    });
    return json.transform(record);
  };

  export const update = async (props: {
    id: string;
    body: IBbsArticle.IUpdate;
    ip: string;
  }): Promise<IBbsArticle.ISnapshot> => {
    const record = await BbsGlobal.prisma.bbs_articles.findFirstOrThrow({
      where: {
        id: props.id,
        deleted_at: null,
      },
      ...json.select(),
    });
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
    return BbsArticleSnapshotProvider.create({
      article: { id: record.id },
      body: props.body,
      ip: props.ip,
    });
  };

  export const erase = async (props: {
    id: string;
    body: IBbsArticle.IErase;
  }): Promise<void> => {
    const record = await BbsGlobal.prisma.bbs_articles.findFirstOrThrow({
      where: {
        id: props.id,
        deleted_at: null,
      },
    });
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
    await BbsGlobal.prisma.bbs_articles.update({
      where: { id: props.id },
      data: {
        deleted_at: new Date(),
      },
    });
  };
}
