import { expectTypeOf } from "vitest";
import Document = foundry.abstract.Document;

const combatEncounters = new CombatEncounters([]);
expectTypeOf(combatEncounters.get("", { strict: true })).toEqualTypeOf<Combat.Stored>();
expectTypeOf(combatEncounters.toJSON()).toEqualTypeOf<Combat.Stored["_source"][]>();
expectTypeOf(combatEncounters.directory).toEqualTypeOf<CombatTracker>();
