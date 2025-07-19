import { expectTypeOf, test } from "vitest";

import ApplicationV2 = foundry.applications.api.ApplicationV2;
import ContextMenu = foundry.applications.ux.ContextMenu;
import type { DeepPartial } from "#utils";

const { HandlebarsApplicationMixin } = foundry.applications.api;

// Regression test for "Class static side 'typeof _EnabledCompendiumsSettings' incorrectly extends base class static side 'typeof HandlebarsApplication & typeof ApplicationV2'."
// Reported by @denwav on Discord, see https://discord.com/channels/732325252788387980/803646399014109205/1259600593714937978
test("ApplicationV2 mixed with HandlebarsApplicationMixin regression test", () => {
  class _EnabledCompendiumsSettings extends HandlebarsApplicationMixin(ApplicationV2) {}
});

declare namespace HBMixinTest {
  interface RenderContext extends ApplicationV2.RenderContext {
    testProp?: number; // Exists only to differentiate from `ApplicationV2.RenderContext`.
  }

  interface Configuration<Test extends HBMixinTest = HBMixinTest> extends ApplicationV2.Configuration<Test> {}

  // Note(LukeAbby): This `& object` is so that the `DEFAULT_OPTIONS` can be overridden more easily
  // Without it then `static override DEFAULT_OPTIONS = { unrelatedProp: 123 }` would error.
  type DefaultOptions<Test extends HBMixinTest = HBMixinTest> = DeepPartial<Configuration<Test>> & object;

  interface RenderOptions extends ApplicationV2.RenderOptions {
    testProp?: string;
  }
}

class HBMixinTest extends HandlebarsApplicationMixin(ApplicationV2)<
  HBMixinTest.RenderContext,
  HBMixinTest.Configuration,
  HBMixinTest.RenderOptions
> {}

const hbMixinTest = new HBMixinTest();

expectTypeOf(hbMixinTest.parts).toEqualTypeOf<Record<string, HTMLElement>>();
expectTypeOf(hbMixinTest.title).toEqualTypeOf<string>();

expectTypeOf(HBMixinTest.PARTS).toEqualTypeOf<
  Record<string, foundry.applications.api.HandlebarsApplicationMixin.HandlebarsTemplatePart>
>();

declare module "fvtt-types/configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      HBMixinTest: HBMixinTest;
    }
  }
}

Hooks.on("renderHBMixinTest", (application, element, context, options) => {
  expectTypeOf(application).toEqualTypeOf<HBMixinTest>();
  expectTypeOf(element).toEqualTypeOf<HTMLElement>();
  expectTypeOf(context).toEqualTypeOf<HBMixinTest.RenderContext>();
  expectTypeOf(options).toEqualTypeOf<HBMixinTest.RenderOptions>();
});

Hooks.on("getHeaderControlsHBMixinTest", (application, controls) => {
  expectTypeOf(application).toEqualTypeOf<HBMixinTest>();
  expectTypeOf(controls).toEqualTypeOf<ApplicationV2.HeaderControlsEntry>();
});

Hooks.on("getHBMixinTestContextOptions", (application, controls) => {
  expectTypeOf(application).toEqualTypeOf<HBMixinTest>();
  expectTypeOf(controls).toEqualTypeOf<ContextMenu.Entry<JQuery | HTMLElement>[]>();
});

Hooks.on("closeHBMixinTest", (application) => {
  expectTypeOf(application).toEqualTypeOf<HBMixinTest>();
});
