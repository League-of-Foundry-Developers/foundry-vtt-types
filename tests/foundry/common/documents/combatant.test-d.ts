import { expectTypeOf } from "vitest";

expectTypeOf(foundry.documents.BaseCombatant.create({ actorId: "someID", tokenId: "someOtherId" })).toEqualTypeOf<
  Promise<Combatant.Stored | undefined>
>();
expectTypeOf(foundry.documents.BaseCombatant.createDocuments([])).toEqualTypeOf<Promise<Combatant.Stored[]>>();
expectTypeOf(foundry.documents.BaseCombatant.updateDocuments([])).toEqualTypeOf<Promise<Combatant.Implementation[]>>();
expectTypeOf(foundry.documents.BaseCombatant.deleteDocuments([])).toEqualTypeOf<Promise<Combatant.Implementation[]>>();

const combatant = await foundry.documents.BaseCombatant.create(
  { name: "Another Combatant", type: "base" },
  { temporary: true },
);
if (combatant) {
  expectTypeOf(combatant).toEqualTypeOf<Combatant.Implementation>();
}
