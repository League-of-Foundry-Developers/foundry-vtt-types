import { expectType } from 'tsd';

const combatEncounters = new CombatEncounters();
expectType<Combat>(combatEncounters.get('', { strict: true }));
expectType<any[]>(combatEncounters.toJSON()); // TODO: Adjust when CombatData is typed
expectType<null>(combatEncounters.directory);
