import { expectTypeOf } from "vitest";

// This exists to make the class non-abstract.
class TestBaseRollTable extends foundry.documents.BaseRollTable {
  get compendium() {
    return this.inCompendium
      ? (game.packs!.get(this.pack!) as foundry.documents.collections.CompendiumCollection.ForDocument<"RollTable">)
      : null;
  }
}

// @ts-expect-error name is a required field
new TestBaseRollTable();

// @ts-expect-error name is a required field
new TestBaseRollTable({});

const myRollTable = new TestBaseRollTable({ name: "foo" });

expectTypeOf(myRollTable.description).toEqualTypeOf<string | undefined>();
