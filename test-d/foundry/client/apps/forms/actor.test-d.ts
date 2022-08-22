import { expectType } from "tsd";

const actorSheet = new ActorSheet(new Actor({ name: "Some dude", type: "character" }));
expectType<Actor>(actorSheet.object);
expectType<Actor>(actorSheet.actor);
expectType<TokenDocument | null>(actorSheet.token);
