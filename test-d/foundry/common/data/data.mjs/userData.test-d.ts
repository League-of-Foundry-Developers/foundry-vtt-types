import { expectError, expectType } from 'tsd';

expectError(new foundry.data.UserData());
expectError(new foundry.data.UserData({}));
expectType<foundry.data.UserData>(new foundry.data.UserData({ name: 'foo' }));
