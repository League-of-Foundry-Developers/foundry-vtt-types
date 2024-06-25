import { expectTypeOf } from "vitest";
import type { StoredDocument } from "../../../../../src/types/utils.d.mts";

const rollTables = new RollTables();
expectTypeOf(rollTables.get("", { strict: true })).toEqualTypeOf<StoredDocument<RollTable>>();
expectTypeOf(rollTables.toJSON()).toEqualTypeOf<StoredDocument<RollTable>["_source"][]>();
expectTypeOf(rollTables.directory).toEqualTypeOf<RollTableDirectory | undefined>();
