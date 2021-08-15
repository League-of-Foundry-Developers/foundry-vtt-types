import type { CombatData } from '../../../../../../src/foundry/common/data/data.mjs';

import { expectType } from 'tsd';

const combatEncounters = new CombatEncounters();
expectType<Combat>(combatEncounters.get('', { strict: true }));
expectType<CombatData['_source'][]>(combatEncounters.toJSON());
expectType<null | SidebarDirectory<'Combat'> | undefined>(combatEncounters.directory);
