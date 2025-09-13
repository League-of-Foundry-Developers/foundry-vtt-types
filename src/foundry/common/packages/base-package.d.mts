import type { GetKey, AnyObject, InexactPartial, AnyMutableObject, Identity, AnyArray, NullishProps } from "#utils";
import type DataModel from "../abstract/data.d.mts";
import type { ReleaseData } from "../config.d.mts";
import type * as fields from "../data/fields.d.mts";
import type { DataModelValidationFailure } from "../data/validation-failure.d.mts";
import type { BaseFolder } from "../documents/_module.d.mts";
import type { LogCompatibilityWarningOptions } from "../utils/logging.d.mts";

type DataSchema = foundry.data.fields.DataSchema;

declare const __BasePackageBrand: unique symbol;

declare const __PackageSchema: unique symbol;

declare namespace BasePackage {
  interface Any extends AnyBasePackage {}
  interface AnyConstructor extends Identity<typeof AnyBasePackage> {}

  // Documented at https://gist.github.com/LukeAbby/c7420b053d881db4a4d4496b95995c98
  namespace Internal {
    type Constructor = (abstract new (...args: never) => Instance.Any) & {
      [__BasePackageBrand]: never;
    };

    interface Instance<PackageSchema extends BasePackage.Internal.Schema> {
      [__PackageSchema]: PackageSchema;
    }

    namespace Instance {
      interface Any extends Instance<BasePackage.Internal.Schema> {}
    }

    interface Schema extends Omit<BasePackage.Schema, "version"> {}
  }

  interface OptionalString {
    required: false;
    blank: false;
    initial: undefined;
  }

  interface PackageAuthorSchema extends DataSchema {
    /**
     * The author name
     */
    name: fields.StringField<{ required: true; blank: false }>;

    /**
     * The author email address
     */
    email: fields.StringField<OptionalString>;

    /**
     * A website url for the author
     */
    url: fields.StringField<OptionalString>;

    /**
     * A Discord username for the author
     */
    discord: fields.StringField<OptionalString>;

    flags: fields.ObjectField;
  }

  interface PackageMediaSchema extends DataSchema {
    /** Usage type for the media asset. "setup" means it will be used on the setup screen. */
    type: fields.StringField<OptionalString>;

    /** A web url link to the media element. */
    url: fields.StringField<OptionalString>;

    /** A caption for the media element. */
    caption: fields.StringField<OptionalString>;

    /** Should the media play on loop? */
    loop: fields.BooleanField<{ required: false; blank: false; initial: false }>;

    /** A link to the thumbnail for the media element. */
    thumbnail: fields.StringField<OptionalString>;

    /** An object of optional key/value flags. */
    flags: fields.ObjectField;
  }

  type OwnershipRecord = InexactPartial<
    Record<keyof typeof CONST.USER_ROLES, keyof typeof CONST.DOCUMENT_OWNERSHIP_LEVELS>
  >;

  interface PackageCompendiumSchema extends DataSchema {
    /**
     * The canonical compendium name. This should contain no spaces or special characters
     */
    name: fields.StringField<{
      required: true;
      blank: false;
      validate: (n: string) => boolean;
      validationError: "may not contain periods";
    }>;

    /**
     * The human-readable compendium name
     */
    label: fields.StringField<{ required: true; blank: false }>;

    /**
     * A file path to a banner image that will be used in the Compendium sidebar. This should
     * be hosted within your package, e.g. `modules/my-module/assets/banners/bestiary.webp`.
     * The dimensions are 290 x 70; you can either have each be an individual landscape or
     * slice them up to form a composite with your other compendiums, but keep in mind that
     * users can reorder compendium packs as well as filter them to break up the composite.
     */
    banner: fields.StringField<OptionalString>;

    /**
     * The local relative path to the compendium source directory. The filename should match the name attribute
     */
    path: fields.StringField<{ required: false }>;

    /**
     * The specific document type that is contained within this compendium pack
     */
    type: fields.StringField<{
      required: true;
      blank: false;
      choices: foundry.CONST.COMPENDIUM_DOCUMENT_TYPES[];
      validationError: "must be a value in CONST.COMPENDIUM_DOCUMENT_TYPES";
    }>;

