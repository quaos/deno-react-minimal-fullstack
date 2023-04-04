import { AppConfig } from "./src/app-config.ts";
import { Server } from "./src/server.ts";

let rc;
try {
  const appConfig = AppConfig.fromEnv();
  const server = new Server(appConfig);

  rc = await server.start();
} catch (err) {
  console.error(err);
  rc = -1;
}
Deno.exit(rc);
