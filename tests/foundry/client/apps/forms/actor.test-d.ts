import { expectTypeOf } from "vitest";
import type { MaybePromise } from "../../../../../src/utils/index.d.mts";

const actor = new Actor({ name: "Joe", type: "base" });
const actorSheet = new ActorSheet(actor);

expectTypeOf(actorSheet.object).toEqualTypeOf<Actor>();
expectTypeOf(actorSheet.document).toEqualTypeOf<Actor>();
expectTypeOf(ActorSheet.defaultOptions).toEqualTypeOf<ActorSheet.Options>();
expectTypeOf(actorSheet.options).toEqualTypeOf<ActorSheet.Options>();
expectTypeOf(actorSheet.getData()).toEqualTypeOf<MaybePromise<object>>();
expectTypeOf(actorSheet.render(true)).toEqualTypeOf<ActorSheet>();

expectTypeOf(actorSheet.actor).toEqualTypeOf<Actor>();
expectTypeOf(actorSheet.token).toEqualTypeOf<TokenDocument | null>();
