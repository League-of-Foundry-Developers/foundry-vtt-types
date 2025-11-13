import { describe, expectTypeOf, test } from "vitest";
import Items = foundry.documents.collections.Items;

describe("Items Tests", () => {
  // const items = new Items();
  test("Miscellaneous", () => {
    expectTypeOf(Items.instance).toEqualTypeOf<Items.Implementation>();
  });
});
