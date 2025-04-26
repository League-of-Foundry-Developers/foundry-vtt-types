import { expectTypeOf } from "vitest";
import type { GetDataReturnType, MaybePromise } from "fvtt-types/utils";

// @ts-expect-error - a BaseActiveEffect is not a ActiveEffect
new ActiveEffectConfig(new foundry.documents.BaseActiveEffect());

declare const effect: ActiveEffect.Implementation;
const config = new ActiveEffectConfig(effect);
expectTypeOf(config.object).toEqualTypeOf<ActiveEffect.Implementation>();
expectTypeOf(config.object).toEqualTypeOf<ActiveEffect.Implementation>();
expectTypeOf(config.document).toEqualTypeOf<ActiveEffect.Implementation>();
expectTypeOf(ActiveEffectConfig.defaultOptions).toEqualTypeOf<DocumentSheet.Options<ActiveEffect.Implementation>>();
expectTypeOf(config.options).toEqualTypeOf<DocumentSheet.Options<ActiveEffect.Implementation>>();
expectTypeOf(config.getData()).toEqualTypeOf<
  MaybePromise<GetDataReturnType<ActiveEffectConfig.ActiveEffectConfigData>>
>();
expectTypeOf(config.render(true)).toEqualTypeOf<ActiveEffectConfig>();

const withCustomOptions = new ActiveEffectConfig<DocumentSheet.Options<ActiveEffect.Implementation> & { custom: true }>(
  new ActiveEffect.implementation(),
);
expectTypeOf(withCustomOptions.options).toEqualTypeOf<
  DocumentSheet.Options<ActiveEffect.Implementation> & { custom: true }
>();
