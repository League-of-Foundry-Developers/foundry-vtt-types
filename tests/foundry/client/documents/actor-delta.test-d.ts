import { expectTypeOf } from "vitest";
// import type { ArmorData, WeaponData } from "./item.test-d";

// No data is required but `parent` is.
const actorDelta = new ActorDelta.implementation(undefined, {
  parent: new TokenDocument.implementation(),
});

// // @ts-expect-error `ActorDelta.defaultName` requires `context` for pack information.
ActorDelta.defaultName();

// Note: this call will fail at runtime but a validator function to require `pack` or `parent` has not yet been written.
expectTypeOf(ActorDelta.defaultName({})).toBeString();

// // @ts-expect-error `ActorDelta.createDialog` requires `createOptions` for pack information.
await ActorDelta.createDialog({});

expectTypeOf(actorDelta).toEqualTypeOf<ActorDelta.Implementation>();

expectTypeOf(actorDelta.apply({})).toEqualTypeOf<Actor.Implementation | null>();
expectTypeOf(actorDelta.prepareEmbeddedDocuments()).toEqualTypeOf<void>();
expectTypeOf(actorDelta.updateSource()).toEqualTypeOf<object>();
expectTypeOf(actorDelta.reset()).toEqualTypeOf<void>();
expectTypeOf(actorDelta.updateSyntheticActor()).toEqualTypeOf<void>();
expectTypeOf(actorDelta.restore()).toEqualTypeOf<Promise<Actor.Implementation>>();
