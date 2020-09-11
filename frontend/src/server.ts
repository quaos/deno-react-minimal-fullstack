import * as abc from "./deps/abc.ts";

export interface RunServerOptions {
  host?: string;
  port?: number;
}

export async function runServer(opts?: RunServerOptions): Promise<number> {
  try {
    const sourceDir = "./public";
    const host = opts?.host || "localhost";
    const port = opts?.port || 8080;
    console.log(
      `Starting static web server at: http://${host}:${port}/\nSource path: ${sourceDir}`,
    );
    const abcApp = new abc.Application();
    abcApp
      .use((next) =>
        async (ctx) => {
          console.log(`${ctx.request.method} ${ctx.request.url}`);
          await next(ctx);
        }
      )
      .static("/", sourceDir)
      .file("/", `${sourceDir}/index.html`)
      .start({ port });
    return 0;
  } catch (err) {
    console.error(err);
    throw err;
  }
}
