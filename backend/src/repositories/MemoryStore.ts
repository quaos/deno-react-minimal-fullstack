import { Repository } from "./Repository.ts";

class RepositoryImpl<T, TKey> implements Repository<T, TKey> {
    map: { [key: TKey ] => T; };
    keyExtractor: (item: T): TKey;

    constructor(keyExtractor: (item: T): TKey) {
        this.keyExtractor = keyExtractor;
        this.map = {};
    }


    public async list(filters?: any): Promise<T[]> {
        return Object.values(this.map);
    }

    public async getItem(key: TKey): Promise<T> {
        return this.map[key];
    }

    public async addItem(item: T): Promise<T> {
        const key = this.keyExtractor(item);
        this.map[key] = item;
    }

    public async updateItem(item: T): Promise<boolean> {
        const key = this.keyExtractor(item);
        const existingItem = this.map[key];
        if (!existingItem) {
            return false;
        }
        Object.assign(existingItem, item);
        return true;
    }

    public async deleteItem(item: T): Promise<boolean> {
        const key = this.keyExtractor(item);
        const existingItem = this.map[key];
        if (!existingItem) {
            return false;
        }
        this.map[key] = undefined;
        return true;
    }
}

export class MemoryStore {
    repositories: { [name: string] => RepositoryImpl<any, any>; };

    public constructor() {
        this.repositories = {};
    }

    public getRepository<T, TKey>(collectionName: string, keyExtractor: (item: T): TKey)
        : Repository<T, TKey> {
        let repository = this.repositories[collectionName];
        if (repository) {
            return repository as Repository<T, TKey>;
        }

        repository = new RepositoryImpl<T, TKey>(keyExtractor);
        this.repositories[collectionName] = repository;
        
        return repository;
    }
}