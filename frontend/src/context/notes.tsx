import { React } from "../deps/react.ts";

import { Note } from "../../../common/src/models/Note.ts";

import { AppContext } from "./app.tsx";
import { NotesStore } from "../services/NotesStore.ts";

export interface NotesContextProps {
    store: NotesStore,
}

export const NotesContext = React.createContext<NotesContextProps | undefined>(undefined);

export const NotesContextProvider: React.FC = ({ store, children }) => {
    const { apiClient } = React.useContext(AppContext);
    if (apiClient === undefined) {
        throw new Error("No API Client available in App Context");
    }
    const store = new NotesStore(apiClient);
    apiClient.registerExt("notes", store);

    return (
        <NotesContext.Provider value={{ store }}>
            {children}
        </NotesContext.Provider>
    )
};

export function useNotesContext(): NotesContext {
    const context = React.useContext(NotesContext);
    if (context === undefined) {
        throw new Error("No Notes Context available");
    }

    return context;
}
