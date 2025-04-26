import { expectTypeOf } from "vitest";
import type { GetDataReturnType } from "fvtt-types/utils";

declare const actor: Actor.Implementation;
const baseSheet = new BaseSheet(actor);

expectTypeOf(baseSheet.object).toEqualTypeOf<Actor.Implementation>();
expectTypeOf(baseSheet.document).toEqualTypeOf<Actor.Implementation>();
expectTypeOf(BaseSheet.defaultOptions).toEqualTypeOf<BaseSheet.Options<foundry.abstract.Document.Any>>();
expectTypeOf(baseSheet.options).toEqualTypeOf<BaseSheet.Options<Actor.Implementation>>();
expectTypeOf(baseSheet.getData()).toEqualTypeOf<Promise<GetDataReturnType<BaseSheet.BaseSheetData>>>();
expectTypeOf(baseSheet.render(true)).toEqualTypeOf<BaseSheet>();

// test a different type
declare const item: Item.Implementation;
const itemBaseSheet = new BaseSheet(item);

expectTypeOf(itemBaseSheet.object).toEqualTypeOf<Item.Implementation>();
expectTypeOf(itemBaseSheet.document).toEqualTypeOf<Item.Implementation>();
expectTypeOf(itemBaseSheet.options).toEqualTypeOf<BaseSheet.Options<Item.Implementation>>();
expectTypeOf(itemBaseSheet.getData()).toEqualTypeOf<Promise<GetDataReturnType<BaseSheet.BaseSheetData>>>();
expectTypeOf(itemBaseSheet.render(true)).toEqualTypeOf<BaseSheet>();
