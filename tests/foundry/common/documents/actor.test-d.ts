import { expectTypeOf } from "vitest";
import type EmbeddedCollection from "../../../../src/foundry/common/abstract/embedded-collection.d.mts";

// @ts-expect-error name and type are required
new foundry.documents.BaseActor();

// @ts-expect-error name and type are required
new foundry.documents.BaseActor({});

const baseActor = new foundry.documents.BaseActor({ name: "foo", type: "base" });
expectTypeOf(baseActor.name).toEqualTypeOf<string>();
expectTypeOf(baseActor.effects).toEqualTypeOf<EmbeddedCollection<ActiveEffect, Actor>>();
expectTypeOf(baseActor.effects.get("")).toEqualTypeOf<ActiveEffect | undefined>();
expectTypeOf(baseActor.effects.get("")!.name).toEqualTypeOf<string>();
expectTypeOf(baseActor.items).toEqualTypeOf<EmbeddedCollection<Item, Actor>>();
expectTypeOf(baseActor.items.get("")).toEqualTypeOf<Item | undefined>();
expectTypeOf(baseActor.items.get("")!.img).toEqualTypeOf<string | null | undefined>();
expectTypeOf(baseActor._source.effects[0]!).toEqualTypeOf<ActiveEffectData>();
expectTypeOf(baseActor._source.effects[0]!.duration.seconds).toEqualTypeOf<number | null | undefined>();

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

// expectTypeOf(baseActor.type).toEqualTypeOf<"character" | "npc">();
// expectTypeOf(baseActor.items.get("", { strict: true }).parent).toEqualTypeOf<Actor | null>();

// if (baseActor._source.type === "character") {
//   expectTypeOf(baseActor._source.health).toEqualTypeOf<number>();

//   // @ts-expect-error "movement" is not a valid property of CharacterDataSourceData.
//   baseActor._source.movement;
// } else {
//   expectTypeOf(baseActor._source.faction).toEqualTypeOf<string>();
//   expectTypeOf(baseActor._source.challenge).toEqualTypeOf<number>();

//   // @ts-expect-error "damage" is not a valid property of NPCDataSourceData.
//   baseActor._source.damage;
// }

// if (baseActor.type === "character") {
//   expectTypeOf(baseActor.system.health).toEqualTypeOf<number>();
//   expectTypeOf(baseActor.system.movement).toEqualTypeOf<number>();
// } else {
//   expectTypeOf(baseActor.system.faction).toEqualTypeOf<string>();
//   expectTypeOf(baseActor.system.challenge).toEqualTypeOf<number>();
//   expectTypeOf(baseActor.system.damage).toEqualTypeOf<number>();
// }

// // Flags for Actor, Items, Card, and Cards documents can be configured via the SourceConfig. This is tested here.
// // For configuring flags for actors and items via FlagConfig please have a look into baseItem.test-d.ts.
// // shared flags are available
// expectTypeOf(baseActor.getFlag("my-module", "known")).toEqualTypeOf<boolean>();
// // non shared flags are not available
// expectTypeOf(baseActor.getFlag("my-module", "xp")).toEqualTypeOf<never>();
// expectTypeOf(baseActor.getFlag("my-module", "hidden-name")).toEqualTypeOf<never>();
// // non shared flags are also not available if the type is known
// if (baseActor._source.type === "character") {
//   expectTypeOf(baseActor.getFlag("my-module", "xp")).toEqualTypeOf<never>();
// }
// if (baseActor.type === "character") {
//   expectTypeOf(baseActor.getFlag("my-module", "xp")).toEqualTypeOf<never>();
// }
expectTypeOf(baseActor.documentName).toEqualTypeOf<"Actor">();
