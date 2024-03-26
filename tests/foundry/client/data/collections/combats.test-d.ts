import { expectTypeOf } from "vitest";
import type { StoredDocument } from "../../../../../src/types/utils.d.mts";

const combatEncounters = new CombatEncounters();
expectTypeOf(combatEncounters.get("", { strict: true })).toEqualTypeOf<StoredDocument<Combat>>();
expectTypeOf(combatEncounters.toJSON()).toEqualTypeOf<StoredDocument<Combat>["data"]["_source"][]>();
expectTypeOf(combatEncounters.directory).toEqualTypeOf<undefined | CombatTracker>();
