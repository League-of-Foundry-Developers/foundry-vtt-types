import { expectType } from 'tsd';
import '../../../../index';

expectType<Promise<ActiveEffect | undefined>>(foundry.documents.BaseActiveEffect.create({}));
expectType<Promise<ActiveEffect[]>>(foundry.documents.BaseActiveEffect.createDocuments([]));
expectType<Promise<ActiveEffect[]>>(foundry.documents.BaseActiveEffect.updateDocuments([]));
expectType<Promise<ActiveEffect[]>>(foundry.documents.BaseActiveEffect.deleteDocuments([]));

const activeEffect = await foundry.documents.BaseActiveEffect.create({});
if (activeEffect) {
  expectType<foundry.data.ActiveEffectData>(activeEffect.data);
  expectType<Actor | Item | null>(activeEffect.parent);
}
