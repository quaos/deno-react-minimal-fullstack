
export interface StoresApiClientExtension<T> {
    list: (filters?: any) => Promise<T[]>;
    getItem: (id: any) => Promise<T>;
    addItem: (item: T) => Promise<T>;
    updateItem: (item: T) => Promise<boolean>;
    deleteItem: (item: T) => Promise<boolean>;
}

export interface StoresApiClientExtensions {
    [key: string]: StoresApiClientExtension<any>;
}

export class StoresApiClient {
    apiBaseUrl: string = "http://localhost:8080/";
    exts: StoresApiClientExtensions = {};

    constructor(attrs?: Partial<StoresApiClient>) {
        Object.assign(this, attrs);
    }

    async callApi<T>(method: string = "GET", endpoint: string, reqData?: any): Promise<T> {
        const resp = await fetch(`${this.apiBaseUrl}/${endpoint}`, {
            method,
            body: reqData,
        });

        return await resp.json() as T;
    }

    getExt<T>(name: string) {
        return this.exts[name] as StoresApiClientExtension<T>;
    }

    registerExt(name: string, ext: StoresApiClientExtension) {
        this.exts[name] = ext;
    }
}
