import { expectTypeOf } from "vitest";
import type { MaybePromise } from "fvtt-types/utils";

declare const rollTable: RollTable.Implementation;
const rollTableConfig = new RollTableConfig(rollTable);

expectTypeOf(rollTableConfig.object).toEqualTypeOf<RollTable.Implementation>();
expectTypeOf(rollTableConfig.document).toEqualTypeOf<RollTable.Implementation>();
expectTypeOf(RollTableConfig.defaultOptions).toEqualTypeOf<DocumentSheet.Options<RollTable.Implementation>>();
expectTypeOf(rollTableConfig.options).toEqualTypeOf<DocumentSheet.Options<RollTable.Implementation>>();
expectTypeOf(rollTableConfig.getData()).toEqualTypeOf<MaybePromise<object>>();
expectTypeOf(rollTableConfig.render(true)).toEqualTypeOf<RollTableConfig>();

expectTypeOf(rollTableConfig.title).toEqualTypeOf<string>();
