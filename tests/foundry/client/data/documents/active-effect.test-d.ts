import { expectTypeOf } from "vitest";

import DataModel = foundry.abstract.DataModel;
import Document = foundry.abstract.Document;

// @ts-expect-error - ActiveEffect requires name.
new ActiveEffect();

// @ts-expect-error - ActiveEffect requires name.
new ActiveEffect({});

const effect = new ActiveEffect({ name: "My effect" });
expectTypeOf(effect).toEqualTypeOf<ActiveEffect.Implementation>();

declare const model: DataModel.Any;
declare const change: ActiveEffect.EffectChangeData;

expectTypeOf(ActiveEffect.fromStatusEffect("")).toEqualTypeOf<Promise<ActiveEffect.Implementation>>();
expectTypeOf(ActiveEffect.applyField(model, change)).toEqualTypeOf<unknown>();

expectTypeOf(effect.isSuppressed).toEqualTypeOf<boolean>();
expectTypeOf(effect.target).toEqualTypeOf<Document.Any | null>();
expectTypeOf(effect.active).toEqualTypeOf<boolean>();
expectTypeOf(effect.modifiesActor).toEqualTypeOf<boolean>();
expectTypeOf(effect.prepareBaseData()).toEqualTypeOf<void>();
expectTypeOf(effect.prepareDerivedData()).toEqualTypeOf<void>();
expectTypeOf(effect.updateDuration()).toEqualTypeOf<ActiveEffect.Duration>();
expectTypeOf(effect.isTemporary).toEqualTypeOf<boolean>();
expectTypeOf(effect.sourceName).toEqualTypeOf<string>();

declare const actor: Actor.Implementation;
expectTypeOf(effect.apply(actor, change)).toEqualTypeOf<unknown>();
