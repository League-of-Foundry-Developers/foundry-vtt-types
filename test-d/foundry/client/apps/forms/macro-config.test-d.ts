import { expectError, expectType } from "tsd";

declare const baseMacro: foundry.documents.BaseMacro;
declare const macro: Macro;

expectError(new MacroConfig(baseMacro));

const config = new MacroConfig(macro);
expectType<Macro>(config.object);

const withCustomOptions = new MacroConfig<DocumentSheetOptions<Macro> & { custom: true }>(macro);
expectType<DocumentSheetOptions<Macro> & { custom: true }>(withCustomOptions.options);
