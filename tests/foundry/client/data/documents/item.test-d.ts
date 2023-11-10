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

const item = await Item.create({ name: "Mighty Axe of Killing", type: "weapon" });
if (item) {
  expectTypeOf(item.actor).toEqualTypeOf<Actor | null>();
  expectTypeOf(item.img).toEqualTypeOf<string | null>();
  expectTypeOf(item.isOwned).toEqualTypeOf<boolean>();
  expectTypeOf(item.transferredEffects).toEqualTypeOf<ActiveEffect[]>();
  expectTypeOf(item.type).toEqualTypeOf<"weapon" | "armor">();
  expectTypeOf(item.getRollData()).toEqualTypeOf<object>();
}
