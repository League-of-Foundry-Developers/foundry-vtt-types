import { expectTypeOf } from "vitest";
import Document = foundry.abstract.Document;

const combatEncounters = new CombatEncounters([]);
expectTypeOf(combatEncounters.get("", { strict: true })).toEqualTypeOf<Document.Stored<Combat>>();
expectTypeOf(combatEncounters.toJSON()).toEqualTypeOf<Document.Stored<Combat>["_source"][]>();
expectTypeOf(combatEncounters.directory).toEqualTypeOf<CombatTracker>();
