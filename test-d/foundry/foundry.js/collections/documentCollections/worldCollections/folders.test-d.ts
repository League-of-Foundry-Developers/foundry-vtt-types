import type { FolderDataProperties } from '../../../../../../src/foundry/common/data/data.mjs/folderData';
import type { PropertiesToSource } from '../../../../../../src/types/helperTypes';

import { expectType } from 'tsd';

const folders = new Folders();
expectType<Folder>(folders.get('', { strict: true }));
expectType<PropertiesToSource<FolderDataProperties>[]>(folders.toJSON());
expectType<null | SidebarDirectory<'Folder'> | undefined>(folders.directory);
