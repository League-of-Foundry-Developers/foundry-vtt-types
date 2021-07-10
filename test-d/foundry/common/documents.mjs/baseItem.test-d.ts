import { expectError, expectType } from 'tsd';
import '../../../../index';
import EmbeddedCollection from '../../../../src/foundry/common/abstract/embedded-collection.mjs';
import { BaseItem } from '../../../../src/foundry/common/documents.mjs';
import { PropertiesToSource } from '../../../../src/types/helperTypes';
import { ActiveEffectDataProperties } from '../../../../src/foundry/common/data/data.mjs/activeEffectData';
import { EffectDurationDataProperties } from '../../../../src/foundry/common/data/data.mjs/effectDurationData';

const baseItem = new foundry.documents.BaseItem();
expectType<EmbeddedCollection<typeof ActiveEffect, foundry.data.ItemData>>(baseItem.effects);
expectType<PropertiesToSource<ActiveEffectDataProperties>>(baseItem.data._source.effects[0]);
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

// Flags for actors and items can be configured via the FlagConfig. This is tested here.
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
