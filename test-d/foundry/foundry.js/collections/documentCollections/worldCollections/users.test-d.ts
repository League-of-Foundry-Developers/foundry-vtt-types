import { expectType } from 'tsd';

const users = new Users();
expectType<StoredDocument<User>>(users.get('', { strict: true }));
expectType<StoredDocument<User>['data']['_source'][]>(users.toJSON());
expectType<null | SidebarDirectory<'User'> | undefined>(users.directory);
