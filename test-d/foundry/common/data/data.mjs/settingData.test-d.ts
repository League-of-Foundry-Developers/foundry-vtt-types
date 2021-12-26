import { expectError, expectType } from 'tsd';

expectError(new foundry.data.SettingData());
expectError(new foundry.data.SettingData({}));
expectError(new foundry.data.SettingData({ key: 'foo', value: 'bar' }));
expectType<foundry.data.SettingData>(new foundry.data.SettingData({ key: 'foo.bar', value: 'bar' }));
const namespace = 'foo';
const key = 'bar';
expectType<foundry.data.SettingData>(new foundry.data.SettingData({ key: `${namespace}.${key}`, value: 'bar' }));
expectError(new foundry.data.SettingData({ key: namespace + '.' + key, value: 'bar' }));
