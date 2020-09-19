import { MemoryStore } from "./repositories/MemoryStore.ts";

export interface AppState {
    store?: MemoryStore;
    lastError?: Error;
}
