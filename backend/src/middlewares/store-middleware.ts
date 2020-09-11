import { Middleware, RouterMiddleware } from "../deps/oak.ts";

import { MemoryStore } from "../repositories/MemoryStore.ts";

export interface StoreMiddlewareOptions {
    
};

export function createStoreMiddleware<
    T extends RouterMiddleware | Middleware = Middleware,
>(opts: StoreMiddlewareOptions): T {
    const middleware: Middleware = async (ctx, next) => {
        if (ctx.state.lastError) {
            return await next();
        }
        
        ctx.state.store = new MemoryStore();

        await next();
    };
    return middleware as T;
}
