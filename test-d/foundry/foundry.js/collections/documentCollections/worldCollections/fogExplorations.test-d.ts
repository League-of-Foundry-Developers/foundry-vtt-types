import { expectType } from 'tsd';
import { FogExplorationDataProperties } from '../../../../../../src/foundry/common/data/data.mjs/fogExplorationData';
import { PropertiesToSource } from '../../../../../../src/types/helperTypes';

const fogExplorations = new FogExplorations();
expectType<StoredDocument<FogExploration>>(fogExplorations.get('', { strict: true }));
expectType<PropertiesToSource<FogExplorationDataProperties>[]>(fogExplorations.toJSON());
expectType<null | SidebarDirectory<'FogExploration'> | undefined>(fogExplorations.directory);
