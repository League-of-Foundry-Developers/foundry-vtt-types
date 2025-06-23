import { expectTypeOf } from "vitest";
import { CombatEncounters } from "#client/documents/collections/_module.mjs";

import CombatTracker = foundry.applications.sidebar.tabs.CombatTracker;

const combatEncounters = new CombatEncounters([]);
expectTypeOf(combatEncounters.get("", { strict: true })).toEqualTypeOf<Combat.Stored>();
expectTypeOf(combatEncounters.toJSON()).toEqualTypeOf<Combat.Stored["_source"][]>();
expectTypeOf(combatEncounters.directory).toEqualTypeOf<CombatTracker>();
