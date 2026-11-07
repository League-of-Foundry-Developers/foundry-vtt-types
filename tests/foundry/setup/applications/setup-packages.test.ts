import { describe, expect, expectTypeOf, test } from "vitest";

import SetupPackages = foundry.setup.applications.SetupPackages;
import ApplicationV2 = foundry.applications.api.ApplicationV2;
import Setup = foundry.setup.Setup;

class CustomSetupPackages extends SetupPackages {
  protected override _prepareTabs(group: string): Record<string, ApplicationV2.Tab> {
    return super._prepareTabs(group);
  }
}

// Setup apps are never rendered here: the tests run inside a world. Only the pure static helpers are called.
describe("SetupPackages Tests", () => {
  test("Runtime", () => {
    expect(SetupPackages.prototype).toBeInstanceOf(ApplicationV2);
    expect(CustomSetupPackages.prototype).toBeInstanceOf(SetupPackages);
    expect(SetupPackages.DEFAULT_OPTIONS.id).toBe("setup-packages");
    expect(Object.keys(SetupPackages.PARTS)).toEqual(["header", "worlds", "systems", "modules"]);
    expect(SetupPackages.TABS["primary"]?.initial).toBe("worlds");

    expect(SetupPackages.formatAuthors([{ name: "Foo", url: null }])).toBe("Foo");
    expect(SetupPackages.formatAuthors()).toBe("");
    expect(SetupPackages.getCover(undefined)).toBeUndefined();
    expect(SetupPackages.prepareModules).toBeTypeOf("function");
    expect(SetupPackages.prepareSystems).toBeTypeOf("function");
    expect(SetupPackages.sortPackages).toBeTypeOf("function");

    // Only constructible in the setup view: the constructor reads the `core.setupViewModes` setting, which only
    // `Setup#registerSettings` registers.
    expect(() => new SetupPackages()).toThrow('"core.setupViewModes" is not a registered game setting');
  });

  test("Types", () => {
    expectTypeOf(SetupPackages).toBeConstructibleWith();
    expectTypeOf(SetupPackages).instance.toEqualTypeOf<SetupPackages>();
    expectTypeOf<SetupPackages>().toExtend<ApplicationV2.Any>();
    expectTypeOf<SetupPackages["render"]>().toBeCallableWith({ force: true });
    expectTypeOf<SetupPackages["render"]>().toBeCallableWith({ force: true, refreshFavorites: true });
    expectTypeOf<SetupPackages["render"]>().returns.toEqualTypeOf<Promise<SetupPackages>>();
    expectTypeOf<SetupPackages["progressBars"]>().toEqualTypeOf<Map<string, HTMLElement>>();
    expectTypeOf<SetupPackages["search"]>().toBeCallableWith("dnd");
    expectTypeOf<SetupPackages["search"]>().returns.toBeVoid();
    expectTypeOf<SetupPackages["toggleLock"]>().toBeCallableWith(true, { message: "SETUP.BACKUPS.BackingUp" });
    expectTypeOf<SetupPackages["toggleLock"]>().returns.toBeVoid();
    expectTypeOf<SetupPackages["removeProgressBar"]>().toBeCallableWith("operation");
    expectTypeOf<SetupPackages["removeProgressBar"]>().returns.toBeVoid();
    expectTypeOf<SetupPackages["onProgress"]>().parameter(0).toEqualTypeOf<Setup.ProgressReceiverPacket | undefined>();
    expectTypeOf<SetupPackages["onProgress"]>().returns.toBeVoid();

    expectTypeOf(SetupPackages.formatAuthors([{ name: "Foo", url: null }])).toEqualTypeOf<string>();
    expectTypeOf(SetupPackages.getCover(undefined)).toEqualTypeOf<string | void>();
    expectTypeOf(SetupPackages.prepareModules).returns.toEqualTypeOf<SetupPackages.PreparedModule[]>();
    expectTypeOf(SetupPackages.prepareSystems).returns.toEqualTypeOf<SetupPackages.PreparedSystem[]>();
    expectTypeOf(SetupPackages.sortPackages).returns.toEqualTypeOf<number>();

    expectTypeOf<SetupPackages.PreparedWorld["authors"]>().toEqualTypeOf<string>();
    expectTypeOf<SetupPackages.PreparedWorld["system"]>().toEqualTypeOf<foundry.packages.System | undefined>();
    expectTypeOf<SetupPackages.RenderContext["worlds"]["packages"]>().toEqualTypeOf<SetupPackages.PreparedWorld[]>();

    expectTypeOf<CustomSetupPackages>().toExtend<SetupPackages>();
  });
});
