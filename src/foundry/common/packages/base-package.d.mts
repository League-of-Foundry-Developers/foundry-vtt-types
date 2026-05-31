import type { AnyArray, Coalesce, Identity, InexactPartial, PrettifyType, SimpleMerge } from "#utils";
import type { DataModel } from "#common/abstract/_module.d.mts";
import type {
  ArrayField,
  BooleanField,
  ColorField,
  DataField,
  DataSchema,
  HTMLField,
  ObjectField,
  SchemaField,
  SetField,
  StringField,
} from "#client/data/fields.mjs";
import type { ReleaseData } from "#common/config.d.mts";
import type { DataModelValidationFailure } from "#common/data/validation-failure.d.mts";
import type { BaseFolder } from "#common/documents/_module.d.mts";
import type { LogCompatibilityWarningOptions } from "#common/utils/logging.d.mts";

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

    interface Instance<PackageSchema extends BasePackage.Schema> {
      [__PackageSchema]: PackageSchema;
    }

    namespace Instance {
      interface Any extends Instance<BasePackage.Schema> {}
    }
  }

  /**
   * Foundry uses this as the common options for many fields in {@linkcode BasePackage.Schema}
   * @internal
   */
  interface _OptionalStringOptions {
    required: false;
    blank: false;
    initial: undefined;
  }

  interface AuthorSchema extends DataSchema {
    /** The author name */
    name: StringField<{ required: true; blank: false }>;

    /** The author email address */
    email: StringField<_OptionalStringOptions>;

    /** A website url for the author */
    url: StringField<_OptionalStringOptions>;

    /** A Discord username for the author */
    discord: StringField<_OptionalStringOptions>;

    flags: ObjectField;
  }

  interface AuthorData extends SchemaField.InitializedData<AuthorSchema> {}

  interface MediaSchema extends DataSchema {
    /** Usage type for the media asset. "setup" means it will be used on the setup screen. */
    type: StringField<_OptionalStringOptions>;

    /** A web url link to the media element. */
    url: StringField<_OptionalStringOptions>;

    /** A caption for the media element. */
    caption: StringField<_OptionalStringOptions>;

    /** Should the media play on loop? */
    loop: BooleanField<{ required: false; blank: false; initial: false }>;

    /** A link to the thumbnail for the media element. */
    thumbnail: StringField<_OptionalStringOptions>;

    /** An object of optional key/value flags. */
    flags: ObjectField;
  }

  interface MediaData extends SchemaField.InitializedData<AuthorSchema> {}

  // TODO(esheyw): does this need to be `InexactPartial`ed here? Explicit `undefined` values for any key fail validation.
  type OwnershipRecord = InexactPartial<
    Record<keyof typeof CONST.USER_ROLES, keyof typeof CONST.DOCUMENT_OWNERSHIP_LEVELS>
  >;

  interface CompendiumSchema extends DataSchema {
    /**
     * The canonical compendium name. This should contain no spaces or special characters
     */
    name: StringField<{
      required: true;
      blank: false;
      validate: typeof BasePackage.validateId;
      validationError: "may not contain periods";
    }>;

    /**
     * The human-readable compendium name
     */
    label: StringField<{ required: true; blank: false }>;

    /**
     * A file path to a banner image that will be used in the Compendium sidebar. This should
     * be hosted within your package, e.g. `modules/my-module/assets/banners/bestiary.webp`.
     * The dimensions are 290 x 70; you can either have each be an individual landscape or
     * slice them up to form a composite with your other compendiums, but keep in mind that
     * users can reorder compendium packs as well as filter them to break up the composite.
     *
     * @remarks `undefined` is replaced with the default `CONFIG[this.metadata.type]?.compendiumBanner`
     * but `null` passes through unchanged.
     */
    banner: StringField<_OptionalStringOptions & { nullable: true }>;

    /**
     * The local relative path to the compendium source directory. The filename should match the name attribute
     */
    path: StringField<{ required: false }>;

    /**
     * The specific document type that is contained within this compendium pack
     */
    type: StringField<{
      required: true;
      blank: false;
      choices: CONST.COMPENDIUM_DOCUMENT_TYPES[];
      validationError: "must be a value in CONST.COMPENDIUM_DOCUMENT_TYPES";
    }>;

    /**
     * Denote that this compendium pack requires a specific game system to function properly.
     * Required for "Actor" and "Item" packs, but even others should keep in mind that system
     * specific features and subtypes (e.g. JournalEntryPage) may present limitations.
     */
    system: StringField<_OptionalStringOptions>;

    /** @remarks Be careful when setting this; an empty object will prevent even a GM from seeing it in the directory. */
    ownership: CompendiumOwnershipField;

    flags: ObjectField;
  }

  interface CompendiumData extends SchemaField.InitializedData<CompendiumSchema> {}

  /** The {@linkcode UndefinedToOptional} is because in a socket response from the server, properties with `undefined` value are dropped. */
  interface SocketCompendiumData extends UndefinedToOptional<CompendiumData> {}

  interface LanguageSchema extends DataSchema {
    /**
     * A string language code which is validated by Intl.getCanonicalLocales
     */
    lang: StringField<{
      required: true;
      blank: false;
      // Foundry is using the truthiness of this function
      // validate: typeof Intl.getCanonicalLocales;
      validationError: "must be supported by the Intl.getCanonicalLocales function";
    }>;

    /**
     * The human-readable language name
     */
    name: StringField<{ required: false }>;

    /**
     * The relative path to included JSON translation strings
     */
    path: StringField<{ required: true; blank: false }>;

    /**
     * Only apply this set of translations when a specific system is being used
     */
    system: StringField<_OptionalStringOptions>;

    /**
     * Only apply this set of translations when a specific module is active
     */
    module: StringField<_OptionalStringOptions>;

    flags: ObjectField;
  }

  interface LanguageData extends SchemaField.InitializedData<LanguageSchema> {}

  interface StylesSchema extends DataSchema {
    layer: StringField<{ required: false; nullable: true; blank: false; initial: undefined }>;
    src: StringField<{ required: true; blank: false }>;
  }

  interface StylesData extends SchemaField.InitializedData<StylesSchema> {}

  interface Schema extends DataSchema {
    /** The machine-readable unique package id, should be lower-case with no spaces or special characters */
    id: StringField<{
      required: true;
      blank: false;
      validate: typeof BasePackage.validateId;
    }>;

    /** The human-readable package title, containing spaces and special characters */
    title: StringField<{ required: true; blank: false }>;

    /** An optional package description, may contain HTML */
    description: HTMLField<{ required: true }>;

    /**
     * An array of author objects who are co-authors of this package. Preferred to the singular author field.
     */
    authors: SetField<SchemaField<AuthorSchema>>;

    /**
     * A web url where more details about the package may be found
     */
    url: StringField<_OptionalStringOptions>;

    /**
     * A web url or relative file path where license details may be found
     */
    license: StringField<_OptionalStringOptions>;

    /**
     * A web url or relative file path where readme instructions may be found
     */
    readme: StringField<_OptionalStringOptions>;

    /**
     * A web url where bug reports may be submitted and tracked
     */
    bugs: StringField<_OptionalStringOptions>;

    /**
     * A web url where notes detailing package updates are available
     */
    changelog: StringField<_OptionalStringOptions>;

    /**
     * An object of optional key/value flags. Packages can use this namespace for their own purposes,
     * preferably within a namespace matching their package ID.
     */
    flags: ObjectField<
      // eslint-disable-next-line @typescript-eslint/no-empty-object-type -- No options, and `EmptyObject` behaves differently
      {},
      BasePackage.Flags | null | undefined,
      BasePackage.Flags,
      BasePackage.Flags
    >;

    /** An array of objects containing media info about the package. */
    media: SetField<SchemaField<MediaSchema>>;

    // The definition of `version` below has been omitted here due to `BaseWorld` doing unsound subclassing. See `BasePackage#version`.
    // version: StringField<{ required: true; blank: false; initial: "0"; validate: typeof BasePackage.validateVersion }>;

    /**
     * The compatibility of this version with the core Foundry software. See https://foundryvtt.com/article/versioning/
     * for more info on how the core software structures its releases.
     */
    compatibility: PackageCompatibility;

    /**
     * An array of urls or relative file paths for JavaScript files to include
     */
    scripts: SetField<StringField<{ required: true; blank: false }>>;

    /**
     * An array of urls or relative file paths for ESModule files to include
     */
    esmodules: SetField<StringField<{ required: true; blank: false }>>;

    /**
     * An array of urls or relative file paths for CSS stylesheet files to include
     */
    styles: ArrayField<SchemaField<StylesSchema>>;

    /**
     * An array of language data objects which are included by this package
     */
    languages: SetField<SchemaField<LanguageSchema>>;

    /**
     * An array of compendium packs which are included by this package
     */
    packs: PackageCompendiumPacks<SchemaField<CompendiumSchema>>;

    /**
     * An array of pack folders that will be initialized once per world.
     */
    packFolders: SetField<PackageCompendiumFolder>;

    /**
     * An organized object of relationships to other Packages
     */
    relationships: PackageRelationships;

    /**
     * Whether to require a package-specific socket namespace for this package
     */
    socket: BooleanField;

    /**
     * A publicly accessible web URL which provides the latest available package manifest file. Required in order to support module updates.
     */
    manifest: StringField;

    /**
     * A publicly accessible web URL where the source files for this package may be downloaded. Required in order to support module installation.
     */
    download: StringField<{ required: false; blank: false; initial: undefined }>;

    /**
     * Whether this package uses the protected content access system.
     */
    protected: BooleanField;

    /**
     * Whether this package is a free Exclusive pack.
     */
    exclusive: BooleanField;

    /**
     * Whether updates should leave the contents of the package's /storage folder.
     */
    persistentStorage: BooleanField;
  }

  /**
   * These are properties pulled out of construction data by the `BasePackage` constructor that do not exist in its schema (nor any
   * subclass schema). They are calculated server-side and provided with world data.
   * @internal
   */
  interface _ExtraConstructionProperties {
    /**
     * An availability code in {@linkcode CONST.PACKAGE_AVAILABILITY_CODES} which defines whether this package can be used.
     * @defaultValue {@linkcode BasePackage.testAvailability | this.constructor.testAvailability(this)}
     */
    availability: CONST.PACKAGE_AVAILABILITY_CODES;

    /**
     * A flag which tracks whether this package is currently locked.
     * @defaultValue `false`
     */
    locked: boolean;

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
     * A flag which tracks if this package has files stored in the persistent storage folder
     * @defaultValue `false`
     */
    hasStorage: boolean;
  }

  /**
   * Package creation takes additional properties, beyond just fields defined in the schema, which get handled by `BasePackage#constructor`.
   * @privateRemarks the `& { version }` is to account for how we've handled `BaseWorld`'s unsound schema subclassing of `version`. See
   * {@linkcode BasePackage.version | BasePackage#version} remarks.
   */
  type ManifestData<Schema extends BasePackage.Schema = BasePackage.Schema> = SchemaField.CreateData<Schema> &
    InexactPartial<_ExtraConstructionProperties> & { version?: string | null };

  /**
   * @remarks Package flags do not operate under the same rules as Document flags
   * 1. They are constructed directly from the provided manifest.json files
   * 2. There are no helper getFlag/setFlag functions
   * 3. There is no enforced namespacing
   * 4. There are *many* layers that accept flags, rather than just the top level
   */
  namespace Flags {
    /** @internal */
    interface _Core {
      /** Can you upload to this package's folder using the built-in FilePicker. */
      canUpload: boolean;

      /** Configuration information for hot reload logic */
      hotReload: HotReloadConfig;

      /**
       * Mapping information for CompendiumArt.
       * Each key is a unique system ID, e.g. "dnd5e" or "pf2e".
       */
      compendiumArtMappings: Record<string, CompendiumArtFlag>;

      /** A mapping of token subject paths to configured subject images. */
      tokenRingSubjectMappings: Record<string, string>;
    }

    /**
     * Flags used by the core software.
     * @remarks Flags for the top level of the schema. Notably *not* namespaced as "core..."
     */
    interface Core extends InexactPartial<_Core> {}

    /** @internal */
    interface _HotReloadConfig {
      /** A list of file extensions, e.g. `["css", "hbs", "json"]` */
      extensions: string[];

      /** File paths to watch, e.g. `["src/styles", "templates", "lang"]` */
      paths: string[];
    }

    interface HotReloadConfig extends InexactPartial<_HotReloadConfig> {}

    /** @internal */
    interface _CompendiumArtFlag {
      /** An optional credit string for use by the game system to apply in an appropriate place. */
      credit: string;
    }

    interface CompendiumArtFlag extends InexactPartial<_CompendiumArtFlag> {
      /** The path to the art mapping file. */
      mapping: string;
    }
  }

  /** Merge into this interface if you are using non-core package flags. */
  interface Flags extends BasePackage.Flags.Core {}

  /** @internal */
  interface _TestAvailabilityOptions {
    /**
     * A specific software release for which to test availability. Tests against the current release by default.
     */
    release: ReleaseData;
  }

  interface TestAvailabilityOptions extends InexactPartial<_TestAvailabilityOptions> {}

  /** @internal */
  interface _Installed {
    /** Is the package installed? */
    installed: boolean;
  }

  interface LogOptions extends InexactPartial<_Installed>, InexactPartial<LogCompatibilityWarningOptions> {}

  interface MigrateDataOptions extends InexactPartial<_Installed> {}

  interface CleanDataOptions extends InexactPartial<_Installed>, DataField.CleanOptions {}

  /** @internal */
  interface _FromRemoteManifestOptions {
    /**
     * Whether to construct the remote package strictly
     * @defaultValue `true`
     */
    strict: boolean;
  }

  interface FromRemoteManifestOptions extends InexactPartial<_FromRemoteManifestOptions> {}

  /**
   * @deprecated Package creation data always includes extra properties not derived from the schema, so this type is not useful.
   * For generic package creation data, use {@linkcode BasePackage.ManifestData} instead. This warning will be removed in v14.
   */
  type CreateData = ManifestData;

  /**
   * @deprecated There shouldn't be a need to reference this type directly, these properties are only used in package construction,
   * alongside the rest of the creation data; See {@linkcode ManifestData}. This warning will be removed in v14.
   */
  type PackageManifestData = _ExtraConstructionProperties;

  /**
   * @deprecated This interface has been moved out of the `BasePackage` namespace, use {@linkcode PackageCompatibility.Schema} instead.
   * This warning will be removed in v14.
   */
  type PackageCompatibilitySchema = PackageCompatibility.Schema;

  /**
   * @deprecated This interface has been moved out of the `BasePackage` namespace, use {@linkcode PackageRelationships.Schema} instead.
   * This warning will be removed in v14.
   */
  type PackageRelationshipsSchema = PackageRelationships.Schema;

  /**
   * @deprecated This interface has been moved out of the `BasePackage` namespace, use {@linkcode RelatedPackage.Schema} instead.
   * This warning will be removed in v14.
   */
  type RelatedPackageSchema<PackageType extends CONST.PACKAGE_TYPES | undefined = undefined> =
    RelatedPackage.Schema<PackageType>;

  /**
   * @deprecated This interface has been moved out of the `BasePackage` namespace, use {@linkcode PackageCompendiumFolder.FolderRecursion}
   * instead. This warning will be removed in v14.
   */
  type FolderRecursion = PackageCompendiumFolder.FolderRecursion;

  /**
   * @deprecated This interface has been moved out of the `BasePackage` namespace, use {@linkcode PackageCompendiumFolder.Schema}
   * instead. This warning will be removed in v14.
   */
  type PackageCompendiumFolderSchema<Depth extends number | undefined = undefined> =
    PackageCompendiumFolder.Schema<Depth>;
}

