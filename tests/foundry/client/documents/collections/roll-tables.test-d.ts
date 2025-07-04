import { expectTypeOf } from "vitest";
import { RollTables } from "#client/documents/collections/_module.mjs";

import RollTableDirectory = foundry.applications.sidebar.tabs.RollTableDirectory;

const rollTables = new RollTables([]);
expectTypeOf(rollTables.get("", { strict: true })).toEqualTypeOf<RollTable.Stored>();
expectTypeOf(rollTables.toJSON()).toEqualTypeOf<RollTable.Stored["_source"][]>();
expectTypeOf(rollTables.directory).toEqualTypeOf<RollTableDirectory.Any | undefined>();
