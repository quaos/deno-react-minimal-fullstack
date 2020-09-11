import { React } from "../deps/react.ts";

import { NotesContextProvider } from "./notes.tsx";

export interface AppContextProps {
    loading: boolean;
}

export const AppContext = React.createContext<AppContextProps>({
    loading: true,
});

export const AppContextProvider: React.FC = ({ config, children }) => {
    let [ loading, setLoading ] = React.useState(true);

    const apiClient = new StoresApiClient({ });
    const notesStore = new NotesStore(client: apiClient);
    apiClient.registerExt("notes", notesStore);
    console.log("Created API client:",apiClient);
  
    React.useEffect(async () => {
      console.log("Start loading...");
  
      const timerId = setTimeout(() => {
        setLoading(false);
        console.log("Finished loading");
      }, 1000);
  
      return () => {
        //cleanup
        clearTimeout(timerId);
      }
    }, []);

    return (
      <AppContext.Provider value={{ loading }}>
        <NotesContextProvider filters={{}} store={notesStore}>
            {children}
        </NotesContextProvider>
      </AppContext.Provider>
    );
};
