import type { AnyMutableObject, AnyObject, EmptyObject, Identity, NullishProps } from "fvtt-types/utils";
import type { DataField, SchemaField } from "../data/fields.d.mts";
import type { fields } from "../data/module.d.mts";
import type { DataModelValidationFailure } from "../data/validation-failure.d.mts";

type DataSchema = fields.DataSchema;

declare const DynamicClass: new <_Computed extends object>(...args: never) => _Computed;

// @ts-expect-error - This is a workaround to allow for dynamic top level properties in a class.
declare class _InternalDataModel<
  out Schema extends DataSchema,
  // Do not inline. Being a type parameter is an important part of the circumvention of TypeScript's detection of dynamic classes.
  out _Computed extends object = SchemaField.InitializedData<Schema>,
> extends DynamicClass<_Computed> {}

export default DataModel;

/**
 * The abstract base class which defines the data schema contained within a Document.
 */
declare abstract class DataModel<
  Schema extends DataSchema,
  Parent extends DataModel.Any | null = null,
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  ExtraConstructorOptions extends AnyObject = {},
> extends _InternalDataModel<Schema> {
  /**
   * @param data    - Initial data used to construct the data object. The provided object
   *                  will be owned by the constructed model instance and may be mutated.
   * @param options - Options which affect DataModel construction
   */
  constructor(...args: DataModel.ConstructorArgs<Schema, Parent, ExtraConstructorOptions>);

  /** @internal */
  " __fvtt_types_internal_source_data": SchemaField.SourceData<Schema>;

  /** @internal */
  " __fvtt_types_internal_assignment_data": SchemaField.AssignmentData<Schema>;

  /** @internal */
  " __fvtt_types_internal_initialized_data": SchemaField.InitializedData<Schema>;

  /**
   * Configure the data model instance before validation and initialization workflows are performed.
   */
  // options: not null (parameter default only, destructured in Document)
  protected _configure(options?: DataModel.ConfigureOptions & ExtraConstructorOptions): void;

  /**
   * The source data object for this DataModel instance.
   * Once constructed, the source object is sealed such that no keys may be added nor removed.
   */
  readonly _source: Readonly<fields.SchemaField.SourceData<Schema>>;

  /**
   * The defined and cached Data Schema for all instances of this DataModel.
   * @internal
   */
  protected static _schema: SchemaField.Any;

  /**
   * An immutable reverse-reference to a parent DataModel to which this model belongs.
   */
  readonly parent: Parent;

  /**
   * Define the data schema for documents of this type.
   * The schema is populated the first time it is accessed and cached for future reuse.
   * @remarks The returned value MUST be kept up to sync with the `Schema` type parameter.
   */
  static defineSchema(): DataSchema;

  /**
   * Define the data schema for documents of this type.
   */
  static get schema(): SchemaField.Any;

  /**
   * Define the data schema for this document instance.
   */
  get schema(): SchemaField<Schema, EmptyObject>;

  /**
   * Is the current state of this DataModel invalid?
   * The model is invalid if there is any unresolved failure.
   */
  get invalid(): boolean;

  /**
   * An array of validation failure instances which may have occurred when this instance was last validated.
   */
  // FIXME: Check if this is actually correct.
  get validationFailures(): { fields: DataModelValidationFailure | null; joint: DataModelValidationFailure | null };

  #validationFailures: { fields: DataModelValidationFailure | null; joint: DataModelValidationFailure | null };

  /**
   * A set of localization prefix paths which are used by this DataModel.
   */
  static LOCALIZATION_PREFIXES: string[];

  /**
   * Initialize the source data for a new DataModel instance.
   * One-time migrations and initial cleaning operations are applied to the source data.
   * @param data    - The candidate source data from which the model will be constructed
   * @param options - Options provided to the model constructor
   *                  (unused)
   * @returns Migrated and cleaned source data which will be stored to the model instance
   * @remarks `options` is unused in `DataModel`
   */
  // options: not null (parameter default only)
  protected _initializeSource(
    data: fields.SchemaField.CreateData<Schema> | this,
    options?: DataModel.InitializeSourceOptions & ExtraConstructorOptions,
  ): fields.SchemaField.SourceData<Schema>;

  /**
   * Clean a data source object to conform to a specific provided schema.
   * @param source  - The source data object
   * @param options - Additional options which are passed to field cleaning methods
   * @returns The cleaned source data
   */
  static cleanData(source?: AnyMutableObject, options?: DataField.CleanOptions): AnyMutableObject;

  /**
   * A generator that orders the DataFields in the DataSchema into an expected initialization order.
   */
  protected static _initializationOrder(): Generator<[string, DataField.Any]>;

  /**
   * Initialize the instance by copying data from the source object to instance attributes.
   * This mirrors the workflow of SchemaField#initialize but with some added functionality.
   * @param options - Options provided to the model constructor
   * @remarks `options` gets passed on to each field in the schema's `#initialize`
   */
  // options: not null (parameter default only)
  protected _initialize(options?: DataModel.InitializeOptions & ExtraConstructorOptions): void;

  /**
   * Reset the state of this data instance back to mirror the contained source data, erasing any changes.
   */
  reset(): void;

  /**
   * Clone a model, creating a new data model by combining current data with provided overrides.
   * @param data    - Additional data which overrides current document data at the time of creation
   * @param context - Context options passed to the data model constructor
   * @returns The cloned Document [sic] instance
   * @remarks Obviously returns not necessarily a `Document`, just a `DataModel`.
   *
   * **NOTE:** At the type level, the returned model will necessarily have the same parent as the instance `#clone()` is being called
   * on; Accurate typing of `#parent` requires a cast.
   * @privateRemarks Foundry types `context` as simply `object`, but going by core usage, it's a
   * {@link DataModel.ConstructionContext | `DataModel.ConstructionContext`}. Both the implementation here
   * and the override in `Document` provide `this.parent` to the construction context; Here, `context` is
   * spread in, so providing a different parent is allowed. The `Document` override enforces `this.parent`
   * with no opportunity to pass an alternative.
   */
  // null would be fine for either/both params here, but it breaks Document, and its never *expected*, just incidentally doesn't break
  clone(
    data?: fields.SchemaField.AssignmentData<Schema>,
    context?: DataModel.CloneContext & ExtraConstructorOptions,
  ): this;

  /**
   * Validate the data contained in the document to check for type and content
   * This function throws an error if data within the document is not valid
   *
   * @param options - Optional parameters which customize how validation occurs.
   * @returns An indicator for whether the document contains valid data
   */
  // options: not null (destructured)
  validate(options?: DataModel.ValidateOptions<Schema>): boolean;

  /**
   * Evaluate joint validation rules which apply validation conditions across multiple fields of the model.
   * Field-specific validation rules should be defined as part of the DataSchema for the model.
   * This method allows for testing aggregate rules which impose requirements on the overall model.
   * @param data - Candidate data for the model
   * @throws An error if a validation failure is detected
   * @remarks Other than posting a deprecation warning about and forwarding `data` to `this.prototype._validateModel` if defined,
   * this is effectively abstract in `DataModel`. Subclasses implementing should type `data` as the `SchemaField.SourceData<>` of
   * their schema.
   */
  // TODO(esheyw): dep warning is gone in v13, clean up remarks
  static validateJoint(data: never): void;

  /**
   * Update the DataModel locally by applying an object of changes to its source data.
   * The provided changes are cleaned, validated, and stored to the source data object for this model.
   * The source data is then re-initialized to apply those changes to the prepared data.
   * The method returns an object of differential changes which modified the original data.
   *
   * @param changes - New values which should be applied to the data model
   * @param options - Options which determine how the new data is merged
   * @returns An object containing the changed keys and values
   */
  updateSource(
    changes?: fields.SchemaField.UpdateData<Schema>,
    options?: DataModel.UpdateSourceOptions,
  ): fields.SchemaField.UpdateData<Schema>;

  /**
   * Copy and transform the DataModel into a plain object.
   * Draw the values of the extracted object from the data source (by default) otherwise from its transformed values.
   * @param source - Draw values from the underlying data source rather than transformed values
   *                 (default: `true`)
   * @returns The extracted primitive object
   */
  toObject<Source extends boolean | null | undefined = true>(source?: Source): DataModel.ToObject<Schema, Source>;

  /**
   * Extract the source data for the DataModel into a simple object format that can be serialized.
   * @returns The document source data expressed as a plain object
   */
  toJSON(): DataModel.ToObject<Schema, true>;

  /**
   * Create a new instance of this DataModel from a source record.
   * The source is presumed to be trustworthy and is not strictly validated.
   * @param source  - Initial document data which comes from a trusted source.
   * @param context - Model construction context
   * @remarks Returns `new this()` so needs an override per subclass:
   * ```ts
   * const mySchema = {
   *   // etc
   * }
   *d
   * type MySchema = typeof mySchema
   *
   * // most models likely wont be using this param at all, but its included for completeness
   * interface MyECO {
   *   someProp: string
   * }
   *
   * class MyDataModel extends DataModel<MySchema, DataModel.Any | null = null, MyECO> {
   *   static fromSource(
   *     source: foundry.data.fields.SchemaField.CreateData<MySchema>,
   *     context?: DataModel.FromSourceOptions<NewParent> & MyECO
   *   ): MyDataModel
   * }
   * ```
   */
  // context: not null (destructured)
  static fromSource(source: never, context?: DataModel.FromSourceOptions): DataModel.Any;

  /**
   * Create a DataModel instance using a provided serialized JSON string.
   * @param json - Serialized document data in string format
   * @returns A constructed data model instance
   * @remarks
   * Returns `new this()` so needs an override per subclass.
   *
   * ```ts
   * class MyDataModel extends ... {
   *   static fromJSON(json: string): MyDataModel
   * }
   * ```
   */
  static fromJSON(json: string): DataModel.Any;

  /**
   * Migrate candidate source data for this DataModel which may require initial cleaning or transformations.
   * @param source - The candidate source data from which the model will be constructed
   * @returns Migrated source data, if necessary
   */
  static migrateData(source: AnyMutableObject): AnyMutableObject;

  /**
   * Wrap data migration in a try/catch which attempts it safely
   * @param source - The candidate source data from which the model will be constructed
   * @returns Migrated source data, if necessary
   */
  static migrateDataSafe(source: AnyMutableObject): AnyMutableObject;

  /**
   * Take data which conforms to the current data schema and add backwards-compatible accessors to it in order to
   * support older code which uses this data.
   * @param data    - Data which matches the current schema
   * @param options - Additional shimming options
   * @returns Data with added backwards-compatible properties
   */
  // options: not null (destructured)
  static shimData(data: AnyMutableObject, options?: DataModel.ShimDataOptions): AnyMutableObject;
}

