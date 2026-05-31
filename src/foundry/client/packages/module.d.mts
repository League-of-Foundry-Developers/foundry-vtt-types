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
    deps: Iterable<RelatedPackage.Data>,
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

  interface ManifestData extends BasePackage.ManifestData<Schema> {
    /** Is this package currently active? */
    active: boolean;
  }
}

export default Module;
