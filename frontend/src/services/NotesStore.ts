import { Note } from "../../../common/src/models/Note.ts";

import { StoresApiClient, StoresApiClientExtension } from "./StoresApiClient.ts";

const ENDPOINT = "notes";

export class NotesStore implements StoresApiClientExtension<Note> {
    client: StoresApiClient;

    public constructor(client: StoresApiClient) {
        this.client = client;
    }

    public async list(filters?: any): Promise<Note[]> {
        return await this.client.callApi<Note[]>("GET", ENDPOINT);
    }

    public async getItem(id: any): Promise<Note> {
        return await this.client.callApi<Note>("GET", `${ENDPOINT}/${id}`);
    }

    public async addItem(item: Note): Promise<Note> {
        return await this.client.callApi<Note>("POST", ENDPOINT, item);
    }

    public async updateItem(item: Note): Promise<boolean>  {
        const { success } = await this.client.callApi("PUT", `${ENDPOINT}/${item.id}`, item);
        return success;
    };

    public async deleteItem(item: Note): Promise<boolean> {
        const { success } = await this.client.callApi("DELETE", `${ENDPOINT}/${item.id}`);
        return success;
    }
}
