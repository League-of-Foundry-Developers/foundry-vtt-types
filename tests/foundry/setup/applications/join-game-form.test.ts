import { describe, expect, expectTypeOf, test } from "vitest";
import type { DeepPartial } from "fvtt-types/utils";

import JoinGameForm = foundry.setup.applications.JoinGameForm;
import ApplicationV2 = foundry.applications.api.ApplicationV2;

class CustomJoinGameForm extends JoinGameForm {
  protected override _configureRenderOptions(options: DeepPartial<JoinGameForm.RenderOptions>): void {
    super._configureRenderOptions(options);
  }
}

// Not constructed here: the constructor registers the app in `game.users.apps`, which would leak into the test world.
describe("JoinGameForm Tests", () => {
  test("Runtime", () => {
    expect(JoinGameForm.prototype).toBeInstanceOf(ApplicationV2);
    expect(JoinGameForm.DEFAULT_OPTIONS.id).toBe("join-game");
    expect(Object.keys(JoinGameForm.PARTS)).toEqual(["form", "details", "setup", "world"]);
    expect(CustomJoinGameForm.prototype).toBeInstanceOf(JoinGameForm);
  });

  test("Types", () => {
    expectTypeOf(JoinGameForm).toBeConstructibleWith();
    expectTypeOf(JoinGameForm).toBeConstructibleWith({ id: "join-game" });
    expectTypeOf(JoinGameForm).instance.toEqualTypeOf<JoinGameForm>();
    expectTypeOf<JoinGameForm>().toExtend<ApplicationV2.Any>();
    expectTypeOf<JoinGameForm["render"]>().toBeCallableWith({ force: true });
    expectTypeOf<JoinGameForm["render"]>().returns.toEqualTypeOf<Promise<JoinGameForm>>();
    expectTypeOf<JoinGameForm.RenderContext["preselected"]>().toEqualTypeOf<User.Implementation | null | undefined>();
    expectTypeOf<JoinGameForm.RenderContext["nextTime"]>().toEqualTypeOf<string | undefined>();

    expectTypeOf<CustomJoinGameForm>().toExtend<JoinGameForm>();
  });
});
