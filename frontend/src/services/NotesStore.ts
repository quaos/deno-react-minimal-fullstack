import { Note } from "../../../common/src/models/Note.ts";

import { BaseApiClient } from "./BaseApiClient.ts";

export class NotesStore {
    endpoint: string = "notes";
    client: BaseApiClient;

    public constructor(client: BaseApiClient) {
        this.client = client;
    }

    public async list(filters?: any): Promise<Note[]> {
        return await this.client.callApi<Note[]>("GET", this.endpoint);
    }

    public async getItem(id: any): Promise<Note> {
        return await this.client.callApi<Note>("GET", `${this.endpoint}/${id}`);
    }

    public async addItem(item: Note): Promise<Note> {
        return await this.client.callApi<Note>("POST", this.endpoint, item);
    }

    public async updateItem(item: Note): Promise<boolean> {
        return await this.client.callApi("PUT", `${this.endpoint}/${item.id}`, item);
    };

    public async deleteItem(item: Note): Promise<boolean> {
        await this.client.callApi<never>("DELETE", `${this.endpoint}/${item.id}`);
        return true;
    }
}
