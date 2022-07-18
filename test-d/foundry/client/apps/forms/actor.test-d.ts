import type { ToObjectFalseType } from '../../../../../src/types/helperTypes';

import { expectType } from 'tsd';

const actorSheet = new ActorSheet(new Actor({ name: 'Some dude', type: 'character' }));
expectType<Actor>(actorSheet.object);
expectType<Actor>(actorSheet.actor);
expectType<Actor>((await actorSheet.getData()).actor);
expectType<ToObjectFalseType<foundry.documents.BaseItem>[]>((await actorSheet.getData()).items);
expectType<ToObjectFalseType<foundry.documents.BaseActiveEffect>[]>((await actorSheet.getData()).effects);
expectType<ActorSheet.Options>((await actorSheet.getData()).options);
expectType<TokenDocument | null>(actorSheet.token);
