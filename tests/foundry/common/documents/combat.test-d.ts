import { expectTypeOf } from "vitest";

// This exists to make the class non-abstract.
class TestBaseCombat extends foundry.documents.BaseCombat {}

expectTypeOf(TestBaseCombat.create({ scene: "foo", active: true, sort: 1 })).toEqualTypeOf<
  Promise<Combat.Stored | undefined>
>();
expectTypeOf(TestBaseCombat.createDocuments([])).toEqualTypeOf<Promise<Combat.Stored[]>>();
expectTypeOf(TestBaseCombat.updateDocuments([])).toEqualTypeOf<Promise<Combat[]>>();
expectTypeOf(TestBaseCombat.deleteDocuments([])).toEqualTypeOf<Promise<Combat[]>>();

const combat = await TestBaseCombat.create({ scene: "foo", active: true }, { temporary: true });
if (combat) {
  expectTypeOf(combat).toEqualTypeOf<Combat>();
  expectTypeOf(combat.collections.combatants).toEqualTypeOf<(typeof combat)["combatants"]>();
}
