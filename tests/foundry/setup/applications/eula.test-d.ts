import { expectTypeOf, test } from "vitest";
import type { DeepPartial } from "fvtt-types/utils";

import EULA = foundry.setup.applications.EULA;
import ApplicationV2 = foundry.applications.api.ApplicationV2;

class CustomEULA extends EULA {
  protected override async _renderFrame(options: DeepPartial<EULA.RenderOptions>): Promise<HTMLElement> {
    return super._renderFrame(options);
  }
}
test("foundry/setup/applications/eula", () => {
  const app = new EULA();

  expectTypeOf(app).toEqualTypeOf<EULA>();
  expectTypeOf(app).toExtend<ApplicationV2.Any>();
  expectTypeOf(app.render({ force: true })).toEqualTypeOf<Promise<EULA>>();
  expectTypeOf<EULA.RenderContext["html"]>().toEqualTypeOf<string>();

  expectTypeOf(new CustomEULA()).toExtend<EULA>();
});
