import { expectTypeOf } from "vitest";
import type EmbeddedCollection from "../../../../src/foundry/common/abstract/embedded-collection.d.mts";

// @ts-expect-error Item requires a name and type
new foundry.documents.BaseItem();

// @ts-expect-error Item requires a name and type
new foundry.documents.BaseItem({});

const baseItem = new foundry.documents.BaseItem({ name: "foo", type: "base" });
expectTypeOf(baseItem.effects).toEqualTypeOf<EmbeddedCollection<typeof ActiveEffect, foundry.ItemData>>();
expectTypeOf(baseItem._source.effects[0]).toEqualTypeOf<ActiveEffectDataSource>();
expectTypeOf(baseItem._source.effects[0].duration).toEqualTypeOf<EffectDurationDataProperties>();

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

expectTypeOf(baseItem.type).toEqualTypeOf<"weapon" | "armor">();
expectTypeOf(baseItem.parent?.items.get("", { strict: true })).toEqualTypeOf<Item | undefined>();

if (baseItem._source.type === "armor") {
  expectTypeOf(baseItem._source.armorValue).toEqualTypeOf<number>();

  // @ts-expect-error - "weight" is not a valid property of ArmorDataSourceData
  baseItem._source.weight;
} else {
  expectTypeOf(baseItem._source.attackSpeed).toEqualTypeOf<number>();
  expectTypeOf(baseItem._source.damagePerHit).toEqualTypeOf<number>();

  // @ts-expect-error - "damage" is not a valid property of WeaponDataSourceData
  baseItem._source.damage;
}

if (baseItem.type === "armor") {
  expectTypeOf(baseItem.system.armorValue).toEqualTypeOf<number>();
  expectTypeOf(baseItem.system.weight).toEqualTypeOf<number>();
} else {
  expectTypeOf(baseItem.system.attackSpeed).toEqualTypeOf<number>();
  expectTypeOf(baseItem.system.damagePerHit).toEqualTypeOf<number>();
  expectTypeOf(baseItem.system.damage).toEqualTypeOf<number>();
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
expectTypeOf(baseItem.flags["my-system"]).toEqualTypeOf<{ countable: boolean }>();

expectTypeOf(baseItem.getFlag("my-system", "countable")).toEqualTypeOf<boolean>();
expectTypeOf(baseItem.getFlag("my-system", "unknown-key")).toEqualTypeOf<never>();
expectTypeOf(baseItem.getFlag("another-system", "value")).toEqualTypeOf<unknown>();

expectTypeOf(baseItem.setFlag("my-system", "countable", true)).toEqualTypeOf<Promise<BaseItem>>();

// @ts-expect-error - my-system.countable is a boolean not a number.
baseItem.setFlag("my-system", "countable", 2);

// @ts-expect-error - my-system.unknown-key does not exist.
baseItem.setFlag("my-system", "unknown-key", 2);

expectTypeOf(baseItem.setFlag("another-system", "value", true)).toEqualTypeOf<Promise<BaseItem>>();
