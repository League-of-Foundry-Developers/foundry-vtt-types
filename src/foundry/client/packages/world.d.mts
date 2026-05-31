import type { InexactPartial } from "#utils";
import type { BasePackage, BaseWorld, RelatedPackage } from "#common/packages/_module.d.mts";
import type { ClientPackageMixin, System } from "#client/packages/_module.d.mts";
import type { fields } from "#client/data/_module.d.mts";

declare class World extends ClientPackageMixin(BaseWorld) {
  static override getVersionBadge(
    availability: CONST.PACKAGE_AVAILABILITY_CODES,
    data: World.ManifestData | World,
    options: ClientPackageMixin.GetVersionBadgeOptions,
  ): ClientPackageMixin.CompatibilityBadge | null;

  /**
   * Provide data for a system badge displayed for the world which reflects the system ID and its availability
   * @param system - A specific system to use, otherwise use the installed system.
   */
  getSystemBadge(system?: System): ClientPackageMixin.CompatibilityBadge | null;

  // drops `options` from super
  protected static override _formatBadDependenciesTooltip(
    availability: CONST.PACKAGE_AVAILABILITY_CODES,
    data: World.ManifestData | World,
    deps: Iterable<RelatedPackage.Data>,
  ): string;

  // fake type override
  protected static override _formatIncompatibleSystemsTooltip(
    data: World.ManifestData | World,
    deps: Iterable<RelatedPackage.Data>,
    options?: ClientPackageMixin.FormatIncompatibleSystemsTooltipOptions,
  ): string;
}

declare namespace World {
  /**
   * The data put in {@linkcode DataModel._source}. This data is what was
   * persisted to the database and therefore it must be valid JSON.
   *
   * For example a {@linkcode fields.SetField | SetField} is persisted to the database as an array
   * but initialized as a {@linkcode Set}.
   */
  interface Source extends fields.SchemaField.SourceData<Schema> {}

  /**
   * The data necessary to create a data model. Used in places like {@linkcode World.create}
   * and {@linkcode World | new World(...)}.
   *
   * For example a {@linkcode fields.SetField | SetField} can accept any {@linkcode Iterable}
   * with the right values. This means you can pass a `Set` instance, an array of values,
   * a generator, or any other iterable.
   */
  interface CreateData extends fields.SchemaField.CreateData<Schema> {}

  /**
   * The data after a {@linkcode DataModel} has been initialized, for example
   * {@linkcode World.name | World#name}.
   *
   * This is data transformed from {@linkcode World.Source} and turned into more
   * convenient runtime data structures. For example a {@linkcode fields.SetField | SetField} is
   * persisted to the database as an array of values but at runtime it is a `Set` instance.
   */
  interface InitializedData extends fields.SchemaField.InitializedData<Schema> {}

  /**
   * The data used to update a document, for example {@linkcode World.update | World#update}.
   * It is a distinct type from {@linkcode World.CreateData | DeepPartial<World.CreateData>} because
   * it has different rules for `null` and `undefined`.
   */
  interface UpdateData extends fields.SchemaField.UpdateData<Schema> {}

  interface DemoSchema extends fields.DataSchema {
    /** Path to the world's fresh data. */
    sourceZip: fields.StringField<{ required: true; blank: false; nullable: true; initial: null }>;
  }

  /**
   * The schema for {@linkcode World}. This is the source of truth for how an World document
   * must be structured.
   *
   * Foundry uses this schema to validate the structure of the {@linkcode World}. For example
   * a {@linkcode fields.StringField | StringField} will enforce that the value is a string. More
   * complex fields like {@linkcode fields.SetField | SetField} goes through various conversions
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
    background: fields.FilePathField<{ categories: ["IMAGE"]; required: false }>;

    description: fields.HTMLField<{ required: true }>;

    /**
     * The theme to use for this world's join page.
     */
    joinTheme: fields.StringField<{
      required: false;
      initial: undefined;
      nullable: false;
      choices: (keyof typeof CONST.WORLD_JOIN_THEMES)[];
    }>;

    /**
     * The version of the core software for which this world has been migrated
     */
    coreVersion: fields.StringField<{ required: true; blank: false; validate: typeof BasePackage.validateVersion }>;

    /**
     * The version of the game system for which this world has been migrated
     */
    systemVersion: fields.StringField<{
      required: true;
      blank: false;
      initial: "0";
      validate: typeof BasePackage.validateVersion;
    }>;

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

    /**
     * The current package version. It is recommended to stick to dot-separated numbers like "5.0.3" and to not include a leading "v" to
     * avoid string comparison. See {@linkcode foundry.utils.isNewerVersion}.
     */
    version: fields.StringField<{
      required: true;
      blank: false;
      nullable: true;
      initial: null;
      validate: typeof BasePackage.validateVersion;
    }>;

    /**
     * Configuration for demo worlds.
     */
    demo: fields.SchemaField<DemoSchema>;
  }

  /** @deprecated Use {@linkcode ClientPackageMixin.GetVersionBadgeOptions} instead. This warning will be removed in v14. */
  type GetVersionBadgeOptions = ClientPackageMixin.GetVersionBadgeOptions;

  /** @deprecated Use {@linkcode ClientPackageMixin.FormatBadDependenciesTooltipOptions} instead. This warning will be removed in v14. */
  type FormatBadDependenciesTooltip = ClientPackageMixin.FormatBadDependenciesTooltipOptions;

  /** @internal */
  interface _TestAvailabilityOptions {
    /**
     * A specific collection of modules to test availability
     * against. Tests against the currently installed modules by
     * default.
     */
    modules: Collection<foundry.packages.Module>;

    /**
     * A specific collection of modules to test availability
     * against. Tests against the currently installed modules by
     * default.
     */
    systems: Collection<foundry.packages.System>;

    /**
     * Ignore the world's own core software compatibility and
     * instead defer entirely to the system's core software
     * compatibility, if the world's availability is less than
     * this.
     */
    systemAvailabilityThreshold: CONST.PACKAGE_AVAILABILITY_CODES;
  }

  interface TestAvailabilityOptions
    extends InexactPartial<_TestAvailabilityOptions>, BasePackage.TestAvailabilityOptions {}

  interface ManifestData extends BasePackage.ManifestData<Schema> {}
}

export default World;
