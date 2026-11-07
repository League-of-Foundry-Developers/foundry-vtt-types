import { describe, expect, expectTypeOf, test } from "vitest";
import type { AnyObject } from "fvtt-types/utils";

import Setup = foundry.setup.Setup;

// Tests run inside a world, where `game` is a `Game` and nothing on `Setup` may be invoked. Runtime assertions only
// check that the class and its members exist; type assertions use non-invoking forms.
describe("Setup Tests", () => {
  test("Runtime", () => {
    expect(Setup).toBeTypeOf("function");
    expect(Setup.prototype).toBeInstanceOf(foundry.Game);
    expect(Setup.setupURL).toBe(foundry.utils.getRoute("setup"));

    // The game instance in package-running views is never `Setup`.
    expect(game).not.toBeInstanceOf(Setup);

    const methods = [
      "checkPackage",
      "warmPackages",
      "getPackages",
      "getQuickstartAdventures",
      "listBackups",
      "browsePackages",
      "installPackage",
      "checkDependencies",
      "installDependencies",
      "uninstallPackage",
      "previewCompatibility",
      "createBackup",
      "createSnapshot",
      "deleteBackups",
      "deleteSnapshots",
      "restoreBackup",
      "restoreSnapshot",
      "restoreLatestBackup",
      "reload",
      "post",
      "toggleLock",
    ] as const satisfies (keyof Setup)[];
    for (const method of methods) expect(Setup.prototype[method], method).toBeTypeOf("function");
  });

  test("Types", () => {
    expectTypeOf<Setup>().toExtend<foundry.Game>();
    expectTypeOf<Setup["view"]>().toEqualTypeOf<foundry.Game.View>();
    expectTypeOf<foundry.Game>().not.toExtend<Setup>();

    expectTypeOf<Setup["serverSettings"]>().toEqualTypeOf<foundry.config.ServerSettings>();
    expectTypeOf<Setup["packageCache"]["module"]["state"]>().toEqualTypeOf<Setup.CacheState>();
    expectTypeOf<Setup["backupsCache"]>().toEqualTypeOf<Setup.BackupsListing | null>();
    expectTypeOf(Setup.setupURL).toEqualTypeOf<string>();

    expectTypeOf<Setup["checkPackage"]>().toBeCallableWith({ id: "dice-so-nice" });
    expectTypeOf<Setup["checkPackage"]>().returns.toEqualTypeOf<Promise<Setup.PackageManifestData>>();
    expectTypeOf<Setup["warmPackages"]>().toBeCallableWith({ type: "module" });
    expectTypeOf<Setup["warmPackages"]>().returns.toEqualTypeOf<Promise<void>>();
    expectTypeOf<Setup["getPackages"]>().toBeCallableWith();
    expectTypeOf<Setup["getPackages"]>().returns.toEqualTypeOf<Promise<Map<string, Setup.PackageManifestData>>>();
    expectTypeOf<Setup["getQuickstartAdventures"]>().returns.toEqualTypeOf<Record<string, Setup.QuickstartAdventure>>();
    expectTypeOf<Setup["listBackups"]>().returns.toEqualTypeOf<Promise<Setup.BackupsListing | null>>();
    expectTypeOf<Setup["browsePackages"]>().toBeCallableWith("system", { search: "Crucible" });
    expectTypeOf<Setup["browsePackages"]>().returns.toEqualTypeOf<Promise<void>>();

    expectTypeOf<Setup["installPackage"]>().toBeCallableWith({
      type: "system",
      manifest: "https://example.com/system.json",
      onProgress: (event) => expectTypeOf(event.data).toEqualTypeOf<Setup.ProgressReceiverPacket>(),
    });
    expectTypeOf<Setup["installPackage"]>().returns.toEqualTypeOf<Promise<Setup.Package>>();
    expectTypeOf<Setup["checkDependencies"]>().parameter(0).toEqualTypeOf<Setup.Package>();
    expectTypeOf<Setup["checkDependencies"]>().returns.toEqualTypeOf<
      Promise<Map<string, Setup.PackageDependencyCheck>>
    >();
    expectTypeOf<Setup["installDependencies"]>().parameter(0).toEqualTypeOf<Setup.Package>();
    expectTypeOf({ allowManual: false }).toExtend<Setup.InstallDependenciesOptions>();
    expectTypeOf<Setup["installDependencies"]>().returns.toEqualTypeOf<Promise<boolean | null>>();
    expectTypeOf<Setup["previewCompatibility"]>().parameter(0).toEqualTypeOf<foundry.config.ReleaseData>();
    expectTypeOf<Setup["previewCompatibility"]>().returns.toEqualTypeOf<
      Promise<Setup.PreviewCompatibilityDescriptor | null>
    >();

    expectTypeOf<Setup["createBackup"]>().parameter(0).toEqualTypeOf<Setup.Package>();
    expectTypeOf({ note: "before update" }).toExtend<Setup.CreateBackupOptions>();
    expectTypeOf<Setup["createBackup"]>().returns.toEqualTypeOf<Promise<boolean>>();
    expectTypeOf<Setup["createSnapshot"]>().toBeCallableWith(
      { dialog: true },
      { confirm: "SETUP.BACKUPS.CreateSnapshotConfirm" },
    );
    expectTypeOf<Setup["createSnapshot"]>().returns.toEqualTypeOf<Promise<void>>();
    expectTypeOf<Setup["deleteBackups"]>().parameter(0).toEqualTypeOf<Setup.Package>();
    expectTypeOf<Setup["deleteBackups"]>().parameter(1).toEqualTypeOf<string[]>();
    expectTypeOf({ dialog: true }).toExtend<Setup.DialogOptions>();
    expectTypeOf<Setup["deleteBackups"]>().returns.toEqualTypeOf<Promise<void>>();
    expectTypeOf<Setup["deleteSnapshots"]>().toBeCallableWith(["snapshot-id"], { dialog: true });
    expectTypeOf<Setup["deleteSnapshots"]>().returns.toEqualTypeOf<Promise<void>>();
    expectTypeOf<Setup["restoreBackup"]>().parameter(0).toEqualTypeOf<Setup.BackupData>();
    expectTypeOf<Setup["restoreBackup"]>().returns.toEqualTypeOf<Promise<void>>();
    expectTypeOf<Setup["restoreSnapshot"]>().parameter(0).toEqualTypeOf<Setup.SnapshotData>();
    expectTypeOf<Setup["restoreSnapshot"]>().returns.toEqualTypeOf<Promise<void>>();
    expectTypeOf<Setup["restoreLatestBackup"]>().parameter(0).toEqualTypeOf<Setup.Package>();
    expectTypeOf<Setup["restoreLatestBackup"]>().returns.toEqualTypeOf<Promise<void>>();

    expectTypeOf<Setup["reload"]>().returns.toEqualTypeOf<Promise<void>>();
    expectTypeOf<Setup["post"]>().toBeCallableWith({ action: "getPackages", type: "module" }, { notify: false });
    expectTypeOf<Setup["post"]>().returns.toEqualTypeOf<Promise<AnyObject | string>>();
    expectTypeOf<Setup["toggleLock"]>().toBeCallableWith(false);
    expectTypeOf<Setup["toggleLock"]>().returns.toBeVoid();

    expectTypeOf<Setup.BackupsListing["world"]>().toEqualTypeOf<Record<string, Setup.BackupData[]> | undefined>();

    // `minimum` and `reason` are always set by `#checkDependency`, possibly to `undefined`.
    expectTypeOf<Setup.PackageDependencyCheck>().toHaveProperty("minimum").toEqualTypeOf<string | undefined>();
    expectTypeOf<Setup.PackageDependencyCheck>().toHaveProperty("reason").toEqualTypeOf<string | undefined>();
    expectTypeOf<{ minimum: undefined; reason: undefined }>().toExtend<
      Pick<Setup.PackageDependencyCheck, "minimum" | "reason">
    >();
    expectTypeOf<{ reason: undefined }>().not.toExtend<Pick<Setup.PackageDependencyCheck, "minimum" | "reason">>();
  });
});
