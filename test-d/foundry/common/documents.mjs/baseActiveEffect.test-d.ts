import { expectType } from "tsd";

expectType<Promise<StoredDocument<ActiveEffect> | undefined>>(foundry.documents.BaseActiveEffect.create({}));
expectType<Promise<StoredDocument<ActiveEffect>[]>>(foundry.documents.BaseActiveEffect.createDocuments([]));
expectType<Promise<ActiveEffect[]>>(foundry.documents.BaseActiveEffect.updateDocuments([]));
expectType<Promise<ActiveEffect[]>>(foundry.documents.BaseActiveEffect.deleteDocuments([]));

const activeEffect = await foundry.documents.BaseActiveEffect.create({}, { temporary: true });
if (activeEffect) {
  expectType<foundry.data.ActiveEffectData>(activeEffect.data);
  expectType<Actor | Item | null>(activeEffect.parent);
}
