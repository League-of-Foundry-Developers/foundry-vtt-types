import { expectTypeOf } from "vitest";

declare const doc: Item;
const itemSheet = new foundry.applications.sheets.ItemSheetV2({ document: doc });

expectTypeOf(itemSheet.item).toEqualTypeOf<Item>();
expectTypeOf(itemSheet.actor).toEqualTypeOf<Actor.Implementation | null>();
