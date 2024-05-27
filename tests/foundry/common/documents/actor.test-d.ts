import { expectTypeOf } from "vitest";
import type EmbeddedCollection from "../../../../src/foundry/common/abstract/embedded-collection.d.mts";

const baseActor = new foundry.documents.BaseActor({ name: "foo", type: "base" });
expectTypeOf(baseActor.effects).toEqualTypeOf<EmbeddedCollection<typeof ActiveEffect>>();
expectTypeOf(baseActor.items).toEqualTypeOf<EmbeddedCollection<typeof Item, foundry.data.ActorData>>();
expectTypeOf(baseActor._source.effects[0]!).toEqualTypeOf<ActiveEffectData>();
expectTypeOf(baseActor._source.effects[0]!.duration).toEqualTypeOf<EffectDurationData>();

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
  expectTypeOf(baseActor.system.health).toEqualTypeOf<number>();
  expectTypeOf(baseActor.system.movement).toEqualTypeOf<number>();
} else {
  expectTypeOf(baseActor.system.faction).toEqualTypeOf<string>();
  expectTypeOf(baseActor.system.challenge).toEqualTypeOf<number>();
  expectTypeOf(baseActor.system.damage).toEqualTypeOf<number>();
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
