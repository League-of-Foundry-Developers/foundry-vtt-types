import { expectType } from 'tsd';

const fogExplorations = new FogExplorations();
expectType<FogExploration>(fogExplorations.get('', { strict: true }));
expectType<any[]>(fogExplorations.toJSON()); // TODO: Adjust as soon as FogExplorationData and BaseFogExploration have been typed
expectType<null | SidebarDirectory<'FogExploration'> | undefined>(fogExplorations.directory);
