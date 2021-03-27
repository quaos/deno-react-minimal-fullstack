export { default as React } from "https://esm.sh/[react@17.0.1,react-dom@17.0.1]/react?dev&no-check";
export { default as ReactDOM } from "https://esm.sh/[react@17.0.1,react-dom@17.0.1]/react-dom?dev&no-check";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [key: string]: any;
    }
  }
}
