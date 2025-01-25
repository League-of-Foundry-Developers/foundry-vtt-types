import { expectTypeOf } from "vitest";
import type { GetDataReturnType, MaybePromise } from "../../../../../src/utils/index.d.mts";

// @ts-expect-error - a BaseActiveEffect is not a ActiveEffect
new ActiveEffectConfig(new foundry.documents.BaseActiveEffect());

const effect = new ActiveEffect({ name: "effect" });
const config = new ActiveEffectConfig(effect);
expectTypeOf(config.object).toEqualTypeOf<ActiveEffect>();
expectTypeOf(config.object).toEqualTypeOf<ActiveEffect>();
expectTypeOf(config.document).toEqualTypeOf<ActiveEffect>();
expectTypeOf(ActiveEffectConfig.defaultOptions).toEqualTypeOf<DocumentSheetOptions<ActiveEffect>>();
expectTypeOf(config.options).toEqualTypeOf<DocumentSheetOptions<ActiveEffect>>();
expectTypeOf(config.getData()).toEqualTypeOf<
  MaybePromise<GetDataReturnType<ActiveEffectConfig.ActiveEffectConfigData>>
>();
expectTypeOf(config.render(true)).toEqualTypeOf<ActiveEffectConfig>();

const withCustomOptions = new ActiveEffectConfig<
  DocumentSheetOptions<ActiveEffect.ConfiguredInstance> & { custom: true }
>(new ActiveEffect());
expectTypeOf(withCustomOptions.options).toEqualTypeOf<
  DocumentSheetOptions<ActiveEffect.ConfiguredInstance> & { custom: true }
>();
