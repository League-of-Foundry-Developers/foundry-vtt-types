import { expectType } from 'tsd';
import { FolderDataProperties } from '../../../../../../src/foundry/common/data/data.mjs/folderData';
import { PropertiesToSource } from '../../../../../../src/types/helperTypes';

const folders = new Folders();
expectType<Folder>(folders.get('', { strict: true }));
expectType<PropertiesToSource<FolderDataProperties>[]>(folders.toJSON());
expectType<null>(folders.directory);
