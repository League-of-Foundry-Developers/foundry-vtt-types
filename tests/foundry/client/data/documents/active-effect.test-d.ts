import { expectTypeOf } from "vitest";
import type { DataModel, Document } from "../../../../../src/foundry/common/abstract/module.d.mts";

// @ts-expect-error - Adventure requires name.
new ActiveEffect();

// @ts-expect-error - Adventure requires name.
new ActiveEffect({});

const effect = new ActiveEffect({ name: "My effect" });
expectTypeOf(effect).toEqualTypeOf<ActiveEffect>();

declare const model: DataModel.Any;
declare const change: EffectChangeData;

expectTypeOf(ActiveEffect.fromStatusEffect("")).toEqualTypeOf<Promise<ActiveEffect.ConfiguredInstance>>();
expectTypeOf(ActiveEffect.applyField(model, change)).toEqualTypeOf<unknown>();

expectTypeOf(effect.isSuppressed).toEqualTypeOf<boolean>();
expectTypeOf(effect.target).toEqualTypeOf<Document.Any | null>();
expectTypeOf(effect.active).toEqualTypeOf<boolean>();
expectTypeOf(effect.modifiesActor).toEqualTypeOf<boolean>();
expectTypeOf(effect.prepareBaseData()).toEqualTypeOf<void>();
expectTypeOf(effect.prepareDerivedData()).toEqualTypeOf<void>();
expectTypeOf(effect.updateDuration()).toEqualTypeOf<ActiveEffectDuration>();
expectTypeOf(effect.isTemporary).toEqualTypeOf<boolean>();
expectTypeOf(effect.sourceName).toEqualTypeOf<string>();

declare const actor: Actor.ConfiguredInstance;
expectTypeOf(effect.apply(actor, change)).toEqualTypeOf<unknown>();
