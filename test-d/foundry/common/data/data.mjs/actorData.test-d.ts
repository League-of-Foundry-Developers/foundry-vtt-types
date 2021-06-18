import { expectError, expectType } from 'tsd';
import '../../../../../index';

interface CharacterDataSourceData {
  health: number;
}

interface CharacterDataSource {
  type: 'character';
  data: CharacterDataSourceData;
}

interface CharacterDataPropertiesData extends CharacterDataSourceData {
  movement: number;
}

interface CharacterDataProperties {
  type: 'character';
  data: CharacterDataPropertiesData;
}

interface NPCDataSourceData {
  challenge: number;
  faction: string;
}

interface NPCDataSource {
  type: 'npc';
  data: NPCDataSourceData;
}

interface NPCDataPropertiesData extends NPCDataSourceData {
  damage: number;
}

interface NPCDataProperties {
  type: 'npc';
  data: NPCDataPropertiesData;
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

expectError(new foundry.data.ActorData({ name: 'Some Actor With Wrong Type', type: 'foo' }));

const actorData = new foundry.data.ActorData({ name: 'Some Actor', type: 'character' });

expectType<foundry.data.ActorData>(actorData);
expectType<'character' | 'npc'>(actorData.type);
if (actorData._source.type === 'character') {
  expectType<number>(actorData._source.data.health);
  expectError(actorData._source.data.movement);
} else {
  expectType<string>(actorData._source.data.faction);
  expectType<number>(actorData._source.data.challenge);
  expectError(actorData._source.data.damage);
}

if (actorData.type === 'character') {
  expectType<number>(actorData.data.health);
  expectType<number>(actorData.data.movement);
} else {
  expectType<string>(actorData.data.faction);
  expectType<number>(actorData.data.challenge);
  expectType<number>(actorData.data.damage);
}