/**
 * A custom SchemaField for defining package compatibility versions.
 */
declare class PackageCompatibility<
  Options extends SchemaField.Options<PackageCompatibility.Schema> = SchemaField.DefaultOptions,
> extends SchemaField<PackageCompatibility.Schema, Options> {
  constructor(options?: Options);
}

declare namespace PackageCompatibility {
  interface Schema extends DataSchema {
    /**
     * The Package will not function before this version
     */
    minimum: StringField<{
      required: false;
      blank: false;
      initial: undefined;
      validate: typeof BasePackage.validateVersion;
    }>;

    /**
     * Verified compatible up to this version
     */
    verified: StringField<{
      required: false;
      blank: false;
      initial: undefined;
      validate: typeof BasePackage.validateVersion;
    }>;

    /**
     * The Package will not function after this version
     */
    maximum: StringField<{
      required: false;
      blank: false;
      initial: undefined;
      validate: typeof BasePackage.validateVersion;
    }>;
  }

  interface Data extends SchemaField.InitializedData<Schema> {}
}

export { PackageCompatibility };

/**
 * A custom SchemaField for defining package relationships.
 */
declare class PackageRelationships<
  Options extends SchemaField.Options<PackageRelationships.Schema> = SchemaField.DefaultOptions,
> extends SchemaField<PackageRelationships.Schema, Options> {
  constructor(options?: Options);
}

