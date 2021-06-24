import { expectType } from 'tsd';
import EmbeddedCollection from '../../../../../src/foundry/common/abstract/embedded-collection.mjs';
import { ConfiguredDocumentClass } from '../../../../../src/types/helperTypes';

const doc = new TokenDocument({}, { parent: new foundry.documents.BaseScene() });
expectType<InstanceType<ConfiguredDocumentClass<typeof Actor>> | null>(doc.actor);
expectType<boolean>(doc.isOwner);
expectType<boolean>(doc.isLinked);
expectType<InstanceType<ConfiguredDocumentClass<typeof Combatant>> | null>(doc.combatant);
expectType<boolean>(doc.inCombat);
expectType<TokenDocument>(doc.clone());
expectType<TokenDocument>(doc.clone({}, { save: true }));
expectType<InstanceType<ConfiguredDocumentClass<typeof Actor>> | null>(doc.getActor());
expectType<Promise<[InstanceType<ConfiguredDocumentClass<typeof Actor>> | null]>>(
  doc.modifyActorDocument({ actorLink: true, 'lightAnimation.speed': 5 }, {})
);

expectType<EmbeddedCollection<ConfiguredDocumentClass<typeof foundry.documents.BaseItem>, foundry.data.ActorData>>(
  doc.getEmbeddedCollection('Item')
);
expectType<
  EmbeddedCollection<ConfiguredDocumentClass<typeof foundry.documents.BaseActiveEffect>, foundry.data.ActorData>
>(doc.getEmbeddedCollection('ActiveEffect'));
expectType<undefined>(doc.getEmbeddedCollection(''));

expectType<Promise<Array<InstanceType<ConfiguredDocumentClass<typeof Item>>>>>(
  doc.createActorEmbeddedDocuments('Item', [{ name: 'My Item', 'effects.': 5 }], { noHook: true })
);
expectType<Promise<Array<InstanceType<ConfiguredDocumentClass<typeof ActiveEffect>>>>>(
  doc.createActorEmbeddedDocuments('ActiveEffect', [{ icon: 'path/to/my/icon', 'flags.my-system.something': '6' }], {})
);

expectType<Promise<Array<InstanceType<ConfiguredDocumentClass<typeof Item>>>>>(
  doc.updateActorEmbeddedDocuments('Item', [{ name: 'My Item', 'data.something': 5 }], { noHook: true })
);
expectType<Promise<Array<InstanceType<ConfiguredDocumentClass<typeof ActiveEffect>>>>>(
  doc.updateActorEmbeddedDocuments('ActiveEffect', [{ icon: 'path/to/my/icon', 'flags.my-system.something': '6' }], {})
);

expectType<Promise<Array<InstanceType<ConfiguredDocumentClass<typeof Item>>>>>(
  doc.deleteActorEmbeddedDocuments('Item', ['BRBEA'], {})
);
expectType<Promise<Array<InstanceType<ConfiguredDocumentClass<typeof ActiveEffect>>>>>(
  doc.deleteActorEmbeddedDocuments('ActiveEffect', ['BRBEA'], { noHook: true })
);
