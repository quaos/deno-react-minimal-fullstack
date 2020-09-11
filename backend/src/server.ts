import {
    Application as OakApplication,
    Context,
    Middleware,
    Router,
    RouterContext,
    RouterMiddleware,
} from "./deps/oak.ts";

import { AppConfig } from "./app-config.ts";
import { AppState } from "./AppState.ts";
import { accessLogger } from "./middlewares/access-logger.ts";
import { errorHandler } from "./middlewares/error-handler.ts";
import { createNotesController } from "./controllers/notes.ts";
import { createStoreMiddleware } from "./middlewares/store-middleware.ts";

export class Server {
    appConfig: AppConfig;
    
    public constructor(appConfig: AppConfig) {
        this.appConfig = appConfig;
    }
    
    public async start(): Promise<number> {
        console.info(`Starting server on port: ${this.appConfig.port}`);
        let rc;
        try {
            const oakApp = await this.buildOakApp();    
            await oakApp.listen({
                port: this.appConfig.port
            });
            rc = 0;
        } catch (err) {
            console.error(err);
            rc = -1;
        }
        console.warn("Server stopped.");

        return rc;
    }

    async buildOakApp<T extends OakApplication>(): Promise<T> {
        const app = new OakApplication<AppState>();
        
        app.use(accessLogger<Middleware>({ format: "short" }));
        
        const pingRouter = new Router();
        pingRouter.get("/ping", async (ctx, next) => {
            ctx.response.body = "Pong!";
        });
        app.use(pingRouter.routes(), pingRouter.allowedMethods());

        const apiRouter: Router = new Router();
        apiRouter.use(createStoreMiddleware<RouterMiddleware>({ }));

        const notesController = createNotesController();
        await apiRouter.all("/api/notes", notesController);
        
        apiRouter.use(errorHandler<RouterMiddleware>({
            formatter: (err) => JSON.stringify({
                errorMessage: err.message
            }),
        }));
        app.use(apiRouter.routes(), apiRouter.allowedMethods());

        app.use(errorHandler<Middleware>());

        return app as T;
    }

    public static fromEnv(): Server {
        const appConfig = AppConfig.fromEnv();
        return new Server(appConfig);
    }
}
