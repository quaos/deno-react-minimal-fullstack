import { Context, Middleware, NextFn, RouterMiddleware } from "../deps/oak.ts";

import { MemoryStore } from "../repositories/MemoryStore.ts";

export interface StoreMiddlewareOptions {
    store: MemoryStore;
};

export function createStoreMiddleware<
    T extends RouterMiddleware | Middleware = Middleware,
>(opts: StoreMiddlewareOptions): T {
    const middleware = async (ctx: Context, next: NextFn) => {
        if (ctx.state.lastError) {
            return await next();
        }
        
        ctx.state.store = opts.store;

        await next();
    };
    return middleware as T;
}
