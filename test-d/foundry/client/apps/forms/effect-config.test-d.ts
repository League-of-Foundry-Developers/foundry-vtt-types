import { expectError, expectType } from "tsd";

expectError(new ActiveEffectConfig(new foundry.documents.BaseActiveEffect()));

const config = new ActiveEffectConfig(new ActiveEffect());
expectType<ActiveEffect>(config.object);
expectType<DocumentSheetOptions<ActiveEffect>>(config.options);

const withCustomOptions = new ActiveEffectConfig<DocumentSheetOptions<ActiveEffect> & { custom: true }>(
  new ActiveEffect(),
);
expectType<DocumentSheetOptions<ActiveEffect> & { custom: true }>(withCustomOptions.options);
