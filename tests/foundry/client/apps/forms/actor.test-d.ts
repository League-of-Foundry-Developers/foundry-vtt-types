import { expectTypeOf } from "vitest";

const actorSheet = new ActorSheet(new Actor({ name: "Some dude", type: "character" }));
expectTypeOf(actorSheet.object).toEqualTypeOf<Actor>();
expectTypeOf(actorSheet.actor).toEqualTypeOf<Actor>();
expectTypeOf(actorSheet.token).toEqualTypeOf<TokenDocument | null>();
