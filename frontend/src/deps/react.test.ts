import * as React from "./react.ts";
import { assert, assertEquals } from "./std.ts";

Deno.test("React deps has use* hooks", () => {
  assert("useContext" in React);
  assert("useEffect" in React);
  assert("useRef" in React);
  assert("useState" in React);
  assertEquals(typeof React.useState, "function");
});
