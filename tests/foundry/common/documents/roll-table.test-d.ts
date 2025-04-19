import { expectTypeOf } from "vitest";

// This exists to make the class non-abstract.
class TestBaseRollTable extends foundry.documents.BaseRollTable {}

// @ts-expect-error name is a required field
new TestBaseRollTable();

// @ts-expect-error name is a required field
new TestBaseRollTable({});

const myRollTable = new TestBaseRollTable({ name: "foo" });

expectTypeOf(myRollTable.description).toEqualTypeOf<string | undefined>();
