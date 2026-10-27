import { expectTypeOf, test } from "vitest";
import type { AnyObject } from "fvtt-types/utils";

import Setup = foundry.setup.Setup;

declare const setup: Setup;
declare const pkg: Setup.Package;
declare const backup: Setup.BackupData;
declare const snapshot: Setup.SnapshotData;
declare const release: foundry.config.ReleaseData;

test("foundry/setup/setup", () => {
  expectTypeOf(setup).toExtend<foundry.Game>();
  expectTypeOf(setup.view).toEqualTypeOf<foundry.Game.View>();

  // The game instance in package-running views is never `Setup`.
  expectTypeOf<foundry.Game>().not.toExtend<Setup>();

  expectTypeOf(setup.serverSettings).toEqualTypeOf<foundry.config.ServerSettings>();
  expectTypeOf(setup.packageCache.module.state).toEqualTypeOf<Setup.CacheState>();
  expectTypeOf(setup.backupsCache).toEqualTypeOf<Setup.BackupsListing | null>();
  expectTypeOf(Setup.setupURL).toEqualTypeOf<string>();

  expectTypeOf(setup.checkPackage({ id: "dice-so-nice" })).toEqualTypeOf<Promise<Setup.PackageManifestData>>();
  expectTypeOf(setup.warmPackages({ type: "module" })).toEqualTypeOf<Promise<void>>();
  expectTypeOf(setup.getPackages()).toEqualTypeOf<Promise<Map<string, Setup.PackageManifestData>>>();
  expectTypeOf(setup.getQuickstartAdventures()).toEqualTypeOf<Record<string, Setup.QuickstartAdventure>>();
  expectTypeOf(setup.listBackups()).toEqualTypeOf<Promise<Setup.BackupsListing | null>>();
  expectTypeOf(setup.browsePackages("system", { search: "Crucible" })).toEqualTypeOf<Promise<void>>();

  expectTypeOf(
    setup.installPackage({
      type: "system",
      manifest: "https://example.com/system.json",
      onProgress: (event) => expectTypeOf(event.data).toEqualTypeOf<Setup.ProgressReceiverPacket>(),
    }),
  ).toEqualTypeOf<Promise<Setup.Package>>();
  expectTypeOf(setup.checkDependencies(pkg)).toEqualTypeOf<Promise<Map<string, Setup.PackageDependencyCheck>>>();
  expectTypeOf(setup.installDependencies(pkg, { allowManual: false })).toEqualTypeOf<Promise<boolean | null>>();
  expectTypeOf(setup.previewCompatibility(release)).toEqualTypeOf<
    Promise<Setup.PreviewCompatibilityDescriptor | null>
  >();

  expectTypeOf(setup.createBackup(pkg, { note: "before update" })).toEqualTypeOf<Promise<boolean>>();
  expectTypeOf(
    setup.createSnapshot({ dialog: true }, { confirm: "SETUP.BACKUPS.CreateSnapshotConfirm" }),
  ).toEqualTypeOf<Promise<void>>();
  expectTypeOf(setup.deleteBackups(pkg, [backup.id], { dialog: true })).toEqualTypeOf<Promise<void>>();
  expectTypeOf(setup.deleteSnapshots([snapshot.id])).toEqualTypeOf<Promise<void>>();
  expectTypeOf(setup.restoreBackup(backup)).toEqualTypeOf<Promise<void>>();
  expectTypeOf(setup.restoreSnapshot(snapshot, { dialog: true })).toEqualTypeOf<Promise<void>>();
  expectTypeOf(setup.restoreLatestBackup(pkg)).toEqualTypeOf<Promise<void>>();

  expectTypeOf(setup.reload()).toEqualTypeOf<Promise<void>>();
  expectTypeOf(setup.post({ action: "getPackages", type: "module" }, { notify: false })).toEqualTypeOf<
    Promise<AnyObject | string>
  >();
  expectTypeOf(setup.toggleLock(false)).toBeVoid();

  expectTypeOf<Setup.BackupsListing["world"]>().toEqualTypeOf<Record<string, Setup.BackupData[]> | undefined>();
});
