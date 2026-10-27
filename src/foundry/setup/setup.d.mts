import type { Socket } from "socket.io-client";
import type { AnyObject, DeepPartial, Identity } from "#utils";
import type Game from "#client/game.d.mts";
import type ApplicationV2 from "#client/applications/api/application.d.mts";
import type { FetchWithTimeoutOptions } from "#common/utils/http.d.mts";
import type SetupPackages from "./applications/setup-packages.d.mts";

import World = foundry.packages.World;
import System = foundry.packages.System;
import Module = foundry.packages.Module;

/**
 * A library of package management commands which are used by various interfaces around the software.
 * @remarks Replaces {@linkcode Game} as the `game` instance in the setup views, where package code does not run.
 */
declare class Setup extends Game {
  /**
   * @remarks Defined in the constructor with `defineProperty` from the server's options, so it is not writable.
   */
  readonly serverSettings: foundry.config.ServerSettings;

  /**
   * A cached object of retrieved package data from the web server.
   */
  packageCache: Setup.PackageCache;

  /**
   * A cached list of the user's backups.
   * @defaultValue `null`
   */
  backupsCache: Setup.BackupsListing | null;

  /**
   * A reference to the setup URL used under the current route prefix, if any
   */
  static get setupURL(): string;

  /**
   * Register core game settings
   */
  override registerSettings(): void;

  override setupPackages(data: Setup.PackagesData): void;

  static override getData(socket: Socket, view: string): Promise<unknown>;

  /**
   * @remarks Renders the applications of the current view.
   * @throws If the view is not one of the setup views.
   */
  protected override _initializeView(): Promise<void>;

  /**
   * Check with the server whether a package of a certain type may be installed or updated.
   * @param options - Options which affect how the check is performed
   * @returns The resulting manifest if an update is available
   */
  checkPackage(options?: Setup.CheckPackageOptions): Promise<Setup.PackageManifestData>;

  /**
   * Prepares the cache of available and owned packages
   * @param options - Options which configure how the cache is warmed
   */
  warmPackages(options?: Setup.PackageTypeOptions): Promise<void>;

  /**
   * Get a Map of available packages of a given type which may be installed
   * @remarks Resolves to an empty Map, after displaying an error notification, if the server request fails.
   */
  getPackages(options?: Setup.PackageTypeOptions): Promise<Map<string, Setup.PackageManifestData>>;

  /**
   * Get all adventures eligible for quick-starting.
   */
  getQuickstartAdventures(): Record<string, Setup.QuickstartAdventure>;

  /**
   * List the user's current backups.
   */
  listBackups(): Promise<Setup.BackupsListing | null>;

  /**
   * Open the Package Browser application
   * @param packageType - The type of package being installed, in ["module", "system", "world"]
   * @param options     - Options forwarded to InstallPackage
   */
  browsePackages(packageType: CONST.PACKAGE_TYPES, options?: Setup.BrowsePackagesOptions): Promise<void>;

  /**
   * Install a Package
   * @param options - Options which affect how the package is installed
   * @returns A Promise which resolves to the installed package
   * @remarks
   * @throws If the installation fails.
   */
  installPackage(options?: Setup.InstallPackageOptions): Promise<Setup.Package>;

  /**
   * Retrieve package dependency info.
   * @param pkg - The package.
   */
  checkDependencies(pkg: Setup.Package): Promise<Map<string, Setup.PackageDependencyCheck>>;

  /**
   * Install a set of dependency modules which are required by an installed package
   * @param pkg     - The package which was installed that requested dependencies
   * @param options - Options which modify dependency installation behavior. Additional options are
   *                  forwarded to installPackage.
   * @returns Returns true if all required dependencies are satisfied, false if they are not,
   * or null if the dialog was dismissed.
   */
  installDependencies(pkg: Setup.Package, options?: Setup.InstallDependenciesOptions): Promise<boolean | null>;

  /**
   * Handle requests to uninstall a package.
   * @param pkg - The package to uninstall
   * @remarks Resolves to the error notification, without uninstalling, if the package is locked.
   * @throws If the server fails to uninstall the package.
   */
  uninstallPackage(pkg: Setup.Package): Promise<foundry.applications.ui.Notifications.Notification<"error"> | void>;

  /**
   * Retrieve compatibility data for installed packages in the next version of the core software.
   * @param release - The release to check against.
   * @remarks Resolves to `null` if the server request fails.
   */
  previewCompatibility(release: foundry.config.ReleaseData): Promise<Setup.PreviewCompatibilityDescriptor | null>;

  /**
   * Create a backup of a given package.
   * @param pkg - The package.
   * @returns Whether the backup was created.
   */
  createBackup(pkg: Setup.Package, options?: Setup.CreateBackupOptions): Promise<boolean>;

  /**
   * Create a snapshot of the current installation state.
   * @param dialogOptions - Options to forward to the dialog.
   */
  createSnapshot(options?: Setup.CreateBackupOptions, dialogOptions?: Setup.SnapshotDialogOptions): Promise<void>;

