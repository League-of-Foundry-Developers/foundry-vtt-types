import { expectType } from 'tsd';
import '../../../../index';

expectType<Promise<Setting | undefined>>(foundry.documents.BaseSetting.create({ key: 'foo', value: 'bar' }));
expectType<Promise<Setting[]>>(foundry.documents.BaseSetting.createDocuments([]));
expectType<Promise<Setting[]>>(foundry.documents.BaseSetting.updateDocuments([]));
expectType<Promise<Setting[]>>(foundry.documents.BaseSetting.deleteDocuments([]));

const settingData = await foundry.documents.BaseSetting.create({ key: 'fizz', value: 'buzz' });
if (settingData) {
  expectType<foundry.data.SettingData>(settingData.data);
}
