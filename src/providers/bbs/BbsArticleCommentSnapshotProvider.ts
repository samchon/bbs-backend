import { Prisma } from "@prisma/sdk";
import { v4 } from "uuid";

import { IBbsArticleComment } from "@samchon/bbs-api/lib/structures/bbs/IBbsArticleComment";
import { IEntity } from "@samchon/bbs-api/lib/structures/common/IEntity";

import { BbsGlobal } from "../../BbsGlobal";
import { AttachmentFileProvider } from "../common/AttachmentFileProvider";

export namespace BbsArticleCommentSnapshotProvider {
  export namespace json {
    export const transform = (
      input: Prisma.bbs_article_comment_snapshotsGetPayload<
        ReturnType<typeof select>
      >,
    ): IBbsArticleComment.ISnapshot => ({
      id: input.id,
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
      }) satisfies Prisma.bbs_article_comment_snapshotsFindManyArgs;
  }

  export const create = async (props: {
    comment: IEntity;
    body: IBbsArticleComment.IUpdate;
    ip: string;
  }): Promise<IBbsArticleComment.ISnapshot> => {
    const snapshot =
      await BbsGlobal.prisma.bbs_article_comment_snapshots.create({
        data: {
          ...collect(props),
          comment: { connect: { id: props.comment.id } },
        },
        ...json.select(),
      });
    return json.transform(snapshot);
  };

  export const collect = (props: {
    body: IBbsArticleComment.IUpdate;
    ip: string;
  }) =>
    ({
      id: v4(),
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
    }) satisfies Prisma.bbs_article_comment_snapshotsCreateWithoutCommentInput;
}
