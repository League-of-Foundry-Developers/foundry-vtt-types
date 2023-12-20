import { expectTypeOf } from "vitest";

import type EmbeddedCollection from "../../../../src/foundry/common/abstract/embedded-collection.mjs.js";
import type { BaseItem } from "../../../../src/foundry/common/documents.mjs/index.js";
import type { ActiveEffectDataSource } from "../../../../src/foundry/common/data/data.mjs/activeEffectData.js";
import type { EffectDurationDataProperties } from "../../../../src/foundry/common/data/data.mjs/effectDurationData.js";

const baseItem = new foundry.documents.BaseItem();
expectTypeOf(baseItem.effects).toEqualTypeOf<EmbeddedCollection<typeof ActiveEffect, foundry.data.ItemData>>();
expectTypeOf(baseItem.data._source.effects[0]).toEqualTypeOf<ActiveEffectDataSource>();
expectTypeOf(baseItem.data._source.effects[0].duration).toEqualTypeOf<EffectDurationDataProperties>();

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

expectTypeOf(baseItem.data.type).toEqualTypeOf<"weapon" | "armor">();
expectTypeOf(baseItem.parent?.items.get("", { strict: true })).toEqualTypeOf<Item | undefined>();

if (baseItem.data._source.type === "armor") {
  expectTypeOf(baseItem.data._source.data.armorValue).toEqualTypeOf<number>();

  // @ts-expect-error - "weight" is not a valid property of ArmorDataSourceData
  baseItem.data._source.data.weight;
} else {
  expectTypeOf(baseItem.data._source.data.attackSpeed).toEqualTypeOf<number>();
  expectTypeOf(baseItem.data._source.data.damagePerHit).toEqualTypeOf<number>();

  // @ts-expect-error - "damage" is not a valid property of WeaponDataSourceData
  baseItem.data._source.data.damage;
}

if (baseItem.data.type === "armor") {
  expectTypeOf(baseItem.data.data.armorValue).toEqualTypeOf<number>();
  expectTypeOf(baseItem.data.data.weight).toEqualTypeOf<number>();
} else {
  expectTypeOf(baseItem.data.data.attackSpeed).toEqualTypeOf<number>();
  expectTypeOf(baseItem.data.data.damagePerHit).toEqualTypeOf<number>();
  expectTypeOf(baseItem.data.data.damage).toEqualTypeOf<number>();
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
expectTypeOf(baseItem.data.flags["my-system"]).toEqualTypeOf<{ countable: boolean }>();

expectTypeOf(baseItem.getFlag("my-system", "countable")).toEqualTypeOf<boolean>();
expectTypeOf(baseItem.getFlag("my-system", "unknown-key")).toEqualTypeOf<never>();
expectTypeOf(baseItem.getFlag("another-system", "value")).toEqualTypeOf<unknown>();

expectTypeOf(baseItem.setFlag("my-system", "countable", true)).toEqualTypeOf<Promise<BaseItem>>();

// @ts-expect-error - my-system.countable is a boolean not a number.
baseItem.setFlag("my-system", "countable", 2);

// @ts-expect-error - my-system.unknown-key does not exist.
baseItem.setFlag("my-system", "unknown-key", 2);

expectTypeOf(baseItem.setFlag("another-system", "value", true)).toEqualTypeOf<Promise<BaseItem>>();
