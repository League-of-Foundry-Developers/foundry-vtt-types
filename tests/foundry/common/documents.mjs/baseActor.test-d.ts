import { expectTypeOf } from "vitest";
import type EmbeddedCollection from "../../../../src/foundry/common/abstract/embedded-collection.mts";
import type { ActiveEffectDataSource } from "../../../../src/foundry/common/data/data.mjs/activeEffectData.mts";
import type { EffectDurationDataProperties } from "../../../../src/foundry/common/data/data.mjs/effectDurationData.mts";

const baseActor = new foundry.documents.BaseActor();
expectTypeOf(baseActor.effects).toEqualTypeOf<EmbeddedCollection<typeof ActiveEffect, foundry.data.ActorData>>();
expectTypeOf(baseActor.items).toEqualTypeOf<EmbeddedCollection<typeof Item, foundry.data.ActorData>>();
expectTypeOf(baseActor.data._source.effects[0]).toEqualTypeOf<ActiveEffectDataSource>();
expectTypeOf(baseActor.data._source.effects[0].duration).toEqualTypeOf<EffectDurationDataProperties>();

interface CharacterDataSourceData {
  health: number;
}

interface CharacterFlags {
  "my-module": {
    known: boolean;
    xp: number;
  };
}

interface CharacterDataSource {
  type: "character";
  data: CharacterDataSourceData;
  flags: CharacterFlags;
}

interface CharacterDataPropertiesData extends CharacterDataSourceData {
  movement: number;
}

interface CharacterDataProperties {
  type: "character";
  data: CharacterDataPropertiesData;
  flags: CharacterFlags;
}

interface NPCDataSourceData {
  challenge: number;
  faction: string;
}

interface NPCFlags {
  "my-module": {
    "hidden-name": string;
    known: boolean;
  };
}

interface NPCDataSource {
  type: "npc";
  data: NPCDataSourceData;
  flags: NPCFlags;
}

interface NPCDataPropertiesData extends NPCDataSourceData {
  damage: number;
}

interface NPCDataProperties {
  type: "npc";
  data: NPCDataPropertiesData;
  flags: NPCFlags;
}

type MyActorDataSource = CharacterDataSource | NPCDataSource;
type MyActorDataProperties = CharacterDataProperties | NPCDataProperties;

declare global {
  interface DataConfig {
    Actor: MyActorDataProperties;
  }

  interface SourceConfig {
    Actor: MyActorDataSource;
  }
}

expectTypeOf(baseActor.data.type).toEqualTypeOf<"character" | "npc">();
expectTypeOf(baseActor.items.get("", { strict: true }).parent).toEqualTypeOf<Actor | null>();

if (baseActor.data._source.type === "character") {
  expectTypeOf(baseActor.data._source.data.health).toEqualTypeOf<number>();

  // @ts-expect-error "movement" is not a valid property of CharacterDataSourceData.
  baseActor.data._source.data.movement;
} else {
  expectTypeOf(baseActor.data._source.data.faction).toEqualTypeOf<string>();
  expectTypeOf(baseActor.data._source.data.challenge).toEqualTypeOf<number>();

  // @ts-expect-error "damage" is not a valid property of NPCDataSourceData.
  baseActor.data._source.data.damage;
}

if (baseActor.data.type === "character") {
  expectTypeOf(baseActor.data.data.health).toEqualTypeOf<number>();
  expectTypeOf(baseActor.data.data.movement).toEqualTypeOf<number>();
} else {
  expectTypeOf(baseActor.data.data.faction).toEqualTypeOf<string>();
  expectTypeOf(baseActor.data.data.challenge).toEqualTypeOf<number>();
  expectTypeOf(baseActor.data.data.damage).toEqualTypeOf<number>();
}

// Flags for Actor, Items, Card, and Cards documents can be configured via the SourceConfig. This is tested here.
// For configuring flags for actors and items via FlagConfig please have a look into baseItem.test-d.ts.
// shared flags are available
expectTypeOf(baseActor.getFlag("my-module", "known")).toEqualTypeOf<boolean>();
// non shared flags are not available
expectTypeOf(baseActor.getFlag("my-module", "xp")).toEqualTypeOf<never>();
expectTypeOf(baseActor.getFlag("my-module", "hidden-name")).toEqualTypeOf<never>();
// non shared flags are also not available if the type is known
if (baseActor.data._source.type === "character") {
  expectTypeOf(baseActor.getFlag("my-module", "xp")).toEqualTypeOf<never>();
}
if (baseActor.data.type === "character") {
  expectTypeOf(baseActor.getFlag("my-module", "xp")).toEqualTypeOf<never>();
}
expectTypeOf(baseActor.documentName).toEqualTypeOf<"Actor">();
