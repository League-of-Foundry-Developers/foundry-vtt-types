import { expectTypeOf } from "vitest";
import type { MaybePromise } from "fvtt-types/utils";

declare const rollTable: RollTable.ConfiguredInstance;
const rollTableConfig = new RollTableConfig(rollTable);

expectTypeOf(rollTableConfig.object).toEqualTypeOf<RollTable>();
expectTypeOf(rollTableConfig.document).toEqualTypeOf<RollTable>();
expectTypeOf(RollTableConfig.defaultOptions).toEqualTypeOf<DocumentSheet.Options<RollTable.ConfiguredInstance>>();
expectTypeOf(rollTableConfig.options).toEqualTypeOf<DocumentSheet.Options<RollTable.ConfiguredInstance>>();
expectTypeOf(rollTableConfig.getData()).toEqualTypeOf<MaybePromise<object>>();
expectTypeOf(rollTableConfig.render(true)).toEqualTypeOf<RollTableConfig>();

expectTypeOf(rollTableConfig.title).toEqualTypeOf<string>();
