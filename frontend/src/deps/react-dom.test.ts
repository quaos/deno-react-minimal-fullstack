import { createPortal, createRoot } from "./react-dom.ts";
import { assertEquals } from "./std.ts";

Deno.test("React DOM deps has exported functions", () => {
  // assert("createPortal" in ReactDOM);
  assertEquals(typeof createPortal, "function");
  assertEquals(typeof createRoot, "function");
});
