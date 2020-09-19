import {
    KeyManager,
    Repository,
    RepositoriesStore,
} from "./Repository.ts";

class RepositoryImpl<T, TKey> implements Repository<T, TKey> {
    name: string;
    keyManager: KeyManager<T, TKey>;
    map: Map<TKey, T>;

    constructor(name: string, keyManager: KeyManager<T, TKey>) {
        this.name = name;
        this.keyManager = keyManager;
        this.map = new Map();
    }

    public async list(filters?: any): Promise<T[]> {
        console.log(`${this.name}: current data:`, this.map);
        return Array.from(this.map.values())
    }

    public async getItem(key: TKey): Promise<T | undefined> {
        console.log(`${this.name}: current data:`, this.map);
        return this.map.get(key)
    }

    public async addItem(item: T): Promise<T> {
        const key = this.keyManager.getKey(item);
        console.log(`${this.name}: adding item#${key}`, item);
        this.map.set(key, item);
        return item
    }

    public async updateItem(item: T): Promise<boolean> {
        const key = this.keyManager.getKey(item);
        console.log(`${this.name}: updating item#${key}`, item);
        const existingItem = this.map.get(key);
        if (!existingItem) {
            return false;
        }
        Object.assign(existingItem, item);
        return true
    }

    public async deleteItem(item: T): Promise<boolean> {
        const key = this.keyManager.getKey(item);
        console.log(`${this.name}: deleting item#${key}`, item);
        const existingItem = this.map.get(key);
        if (!existingItem) {
            return false;
        }
        this.map.delete(key);
        return true
    }
}

export class MemoryStore implements RepositoriesStore {
    repositories: Record<string, RepositoryImpl<any, any>>;

    public constructor() {
        this.repositories = {};
    }

    public getRepository<T, TKey>(name: string, keyManager: KeyManager<T, TKey>)
        : Repository<T, TKey> {
        let repository = this.repositories[name];
        if (repository) {
            return repository as Repository<T, TKey>;
        }

        repository = new RepositoryImpl<T, TKey>(name, keyManager);
        this.repositories[name] = repository;
        
        return repository
    }
}

export class AutoIncrementKeyManager<T> implements KeyManager<T, number> {
    lastKey: number = 0;
    keyExtractor: (item: T) => number;

    constructor(keyExtractor: (item: T) => number) {
        this.keyExtractor = keyExtractor;
    }

    getKey(item: T) {
        return this.keyExtractor(item);
    }

    nextKey() {
        return ++this.lastKey;
    } 
}
