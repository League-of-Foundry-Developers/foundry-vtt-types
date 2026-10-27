import { expectTypeOf, test } from "vitest";
import type { DeepPartial } from "fvtt-types/utils";

import ShuttingDown = foundry.setup.applications.ShuttingDown;
import ApplicationV2 = foundry.applications.api.ApplicationV2;

class CustomShuttingDown extends ShuttingDown {
  protected override async _onRender(
    context: DeepPartial<ShuttingDown.RenderContext>,
    options: DeepPartial<ShuttingDown.RenderOptions>,
  ): Promise<void> {
    await super._onRender(context, options);
  }
}
test("foundry/setup/applications/shutting-down", () => {
  const app = new ShuttingDown();

  expectTypeOf(app).toEqualTypeOf<ShuttingDown>();
  expectTypeOf(app).toExtend<ApplicationV2.Any>();
  expectTypeOf(app.render({ force: true })).toEqualTypeOf<Promise<ShuttingDown>>();

  expectTypeOf(new CustomShuttingDown()).toExtend<ShuttingDown>();
});
