import { expectTypeOf } from "vitest";

declare const baseMacro: foundry.documents.BaseMacro;
declare const macro: Macro;

// @ts-expect-error - a BaseMacro is not a Macro
new MacroConfig(baseMacro);

const config = new MacroConfig(macro);
expectTypeOf(config.object).toEqualTypeOf<Macro>();

const withCustomOptions = new MacroConfig<DocumentSheetOptions<Macro.Implementation> & { custom: true }>(macro);
expectTypeOf(withCustomOptions.options).toEqualTypeOf<DocumentSheetOptions<Macro.Implementation> & { custom: true }>();
