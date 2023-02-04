import { expectType } from "tsd";

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

const item = await Item.create({ name: "Mighty Axe of Killing", type: "weapon" });
if (item) {
  expectType<Actor | null>(item.actor);
  expectType<string | null>(item.img);
  expectType<boolean>(item.isOwned);
  expectType<ActiveEffect[]>(item.transferredEffects);
  expectType<"weapon" | "armor">(item.type);
  expectType<object>(item.getRollData());
}
