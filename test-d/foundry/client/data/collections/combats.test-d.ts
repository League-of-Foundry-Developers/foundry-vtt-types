import { expectType } from 'tsd';

const combatEncounters = new CombatEncounters();
expectType<StoredDocument<Combat>>(combatEncounters.get('', { strict: true }));
expectType<StoredDocument<Combat>['_source'][]>(combatEncounters.toJSON());
expectType<undefined | CombatTracker>(combatEncounters.directory);
