import { expectType } from 'tsd';

expectType<Promise<StoredDocument<Setting> | undefined>>(
  foundry.documents.BaseSetting.create({ key: 'foo', value: 'bar' })
);
expectType<Promise<StoredDocument<Setting>[]>>(foundry.documents.BaseSetting.createDocuments([]));
expectType<Promise<Setting[]>>(foundry.documents.BaseSetting.updateDocuments([]));
expectType<Promise<Setting[]>>(foundry.documents.BaseSetting.deleteDocuments([]));

const settingData = await foundry.documents.BaseSetting.create({ key: 'fizz', value: 'buzz' }, { temporary: true });
if (settingData) {
  expectType<foundry.data.SettingData>(settingData.data);
}
