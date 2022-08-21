import type { ToObjectFalseType } from "../../../../../src/types/helperTypes";

import { expectType } from "tsd";

const actorSheet = new ActorSheet(new Actor({ name: "Some dude", type: "character" }));
expectType<Actor>(actorSheet.object);
expectType<Actor>(actorSheet.actor);
expectType<Actor>((await actorSheet.getData()).actor);
expectType<ToObjectFalseType<foundry.data.ItemData>[]>((await actorSheet.getData()).items);
expectType<ToObjectFalseType<foundry.data.ActiveEffectData>[]>((await actorSheet.getData()).effects);
expectType<ActorSheet.Options>((await actorSheet.getData()).options);
expectType<TokenDocument | null>(actorSheet.token);
