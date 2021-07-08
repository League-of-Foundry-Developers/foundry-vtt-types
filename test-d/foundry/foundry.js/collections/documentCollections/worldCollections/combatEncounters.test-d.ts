import { expectType } from 'tsd';
import { CombatData } from '../../../../../../src/foundry/common/data/data.mjs';

const combatEncounters = new CombatEncounters();
expectType<Combat>(combatEncounters.get('', { strict: true }));
expectType<CombatData['_source'][]>(combatEncounters.toJSON());
expectType<null | SidebarDirectory | undefined>(combatEncounters.directory);
