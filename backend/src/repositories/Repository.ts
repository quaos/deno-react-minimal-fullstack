export interface Repository<T, TKey> {
    list(filters?: any): Promise<T[]>;
    getItem(key: TKey): Promise<T | undefined>;
    addItem(item: T): Promise<T>;
    updateItem(item: T): Promise<boolean>;
    deleteItem(item: T): Promise<boolean>;
}

export interface KeyManager<T, TKey> {
    getKey: (item: T) => TKey;
    nextKey: () => TKey;
}

export interface RepositoriesStore {
    getRepository<T, TKey>(name: string, keyManager: KeyManager<T, TKey>)
        : Repository<T, TKey>;
}
