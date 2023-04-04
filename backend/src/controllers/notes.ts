import { Router, RouterContext, Status } from "../deps/oak.ts";

import { Note } from "../../../common/src/models/Note.ts";

import { RepositoriesStore } from "../repositories/Repository.ts";
import { AutoIncrementKeyManager } from "../repositories/MemoryStore.ts";

export async function useNotesController(
  router: Router,
  basePath: string,
): Promise<void> {
  const keyManager = new AutoIncrementKeyManager<Note>((item) => item.id);

  const getRepository = (ctx: RouterContext<string, any, any>) => {
    if (ctx.state.store === undefined) {
      throw new Error("Store not available");
    }
    const store = ctx.state.store as RepositoriesStore;
    return store.getRepository<Note, number>("notes", keyManager);
  };

  const checkNotFound = (
    ctx: RouterContext<string, any, any>,
    note: Note | undefined,
  ) => {
    if (note === undefined) {
      ctx.throw(Status.NotFound, "Not Found");
    }
    return note as Note;
  };

  const checkSuccess = (
    ctx: RouterContext<string, any, any>,
    success: boolean,
  ) => {
    if (!success) {
      ctx.throw(Status.InternalServerError, "Operation Failed");
    }
  };

  await router.get(`${basePath}`, async (ctx) => {
    const notes = await getRepository(ctx).list({});
    ctx.response.status = Status.OK;
    ctx.response.body = notes;
  });
  await router.get<{ id: string }>(`${basePath}/:id`, async (ctx) => {
    let note = await getRepository(ctx).getItem(Number(ctx.params.id));
    note = checkNotFound(ctx, note);
    ctx.response.status = Status.OK;
    ctx.response.body = note;
  });
  await router.post(`${basePath}`, async (ctx) => {
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
  await router.put<{ id: string }>(`${basePath}/:id`, async (ctx) => {
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
    checkSuccess(ctx, success);

    ctx.response.status = Status.OK;
    ctx.response.body = note;
  });
  await router.delete<{ id: string }>(`${basePath}/:id`, async (ctx) => {
    const repo = getRepository(ctx);
    let note = await repo.getItem(Number(ctx.params.id));
    note = checkNotFound(ctx, note);

    const success = await repo.deleteItem(note);
    checkSuccess(ctx, success);

    ctx.response.status = Status.NoContent;
  });
}
