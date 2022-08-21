import { expectError, expectType } from "tsd";

declare const baseMacro: foundry.documents.BaseMacro;
declare const macro: Macro;

expectError<MacroConfig>(new MacroConfig());
expectError<MacroConfig>(new MacroConfig(undefined, { width: 100 }));
expectError(new MacroConfig(baseMacro));

const config = new MacroConfig(macro);
expectType<Macro>(config.object);
expectType<Macro>(config.getData().document);
expectType<Array<"script" | "chat">>(config.getData().macroTypes);
expectType<readonly ["global", "actors", "actor"]>(config.getData().macroScopes);
expectType<MacroConfig.Options>(config.getData().options);

const withCustomOptions = new MacroConfig<DocumentSheetOptions & { custom: true }>(macro);
expectType<DocumentSheetOptions & { custom: true }>(withCustomOptions.options);
expectType<DocumentSheetOptions & { custom: true }>(withCustomOptions.getData().options);

const withCustomData = new MacroConfig<DocumentSheetOptions, { macro: Macro }>(macro);
expectType<{ macro: Macro }>(withCustomData.getData());
