import { React } from "../deps/react.ts";

import { AppContext, AppContextProvider } from "../context/app.tsx";
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

const App = (props: any) => {
  return (
    <AppContextProvider>
      <div className="container">
        <p>
          <img src="assets/img/deno-logo.png" style={styles.logo} />
          <img src="assets/img/react-logo192.png" style={styles.logo} />
        </p>
        <NotesList filters={{}} />
      </div>
    </AppContextProvider>
  );
  //
};

export default App;
