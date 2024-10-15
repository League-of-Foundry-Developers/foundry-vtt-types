import { expectTypeOf } from "vitest";
import type Document from "../../../../../src/foundry/common/abstract/document.d.mts";

const combatEncounters = new CombatEncounters([]);
expectTypeOf(combatEncounters.get("", { strict: true })).toEqualTypeOf<Document.Stored<Combat>>();
expectTypeOf(combatEncounters.toJSON()).toEqualTypeOf<Document.Stored<Combat>["_source"][]>();
expectTypeOf(combatEncounters.directory).toEqualTypeOf<CombatTracker>();
