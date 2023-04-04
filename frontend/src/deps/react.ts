import * as React from "https://esm.sh/react@18.2.0?dev";
const {
  createContext,
  createElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} = React;

export default React;
export {
  createContext,
  createElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
};

// Utility for Dynamic Component
export type DynamicComponent<TAttr = React.HTMLAttributes<HTMLElement>> = React.ComponentType<TAttr> | keyof JSX.IntrinsicElements;
export type WithDynamicComponent<TProps, TAttr = React.HTMLAttributes<HTMLElement>> = {
  Component?: DynamicComponent<TAttr>;
} & TProps

// DEPRECATED: Hack for older esm/no-check React
// declare global {
//   namespace JSX {
//     interface IntrinsicElements {
//       [key: string]: any;
//     }
//   }
// }
