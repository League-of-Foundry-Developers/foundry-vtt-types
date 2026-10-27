import { expectTypeOf, test } from "vitest";

import SetupPackages = foundry.setup.applications.SetupPackages;
import ApplicationV2 = foundry.applications.api.ApplicationV2;
import Setup = foundry.setup.Setup;

declare const packet: Setup.ProgressReceiverPacket;

class CustomSetupPackages extends SetupPackages {
  protected override _prepareTabs(group: string): Record<string, ApplicationV2.Tab> {
    return super._prepareTabs(group);
  }
}
test("foundry/setup/applications/setup-packages", () => {
  const app = new SetupPackages();

  expectTypeOf(app).toEqualTypeOf<SetupPackages>();
  expectTypeOf(app).toExtend<ApplicationV2.Any>();
  expectTypeOf(app.render({ force: true })).toEqualTypeOf<Promise<SetupPackages>>();
  expectTypeOf(app.progressBars).toEqualTypeOf<Map<string, HTMLElement>>();
  expectTypeOf(app.search("dnd")).toBeVoid();
  expectTypeOf(app.toggleLock(true, { message: "SETUP.BACKUPS.BackingUp" })).toBeVoid();
  expectTypeOf(app.removeProgressBar("operation")).toBeVoid();
  expectTypeOf(app.onProgress(packet)).toBeVoid();
  expectTypeOf(app.render({ force: true, refreshFavorites: true })).toEqualTypeOf<Promise<SetupPackages>>();

  expectTypeOf(SetupPackages.formatAuthors([{ name: "Foo", url: null }])).toEqualTypeOf<string>();
  expectTypeOf(SetupPackages.getCover(undefined)).toEqualTypeOf<string | void>();
  expectTypeOf(SetupPackages.prepareModules()).toEqualTypeOf<SetupPackages.PreparedModule[]>();
  expectTypeOf(SetupPackages.prepareSystems()).toEqualTypeOf<SetupPackages.PreparedSystem[]>();
  expectTypeOf(SetupPackages.sortPackages).returns.toEqualTypeOf<number>();

  expectTypeOf<SetupPackages.PreparedWorld["authors"]>().toEqualTypeOf<string>();
  expectTypeOf<SetupPackages.PreparedWorld["system"]>().toEqualTypeOf<foundry.packages.System | undefined>();
  expectTypeOf<SetupPackages.RenderContext["worlds"]["packages"]>().toEqualTypeOf<SetupPackages.PreparedWorld[]>();

  expectTypeOf(new CustomSetupPackages()).toExtend<SetupPackages>();
});
