import { expectType } from 'tsd';
import '../../../../index';

expectType<Promise<Folder | undefined>>(foundry.documents.BaseFolder.create({ name: 'Some Folder', type: 'Item' }));
expectType<Promise<Folder[]>>(foundry.documents.BaseFolder.createDocuments([]));
expectType<Promise<Folder[]>>(foundry.documents.BaseFolder.updateDocuments([]));
expectType<Promise<Folder[]>>(foundry.documents.BaseFolder.deleteDocuments([]));

const folder = await foundry.documents.BaseFolder.create({ name: 'Another Folder', type: 'Actor' });
if (folder) {
  expectType<foundry.data.FolderData>(folder.data);
}
