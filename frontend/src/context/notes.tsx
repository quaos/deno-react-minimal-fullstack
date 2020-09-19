import { React } from "../deps/react.ts";

import { Note } from "../../../common/src/models/Note.ts";

import { useAppContext } from "./app.tsx";
import { NotesStore } from "../services/NotesStore.ts";

export interface NotesContextProps {
    store: NotesStore;
}

export const NotesContext = React.createContext<NotesContextProps | undefined>(
    undefined,
);

export interface NotesContextProviderProps {
    children: React.ReactNode;
}

export const NotesContextProvider: React.FC = ({ children }: NotesContextProviderProps) => {
    const { apiClient } = useAppContext();

    const store = new NotesStore(apiClient);

    return (
        <NotesContext.Provider value={{ store }}>
            {children}
        </NotesContext.Provider>
    );
};

export function useNotesContext(): NotesContextProps {
    const context = React.useContext(NotesContext);
    if (context === undefined) {
        throw new Error("No NotesContext Provider available");
    }

    return context;
}
