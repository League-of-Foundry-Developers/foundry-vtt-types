import { expectError, expectType } from 'tsd';
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

// verify that document lifecycle methods work with source data is possible

if (item) {
  expectType<Promise<Item[]>>(Item.createDocuments([item.toObject()]));
  expectType<Promise<Item | undefined>>(Item.create(item.toObject()));
  expectType<Promise<Item[]>>(Item.updateDocuments([item.toObject()]));
  expectType<Promise<Item | undefined>>(item.update(item.toObject()));
  expectType<Item | Promise<Item | undefined>>(item.clone(item.toObject()));
}

declare global {
  interface FlagConfig {
    Combatant: {
      'my-system': {
        value: boolean;
        value2: number;
      };
      'my-optional-system'?: {
        value: boolean;
      };
    };
  }
}

const combatant = new Combatant({}, {});
expectType<{ value: boolean; value2: number }>(combatant.data.flags['my-system']);
expectType<{ value: boolean } | undefined>(combatant.data.flags['my-optional-system']);

expectType<boolean>(combatant.getFlag('my-system', 'value'));
expectType<number>(combatant.getFlag('my-system', 'value2'));
expectType<never>(combatant.getFlag('my-system', 'unknown-key'));
expectType<unknown>(combatant.getFlag('another-system', 'value'));
expectType<boolean | undefined>(combatant.getFlag('my-optional-system', 'value'));

expectType<Promise<Combatant>>(combatant.setFlag('my-system', 'value', true));
expectError(combatant.setFlag('my-system', 'value', 2));
expectError(combatant.setFlag('my-system', 'unknown-key', 2));
expectType<Promise<Combatant>>(combatant.setFlag('my-optional-system', 'value', true));
expectError(combatant.setFlag('my-optional-system', 'value', undefined));
expectType<Promise<Combatant>>(combatant.setFlag('another-system', 'value', true));

expectType<Promise<Combatant>>(combatant.unsetFlag('my-system', 'value'));
expectType<Promise<Combatant>>(combatant.unsetFlag('my-optional-system', 'value'));
expectType<Promise<Combatant>>(combatant.unsetFlag('another-system', 'value'));

class MyCombatant extends Combatant {
  setSomeFlag() {
    expectType<{ value: boolean; value2: number }>(this.data.flags['my-system']);
    expectType<{ value: boolean } | undefined>(this.data.flags['my-optional-system']);

    expectType<boolean>(this.getFlag('my-system', 'value'));
    expectType<unknown>(this.getFlag('another-system', 'value'));

    expectType<Promise<this>>(this.setFlag('my-system', 'value', true));
    expectType<Promise<this>>(this.setFlag('another-system', 'value', true));
  }
}
