import type { InexactPartial } from "../../../types/utils.d.mts";
import type DataModel from "../abstract/data.mjs";
import type { ReleaseData } from "../config.d.mts";
import * as fields from "../data/fields.mjs";
import type { DataModelValidationFailure } from "../data/validation-failure.d.mts";
import type { BaseFolder } from "../documents/_module.d.mts";
import type { LogCompatibilityWarningOptions } from "../utils/logging.d.mts";

declare namespace BasePackage {
  type optionalString = {
    required: false;
    blank: false;
    initial: undefined;
  };

  type PackageAuthorSchema = {
    /**
     * The author name
     */
    name: fields.StringField<{ required: true; blank: false }>;

    /**
     * The author email address
     */
    email: fields.StringField<optionalString>;

    /**
     * A website url for the author
     */
    url: fields.StringField<optionalString>;

    /**
     * A Discord username for the author
     */
    discord: fields.StringField<optionalString>;

    flags: fields.ObjectField;
  };

  type PackageMediaSchema = {
    type: fields.StringField<optionalString>;

    url: fields.StringField<optionalString>;

    caption: fields.StringField<optionalString>;

    loop: fields.BooleanField<{ required: false; blank: false; initial: false }>;

    thumbnail: fields.StringField<optionalString>;

    flags: fields.ObjectField;
  };

  type OwnershipRecord = Record<
    keyof typeof foundry.CONST.USER_ROLES,
    keyof typeof foundry.CONST.DOCUMENT_OWNERSHIP_LEVELS | undefined
  >;

  type PackageCompendiumSchema = {
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

    banner: fields.StringField<optionalString>;

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
     * Denote that this compendium pack requires a specific game system to function properly
     */
    system: fields.StringField<optionalString>;

    ownership: CompendiumOwnershipField;

    flags: fields.ObjectField;
  };

  type PackageLanguageSchema = {
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
    system: fields.StringField<optionalString>;

    /**
     * Only apply this set of translations when a specific module is active
     */
    module: fields.StringField<optionalString>;

    flags: fields.ObjectField;
  };

  type PackageCompatibilitySchema = {
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
  };

  type PackageRelationshipsSchema = {
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
  };

  type RelatedPackageSchema<PackageType extends foundry.CONST.PACKAGE_TYPES = foundry.CONST.PACKAGE_TYPES> = {
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
  };

  type PackageCompendiumFolderSchemaHelper = {
    name: fields.StringField<{ required: true; blank: false }>;
    sorting: fields.StringField<{
      required: false;
      blank: false;
      initial: undefined;
      choices: typeof BaseFolder.SORTING_MODES;
    }>;
    color: fields.ColorField;
    packs: fields.SetField<fields.StringField<{ required: true; blank: false }>>;
  };

  // Foundry starts Depth at 1 and increments from there
  type FolderRecursion = [never, 2, 3];

  type PackageCompendiumFolderSchema<Depth> = Depth extends number
    ? PackageCompendiumFolderSchemaHelper & {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore The recursion works correctly due to helper array. The in-file checker doesn't pick up on this so using ts-ignore
        folders: fields.SetField<fields.SchemaField<PackageCompendiumFolderSchema<FolderRecursion[Depth]>>>;
      }
    : PackageCompendiumFolderSchemaHelper;

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
    title: fields.StringField;

    /**
     * An optional package description, may contain HTML
     */
    description: fields.StringField;

    /**
     * An array of author objects who are co-authors of this package. Preferred to the singular author field.
     */
    authors: fields.SetField<fields.SchemaField<PackageAuthorSchema>>;

    /**
     * A web url where more details about the package may be found
     */
    url: fields.StringField<optionalString>;

    /**
     * A web url or relative file path where license details may be found
     */
    license: fields.StringField<optionalString>;

    /**
     * A web url or relative file path where readme instructions may be found
     */
    readme: fields.StringField<optionalString>;

    /**
     *  A web url where bug reports may be submitted and tracked
     */
    bugs: fields.StringField<optionalString>;

    /**
     * A web url where notes detailing package updates are available
     */
    changelog: fields.StringField<optionalString>;

    flags: fields.ObjectField;

    media: fields.SetField<fields.SchemaField<PackageMediaSchema>>;

