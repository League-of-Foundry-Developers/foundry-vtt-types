import { expectTypeOf } from "vitest";
import EmbeddedCollectionDelta = foundry.abstract.EmbeddedCollectionDelta;

declare const myDelta: foundry.documents.BaseActorDelta;

expectTypeOf(myDelta.id).toEqualTypeOf<string | null>();
expectTypeOf(myDelta.effects).toEqualTypeOf<
  EmbeddedCollectionDelta<ActiveEffect.Implementation, ActorDelta.Implementation>
>();
