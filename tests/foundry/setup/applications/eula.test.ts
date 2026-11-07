import { describe, expect, expectTypeOf, test } from "vitest";
import type { DeepPartial } from "fvtt-types/utils";

import EULA = foundry.setup.applications.EULA;
import ApplicationV2 = foundry.applications.api.ApplicationV2;

class CustomEULA extends EULA {
  protected override async _renderFrame(options: DeepPartial<EULA.RenderOptions>): Promise<HTMLElement> {
    return super._renderFrame(options);
  }
}

// Setup apps are never rendered here: the tests run inside a world.
describe("EULA Tests", () => {
  test("Runtime", () => {
    expect(EULA.prototype).toBeInstanceOf(ApplicationV2);
    expect(EULA.DEFAULT_OPTIONS.id).toBe("eula");
    expect(Object.keys(EULA.PARTS)).toEqual(["content", "form"]);

    const app = new EULA();
    expect(app.id).toBe("eula");
    expect(new CustomEULA()).toBeInstanceOf(EULA);
  });

  test("Types", () => {
    const app = new EULA();

    expectTypeOf(app).toEqualTypeOf<EULA>();
    expectTypeOf(app).toExtend<ApplicationV2.Any>();
    expectTypeOf<EULA["render"]>().toBeCallableWith({ force: true });
    expectTypeOf<EULA["render"]>().returns.toEqualTypeOf<Promise<EULA>>();
    expectTypeOf<EULA.RenderContext["html"]>().toEqualTypeOf<string>();

    expectTypeOf(new CustomEULA()).toExtend<EULA>();
  });
});
