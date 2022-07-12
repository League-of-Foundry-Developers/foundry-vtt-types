import { expectType } from 'tsd';
import type DataModel from '../../../../src/foundry/common/abstract/data.mjs';

expectType<Promise<StoredDocument<ActiveEffect> | undefined>>(foundry.documents.BaseActiveEffect.create({}));
expectType<Promise<StoredDocument<ActiveEffect>[]>>(foundry.documents.BaseActiveEffect.createDocuments([]));
expectType<Promise<ActiveEffect[]>>(foundry.documents.BaseActiveEffect.updateDocuments([]));
expectType<Promise<ActiveEffect[]>>(foundry.documents.BaseActiveEffect.deleteDocuments([]));

const activeEffect = await foundry.documents.BaseActiveEffect.create({}, { temporary: false });
activeEffect.flags;

if (activeEffect) {
  expectType<string>(activeEffect._id);
  expectType<DataModel.SchemaToData<ActiveEffect['schema']>>(activeEffect.data);
  expectType<Actor | Item | null>(activeEffect.parent);
}
