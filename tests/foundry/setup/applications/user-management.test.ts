import { describe, expect, expectTypeOf, test } from "vitest";

import UserManagement = foundry.setup.applications.UserManagement;
import ApplicationV2 = foundry.applications.api.ApplicationV2;

// Setup apps are never rendered here: the tests run inside a world.
describe("UserManagement Tests", () => {
  test("Runtime", () => {
    expect(UserManagement.prototype).toBeInstanceOf(ApplicationV2);
    expect(UserManagement.DEFAULT_OPTIONS.id).toBe("manage-players");
    expect(Object.keys(UserManagement.PARTS)).toEqual(["form"]);
    expect(UserManagement.USER_TEMPLATE).toBe("templates/setup/parts/user-management-user.hbs");

    const app = new UserManagement();
    expect(app.id).toBe("manage-players");
  });

  test("Types", () => {
    const app = new UserManagement();

    expectTypeOf(app).toEqualTypeOf<UserManagement>();
    expectTypeOf(app).toExtend<ApplicationV2.Any>();
    expectTypeOf<UserManagement["render"]>().toBeCallableWith({ force: true });
    expectTypeOf<UserManagement["render"]>().returns.toEqualTypeOf<Promise<UserManagement>>();
    expectTypeOf(UserManagement.USER_TEMPLATE).toEqualTypeOf<string>();
    expectTypeOf<UserManagement.RenderContext["users"]>().toEqualTypeOf<UserManagement.UserEntry[]>();
    expectTypeOf<UserManagement.RenderContext["roles"]>().toEqualTypeOf<Record<CONST.USER_ROLES, string>>();
  });
});