    /**
     * Denote that this compendium pack requires a specific game system to function properly.
     * Required for "Actor" and "Item" packs, but even others should keep in mind that system
     * specific features and subtypes (e.g. JournalEntryPage) may present limitations.
     */
    system: fields.StringField<OptionalString>;

    ownership: CompendiumOwnershipField;

    flags: fields.ObjectField;
  }

  interface PackageLanguageSchema extends DataSchema {
    /**
     * A string language code which is validated by Intl.getCanonicalLocales
     */
    lang: fields.StringField<{
      required: true;
      blank: false;
      // Foundry is using the truthiness of this function
      // validate: typeof Intl.getCanonicalLocales;
      validationError: "must be supported by the Intl.getCanonicalLocales function";
    }>;

    /**
     * The human-readable language name
     */
    name: fields.StringField<{ required: false }>;

    /**
     * The relative path to included JSON translation strings
     */
    path: fields.StringField<{ required: true; blank: false }>;

    /**
     * Only apply this set of translations when a specific system is being used
     */
    system: fields.StringField<OptionalString>;

    /**
     * Only apply this set of translations when a specific module is active
     */
    module: fields.StringField<OptionalString>;

    flags: fields.ObjectField;
  }

  interface PackageCompatibilitySchema extends DataSchema {
    /**
     * The Package will not function before this version
     */
    minimum: fields.StringField<{ required: false; blank: false; initial: undefined }>;

    /**
     * Verified compatible up to this version
     */
    verified: fields.StringField<{ required: false; blank: false; initial: undefined }>;

    /**
     * The Package will not function after this version
     */
    maximum: fields.StringField<{ required: false; blank: false; initial: undefined }>;
  }

  interface PackageRelationshipsSchema extends DataSchema {
    /**
     * Systems that this Package supports
     */
    systems: fields.SetField<RelatedPackage<"system">>;

    /**
     * Packages that are required for base functionality
     */
    requires: fields.SetField<RelatedPackage>;

    /**
     * Packages that are recommended for optimal functionality
     */
    recommends: fields.SetField<RelatedPackage>;

    conflicts: fields.SetField<RelatedPackage>;

    flags: fields.ObjectField;
  }

  interface RelatedPackageSchema<PackageType extends foundry.CONST.PACKAGE_TYPES = foundry.CONST.PACKAGE_TYPES>
    extends DataSchema {
    /**
     * The id of the related package
     */
    id: fields.StringField<{ required: true; blank: false }>;

    /**
     * The type of the related package
     */
    type: fields.StringField<{ choices: PackageType[]; initial: "module" }>;

    /**
     * An explicit manifest URL, otherwise learned from the Foundry web server
     */
    manifest: fields.StringField<{ required: false; blank: false; initial: undefined }>;

    /**
     * The compatibility data with this related Package
     */
    compatibility: PackageCompatibility;

    /**
     * The reason for this relationship
     */
    reason: fields.StringField<{ required: false; blank: false; initial: undefined }>;
  }

  /** @internal */
  interface _PackageCompendiumFolderSchema extends DataSchema {
    /** Name for the folder. Multiple packages with identical folder names will merge by name. */
    name: fields.StringField<{ required: true; blank: false }>;

    /** Alphabetical or manual sorting. */
    sorting: fields.StringField<{
      required: false;
      blank: false;
      initial: undefined;
      choices: typeof BaseFolder.SORTING_MODES;
    }>;

    /** A hex string for the pack's color. */
    color: fields.ColorField;

    /** A list of the pack names to include in this folder. */
    packs: fields.SetField<fields.StringField<{ required: true; blank: false }>>;
  }

  // Foundry starts Depth at 1 and increments from there
  type FolderRecursion = [never, 2, 3];

  type PackageCompendiumFolderSchema<Depth> = Depth extends number
    ? _PackageCompendiumFolderSchema & {
        /** Nested folder data, up to three levels. */
        folders: fields.SetField<fields.SchemaField<PackageCompendiumFolderSchema<FolderRecursion[Depth]>>>;
      }
    : _PackageCompendiumFolderSchema;

  interface CreateData extends fields.SchemaField.CreateData<Schema> {}

  interface Schema extends DataSchema {
    /**
     * The machine-readable unique package id, should be lower-case with no spaces or special characters
     */
    id: fields.StringField<{
      required: true;
      blank: false;
      validate: typeof BasePackage.validateId;
    }>;