declare namespace PackageRelationships {
  interface Schema extends DataSchema {
    /**
     * Systems that this Package supports
     */
    systems: PackageRelationshipField<RelatedPackage<"system">>;

    /**
     * Packages that are required for base functionality
     */
    requires: PackageRelationshipField<RelatedPackage>;

    /**
     * Packages that are recommended for optimal functionality
     */
    recommends: PackageRelationshipField<RelatedPackage>;

    conflicts: PackageRelationshipField<RelatedPackage>;

    flags: ObjectField;
  }

  interface Data extends SchemaField.InitializedData<Schema> {}
}

export { PackageRelationships };

/**
 * A SetField with custom casting behavior.
 * @privateRemarks This class is a bunch of words for only the benefit of {@linkcode PackageRelationships.Schema} having accurate
 * field class names.
 */
declare class PackageRelationshipField<
  const ElementFieldType extends DataField.Any,
  const Options extends SetField.AnyOptions = SetField.DefaultOptions,
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  const AssignmentElementType = ArrayField.AssignmentElementType<ElementFieldType>,
  const InitializedElementType = ArrayField.InitializedElementType<ElementFieldType>,
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  const AssignmentType = SetField.AssignmentType<AssignmentElementType, Options>,
  const InitializedType = SetField.InitializedType<InitializedElementType, Options>,
  const PersistedElementType = ArrayField.PersistedElementType<ElementFieldType>,
  const PersistedType extends PersistedElementType[] | null | undefined = SetField.PersistedType<
    PersistedElementType,
    Options
  >,
