import { expectTypeOf } from "vitest";
// import type { ArmorData, WeaponData } from "./item.test-d";

// No data is required but `parent` is.
const actorDelta = new ActorDelta.implementation(undefined, {
  parent: new TokenDocument.implementation(),
});

expectTypeOf(actorDelta).toEqualTypeOf<ActorDelta.Implementation>();

expectTypeOf(actorDelta.apply("")).toEqualTypeOf<Actor.Implementation>();
expectTypeOf(actorDelta.prepareEmbeddedDocuments()).toEqualTypeOf<void>();
expectTypeOf(actorDelta.updateSource()).toEqualTypeOf<object>();
expectTypeOf(actorDelta.reset()).toEqualTypeOf<void>();
expectTypeOf(actorDelta.updateSyntheticActor()).toEqualTypeOf<void>();
expectTypeOf(actorDelta.restore()).toEqualTypeOf<Promise<Actor.Implementation>>();
