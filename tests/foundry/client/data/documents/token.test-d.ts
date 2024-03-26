import { expectTypeOf } from "vitest";
import type EmbeddedCollection from "../../../../../src/foundry/common/abstract/embedded-collection.d.mts";
import type { ConfiguredDocumentClass } from "../../../../../src/types/helperTypes.d.mts";

const doc = new TokenDocument({}, { parent: new foundry.documents.BaseScene() });
expectTypeOf(doc.actor).toEqualTypeOf<InstanceType<ConfiguredDocumentClass<typeof Actor>> | null>();
expectTypeOf(doc.isOwner).toEqualTypeOf<boolean>();
expectTypeOf(doc.isLinked).toEqualTypeOf<boolean>();
expectTypeOf(doc.combatant).toEqualTypeOf<InstanceType<ConfiguredDocumentClass<typeof Combatant>> | null>();
expectTypeOf(doc.inCombat).toEqualTypeOf<boolean>();
expectTypeOf(doc.clone()).toEqualTypeOf<TokenDocument>();
expectTypeOf(doc.clone({}, { save: true })).toEqualTypeOf<TokenDocument>();
expectTypeOf(doc.getActor()).toEqualTypeOf<InstanceType<ConfiguredDocumentClass<typeof Actor>> | null>();
expectTypeOf(doc.modifyActorDocument({ actorLink: true, "lightAnimation.speed": 5 }, {})).toEqualTypeOf<
  Promise<[InstanceType<ConfiguredDocumentClass<typeof Actor>> | null]>
>();

expectTypeOf(doc.getEmbeddedCollection("Item")).toEqualTypeOf<
  EmbeddedCollection<ConfiguredDocumentClass<typeof foundry.documents.BaseItem>, foundry.data.ActorData>
>();
expectTypeOf(doc.getEmbeddedCollection("ActiveEffect")).toEqualTypeOf<
  EmbeddedCollection<ConfiguredDocumentClass<typeof foundry.documents.BaseActiveEffect>, foundry.data.ActorData>
>();

expectTypeOf(
  doc.createActorEmbeddedDocuments("Item", [{ name: "My Item", "effects.": 5 }], { noHook: true }),
).toEqualTypeOf<Promise<Array<InstanceType<ConfiguredDocumentClass<typeof Item>>>>>();
expectTypeOf(
  doc.createActorEmbeddedDocuments("ActiveEffect", [{ icon: "path/to/my/icon", "flags.my-system.something": "6" }], {}),
).toEqualTypeOf<Promise<Array<InstanceType<ConfiguredDocumentClass<typeof ActiveEffect>>>>>();

expectTypeOf(
  doc.updateActorEmbeddedDocuments("Item", [{ name: "My Item", "data.something": 5 }], { noHook: true }),
).toEqualTypeOf<Promise<Array<InstanceType<ConfiguredDocumentClass<typeof Item>>>>>();
expectTypeOf(
  doc.updateActorEmbeddedDocuments("ActiveEffect", [{ icon: "path/to/my/icon", "flags.my-system.something": "6" }], {}),
).toEqualTypeOf<Promise<Array<InstanceType<ConfiguredDocumentClass<typeof ActiveEffect>>>>>();

expectTypeOf(doc.deleteActorEmbeddedDocuments("Item", ["BRBEA"], {})).toEqualTypeOf<
  Promise<Array<InstanceType<ConfiguredDocumentClass<typeof Item>>>>
>();
expectTypeOf(doc.deleteActorEmbeddedDocuments("ActiveEffect", ["BRBEA"], { noHook: true })).toEqualTypeOf<
  Promise<Array<InstanceType<ConfiguredDocumentClass<typeof ActiveEffect>>>>
>();
