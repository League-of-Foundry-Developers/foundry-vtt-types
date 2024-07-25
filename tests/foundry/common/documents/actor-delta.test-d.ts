import { expectTypeOf } from "vitest";
import type EmbeddedCollectionDelta from "../../../../src/foundry/common/abstract/embedded-collection-delta.d.mts";

const myDelta = new foundry.documents.BaseActorDelta();

expectTypeOf(myDelta.id).toEqualTypeOf<string | null>();
expectTypeOf(myDelta.effects).toEqualTypeOf<EmbeddedCollectionDelta<ActiveEffect, ActorDelta>>();
