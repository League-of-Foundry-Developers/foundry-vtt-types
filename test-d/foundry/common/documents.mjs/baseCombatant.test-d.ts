import { expectType } from 'tsd';
import '../../../../index';

expectType<Promise<Combatant | undefined>>(
  foundry.documents.BaseCombatant.create({ actorId: 'someID', tokenId: 'someOtherId' })
);
expectType<Promise<Combatant[]>>(foundry.documents.BaseCombatant.createDocuments([]));
expectType<Promise<Combatant[]>>(foundry.documents.BaseCombatant.updateDocuments([]));
expectType<Promise<Combatant[]>>(foundry.documents.BaseCombatant.deleteDocuments([]));

const combatant = await foundry.documents.BaseCombatant.create({ name: 'Another Combatant', type: 'Actor' });
if (combatant) {
  expectType<foundry.data.CombatantData>(combatant.data);
}
