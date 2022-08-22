import { expectError, expectType } from "tsd";

expectError<ActiveEffectConfig>(new ActiveEffectConfig());
expectError<ActiveEffectConfig>(new ActiveEffectConfig(undefined, { width: 100 }));
expectError(new ActiveEffectConfig(new foundry.documents.BaseActiveEffect()));

const config = new ActiveEffectConfig(new ActiveEffect());
expectType<ActiveEffect>(config.object);
expectType<DocumentSheetOptions>(config.options);

const withCustomOptions = new ActiveEffectConfig<DocumentSheetOptions & { custom: true }>(new ActiveEffect());
expectType<DocumentSheetOptions & { custom: true }>(withCustomOptions.options);
