import { expectError, expectType } from "tsd";

import type EmbeddedCollection from "../../../../src/foundry/common/abstract/embedded-collection.mjs";
import type { ActiveEffectDataSource } from "../../../../src/foundry/common/data/data.mjs/activeEffectData";
import type { EffectDurationDataProperties } from "../../../../src/foundry/common/data/data.mjs/effectDurationData";

const baseActor = new foundry.documents.BaseActor();
expectType<EmbeddedCollection<typeof ActiveEffect, foundry.data.ActorData>>(baseActor.effects);
expectType<EmbeddedCollection<typeof Item, foundry.data.ActorData>>(baseActor.items);
expectType<ActiveEffectDataSource>(baseActor.data._source.effects[0]);
expectType<EffectDurationDataProperties>(baseActor.data._source.effects[0].duration);

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

expectType<"character" | "npc">(baseActor.data.type);
expectType<Actor | null>(baseActor.items.get("", { strict: true }).parent);

if (baseActor.data._source.type === "character") {
  expectType<number>(baseActor.data._source.data.health);
  expectError(baseActor.data._source.data.movement);
} else {
  expectType<string>(baseActor.data._source.data.faction);
  expectType<number>(baseActor.data._source.data.challenge);
  expectError(baseActor.data._source.data.damage);
}

if (baseActor.data.type === "character") {
  expectType<number>(baseActor.data.data.health);
  expectType<number>(baseActor.data.data.movement);
} else {
  expectType<string>(baseActor.data.data.faction);
  expectType<number>(baseActor.data.data.challenge);
  expectType<number>(baseActor.data.data.damage);
}

// Flags for Actor, Items, Card, and Cards documents can be configured via the SourceConfig. This is tested here.
// For configuring flags for actors and items via FlagConfig please have a look into baseItem.test-d.ts.
// shared flags are available
expectType<boolean>(baseActor.getFlag("my-module", "known"));
// non shared flags are not available
expectType<never>(baseActor.getFlag("my-module", "xp"));
expectType<never>(baseActor.getFlag("my-module", "hidden-name"));
// non shared flags are also not available if the type is known
if (baseActor.data._source.type === "character") {
  expectType<never>(baseActor.getFlag("my-module", "xp"));
}
if (baseActor.data.type === "character") {
  expectType<never>(baseActor.getFlag("my-module", "xp"));
}
expectType<"Actor">(baseActor.documentName);
