import { expectTypeOf } from "vitest";

// This exists to make the class non-abstract.
class TestBaseTableResult extends foundry.documents.BaseTableResult {
  get compendium(): foundry.documents.collections.CompendiumCollection.ForDocument<"TableResult"> | null {
    const pack = this.inCompendium ? (game.packs!.get(this.pack ?? "") ?? null) : null;
    if (!pack) return null;
    return pack as foundry.documents.collections.CompendiumCollection.ForDocument<"TableResult">;
  }
}

// @ts-expect-error range is a required field
new TestBaseTableResult();

// @ts-expect-error range is a required field
new TestBaseTableResult({});

const myTableResult = new TestBaseTableResult({ range: [0, 2] });

// deprecated since v13 until v15
// eslint-disable-next-line @typescript-eslint/no-deprecated
expectTypeOf(myTableResult.documentId).toEqualTypeOf<string | null>();
