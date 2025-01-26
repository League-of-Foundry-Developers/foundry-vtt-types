import { expectTypeOf } from "vitest";
import type { GetDataReturnType } from "fvtt-types/utils";

declare const actor: Actor;
const baseSheet = new BaseSheet(actor);

expectTypeOf(baseSheet.object).toEqualTypeOf<Actor>();
expectTypeOf(baseSheet.document).toEqualTypeOf<Actor>();
expectTypeOf(BaseSheet.defaultOptions).toEqualTypeOf<BaseSheet.Options<foundry.abstract.Document.Any>>();
expectTypeOf(baseSheet.options).toEqualTypeOf<BaseSheet.Options<Actor>>();
expectTypeOf(baseSheet.getData()).toEqualTypeOf<Promise<GetDataReturnType<BaseSheet.BaseSheetData>>>();
expectTypeOf(baseSheet.render(true)).toEqualTypeOf<BaseSheet>();

// test a different type
declare const item: Item;
const itemBaseSheet = new BaseSheet(item);

expectTypeOf(itemBaseSheet.object).toEqualTypeOf<Item>();
expectTypeOf(itemBaseSheet.document).toEqualTypeOf<Item>();
expectTypeOf(itemBaseSheet.options).toEqualTypeOf<BaseSheet.Options<Item>>();
expectTypeOf(itemBaseSheet.getData()).toEqualTypeOf<Promise<GetDataReturnType<BaseSheet.BaseSheetData>>>();
expectTypeOf(itemBaseSheet.render(true)).toEqualTypeOf<BaseSheet>();
