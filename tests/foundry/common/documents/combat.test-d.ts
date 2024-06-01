import { expectTypeOf } from "vitest";
import type { StoredDocument } from "../../../../src/types/utils.d.mts";

expectTypeOf(foundry.documents.BaseCombat.create({ scene: "foo", active: true, sort: 1 })).toEqualTypeOf<
  Promise<StoredDocument<Combat> | undefined>
>();
expectTypeOf(foundry.documents.BaseCombat.createDocuments([])).toEqualTypeOf<Promise<StoredDocument<Combat>[]>>();
expectTypeOf(foundry.documents.BaseCombat.updateDocuments([])).toEqualTypeOf<Promise<Combat[]>>();
expectTypeOf(foundry.documents.BaseCombat.deleteDocuments([])).toEqualTypeOf<Promise<Combat[]>>();

const combat = await foundry.documents.BaseCombat.create({ scene: "foo", active: true }, { temporary: true });
if (combat) {
  expectTypeOf(combat).toEqualTypeOf<Combat>();
}