    /**
     * The human-readable package title, containing spaces and special characters
     */
    title: fields.StringField<{ required: true; blank: false }>;

    /**
     * An optional package description, may contain HTML
     */
    description: fields.StringField<{ required: true }>;

    /**
     * An array of author objects who are co-authors of this package. Preferred to the singular author field.
     */
    authors: fields.SetField<fields.SchemaField<PackageAuthorSchema>>;

    /**
     * A web url where more details about the package may be found
     */
    url: fields.StringField<OptionalString>;

    /**
     * A web url or relative file path where license details may be found
     */
    license: fields.StringField<OptionalString>;

    /**
     * A web url or relative file path where readme instructions may be found
     */
    readme: fields.StringField<OptionalString>;

    /**
     * A web url where bug reports may be submitted and tracked
     */
    bugs: fields.StringField<OptionalString>;

    /**
     * A web url where notes detailing package updates are available
     */
    changelog: fields.StringField<OptionalString>;

    /**
     * An object of optional key/value flags. Packages can use this namespace for their own purposes,
     * preferably within a namespace matching their package ID.
     */
    flags: fields.ObjectField;

    /** An array of objects containing media info about the package. */
    media: fields.SetField<fields.SchemaField<PackageMediaSchema>>;

    // Moved to base-module and base-system to avoid conflict with base-world

    // version: fields.StringField<{ required: true; blank: false; initial: "0" }>;

    /**
     * The compatibility of this version with the core Foundry software. See https://foundryvtt.com/article/versioning/
     * for more info on how the core software structures its releases.
     */
    compatibility: PackageCompatibility;

    /**
     * An array of urls or relative file paths for JavaScript files to include
     */
    scripts: fields.SetField<fields.StringField<{ required: true; blank: false }>>;

    /**
     * An array of urls or relative file paths for ESModule files to include
     */
    esmodules: fields.SetField<fields.StringField<{ required: true; blank: false }>>;

    /**
     * An array of urls or relative file paths for CSS stylesheet files to include
     */
    styles: fields.SetField<fields.StringField<{ required: true; blank: false }>>;

    /**
     * An array of language data objects which are included by this package
     */
    languages: fields.SetField<fields.SchemaField<PackageLanguageSchema>>;

    /**
     * An array of compendium packs which are included by this package
     */
    packs: PackageCompendiumPacks<fields.SchemaField<PackageCompendiumSchema>>;

    /**
     * An array of pack folders that will be initialized once per world.
     */
    packFolders: fields.SetField<fields.SchemaField<PackageCompendiumFolderSchema<1>>>;

    /**
     * An organized object of relationships to other Packages
     */
    relationships: PackageRelationships;

    /**
     * Whether to require a package-specific socket namespace for this package
     */
    socket: fields.BooleanField;

    /**
     * A publicly accessible web URL which provides the latest available package manifest file. Required in order to support module updates.
     */
    manifest: fields.StringField;

    /**
     * A publicly accessible web URL where the source files for this package may be downloaded. Required in order to support module installation.
     */
    download: fields.StringField<{ required: false; blank: false; initial: undefined }>;

    /**
     * Whether this package uses the protected content access system.
     */
    protected: fields.BooleanField;

    /**
     * Whether this package is a free Exclusive pack.
     */
    exclusive: fields.BooleanField;

    /**
     * Whether updates should leave the contents of the package's /storage folder.
     */
    persistentStorage: fields.BooleanField;
  }

  /**
   * @remarks Package flags do not operate under the same rules as Document flags
   * 1. They are constructed directly from the provided manifest.json files
   * 2. There are no helper getFlag/setFlag functions
   * 3. There is no enforced namespacing
   * 4. There are *many* layers that accept flags, rather than just the top level
   */
  namespace Flags {
    /**
     * Flags used by the core software.
     * @remarks Flags for the top level of the schema. Notably *not* namespaced as "core..."
     */
    interface Core {
      /** Can you upload to this package's folder using the built-in FilePicker. */
      canUpload?: boolean | undefined;

      /** Configuration information for hot reload logic */
      hotReload?: HotReloadConfig | undefined;

