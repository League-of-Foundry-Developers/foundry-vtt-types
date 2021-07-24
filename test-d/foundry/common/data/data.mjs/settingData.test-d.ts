import { expectError, expectType } from 'tsd';

expectError(new foundry.data.SettingData());
expectError(new foundry.data.SettingData({}));
expectType<foundry.data.SettingData>(new foundry.data.SettingData({ key: 'foo', value: 'bar' }));
