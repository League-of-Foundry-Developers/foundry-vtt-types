import { expectTypeOf } from "vitest";

const doc = new TokenDocument({}, { parent: new foundry.documents.BaseScene({ name: "foo" }) });
expectTypeOf(doc.actor).toEqualTypeOf<Actor.ConfiguredInstance | null>();
expectTypeOf(doc.isOwner).toEqualTypeOf<boolean>();
expectTypeOf(doc.isLinked).toEqualTypeOf<boolean>();
expectTypeOf(doc.combatant).toEqualTypeOf<Combatant.ConfiguredInstance | null>();
expectTypeOf(doc.inCombat).toEqualTypeOf<boolean>();
expectTypeOf(doc.clone()).toEqualTypeOf<TokenDocument>();
expectTypeOf(doc.clone({}, { save: true })).toEqualTypeOf<Promise<TokenDocument>>();
expectTypeOf(doc.actor).toEqualTypeOf<Actor.ConfiguredInstance | null>();

// Can't get more specific due to delta concerns
expectTypeOf(doc.getEmbeddedCollection("Item")).toEqualTypeOf<foundry.utils.Collection<Item.ConfiguredInstance>>();
expectTypeOf(doc.getEmbeddedCollection("ActiveEffect")).toEqualTypeOf<
  foundry.utils.Collection<ActiveEffect.ConfiguredInstance>
>();
