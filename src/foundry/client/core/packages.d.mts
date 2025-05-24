import type { FixedInstanceType, Mixin } from "#utils";
import type { CONST } from "#client-esm/client.d.mts";
import type BasePackage from "#common/packages/base-package.d.mts";
import type AdditionalTypesField from "#common/packages/sub-types.d.mts";
import type DataModel from "#common/abstract/data.mjs";

import fields = foundry.data.fields;

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
    options: ClientPackage.GetVersionBadgeOptions,
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
    options: ClientPackage.FormatBadDependenciesTooltipOptions,
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
    options: ClientPackage.FormatIncompatibleSystemsTooltipOptions,
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
    options: ClientPackage.FromRemoteManifestOptions,
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
    interface AnyMixedConstructor extends ReturnType<typeof ClientPackageMixin<BaseClass>> {}
    interface AnyMixed extends FixedInstanceType<AnyMixedConstructor> {}

    type BaseClass = BasePackage.Internal.Constructor;
  }

  class Module extends ClientPackageMixin(foundry.packages.BaseModule) {
    constructor(data: ClientPackage.ModuleCreateData, options: unknown);

    /**
     * Is this package currently active?
     */
    readonly active: boolean;
  }

  namespace Module {
    /**
     * The data put in {@linkcode DataModel._source}. This data is what was
     * persisted to the database and therefore it must be valid JSON.
     *
     * For example a {@link fields.SetField | `SetField`} is persisted to the database as an array
     * but initialized as a {@linkcode Set}.
     */
    interface Source extends fields.SchemaField.SourceData<Schema> {}

    /**
     * @deprecated Replaced with {@linkcode Module.Source}
     */
    type PersistedData = Source;

    /**
     * The data necessary to create a data model. Used in places like {@linkcode Module.create}
     * and {@link Module | `new Module(...)`}.
     *
     * For example a {@link fields.SetField | `SetField`} can accept any {@linkcode Iterable}
     * with the right values. This means you can pass a `Set` instance, an array of values,
     * a generator, or any other iterable.
     */
    interface CreateData extends fields.SchemaField.CreateData<Schema> {}

    /**
     * The data after a {@linkcode DataModel} has been initialized, for example
     * {@link Module.name | `Module#name`}.
     *
     * This is data transformed from {@linkcode Module.Source} and turned into more
     * convenient runtime data structures. For example a {@link fields.SetField | `SetField`} is
     * persisted to the database as an array of values but at runtime it is a `Set` instance.
     */
    interface InitializedData extends fields.SchemaField.InitializedData<Schema> {}

    /**
     * The data used to update a document, for example {@link Module.update | `Module#update`}.
     * It is a distinct type from {@link Module.CreateData | `DeepPartial<Module.CreateData>`} because
     * it has different rules for `null` and `undefined`.
     */
    interface UpdateData extends fields.SchemaField.UpdateData<Schema> {}

    /**
     * The schema for {@linkcode Module}. This is the source of truth for how an Module document
     * must be structured.
     *
     * Foundry uses this schema to validate the structure of the {@linkcode Module}. For example
     * a {@link fields.StringField | `StringField`} will enforce that the value is a string. More
     * complex fields like {@link fields.SetField | `SetField`} goes through various conversions
     * starting as an array in the database, initialized as a set, and allows updates with any
     * iterable.
     */
    interface Schema extends BasePackage.Schema {
      /**
       * The current package version
       * @remarks Actually defined in BasePackage but defined here to avoid conflict with BaseWorld
       */
      version: fields.StringField<{ required: true; blank: false; initial: "0" }>;

      /**
       * Does this module provide a translation for the core software?
       */
      coreTranslation: fields.BooleanField;

      /**
       * A library module provides no user-facing functionality and is solely for use by other modules. Loaded before any system or module scripts.
       */
      library: fields.BooleanField;

      /**
       * Additional document sub-types provided by this module.
       */
      documentTypes: AdditionalTypesField;
    }
  }

  class System extends ClientPackageMixin(foundry.packages.BaseSystem) {
    constructor(data: ClientPackage.SystemCreateData, options: unknown);

    // options: not null (parameter default only, destructured in super)
    protected override _configure(options?: DataModel.ConfigureOptions): void;

    /**
     * @deprecated since v12, will be removed in v14
     * @remarks `"System#template is deprecated in favor of System#documentTypes"`
     */
    get template(): Game["model"];
  }

  namespace System {
    /**
     * The data put in {@linkcode DataModel._source}. This data is what was
     * persisted to the database and therefore it must be valid JSON.
     *
     * For example a {@link fields.SetField | `SetField`} is persisted to the database as an array
     * but initialized as a {@linkcode Set}.
     */
    interface Source extends fields.SchemaField.SourceData<Schema> {}

    /**
     * @deprecated Replaced with {@linkcode System.Source}
     */
    type PersistedData = Source;

    /**
     * The data necessary to create a data model. Used in places like {@linkcode System.create}
     * and {@link System | `new System(...)`}.
     *
     * For example a {@link fields.SetField | `SetField`} can accept any {@linkcode Iterable}
     * with the right values. This means you can pass a `Set` instance, an array of values,
     * a generator, or any other iterable.
     */
    interface CreateData extends fields.SchemaField.CreateData<Schema> {}

    /**
     * The data after a {@linkcode DataModel} has been initialized, for example
     * {@link System.name | `System#name`}.
     *
     * This is data transformed from {@linkcode System.Source} and turned into more
     * convenient runtime data structures. For example a {@link fields.SetField | `SetField`} is
     * persisted to the database as an array of values but at runtime it is a `Set` instance.
     */
    interface InitializedData extends fields.SchemaField.InitializedData<Schema> {}

    /**
     * The data used to update a document, for example {@link System.update | `System#update`}.
     * It is a distinct type from {@link System.CreateData | `DeepPartial<System.CreateData>`} because
     * it has different rules for `null` and `undefined`.
     */
    interface UpdateData extends fields.SchemaField.UpdateData<Schema> {}

    /**
     * The schema for {@linkcode System}. This is the source of truth for how an System document
     * must be structured.
     *
     * Foundry uses this schema to validate the structure of the {@linkcode System}. For example
     * a {@link fields.StringField | `StringField`} will enforce that the value is a string. More
     * complex fields like {@link fields.SetField | `SetField`} goes through various conversions
     * starting as an array in the database, initialized as a set, and allows updates with any
     * iterable.
     */
    interface Schema extends BasePackage.Schema {
      /**
       * The current package version
       * @remarks Actually defined in BasePackage but defined here to avoid conflict with BaseWorld
       */
      version: fields.StringField<{ required: true; blank: false; initial: "0" }>;

      /**
       * Additional document subtypes provided by this system.
       */
      documentTypes: AdditionalTypesField;

      /**
       * A web URL or local file path which provides a default background banner for worlds which are created using this system
       */
      background: fields.StringField<{ required: false; blank: false }>;

      /**
       * A default initiative formula used for this system
       */
      initiative: fields.StringField;

      /**
       * The default grid settings to use for Scenes in this system
       */
      grid: fields.SchemaField<{
        /** A default grid type to use for Scenes in this system */
        type: fields.NumberField<{
          required: true;
          choices: typeof foundry.CONST.GRID_TYPES;
          initial: typeof foundry.CONST.GRID_TYPES.SQUARE;
        }>;

        /** A default distance measurement to use for Scenes in this system */
        distance: fields.NumberField<{
          required: true;
          nullable: false;
          positive: true;
          initial: 1;
        }>;

        /** A default unit of measure to use for distance measurement in this system */
        units: fields.StringField<{
          required: true;
        }>;

        /** The default rule used by this system for diagonal measurement on square grids */
        diagonals: fields.NumberField<{
          required: true;
          choices: typeof foundry.CONST.GRID_DIAGONALS;
          initial: typeof foundry.CONST.GRID_DIAGONALS.EQUIDISTANT;
        }>;
      }>;

      /**
       * An Actor data attribute path to use for Token primary resource bars
       */
      primaryTokenAttribute: fields.StringField;

      /**
       * An Actor data attribute path to use for Token secondary resource bars
       */
      secondaryTokenAttribute: fields.StringField;

      /**
       * A default distance measurement to use for Scenes in this system
       * @deprecated since v12
       */
      gridDistance: fields.NumberField;

      /**
       * A default unit of measure to use for distance measurement in this system
       * @deprecated since v12
       */
      gridUnits: fields.NumberField;
    }
  }

  class World extends ClientPackageMixin(foundry.packages.BaseWorld) {
    static override getVersionBadge(
      availability: CONST.PACKAGE_AVAILABILITY_CODES,
      data: Partial<PackageManifestData>,
      options: World.GetVersionBadgeOptions,
    ): ClientPackage.PackageCompatibilityBadge | null;

    /**
     * Provide data for a system badge displayed for the world which reflects the system ID and its availability
     * @param system - A specific system to use, otherwise use the installed system.
     */
    getSystemBadge(system?: System): ClientPackage.PackageCompatibilityBadge | null;

    static override _formatBadDependenciesTooltip(
      availability: CONST.PACKAGE_AVAILABILITY_CODES,
      data: Partial<PackageManifestData>,
      options: World.FormatBadDependenciesTooltip,
    ): string;
  }

  namespace World {
    /**
     * The data put in {@linkcode DataModel._source}. This data is what was
     * persisted to the database and therefore it must be valid JSON.
     *
     * For example a {@link fields.SetField | `SetField`} is persisted to the database as an array
     * but initialized as a {@linkcode Set}.
     */
    interface Source extends fields.SchemaField.SourceData<Schema> {}

    /**
     * @deprecated Replaced with {@linkcode World.Source}
     */
    type PersistedData = Source;

    /**
     * The data necessary to create a data model. Used in places like {@linkcode World.create}
     * and {@link World | `new World(...)`}.
     *
     * For example a {@link fields.SetField | `SetField`} can accept any {@linkcode Iterable}
     * with the right values. This means you can pass a `Set` instance, an array of values,
     * a generator, or any other iterable.
     */
    interface CreateData extends fields.SchemaField.CreateData<Schema> {}

    /**
     * The data after a {@linkcode DataModel} has been initialized, for example
     * {@link World.name | `World#name`}.
     *
     * This is data transformed from {@linkcode World.Source} and turned into more
     * convenient runtime data structures. For example a {@link fields.SetField | `SetField`} is
     * persisted to the database as an array of values but at runtime it is a `Set` instance.
     */
    interface InitializedData extends fields.SchemaField.InitializedData<Schema> {}

    /**
     * The data used to update a document, for example {@link World.update | `World#update`}.
     * It is a distinct type from {@link World.CreateData | `DeepPartial<World.CreateData>`} because
     * it has different rules for `null` and `undefined`.
     */
    interface UpdateData extends fields.SchemaField.UpdateData<Schema> {}

    /**
     * The schema for {@linkcode World}. This is the source of truth for how an World document
     * must be structured.
     *
     * Foundry uses this schema to validate the structure of the {@linkcode World}. For example
     * a {@link fields.StringField | `StringField`} will enforce that the value is a string. More
     * complex fields like {@link fields.SetField | `SetField`} goes through various conversions
     * starting as an array in the database, initialized as a set, and allows updates with any
     * iterable.
     */
    interface Schema extends BasePackage.Schema {
      /**
       * The game system name which this world relies upon
       */
      system: fields.StringField<{ required: true; blank: false }>;

      /**
       * A web URL or local file path which provides a background banner image
       */
      background: fields.StringField<{ required: false; blank: false }>;

      /**
       * The theme to use for this world's join page.
       */
      joinTheme: fields.StringField<{
        required: false;
        initial: undefined;
        nullable: false;
        blank: false;
        choices: typeof foundry.CONST.WORLD_JOIN_THEMES;
      }>;

      /**
       * The version of the core software for which this world has been migrated
       */
      coreVersion: fields.StringField<{ required: true; blank: false }>;

      /**
       * The version of the game system for which this world has been migrated
       */
      systemVersion: fields.StringField<{ required: true; blank: false; initial: "0" }>;

      lastPlayed: fields.StringField;

      playtime: fields.NumberField<{ integer: true; min: 0; initial: 0 }>;

      /**
       * An ISO datetime string when the next game session is scheduled to occur
       */
      nextSession: fields.StringField<{ blank: false; nullable: true; initial: null }>;

      /**
       * Should user access keys be reset as part of the next launch?
       */
      resetKeys: fields.BooleanField<{ required: false; initial: undefined }>;

      /**
       * Should the world launch in safe mode?
       */
      safeMode: fields.BooleanField<{ required: false; initial: undefined }>;

      version: fields.StringField<{ required: true; blank: false; nullable: true; initial: null }>;
    }

    interface GetVersionBadgeOptions {
      /**
       * A specific collection of modules to test availability against. Tests against the currently installed modules by default.
       */
      modules?: Collection<Module> | undefined;

      /**
       * A specific collection of systems to test availability against. Tests against the currently installed systems by default.
       */
      systems?: Collection<System> | undefined;
    }

    interface FormatBadDependenciesTooltip {
      /**
       * A specific collection of modules to test availability against. Tests against the currently installed modules by default.
       */
      modules?: Collection<Module> | undefined;

      /**
       * A specific collection of systems to test availability against. Tests against the currently installed systems by default.
       */
      systems?: Collection<System> | undefined;
    }
  }
}
