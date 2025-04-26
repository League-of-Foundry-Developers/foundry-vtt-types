import { expectTypeOf } from "vitest";

const combatEncounters = new CombatEncounters([]);
expectTypeOf(combatEncounters.get("", { strict: true })).toEqualTypeOf<Combat.Stored>();
expectTypeOf(combatEncounters.toJSON()).toEqualTypeOf<Combat.Stored["_source"][]>();
expectTypeOf(combatEncounters.directory).toEqualTypeOf<CombatTracker>();
