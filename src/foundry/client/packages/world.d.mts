import type { CONST } from "#client/client.d.mts";
import type BasePackage from "#common/packages/base-package.d.mts";
import type ClientPackageMixin from "./client-package.d.mts";
import type Module from "./module.d.mts";
import type System from "./system.d.mts";

import fields = foundry.data.fields;
import type { InexactPartial } from "#utils";

declare class World extends ClientPackageMixin(foundry.packages.BaseWorld) {
  static override getVersionBadge(
    availability: CONST.PACKAGE_AVAILABILITY_CODES,
    data: Partial<PackageManifestData>,
    options: World.GetVersionBadgeOptions,
  ): ClientPackageMixin.PackageCompatibilityBadge | null;

  /**
   * Provide data for a system badge displayed for the world which reflects the system ID and its availability
   * @param system - A specific system to use, otherwise use the installed system.
   */
  getSystemBadge(system?: System): ClientPackageMixin.PackageCompatibilityBadge | null;

  static override _formatBadDependenciesTooltip(
    availability: CONST.PACKAGE_AVAILABILITY_CODES,
    data: Partial<PackageManifestData>,
    options: World.FormatBadDependenciesTooltip,
  ): string;
}

declare namespace World {
  /**
   * The data put in {@linkcode DataModel._source}. This data is what was
   * persisted to the database and therefore it must be valid JSON.
   *
   * For example a {@link fields.SetField | `SetField`} is persisted to the database as an array
   * but initialized as a {@linkcode Set}.
   */
  interface Source extends fields.SchemaField.SourceData<Schema> {}

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

  interface DemoSchema extends fields.DataSchema {
    /** Path to the world's fresh data. */
    sourceZip: fields.StringField<{ required: true; blank: false; nullable: true; initial: null }>;
  }

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
