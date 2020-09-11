import 
    Router,
    RouterContext,
    RouterMiddleware,
} from "../deps/oak.ts";

import { Note } from "../../../common/src/models/Note.ts";

import { Repository } from "../repositories/Repository.ts";

export async function createNotesController(): RouterMiddleware {
    const getRepository = (ctx) =>
        ctx.state.store.getRepository<Note>("notes", (item) => item.id);

    const router = new Router();
    await router.get("/", async (ctx, next) => {
        const notes = getRepository(ctx).list({ });
        ctx.response.body = notes;
    });
    await router.get("/{id}", async (ctx, next) => {
        const notes = getRepository(ctx).getItem(Number(ctx.request.params.id));
        ctx.response.body = notes;
    });
    await router.post("/", async (ctx, next) => {
        const note = getRepository(ctx).addItem(ctx.request.body);
        ctx.response.body = note;
    });
    await router.put("/{id}", async (ctx, next) => {
        const success = getRepository(ctx).updateItem(ctx.request.body));
        ctx.response.body = notes;
    });
    await router.delete("/{id}", async (ctx, next) => {
        const repo = getRepository(ctx);
        const note = repo.getItem(Number(ctx.request.params.id));
        if (!note) {
            ctx.response.status(404).body({ error: "NotFound" });
            await next();
            return;
        }
        const notes = .deleteItem(Number(ctx.request.params.id));
        ctx.response.body = notes;
    });

    return router;
}
