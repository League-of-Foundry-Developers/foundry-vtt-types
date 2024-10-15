import { expectTypeOf } from "vitest";
import type Document from "../../../../../src/foundry/common/abstract/document.d.mts";

const rollTables = new RollTables([]);
expectTypeOf(rollTables.get("", { strict: true })).toEqualTypeOf<Document.Stored<RollTable>>();
expectTypeOf(rollTables.toJSON()).toEqualTypeOf<Document.Stored<RollTable>["_source"][]>();
expectTypeOf(rollTables.directory).toEqualTypeOf<RollTableDirectory>();
