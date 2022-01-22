import type { ToObjectFalseType } from '../../../../../../src/types/helperTypes';
import type { ActorDataSource } from '../../../../../../src/foundry/common/data/data.mjs/actorData';

import { expectType } from 'tsd';

const actorSheet = new ActorSheet(new Actor({ name: 'Some dude', type: 'character' }));
expectType<Actor>(actorSheet.object);
expectType<Actor>(actorSheet.actor);
expectType<Actor>((await actorSheet.getData()).actor);
expectType<ToObjectFalseType<foundry.data.ItemData>[]>((await actorSheet.getData()).items);
expectType<ToObjectFalseType<foundry.data.ActiveEffectData>[]>((await actorSheet.getData()).effects);
expectType<ActorSheet.Options>((await actorSheet.getData()).options);
expectType<TokenDocument | null>(actorSheet.token);

type NPC = Actor & {
  data: foundry.data.ActorData & { type: 'npc'; _source: ActorDataSource & { type: 'npc' } };
};
const npc = new Actor({ name: 'Some dude', type: 'npc' }) as NPC;
const npcSheet = new ActorSheet<ActorSheet.Options, NPC>(npc);
expectType<'npc'>(npcSheet.actor.data.type);
expectType<number>(npcSheet.actor.data.data.damage);
expectType<string>(npcSheet.actor.data._source.data.faction);
