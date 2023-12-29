import { expectTypeOf } from "vitest";

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
  expectTypeOf(item.actor).toEqualTypeOf<Actor | null>();
  expectTypeOf(item.img).toEqualTypeOf<string | null>();
  expectTypeOf(item.isOwned).toEqualTypeOf<boolean>();
  expectTypeOf(item.transferredEffects).toEqualTypeOf<ActiveEffect[]>();
  expectTypeOf(item.type).toEqualTypeOf<"weapon" | "armor">();
  expectTypeOf(item.getRollData()).toEqualTypeOf<object>();
}
