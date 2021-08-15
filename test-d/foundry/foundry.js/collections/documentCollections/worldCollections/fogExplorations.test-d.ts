import type { FogExplorationDataProperties } from '../../../../../../src/foundry/common/data/data.mjs/fogExplorationData';
import type { PropertiesToSource } from '../../../../../../src/types/helperTypes';

import { expectType } from 'tsd';

const fogExplorations = new FogExplorations();
expectType<FogExploration>(fogExplorations.get('', { strict: true }));
expectType<PropertiesToSource<FogExplorationDataProperties>[]>(fogExplorations.toJSON());
expectType<null | SidebarDirectory<'FogExploration'> | undefined>(fogExplorations.directory);
