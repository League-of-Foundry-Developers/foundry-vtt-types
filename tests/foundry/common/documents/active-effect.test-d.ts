import { expectTypeOf } from "vitest";

expectTypeOf(foundry.documents.BaseActiveEffect.create({})).branded.toEqualTypeOf<
  Promise<ActiveEffect.Stored | undefined>
>();
expectTypeOf(foundry.documents.BaseActiveEffect.createDocuments([])).branded.toEqualTypeOf<
  Promise<ActiveEffect.Stored[]>
>();
expectTypeOf(foundry.documents.BaseActiveEffect.updateDocuments([])).toEqualTypeOf<
  Promise<ActiveEffect.Implementation[]>
>();
expectTypeOf(foundry.documents.BaseActiveEffect.deleteDocuments([])).toEqualTypeOf<
  Promise<ActiveEffect.Implementation[]>
>();

const activeEffect = await foundry.documents.BaseActiveEffect.create({}, { temporary: true });
if (activeEffect) {
  expectTypeOf(activeEffect.parent).toEqualTypeOf<Actor.Implementation | Item.Implementation | null>();

  expectTypeOf(activeEffect.changes).toEqualTypeOf<ActiveEffect.EffectChangeData[]>();
}
