import { expectTypeOf } from "vitest";
import type { GetDataReturnType, MaybePromise } from "fvtt-types/utils";

import DocumentSheet = foundry.appv1.api.DocumentSheet;
import ItemSheet = foundry.appv1.sheets.ItemSheet;

declare const item: Item.Implementation;
const itemSheet = new ItemSheet(item);

expectTypeOf(itemSheet.object).toEqualTypeOf<Item.Implementation>();
expectTypeOf(itemSheet.document).toEqualTypeOf<Item.Implementation>();
expectTypeOf(ItemSheet.defaultOptions).toEqualTypeOf<DocumentSheet.Options<Item.Implementation>>();
expectTypeOf(itemSheet.getData()).toEqualTypeOf<MaybePromise<GetDataReturnType<ItemSheet.ItemSheetData>>>();
expectTypeOf(itemSheet.render(true)).toEqualTypeOf<ItemSheet>();

expectTypeOf(itemSheet.item).toEqualTypeOf<Item.Implementation>();
expectTypeOf(itemSheet.actor).toEqualTypeOf<Actor.Implementation | null>();
