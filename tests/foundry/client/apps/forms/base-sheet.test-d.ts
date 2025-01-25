import { expectTypeOf } from "vitest";
import type { GetDataReturnType } from "fvtt-types/utils";

const actor = new Actor({ name: "Joe", type: "base" });
const baseSheet = new BaseSheet(actor);

expectTypeOf(baseSheet.object).toEqualTypeOf<Actor>();
expectTypeOf(baseSheet.document).toEqualTypeOf<Actor>();
expectTypeOf(BaseSheet.defaultOptions).toEqualTypeOf<BaseSheet.Options>();
expectTypeOf(baseSheet.options).toEqualTypeOf<BaseSheet.Options>();
expectTypeOf(baseSheet.getData()).toEqualTypeOf<Promise<GetDataReturnType<BaseSheet.BaseSheetData>>>();
expectTypeOf(baseSheet.render(true)).toEqualTypeOf<BaseSheet>();