    // Moved to base-module and base-system to avoid conflict with base-world
    /**
     * The current package version
     */
    // version: fields.StringField<{ required: true; blank: false; initial: "0" }>;

    /**
     * The compatibility of this version with the core Foundry software
     */
    compatibility: PackageCompatibility;

    /**
     * An array of urls or relative file paths for JavaScript files which should be included
     */
    scripts: fields.SetField<fields.StringField<{ required: true; blank: false }>>;

    /***
     * An array of urls or relative file paths for ESModule files which should be included
     */
    esmodules: fields.SetField<fields.StringField<{ required: true; blank: false }>>;

    /**
     * An array of urls or relative file paths for CSS stylesheet files which should be included
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

    exclusive: fields.BooleanField;

    persistentStorage: fields.BooleanField;
  }

  type PackageManifestData = {
    availability: foundry.CONST.PACKAGE_AVAILABILITY_CODES;
    locked: boolean;
    exclusive: boolean;
    owned: boolean;
    tags: string[];
    hasStorage: boolean;
  };
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

  protected override _validateType(
    value: Record<keyof typeof foundry.CONST.USER_ROLES, keyof typeof foundry.CONST.DOCUMENT_OWNERSHIP_LEVELS>,
    options?: any,
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

  override initialize(
    value: fields.ArrayField.PersistedElementType<ElementFieldType>[],
    model: BasePackage,
  ):
    | Set<fields.ArrayField.InitializedElementType<ElementFieldType>>
    | (() => Set<fields.ArrayField.InitializedElementType<ElementFieldType>> | null);

  protected override _validateElements(
    value: any[],
    options?: fields.DataField.ValidationOptions<fields.DataField.Any>,
  ): void | DataModelValidationFailure;

  protected override _validateElement(
    value: any,
    options: fields.DataField.ValidationOptions<fields.DataField.Any>,
  ): void | DataModelValidationFailure;
}

/**
 * The data schema used to define a Package manifest.
 * Specific types of packages extend this schema with additional fields.
 */
declare class BasePackage<
  // BaseWorld alters the definition of `version`
  PackageSchema extends Omit<BasePackage.Schema, "version"> = BasePackage.Schema,
> extends DataModel<PackageSchema, null> {
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
   * @virtual
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
  get name(): this["id"];

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
    data: Partial<BasePackage.PackageManifestData>,
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
  _testRequiredDependencies(modulesCollection: Collection<Module>): Promise<boolean>;

  /**
   * Test compatibility of a package's supported systems.
   * @param systemCollection - A collection which defines the set of available systems.
   * @returns True if all supported systems which are currently installed
   *          are compatible or if the package has no supported systems.
   *          Returns false otherwise, or if no supported systems are installed.
   */
  _testSupportedSystems(systemCollection: Collection<System>): Promise<boolean>;

  /**
   * Determine if a dependency is within the given compatibility range.
   * @param compatibility - The compatibility range declared for the dependency, if any
   * @param dependency    - The known dependency package
   * @returns Is the dependency compatible with the required range?
   */
  static testDependencyCompatibility(compatibility: PackageCompatibility, dependency: BasePackage): boolean;

  static cleanData(source?: object, options?: fields.DataField.CleanOptions): object;

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
  protected static _logWarning(
    packageId: string,
    message: string,
    options?: InexactPartial<
      {
        /** Is the package installed? */
        installed: unknown;
      } & LogCompatibilityWarningOptions
    >,
  ): void;

  static migrateData(
    data: object,
    logOptions?: InexactPartial<{
      installed: boolean;
    }>,
  ): object;

  protected static _migrateNameToId(data: object, logOptions: Parameters<typeof BasePackage._logWarning>[2]): void;

  protected static _migrateDependenciesNameToId(
    data: object,
    logOptions: Parameters<typeof BasePackage._logWarning>[2],
  ): void;

  protected static _migrateToRelationships(
    data: object,
    logOptions: Parameters<typeof BasePackage._logWarning>[2],
  ): void;

  protected static _migrateCompatibility(data: object, logOptions: Parameters<typeof BasePackage._logWarning>[2]): void;

  protected static _migrateMediaURL(data: object, logOptions: Parameters<typeof BasePackage._logWarning>[2]): void;

  protected static _migrateOwnership(data: object, logOptions: Parameters<typeof BasePackage._logWarning>[2]): void;

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

export default BasePackage;
