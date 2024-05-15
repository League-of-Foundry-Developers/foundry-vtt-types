import type { InexactPartial } from "../../../types/utils.d.mts";
import type DataModel from "../abstract/data.mjs";
import type { ReleaseData } from "../config.mjs/releaseData.d.mts";
import * as fields from "../data/fields.mjs";
import type { CONST } from "../module.d.mts";
import type { LogCompatibilityWarningOptions } from "../utils/logging.d.mts";

declare namespace BasePackage {
  type optionalString = fields.StringField<{
    required: false;
    blank: false;
    initial: undefined;
  }>;

  type PackageAuthorSchema = {
    name: fields.StringField;
    email: optionalString;
    url: optionalString;
    discord: optionalString;
    flags: fields.ObjectField;
  };

  type PackageMediaSchema = {
    type: optionalString;
    url: optionalString;
    caption: optionalString;
    loop: fields.BooleanField;
    thumbnail: optionalString;
    flags: fields.ObjectField;
  };

  type OwnershipRecord = Record<
    keyof typeof foundry.CONST.USER_ROLES,
    keyof typeof foundry.CONST.DOCUMENT_OWNERSHIP_LEVELS | undefined
  >;

  type PackageCompendiumSchema = {
    name: fields.StringField;
    label: fields.StringField;
    banner: optionalString;
    path: fields.StringField;
    type: fields.StringField;
    system: fields.StringField;
    ownership: CompendiumOwnershipField;
    flags: fields.ObjectField;
  };

  type PackageLanguageSchema = {
    lang: fields.StringField;
    name: fields.StringField;
    path: fields.StringField;
    system: optionalString;
    module: optionalString;
    flags: fields.ObjectField;
  };

  type PackageCompatibilitySchema = {
    minimum: fields.StringField;
    verified: fields.StringField;
    maximum: fields.StringField;
  };

  type PackageRelationshipsSchema = {
    systems: fields.SetField;
    requires: fields.SetField;
    recommends: fields.SetField;
    conflicts: fields.SetField;
    flags: fields.ObjectField;
  };

  type RelatedPackageSchema = {
    id: fields.StringField;
    type: fields.StringField;
    manifest: fields.StringField;
    compatibility: PackageCompatibility;
    reason: fields.StringField;
  };

  // TODO: Figure out proper recursion here
  type RecursiveDepth = [never, 0, 1, 2, 3];

  type PackageCompendiumFolderSchema<Depth extends number> = {
    name: fields.StringField;
    sorting: fields.StringField;
    color: fields.ColorField;
    packs: fields.SetField;
  } & Depth extends 0
    ? {}
    : { folders: fields.SetField };

  type Schema = {
    id: fields.StringField<{
      required: true;
      blank: false;
      validate: typeof BasePackage.validateId;
    }>;
    title: fields.StringField;
    description: fields.StringField;
    authors: fields.SetField;
    url: optionalString;
    license: optionalString;
    readme: optionalString;
    bugs: optionalString;
    changelog: optionalString;
    flags: fields.ObjectField;
    media: fields.SetField;
    version: fields.StringField;
    compatibility: PackageCompatibility;
    scripts: fields.SetField;
    esmodules: fields.SetField;
    styles: fields.SetField;
    languages: fields.SetField;
    packs: PackageCompendiumPacks;
    packFolders: fields.SetField;
    relationships: PackageRelationships;
    socket: fields.BooleanField;
    manifest: fields.StringField;
    download: fields.StringField;
    protected: fields.BooleanField;
    exclusive: fields.BooleanField;
    persistentStorage: fields.BooleanField;
  };

  type PackageManifestData = {
    availability: CONST.PACKAGE_AVAILABILITY_CODES;
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
export class RelatedPackage extends fields.SchemaField<BasePackage.RelatedPackageSchema> {
  constructor({
    packageType,
    ...options
  }: InexactPartial<{
    /** @defaultValue `"module"` */
    packageType: CONST.PACKAGE_TYPES;
    options: fields.SchemaField.Options<BasePackage.RelatedPackageSchema>;
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
    options: fields.SchemaField.DefaultOptions;
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
export class PackageCompendiumPacks extends fields.SetField {}

interface BasePackage extends fields.SchemaField.InnerInitializedType<BasePackage.Schema> {}

/**
 * The data schema used to define a Package manifest.
 * Specific types of packages extend this schema with additional fields.
 */
declare class BasePackage<PackageSchema extends BasePackage.Schema = BasePackage.Schema> extends DataModel<
  fields.SchemaField<PackageSchema>,
  null
> {
  /**
   * An availability code in PACKAGE_AVAILABILITY_CODES which defines whether this package can be used.
   */
  availability: CONST.PACKAGE_AVAILABILITY_CODES;

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
  static type: CONST.PACKAGE_TYPES;

  /**
   * The type of this package instance. A value in CONST.PACKAGE_TYPES.
   */
  get type(): CONST.PACKAGE_TYPES;

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
  static isIncompatibleWithCoreVersion(availability: CONST.PACKAGE_AVAILABILITY_CODES): boolean;

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
  ): CONST.PACKAGE_AVAILABILITY_CODES;

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

  static cleanData(source?: object | undefined, options?: fields.DataField.CleanOptions | undefined): object;

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
    options: InexactPartial<
      {
        /** Is the package installed? */
        installed: unknown;
      } & LogCompatibilityWarningOptions
    >,
  ): void;

  static migrateData(
    data: object,
    logOptions: InexactPartial<{
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
