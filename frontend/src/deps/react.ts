// @deno-types="https://raw.githubusercontent.com/Soremwar/deno_types/master/react/v16.13.1/react.d.ts"
// @ts-ignore
export { default as React } from "https://dev.jspm.io/react@16.13.1";

// @deno-types="https://raw.githubusercontent.com/Soremwar/deno_types/master/react-dom/v16.13.1/react-dom.d.ts"
// @ts-ignore
export { default as ReactDOM } from "https://dev.jspm.io/react-dom@16.13.1";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [key: string]: any;
    }
  }
}
