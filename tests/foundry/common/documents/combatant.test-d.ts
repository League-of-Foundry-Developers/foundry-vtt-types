import { expectTypeOf } from "vitest";
import Document = foundry.abstract.Document;

expectTypeOf(foundry.documents.BaseCombatant.create({ actorId: "someID", tokenId: "someOtherId" })).toEqualTypeOf<
  Promise<Combatant.Stored | undefined>
>();
expectTypeOf(foundry.documents.BaseCombatant.createDocuments([])).toEqualTypeOf<
  Promise<Combatant.Stored[]>
>();
expectTypeOf(foundry.documents.BaseCombatant.updateDocuments([])).toEqualTypeOf<Promise<Combatant[]>>();
expectTypeOf(foundry.documents.BaseCombatant.deleteDocuments([])).toEqualTypeOf<Promise<Combatant[]>>();

const combatant = await foundry.documents.BaseCombatant.create(
  { name: "Another Combatant", type: "Actor" },
  { temporary: true },
);
if (combatant) {
  expectTypeOf(combatant).toEqualTypeOf<Combatant>();
}
