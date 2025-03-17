import { expectTypeOf } from "vitest";
import type { GetDataReturnType, MaybePromise } from "fvtt-types/utils";

// @ts-expect-error - a BaseActiveEffect is not a ActiveEffect
new ActiveEffectConfig(new foundry.documents.BaseActiveEffect());

declare const effect: ActiveEffect;
const config = new ActiveEffectConfig(effect);
expectTypeOf(config.object).toEqualTypeOf<ActiveEffect>();
expectTypeOf(config.object).toEqualTypeOf<ActiveEffect>();
expectTypeOf(config.document).toEqualTypeOf<ActiveEffect>();
expectTypeOf(ActiveEffectConfig.defaultOptions).toEqualTypeOf<DocumentSheet.Options<ActiveEffect>>();
expectTypeOf(config.options).toEqualTypeOf<DocumentSheet.Options<ActiveEffect>>();
expectTypeOf(config.getData()).toEqualTypeOf<
  MaybePromise<GetDataReturnType<ActiveEffectConfig.ActiveEffectConfigData>>
>();
expectTypeOf(config.render(true)).toEqualTypeOf<ActiveEffectConfig>();

const withCustomOptions = new ActiveEffectConfig<DocumentSheet.Options<ActiveEffect.Implementation> & { custom: true }>(
  new ActiveEffect(),
);
expectTypeOf(withCustomOptions.options).toEqualTypeOf<
  DocumentSheet.Options<ActiveEffect.Implementation> & { custom: true }
>();
