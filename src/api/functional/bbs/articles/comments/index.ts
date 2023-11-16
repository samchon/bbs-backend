/**
 * @packageDocumentation
 * @module api.functional.bbs.articles.comments
 * @nestia Generated by Nestia - https://github.com/samchon/nestia 
 */
//================================================================
import type { IConnection, Primitive } from "@nestia/fetcher";
import { PlainFetcher } from "@nestia/fetcher/lib/PlainFetcher";
import typia from "typia";
import type { Format } from "typia/lib/tags/Format";

import type { IBbsArticleComment } from "../../../../structures/bbs/IBbsArticleComment";
import type { IPage } from "../../../../structures/common/IPage";
import { NestiaSimulator } from "../../../../utils/NestiaSimulator";

/**
 * List up all summarized comments.
 * 
 * List up all summarized comments with pagination and searching options.
 * 
 * @param input Request info of pagination and searching options.
 * @returns Paginated summarized comments.
 * @author Samchon
 * 
 * @controller BbsArticleCommentsController.index
 * @path PATCH /bbs/articles/:articleId/comments
 * @nestia Generated by Nestia - https://github.com/samchon/nestia
 */
export async function index(
    connection: IConnection,
    articleId: string & Format<"uuid">,
    input: index.Input,
): Promise<index.Output> {
    return !!connection.simulate
        ? index.simulate(
              connection,
              articleId,
              input,
          )
        : PlainFetcher.fetch(
              {
                  ...connection,
                  headers: {
                      ...(connection.headers ?? {}),
                      "Content-Type": "application/json",
                  },
              },
              {
                  ...index.METADATA,
                  path: index.path(articleId),
              } as const,
              input,
          );
}
export namespace index {
    export type Input = Primitive<IBbsArticleComment.IRequest>;
    export type Output = Primitive<IPage<IBbsArticleComment>>;

    export const METADATA = {
        method: "PATCH",
        path: "/bbs/articles/:articleId/comments",
        request: {
            type: "application/json",
            encrypted: false
        },
        response: {
            type: "application/json",
            encrypted: false,
        },
        status: null,
    } as const;

    export const path = (articleId: string & Format<"uuid">): string => {
        return `/bbs/articles/${encodeURIComponent(articleId ?? "null")}/comments`;
    }
    export const random = (g?: Partial<typia.IRandomGenerator>): Primitive<IPage<IBbsArticleComment>> =>
        typia.random<Primitive<IPage<IBbsArticleComment>>>(g);
    export const simulate = async (
        connection: IConnection,
        articleId: string & Format<"uuid">,
        input: index.Input,
    ): Promise<Output> => {
        const assert = NestiaSimulator.assert({
            method: METADATA.method,
            host: connection.host,
            path: path(articleId),
            contentType: "application/json",
        });
        assert.param("articleId")(() => typia.assert(articleId));
        assert.body(() => typia.assert(input));
        return random(
            typeof connection.simulate === 'object' &&
                connection.simulate !== null
                ? connection.simulate
                : undefined
        );
    }
}

/**
 * Read individual comment.
 * 
 * Reads a comment with its every {@link IBbsArticleComment.ISnapshot snapshots}.
 * 
 * @param articleId Belonged article's {@link IBbsArticle.id }
 * @param id Target comment's {@link IBbsArticleComment.id}
 * @returns Comment information
 * @author Samchon
 * 
 * @controller BbsArticleCommentsController.at
 * @path GET /bbs/articles/:articleId/comments/:id
 * @nestia Generated by Nestia - https://github.com/samchon/nestia
 */
export async function at(
    connection: IConnection,
    articleId: string & Format<"uuid">,
    id: string & Format<"uuid">,
): Promise<at.Output> {
    return !!connection.simulate
        ? at.simulate(
              connection,
              articleId,
              id,
          )
        : PlainFetcher.fetch(
              connection,
              {
                  ...at.METADATA,
                  path: at.path(articleId, id),
              } as const,
          );
}
export namespace at {
    export type Output = Primitive<IBbsArticleComment>;

    export const METADATA = {
        method: "GET",
        path: "/bbs/articles/:articleId/comments/:id",
        request: null,
        response: {
            type: "application/json",
            encrypted: false,
        },
        status: null,
    } as const;

