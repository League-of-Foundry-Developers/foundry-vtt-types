import { expectTypeOf } from "vitest";
import type { StoredDocument } from "../../../../../src/types/utils.mts";

const users = new Users();
expectTypeOf(users.get("", { strict: true })).toEqualTypeOf<StoredDocument<User>>();
expectTypeOf(users.toJSON()).toEqualTypeOf<StoredDocument<User>["data"]["_source"][]>();
expectTypeOf(users.directory).toEqualTypeOf<undefined | SidebarTab | SidebarDirectory<"User">>();
