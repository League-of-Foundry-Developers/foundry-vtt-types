import { expectTypeOf, test } from "vitest";
import type { DeepPartial } from "fvtt-types/utils";

import JoinGameForm = foundry.setup.applications.JoinGameForm;
import ApplicationV2 = foundry.applications.api.ApplicationV2;

class CustomJoinGameForm extends JoinGameForm {
  protected override _configureRenderOptions(options: DeepPartial<JoinGameForm.RenderOptions>): void {
    super._configureRenderOptions(options);
  }
}
test("foundry/setup/applications/join-game-form", () => {
  const app = new JoinGameForm();

  expectTypeOf(app).toEqualTypeOf<JoinGameForm>();
  expectTypeOf(app).toExtend<ApplicationV2.Any>();
  expectTypeOf(app.render({ force: true })).toEqualTypeOf<Promise<JoinGameForm>>();
  expectTypeOf(new JoinGameForm({ id: "join-game" })).toEqualTypeOf<JoinGameForm>();
  expectTypeOf<JoinGameForm.RenderContext["preselected"]>().toEqualTypeOf<User.Implementation | null | undefined>();
  expectTypeOf<JoinGameForm.RenderContext["nextTime"]>().toEqualTypeOf<string | undefined>();

  expectTypeOf(new CustomJoinGameForm()).toExtend<JoinGameForm>();
});
