import { expectTypeOf } from "vitest";
import { RollTables } from "#client/documents/collections/_module.mjs";

const rollTables = new RollTables([]);
expectTypeOf(rollTables.get("", { strict: true })).toEqualTypeOf<RollTable.Stored>();
expectTypeOf(rollTables.toJSON()).toEqualTypeOf<RollTable.Source[]>();
expectTypeOf(rollTables.directory).toEqualTypeOf<RollTableDirectory.Any | undefined>();