    export const path = (articleId: string & Format<"uuid">, id: string & Format<"uuid">): string => {
        return `/bbs/articles/${encodeURIComponent(articleId ?? "null")}/comments/${encodeURIComponent(id ?? "null")}`;
    }
    export const random = (g?: Partial<typia.IRandomGenerator>): Primitive<IBbsArticleComment> =>
        typia.random<Primitive<IBbsArticleComment>>(g);
    export const simulate = async (
        connection: IConnection,
        articleId: string & Format<"uuid">,
        id: string & Format<"uuid">,
    ): Promise<Output> => {
        const assert = NestiaSimulator.assert({
            method: METADATA.method,
            host: connection.host,
            path: path(articleId, id),
            contentType: "application/json",
        });
        assert.param("articleId")(() => typia.assert(articleId));
        assert.param("id")(() => typia.assert(id));
        return random(
            typeof connection.simulate === 'object' &&
                connection.simulate !== null
                ? connection.simulate
                : undefined
        );
    }
}

/**
 * Create a new comment.
 * 
 * Create a new comment with its first {@link IBbsArticleComment.ISnapshot snapshot}.
 * 
 * @param articleId Belonged article's {@link IBbsArticle.id }
 * @param input Comment information to create.
 * @returns Newly created comment.
 * @author Samchon
 * 
 * @controller BbsArticleCommentsController.create
 * @path POST /bbs/articles/:articleId/comments
 * @nestia Generated by Nestia - https://github.com/samchon/nestia
 */
export async function create(
    connection: IConnection,
    articleId: string & Format<"uuid">,
    input: create.Input,
): Promise<create.Output> {
    return !!connection.simulate
        ? create.simulate(
              connection,
              articleId,
              input,
          )
        : PlainFetcher.fetch(
              {
                  ...connection,
                  headers: {
                      ...(connection.headers ?? {}),
                      "Content-Type": "application/json",
                  },
              },
              {
                  ...create.METADATA,
                  path: create.path(articleId),
              } as const,
              input,
          );
}
export namespace create {
    export type Input = Primitive<IBbsArticleComment.ICreate>;
    export type Output = Primitive<IBbsArticleComment>;

    export const METADATA = {
        method: "POST",
        path: "/bbs/articles/:articleId/comments",
        request: {
            type: "application/json",
            encrypted: false
        },
        response: {
            type: "application/json",
            encrypted: false,
        },
        status: null,
    } as const;

    export const path = (articleId: string & Format<"uuid">): string => {
        return `/bbs/articles/${encodeURIComponent(articleId ?? "null")}/comments`;
    }
    export const random = (g?: Partial<typia.IRandomGenerator>): Primitive<IBbsArticleComment> =>
        typia.random<Primitive<IBbsArticleComment>>(g);
    export const simulate = async (
        connection: IConnection,
        articleId: string & Format<"uuid">,
        input: create.Input,
    ): Promise<Output> => {
        const assert = NestiaSimulator.assert({
            method: METADATA.method,
            host: connection.host,
            path: path(articleId),
            contentType: "application/json",
        });
        assert.param("articleId")(() => typia.assert(articleId));
        assert.body(() => typia.assert(input));
        return random(
            typeof connection.simulate === 'object' &&
                connection.simulate !== null
                ? connection.simulate
                : undefined
        );
    }
}

/**
 * Update a comment.
 * 
 * Accumulate a new {@link IBbsArticleComment.ISnapshot snapshot} record to the comment.
 * 
 * @param articleId Belonged article's {@link IBbsArticle.id }
 * @param id Target comment's {@link IBbsArticleComment.id}
 * @param input Comment information to update.
 * @returns Newly accumulated snapshot information.
 * @author Samchon
 * 
 * @controller BbsArticleCommentsController.update
 * @path PUT /bbs/articles/:articleId/comments/:id
 * @nestia Generated by Nestia - https://github.com/samchon/nestia
 */
