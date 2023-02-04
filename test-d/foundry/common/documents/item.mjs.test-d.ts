import { expectError, expectType } from "tsd";

import type EmbeddedCollection from "../../../../src/foundry/common/abstract/embedded-collection.mjs";
import type { BaseItem } from "../../../../src/foundry/common/documents/module.mjs";

const baseItem = new foundry.documents.BaseItem({ name: "foo", type: "weapon" });
expectType<EmbeddedCollection<typeof ActiveEffect, foundry.documents.BaseItem>>(baseItem.effects);
expectType<ActiveEffectData>(baseItem._source.effects[0]);
expectType<EffectDurationData>(baseItem._source.effects[0].duration);

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

expectType<"weapon" | "armor">(baseItem.type);
expectType<Item | undefined>(baseItem.parent?.items.get("", { strict: true }));

if (baseItem._source.type === "armor") {
  expectType<number>(baseItem._source.system.armorValue);
  expectError(baseItem._source.system.weight);
} else {
  expectType<number>(baseItem._source.system.attackSpeed);
  expectType<number>(baseItem._source.system.damagePerHit);
  expectError(baseItem._source.system.damage);
}

if (baseItem.type === "armor") {
  expectType<number>(baseItem.system.armorValue);
  expectType<number>(baseItem.system.weight);
} else {
  expectType<number>(baseItem.system.attackSpeed);
  expectType<number>(baseItem.system.damagePerHit);
  expectType<number>(baseItem.system.damage);
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
expectType<{ countable: boolean }>(baseItem.flags["my-system"]);

expectType<boolean>(baseItem.getFlag("my-system", "countable"));
expectType<never>(baseItem.getFlag("my-system", "unknown-key"));
expectType<unknown>(baseItem.getFlag("another-system", "value"));

expectType<Promise<BaseItem>>(baseItem.setFlag("my-system", "countable", true));
expectError(baseItem.setFlag("my-system", "countable", 2));
expectError(baseItem.setFlag("my-system", "unknown-key", 2));
expectType<Promise<BaseItem>>(baseItem.setFlag("another-system", "value", true));
