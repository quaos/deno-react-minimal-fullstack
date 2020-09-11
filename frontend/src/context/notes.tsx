import { React } from "../deps/react.ts";

import { Note } from "../../../common/src/models/Note.ts";

export interface NotesContextProps {
    list: (filters?: any) => Note[];
    addNote: (note: Note) => Note;
    updateNote: (note: Note) => boolean;
    deleteNote: (note: Note) => boolean;
}

export const NotesContext = React.createContext<NotesContextProps>({
    list: (filters) => { throw new Error("Not Implemented"); },
    addNote: (note) => { throw new Error("Not Implemented"); },
    updateNote: (note) => { throw new Error("Not Implemented"); },
    deleteNote: (note) => { throw new Error("Not Implemented"); }, 
});

export const NotesContextProvider: React.FC = ({ store, children }) => {
    const list = async (filters) => {
        return await store.list(filters);
    };

    const addNote = async (note: Note) => {
        const addedNote = await store.addItem(note);
        return addedNote;
    };

    const updateNote = async (note: Note) => {
        const success = await store.updateItem(note);
        return success;
    };

    const deleteNote = async (note: Note) => {
        const success = store.deleteItem(note);
        return success;
    };

    return (
        <NotesContext.Provider value={{ list, addNote, updateNote, deleteNote }}>
            {children}
        </NotesContext.Provider>
    )
};

