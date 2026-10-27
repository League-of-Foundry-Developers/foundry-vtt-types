import { expectTypeOf, test } from "vitest";

import UserManagement = foundry.setup.applications.UserManagement;
import ApplicationV2 = foundry.applications.api.ApplicationV2;

test("foundry/setup/applications/user-management", () => {
  const app = new UserManagement();

  expectTypeOf(app).toEqualTypeOf<UserManagement>();
  expectTypeOf(app).toExtend<ApplicationV2.Any>();
  expectTypeOf(app.render({ force: true })).toEqualTypeOf<Promise<UserManagement>>();
  expectTypeOf(UserManagement.USER_TEMPLATE).toEqualTypeOf<string>();
  expectTypeOf<UserManagement.RenderContext["users"]>().toEqualTypeOf<UserManagement.UserEntry[]>();
  expectTypeOf<UserManagement.RenderContext["roles"]>().toEqualTypeOf<Record<CONST.USER_ROLES, string>>();
});
