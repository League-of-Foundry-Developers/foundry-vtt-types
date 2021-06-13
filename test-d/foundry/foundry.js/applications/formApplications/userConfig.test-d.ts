import { expectType } from 'tsd';
import { ConfiguredDocumentClass } from '../../../../../src/types/helperTypes';

const config = new UserConfig();
expectType<InstanceType<ConfiguredDocumentClass<typeof User>>>(config.object);
expectType<User>(config.object);
expectType<InstanceType<ConfiguredDocumentClass<typeof User>>>(config.getData().user);
expectType<User>(config.getData().user);
expectType<InstanceType<ConfiguredDocumentClass<typeof Actor>>[]>(config.getData().actors);
expectType<Actor[]>(config.getData().actors);
expectType<DocumentSheet.Options>(config.getData().options);
