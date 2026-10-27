import { expectTypeOf, test } from "vitest";

import SetupMenu = foundry.setup.applications.SetupMenu;
import ApplicationV2 = foundry.applications.api.ApplicationV2;

test("foundry/setup/applications/setup-menu", () => {
  const app = new SetupMenu();

  expectTypeOf(app).toEqualTypeOf<SetupMenu>();
  expectTypeOf(app).toExtend<ApplicationV2.Any>();
  expectTypeOf(app.render({ force: true })).toEqualTypeOf<Promise<SetupMenu>>();
  expectTypeOf(app.toggleLock(true)).toBeVoid();
  expectTypeOf<SetupMenu.Button["pip"]>().toEqualTypeOf<SetupMenu.Pip | null | undefined>();
  expectTypeOf<SetupMenu.RenderContext["buttons"]>().toEqualTypeOf<SetupMenu.Button[]>();
});