declare namespace DataModel {
  interface Any extends AnyDataModel {}
  interface AnyConstructor extends Identity<typeof AnyDataModel> {}

  type CreateData<Schema extends DataSchema> = fields.SchemaField.AssignmentData<Schema> | DataModel<Schema, any>;

  type ConstructorDataFor<ConcreteDataModel extends DataModel.Any> = CreateData<SchemaOf<ConcreteDataModel>>;

  // TODO(LukeAbby): Make optional only if `{}` is assignable to `AssignmentData`.
  type ConstructorArgs<
    Schema extends DataSchema,
    Parent extends DataModel.Any | null = null,
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    ExtraConstructorOptions extends AnyObject = {},
  > = [
    data?: DataModel.CreateData<Schema>,

    // Note(LukeAbby): `{ parent, strict, ...options }` (ie: not null (destructured))
    options?: DataModel.ConstructionContext<Parent> & ExtraConstructorOptions,
  ];

  /**
   * With the existence of custom module subtypes a system can no longer rely on their configured types being the only ones.
   *
   * `UnknownDataModel` covers the case where it's configured with a {@link DataModel | `DataModel`}.
   * Using a {@link TypeDataModel | `TypeDataModel`} is recommended by Foundry but a {@link DataModel | `DataModel`} is
   * always possible.
   * See {@link UnknownSystem | `UnknownSystem`} for other possibilities.
   */
  interface UnknownDataModel extends DataModel<any, any, any> {}

