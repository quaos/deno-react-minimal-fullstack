import { React } from "../deps/react.ts";

import { BaseApiClient } from "../services/BaseApiClient.ts";

export interface AppContextProps {
  loading: boolean;
  apiClient: BaseApiClient;
}

export const AppContext = React.createContext<AppContextProps | undefined>(
  undefined,
);

export interface AppContextProviderProps {
  children: React.ReactNode;
}

export const AppContextProvider: React.FC = ({ children }: AppContextProviderProps) => {
  let [loading, setLoading] = React.useState(true);

  const apiClient = new BaseApiClient({});
  console.log("Created API client:", apiClient);

  React.useEffect(() => {
    console.log("Start loading...");

    const timerId = setTimeout(() => {
      setLoading(false);
      console.log("Finished loading");
    }, 1000);

    return () => {
      //cleanup
      clearTimeout(timerId);
    };
  }, []);

  return (
    <AppContext.Provider value={{ loading, apiClient }}>
      {children}
    </AppContext.Provider>
  );
};

export function useAppContext(): AppContextProps {
  const context = React.useContext(AppContext);
  if (context === undefined) {
    throw new Error("No AppContext Provider available");
  }

  return context;
}
