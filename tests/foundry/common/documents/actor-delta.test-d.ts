import { expectTypeOf } from "vitest";
import EmbeddedCollectionDelta = foundry.abstract.EmbeddedCollectionDelta;

const myDelta = new foundry.documents.BaseActorDelta();

expectTypeOf(myDelta.id).toEqualTypeOf<string | null>();
expectTypeOf(myDelta.effects).toEqualTypeOf<EmbeddedCollectionDelta<ActiveEffect, ActorDelta>>();