      /**
       * Mapping information for CompendiumArt.
       * Each key is a unique system ID, e.g. "dnd5e" or "pf2e".
       */
      compendiumArtMappings?: Record<string, CompendiumArtFlag> | undefined;

      /** A mapping of token subject paths to configured subject images. */
      tokenRingSubjectMappings?: Record<string, string> | undefined;
    }

    interface HotReloadConfig {
      /** A list of file extensions, e.g. `["css", "hbs", "json"]` */
      extensions?: string[] | undefined;

      /** File paths to watch, e.g. `["src/styles", "templates", "lang"]` */
      paths?: string[] | undefined;
    }

    interface CompendiumArtFlag {
      /** The path to the art mapping file. */
      mapping: string;

      /** An optional credit string for use by the game system to apply in an appropriate place. */
      credit?: string | undefined;
    }
  }

  interface PackageManifestData {
    availability: foundry.CONST.PACKAGE_AVAILABILITY_CODES;
    locked: boolean;
    exclusive: boolean;
    owned: boolean;
    tags: string[];
    hasStorage: boolean;
  }

  /** @internal */
  type _Installed = NullishProps<{
    /** Is the package installed? */
    installed: boolean;
  }>;

  interface LogOptions extends _Installed, InexactPartial<LogCompatibilityWarningOptions> {}

  interface MigrateDataOptions extends _Installed {}

  interface CleanDataOptions extends fields.DataField.CleanOptions {
    /**
     * Is the package installed?
     * @remarks Only used to pass on to {@link BasePackage._logWarning | `BasePackage#_logWarning`}
     */
    installed?: boolean | null | undefined;
  }
}

/**
 * A custom SchemaField for defining package compatibility versions.
 */
export class PackageCompatibility extends fields.SchemaField<BasePackage.PackageCompatibilitySchema> {
  constructor(options: fields.SchemaField.Options<BasePackage.PackageCompatibilitySchema>);
}

/**
 * A custom SchemaField for defining package relationships.
 */
export class PackageRelationships extends fields.SchemaField<BasePackage.PackageRelationshipsSchema> {
  constructor(options: fields.SchemaField.Options<BasePackage.PackageRelationshipsSchema>);
}

// omitted private class PackageRelationshipField

/**
 * A custom SchemaField for defining a related Package.
 * It may be required to be a specific type of package, by passing the packageType option to the constructor.
 */
export class RelatedPackage<
  PackageType extends foundry.CONST.PACKAGE_TYPES = foundry.CONST.PACKAGE_TYPES,
> extends fields.SchemaField<BasePackage.RelatedPackageSchema<PackageType>> {
  constructor({
    packageType,
    ...options
  }: InexactPartial<{
    /** @defaultValue `"module"` */
    packageType: PackageType;
    options: fields.SchemaField.Options<BasePackage.RelatedPackageSchema<PackageType>>;
  }>);
}

/**
 * A custom SchemaField for defining the folder structure of the included compendium packs.
 */
export class PackageCompendiumFolder<Depth extends number> extends fields.SchemaField<
  BasePackage.PackageCompendiumFolderSchema<Depth>
> {
  constructor({
    depth,
    ...options
  }: InexactPartial<{
    /** @defaultValue `1` */
    depth: Depth;
    options: fields.SchemaField.Options<BasePackage.PackageCompendiumFolderSchema<Depth>>;
  }>);
}

/**
 * A special ObjectField which captures a mapping of USER_ROLES to DOCUMENT_OWNERSHIP_LEVELS.
 */
export class CompendiumOwnershipField extends fields.ObjectField<
  fields.ObjectField.DefaultOptions,
  BasePackage.OwnershipRecord,
  BasePackage.OwnershipRecord,
  BasePackage.OwnershipRecord
> {
  static override get _defaults(): {
    /** @defaultValue `{PLAYER: "OBSERVER", ASSISTANT: "OWNER"}` */
    initial: BasePackage.OwnershipRecord;

    /**
     * @defaultValue `"is not a mapping of USER_ROLES to DOCUMENT_OWNERSHIP_LEVELS"`
     */
    validationError: string;
  };

  /** @remarks `options` is unused in `CompendiumOwnershipField` */
  protected override _validateType(
    value: Record<keyof typeof foundry.CONST.USER_ROLES, keyof typeof foundry.CONST.DOCUMENT_OWNERSHIP_LEVELS>,
    options?: fields.DataField.ValidateOptions<this> | null,
  ): boolean | void;
}

