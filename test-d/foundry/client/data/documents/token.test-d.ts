import type EmbeddedCollection from "../../../../../src/foundry/common/abstract/embedded-collection.mjs.js";
import BaseScene from "../../../../../src/foundry/common/documents/scene.mjs.js";
import type { ConfiguredDocumentClass } from "../../../../../src/types/helperTypes";

import { expectType } from "tsd";

const doc = new TokenDocument({}, { parent: new BaseScene({ name: "Test Scene" }) });
expectType<InstanceType<ConfiguredDocumentClass<typeof Actor>> | null>(doc.actor);
expectType<boolean>(doc.isOwner);
expectType<boolean>(doc.isLinked);
expectType<InstanceType<ConfiguredDocumentClass<typeof Combatant>> | null>(doc.combatant);
expectType<boolean>(doc.inCombat);
expectType<TokenDocument | Promise<TokenDocument>>(doc.clone());
expectType<TokenDocument | Promise<TokenDocument>>(doc.clone({}, { save: true }));
expectType<InstanceType<ConfiguredDocumentClass<typeof Actor>> | null>(doc.getActor());
expectType<Promise<[InstanceType<ConfiguredDocumentClass<typeof Actor>> | null]>>(
  doc.modifyActorDocument({ actorLink: true, "lightAnimation.speed": 5 }, {})
);

expectType<EmbeddedCollection<ConfiguredDocumentClass<typeof foundry.documents.BaseItem>, foundry.data.ActorData>>(
  doc.getEmbeddedCollection("Item")
);
expectType<
  EmbeddedCollection<ConfiguredDocumentClass<typeof foundry.documents.BaseActiveEffect>, foundry.data.ActorData>
>(doc.getEmbeddedCollection("ActiveEffect"));
