import { expectTypeOf } from "vitest";

new foundry.documents.BaseCombat();

expectTypeOf(foundry.documents.BaseCombat.create({ scene: "foo", active: true, sort: 1 })).toEqualTypeOf<
  Promise<Combat.Stored | undefined>
>();
expectTypeOf(foundry.documents.BaseCombat.createDocuments([])).toEqualTypeOf<Promise<Combat.Stored[]>>();
expectTypeOf(foundry.documents.BaseCombat.updateDocuments([])).toEqualTypeOf<Promise<Combat[]>>();
expectTypeOf(foundry.documents.BaseCombat.deleteDocuments([])).toEqualTypeOf<Promise<Combat[]>>();

const combat = await foundry.documents.BaseCombat.create({ scene: "foo", active: true }, { temporary: true });
if (combat) {
  expectTypeOf(combat).toEqualTypeOf<Combat>();
  expectTypeOf(combat.collections.combatants).toEqualTypeOf<(typeof combat)["combatants"]>();
}
