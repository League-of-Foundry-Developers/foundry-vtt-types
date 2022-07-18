import { expectError, expectType } from 'tsd';
import type DataModel from '../../../../src/foundry/common/abstract/data.mjs';

import type EmbeddedCollection from '../../../../src/foundry/common/abstract/embedded-collection.mjs';
import type { EffectDurationData } from '../../../../src/foundry/common/documents/active-effect.mjs.js';

import '../../../../../index';

interface CharacterDataSourceData {
  health: number;
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

expectError(new foundry.documents.BaseActor());
expectError(new foundry.documents.BaseActor({}));

expectError(new foundry.documents.BaseActor({ name: 'Some Actor With Wrong Type', type: 'foo' }));

const actorData = new foundry.documents.BaseActor({ name: 'Some Actor', type: 'character' });

expectType<foundry.documents.BaseActor>(actorData);
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

const baseActor = new foundry.documents.BaseActor();
baseActor._id;

expectType<EmbeddedCollection<typeof foundry.documents.BaseActiveEffect, DataModel.Any>>(baseActor.effects);
expectType<EmbeddedCollection<typeof foundry.documents.BaseItem, DataModel.Any>>(baseActor.items);
expectType<foundry.documents.BaseActiveEffect['_source']>(baseActor.data._source.effects[0]);
expectType<DataModel.SchemaToSource<EffectDurationData>>(baseActor.data._source.effects[0].duration);

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

// Flags for Actor, Items, Card, and Cards documents can be configured via the SourceConfig. This is tested here.
// For configuring flags for actors and items via FlagConfig please have a look into baseItem.test-d.ts.
// shared flags are available
expectType<boolean>(baseActor.getFlag('my-module', 'known'));
// non shared flags are not available
expectType<never>(baseActor.getFlag('my-module', 'xp'));
expectType<never>(baseActor.getFlag('my-module', 'hidden-name'));
// non shared flags are also not available if the type is known
if (baseActor.data._source.type === 'character') {
  expectType<never>(baseActor.getFlag('my-module', 'xp'));
}
if (baseActor.data.type === 'character') {
  expectType<never>(baseActor.getFlag('my-module', 'xp'));
}
expectType<'Actor'>(baseActor.documentName);
