import { expectType } from 'tsd';

const users = new Users();
expectType<User>(users.get('', { strict: true }));
expectType<foundry.data.UserData['_source'][]>(users.toJSON());
expectType<null | SidebarDirectory<'User'> | undefined>(users.directory);
