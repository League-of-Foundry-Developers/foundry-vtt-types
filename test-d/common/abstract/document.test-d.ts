import { expectType } from 'tsd';
import '../../../../index';
import EmbeddedCollection from '../../../src/common/abstract/embeddedCollection';
import { PropertiesToSource } from '../../../src/common/abstract/helperTypes';
import { ActiveEffectDataProperties } from '../../../src/common/data/data/activeEffectData';
import { EffectChangeData, EffectChangeDataProperties } from '../../../src/common/data/data/effectChangeData';

const baseActiveEffect = new foundry.documents.BaseActiveEffect();

expectType<EffectChangeDataProperties[]>(baseActiveEffect.toJSON().changes);
expectType<EffectChangeDataProperties[]>(baseActiveEffect.toObject().changes);
expectType<EffectChangeDataProperties[]>(baseActiveEffect.toObject(true).changes);
expectType<EffectChangeData[]>(baseActiveEffect.toObject(false).changes);

const item = await Item.create();

expectType<EmbeddedCollection<typeof ActiveEffect, foundry.data.ItemData>>(item.toObject(false).effects);
expectType<PropertiesToSource<ActiveEffectDataProperties>[]>(item.toObject().effects);

expectType<Promise<Macro>>(foundry.documents.BaseMacro.create());
expectType<Promise<Macro[]>>(foundry.documents.BaseMacro.createDocuments([]));
expectType<Promise<Macro[]>>(foundry.documents.BaseMacro.updateDocuments([]));
expectType<Promise<Macro[]>>(foundry.documents.BaseMacro.deleteDocuments([]));
