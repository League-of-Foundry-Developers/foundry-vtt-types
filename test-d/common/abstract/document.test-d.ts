import { expectType } from 'tsd';
import '../../../../index';
import { EffectChangeData, EffectChangeDataProperties } from '../../../src/common/data/data/effectChangeData';

const baseActiveEffect = new foundry.documents.BaseActiveEffect();

expectType<EffectChangeDataProperties[]>(baseActiveEffect.toJSON().changes);
expectType<EffectChangeDataProperties[]>(baseActiveEffect.toObject().changes);
expectType<EffectChangeDataProperties[]>(baseActiveEffect.toObject(true).changes);
expectType<EffectChangeData[]>(baseActiveEffect.toObject(false).changes);
