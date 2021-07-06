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
expectType<EffectDurationDataProperties>(baseActor.data._source.effects[0].duration);

interface CharacterDataSourceData {
  health: number;
}

interface CharacterFlags {
  'my-module': {
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

expectType<'character' | 'npc'>(baseActor.data.type);
expectType<Actor | null>(baseActor.items.get('', { strict: true }).parent);

if (baseActor.data._source.type === 'character') {
  expectType<number>(baseActor.data._source.data.health);
  expectError(baseActor.data._source.data.movement);
  expectType<number>(baseActor.getFlag('my-module', 'xp'));
} else {
  expectType<string>(baseActor.data._source.data.faction);
  expectType<number>(baseActor.data._source.data.challenge);
  expectError(baseActor.data._source.data.damage);
  expectType<string>(baseActor.getFlag('my-module', 'hidden-name'));
}

if (baseActor.data.type === 'character') {
  expectType<number>(baseActor.data.data.health);
  expectType<number>(baseActor.data.data.movement);
  expectType<number>(baseActor.getFlag('my-module', 'xp'));
} else {
  expectType<string>(baseActor.data.data.faction);
  expectType<number>(baseActor.data.data.challenge);
  expectType<number>(baseActor.data.data.damage);
  expectType<string>(baseActor.getFlag('my-module', 'hidden-name'));
}

expectType<number | undefined>(baseActor.getFlag('my-module', 'xp'));
expectType<string | undefined>(baseActor.getFlag('my-module', 'hidden-name'));
