import type { FixedInstanceType, Mixin } from "#utils";
import type { CONST } from "#client/client.d.mts";
import type BasePackage from "#common/packages/base-package.d.mts";
import type Module from "./module.d.mts";
import type System from "./system.d.mts";

/**
 * A client-side mixin used for all Package types.
 * @param BasePackage - The parent BasePackage class being mixed
 * @returns A BasePackage subclass mixed with ClientPackage features
 */
declare function ClientPackageMixin<BaseClass extends ClientPackageMixin.BaseClass>(
  BasePackage: BaseClass,
): Mixin<typeof ClientPackageMixin.ClientPackage, BaseClass>;

declare namespace ClientPackageMixin {
  interface AnyMixedConstructor extends ReturnType<typeof ClientPackageMixin<BaseClass>> {}
  interface AnyMixed extends FixedInstanceType<AnyMixedConstructor> {}

  type BaseClass = BasePackage.Internal.Constructor;

  interface PackageCompatibilityBadge {
    type: "safe" | "unsafe" | "warning" | "neutral" | "error";
    tooltip: string;
    label?: string;
    icon?: string;
  }

  interface ModuleCreateData extends Module.CreateData {
    active: boolean;
  }

  interface SystemCreateData extends foundry.packages.BaseSystem.CreateData {
    strictDataCleaning?: boolean;
  }

  interface GetVersionBadgeOptions {
    /**
     * A specific collection of modules to test availability against. Tests against the currently installed modules by default.
     */
    modules?: Collection<Module>;

    /**
     * A specific collection of systems to test availability against. Tests against the currently installed systems by default.
     */
    systems?: Collection<System>;
  }

  interface FormatBadDependenciesTooltipOptions {
    /**
     * A specific collection of modules to test availability against. Tests against the currently installed modules by default.
     */
    modules?: Collection<Module> | undefined;

    /**
     * A specific collection of systems to test availability against. Tests against the currently installed systems by default.
     */
    systems?: Collection<System> | undefined;
  }

  interface FormatIncompatibleSystemsTooltipOptions {
    /**
     * A specific collection of systems to test availability against. Tests against the currently installed systems by default.
     */
    systems?: Collection<System> | undefined;
  }

  interface FromRemoteManifestOptions {
    /**
     * Whether to construct the remote package strictly
     * @defaultValue `true`
     */
    strict?: boolean | undefined;
  }

  class ClientPackage {
    /** @privateRemarks All mixin classses should accept anything for its constructor. */
    constructor(...args: any[]);

    /**
     * Is this package marked as a favorite?
     * This boolean is currently only populated as true in the /setup view of the software.
     */
    favorite: false;

    /**
     * Associate package availability with certain badge for client-side display.
     */
    getVersionBadge(): PackageCompatibilityBadge | null;

    /**
     * Determine a version badge for the provided compatibility data.
     * @param availability - The availability level.
     * @param data         - The compatibility data.
     * @param options      - (default: `{}`)
     */
    static getVersionBadge(
      availability: CONST.PACKAGE_AVAILABILITY_CODES,
      data: Partial<PackageManifestData>,
      options: GetVersionBadgeOptions,
    ): PackageCompatibilityBadge | null;

    /**
     * List missing dependencies and format them for display.
     * @param availability - The availability level.
     * @param data         - The compatibility data.
     * @param options      - (default: `{}`)
     */
    static _formatBadDependenciesTooltip(
      availability: CONST.PACKAGE_AVAILABILITY_CODES,
      data: Partial<PackageManifestData>,
      options: FormatBadDependenciesTooltipOptions,
    ): string;

    /**
     * List missing dependencies and format them for display.
     * @param availability - The availability level.
     * @param data         - The compatibility data.
     * @param options      - (default: `{}`)
     */
    static _formatIncompatibleSystemsTooltip(
      availability: CONST.PACKAGE_AVAILABILITY_CODES,
      data: Partial<PackageManifestData>,
      options: FormatIncompatibleSystemsTooltipOptions,
    ): string;

    /**
     * When a package has been installed, add it to the local game data.
     */
    install(): void;

    /**
     * When a package has been uninstalled, remove it from the local game data.
     */
    uninstall(): void;

    /**
     * Remove a package from the local game data when it has been uninstalled.
     * @param id - The package ID.
     */
    static uninstall(id: string): void;

    /**
     * Retrieve the latest Package manifest from a provided remote location.
     * @param manifest - A remote manifest URL to load
     * @param options  - Additional options which affect package construction
     * @returns A Promise which resolves to a constructed ServerPackage instance
     * @throws An error if the retrieved manifest data is invalid
     */
    static fromRemoteManifest(manifest: string, options: FromRemoteManifestOptions): Promise<ClientPackage | null>;
  }
}

export default ClientPackageMixin;
