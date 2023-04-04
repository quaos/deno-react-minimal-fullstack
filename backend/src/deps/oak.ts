export {
    Application,
    Context,
    Router,
    Status,
} from "https://deno.land/x/oak@v12.1.0/mod.ts";
export type {
    Middleware,
    RouterContext,
    RouterMiddleware,
    State,
} from "https://deno.land/x/oak@v12.1.0/mod.ts";

export type NextFn = () => Promise<unknown>
