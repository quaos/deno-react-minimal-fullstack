import { React } from "../deps/react.ts";

import { NotesContextProvider } from "./notes.tsx";
import { NotesStore } from "../services/NotesStore.ts";
import { StoresApiClient } from "../services/StoresApiClient.ts";

export interface AppContextProps {
    loading: boolean;
    apiClient?: StoresApiClient;
}

export const AppContext = React.createContext<AppContextProps>({
    loading: true,
});

export const AppContextProvider: React.FC = ({ config, children }) => {
    let [ loading, setLoading ] = React.useState(true);

    React.useEffect(() => {
      console.log("Start loading...");
  
      const apiClient = new StoresApiClient({ });
      console.log("Created API client:",apiClient);
    
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
      <AppContext.Provider value={{ loading, apiClient }}>
        <NotesContextProvider filters={{}} store={notesStore}>
            {children}
        </NotesContextProvider>
      </AppContext.Provider>
    );
};