> extends SetField<
  ElementFieldType,
  Options,
  AssignmentElementType,
  InitializedElementType,
  AssignmentType,
  InitializedType,
  PersistedElementType,
  PersistedType
> {
  // Actually wraps non-array `value`s as `[value]`, but typing it as such makes `super` yell.
  protected override _cast(value: unknown): AssignmentType;
}

/**
 * A custom SchemaField for defining a related Package.
 * It may be required to be a specific type of package, by passing the `packageType` option to the constructor.
 */
declare class RelatedPackage<
  PackageType extends CONST.PACKAGE_TYPES | undefined = undefined,
  Options extends SchemaField.Options<RelatedPackage.Schema<PackageType>> = SchemaField.DefaultOptions,
> extends SchemaField<RelatedPackage.Schema<PackageType>, Options> {
  constructor(options?: RelatedPackage.ConstructorOptions<PackageType, Options>);
}

declare namespace RelatedPackage {
  type ConstructorOptions<
    PackageType extends CONST.PACKAGE_TYPES | undefined = undefined,
    Options extends SchemaField.Options<RelatedPackage.Schema<PackageType>> = SchemaField.DefaultOptions,
  > = {
    /** @defaultValue `"module"` */
    packageType?: PackageType;
  } & Options;

  interface Schema<PackageType extends CONST.PACKAGE_TYPES | undefined = undefined> extends DataSchema {
    /**
     * The id of the related package
     */
    id: StringField<{ required: true; blank: false; validate: typeof BasePackage.validateId }>;

