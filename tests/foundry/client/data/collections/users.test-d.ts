import { expectTypeOf } from "vitest";
import type Document from "../../../../../src/foundry/common/abstract/document.d.mts";

const users = new Users();
expectTypeOf(users.get("", { strict: true })).toEqualTypeOf<Document.Stored<User>>();
expectTypeOf(users.toJSON()).toEqualTypeOf<Document.Stored<User>["_source"][]>();
expectTypeOf(users.directory).toEqualTypeOf<undefined | SidebarTab | null>();

// Validating that the registerSheet API takes AppV2
Users.registerSheet("core", foundry.applications.sheets.UserConfig);
