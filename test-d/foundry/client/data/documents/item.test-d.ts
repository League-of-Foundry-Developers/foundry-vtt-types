import { expectType } from "tsd";

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
  expectType<Actor | null>(item.actor);
  expectType<string | null>(item.thumbnail);
  expectType<boolean>(item.isOwned);
  expectType<ActiveEffect[]>(item.transferredEffects);
  expectType<"weapon" | "armor">(item.type);
  expectType<object>(item.getRollData());
}
