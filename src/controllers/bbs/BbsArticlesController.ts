import core from "@nestia/core";
import { Controller, Request } from "@nestjs/common";
import { FastifyRequest } from "fastify";
import { tags } from "typia";

import { IBbsArticle } from "@samchon/bbs-api/lib/structures/bbs/IBbsArticle";
import { IPage } from "@samchon/bbs-api/lib/structures/common/IPage";

import { BbsArticleProvider } from "../../providers/bbs/BbsArticleProvider";

@Controller("bbs/articles")
export class BbsArticlesController {
  /**
   * List up all summarized articles.
   *
   * List up all summarized articles with pagination and searching options.
   *
   * @param input Request info of pagination and searching options.
   * @returns Paginated summarized articles.
   * @tag BBS
   * 
   * @author Samchon
   */
  @core.TypedRoute.Patch()
  public index(
    @core.TypedBody() input: IBbsArticle.IRequest,
  ): Promise<IPage<IBbsArticle.ISummary>> {
    return BbsArticleProvider.index(input);
  }

  /**
   * List up all abridged articles.
   *
   * List up all abridged articles with pagination and searching options.
   *
   * @param input Request info of pagination and searching options.
   * @returns Paginated abridged articles.
   * @tag BBS
   * 
   * @author Samchon
   */
  @core.TypedRoute.Patch("abridges")
  public abridges(
    @core.TypedBody() input: IBbsArticle.IRequest,
  ): Promise<IPage<IBbsArticle.IAbridge>> {
    return BbsArticleProvider.abridges(input);
  }

  /**
   * Read individual article.
   *
   * Reads an article with its every {@link IBbsArticle.ISnapshot snapshots}.
   *
   * @param id Target article's {@link IBbsArticle.id}
   * @returns Article information
   * @tag BBS
   * 
   * @author Samchon
   */
  @core.TypedRoute.Get(":id")
  public at(
    @core.TypedParam("id") id: string & tags.Format<"uuid">,
  ): Promise<IBbsArticle> {
    return BbsArticleProvider.at(id);
  }

  /**
   * Create a new article.
   *
   * Create a new article with its first {@link IBbsArticle.ISnapshot snapshot}.
   *
   * @param input Article information to create.
   * @returns Newly created article.
   * @tag BBS
   * 
   * @author Samchon
   */
  @core.TypedRoute.Post()
  public create(
    @Request() request: FastifyRequest,
    @core.TypedBody() input: IBbsArticle.ICreate,
  ): Promise<IBbsArticle> {
    return BbsArticleProvider.create(input, request.ip);
  }

  /**
   * Update an article.
   *
   * Accumulate a new {@link IBbsArticle.ISnapshot snapshot} record to the article.
   *
   * @param id Target article's {@link IBbsArticle.id}
   * @param input Article information to update.
   * @returns Newly accumulated snapshot information.
   * @tag BBS
   * 
   * @author Samchon
   */
  @core.TypedRoute.Put(":id")
  public update(
    @Request() request: FastifyRequest,
    @core.TypedParam("id") id: string & tags.Format<"uuid">,
    @core.TypedBody() input: IBbsArticle.IUpdate,
  ): Promise<IBbsArticle.ISnapshot> {
    return BbsArticleProvider.update(id)(input, request.ip);
  }

  /**
   * Erase an article.
   *
   * Performs soft deletion to the article.
   *
   * @param id Target article's {@link IBbsArticle.id}
   * @param input Password of the article.
   * @tag BBS
   * 
   * @author Samchon
   */
  @core.TypedRoute.Delete(":id")
  public erase(
    @core.TypedParam("id") id: string & tags.Format<"uuid">,
    @core.TypedBody() input: IBbsArticle.IErase,
  ): Promise<void> {
    return BbsArticleProvider.erase(id)(input);
  }
}