    /**
     * The type of the related package
     */
    type: StringField<{
      choices: Coalesce<PackageType, CONST.PACKAGE_TYPES>[];
      initial: Coalesce<PackageType, "module">;
    }>;

    /**
     * An explicit manifest URL, otherwise learned from the Foundry web server
     */
    manifest: StringField<{ required: false; blank: false; initial: undefined }>;

    /**
     * The compatibility data with this related Package
     */
    compatibility: PackageCompatibility;

    /**
     * The reason for this relationship
     */
    reason: StringField<{ required: false; blank: false; initial: undefined }>;
  }

  interface Data extends SchemaField.InitializedData<Schema> {}
}

export { RelatedPackage };

/**
 * A custom SchemaField for defining the folder structure of the included compendium packs.
 */
declare class PackageCompendiumFolder<
  Depth extends number | undefined = undefined,
  Options extends SchemaField.Options<PackageCompendiumFolder.Schema<Depth>> = SchemaField.DefaultOptions,
> extends SchemaField<PackageCompendiumFolder.Schema<Depth>> {
  constructor(options?: PackageCompendiumFolder.ConstructorOptions<Depth, Options>);
}

declare namespace PackageCompendiumFolder {
  type ConstructorOptions<
    Depth extends number | undefined = undefined,
    Options extends SchemaField.Options<PackageCompendiumFolder.Schema<Depth>> = SchemaField.DefaultOptions,
  > = {
    /** @defaultValue `1` */
    depth?: Depth;
  } & Options;

