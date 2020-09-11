import { Connection } from "./deps/typeorm.ts";

import { MemoryStore } from "./repositories/MemoryStore.ts";
import {UserSession } from "./models/UserSession.ts";

export interface AppState {
    store?: MemoryStore;
    userSession?: UserSession;
    lastError?: Error;
}
