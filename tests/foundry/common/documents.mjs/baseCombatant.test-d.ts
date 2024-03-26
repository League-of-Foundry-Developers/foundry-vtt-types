import { expectTypeOf } from "vitest";
import type { StoredDocument } from "../../../../src/types/utils.d.mts";

expectTypeOf(foundry.documents.BaseCombatant.create({ actorId: "someID", tokenId: "someOtherId" })).toEqualTypeOf<
  Promise<StoredDocument<Combatant> | undefined>
>();
expectTypeOf(foundry.documents.BaseCombatant.createDocuments([])).toEqualTypeOf<Promise<StoredDocument<Combatant>[]>>();
expectTypeOf(foundry.documents.BaseCombatant.updateDocuments([])).toEqualTypeOf<Promise<Combatant[]>>();
expectTypeOf(foundry.documents.BaseCombatant.deleteDocuments([])).toEqualTypeOf<Promise<Combatant[]>>();

const combatant = await foundry.documents.BaseCombatant.create(
  { name: "Another Combatant", type: "Actor" },
  { temporary: true },
);
if (combatant) {
  expectTypeOf(combatant.data).toEqualTypeOf<foundry.data.CombatantData>();
}
