import { expectTypeOf } from "vitest";

expectTypeOf(foundry.documents.BaseCombatantGroup.create({ initiative: 10 })).toEqualTypeOf<
  Promise<CombatantGroup.Stored | undefined>
>();
expectTypeOf(foundry.documents.BaseCombatantGroup.createDocuments([])).toEqualTypeOf<
  Promise<CombatantGroup.Stored[]>
>();
expectTypeOf(foundry.documents.BaseCombatantGroup.updateDocuments([])).toEqualTypeOf<
  Promise<CombatantGroup.Implementation[]>
>();
expectTypeOf(foundry.documents.BaseCombatantGroup.deleteDocuments([])).toEqualTypeOf<
  Promise<CombatantGroup.Implementation[]>
>();

const combatantGroup = await foundry.documents.BaseCombatantGroup.create(
  { name: "Another Combatant Group", type: "base" },
  { temporary: true },
);
if (combatantGroup) {
  expectTypeOf(combatantGroup).toEqualTypeOf<CombatantGroup.Implementation>();
}
