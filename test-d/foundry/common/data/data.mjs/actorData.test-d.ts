import { expectError, expectType } from 'tsd';

interface CharacterDataSourceData {
  health: number;
  hands: {
    left: string | null;
    right: string | null;
  };
}

interface CharacterFlags {
  'my-module': {
    known: boolean;
    xp: number;
  };
}

interface CharacterDataSource {
  type: 'character';
  data: CharacterDataSourceData;
  flags: CharacterFlags;
}

interface CharacterDataPropertiesData extends CharacterDataSourceData {
  movement: number;
}

interface CharacterDataProperties {
  type: 'character';
  data: CharacterDataPropertiesData;
  flags: CharacterFlags;
}

interface NPCDataSourceData {
  challenge: number;
  faction: string;
}

interface NPCFlags {
  'my-module': {
    'hidden-name': string;
    known: boolean;
  };
}

interface NPCDataSource {
  type: 'npc';
  data: NPCDataSourceData;
  flags: NPCFlags;
}

interface NPCDataPropertiesData extends NPCDataSourceData {
  damage: number;
}

interface NPCDataProperties {
  type: 'npc';
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

expectError(new foundry.data.ActorData());
expectError(new foundry.data.ActorData({}));

expectError(new foundry.data.ActorData({ name: 'Some Actor With Wrong Type', type: 'foo' }));

const actorData = new foundry.data.ActorData({ name: 'Some Actor', type: 'character' });

expectType<foundry.data.ActorData>(actorData);
expectType<'character' | 'npc'>(actorData.type);
if (actorData._source.type === 'character') {
  expectType<number>(actorData._source.data.health);
  expectError(actorData._source.data.movement);
  expectType<number>(actorData._source.flags['my-module'].xp);
} else {
  expectType<string>(actorData._source.data.faction);
  expectType<number>(actorData._source.data.challenge);
  expectError(actorData._source.data.damage);
  expectType<string>(actorData._source.flags['my-module']['hidden-name']);
}

if (actorData.type === 'character') {
  expectType<number>(actorData.data.health);
  expectType<number>(actorData.data.movement);
  expectType<number>(actorData.flags['my-module'].xp);
} else {
  expectType<string>(actorData.data.faction);
  expectType<number>(actorData.data.challenge);
  expectType<number>(actorData.data.damage);
  expectType<string>(actorData.flags['my-module']['hidden-name']);
}

actorData.update({ data: { hands: { left: '' } } });
