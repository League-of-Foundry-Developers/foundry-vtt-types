import { expectTypeOf } from "vitest";

expectTypeOf(foundry.documents.BaseCombatantGroup.create({ initiative: 10 })).toEqualTypeOf<
  Promise<CombatantGroup.Stored | undefined>
>();
expectTypeOf(foundry.documents.BaseCombatantGroup.createDocuments([])).toEqualTypeOf<
  Promise<CombatantGroup.Stored[]>
>();
expectTypeOf(foundry.documents.BaseCombatantGroup.updateDocuments([])).toEqualTypeOf<
  Promise<CombatantGroup.Stored[]>
>();
expectTypeOf(foundry.documents.BaseCombatantGroup.deleteDocuments([])).toEqualTypeOf<
  Promise<CombatantGroup.Stored[]>
>();
