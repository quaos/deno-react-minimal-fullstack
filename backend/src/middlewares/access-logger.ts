import { Middleware, RouterMiddleware } from "../deps/oak.ts";

export interface AccessLoggerOptions {
    format?: string;
};

export function accessLogger<
    T extends RouterMiddleware | Middleware = Middleware,
>(opts?: AccessLoggerOptions): T {
    //TODO: Add format support
    const middleware: Middleware = async (ctx, next) => {
        let t1 = Date.now();
        await next();
        let dt = Date.now() - t1;
        console.log(`${ctx.request.method} ${ctx.request.url} => ${ctx.response.status} (${dt} msecs)`);
    };
    return middleware as T;
}
