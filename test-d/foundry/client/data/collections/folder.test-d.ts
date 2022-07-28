import { expectType } from 'tsd';

const folders = new Folders();
expectType<StoredDocument<Folder>>(folders.get('', { strict: true }));
expectType<StoredDocument<Folder>['_source'][]>(folders.toJSON());
expectType<undefined | SidebarTab | SidebarDirectory<'Folder'> | undefined>(folders.directory);