  /**
   * Delete backups.
   * @param pkg       - The package whose backups are being deleted.
   * @param backupIds - The IDs of the backups to delete.
   */
  deleteBackups(pkg: Setup.Package, backupIds: string[], options?: Setup.DialogOptions): Promise<void>;

  /**
   * Delete snapshots.
   * @param snapshotIds - The IDs of the snapshots to delete.
   */
  deleteSnapshots(snapshotIds: string[], options?: Setup.DialogOptions): Promise<void>;

  /**
   * Restore a backup.
   * @param backupData - The backup to restore.
   */
  restoreBackup(backupData: Setup.BackupData, options?: Setup.DialogOptions): Promise<void>;

  /**
   * Restore a snapshot.
   * @param snapshotData - The snapshot to restore.
   */
  restoreSnapshot(snapshotData: Setup.SnapshotData, options?: Setup.DialogOptions): Promise<void>;

  /**
   * Restore the latest backup for a given package.
   * @param pkg - The package.
   * @remarks Does nothing if the package has no backups.
   */
  restoreLatestBackup(pkg: Setup.Package, options?: Setup.DialogOptions): Promise<void>;

  /**
   * Add a function to be called on a progress event.
   * @internal
   */
  _addProgressListener(listener: Setup.ProgressListener): void;

  /**
   * Stop sending progress events to a given function.
   * @internal
   */
  _removeProgressListener(listener: Setup.ProgressListener): void;

  /**
   * Reload package data from the server and update its display
   */
  reload(): Promise<void>;

  /**
   * @remarks Ignores links to the setup page itself.
   */
  protected override _onClickHyperlink(event: MouseEvent): void;

  /**
   * Post to the Setup endpoint.
   * @param requestData - An object of data which should be included with the POST request
   * @param options     - An object of options passed to the fetchWithTimeout method
   * @returns A Promise resolving to the returned response data
   * @throws An error if the request was not successful
   */
  post(requestData: AnyObject, options?: Setup.PostOptions): Promise<AnyObject | string>;

  /**
   * Toggle the locked state of the interface.
   * @param locked - Is the interface locked?
   */
  toggleLock(locked: boolean, options?: SetupPackages.ToggleLockOptions): void;

  #Setup: true;
  static #SetupStatic: true;
}

declare namespace Setup {
  interface Any extends AnySetup {}
  interface AnyConstructor extends Identity<typeof AnySetup> {}

  /** @remarks A package the setup screen manages. */
  type Package = World | System | Module;

  type PackageManifestData = foundry.packages.BasePackage.ManifestData;

  /**
   * @remarks Whether a cache is cold (`0`), warming (`1`) or warmed (`2`).
   */
  type CacheState = 0 | 1 | 2;

  interface PackageCacheEntry {
    packages: Map<string, PackageManifestData>;

    state: CacheState;
  }

  interface PackageCache {
    system: PackageCacheEntry;

    module: PackageCacheEntry;
  }

  interface PackagesData extends Game.Data {
    worlds?: World.Source[] | undefined;

    systems?: System.Source[] | undefined;
  }

  interface PackageTypeOptions {
    /**
     * The type of package being cached
     * @defaultValue `"system"`
     */
    type?: "system" | "module" | undefined;
  }

  interface CheckPackageOptions {
    /**
     * The package type to check
     * @defaultValue `"module"`
     */
    type?: CONST.PACKAGE_TYPES | undefined;

    /** The package id to check */
    id?: string | undefined;

    /** The manifest URL to check */
    manifest?: string | undefined;

    /**
     * A timeout in milliseconds after which the check will fail
     * @defaultValue `20000`
     */
    timeout?: number | undefined;
  }

  interface QuickstartAdventure {
    module: Module;

    /** @remarks The IDs of the systems the module's adventures are for. */
    systems: Set<string>;
  }

  interface BrowsePackagesOptions extends DeepPartial<ApplicationV2.Configuration> {
    /** @remarks An initial search query. */
    search?: string | null | undefined;
  }

  /**
   * @remarks The event a progress listener receives; its `data` is the server's progress packet.
   */
  interface ProgressEvent extends Event {
    data: ProgressReceiverPacket;
  }

  /** @internal */
  interface _InstallOptions {
    /**
     * Display a notification toast?
     * @defaultValue `true`
     */
    notify?: boolean | undefined;

    /**
     * Attempt to install even if a compatibility check would otherwise prevent it?
     * @defaultValue `false`
     */
    force?: boolean | undefined;

    /** A callback to invoke on each progress tick. */
    onProgress?: ((event: ProgressEvent) => void) | undefined;
  }

  interface InstallPackageOptions extends _InstallOptions {
    /**
     * The type of package being installed, in ["module", "system", "world"]
     * @defaultValue `"module"`
     */
    type?: CONST.PACKAGE_TYPES | undefined;

    /** The package id */
    id?: string | undefined;

