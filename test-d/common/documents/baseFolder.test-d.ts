import { expectType } from 'tsd';
import '../../../../index';

expectType<Promise<Folder>>(foundry.documents.BaseFolder.create());
expectType<Promise<Folder[]>>(foundry.documents.BaseFolder.createDocuments([]));
expectType<Promise<Folder[]>>(foundry.documents.BaseFolder.updateDocuments([]));
expectType<Promise<Folder[]>>(foundry.documents.BaseFolder.deleteDocuments([]));

const folder = await foundry.documents.BaseFolder.create();
expectType<foundry.data.FolderData>(folder.data);
