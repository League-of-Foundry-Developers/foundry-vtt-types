import { expectType } from 'tsd';
import '../../../../index';
import { PropertiesToSource } from '../../../../src/types/helperTypes';
import { ActiveEffectDataProperties } from '../../../../src/foundry/common/data/data.mjs/activeEffectData';
import {
  EffectChangeData,
  EffectChangeDataProperties
} from '../../../../src/foundry/common/data/data.mjs/effectChangeData';

const baseActiveEffect = new foundry.documents.BaseActiveEffect();

expectType<EffectChangeDataProperties[]>(baseActiveEffect.toJSON().changes);
expectType<EffectChangeDataProperties[]>(baseActiveEffect.toObject().changes);
expectType<EffectChangeDataProperties[]>(baseActiveEffect.toObject(true).changes);
expectType<EffectChangeData[]>(baseActiveEffect.toObject(false).changes);

const item = await Item.create({ name: 'Some Item', type: 'weapon' });
if (item) {
  expectType<EffectChangeData[]>(item.toObject(false).effects[0].changes);
  expectType<PropertiesToSource<ActiveEffectDataProperties>[]>(item.toObject().effects);
}
expectType<Promise<Macro | undefined>>(foundry.documents.BaseMacro.create({ name: '' }));
expectType<Promise<Macro[]>>(foundry.documents.BaseMacro.createDocuments([]));
expectType<Promise<Macro[]>>(foundry.documents.BaseMacro.updateDocuments([]));
expectType<Promise<Macro[]>>(foundry.documents.BaseMacro.deleteDocuments([]));
const user = await User.create({ name: 'Some User' });
if (user) {
  expectType<boolean>(user.testUserPermission(user, 'NONE'));
  expectType<boolean>(user.testUserPermission(user, 'OBSERVER', {}));
  expectType<boolean>(user.testUserPermission(user, 'LIMITED', { exact: true }));
  expectType<boolean>(user.testUserPermission(user, 'OWNER', { exact: false }));
}