  /** @internal */
  interface _Schema extends DataSchema {
    /** Name for the folder. Multiple packages with identical folder names will merge by name. */
    name: StringField<{ required: true; blank: false }>;

    /** Alphabetical or manual sorting. */
    sorting: StringField<{
      required: false;
      blank: false;
      initial: undefined;
      choices: typeof BaseFolder.SORTING_MODES;
    }>;

    /** A hex string for the pack's color. */
    color: ColorField;

    /** A list of the pack names to include in this folder. */
    packs: SetField<StringField<{ required: true; blank: false }>>;
  }

  // Foundry starts Depth at 1 and increments from there
  type FolderRecursion = [1, 2, 3, 4];

  type Schema<Depth extends number | undefined> = Depth extends undefined | 0 | 1 | 2 | 3
    ? _Schema & {
        folders: SetField<PackageCompendiumFolder<FolderRecursion[Coalesce<Depth, 1>]>>;
      }
    : _Schema;

  interface Data extends SchemaField.InitializedData<Schema<1>> {}
}

export { PackageCompendiumFolder };

/**
 * A special `ObjectField` which captures a mapping of {@linkcode CONST.USER_ROLES} to {@linkcode CONST.DOCUMENT_OWNERSHIP_LEVELS}.
 */
declare class CompendiumOwnershipField<
  Options extends DataField.Options<BasePackage.OwnershipRecord> = CompendiumOwnershipField.DefaultOptions,
> extends ObjectField<Options, BasePackage.OwnershipRecord, BasePackage.OwnershipRecord, BasePackage.OwnershipRecord> {
  static override get _defaults(): DataField.Options<BasePackage.OwnershipRecord>;

  protected override _validateType(
    value: Record<keyof typeof CONST.USER_ROLES, keyof typeof CONST.DOCUMENT_OWNERSHIP_LEVELS>,
    options?: DataField.ValidateOptions<this>,
  ): boolean | void;
}

declare namespace CompendiumOwnershipField {
  type DefaultOptions = SimpleMerge<
    ObjectField.DefaultOptions,
    {
      initial: { PLAYER: "OBSERVER"; ASSISTANT: "OWNER" };
      validationError: "is not a mapping of USER_ROLES to DOCUMENT_OWNERSHIP_LEVELS";
    }
  >;
}

export { CompendiumOwnershipField };

/**
 * A special SetField which provides additional validation and initialization behavior specific to compendium packs.
 */
export class PackageCompendiumPacks<ElementFieldType extends DataField.Any> extends SetField<ElementFieldType> {
  protected override _cleanType(
    value: Set<ArrayField.InitializedElementType<ElementFieldType>>,
    options?: DataField.CleanOptions,
  ): Set<ArrayField.InitializedElementType<ElementFieldType>>;

  override initialize(
    value: ArrayField.PersistedElementType<ElementFieldType>[],
    // In Foundry itself, this field is only used in `BasePackage`, however it should be able to accept any model.
    // NOTE(LukeAbby): This also has been seen in a circularity `Type of property 'packs' circularly references itself in mapped type ...`.
    model: DataModel.Any,
    options?: DataField.InitializeOptions,
  ):
    | Set<ArrayField.InitializedElementType<ElementFieldType>>
    | (() => Set<ArrayField.InitializedElementType<ElementFieldType>> | null);

  protected override _validateElements(
    value: AnyArray,
    options?: DataField.ValidateOptions<DataField.Any>,
  ): void | DataModelValidationFailure;

  protected override _validateElement(
    value: unknown,
    options: DataField.ValidateOptions<DataField.Any>,
  ): void | DataModelValidationFailure;
}

/**
 * The data schema used to define a Package manifest.
 * Specific types of packages extend this schema with additional fields.
 * @privateRemarks The following methods/properties need to be overridden in direct subclasses:
 * - {@linkcode BasePackage.type} (both static property and instance getter, its impossible to link to the latter)
 * - {@linkcode BasePackage.collection} to match `type` + `"s"`.
 * - {@linkcode BasePackage.version | BasePackage#version}, due to unsound subclassing on Foundry's part.
 * - {@linkcode BasePackage.testAvailability} to narrow the first parameter.
 * - Standard {@linkcode DataModel} overrides.
 */
