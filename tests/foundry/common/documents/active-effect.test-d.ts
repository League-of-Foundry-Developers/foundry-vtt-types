import { expectTypeOf } from "vitest";
import Document = foundry.abstract.Document;

expectTypeOf(foundry.documents.BaseActiveEffect.create({})).toEqualTypeOf<
  Promise<Document.Stored<ActiveEffect> | undefined>
>();
expectTypeOf(foundry.documents.BaseActiveEffect.createDocuments([])).toEqualTypeOf<
  Promise<Document.Stored<ActiveEffect>[]>
>();
expectTypeOf(foundry.documents.BaseActiveEffect.updateDocuments([])).toEqualTypeOf<Promise<ActiveEffect[]>>();
expectTypeOf(foundry.documents.BaseActiveEffect.deleteDocuments([])).toEqualTypeOf<Promise<ActiveEffect[]>>();

const activeEffect = await foundry.documents.BaseActiveEffect.create({}, { temporary: true });
if (activeEffect) {
  expectTypeOf(activeEffect.parent).toEqualTypeOf<Actor | Item | null>();
}
