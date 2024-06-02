import { expectTypeOf } from "vitest";
import type EmbeddedCollection from "../../../../../src/foundry/common/abstract/embedded-collection.d.mts";

const doc = new TokenDocument({}, { parent: new foundry.documents.BaseScene() });
expectTypeOf(doc.actor).toEqualTypeOf<Actor.ConfiguredInstance | null>();
expectTypeOf(doc.isOwner).toEqualTypeOf<boolean>();
expectTypeOf(doc.isLinked).toEqualTypeOf<boolean>();
expectTypeOf(doc.combatant).toEqualTypeOf<Combatant.ConfiguredInstance | null>();
expectTypeOf(doc.inCombat).toEqualTypeOf<boolean>();
expectTypeOf(doc.clone()).toEqualTypeOf<TokenDocument>();
expectTypeOf(doc.clone({}, { save: true })).toEqualTypeOf<TokenDocument>();
expectTypeOf(doc.actor).toEqualTypeOf<Actor.ConfiguredInstance | null>();
expectTypeOf(doc.modifyActorDocument({ actorLink: true, "lightAnimation.speed": 5 }, {})).toEqualTypeOf<
  Promise<[Actor.ConfiguredInstance | null]>
>();

expectTypeOf(doc.getEmbeddedCollection("Item")).toEqualTypeOf<
  EmbeddedCollection<Item.ConfiguredInstance, foundry.documents.BaseActor>
>();
expectTypeOf(doc.getEmbeddedCollection("ActiveEffect")).toEqualTypeOf<
  EmbeddedCollection<ActiveEffect.ConfiguredInstance, foundry.documents.BaseActor>
>();

expectTypeOf(
  doc.createActorEmbeddedDocuments("Item", [{ name: "My Item", "effects.": 5 }], { noHook: true }),
).toEqualTypeOf<Promise<Array<Item.ConfiguredInstance>>>();
expectTypeOf(
  doc.createActorEmbeddedDocuments("ActiveEffect", [{ icon: "path/to/my/icon", "flags.my-system.something": "6" }], {}),
).toEqualTypeOf<Promise<Array<ActiveEffect.ConfiguredInstance>>>();

expectTypeOf(
  doc.updateActorEmbeddedDocuments("Item", [{ name: "My Item", "data.something": 5 }], { noHook: true }),
).toEqualTypeOf<Promise<Array<Item.ConfiguredInstance>>>();
expectTypeOf(
  doc.updateActorEmbeddedDocuments("ActiveEffect", [{ icon: "path/to/my/icon", "flags.my-system.something": "6" }], {}),
).toEqualTypeOf<Promise<Array<ActiveEffect.ConfiguredInstance>>>();

expectTypeOf(doc.deleteActorEmbeddedDocuments("Item", ["BRBEA"], {})).toEqualTypeOf<
  Promise<Array<Item.ConfiguredInstance>>
>();
expectTypeOf(doc.deleteActorEmbeddedDocuments("ActiveEffect", ["BRBEA"], { noHook: true })).toEqualTypeOf<
  Promise<Array<ActiveEffect.ConfiguredInstance>>
>();
