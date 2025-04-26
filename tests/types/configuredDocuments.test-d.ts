import { expectTypeOf } from "vitest";

// This is a regression test for the error:
// "'Item' is referenced directly or indirectly in its own type annotation."
// See https://gist.github.com/LukeAbby/f9561689e5cad8a4b1e9cb92a8c63982 for more information.
class _CustomItemClass extends Item {}

declare global {
  interface DocumentClassConfig {
    Item: typeof _CustomItemClass;
  }
}

expectTypeOf(CONFIG.Item.documentClass).toEqualTypeOf<typeof _CustomItemClass>();
