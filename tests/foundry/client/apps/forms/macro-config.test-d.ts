import { expectTypeOf } from "vitest";
import type { GetDataReturnType, MaybePromise } from "fvtt-types/utils";

declare const baseMacro: foundry.documents.BaseMacro;
declare const macro: Macro;

// @ts-expect-error - a BaseMacro is not a Macro
new MacroConfig(baseMacro);

const macroConfig = new MacroConfig(macro);
expectTypeOf(macroConfig.object).toEqualTypeOf<Macro>();
expectTypeOf(macroConfig.document).toEqualTypeOf<Macro>();
expectTypeOf(MacroConfig.defaultOptions).toEqualTypeOf<DocumentSheetOptions<Macro.ConfiguredInstance>>();
expectTypeOf(macroConfig.options).toEqualTypeOf<DocumentSheetOptions<Macro.ConfiguredInstance>>();
expectTypeOf(macroConfig.getData()).toEqualTypeOf<MaybePromise<GetDataReturnType<MacroConfig.MacroConfigData>>>();
expectTypeOf(macroConfig.render(true)).toEqualTypeOf<MacroConfig>();
