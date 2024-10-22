// This is a regression test for the error:
// "'Item' is referenced directly or indirectly in its own type annotation."
// See https://gist.github.com/LukeAbby/f9561689e5cad8a4b1e9cb92a8c63982 for more information.

import { expectTypeOf } from "vitest";

type CustomItemClass = new () => Item;

declare global {
  interface DocumentClassConfig {
    Item: CustomItemClass;
  }
}

expectTypeOf(CONFIG.Item.documentClass).toEqualTypeOf<CustomItemClass>();
