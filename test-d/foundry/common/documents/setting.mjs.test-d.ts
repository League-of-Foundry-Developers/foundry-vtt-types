import { expectError, expectType } from 'tsd';

expectType<Promise<StoredDocument<Setting> | undefined>>(
  foundry.documents.BaseSetting.create({ key: 'foo.bar', value: 'bar' })
);
expectType<Promise<StoredDocument<Setting>[]>>(foundry.documents.BaseSetting.createDocuments([]));
expectType<Promise<Setting[]>>(foundry.documents.BaseSetting.updateDocuments([]));
expectType<Promise<Setting[]>>(foundry.documents.BaseSetting.deleteDocuments([]));

const settingData = await foundry.documents.BaseSetting.create(
  { key: 'fizz.buzz', value: 'buzz' },
  { temporary: true }
);
if (settingData) {
  expectType<foundry.documents.BaseSetting['data']>(settingData.data);
}

expectError(new foundry.documents.BaseSetting());
expectError(new foundry.documents.BaseSetting({}));
expectError(new foundry.documents.BaseSetting({ key: 'foo', value: 'bar' }));
expectType<foundry.documents.BaseSetting>(new foundry.documents.BaseSetting({ key: 'foo.bar', value: 'bar' }));
const namespace = 'foo';
const key = 'bar';
expectType<foundry.documents.BaseSetting>(
  new foundry.documents.BaseSetting({ key: `${namespace}.${key}`, value: 'bar' })
);
expectError(new foundry.documents.BaseSetting({ key: namespace + '.' + key, value: 'bar' }));
