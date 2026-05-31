import type { FixedInstanceType, InexactPartial, Mixin } from "#utils";
import type { BasePackage, RelatedPackage } from "#common/packages/_module.d.mts";
import type { Module, System } from "#client/packages/_module.d.mts";

/**
 * A client-side mixin used for all Package types.
 * @param BasePackage - The parent BasePackage class being mixed
 * @returns A BasePackage subclass mixed with ClientPackage features
 * @privateRemarks Some {@linkcode ClientPackage} methods/properties need to be overridden in subclasses for accurate types:
 * - {@linkcode ClientPackage.getVersionBadge} to narrow the 2nd parameter.
 * - {@linkcode ClientPackage._formatBadDependenciesTooltip} to narrow the 2nd parameter.
 * - {@linkcode ClientPackage._formatIncompatibleSystemsTooltip} to narrow the 2nd parameter.
 */
declare function ClientPackageMixin<BaseClass extends ClientPackageMixin.BaseClass>(
  BasePackage: BaseClass,
): Mixin<typeof ClientPackageMixin.ClientPackage, BaseClass>;

declare namespace ClientPackageMixin {
  interface AnyMixedConstructor extends ReturnType<typeof ClientPackageMixin<BasePackage.AnyConstructor>> {}
  interface AnyMixed extends FixedInstanceType<AnyMixedConstructor> {}

  // Making this `BasePackage.AnyConstructor` induces circularities, despite `AnyMixedConstructor` using that as a base.
  type BaseClass = BasePackage.Internal.Constructor;

  interface CompatibilityBadge {
    /**
     * A type in "safe", "unsafe", "warning", "neutral" applied as a CSS class
     * @remarks Despite the above list in the description, core never returns `"unsafe"` but does return `"error"`.
     */
    type: "safe" | "warning" | "neutral" | "error";

    /** A tooltip string displayed when hovering over the badge */
    tooltip: string;

    /**
     * An optional text label displayed in the badge
     * @remarks Despite being optional, this will always be provided where core returns this type.
     */
    label?: string;

    /**
     * An optional icon displayed in the badge
     * @remarks Despite being optional, this will always be provided where core returns this type.
     */
    icon?: string;
  }

  /** @deprecated Use {@linkcode Module.ManifestData} instead. This warning will be removed in v14. */
  type ModuleCreateData = Module.ManifestData;

  /** @deprecated Use {@linkcode System.ManifestData} instead. This warning will be removed in v14. */
  type SystemCreateData = System.ManifestData;

  /** @internal */
  interface _ModulesAndSystems {
    /** A specific collection of modules to test availability against. Tests against the currently installed modules by default. */
    modules: Collection<Module>;

    /** A specific collection of systems to test availability against. Tests against the currently installed systems by default. */
    systems: Collection<System>;
  }

  interface GetVersionBadgeOptions extends InexactPartial<_ModulesAndSystems> {}

  interface FormatBadDependenciesTooltipOptions extends InexactPartial<_ModulesAndSystems> {}

  interface FormatIncompatibleSystemsTooltipOptions extends InexactPartial<Pick<_ModulesAndSystems, "systems">> {}

  /** @deprecated Use {@linkcode ClientPackageMixin.CompatibilityBadge} instead. This warning will be removed in v14. */
  type PackageCompatibilityBadge = CompatibilityBadge;

  /** @deprecated Use {@linkcode BasePackage.FromRemoteManifestOptions} instead. This warning will be removed in v14. */
  type FromRemoteManifestOptions = BasePackage.FromRemoteManifestOptions;

  class ClientPackage {
    /** @privateRemarks All mixin classes should accept anything for its constructor. */
    constructor(...args: any[]);

    /**
     * Is this package marked as a favorite?
     * This boolean is currently only populated as true in the /setup view of the software.
     */
    favorite: false;

    /**
     * Associate package availability with certain badge for client-side display.
     */
    getVersionBadge(): ClientPackageMixin.CompatibilityBadge | null;

    /**
     * Retrieve a Package of this type from its collection.
     * @param id - The package ID to retrieve
     * @returns The retrieved package instance, or undefined
     */
    static get(id: string): ClientPackageMixin.AnyMixed;

    /**
     * Determine a version badge for the provided compatibility data.
     * @param availability - The availability level.
     * @param data         - The compatibility data.
     * @privateRemarks Foundry types `data` as `Partial<PackageManifestData>`, which on their side is an incomplete
     * `InitializedData<BasePackage.Schema>`, but the only client side call is in {@linkcode ClientPackageMixin.AnyMixed.getVersionBadge}
     * (the instance method), where it gets passed `this`, and server-side it's also always called with a constructed package.
     */
    static getVersionBadge(
      availability: CONST.PACKAGE_AVAILABILITY_CODES,
      data: BasePackage.ManifestData | ClientPackageMixin.AnyMixed,
      options: ClientPackageMixin.GetVersionBadgeOptions,
    ): CompatibilityBadge | null;

    /**
     * List missing dependencies and format them for display.
     * @param availability - The availability value.
     * @param data         - The compatibility data.
     * @param deps         - The dependencies to format.
     * @remarks `data` is unused in `ClientPackage`.
     */
    protected static _formatBadDependenciesTooltip(
      availability: CONST.PACKAGE_AVAILABILITY_CODES,
      data: BasePackage.ManifestData | ClientPackageMixin.AnyMixed,
      deps: Iterable<RelatedPackage.Data>,
      options?: ClientPackageMixin.FormatBadDependenciesTooltipOptions,
    ): string;

    /**
     * List missing dependencies and format them for display.
     * @param availability - The availability level.
     * @param data         - The compatibility data.
     */
    protected static _formatIncompatibleSystemsTooltip(
      data: BasePackage.ManifestData | ClientPackageMixin.AnyMixed,
      deps: Iterable<RelatedPackage.Data>,
      options?: ClientPackageMixin.FormatIncompatibleSystemsTooltipOptions,
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
     * @remarks Unconditionally returns `null` (or throws with `strict: true`) in every situation user code could call it.
     */
    static fromRemoteManifest(manifest: string, options: BasePackage.FromRemoteManifestOptions): Promise<null>;
  }
}

export default ClientPackageMixin;
