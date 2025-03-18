import { expectTypeOf } from "vitest";
import type { GetDataReturnType, MaybePromise } from "fvtt-types/utils";

declare const item: Item;
const itemSheet = new ItemSheet(item);

expectTypeOf(itemSheet.object).toEqualTypeOf<Item>();
expectTypeOf(itemSheet.document).toEqualTypeOf<Item>();
expectTypeOf(ItemSheet.defaultOptions).toEqualTypeOf<DocumentSheet.Options<Item.Implementation>>();
expectTypeOf(itemSheet.getData()).toEqualTypeOf<MaybePromise<GetDataReturnType<ItemSheet.ItemSheetData>>>();
expectTypeOf(itemSheet.render(true)).toEqualTypeOf<ItemSheet>();

expectTypeOf(itemSheet.item).toEqualTypeOf<Item>();
expectTypeOf(itemSheet.actor).toEqualTypeOf<Actor | null>();
