import { expectTypeOf, test } from "vitest";

declare const doc: Item.Implementation;

test("foundry/client/applications/sheets/item-sheet", () => {
  const itemSheet = new foundry.applications.sheets.ItemSheetV2({ document: doc });

  expectTypeOf(itemSheet.item).toEqualTypeOf<Item.Implementation>();
  expectTypeOf(itemSheet.actor).toEqualTypeOf<Actor.Implementation | null>();
});
