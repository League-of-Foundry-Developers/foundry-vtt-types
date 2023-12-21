import { expectTypeOf } from "vitest";
import type { RollTableDataSource } from "../../../../../src/foundry/common/data/data.mjs/rollTableData.mts";

const rollTables = new RollTables();
expectTypeOf(rollTables.get("", { strict: true })).toEqualTypeOf<StoredDocument<RollTable>>();
expectTypeOf(rollTables.toJSON()).toEqualTypeOf<(RollTableDataSource & { _id: string })[]>();
expectTypeOf(rollTables.directory).toEqualTypeOf<RollTableDirectory | undefined>();
