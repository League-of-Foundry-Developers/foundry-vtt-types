import { describe, expect, expectTypeOf, test } from "vitest";

import SetupMenu = foundry.setup.applications.SetupMenu;
import ApplicationV2 = foundry.applications.api.ApplicationV2;

// Setup apps are never rendered here: the tests run inside a world.
describe("SetupMenu Tests", () => {
  test("Runtime", () => {
    expect(SetupMenu.prototype).toBeInstanceOf(ApplicationV2);
    expect(SetupMenu.DEFAULT_OPTIONS.id).toBe("setup-menu");
    expect(Object.keys(SetupMenu.PARTS)).toEqual(["buttons"]);
    expect(SetupMenu.prototype.toggleLock).toBeTypeOf("function");

    const app = new SetupMenu();
    expect(app.id).toBe("setup-menu");
  });

  test("Types", () => {
    const app = new SetupMenu();

    expectTypeOf(app).toEqualTypeOf<SetupMenu>();
    expectTypeOf(app).toExtend<ApplicationV2.Any>();
    expectTypeOf<SetupMenu["render"]>().toBeCallableWith({ force: true });
    expectTypeOf<SetupMenu["render"]>().returns.toEqualTypeOf<Promise<SetupMenu>>();
    expectTypeOf(app.toggleLock).toBeCallableWith(true);
    expectTypeOf(app.toggleLock).returns.toBeVoid();
    expectTypeOf<SetupMenu.Button["pip"]>().toEqualTypeOf<SetupMenu.Pip | null | undefined>();
    expectTypeOf<SetupMenu.RenderContext["buttons"]>().toEqualTypeOf<SetupMenu.Button[]>();
  });
});