declare class BasePackage<PackageSchema extends BasePackage.Schema = BasePackage.Schema> extends DataModel<
  PackageSchema,
  null
> {
  constructor(
    data: BasePackage.ManifestData<PackageSchema> | BasePackage.Any,
    options?: DataModel.ConstructionContext<null>,
  );

  static [__BasePackageBrand]: never;

  [__PackageSchema]: PackageSchema;

  /**
   * @privateRemarks `version` is omitted from {@linkcode BasePackage.Schema} due to {@linkcode foundry.packages.BaseWorld.Schema} changing
   * the `nullable` and `initial` options of the field. `BaseModule` and `BaseSystem` have fake declarations for this field in their schema
   * instead, while `BaseWorld` has its real one. A fake class property has been added to `BasePackage`, as well as ones in `BaseModule`,
   * and `BaseSystem` to narrow them, since the schema is otherwise overridden by this type. That, along with adding `version` to
   * {@linkcode BasePackage.ManifestData} manually, ensures correctness with only some light lying.
   */
  version: string | null;

  /**
   * An availability code in {@linkcode CONST.PACKAGE_AVAILABILITY_CODES} which defines whether this package can be used.
   * @defaultValue {@linkcode BasePackage.testAvailability | this.constructor.testAvailability(this)}
   * @privateRemarks Defined at construction by simple assignment.
   */
  availability: CONST.PACKAGE_AVAILABILITY_CODES;

  /**
   * A flag which tracks whether this package is currently locked.
   * @defaultValue `false`
   * @privateRemarks Defined at construction by simple assignment.
   */
  locked: boolean;

  /**
   * A flag which tracks whether this package is a free Exclusive pack
   * @defaultValue `false`
   * @remarks The constructor only sets the top level instance property, the `_source` is unchanged.
   * @privateRemarks Unlike the other properties assigned at construction, this also {@link BasePackage.Schema.exclusive | exists} in
   * the schema.
   */
  exclusive: boolean;

  /**
   * A flag which tracks whether this package is owned, if it is protected.
   * @defaultValue `false`
   * @privateRemarks Defined at construction by simple assignment.
   */
  owned: boolean;

  /**
   * A set of Tags that indicate what kind of Package this is, provided by the Website
   * @defaultValue `[]`
   * @privateRemarks Defined at construction by simple assignment.
   */
  tags: string[];

  /**
   * A flag which tracks if this package has files stored in the persistent storage folder
   * @defaultValue `false`
   * @privateRemarks Defined at construction by simple assignment.
   */
  hasStorage: boolean;

  /**
   * Define the package type in {@linkcode CONST.PACKAGE_TYPES} that this class represents.
   * Each BasePackage subclass must define this attribute.
   * @abstract
   * @remarks This is actually `"package"` in `BasePackage`, a disallowed value, but the three real package types all override.
   */
  static type: CONST.PACKAGE_TYPES;

  /**
   * The type of this package instance. A value in {@linkcode CONST.PACKAGE_TYPES}.
   */
  get type(): CONST.PACKAGE_TYPES;

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
  static get collection(): `${typeof BasePackage.type}s`;

  static defineSchema(): BasePackage.Schema;

  /** @defaultValue `["PACKAGE"]` */
  static override LOCALIZATION_PREFIXES: string[];

  /**
   * Check the given compatibility data against the current installation state and determine its availability.
   * @param data    - The compatibility data to test.
   * @privateRemarks Foundry types this as `Partial<PackageManifestData>`, which on their side is an incomplete
   * `InitializedData<BasePackage.Schema>`, but the only client side call is in `BasePackage#constructor`, where
   * it gets passed `this`, and server-side it's also always called with a constructed package. Both this method
   * and the one real override in {@linkcode foundry.packages.BaseWorld.testAvailability | BaseWorld} only access
   * properties of `data`, so it has been typed as either.
   *
   * TODO: Also, currently, `BasePackage.Any` is not assignable to `BasePackage.ManifestData` on mismatched
   * TODO: folder depth grounds. Otherwise this could be typed as just `ManifestData`.
   */
  static testAvailability(
    data: BasePackage.ManifestData | BasePackage.Any,
    options?: BasePackage.TestAvailabilityOptions,
  ): CONST.PACKAGE_AVAILABILITY_CODES;

  /**
   * Test that the dependencies of a package are satisfied as compatible.
   * This method assumes that all packages in modulesCollection have already had their own availability tested.
   * @param modulesCollection - A collection which defines the set of available modules
   * @returns Are all required dependencies satisfied?
   * @internal
   */
  _testRequiredDependencies(modulesCollection: Collection<foundry.packages.Module>): Promise<boolean>;

  /**
   * Test compatibility of a package's supported systems.
   * @param systemCollection - A collection which defines the set of available systems.
   * @returns True if all supported systems which are currently installed are compatible or if the package has no supported systems.
   * Returns false otherwise, or if no supported systems are installed.
   * @internal
   */
  _testSupportedSystems(systemCollection: Collection<foundry.packages.System>): Promise<boolean>;

  /**
   * Determine if a dependency is within the given compatibility range.
   * @param compatibility - The compatibility range declared for the dependency, if any
   * @param dependency    - The known dependency package
   * @returns Is the dependency compatible with the required range?
   */
  static testDependencyCompatibility(compatibility: PackageCompatibility.Data, dependency: BasePackage.Any): boolean;

  static cleanData(source?: object, options?: BasePackage.CleanDataOptions): object;

  /**
   * Validate that a Package ID is allowed.
   * @param id - The candidate ID
   * @throws An error if the candidate ID is invalid
   */
  static validateId(id: string): void;

  /**
   * Validate that a version is allowed.
   * @param version - The candidate version
   * @throws An error if the version is invalid
   * @remarks Disallows the illegal characters: `'` `"` `<` `>` `&`
   */
  static validateVersion(version: string): void;

  /**
   *  A wrapper around the default compatibility warning logger which handles some package-specific interactions.
   * @param packageId - The package ID being logged
   * @param message   - The warning or error being logged
   * @param options   - Logging options passed to {@linkcode foundry.utils.logCompatibilityWarning}
   */
  protected static _logWarning(packageId: string, message: string, options?: BasePackage.LogOptions): void;

  /**
   * @remarks
   * Migrations:
   * - Inside `packs` entries, slugifies the `name` if not already a valid slug (since v12, until v14)
   * - Old style `string[]` styles entries to new `{src: string; layer?: string}[]` style (since v13, no stated end)
   */
  static override migrateData(data: object, options?: BasePackage.MigrateDataOptions): object;

  /**
   * Migrate to v13-schema styles array from string array
   * @internal
   */
  static _migrateStyles(data: object): void;

  /**
   * Adjust pack names to conform to a slugified version
   * @internal
   */
  static _migratePackIDs(data: object, logOptions: BasePackage.LogOptions): void;

  /**
   * Retrieve the latest Package manifest from a provided remote location.
   * @param manifestUrl - A remote manifest URL to load
   * @param options     - Additional options which affect package construction
   * @returns A Promise which resolves to a constructed ServerPackage instance
   * @throws An error if the retrieved manifest data is invalid
   * @remarks This is effectively abstract. Real overrides are provided by `ServerPackageMixin` and
   * {@linkcode foundry.packages.ClientPackageMixin | ClientPackageMixin}.
   */
  static fromRemoteManifest(manifestUrl: string, options: BasePackage.FromRemoteManifestOptions): Promise<never>;
}

export default BasePackage;

declare abstract class AnyBasePackage extends foundry.packages.BasePackage<BasePackage.Schema> {
  constructor(...args: never);
}

/**
 * A helper for converting a type with properties that are required but can be `undefined`
 * into that type after going over a socket, where properties with explicit `undefined`
 * values are dropped.
 *
 * See {@linkcode Game.Data.Pack}.
 */
type UndefinedToOptional<T extends object> = _UndefinedToOptional<T>;

type _UndefinedToOptional<T> = T extends object
  ? T extends AnyArray
    ? { [K in keyof T]: _UndefinedToOptional<T[K]> }
    : PrettifyType<
        {
          [K in keyof T as undefined extends T[K] ? never : K]: _UndefinedToOptional<T[K]>;
        } & {
          [K in keyof T as undefined extends T[K] ? K : never]?: _UndefinedToOptional<Exclude<T[K], undefined>>;
        }
      >
  : T;
