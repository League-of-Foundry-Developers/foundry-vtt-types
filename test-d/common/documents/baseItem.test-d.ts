import { expectType } from 'tsd';
import '../../../../index';
import EmbeddedCollection from '../../../src/common/abstract/embeddedCollection';
import { PropertiesToSource } from '../../../src/common/abstract/helperTypes';
import { ActiveEffectDataProperties } from '../../../src/common/data/data/activeEffectData';
import { EffectDurationDataProperties } from '../../../src/common/data/data/effectDurationData';

const baseItem = new foundry.documents.BaseItem();
expectType<EmbeddedCollection<typeof ActiveEffect, foundry.data.ItemData>>(baseItem.effects);
expectType<PropertiesToSource<ActiveEffectDataProperties>>(baseItem.data._source.effects[0]);
expectType<EffectDurationDataProperties | undefined>(baseItem.data._source.effects[0].duration);
