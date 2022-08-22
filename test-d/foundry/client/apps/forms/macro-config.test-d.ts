import { expectError, expectType } from "tsd";

declare const baseMacro: foundry.documents.BaseMacro;
declare const macro: Macro;

expectError<MacroConfig>(new MacroConfig());
expectError<MacroConfig>(new MacroConfig(undefined, { width: 100 }));
expectError(new MacroConfig(baseMacro));

const config = new MacroConfig(macro);
expectType<Macro>(config.object);

const withCustomOptions = new MacroConfig<DocumentSheetOptions & { custom: true }>(macro);
expectType<DocumentSheetOptions & { custom: true }>(withCustomOptions.options);
