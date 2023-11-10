import { expectTypeOf } from "vitest";
import "../../../../../index";

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

// @ts-expect-error - An ActorData requires data.
new foundry.data.ActorData();

// @ts-expect-error - An ActorData requires a name and type.
new foundry.data.ActorData({});

// @ts-expect-error - The type "foo" has not been configured as a valid actor type.
new foundry.data.ActorData({ name: "Some Actor With Wrong Type", type: "foo" });

const actorData = new foundry.data.ActorData({ name: "Some Actor", type: "character" });

expectTypeOf(actorData).toEqualTypeOf<foundry.data.ActorData>();
expectTypeOf(actorData.type).toEqualTypeOf<"character" | "npc">();

if (actorData._source.type === "character") {
  expectTypeOf(actorData._source.data.health).toEqualTypeOf<number>();

  // @ts-expect-error - The property "movement" does not exist on the character _source.
  actorData._source.data.movement;

  expectTypeOf(actorData._source.flags["my-module"].xp).toEqualTypeOf<number>();
} else {
  expectTypeOf(actorData._source.data.faction).toEqualTypeOf<string>();
  expectTypeOf(actorData._source.data.challenge).toEqualTypeOf<number>();

  // @ts-expect-error - The property "damage" does not exist on the npc _source.
  actorData._source.data.damage;

  expectTypeOf(actorData._source.flags["my-module"]["hidden-name"]).toEqualTypeOf<string>();
}

if (actorData.type === "character") {
  expectTypeOf(actorData.data.health).toEqualTypeOf<number>();
  expectTypeOf(actorData.data.movement).toEqualTypeOf<number>();
  expectTypeOf(actorData.flags["my-module"].xp).toEqualTypeOf<number>();
} else {
  expectTypeOf(actorData.data.faction).toEqualTypeOf<string>();
  expectTypeOf(actorData.data.challenge).toEqualTypeOf<number>();
  expectTypeOf(actorData.data.damage).toEqualTypeOf<number>();
  expectTypeOf(actorData.flags["my-module"]["hidden-name"]).toEqualTypeOf<string>();
}