  /**
   * A helper type to extract the schema from a {@link DataModel | `DataModel`}.
   * @typeParam ModelType - the DataModel for the embedded data
   */
  type SchemaOf<ModelType extends DataModel.Any> = ModelType["schema"]["fields"];

  // Note(LukeAbby): This avoids writing `SchemaOf<InstanceType<ConcreteClass>>` to be robust to an issue with this snippet:
  // ```ts
  // EmbeddedDataField<typeof DataModel<{}>> extends SchemaField<infer SubSchema> ? SubSchema : never
  // ```
  type SchemaOfClass<ConcreteClass extends DataModel.AnyConstructor> = ConcreteClass extends abstract new (
    ...args: infer _1
  ) => { schema: { fields: infer Fields extends DataSchema } }
    ? Fields
    : never;

  /** @internal this is how 13.339 splits up the interfaces */
  type _ConstructionContext = Pick<ValidateOptions<DataSchema>, "strict" | "fallback" | "dropInvalidEmbedded">;

  interface ConstructionContext<Parent extends Any | null = Any | null> extends _ConstructionContext {
    /**
     * A parent DataModel instance to which this DataModel belongs
     * @defaultValue `null`
     */
    parent?: Parent | undefined;
  }

  interface CloneContext extends _ConstructionContext {
    /**
     * A parent DataModel instance to which this DataModel belongs
     * @defaultValue `this.parent`
     * @remarks The above default is only applied if this parameter is omitted entirely. Passing `parent: undefined` will
     * cause the returned DataModel's `parent` (*at runtime*) to be `null`, because it will override the spread-object
     * default of `this.parent`, and then the parameter default in `new DataModel()` (`null`) will apply.
     *
     * **NOTE:** At the type level, the returned model will necessarily have the same parent as the instance `#clone()` is being called
     * on; Accurate typing of `#parent` requires a cast.
     */
    parent?: Any | null | undefined;
  }