export async function update(
    connection: IConnection,
    articleId: string & Format<"uuid">,
    id: string & Format<"uuid">,
    input: update.Input,
): Promise<update.Output> {
    return !!connection.simulate
        ? update.simulate(
              connection,
              articleId,
              id,
              input,
          )
        : PlainFetcher.fetch(
              {
                  ...connection,
                  headers: {
                      ...(connection.headers ?? {}),
                      "Content-Type": "application/json",
                  },
              },
              {
                  ...update.METADATA,
                  path: update.path(articleId, id),
              } as const,
              input,
          );
}
export namespace update {
    export type Input = Primitive<IBbsArticleComment.IUpdate>;
    export type Output = Primitive<IBbsArticleComment.ISnapshot>;

    export const METADATA = {
        method: "PUT",
        path: "/bbs/articles/:articleId/comments/:id",
        request: {
            type: "application/json",
            encrypted: false
        },
        response: {
            type: "application/json",
            encrypted: false,
        },
        status: null,
    } as const;

    export const path = (articleId: string & Format<"uuid">, id: string & Format<"uuid">): string => {
        return `/bbs/articles/${encodeURIComponent(articleId ?? "null")}/comments/${encodeURIComponent(id ?? "null")}`;
    }
    export const random = (g?: Partial<typia.IRandomGenerator>): Primitive<IBbsArticleComment.ISnapshot> =>
        typia.random<Primitive<IBbsArticleComment.ISnapshot>>(g);
    export const simulate = async (
        connection: IConnection,
        articleId: string & Format<"uuid">,
        id: string & Format<"uuid">,
        input: update.Input,
    ): Promise<Output> => {
        const assert = NestiaSimulator.assert({
            method: METADATA.method,
            host: connection.host,
            path: path(articleId, id),
            contentType: "application/json",
        });
        assert.param("articleId")(() => typia.assert(articleId));
        assert.param("id")(() => typia.assert(id));
        assert.body(() => typia.assert(input));
        return random(
            typeof connection.simulate === 'object' &&
                connection.simulate !== null
                ? connection.simulate
                : undefined
        );
    }
}

/**
 * Erase a comment.
 * 
 * Performs soft deletion to the comment.
 * 
 * @param articleId Belonged article's {@link IBbsArticle.id }
 * @param id Target comment's {@link IBbsArticleComment.id}
 * @param input Password of the comment.
 * @author Samchon
 * 
 * @controller BbsArticleCommentsController.erase
 * @path DELETE /bbs/articles/:articleId/comments/:id
 * @nestia Generated by Nestia - https://github.com/samchon/nestia
 */
export async function erase(
    connection: IConnection,
    articleId: string & Format<"uuid">,
    id: string & Format<"uuid">,
    input: erase.Input,
): Promise<void> {
    return !!connection.simulate
        ? erase.simulate(
              connection,
              articleId,
              id,
              input,
          )
        : PlainFetcher.fetch(
              {
                  ...connection,
                  headers: {
                      ...(connection.headers ?? {}),
                      "Content-Type": "application/json",
                  },
              },
              {
                  ...erase.METADATA,
                  path: erase.path(articleId, id),
              } as const,
              input,
          );
}
export namespace erase {
    export type Input = Primitive<IBbsArticleComment.IErase>;

    export const METADATA = {
        method: "DELETE",
        path: "/bbs/articles/:articleId/comments/:id",
        request: {
            type: "application/json",
            encrypted: false
        },
        response: {
            type: "application/json",
            encrypted: false,
        },
        status: null,
    } as const;

    export const path = (articleId: string & Format<"uuid">, id: string & Format<"uuid">): string => {
        return `/bbs/articles/${encodeURIComponent(articleId ?? "null")}/comments/${encodeURIComponent(id ?? "null")}`;
    }
    export const simulate = async (
        connection: IConnection,
        articleId: string & Format<"uuid">,
        id: string & Format<"uuid">,
        input: erase.Input,
    ): Promise<void> => {
        const assert = NestiaSimulator.assert({
            method: METADATA.method,
            host: connection.host,
            path: path(articleId, id),
            contentType: "application/json",
        });
        assert.param("articleId")(() => typia.assert(articleId));
        assert.param("id")(() => typia.assert(id));
        assert.body(() => typia.assert(input));
    }
}