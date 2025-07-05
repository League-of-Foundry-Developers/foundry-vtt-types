import { expectTypeOf } from "vitest";

declare const scene: foundry.documents.Scene;
const doc = new TokenDocument.implementation({}, { parent: scene });
expectTypeOf(doc.actor).toEqualTypeOf<Actor.Implementation | null>();
expectTypeOf(doc.isOwner).toEqualTypeOf<boolean>();
expectTypeOf(doc.isLinked).toEqualTypeOf<boolean>();
expectTypeOf(doc.combatant).toEqualTypeOf<Combatant.Implementation | null>();
expectTypeOf(doc.inCombat).toEqualTypeOf<boolean>();
expectTypeOf(doc.clone()).toEqualTypeOf<TokenDocument.Implementation>();
expectTypeOf(doc.clone({}, { save: true })).toEqualTypeOf<Promise<TokenDocument.Implementation>>();
expectTypeOf(doc.actor).toEqualTypeOf<Actor.Implementation | null>();

// Can't get more specific due to delta concerns
expectTypeOf(doc.getEmbeddedCollection("Item")).toEqualTypeOf<foundry.utils.Collection<Item.Implementation>>();
expectTypeOf(doc.getEmbeddedCollection("ActiveEffect")).toEqualTypeOf<
  foundry.utils.Collection<ActiveEffect.Implementation>
>();
