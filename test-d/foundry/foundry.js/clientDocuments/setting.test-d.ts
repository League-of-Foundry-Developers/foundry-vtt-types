import { expectType } from 'tsd';

const setting = new Setting({ key: 'foo', value: 'bar' });

expectType<typeof foundry.data.SettingData>(Setting.schema);
expectType<string>(setting.key);
expectType<unknown>(setting.value);
expectType<Promise<Setting | undefined>>(Setting.create({ key: 'foo', value: 'bar' }));
expectType<Promise<Setting[]>>(Setting.createDocuments([]));
expectType<Promise<Setting[]>>(Setting.updateDocuments([]));
expectType<Promise<Setting[]>>(Setting.deleteDocuments([]));
