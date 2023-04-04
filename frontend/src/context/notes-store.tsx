import React, { createContext, useContext } from "../deps/react.ts";

// import { Note } from "../../../common/src/models/Note.ts";

import { useAppContext } from "./app.tsx";
import { NotesStore } from "../services/NotesStore.ts";

export interface NotesContextProps {
  store: NotesStore;
}

export const NotesContext = createContext<NotesContextProps | undefined>(
  undefined,
);

// deno-lint-ignore no-empty-interface
export interface NotesStoreContextProviderProps {}

export const NotesStoreContextProvider = (
  { children }: React.PropsWithChildren<NotesStoreContextProviderProps>,
) => {
  const { apiClient } = useAppContext();

  const store = new NotesStore(apiClient);

  return (
    <NotesContext.Provider value={{ store }}>
      {children}
    </NotesContext.Provider>
  );
};

export function useNotesContext(): NotesContextProps {
  const context = useContext(NotesContext);
  if (context === undefined) {
    throw new Error("No NotesStoreContext Provider available");
  }

  return context;
}
