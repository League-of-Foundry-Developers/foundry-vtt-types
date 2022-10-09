import { expectType } from "tsd";

const users = new Users();
expectType<StoredDocument<User>>(users.get("", { strict: true }));
expectType<StoredDocument<User>["data"]["_source"][]>(users.toJSON());
expectType<undefined | SidebarTab | SidebarDirectory<"User">>(users.directory);
