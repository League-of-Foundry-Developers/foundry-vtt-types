import { expectType } from 'tsd';

const fogExplorations = new FogExplorations();
expectType<foundry.documents.BaseFogExploration>(fogExplorations.get('', { strict: true })); // TODO: Adjust as soon as FogExploration has been typed
expectType<any[]>(fogExplorations.toJSON()); // TODO: Adjust as soon as FogExplorationData and BaseFogExploration have been typed
expectType<null | SidebarDirectory | undefined>(fogExplorations.directory);
