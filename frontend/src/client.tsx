import React from "./deps/react.ts";
import { createRoot } from "./deps/react-dom.ts";

import App from "./components/App.tsx";

window.addEventListener("DOMContentLoaded", (evt) => {
  /// @ts-ignore already added lib: ["dom"] to tsconfig.json
  const root = createRoot(document.getElementById("root")!);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
});

export {};
