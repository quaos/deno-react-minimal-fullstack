import { Context, Middleware, NextFn, RouterMiddleware } from "../deps/oak.ts";

export interface ErrorHandlerOptions {
    formatter?: (err: Error) => string;
};

export function errorHandler<
    T extends RouterMiddleware | Middleware = Middleware,
>(opts?: ErrorHandlerOptions): T {
    const middleware = async (ctx: Context, next: NextFn) => {
        await next();
        if (ctx.state.lastError) {
            if (ctx.response.status >= 500) {
                console.error(ctx.state.lastError);
            }
            ctx.response.body = (opts?.formatter)
                ? opts?.formatter(ctx.state.lastError)
                : ctx.state.lastError.message;
        }
    };
    return middleware as T;
}
