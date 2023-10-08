import { expectType } from "tsd";

expectType<Promise<StoredDocument<Combat> | undefined>>(
  foundry.documents.BaseCombat.create({ scene: "foo", active: true, sort: 1 }),
);
expectType<Promise<StoredDocument<Combat>[]>>(foundry.documents.BaseCombat.createDocuments([]));
expectType<Promise<Combat[]>>(foundry.documents.BaseCombat.updateDocuments([]));
expectType<Promise<Combat[]>>(foundry.documents.BaseCombat.deleteDocuments([]));

const combat = await foundry.documents.BaseCombat.create({ scene: "foo", active: true }, { temporary: true });
if (combat) {
  expectType<foundry.data.CombatData>(combat.data);
}
