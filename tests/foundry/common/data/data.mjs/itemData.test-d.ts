import { expectTypeOf } from "vitest";

interface ArmorDataSourceData {
  armorValue: number;
}

interface ArmorDataSource {
  type: "armor";
  data: ArmorDataSourceData;
}

interface WeaponDataSourceData {
  damagePerHit: number;
  attackSpeed: number;
}

interface WeaponDataSource {
  type: "weapon";
  data: WeaponDataSourceData;
}

interface ArmorDataPropertiesData extends ArmorDataSourceData {
  weight: number;
}

interface ArmorDataProperties {
  type: "armor";
  data: ArmorDataPropertiesData;
}

interface WeaponDataPropertiesData extends WeaponDataSourceData {
  damage: number;
}

interface WeaponDataProperties {
  type: "weapon";
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

// @ts-expect-error - ItemData requires data.
new foundry.data.ItemData();

// @ts-expect-error - ItemData requires a name and a type.
new foundry.data.ItemData({});

// @ts-expect-error - "foo" is not a configured type for an Item.
new foundry.data.ItemData({ name: "Some Item With Wrong Type", type: "foo" });

const itemData = new foundry.data.ItemData({ name: "Some Item", type: "weapon" });

expectTypeOf(itemData).toEqualTypeOf<foundry.data.ItemData>();
expectTypeOf(itemData.type).toEqualTypeOf<"weapon" | "armor">();
if (itemData._source.type === "armor") {
  expectTypeOf(itemData._source.data.armorValue).toEqualTypeOf<number>();

  // @ts-expect-error - "weight" is not a valid property of ArmorDataSourceData
  itemData._source.data.weight;
} else {
  expectTypeOf(itemData._source.data.attackSpeed).toEqualTypeOf<number>();
  expectTypeOf(itemData._source.data.damagePerHit).toEqualTypeOf<number>();

  // @ts-expect-error - "damage" is not a valid property of WeaponDataSourceData
  itemData._source.data.damage;
}

if (itemData.type === "armor") {
  expectTypeOf(itemData.data.armorValue).toEqualTypeOf<number>();
  expectTypeOf(itemData.data.weight).toEqualTypeOf<number>();
} else {
  expectTypeOf(itemData.data.attackSpeed).toEqualTypeOf<number>();
  expectTypeOf(itemData.data.damagePerHit).toEqualTypeOf<number>();
  expectTypeOf(itemData.data.damage).toEqualTypeOf<number>();
}
