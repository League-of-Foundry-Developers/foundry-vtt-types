import { expectError, expectType } from 'tsd';
import '../../../../index';
import {
  EffectChangeData,
  EffectChangeDataProperties
} from '../../../../src/foundry/common/data/data.mjs/effectChangeData';

expectError(new foundry.data.ActorData());
expectError(new foundry.data.ActorData({}));

const activeEffectData = new foundry.data.ActiveEffectData();
expectType<EffectChangeDataProperties[]>(activeEffectData.toJSON().changes);
expectType<EffectChangeDataProperties[]>(activeEffectData.toObject().changes);
expectType<EffectChangeDataProperties[]>(activeEffectData.toObject(true).changes);
expectType<EffectChangeData[]>(activeEffectData.toObject(false).changes);