  /**
   * @internal
   * Updated to 13.339 wording, still accurate for v12
   */
  type _ValidateOptions<Schema extends DataSchema> = NullishProps<{
    /**
     * Validate each individual field?
     * @defaultValue `true`
     */
    fields: boolean;

    /**
     * Perform joint validation on the full data model?
     * Joint validation will be performed by default if no changes are passed.
     * Joint validation will be disabled by default if changes are passed.
     * Joint validation can be performed on a complete set of changes (for example, testing a complete data model) by explicitly passing true.
     * @remarks If nullish, defaults to `!changes`
     */
    joint: boolean;

    /**
     * A specific set of proposed changes to validate, rather than the full source data of the model.
     * @remarks If not passed or nullish, `validate` will operate on `this._source` instead
     */
    changes: fields.SchemaField.AssignmentData<Schema>;

    /**
     * If changes are provided, attempt to clean the changes before validating them?
     * @defaultValue `false`
     * @remarks Only has any effect if a `changes` has been passed with it
     */
    clean: boolean;

    /**
     * Throw an error if validation fails.
     * @defaultValue `true`
     */
    strict: boolean;

    /**
     * Allow replacement of invalid values with valid defaults? This option mutates the provided changes.
     * @defaultValue `false`
     * @see {@link DataField.ValidateOptions.fallback | `DataField.DataValidationOptions.fallback`}
     */
    fallback: boolean;

    // Foundry describes a `partial` property here, but nothing in DataModel actually *takes* such; `#validate`
    // generates a value for `partial` from the state of `changes` and `joint` before passing it on to either
    // `DataModel.cleanData` or `SchemaField#validate`, both of which do have uses for that property downstream
    // (in `SchemaField#_cleanType` and `#_validateType`). This is a documentation error in v12, fixed in v13.

    /**
     * If true, invalid embedded documents will emit a warning and be placed in the invalidDocuments collection rather
     * than causing the parent to be considered invalid. This option mutates the provided changes.
     * @defaultValue `false`
     * @see {@link DataField.ValidateOptions.dropInvalidEmbedded | `DataField.DataValidationOptions.dropInvalidEmbedded`}
     */
    dropInvalidEmbedded: boolean;
  }>;

