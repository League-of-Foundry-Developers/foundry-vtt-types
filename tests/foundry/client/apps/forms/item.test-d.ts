import { expectTypeOf } from "vitest";
import type { GetDataReturnType, MaybePromise } from "../../../../../src/utils/index.d.mts";

declare const item: Item;
const itemSheet = new ItemSheet(item);

expectTypeOf(itemSheet.object).toEqualTypeOf<Item>();
expectTypeOf(itemSheet.document).toEqualTypeOf<Item>();
expectTypeOf(ItemSheet.defaultOptions).toEqualTypeOf<DocumentSheetOptions<Item.ConfiguredInstance>>();
expectTypeOf(itemSheet.getData()).toEqualTypeOf<MaybePromise<GetDataReturnType<ItemSheet.ItemSheetData>>>();
expectTypeOf(itemSheet.render(true)).toEqualTypeOf<ItemSheet>();

expectTypeOf(itemSheet.item).toEqualTypeOf<Item>();
expectTypeOf(itemSheet.actor).toEqualTypeOf<Actor | null>();
