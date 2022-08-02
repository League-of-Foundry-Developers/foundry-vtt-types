import { expectError, expectType } from 'tsd';

import type EmbeddedCollection from '../../../../src/foundry/common/abstract/embedded-collection.mjs';
import type BaseItem from '../../../../src/foundry/common/documents/item.mjs';
import type BaseActiveEffect from '../../../../src/foundry/common/documents/active-effect.mjs';
import type { EffectDurationDataProperties } from '../../../../src/foundry/common/data/data.mjs.d.ts/effectDurationData';

import '../../../../../index';

const baseItem = new foundry.documents.BaseItem();
expectType<EmbeddedCollection<typeof ActiveEffect, foundry.documents.BaseItem>>(baseItem.effects);
expectType<BaseActiveEffect['_source']>(baseItem.data._source.effects[0]);
expectType<EffectDurationDataProperties>(baseItem.data._source.effects[0].duration);

interface ArmorDataSourceData {
  armorValue: number;
}

interface ArmorDataSource {
  type: 'armor';
  data: ArmorDataSourceData;
}

interface WeaponDataSourceData {
  damagePerHit: number;
  attackSpeed: number;
}

interface WeaponDataSource {
  type: 'weapon';
  data: WeaponDataSourceData;
}

interface ArmorDataPropertiesData extends ArmorDataSourceData {
  weight: number;
}

interface ArmorDataProperties {
  type: 'armor';
  data: ArmorDataPropertiesData;
}

interface WeaponDataPropertiesData extends WeaponDataSourceData {
  damage: number;
}

interface WeaponDataProperties {
  type: 'weapon';
  data: WeaponDataPropertiesData;
}

type MyItemDataSource = ArmorDataSource | WeaponDataSource;
type MyItemDataProperties = ArmorDataProperties | WeaponDataProperties;

declare global {
  interface DataConfig {
    Item: MyItemDataProperties;
  }

  interface SourceConfig {
    Item: MyItemDataSource;
  }
}

expectType<'weapon' | 'armor'>(baseItem.data.type);
expectType<Item | undefined>(baseItem.parent?.items.get('', { strict: true }));

if (baseItem.data._source.type === 'armor') {
  expectType<number>(baseItem.data._source.data.armorValue);
  expectError(baseItem.data._source.data.weight);
} else {
  expectType<number>(baseItem.data._source.data.attackSpeed);
  expectType<number>(baseItem.data._source.data.damagePerHit);
  expectError(baseItem.data._source.data.damage);
}

if (baseItem.data.type === 'armor') {
  expectType<number>(baseItem.data.data.armorValue);
  expectType<number>(baseItem.data.data.weight);
} else {
  expectType<number>(baseItem.data.data.attackSpeed);
  expectType<number>(baseItem.data.data.damagePerHit);
  expectType<number>(baseItem.data.data.damage);
}

// Flags for Actor, Item, Card, and Cards documents can be configured via the FlagConfig. This is tested here.
// For configuring flags for actors and items via SourceConfig please have a look into baseActor.test-d.ts.
declare global {
  interface FlagConfig {
    Item: {
      'my-system': {
        countable: boolean;
      };
    };
  }
}
expectType<{ countable: boolean }>(baseItem.data.flags['my-system']);

expectType<boolean>(baseItem.getFlag('my-system', 'countable'));
expectType<never>(baseItem.getFlag('my-system', 'unknown-key'));
expectType<unknown>(baseItem.getFlag('another-system', 'value'));

expectType<Promise<BaseItem>>(baseItem.setFlag('my-system', 'countable', true));
expectError(baseItem.setFlag('my-system', 'countable', 2));
expectError(baseItem.setFlag('my-system', 'unknown-key', 2));
expectType<Promise<BaseItem>>(baseItem.setFlag('another-system', 'value', true));

expectError(new foundry.documents.BaseItem());
expectError(new foundry.documents.BaseItem({}));

expectError(new foundry.documents.BaseItem({ name: 'Some Item With Wrong Type', type: 'foo' }));

const itemData = new foundry.documents.BaseItem({ name: 'Some Item', type: 'weapon' });

expectType<foundry.documents.BaseItem>(itemData);
expectType<'weapon' | 'armor'>(itemData.type);
if (itemData._source.type === 'armor') {
  expectType<number>(itemData._source.data.armorValue);
  expectError(itemData._source.data.weight);
} else {
  expectType<number>(itemData._source.data.attackSpeed);
  expectType<number>(itemData._source.data.damagePerHit);
  expectError(itemData._source.data.damage);
}

if (itemData.type === 'armor') {
  expectType<number>(itemData.data.armorValue);
  expectType<number>(itemData.data.weight);
} else {
  expectType<number>(itemData.data.attackSpeed);
  expectType<number>(itemData.data.damagePerHit);
  expectType<number>(itemData.data.damage);
}
