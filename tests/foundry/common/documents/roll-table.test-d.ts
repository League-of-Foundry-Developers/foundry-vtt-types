import { expectTypeOf } from "vitest";

// This exists to make the class non-abstract.
class TestBaseRollTable extends foundry.documents.BaseRollTable {
  get compendium(): foundry.documents.collections.CompendiumCollection.ForDocument<"RollTable"> | null {
    const pack = this.inCompendium ? (game.packs!.get(this.pack ?? "") ?? null) : null;
    if (!pack) return null;
    return pack as foundry.documents.collections.CompendiumCollection.ForDocument<"RollTable">;
  }
}

// @ts-expect-error name is a required field
new TestBaseRollTable();

// @ts-expect-error name is a required field
new TestBaseRollTable({});

const myRollTable = new TestBaseRollTable({ name: "foo" });

expectTypeOf(myRollTable.description).toEqualTypeOf<string | undefined>();
