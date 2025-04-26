import { expectTypeOf } from "vitest";

declare const baseMacro: foundry.documents.BaseMacro;
declare const macro: Macro.Implementation;

// @ts-expect-error - a BaseMacro is not a Macro
new MacroConfig(baseMacro);

const config = new MacroConfig(macro);
expectTypeOf(config.object).toEqualTypeOf<Macro.Implementation>();

const withCustomOptions = new MacroConfig<DocumentSheet.Options<Macro.Implementation> & { custom: true }>(macro);
expectTypeOf(withCustomOptions.options).toEqualTypeOf<DocumentSheet.Options<Macro.Implementation> & { custom: true }>();
