import {
    Router,
    RouterContext,
    RouterMiddleware,
    Status,
} from "../deps/oak.ts";

import { Note } from "../../../common/src/models/Note.ts";

import { Repository, RepositoriesStore } from "../repositories/Repository.ts";
import { AutoIncrementKeyManager } from "../repositories/MemoryStore.ts";

export async function useNotesController(router: Router, basePath: string): Promise<void> {
    const keyManager = new AutoIncrementKeyManager<Note>((item) => item.id);

    const getRepository = (ctx: RouterContext<any>) => {
        if (ctx.state.store === undefined) {
            throw new Error("Store not available");
        }
        const store = ctx.state.store as RepositoriesStore;
        return store.getRepository<Note, number>("notes", keyManager)
    }

    const checkNotFound = (ctx: RouterContext<any>, note: Note | undefined) => {
        if (note === undefined) {
            ctx.throw(Status.NotFound, "Not Found");
        }
        return note as Note
    }

    await router.get(`${basePath}`, async (ctx, next) => {
        const notes = await getRepository(ctx).list({ });
        ctx.response.status = Status.OK;
        ctx.response.body = notes;
    });
    await router.get<{ id: string }>(`${basePath}/:id`, async (ctx, next) => {
        let note = await getRepository(ctx).getItem(Number(ctx.params.id));
        note = checkNotFound(ctx, note);
        ctx.response.status = Status.OK;
        ctx.response.body = note;
    });
    await router.post(`${basePath}`, async (ctx, next) => {
        if (!ctx.request.hasBody) {
          ctx.throw(Status.BadRequest, "Bad Request");
        }
        const note = await ctx.request.body().value as Note;
        note.id = keyManager.nextKey();
        console.log(`notes: generated next key#${note.id}`);
        const addedNote = await getRepository(ctx).addItem(note);
        ctx.response.status = Status.Created;
        ctx.response.body = addedNote;
    });
    await router.put<{ id: string }>(`${basePath}/:id`, async (ctx, next) => {
        if (!ctx.request.hasBody) {
          ctx.throw(Status.BadRequest, "Bad Request");
        }
        const id = Number(ctx.params.id);
        const repo = getRepository(ctx);
        let note = await repo.getItem(id);
        note = checkNotFound(ctx, note);
        const updatedNoteData = await ctx.request.body().value as Note;
        Object.assign(note, updatedNoteData);
        note.id = id;
        const success = await repo.updateItem(note);
        ctx.response.status = Status.OK;
        ctx.response.body = note;
    });
    await router.delete<{ id: string }>(`${basePath}/:id`, async (ctx, next) => {
        const repo = getRepository(ctx);
        let note = await repo.getItem(Number(ctx.params.id));
        note = checkNotFound(ctx, note);
        const success = await repo.deleteItem(note);
        ctx.response.status = Status.OK;
    });
}
