import { expectTypeOf } from "vitest";

// This is a regression test for the error:
// "'Item' is referenced directly or indirectly in its own type annotation."
// See https://gist.github.com/LukeAbby/f9561689e5cad8a4b1e9cb92a8c63982 for more information.
declare class CustomItemClass<SubType extends Item.SubType> extends Item<SubType> {
  configured: true;
}

declare module "fvtt-types/configuration" {
  interface DocumentClassConfig {
    Item: typeof CustomItemClass;
  }

  interface ConfiguredItem<SubType extends Item.SubType> {
    document: CustomItemClass<SubType>;
  }
}

expectTypeOf(CONFIG.Item.documentClass).toEqualTypeOf<typeof CustomItemClass>();
