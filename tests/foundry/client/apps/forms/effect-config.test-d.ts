import { expectTypeOf } from "vitest";

// @ts-expect-error - a BaseActiveEffect is not a ActiveEffect
new ActiveEffectConfig(new foundry.documents.BaseActiveEffect());

const config = new ActiveEffectConfig(new ActiveEffect());
expectTypeOf(config.object).toEqualTypeOf<ActiveEffect>();
expectTypeOf(config.options).toEqualTypeOf<DocumentSheetOptions<ActiveEffect.ConfiguredInstance>>();

const withCustomOptions = new ActiveEffectConfig<
  DocumentSheetOptions<ActiveEffect.ConfiguredInstance> & { custom: true }
>(new ActiveEffect());
expectTypeOf(withCustomOptions.options).toEqualTypeOf<
  DocumentSheetOptions<ActiveEffect.ConfiguredInstance> & { custom: true }
>();
