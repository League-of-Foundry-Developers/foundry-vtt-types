import { expectTypeOf } from "vitest";

declare const doc: Item.Implementation;
const itemSheet = new foundry.applications.sheets.ItemSheetV2({ document: doc });

expectTypeOf(itemSheet.item).toEqualTypeOf<Item.Implementation>();
expectTypeOf(itemSheet.actor).toEqualTypeOf<Actor.Implementation | null>();