/**
 * A special SetField which provides additional validation and initialization behavior specific to compendium packs.
 */
export class PackageCompendiumPacks<
  ElementFieldType extends fields.DataField.Any,
> extends fields.SetField<ElementFieldType> {
  protected override _cleanType(
    value: Set<fields.ArrayField.InitializedElementType<ElementFieldType>>,
    options?: fields.DataField.CleanOptions,
  ): Set<fields.ArrayField.InitializedElementType<ElementFieldType>>;

  // options: not null (parameter default only)
  override initialize(
    value: fields.ArrayField.PersistedElementType<ElementFieldType>[],
    // In Foundry itself, this field is only used in `BasePackage`, however it should be able to accept any model.
    // NOTE(LukeAbby): This also has been seen in a circularity `Type of property 'packs' circularly references itself in mapped type ...`.
    model: DataModel.Any,
    options?: fields.DataField.InitializeOptions,
  ):
    | Set<fields.ArrayField.InitializedElementType<ElementFieldType>>
    | (() => Set<fields.ArrayField.InitializedElementType<ElementFieldType>> | null);

  protected override _validateElements(
    value: AnyArray,
    options?: fields.DataField.ValidateOptions<fields.DataField.Any>,
  ): void | DataModelValidationFailure;

  protected override _validateElement(
    value: unknown,
    options: fields.DataField.ValidateOptions<fields.DataField.Any>,
  ): void | DataModelValidationFailure;
}

/**
 * The data schema used to define a Package manifest.
 * Specific types of packages extend this schema with additional fields.
 */
declare class BasePackage<
  // BaseWorld alters the definition of `version`
  PackageSchema extends BasePackage.Internal.Schema = BasePackage.Schema,
