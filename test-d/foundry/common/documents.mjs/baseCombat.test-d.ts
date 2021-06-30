import { expectType } from 'tsd';
import '../../../../index';

expectType<Promise<Combat | undefined>>(foundry.documents.BaseCombat.create({ scene: 'foo', active: true, sort: 1 }));
expectType<Promise<Combat[]>>(foundry.documents.BaseCombat.createDocuments([]));
expectType<Promise<Combat[]>>(foundry.documents.BaseCombat.updateDocuments([]));
expectType<Promise<Combat[]>>(foundry.documents.BaseCombat.deleteDocuments([]));

const combat = await foundry.documents.BaseCombat.create({ scene: 'foo', active: true });
if (combat) {
  expectType<foundry.data.CombatData>(combat.data);
}
