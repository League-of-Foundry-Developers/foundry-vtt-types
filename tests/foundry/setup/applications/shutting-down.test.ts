import { describe, expect, expectTypeOf, test } from "vitest";
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

// Never rendered here: `_onRender` schedules `game.socket.close()`.
describe("ShuttingDown Tests", () => {
  test("Runtime", () => {
    expect(ShuttingDown.prototype).toBeInstanceOf(ApplicationV2);
    expect(ShuttingDown.DEFAULT_OPTIONS.id).toBe("shutting-down");
    expect(Object.keys(ShuttingDown.PARTS)).toEqual(["main"]);

    const app = new ShuttingDown();
    expect(app.id).toBe("shutting-down");
    expect(new CustomShuttingDown()).toBeInstanceOf(ShuttingDown);
  });

  test("Types", () => {
    const app = new ShuttingDown();

    expectTypeOf(app).toEqualTypeOf<ShuttingDown>();
    expectTypeOf(app).toExtend<ApplicationV2.Any>();
    expectTypeOf<ShuttingDown["render"]>().toBeCallableWith({ force: true });
    expectTypeOf<ShuttingDown["render"]>().returns.toEqualTypeOf<Promise<ShuttingDown>>();

    expectTypeOf(new CustomShuttingDown()).toExtend<ShuttingDown>();
  });
});
