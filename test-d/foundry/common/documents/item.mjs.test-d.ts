import { expectError, expectType } from "tsd";

import type EmbeddedCollection from "../../../../src/foundry/common/abstract/embedded-collection.mjs";
import type { BaseItem } from "../../../../src/foundry/common/documents/module.mjs";

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

const armorItem = new foundry.documents.BaseItem({ name: "plate", type: "armor" });
const weaponItem = new foundry.documents.BaseItem({ name: "sword", type: "weapon" });

expectType<EmbeddedCollection<typeof ActiveEffect, foundry.documents.BaseItem>>(weaponItem.effects);
expectType<ActiveEffectData>(weaponItem._source.effects[0]);
expectType<EffectDurationData>(weaponItem._source.effects[0].duration);
expectType<Item | undefined>(weaponItem.parent?.items.get("", { strict: true }));

expectType<"armor">(armorItem.type);
expectType<number>(armorItem._source.system.armorValue);
expectError(armorItem._source.system.weight);
expectType<number>(armorItem.system.armorValue);
expectType<number>(armorItem.system.weight);

expectType<"weapon">(weaponItem.type);
expectType<number>(weaponItem._source.system.attackSpeed);
expectType<number>(weaponItem._source.system.damagePerHit);
expectError(weaponItem._source.system.damage);
expectType<number>(weaponItem.system.attackSpeed);
expectType<number>(weaponItem.system.damagePerHit);
expectType<number>(weaponItem.system.damage);

declare const unknownItem: foundry.documents.BaseItem<"armor" | "weapon">;
if ("attackSpeed" in unknownItem._source.system) {
  expectType<WeaponSystemSource>(unknownItem._source.system);
}
if ("attackSpeed" in unknownItem.system) {
  expectType<WeaponSystemProperties>(unknownItem.system);
}

// Flags for Actor, Item, Card, and Cards documents can be configured via the FlagConfig. This is tested here.
// For configuring flags for actors and items via SourceConfig please have a look into baseActor.test-d.ts.
declare global {
  interface FlagConfig {
    Item: {
      "my-system": {
        countable: boolean;
      };
    };
  }
}
expectType<{ countable: boolean }>(weaponItem.flags["my-system"]);

expectType<boolean>(weaponItem.getFlag("my-system", "countable"));
expectType<never>(weaponItem.getFlag("my-system", "unknown-key"));
expectType<unknown>(weaponItem.getFlag("another-system", "value"));

expectType<Promise<BaseItem>>(weaponItem.setFlag("my-system", "countable", true));
expectError(weaponItem.setFlag("my-system", "countable", 2));
expectError(weaponItem.setFlag("my-system", "unknown-key", 2));
expectType<Promise<BaseItem>>(weaponItem.setFlag("another-system", "value", true));