  interface ValidateOptions<Schema extends DataSchema> extends _ValidateOptions<Schema> {}

  /**
   * @deprecated Use {@link DataModel.ConstructionContext | `DataModel.ConstructionContext`} for `new`/`#clone()`/`.create()`,
   * {@link DataModel.ValidateOptions | `DataModel.ValidateOptions`} for `#validate()`
   */
  interface DataValidationOptions<Parent extends Any | null = Any | null> extends ConstructionContext<Parent> {}

  /** `DataModel#constructor` pulls `parent` out of the passed `ConstructionContext` before forwarding to `#_initializeSource` */
  interface InitializeSourceOptions extends _ConstructionContext {}

  /** `DataModel#constructor` pulls `parent` and `strict` out of the passed `ConstructionContext` before forwarding to `#_configure` */
  interface ConfigureOptions extends Omit<_ConstructionContext, "strict"> {}

  /** `DataModel#constructor` pulls `parent` out of the passed `ConstructionContext` before forwarding to `#_initialize` */
  interface InitializeOptions extends _ConstructionContext {}

  type _UpdateOptions = NullishProps<{
    /** Do not finally apply the change, but instead simulate the update workflow  */
    dryRun: boolean;

    /**
     * Allow automatic fallback to a valid initial value if the value provided for a field
     * in the model is invalid.
     */
    fallback: boolean;

    /** Apply changes to inner objects recursively rather than replacing the top-level object */
    recursive: boolean;

    /** An advanced option used specifically and internally by the ActorDelta model */
    restoreDelta: boolean;
  }>;

  interface UpdateOptions extends _UpdateOptions {}

  /**
   * Not actually sure the Readonly is accurate, or that there's any meaningful difference
   * as far as our types can tell between the two possible returns
   */
  type ToObject<Schema extends DataSchema, Source extends boolean | undefined | null = true> = Source extends
    | true
    | undefined
    ? Readonly<SchemaField.SourceData<Schema>>
    : SchemaField.SourceData<Schema>;

  /**
   * @internal
   * Only necessary to change the default value of `strict`
   */
  type _FromSourceOptions = NullishProps<{
    /**
     * Models created from trusted source data are validated non-strictly
     * @defaultValue `false`
     * @remarks The property description is describing why the default is `false` here,
     * rather than `true` in normal construction
     */
    strict: boolean;
  }>;

  /**
   * @remarks `.fromSource` could take and pass on a specific `Parent`, but this causes
   * inheritance issues and complicates subclass overriding
   */
  interface FromSourceOptions extends ConstructionContext {}

  /** @internal */
  type _ShimDataOptions = NullishProps<{
    /**
     * Apply shims to embedded models?
     * @defaultValue `true`
     */
    embedded: boolean;
  }>;

  interface ShimDataOptions extends _ShimDataOptions {}

  interface UpdateSourceOptions {
    dryRun?: boolean;
    fallback?: boolean;
    recursive?: boolean;
  }
}

// This uses `any` because `Schema` and `Parent` are invariant
declare abstract class AnyDataModel extends DataModel<DataSchema, any, AnyObject> {
  constructor(...args: never);
}

// Matches foundry exporting class as both default and non-default
export { DataModel };
