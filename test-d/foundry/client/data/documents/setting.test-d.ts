import { expectType } from 'tsd';

const setting = new Setting({ key: 'foo.bar', value: 'bar' });

expectType<string>(setting.key);
expectType<unknown>(setting.value);
expectType<Promise<StoredDocument<Setting> | undefined>>(Setting.create({ key: 'foo.bar', value: 'bar' }));
expectType<Promise<StoredDocument<Setting>[]>>(Setting.createDocuments([]));
expectType<Promise<Setting[]>>(Setting.updateDocuments([]));
expectType<Promise<Setting[]>>(Setting.deleteDocuments([]));
