import { expectType } from "tsd";

const combatEncounters = new CombatEncounters();
expectType<StoredDocument<Combat>>(combatEncounters.get("", { strict: true }));
expectType<StoredDocument<Combat>["data"]["_source"][]>(combatEncounters.toJSON());
expectType<undefined | CombatTracker>(combatEncounters.directory);
