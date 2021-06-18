import { expectError, expectType } from 'tsd';
import '../../../../../index';

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

expectError(new foundry.data.ItemData({ name: 'Some Item With Wrong Type', type: 'foo' }));

const itemData = new foundry.data.ItemData({ name: 'Some Item', type: 'weapon' });

expectType<foundry.data.ItemData>(itemData);
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
