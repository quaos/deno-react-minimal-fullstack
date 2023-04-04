import React from "../deps/react.ts";

import { AppContextProvider } from "../context/app.tsx";
import { NotesStoreContextProvider } from "../context/notes-store.tsx";
import { NotesList } from "./NotesList.tsx";

const styles = {
  logo: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "192px",
    height: "192px",
  },
};

// deno-lint-ignore no-empty-interface
export interface AppProps {}

const App = (props: AppProps) => {
  return (
    <AppContextProvider>
      <div className="container">
        <p>
          <img src="assets/img/deno-logo.png" style={styles.logo} />
          <img src="assets/img/react-logo192.png" style={styles.logo} />
        </p>
        <NotesStoreContextProvider>
          <NotesList filters={{}} />
        </NotesStoreContextProvider>
      </div>
    </AppContextProvider>
  );
};

export default App;
