import { Prisma } from "@prisma/client";
import { v4 } from "uuid";

import { IBbsArticle } from "@samchon/bbs-api/lib/structures/bbs/IBbsArticle";
import { IEntity } from "@samchon/bbs-api/lib/structures/common/IEntity";

import { BbsGlobal } from "../../BbsGlobal";
import { AttachmentFileProvider } from "../common/AttachmentFileProvider";

export namespace BbsArticleSnapshotProvider {
  export namespace json {
    export const transform = (
      input: Prisma.bbs_article_snapshotsGetPayload<ReturnType<typeof select>>,
    ): IBbsArticle.ISnapshot => ({
      id: input.id,
      title: input.title,
      format: input.format as any,
      body: input.body,
      files: input.to_files
        .sort((a, b) => a.sequence - b.sequence)
        .map((p) => AttachmentFileProvider.json.transform(p.file)),
      created_at: input.created_at.toISOString(),
    });
    export const select = () =>
      ({
        include: {
          to_files: {
            include: {
              file: AttachmentFileProvider.json.select(),
            },
          },
        } as const,
      }) satisfies Prisma.bbs_article_snapshotsFindManyArgs;
  }

  export const create = async (props: {
    article: IEntity;
    body: IBbsArticle.IUpdate;
    ip: string;
  }): Promise<IBbsArticle.ISnapshot> => {
    const snapshot = await BbsGlobal.prisma.bbs_article_snapshots.create({
      data: {
        ...collect(props),
        article: { connect: { id: props.article.id } },
      },
      ...json.select(),
    });
    await BbsGlobal.prisma.mv_bbs_article_last_snapshots.update({
      where: {
        bbs_article_id: props.article.id,
      },
      data: {
        bbs_article_snapshot_id: snapshot.id,
      },
    });
    return json.transform(snapshot);
  };

  export const collect = (props: { body: IBbsArticle.IUpdate; ip: string }) =>
    ({
      id: v4(),
      title: props.body.title,
      format: props.body.format,
      body: props.body.body,
      ip: props.ip,
      created_at: new Date(),
      to_files: {
        create: props.body.files.map((file, i) => ({
          id: v4(),
          file: {
            create: AttachmentFileProvider.collect(file),
          },
          sequence: i,
        })),
      },
    }) satisfies Prisma.bbs_article_snapshotsCreateWithoutArticleInput;
}
