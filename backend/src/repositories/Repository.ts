
export interface Repository<T, TKey> {
    public async list(filters?: any): Promise<T[]>;
    public async getItem(key: TKey): Promise<T>;
    public async addItem(item: T): Promise<T>;
    public async updateItem(item: T): Promise<boolean>;
    public async deleteItem(item: T): Promise<boolean>;
}
