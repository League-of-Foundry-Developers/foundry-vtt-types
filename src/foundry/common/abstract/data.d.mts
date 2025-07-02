import type { AnyMutableObject, EmptyObject, Identity, InexactPartial, NullishProps } from "#utils";
import type { DataField, SchemaField } from "../data/fields.d.mts";
import type { fields } from "../data/_module.d.mts";
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
 * @privateRemarks List of methods and types that subclasses may want to override beyond the required {@linkcode DataModel.defineSchema} to get narrower types
 * (check each for notes and caveats):
 * - {@linkcode DataModel.schema}
 * - {@linkcode DataModel.cleanData}
 * - {@linkcode DataModel.validateJoint}
 * - {@linkcode DataModel.updateSource | DataModel#updateSource}
 * - {@linkcode DataModel.fromSource}
 * - {@linkcode DataModel.fromJSON}
 * - {@linkcode DataModel.migrateData}
 * - {@linkcode DataModel.shimData}
 */
declare abstract class DataModel<
  Schema extends DataSchema,
  Parent extends DataModel.Any | null = null,
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  ExtraConstructorOptions extends object = {},
> extends _InternalDataModel<Schema> {
  /**
   * @param data    - Initial data used to construct the data object. The provided object will be owned by the constructed model instance and may be mutated.
   * @param options - Options which affect DataModel construction
   * @remarks Passing arbitrary non-object values to the `constructor -> #_initializeSource -> .migrateData` chain is not supported
   * by FVTT-Types at this time. If you need this for your project, come talk to us {@link https://discord.gg/52DNPzqm2Z | on Discord}
   */
  constructor(...args: DataModel.ConstructorArgs<Schema, Parent, ExtraConstructorOptions>);

  /** @internal */
  " __fvtt_types_internal_schema": Schema;

  /** @internal */
  " __fvtt_types_internal_source_data": SchemaField.SourceData<Schema>;

  /** @internal */
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  " __fvtt_types_internal_assignment_data": SchemaField.AssignmentData<Schema>;

  /** @internal */
  " __fvtt_types_internal_initialized_data": SchemaField.InitializedData<Schema>;

  /**
   * Configure the data model instance before validation and initialization workflows are performed.
   * @param options - Additional options modifying the configuration
   */
  protected _configure(options?: DataModel.ConfigureOptions & ExtraConstructorOptions): void;

  /**
   * The source data object for this `DataModel` instance.
   * Once constructed, the source object is sealed such that no keys may be added nor removed.
   * @remarks `defineProperty`'d with `writable: false, enumerable: false`, then {@link Object.seal | sealed}
   */
  readonly _source: fields.SchemaField.SourceData<Schema>;

  /**
   * The defined and cached Data Schema for all instances of this `DataModel`.
   * @remarks `undefined` prior to the first time this class's {@linkcode DataModel.schema | static get schema()} is accessed,
   * at which point it's `defineProperty`'d with `writable: false`
   * @internal
   */
  protected static _schema: SchemaField.Any | undefined;

  /**
   * An immutable reverse-reference to a parent `DataModel` to which this model belongs.
   */
  readonly parent: Parent;

  /**
   * Define the data schema for documents of this type.
   * The schema is populated the first time it is accessed and cached for future reuse.
   * @abstract
   * @remarks The returned value MUST be kept up to sync with the `Schema` type parameter.
   */
  static defineSchema(): DataSchema;

  /**
   * Define the data schema for documents of this type.
   * @remarks To override, copy {@link DataModel#schema}, providing your schema directly instead of the type param
   */
  static get schema(): SchemaField.Any;

  /**
   * Define the data schema for this document instance.
   * @remarks `EmptyObject` because {@linkcode DataModel.schema} initializes this with no options passed
   */
  get schema(): SchemaField<Schema, EmptyObject>;

  /**
   * Is the current state of this `DataModel` invalid?
   * The model is invalid if there is any unresolved failure.
   */
  get invalid(): boolean;

  /**
   * An array of validation failure instances which may have occurred when this instance was last validated.
   * @remarks Returns a {@link Object.seal | sealed} private property
   */
  get validationFailures(): DataModel.ValidationFailures;

  /**
   * A set of localization prefix paths which are used by this DataModel.
   * @defaultValue `[]`
   */
  static LOCALIZATION_PREFIXES: string[];

  /**
   * Initialize the source data for a new DataModel instance.
   * One-time migrations and initial cleaning operations are applied to the source data.
   * @param data    - The candidate source data from which the model will be constructed
   * @param options - Options provided to the model constructor
   * @returns Migrated and cleaned source data which will be stored to the model instance,
   * which is the same object as the `data` argument
   * @remarks `options` is unused in `DataModel`
   *
   * Passing arbitrary non-object values to the `constructor -> #_initializeSource -> .migrateData` chain is not supported
   * by FVTT-Types at this time. If you need this for your project, come talk to us {@link https://discord.gg/52DNPzqm2Z | on Discord}
   */
  protected _initializeSource(
    data: fields.SchemaField.CreateData<Schema> | this,
    options?: DataModel.InitializeSourceOptions & ExtraConstructorOptions,
  ): fields.SchemaField.SourceData<Schema>;

  /**
   * Clean a data source object to conform to a specific provided schema.
   * @param source  - The source data object
   * @param options - Additional options which are passed to field cleaning methods
   * @returns The cleaned source data, which is the same object as the `source` argument
   * @remarks Passes `source` and `options` on to {@linkcode SchemaField.clean | this.schema.clean}, and since the model's root `SchemaField`
   * is always constructed with no specified options, the default options will prevent `| null | undefined`
   *
   * Overriding notes: Typing `source` as the {@linkcode SchemaField.UpdateData} and the return as the {@linkcode SchemaField.SourceData} for your
   * schema should be fine.
   */
  static cleanData(source?: AnyMutableObject, options?: DataField.CleanOptions): AnyMutableObject;

  /**
   * A generator that orders the {@linkcode DataField}s in the DataSchema into an expected initialization order.
   */
  protected static _initializationOrder(): Generator<[string, DataField.Any], void, undefined>;

  /**
   * Initialize the instance by copying data from the source object to instance attributes.
   * This mirrors the workflow of {@linkcode SchemaField.initialize | SchemaField#initialize} but with some added functionality.
   * @param options - Options provided to the model constructor
   * @remarks `options` gets passed on to each field in the schema's `#initialize`
   */
  protected _initialize(options?: DataModel.InitializeOptions & ExtraConstructorOptions): void;

  /**
   * Reset the state of this data instance back to mirror the contained source data, erasing any changes.
   */
  reset(): void;

  /**
   * Clone a model, creating a new data model by combining current data with provided overrides.
   * @param data    - Additional data which overrides current document data at the time of creation
   * @param context - Context options passed to the data model constructor
   * @returns The cloned instance
   * @remarks
   * **NOTE:** At the type level, the returned model will necessarily have the same parent as the instance `#clone()` is being called
   * on, which is accurate to runtime if no `parent` is passed; Accurate typing of `#parent` requires a cast, if you are passing a
   * different parent.
   * @privateRemarks Both the implementation here and the override in `Document` provide `this.parent` to the construction context;
   * Here, `context` is spread in, so providing a different parent is allowed. The `Document` override enforces `this.parent` with no
   * opportunity to pass an alternative.
   */
  // Note(LukeAbby): This is really like `DeepPartial<fields.SchemaField.UpdateData<Schema>>`.
  // However the difference is subtle enough that it's unlikely to come into play in common usage.
  clone(data?: fields.SchemaField.UpdateData<Schema>, context?: DataModel.CloneContext & ExtraConstructorOptions): this;

  /**
   * Validate the data contained in the document to check for type and content
   * This function throws an error if data within the document is not valid
   *
   * @param options - Optional parameters which customize how validation occurs.
   * @returns Whether the data source or proposed change is reported as valid. A boolean is always returned if validation is non-strict.
   * @throws An error thrown if validation is strict and a failure occurs.
   * @remarks The ominous `@returns` just means the only returns are `boolean`, it just might throw first; no hidden return types
   */
  validate(options?: DataModel.ValidateOptions<Schema>): boolean;

  /**
   * Evaluate joint validation rules which apply validation conditions across multiple fields of the model.
   * Field-specific validation rules should be defined as part of the DataSchema for the model.
   * This method allows for testing aggregate rules which impose requirements on the overall model.
   * @param data - Candidate data for the model
   * @throws An error if a validation failure is detected
   * @remarks Effectively abstract in `DataModel`. Subclasses implementing should type `data` as the {@linkcode SchemaField.SourceData} of
   * their schema.
   */
  static validateJoint(data: never): void;

  /**
   * Update the DataModel locally by applying an object of changes to its source data.
   * - The provided changes are expanded, cleaned, validated, and stored to the source data object for this model.
   * - The provided changes argument is mutated in this process.
   * - The source data is then re-initialized to apply those changes to the prepared data.
   * - The method returns an object of differential changes which modified the original data.
   *
   * @param changes - New values which should be applied to the data model
   * @param options - Options which determine how the new data is merged
   * @returns An object containing differential keys and values that were changed
   * @throws An error if the requested data model changes were invalid
   */
  // TODO: This should allow dotkeys to be passed
  // TODO: Without widening changes and the return type, the ActorDelta override is impossible to make correct
  updateSource(
    changes?: fields.SchemaField.UpdateData<Schema>,
    options?: DataModel.UpdateOptions,
  ): fields.SchemaField.UpdateData<Schema>;

  /**
   * Copy and transform the `DataModel` into a plain object.
   * Draw the values of the extracted object from the data source (by default) otherwise from its transformed values.
   * @param source - Draw values from the underlying data source rather than transformed values (default: `true`)
   * @returns The extracted primitive object
   */
  toObject(source?: boolean): SchemaField.SourceData<Schema>;

  /**
   * Extract the source data for the `DataModel `into a simple object format that can be serialized.
   * @returns The document source data expressed as a plain object
   */
  toJSON(): SchemaField.SourceData<Schema>;

  /**
   * Create a new instance of this `DataModel` from a source record.
   * The source is presumed to be trustworthy and is not strictly validated.
   * @param source  - Initial document data which comes from a trusted source.
   * @param context - Model construction context
   * @remarks Returns `new this()` so needs an override per subclass:
   * ```ts
   * const mySchema = {
   *   // etc
   * }
   *
   * type MySchema = typeof mySchema
   *
   * // most models likely wont be using this param at all, but it's included in this example for completeness
   * interface MyExtraConstructorOptions {
   *   someProp: string
   * }
   *
   * class MyDataModel<Parent extends DataModel.Any | null = DataModel.Any | null> extends DataModel<MySchema, Parent, MyExtraConstructorOptions> {
   *   static fromSource(
   *     source: foundry.data.fields.SchemaField.CreateData<MySchema>,
   *     context?: DataModel.FromSourceOptions<NewParent> & MyExtraConstructorOptions
   *   ): MyDataModel<NewParent>
   * }
   * ```
   *
   * Overriding notes: {@linkcode DataModel.FromSourceOptions} *can* take a
   */
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
   * @remarks As of v13 this is no longer guaranteed to be passed an object by design, to support migration of radically bad data,
   * however passing arbitrary non-object values to the `constructor -> #_initializeSource -> .migrateData` chain is not supported
   * by FVTT-Types at this time. If you need this for your project, come talk to us {@link https://discord.gg/52DNPzqm2Z | on Discord}
   *
   * Overriding notes: Typing `source` as `CreateData` and return as `SourceData` should be accurate. See `ExampleModel` and
   * `ExampleModelParent` in `fvtt-types/tests/foundry/common/abstract/data.test-d.ts`.
   */
  static migrateData(source: AnyMutableObject): AnyMutableObject;

  /**
   * Wrap data migration in a try/catch which attempts it safely
   * @param source - The candidate source data from which the model will be constructed
   * @returns Migrated source data, if necessary
   * @remarks As of v13 this is no longer guaranteed to be passed an object by design, to support migration of radically bad data,
   * however passing arbitrary non-object values to the `constructor -> #_initializeSource -> .migrateData` chain is not supported
   * by FVTT-Types at this time. If you need this for your project, come talk to us {@link https://discord.gg/52DNPzqm2Z | on Discord}
   *
   * Overriding notes: Generally not worth overriding; Input and return types must be identical as, if {@linkcode migrateData}
   * throws, `source` is just passed through.
   */
  static migrateDataSafe(source: AnyMutableObject): AnyMutableObject;

  /**
   * Take data which conforms to the current data schema and add backwards-compatible accessors to it in order to
   * support older code which uses this data.
   * @param data    - Data which matches the current schema
   * @param options - Additional shimming options
   * @returns Data with added backwards-compatible properties
   * @remarks Overriding notes: Typing both `data` and the return as the {@linkcode SchemaField.SourceData} should be
   * accurate, with returning a custom type including your/known shims (if any) as a possibly unnecessary improvement.
   */
  static shimData(data: AnyMutableObject, options?: DataModel.ShimDataOptions): AnyMutableObject;

  #DataModel: true;
}

declare namespace DataModel {
  interface Any extends AnyDataModel {}
  interface AnyConstructor extends Identity<typeof AnyDataModel> {}

  /**
   * This type is similar to `typeof DataModel` but isn't abstract.
   * This is useful for code that does `new someDataModel(...)`.
   */
  interface ConcreteConstructor extends Identity<typeof ConcreteDataModel> {}

  // TODO(LukeAbby): see if `| DataModel<Schema, any>` needs to be added back.
  // Seems rare in practice and causes terrible errors. May not need to be added back if `DataModel`.
  // is always assignable.
  type CreateData<Schema extends DataSchema> = fields.SchemaField.CreateData<Schema>;

  // TODO(LukeAbby): Make optional only if `{}` is assignable to `CreateData`.
  type ConstructorArgs<
    Schema extends DataSchema,
    Parent extends DataModel.Any | null = null,
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    ExtraConstructorOptions extends object = {},
  > = [
    data?: DataModel.CreateData<Schema>,

    // Note(LukeAbby): `{ parent, strict, ...options }`
    options?: DataModel.ConstructionContext<Parent> & ExtraConstructorOptions,
  ];

  /**
   * With the existence of custom module subtypes a system can no longer rely on their configured types being the only ones.
   *
   * `UnknownDataModel` covers the case where it's configured with a {@linkcode DataModel}.
   * Using a {@linkcode TypeDataModel} is recommended by Foundry but a {@linkcode DataModel} is
   * always possible.
   * See {@linkcode UnknownSystem} for other possibilities.
   */
  interface UnknownDataModel extends DataModel<any, any, any> {}

  /**
   * A helper type to extract the schema from a {@linkcode DataModel}.
   * @template ModelType - the DataModel for the embedded data
   */
  type SchemaOf<ModelType extends DataModel.Any> = ModelType["schema"]["fields"];

  // Note(LukeAbby): This avoids writing `SchemaOf<InstanceType<ConcreteClass>>` to be robust to an issue with this snippet:
  // ```ts
  // EmbeddedDataField<typeof DataModel<{}>> extends SchemaField<infer SubSchema> ? SubSchema : never
  // ```
  type SchemaOfClass<ConcreteClass extends DataModel.AnyConstructor> = ReturnType<ConcreteClass["defineSchema"]>;

  /**
   * The construction of this interface matches Foundry's; {@linkcode ValidateOptions} is the origin of these fields in their JSDoc
   * @internal
   */
  type _ConstructionContext = Pick<_ValidateOptions, "strict" | "fallback" | "dropInvalidEmbedded">;

  interface ConstructionContext<Parent extends Any | null = Any | null> extends _ConstructionContext {
    /**
     * A parent DataModel instance to which this DataModel belongs
     * @defaultValue `null`
     */
    parent?: Parent | undefined;
  }

  /**
   * @privateRemarks This is the return for {@linkcode DataModel.validationFailures | DataModel#validationFailures}, a getter that returns
   * a private property that's initialized to `Object.seal({fields: null, joint: null })`; fully non-extensible, so made a type.
   */
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  type ValidationFailures = {
    fields: DataModelValidationFailure | null;
    joint: DataModelValidationFailure | null;
  };

  interface CloneContext extends _ConstructionContext {
    /**
     * A parent DataModel instance to which this DataModel belongs
     * @defaultValue `this.parent`
     * @remarks The above default is only applied if this parameter is omitted entirely. Passing `parent: undefined` will
     * cause the returned DataModel's `parent` (*at runtime*) to be `null`, because it will override the spread-object
     * default of `this.parent`, and then the parameter default in `new DataModel()` (`null`) will apply.
     *
     * **NOTE:** At the type level, the returned model will necessarily have the same parent as the instance `#clone()` is being called
     * on, which is accurate to runtime if no `parent` is passed; Accurate typing of `#parent` requires a cast, if you are passing a
     * different parent.
     */
    parent?: Any | null | undefined;
  }

  /**
   * This is separated out just to not pass a pointless type param to the Pick in {@linkcode ConstructionContext}
   * @internal
   */
  type _ValidateOptionsChanges<Schema extends DataSchema> = InexactPartial<{
    /**
     * A specific set of proposed changes to validate, rather than the full source data of the model.
     * @remarks If not passed or nullish, `#validate` will operate on {@linkcode DataModel._source | this._source} instead
     */
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    changes: fields.SchemaField.AssignmentData<Schema>;
  }>;

  /** @internal */
  type _ValidateOptions = InexactPartial<{
    /**
     * Validate each individual field
     * @defaultValue `true`
     */
    fields: boolean;

    /**
     * Perform joint validation on the full data model?
     * - Joint validation will be performed by default if no changes are passed.
     * - Joint validation will be disabled by default if changes are passed.
     * - Joint validation can be performed on a complete set of changes (for example testing a complete data model) by explicitly passing true.
     * @remarks If nullish, defaults to `!changes`
     */
    joint: boolean;

    /**
     * If changes are provided, attempt to clean the changes before validating them? This option mutates the provided changes.
     * @defaultValue `false`
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
     * @remarks See {@linkcode DataField.ValidateOptions.fallback}
     */
    fallback: boolean;

    /**
     * If true, invalid embedded documents will emit a warning and be placed in the invalidDocuments collection rather
     * than causing the parent to be considered invalid. This option mutates the provided changes.
     * @defaultValue `false`
     * @remarks See {@linkcode DataField.ValidateOptions.dropInvalidEmbedded}
     */
    dropInvalidEmbedded: boolean;
  }>;

  interface ValidateOptions<Schema extends DataSchema> extends _ValidateOptions, _ValidateOptionsChanges<Schema> {}

  /** @remarks `DataModel#constructor` pulls `parent` out of the passed `ConstructionContext` before forwarding to `#_initializeSource` */
  interface InitializeSourceOptions extends _ConstructionContext {}

  /** @remarks `DataModel#constructor` pulls `parent` and `strict` out of the passed `ConstructionContext` before forwarding to `#_configure` */
  interface ConfigureOptions extends Omit<_ConstructionContext, "strict"> {}

  /** @remarks `DataModel#constructor` pulls `parent` out of the passed `ConstructionContext` before forwarding to `#_initialize` */
  interface InitializeOptions extends _ConstructionContext {}

  type _UpdateOptions = InexactPartial<{
    /** Do not finally apply the change, but instead simulate the update workflow  */
    dryRun: boolean;

    /**
     * Allow automatic fallback to a valid initial value if the value provided for a field
     * in the model is invalid.
     */
    fallback: boolean;

    /**
     * Apply changes to inner objects recursively rather than replacing the top-level object
     * @defaultValue `true`
     * @remarks Simple testing (`if (options.recursive)`) of this property is insufficient: no actual default is applied to this property,
     * and Foundry uses `!==` and `=== false` checks. The default of `true` is by effective behaviour only, but is how Foundry types the
     * property on their end.
     */
    recursive: boolean;

    /** An advanced option used specifically and internally by the ActorDelta model */
    restoreDelta: boolean;
  }>;

  interface UpdateOptions extends _UpdateOptions {}

  /**
   * Only necessary to change the default value of `strict`
   * @internal
   */
  type _FromSourceOptions = InexactPartial<{
    /**
     * Models created from trusted source data are validated non-strictly
     * @defaultValue `false`
     * @remarks The property description is describing why the default is `false` here,
     * rather than `true` in normal construction
     */
    strict: boolean;
  }>;

  /**
   * @privateRemarks {@linkcode DataModel.fromSource} could take and pass on a specific `parent`, but this causes
   * inheritance issues and complicates subclass overriding, so a default {@linkcode ConstructionContext} is extended
   */
  interface FromSourceOptions<Parent extends DataModel.Any | null = DataModel.Any | null>
    extends _FromSourceOptions,
      Omit<ConstructionContext<Parent>, "strict"> {}

  /** @internal */
  type _ShimDataOptions = NullishProps<{
    /**
     * Apply shims to embedded models?
     * @defaultValue `true`
     */
    embedded: boolean;
  }>;

  interface ShimDataOptions extends _ShimDataOptions {}

  /**
   * @deprecated Replaced by {@linkcode DataModel.CreateData}
   */
  type ConstructorDataFor<ConcreteDataModel extends DataModel.Any> = CreateData<SchemaOf<ConcreteDataModel>>;
}

// Matches foundry exporting class as both default and non-default
export { DataModel };

// This uses `any` because `Schema` and `Parent` are invariant
declare abstract class AnyDataModel extends DataModel<DataSchema, any, object> {
  constructor(...args: never);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-object-type
declare class ConcreteDataModel extends DataModel<DataSchema, DataModel.Any | null, {}> {}
