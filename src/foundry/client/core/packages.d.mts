import type { FixedInstanceType, InexactPartial, Mixin } from "fvtt-types/utils";
import type { CONST } from "../../client-esm/client.d.mts";
import type BasePackage from "../../common/packages/base-package.d.mts";

declare class ClientPackage {
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
  getVersionBadge(): ClientPackage.PackageCompatibilityBadge | null;

  /**
   * Determine a version badge for the provided compatibility data.
   * @param availability - The availability level.
   * @param data         - The compatibility data.
   * @param options      - (default: `{}`)
   */
  static getVersionBadge(
    availability: CONST.PACKAGE_AVAILABILITY_CODES,
    data: Partial<PackageManifestData>,
    options: InexactPartial<{
      /**
       * A specific collection of modules to test availability against. Tests against the currently installed modules by default.
       */
      modules: Collection<Module>;
      /**
       * A specific collection of systems to test availability against. Tests against the currently installed systems by default.
       */
      systems: Collection<System>;
    }>,
  ): ClientPackage.PackageCompatibilityBadge | null;

  /**
   * List missing dependencies and format them for display.
   * @param availability - The availability level.
   * @param data         - The compatibility data.
   * @param options      - (default: `{}`)
   */
  static _formatBadDependenciesTooltip(
    availability: CONST.PACKAGE_AVAILABILITY_CODES,
    data: Partial<PackageManifestData>,
    options: InexactPartial<{
      /**
       * A specific collection of modules to test availability against. Tests against the currently installed modules by default.
       */
      modules: Collection<Module>;
      /**
       * A specific collection of systems to test availability against. Tests against the currently installed systems by default.
       */
      systems: Collection<System>;
    }>,
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
    options: InexactPartial<{
      /**
       * A specific collection of systems to test availability against. Tests against the currently installed systems by default.
       */
      systems: Collection<System>;
    }>,
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
  static fromRemoteManifest(
    manifest: string,
    options: InexactPartial<{
      /**
       *  Whether to construct the remote package strictly
       * @defaultValue `true`
       */
      strict: boolean;
    }>,
  ): Promise<ClientPackage | null>;
}

declare global {
  namespace ClientPackage {
    interface PackageCompatibilityBadge {
      type: "safe" | "unsafe" | "warning" | "neutral" | "error";
      tooltip: string;
      label?: string;
      icon?: string;
    }

    interface ModuleConstructorData
      extends foundry.data.fields.SchemaField.InnerAssignmentType<foundry.packages.BaseModule.Schema> {
      active: boolean;
    }

    interface SystemConstructorData
      extends foundry.data.fields.SchemaField.InnerAssignmentType<foundry.packages.BaseSystem.Schema> {
      strictDataCleaning?: boolean;
    }
  }

  /**
   * A client-side mixin used for all Package types.
   * @param BasePackage - The parent BasePackage class being mixed
   * @returns A BasePackage subclass mixed with ClientPackage features
   */
  function ClientPackageMixin<BaseClass extends ClientPackageMixin.BaseClass>(
    BasePackage: BaseClass,
  ): Mixin<typeof ClientPackage, BaseClass>;

  namespace ClientPackageMixin {
    type AnyMixedConstructor = ReturnType<typeof ClientPackageMixin<BaseClass>>;
    interface AnyMixed extends FixedInstanceType<AnyMixedConstructor> {}

    type BaseClass = BasePackage.Internal.Constructor;
  }

  class Module extends ClientPackageMixin(foundry.packages.BaseModule) {
    constructor(data: ClientPackage.ModuleConstructorData, options: unknown);

    /**
     * Is this package currently active?
     */
    readonly active: boolean;
  }

  class System extends ClientPackageMixin(foundry.packages.BaseSystem) {
    constructor(data: ClientPackage.SystemConstructorData, options: unknown);

    override _configure(options: unknown): void;

    /**
     * @deprecated since v12, will be removed in v14
     * @remarks `"System#template is deprecated in favor of System#documentTypes"`
     */
    get template(): Game["model"];
  }

  class World extends ClientPackageMixin(foundry.packages.BaseWorld) {
    static override getVersionBadge(
      availability: CONST.PACKAGE_AVAILABILITY_CODES,
      data: Partial<PackageManifestData>,
      options: InexactPartial<{
        /**
         * A specific collection of modules to test availability against. Tests against the currently installed modules by default.
         */
        modules: Collection<Module>;
        /**
         * A specific collection of systems to test availability against. Tests against the currently installed systems by default.
         */
        systems: Collection<System>;
      }>,
    ): ClientPackage.PackageCompatibilityBadge | null;

    /**
     * Provide data for a system badge displayed for the world which reflects the system ID and its availability
     * @param system - A specific system to use, otherwise use the installed system.
     */
    getSystemBadge(system?: System): ClientPackage.PackageCompatibilityBadge | null;

    static override _formatBadDependenciesTooltip(
      availability: CONST.PACKAGE_AVAILABILITY_CODES,
      data: Partial<PackageManifestData>,
      options: InexactPartial<{
        /**
         * A specific collection of modules to test availability against. Tests against the currently installed modules by default.
         */
        modules: Collection<Module>;
        /**
         * A specific collection of systems to test availability against. Tests against the currently installed systems by default.
         */
        systems: Collection<System>;
      }>,
    ): string;
  }
}
