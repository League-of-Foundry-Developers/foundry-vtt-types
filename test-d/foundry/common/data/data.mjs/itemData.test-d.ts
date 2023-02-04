import { expectError, expectType } from "tsd";
import "../../../../../index";

interface ArmorSystemSource {
  armorValue: number;
}

interface WeaponSystemSource {
  damagePerHit: number;
  attackSpeed: number;
}

interface ArmorSystemProperties extends ArmorSystemSource {
  weight: number;
}

interface WeaponSystemProperties extends WeaponSystemSource {
  damage: number;
}

declare global {
  interface ItemPropertiesConfig {
    armor: ArmorSystemProperties;
    weapon: WeaponSystemProperties;
  }

  interface ItemSourceConfig {
    armor: ArmorSystemSource;
    weapon: WeaponSystemSource;
  }
}

expectError(new foundry.data.ItemData());
expectError(new foundry.data.ItemData({}));

expectError(new foundry.data.ItemData({ name: "Some Item With Wrong Type", type: "foo" }));

const itemData = new foundry.data.ItemData({ name: "Some Item", type: "weapon" });

expectType<foundry.data.ItemData>(itemData);
expectType<"weapon" | "armor">(itemData.type);
if (itemData._source.type === "armor") {
  expectType<number>(itemData._source.data.armorValue);
  expectError(itemData._source.data.weight);
} else {
  expectType<number>(itemData._source.data.attackSpeed);
  expectType<number>(itemData._source.data.damagePerHit);
  expectError(itemData._source.data.damage);
}

if (itemData.type === "armor") {
  expectType<number>(itemData.data.armorValue);
  expectType<number>(itemData.data.weight);
} else {
  expectType<number>(itemData.data.attackSpeed);
  expectType<number>(itemData.data.damagePerHit);
  expectType<number>(itemData.data.damage);
}
