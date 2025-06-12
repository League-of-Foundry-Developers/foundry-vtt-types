import { expectTypeOf } from "vitest";
import { Users } from "#client/documents/collections/_module.mjs";

const users = new Users();
expectTypeOf(users.get("", { strict: true })).toEqualTypeOf<User.Stored>();
expectTypeOf(users.toJSON()).toEqualTypeOf<User.Stored["_source"][]>();
expectTypeOf(users.directory).toEqualTypeOf<undefined | foundry.applications.sidebar.AbstractSidebarTab.Any | null>();

// Validating that the registerSheet API takes AppV2
Users.registerSheet("core", foundry.applications.sheets.UserConfig);
