import { expectTypeOf } from "vitest";
import type { GetDataReturnType, MaybePromise } from "fvtt-types/utils";

const item = new Item({ name: "Heavy armor", type: "base" });
const itemSheet = new ItemSheet(item);

expectTypeOf(itemSheet.object).toEqualTypeOf<Item>();
expectTypeOf(itemSheet.document).toEqualTypeOf<Item>();
expectTypeOf(ItemSheet.defaultOptions).toEqualTypeOf<DocumentSheetOptions<Item.ConfiguredInstance>>();
expectTypeOf(itemSheet.getData()).toEqualTypeOf<MaybePromise<GetDataReturnType<ItemSheet.ItemSheetData>>>();
expectTypeOf(itemSheet.render(true)).toEqualTypeOf<ItemSheet>();

expectTypeOf(itemSheet.item).toEqualTypeOf<Item>();
expectTypeOf(itemSheet.actor).toEqualTypeOf<Actor | null>();
