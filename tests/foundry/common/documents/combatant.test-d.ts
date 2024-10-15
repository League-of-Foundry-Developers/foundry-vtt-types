import { expectTypeOf } from "vitest";
import type Document from "../../../../src/foundry/common/abstract/document.d.mts";

expectTypeOf(foundry.documents.BaseCombatant.create({ actorId: "someID", tokenId: "someOtherId" })).toEqualTypeOf<
  Promise<Document.Stored<Combatant> | undefined>
>();
expectTypeOf(foundry.documents.BaseCombatant.createDocuments([])).toEqualTypeOf<
  Promise<Document.Stored<Combatant>[]>
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
