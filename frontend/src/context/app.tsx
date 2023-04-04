import React, { createContext, useContext, useState } from "../deps/react.ts";

import { BaseApiClient } from "../services/BaseApiClient.ts";

export interface AppContextProps {
  apiClient: BaseApiClient;
  isLoading: boolean;
}

export const AppContext = createContext<AppContextProps | undefined>(
  undefined,
);

export interface AppContextProviderProps {
  children: React.ReactNode;
}

export const AppContextProvider = ({ children }: AppContextProviderProps) => {
  const [isLoading, setIsLoading] = useState(true);

  const apiClient = new BaseApiClient({});
  console.log("Created API client:", apiClient);

  React.useEffect(() => {
    console.log("Start loading...");

    const timerId = setTimeout(() => {
      setIsLoading(false);
      console.log("Finished loading");
    }, 1000);

    return () => {
      //cleanup
      timerId && clearTimeout(timerId);
    };
  }, []);

  return (
    <AppContext.Provider value={{ isLoading, apiClient }}>
      {children}
    </AppContext.Provider>
  );
};

export function useAppContext(): AppContextProps {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("No AppContext Provider available");
  }

  return context;
}
