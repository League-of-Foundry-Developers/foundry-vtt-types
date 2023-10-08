import { expectType } from "tsd";

expectType<Promise<StoredDocument<Combatant> | undefined>>(
  foundry.documents.BaseCombatant.create({ actorId: "someID", tokenId: "someOtherId" }),
);
expectType<Promise<StoredDocument<Combatant>[]>>(foundry.documents.BaseCombatant.createDocuments([]));
expectType<Promise<Combatant[]>>(foundry.documents.BaseCombatant.updateDocuments([]));
expectType<Promise<Combatant[]>>(foundry.documents.BaseCombatant.deleteDocuments([]));

const combatant = await foundry.documents.BaseCombatant.create(
  { name: "Another Combatant", type: "Actor" },
  { temporary: true },
);
if (combatant) {
  expectType<foundry.data.CombatantData>(combatant.data);
}
