import { expectTypeOf } from "vitest";
import Document = foundry.abstract.Document;

const users = new Users();
expectTypeOf(users.get("", { strict: true })).toEqualTypeOf<Document.Stored<User.ConfiguredInstance>>();
expectTypeOf(users.toJSON()).toEqualTypeOf<Document.Stored<User.ConfiguredInstance>["_source"][]>();
expectTypeOf(users.directory).toEqualTypeOf<undefined | SidebarTab | null>();

// Validating that the registerSheet API takes AppV2
Users.registerSheet("core", foundry.applications.sheets.UserConfig);