> extends DataModel<PackageSchema, null> {
  static [__BasePackageBrand]: never;

  [__PackageSchema]: PackageSchema;

  /**
   * An availability code in PACKAGE_AVAILABILITY_CODES which defines whether this package can be used.
   */
  availability: foundry.CONST.PACKAGE_AVAILABILITY_CODES;

  /**
   * A flag which tracks whether this package is currently locked.
   * @defaultValue `false`
   */
  locked: boolean;

  /**
   * A flag which tracks whether this package is a free Exclusive pack
   * @defaultValue `false`
   */
  exclusive: boolean;

  /**
   * A flag which tracks whether this package is owned, if it is protected.
   * @defaultValue `false`
   */
  owned: boolean;

  /**
   * A set of Tags that indicate what kind of Package this is, provided by the Website
   * @defaultValue `[]`
   */
  tags: string[];

  /**
   * Define the package type in CONST.PACKAGE_TYPES that this class represents.
   * Each BasePackage subclass must define this attribute.
   * @abstract
   */
  static type: foundry.CONST.PACKAGE_TYPES;

  /**
   * The type of this package instance. A value in CONST.PACKAGE_TYPES.
   */
  get type(): foundry.CONST.PACKAGE_TYPES;

  /**
   * The canonical identifier for this package
   * @deprecated since v10, will be removed in v13
   * @remarks `"You are accessing BasePackage#name which is now deprecated in favor of id."`
   */
  get name(): GetKey<this, "id">;

  /**
   * A flag which defines whether this package is unavailable to be used.
   */
  get unavailable(): boolean;

  /**
   * Test if a given availability is incompatible with the core version.
   * @param availability - The availability value to test.
   */
  static isIncompatibleWithCoreVersion(availability: foundry.CONST.PACKAGE_AVAILABILITY_CODES): boolean;

  /**
   * The named collection to which this package type belongs
   */
  static get collection(): "worlds" | "systems" | "modules";

  static defineSchema(): BasePackage.Schema;

  static testAvailability(
    data: InexactPartial<BasePackage.PackageManifestData>,
    options: InexactPartial<{
      /**
       * A specific software release for which to test availability.
       * Tests against the current release by default.
       */
      release: ReleaseData;
    }>,
  ): foundry.CONST.PACKAGE_AVAILABILITY_CODES;

  /**
   * Test that the dependencies of a package are satisfied as compatible.
   * This method assumes that all packages in modulesCollection have already had their own availability tested.
   * @param modulesCollection - A collection which defines the set of available modules
   * @returns Are all required dependencies satisfied?
   */
  _testRequiredDependencies(modulesCollection: Collection<foundry.packages.Module>): Promise<boolean>;

  /**
   * Test compatibility of a package's supported systems.
   * @param systemCollection - A collection which defines the set of available systems.
   * @returns True if all supported systems which are currently installed
   *          are compatible or if the package has no supported systems.
   *          Returns false otherwise, or if no supported systems are installed.
   */
  _testSupportedSystems(systemCollection: Collection<foundry.packages.System>): Promise<boolean>;

  /**
   * Determine if a dependency is within the given compatibility range.
   * @param compatibility - The compatibility range declared for the dependency, if any
   * @param dependency    - The known dependency package
   * @returns Is the dependency compatible with the required range?
   */
  static testDependencyCompatibility(compatibility: PackageCompatibility, dependency: BasePackage): boolean;

  static cleanData(source?: AnyObject, options?: BasePackage.CleanDataOptions): AnyMutableObject;

  /**
   * Validate that a Package ID is allowed.
   * @param id - The candidate ID
   * @throws An error if the candidate ID is invalid
   */
  static validateId(id: string): void;

  /**
   *  A wrapper around the default compatibility warning logger which handles some package-specific interactions.
   * @param packageId - The package ID being logged
   * @param message   - The warning or error being logged
   * @param options   - Logging options passed to foundry.utils.logCompatibilityWarning
   */
  protected static _logWarning(packageId: string, message: string, options?: BasePackage.LogOptions): void;

  /**
   * A set of package manifest keys that are migrated.
   */
  static migratedKeys: Set<string>;

  /**
   * @remarks
   * Migrations:
   * - `name` to `id`, both at root and for any `dependencies` (since v10 until v13)
   * - `dependencies` to `relationships` (structural change) (since v10 until v13)
   * - `minimumCoreVersion` and `compatibleCoreVersion` to `compatibility.minimum` and `.verified`, respectively (since v10 until v13)
   * - Inside `media` entries, `link` to `url` (since v11 until v13)
   * - Inside `packs` entries:
   *   - `private` to an `ownership` object with `{PLAYER: "LIMITED", ASSISTANT: "OWNER"}` (since v11 until v13)
   *   - Slugifies the `name` if not already a valid slug (since v12, until v14)
   *   - `entity` to `type` (since v9, no specified end)
   */
  static override migrateData(data: AnyMutableObject, options?: BasePackage.MigrateDataOptions): AnyMutableObject;

  protected static _migrateNameToId(data: AnyObject, logOptions: BasePackage.LogOptions): void;

  protected static _migrateDependenciesNameToId(data: AnyObject, logOptions: BasePackage.LogOptions): void;

  protected static _migrateToRelationships(data: AnyObject, logOptions: BasePackage.LogOptions): void;

  protected static _migrateCompatibility(data: AnyObject, logOptions: BasePackage.LogOptions): void;

  protected static _migrateMediaURL(data: AnyObject, logOptions: BasePackage.LogOptions): void;

  protected static _migrateOwnership(data: AnyObject, logOptions: BasePackage.LogOptions): void;

  protected static _migratePackIDs(data: AnyObject, logOptions: Parameters<typeof BasePackage._logWarning>[2]): void;

  protected static _migratePackEntityToType(
    data: AnyObject,
    logOptions: Parameters<typeof BasePackage._logWarning>[2],
  ): void;

  /**
   * Retrieve the latest Package manifest from a provided remote location.
   * @param manifestUrl - A remote manifest URL to load
   * @param options     - Additional options which affect package construction
   * @returns A Promise which resolves to a constructed ServerPackage instance
   * @throws An error if the retrieved manifest data is invalid
   */
  static fromRemoteManifest(
    manifestUrl: string,
    options: {
      /**
       * Whether to construct the remote package strictly
       * @defaultValue `true`
       */
      strict: boolean;
    },
  ): Promise<never>;
}

declare abstract class AnyBasePackage extends foundry.packages.BasePackage<any> {
  constructor(...args: never);
}

export default BasePackage;
