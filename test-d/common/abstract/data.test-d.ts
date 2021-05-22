import { expectType } from 'tsd';
import '../../../../index';
import { EffectChangeData, EffectChangeDataProperties } from '../../../src/common/data/data/effectChangeData';

const activeEffectData = new foundry.data.ActiveEffectData();

expectType<EffectChangeDataProperties[]>(activeEffectData.toJSON().changes);
expectType<EffectChangeDataProperties[]>(activeEffectData.toObject().changes);
expectType<EffectChangeDataProperties[]>(activeEffectData.toObject(true).changes);
expectType<EffectChangeData[]>(activeEffectData.toObject(false).changes);
