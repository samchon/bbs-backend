import core from "@nestia/core";
import { Controller, Request } from "@nestjs/common";
import { FastifyRequest } from "fastify";
import { tags } from "typia";

import { IBbsArticleComment } from "@samchon/bbs-api/lib/structures/bbs/IBbsArticleComment";
import { IPage } from "@samchon/bbs-api/lib/structures/common/IPage";

import { BbsArticleCommentProvider } from "../../providers/bbs/BbsArticleCommentProvider";

@Controller("bbs/articles/:articleId/comments")
export class BbsArticleCommentsController {
  /**
   * List up all summarized comments.
   *
   * List up all summarized comments with pagination and searching options.
   *
   * @param input Request info of pagination and searching options.
   * @returns Paginated summarized comments.
   * @author Samchon
   */
  @core.TypedRoute.Patch()
  public index(
    @core.TypedParam("articleId") articleId: string & tags.Format<"uuid">,
    @core.TypedBody() input: IBbsArticleComment.IRequest,
  ): Promise<IPage<IBbsArticleComment>> {
    return BbsArticleCommentProvider.index({ id: articleId })(input);
  }

  /**
   * Read individual comment.
   *
   * Reads a comment with its every {@link IBbsArticleComment.ISnapshot snapshots}.
   *
   * @param articleId Belonged article's {@link IBbsArticle.id}
   * @param id Target comment's {@link IBbsArticleComment.id}
   * @returns Comment information
   * @author Samchon
   */
  @core.TypedRoute.Get(":id")
  public at(
    @core.TypedParam("articleId") articleId: string & tags.Format<"uuid">,
    @core.TypedParam("id") id: string & tags.Format<"uuid">,
  ): Promise<IBbsArticleComment> {
    return BbsArticleCommentProvider.at({ id: articleId })(id);
  }

  /**
   * Create a new comment.
   *
   * Create a new comment with its first {@link IBbsArticleComment.ISnapshot snapshot}.
   *
   * @param articleId Belonged article's {@link IBbsArticle.id}
   * @param input Comment information to create.
   * @returns Newly created comment.
   * @author Samchon
   */
  @core.TypedRoute.Post()
  public create(
    @Request() request: FastifyRequest,
    @core.TypedParam("articleId") articleId: string & tags.Format<"uuid">,
    @core.TypedBody() input: IBbsArticleComment.ICreate,
  ): Promise<IBbsArticleComment> {
    return BbsArticleCommentProvider.create({ id: articleId })(
      input,
      request.ip,
    );
  }

  /**
   * Update a comment.
   *
   * Accumulate a new {@link IBbsArticleComment.ISnapshot snapshot} record to the comment.
   *
   * @param articleId Belonged article's {@link IBbsArticle.id}
   * @param id Target comment's {@link IBbsArticleComment.id}
   * @param input Comment information to update.
   * @returns Newly accumulated snapshot information.
   * @author Samchon
   */
  @core.TypedRoute.Put(":id")
  public update(
    @Request() request: FastifyRequest,
    @core.TypedParam("articleId") articleId: string & tags.Format<"uuid">,
    @core.TypedParam("id") id: string & tags.Format<"uuid">,
    @core.TypedBody() input: IBbsArticleComment.IUpdate,
  ): Promise<IBbsArticleComment.ISnapshot> {
    return BbsArticleCommentProvider.update({ id: articleId })(id)(
      input,
      request.ip,
    );
  }

  /**
   * Erase a comment.
   *
   * Performs soft deletion to the comment.
   *
   * @param articleId Belonged article's {@link IBbsArticle.id}
   * @param id Target comment's {@link IBbsArticleComment.id}
   * @param input Password of the comment.
   * @author Samchon
   */
  @core.TypedRoute.Delete(":id")
  public erase(
    @core.TypedParam("articleId") articleId: string & tags.Format<"uuid">,
    @core.TypedParam("id") id: string & tags.Format<"uuid">,
    @core.TypedBody() input: IBbsArticleComment.IErase,
  ): Promise<void> {
    return BbsArticleCommentProvider.erase({ id: articleId })(id)(input);
  }
}
