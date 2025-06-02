import { expectTypeOf } from "vitest";
import type { MaybePromise } from "fvtt-types/utils";

declare const actor: Actor.Implementation;
const actorSheet = new ActorSheet(actor);

expectTypeOf(actorSheet.object).toEqualTypeOf<Actor.Implementation>();
expectTypeOf(actorSheet.document).toEqualTypeOf<Actor.Implementation>();
expectTypeOf(ActorSheet.defaultOptions).toEqualTypeOf<ActorSheet.Options>();
expectTypeOf(actorSheet.options).toEqualTypeOf<ActorSheet.Options>();
expectTypeOf(actorSheet.getData()).toEqualTypeOf<MaybePromise<object>>();
expectTypeOf(actorSheet.render(true)).toEqualTypeOf<ActorSheet>();

expectTypeOf(actorSheet.actor).toEqualTypeOf<Actor.Implementation>();
expectTypeOf(actorSheet.token).toEqualTypeOf<TokenDocument.Implementation | null>();
