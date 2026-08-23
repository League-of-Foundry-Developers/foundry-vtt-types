import type { AdditionalTypesField, BaseModule, BasePackage, RelatedPackage } from "#common/packages/_module.d.mts";
import type { ClientPackageMixin } from "#client/packages/_module.d.mts";
import type { fields } from "#client/data/_module.d.mts";
import type { DataModel } from "#common/abstract/_module.d.mts";

declare class Module extends ClientPackageMixin(BaseModule) {
  constructor(data: Module.ManifestData, options?: DataModel.ConstructionContext<null>);

  /**
   * Is this package currently active?
   * @privateRemarks `defineProperty`ed at construction with `{ writable: false, configurable: false }` options.
   */
  readonly active: boolean;

  // fake type override
  static override get<ID extends string>(id: ID): Module.GetReturn<ID>;

  // fake type override
  static override getVersionBadge(
    availability: CONST.PACKAGE_AVAILABILITY_CODES,
    data: Module.ManifestData | Module,
    options: ClientPackageMixin.GetVersionBadgeOptions,
  ): ClientPackageMixin.CompatibilityBadge | null;

  // fake type override
  protected static override _formatBadDependenciesTooltip(
    availability: CONST.PACKAGE_AVAILABILITY_CODES,
    data: Module.ManifestData | Module,
    deps: Iterable<RelatedPackage.Data>,
    options?: ClientPackageMixin.FormatBadDependenciesTooltipOptions,
  ): string;

  // fake type override
  protected static override _formatIncompatibleSystemsTooltip(
    data: Module.ManifestData | Module,
    relationships: Iterable<RelatedPackage.Data>,
    options?: ClientPackageMixin.FormatIncompatibleSystemsTooltipOptions,
  ): string;
}

declare namespace Module {
  /**
   * The data put in {@linkcode DataModel._source}. This data is what was
   * persisted to the database and therefore it must be valid JSON.
   *
   * For example a {@linkcode fields.SetField | SetField} is persisted to the database as an array
   * but initialized as a {@linkcode Set}.
   */
  interface Source extends fields.SchemaField.SourceData<Schema> {}

  /**
   * The data necessary to create a data model. Used in places like {@linkcode Module.create}
   * and {@linkcode Module | new Module(...)}.
   *
   * For example a {@linkcode fields.SetField | SetField} can accept any {@linkcode Iterable}
   * with the right values. This means you can pass a `Set` instance, an array of values,
   * a generator, or any other iterable.
   */
  interface CreateData extends fields.SchemaField.CreateData<Schema> {}

  /**
   * The data after a {@linkcode DataModel} has been initialized, for example
   * {@linkcode Module.name | Module#name}.
   *
   * This is data transformed from {@linkcode Module.Source} and turned into more
   * convenient runtime data structures. For example a {@linkcode fields.SetField | SetField} is
   * persisted to the database as an array of values but at runtime it is a `Set` instance.
   */
  interface InitializedData extends fields.SchemaField.InitializedData<Schema> {}

  /**
   * The data used to update a document, for example {@linkcode Module.update | Module#update}.
   * It is a distinct type from {@linkcode Module.CreateData | DeepPartial<Module.CreateData>} because
   * it has different rules for `null` and `undefined`.
   */
  interface UpdateData extends fields.SchemaField.UpdateData<Schema> {}

  interface QuickstartAdventureSchema extends fields.DataSchema {
    /** The UUID of the adventure. */
    uuid: fields.StringField<{ required: true; blank: false }>;
  }

  interface QuickstartWorldSchema extends fields.DataSchema {
    /** The world's background image for the join page. If omitted, the first adventure's image is used. */
    background: fields.FilePathField<{ categories: ["IMAGE"]; required: false }>;

    /** The cover image for the world on the setup page. If omitted, the first adventure's image is used. */
    cover: fields.FilePathField<{ categories: ["IMAGE"]; required: false }>;

    /** The world's description. If omitted, the first adventure's description is used. */
    description: fields.HTMLField<{ required: false }>;
  }

  interface QuickstartSchema extends fields.DataSchema {
    /** A mapping of system IDs to an adventure to import for that system. */
    adventures: fields.TypedObjectField<
      fields.SchemaField<QuickstartAdventureSchema>,
      { expandKeys: false; validateKey: typeof BasePackage.validateId }
    >;

    /**
     * Whether the adventure(s) requires post-import operations. Non-GMs will be blocked from joining the World while
     * post-import operations are still pending.
     */
    postImport: fields.BooleanField;

    /** Configuration for the auto-created world. */
    world: fields.SchemaField<QuickstartWorldSchema>;
  }

  /**
   * The schema for {@linkcode Module}. This is the source of truth for how an Module document
   * must be structured.
   *
   * Foundry uses this schema to validate the structure of the {@linkcode Module}. For example
   * a {@linkcode fields.StringField | StringField} will enforce that the value is a string. More
   * complex fields like {@linkcode fields.SetField | SetField} goes through various conversions
   * starting as an array in the database, initialized as a set, and allows updates with any
   * iterable.
   */
  interface Schema extends BasePackage.Schema {
    /**
     * The current package version. It is recommended to stick to dot-separated numbers like "5.0.3" and to not include a leading "v" to
     * avoid string comparison. See {@linkcode foundry.utils.isNewerVersion}.
     * @privateRemarks Fake type override; see {@linkcode BasePackage.version | BasePackage#version}
     */
    version: fields.StringField<{
      required: true;
      blank: false;
      initial: "0";
      validate: typeof BasePackage.validateVersion;
    }>;

    /**
     * The package type among world, system, and module
     */
    type: fields.StringField<{ required: true; choices: ["module"]; initial: "module" }>;

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

    /**
     * The Quick-Start configuration.
     */
    quickstart: fields.SchemaField<QuickstartSchema, { required: false; initial: undefined }>;
  }

  interface QuickstartAdventureData extends fields.SchemaField.InitializedData<QuickstartAdventureSchema> {}

  interface QuickstartData extends fields.SchemaField.InitializedData<QuickstartSchema> {}

  interface ManifestData extends BasePackage.ManifestData<Schema> {
    /** Is this package currently active? */
    active: boolean;
  }

  /** @remarks An entry of this Module's `relationships.systems`, in source form. */
  type SystemSource = RelatedPackage.Source<"system">;

  type GetReturn<ID extends string> = foundry.Game.ModuleCollectionGetReturn<ID>;
}

export default Module;