    /** The package manifest URL */
    manifest?: string | undefined;

    /**
     * Attempt to resolve and install this package's dependencies.
     * @defaultValue `true`
     */
    dependencies?: boolean | undefined;
  }

  interface PackageDependencyCheck {
    /** The package id */
    id: string;

    /** The package title. */
    title: string;

    /** The package type */
    type: CONST.PACKAGE_TYPES;

    /** The package manifest URL */
    manifest: string;

    /** Whether the package is already installed */
    installNeeded: boolean;

    /** Whether the package is listed. */
    listed: boolean;

    /** Whether the package can be installed */
    canInstall: boolean;

    /** An error message to display to the user */
    message: string;

    /** The URL to the package */
    url: string;

    /** The package's available version */
    version: string;

    /** The package's minimum version requirement. */
    minimum?: string;

    /** Whether the package is required or just optional. */
    required: boolean;

    /** Note explaining whether the package is required or optional. */
    note: string;

    /** The package author's reason for the dependency. */
    reason?: string;
  }

  interface InstallDependenciesOptions extends _InstallOptions {
    /**
     * Allow the user to opt-out of automatic dependency installation.
     * @defaultValue `true`
     */
    allowManual?: boolean | undefined;

    /** Already-resolved dependencies. */
    dependencies?: Map<string, PackageDependencyCheck> | undefined;
  }

  interface DialogOptions {
    /** Spawn a warning dialog and ask the user to confirm the action. */
    dialog?: boolean | undefined;
  }

  interface CreateBackupOptions {
    /** An optional note for the backup. Ignored if dialog is true. */
    note?: string | undefined;

    /** Spawn a dialog to prompt the user for a note. */
    dialog?: boolean | undefined;
  }

  interface SnapshotDialogOptions extends DeepPartial<ApplicationV2.Configuration> {
    /** Whether the dialog contains a warning. */
    warning?: boolean | undefined;

    /** Whether the dialog should prompt the user for a note. */
    note?: boolean | undefined;

    /** Whether the dialog should prompt the user for a confirmation code. */
    confirmCode?: boolean | undefined;

    /** Whether the dialog should include a list of currently-installed packages. */
    packageList?: boolean | undefined;

    /** A snapshot associated with this operation. */
    snapshotData?: SnapshotData | undefined;

    /**
     * The action value to send to /setup to request disk space information for
     * this operation.
     */
    diskSpaceAction?: string | undefined;

    /** The dialog message. */
    message?: string | undefined;

    /** An additional confirmation message. */
    confirm?: string | undefined;
  }

  /**
   * @privateRemarks Foundry does not ship this typedef; the shape is what the setup code reads from it.
   */
  interface BackupData {
    id: string;

    type: CONST.PACKAGE_TYPES;

    packageId: string;

    /** @remarks The package title at the time of the backup. */
    title: string;

    description: string;

    note: string;

    /** @remarks In bytes. */
    size: number;

    /** @remarks A timestamp in milliseconds. */
    createdAt: number;

    /** @remarks Present when the backup is part of a snapshot. */
    snapshotId?: string;
  }

  /**
   * @privateRemarks Foundry does not ship this typedef; the shape is what the setup code reads from it.
   */
  interface SnapshotData {
    id: string;

    note: string;

    /** @remarks In bytes. */
    size: number;

    /** @remarks A timestamp in milliseconds. */
    createdAt: number;
  }

  /**
   * @remarks Backups are grouped by package type, then by package ID, newest first.
   * @privateRemarks Foundry does not ship this typedef; the shape is what the setup code reads from it.
   */
  interface BackupsListing {
    snapshots: Record<string, SnapshotData>;

    world?: Record<string, BackupData[]>;

    system?: Record<string, BackupData[]>;

    module?: Record<string, BackupData[]>;
  }

  /**
   * @privateRemarks Foundry does not ship this typedef; the shape is what the setup code reads from it.
   */
  interface PreviewCompatibilityDescriptor {
    /** @remarks The version of the release the preview was computed for. */
    version: string;

    world: World.Source[];

    system: System.Source[];

    module: Module.Source[];
  }

  interface ProgressReceiverPacket {
    /** The progress action. */
    action: CONST.SETUP_PACKAGE_PROGRESS.ACTIONS;

    /** The operation identifier. */
    id: string;

    /** The progress percentage. */
    pct: number;

    /** The individual step in the action. */
    step: CONST.SETUP_PACKAGE_PROGRESS.STEPS;

    /** A text status message. */
    message?: string;

    /** The title of the entry. If not provided, the ID is used instead. */
    title?: string;
  }

  type ProgressListener = (data: ProgressReceiverPacket) => void;

  interface PostOptions extends FetchWithTimeoutOptions {
    /**
     * Whether to spawn notification dialogs when errors are encountered.
     * @defaultValue `true`
     */
    notify?: boolean | undefined;
  }
}

declare abstract class AnySetup extends Setup {
  constructor(...args: never);
}

export default Setup;
