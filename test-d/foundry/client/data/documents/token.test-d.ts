import type EmbeddedCollection from '../../../../../src/foundry/common/abstract/embedded-collection.mjs';

import { expectType } from 'tsd';

const doc = new TokenDocument({}, { parent: new foundry.documents.BaseScene() });
expectType<InstanceType<ConfiguredActor> | null>(doc.actor);
expectType<boolean>(doc.isOwner);
expectType<boolean>(doc.isLinked);
expectType<InstanceType<ConfiguredCombatant> | null>(doc.combatant);
expectType<boolean>(doc.inCombat);
expectType<TokenDocument>(doc.clone());
expectType<TokenDocument>(doc.clone({}, { save: true }));
expectType<InstanceType<ConfiguredActor> | null>(doc.getActor());
expectType<Promise<[InstanceType<ConfiguredActor> | null]>>(
  doc.modifyActorDocument({ actorLink: true, 'lightAnimation.speed': 5 }, {})
);

expectType<EmbeddedCollection<ConfiguredItem, foundry.data.ActorData>>(doc.getEmbeddedCollection('Item'));
expectType<EmbeddedCollection<ConfiguredActiveEffect, foundry.data.ActorData>>(
  doc.getEmbeddedCollection('ActiveEffect')
);

expectType<Promise<Array<InstanceType<ConfiguredItem>>>>(
  doc.createActorEmbeddedDocuments('Item', [{ name: 'My Item', 'effects.': 5 }], { noHook: true })
);
expectType<Promise<Array<InstanceType<ConfiguredActiveEffect>>>>(
  doc.createActorEmbeddedDocuments('ActiveEffect', [{ icon: 'path/to/my/icon', 'flags.my-system.something': '6' }], {})
);

expectType<Promise<Array<InstanceType<ConfiguredItem>>>>(
  doc.updateActorEmbeddedDocuments('Item', [{ name: 'My Item', 'data.something': 5 }], { noHook: true })
);
expectType<Promise<Array<InstanceType<ConfiguredActiveEffect>>>>(
  doc.updateActorEmbeddedDocuments('ActiveEffect', [{ icon: 'path/to/my/icon', 'flags.my-system.something': '6' }], {})
);

expectType<Promise<Array<InstanceType<ConfiguredItem>>>>(doc.deleteActorEmbeddedDocuments('Item', ['BRBEA'], {}));
expectType<Promise<Array<InstanceType<ConfiguredActiveEffect>>>>(
  doc.deleteActorEmbeddedDocuments('ActiveEffect', ['BRBEA'], { noHook: true })
);
