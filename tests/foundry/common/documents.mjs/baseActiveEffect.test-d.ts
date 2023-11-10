import { expectTypeOf } from "vitest";

expectTypeOf(foundry.documents.BaseActiveEffect.create({})).toEqualTypeOf<
  Promise<StoredDocument<ActiveEffect> | undefined>
>();
expectTypeOf(foundry.documents.BaseActiveEffect.createDocuments([])).toEqualTypeOf<
  Promise<StoredDocument<ActiveEffect>[]>
>();
expectTypeOf(foundry.documents.BaseActiveEffect.updateDocuments([])).toEqualTypeOf<Promise<ActiveEffect[]>>();
expectTypeOf(foundry.documents.BaseActiveEffect.deleteDocuments([])).toEqualTypeOf<Promise<ActiveEffect[]>>();

const activeEffect = await foundry.documents.BaseActiveEffect.create({}, { temporary: true });
if (activeEffect) {
  expectTypeOf(activeEffect.data).toEqualTypeOf<foundry.data.ActiveEffectData>();
  expectTypeOf(activeEffect.parent).toEqualTypeOf<Actor | Item | null>();
}
