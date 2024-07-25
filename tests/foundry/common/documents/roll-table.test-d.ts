import { expectTypeOf } from "vitest";

// @ts-expect-error name is a required field
new foundry.documents.BaseRollTable();
// @ts-expect-error name is a required field
new foundry.documents.BaseRollTable({});

const myRollTable = new foundry.documents.BaseRollTable({ name: "foo" });

expectTypeOf(myRollTable.description).toEqualTypeOf<string | undefined>();
