import { Context, Middleware, NextFn, RouterMiddleware } from "../deps/oak.ts";

export interface AccessLoggerOptions {
    format?: string;
    prefix?: string;
};

export function accessLogger<
    T extends RouterMiddleware | Middleware = Middleware,
>(opts: AccessLoggerOptions = {}): T {
    const { prefix } = opts;
    //TODO: Add format support
    const middleware = async (ctx: Context, next: NextFn) => {
        const t1 = new Date();
        await next();
        const dt = Date.now() - t1.getTime();
        const fields = [
            ...(prefix ? [prefix] : []),
            t1.toISOString(),
            ctx.request.method,
            ctx.request.url,
            "=>",
            `${ctx.response.status}`,
            `(${dt} msecs)`,
        ]
        console.log(fields.join(" "));
    };
    return middleware as T;
}
