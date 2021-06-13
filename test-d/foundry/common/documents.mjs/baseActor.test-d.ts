import { expectError, expectType } from 'tsd';
import '../../../../index';
import EmbeddedCollection from '../../../../src/foundry/common/abstract/embedded-collection.mjs';
import { PropertiesToSource } from '../../../../src/types/helperTypes';
import { ActiveEffectDataProperties } from '../../../../src/foundry/common/data/data.mjs/activeEffectData';
import { EffectDurationDataProperties } from '../../../../src/foundry/common/data/data.mjs/effectDurationData';

const baseActor = new foundry.documents.BaseActor();
expectType<EmbeddedCollection<typeof ActiveEffect, foundry.data.ActorData>>(baseActor.effects);
expectType<EmbeddedCollection<typeof Item, foundry.data.ActorData>>(baseActor.items);
expectType<PropertiesToSource<ActiveEffectDataProperties>>(baseActor.data._source.effects[0]);
expectType<EffectDurationDataProperties | undefined>(baseActor.data._source.effects[0].duration);

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

expectType<'character' | 'npc'>(baseActor.data.type);

if (baseActor.data._source.type === 'character') {
  expectType<number>(baseActor.data._source.data.health);
  expectError(baseActor.data._source.data.movement);
} else {
  expectType<string>(baseActor.data._source.data.faction);
  expectType<number>(baseActor.data._source.data.challenge);
  expectError(baseActor.data._source.data.damage);
}

if (baseActor.data.type === 'character') {
  expectType<number>(baseActor.data.data.health);
  expectType<number>(baseActor.data.data.movement);
} else {
  expectType<string>(baseActor.data.data.faction);
  expectType<number>(baseActor.data.data.challenge);
  expectType<number>(baseActor.data.data.damage);
}
