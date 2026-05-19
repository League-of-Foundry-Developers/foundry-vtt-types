import type { AnyObject, Identity, InexactPartial } from "#utils";
import type { DataField, SchemaField, DataSchema } from "#common/data/fields.d.mts";
import type { DataModelValidationFailure } from "#common/data/validation-failure.d.mts";

declare const DynamicClass: new <_Computed extends object>(...args: never) => _Computed;

// @ts-expect-error This is a workaround to allow for dynamic top level properties in a class.
declare class _InternalDataModel<
  out Schema extends DataSchema,
  // Do not inline. Being a type parameter is an important part of the circumvention of TypeScript's detection of dynamic classes.
  out _Computed extends object = SchemaField.InitializedData<Schema>,
> extends DynamicClass<_Computed> {}

export default DataModel;

/**
 * An abstract class which is a fundamental building block of numerous structures and concepts in Foundry Virtual
 * Tabletop. Data models perform several essential roles:
 *
 * - A static schema definition that all instances of that model adhere to.
 * - A workflow for data migration, cleaning, validation, and initialization such that provided input data is structured
 *   according to the rules of the model's declared schema.
 * - A workflow for transacting differential updates to the instance data and serializing its data into format suitable
 *   for storage or transport.
 *
 * `DataModel` subclasses can be used for a wide variety of purposes ranging from simple game settings to high complexity
 * objects like `Scene` documents. Data models are often nested; see the {@linkcode DataModel.parent | DataModel#parent} property for more.
 *
 * @remarks List of methods and types that subclasses may want to override beyond the
 * required {@linkcode DataModel.defineSchema} to get narrower types:
 * - {@linkcode DataModel.schema}
 * - {@linkcode DataModel.cleanData}
 * - {@linkcode DataModel._initializeSource | DataModel#_initializeSource}
 * - {@linkcode DataModel.clone | DataModel#clone}
 * - {@linkcode DataModel.validateJoint}
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
   * @param data    - Initial data used to construct the data object. The provided object will be owned by the
   * constructed model instance and may be mutated.
   * @param options - Options which affect `DataModel` construction
   * @remarks Passing arbitrary non-object values to the `constructor -> #_initializeSource -> .migrateData` chain is not supported
   * by FVTT-Types at this time. If you need this for your project, come talk to us on the project discord.
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
  protected _configure(options?: DataModel.ConfigureOptions<ExtraConstructorOptions>): void;

  /**
   * The source data object for this `DataModel` instance.
   * Once constructed, the source object is sealed such that no keys may be added nor removed.
   * @remarks Defined in the class body, but overwritten during construction by `defineProperty` with
   * `{ writeable: false, enumerable: false }` options and the value being the return of
   * {@linkcode DataModel._initializeSource | #_initializeSource}.
   */
  readonly _source: SchemaField.SourceData<Schema>;

  /**
   * The defined and cached Data Schema for all instances of this DataModel.
   * @internal
   * @remarks Only `undefined` until the first time {@linkcode DataModel.schema} is accessed.
   */
  static _schema: SchemaField.Any | undefined;

  /**
   * An immutable reverse-reference to a parent `DataModel` to which this model belongs.
   * @remarks Defined in the class body, but overwritten during construction by `defineProperty` with
   * `{ writeable: false, enumerable: false }` options.
   */
  readonly parent: Parent;

  /**
   * Define the data schema for models of this type.
   * The schema is populated the first time it is accessed and cached for future reuse.
   *
   * The schema, through its fields, provide the essential cleaning, validation, and initialization methods to turn the
   * {@linkcode _source} values into direct properties of the data model. The schema is a static property of the model and
   * is reused by all instances to perform validation.
   *
   * The schemas defined by the core software in classes like {@linkcode foundry.documents.BaseActor} are validated by the
   * server, where user code does not run. However, almost all documents have a `flags` field to store data, and many
   * have a `system` field that can be configured to be a {@linkcode foundry.abstract.TypeDataModel} instance. Those models
   * are *not* constructed on the server and rely purely on client-side code, which means certain extra-sensitive fields
   * must be also be registered through your package manifest.
   * {@linkcode foundry.packages.AdditionalTypesField.ServerSanitizationFields | ServerSanitizationFields}
   *
   * @example
   * ```js
   * class SomeModel extends foundry.abstract.DataModel {
   *   static defineSchema() {
   *     return {
   *       foo: new foundry.data.fields.StringField()
   *     }
   *   }
   * }
   *
   * class AnotherModel extends SomeModel {
   *   static defineSchema() {
   *     // Inheritance and object oriented principles apply to schema definition
   *     const schema = super.defineSchema()
   *
   *     schema.bar = new foundry.data.fields.NumberField()
   *
   *     return schema;
   *   }
   * }
   * ```
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
  get schema(): SchemaField<Schema>;

  /**
   * Is the current state of this `DataModel` invalid?
   * The model is invalid if there is any unresolved failure.
   */
  get invalid(): boolean;

  /**
   * An array of validation failure instances which may have occurred when this instance was last validated.
   */
  get validationFailures(): DataModel.ValidationFailures;

  /**
   * A set of localization prefix paths which are used by this DataModel. This provides an alternative to defining the
   * `label` and `hint` property of each field by having foundry map the labels to a structure inside the path
   * provided by the prefix.
   *
   * @example
   * JavaScript class definition and localization call.
   * ```js
   * class MyDataModel extends foundry.abstract.DataModel {
   *   static defineSchema() {
   *     return {
   *       foo: new foundry.data.fields.StringField(),
   *       bar: new foundry.data.fields.NumberField()
   *     };
   *   }
   *   static LOCALIZATION_PREFIXES = ["MYMODULE.MYDATAMODEL"];
   * }
   *
   * Hooks.on("i18nInit", () => {
   *   // Foundry will attempt to automatically localize models registered for a document subtype, so this step is only
   *   // needed for other data model usage, e.g. for a Setting.
   *   Localization.localizeDataModel(MyDataModel);
   * });
   * ```
   *
   * JSON localization file
   * ```json
   * {
   *   "MYMODULE": {
   *     "MYDATAMODEL": {
   *       "FIELDS" : {
   *         "foo": {
   *           "label": "Foo",
   *           "hint": "Instructions for foo"
   *         },
   *         "bar": {
   *           "label": "Bar",
   *           "hint": "Instructions for bar"
   *         }
   *       }
   *     }
   *   }
   * }
   * ```
   */
  static LOCALIZATION_PREFIXES: string[];

  /**
   * Initialize the source data for a new `DataModel` instance.
   * One-time migrations and initial cleaning operations are applied to the source data.
   * @param data    - The candidate source data from which the model will be constructed
   * @param options - Options provided to the model constructor
   *                  (unused)
   * @returns Migrated and cleaned source data which will be stored to the model instance
   * @remarks `options` is unused in `DataModel`
   */
  protected _initializeSource(
    data: SchemaField.CreateData<Schema> | this,
    options?: DataModel.InitializeSourceOptions<ExtraConstructorOptions>,
  ): SchemaField.SourceData<Schema>;

  /**
   * Clean a data source object to conform to a specific provided schema.
   * @param source  - The source data object
   * @param options - Additional options which are passed to field cleaning methods
   * @returns The cleaned source data, which is the same object as the `source` argument
   * @privateRemarks `object` is used because {@linkcode CreateData} isn't assignable to {@linkcode AnyMutableObject}, which would otherwise
   * be used here for both
   */
  static cleanData(source?: object, options?: DataField.CleanOptions): object;

  /**
   * A generator that orders the DataFields in the DataSchema into an expected initialization order.
   * @yields {@linkcode DataField}
   */
  protected static _initializationOrder(): Generator<[string, DataField.Any], void, undefined>;

  /**
   * Initialize the instance by copying data from the source object to instance attributes.
   * This mirrors the workflow of SchemaField#initialize but with some added functionality.
   * @param options - Options provided to the model constructor
   * @remarks `options` gets passed on to each field in the schema's `#initialize`
   */
  protected _initialize(options?: DataModel.InitializeOptions<ExtraConstructorOptions>): void;

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
   * @privateRemarks Foundry types `context` as simply `object`, but going by core usage, it's a {@linkcode DataModel.ConstructionContext}.
   *
   * Both the implementation here and the override in `Document` provide `this.parent` to the construction context; Here, `context` is
   * spread in, so providing a different parent is allowed. The `Document` override enforces `this.parent` with no opportunity to pass
   * an alternative.
   */
  // Note(LukeAbby): This is really like `DeepPartial<SchemaField.UpdateData<Schema>>`.
  // However the difference is subtle enough that it's unlikely to come into play in common usage.
  clone(data?: SchemaField.UpdateData<Schema>, context?: DataModel.CloneContext<ExtraConstructorOptions>): this;

  /**
   * Validate the data contained in the document to check for type and content
   * This function throws an error if data within the document is not valid
   *
   * @param options - Optional parameters which customize how validation occurs.
   * @returns An indicator for whether the document contains valid data
   */
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
   * Update the `DataModel` locally by applying an object of changes to its source data.
   * The provided changes are cleaned, validated, and stored to the source data object for this model.
   * The source data is then re-initialized to apply those changes to the prepared data.
   * The method returns an object of differential changes which modified the original data.
   *
   * @param changes - New values which should be applied to the data model
   * @param options - Options which determine how the new data is merged
   * @returns An object containing the changed keys and values
   */
  // TODO: This should allow dotkeys to be passed
  // TODO: Without widening changes and the return type, the ActorDelta override is impossible to make correct
  // changes, options: not null (parameter default only)
  updateSource(
    changes?: SchemaField.UpdateData<Schema>,
    options?: DataModel.UpdateOptions,
  ): SchemaField.UpdateData<Schema>;

  /**
   * Copy and transform the `DataModel` into a plain object.
   * Draw the values of the extracted object from the data source (by default) otherwise from its transformed values.
   * @param source - Draw values from the underlying data source rather than transformed values (default: `true`)
   * @returns The extracted primitive object
   */
  toObject(source?: boolean | null): SchemaField.SourceData<Schema>;

  /**
   * Extract the source data for the `DataModel` into a simple object format that can be serialized.
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
   * // most models likely wont be using this param at all, but its included for completeness
   * interface MyExtraConstructorOptions {
   *   someProp: string
   * }
   *
   * class MyDataModel extends DataModel<MySchema, DataModel.Any | null, MyExtraConstructorOptions> {
   *   static fromSource(
   *     source: foundry.data.SchemaField.CreateData<MySchema>,
   *     context?: DataModel.FromSourceOptions<NewParent> & MyExtraConstructorOptions
   *   ): MyDataModel
   * }
   * ```
   */
  static fromSource(source: never, context?: DataModel.FromSourceOptions): DataModel.Any;

  /**
   * Create a `DataModel` instance using a provided serialized JSON string.
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
   * Migrate candidate source data for this `DataModel` which may require initial cleaning or transformations.
   * @param source - The candidate source data from which the model will be constructed
   * @returns Migrated source data, if necessary
   */
  static migrateData(source: object): object;

  /**
   * Wrap data migration in a try/catch which attempts it safely
   * @param source - The candidate source data from which the model will be constructed
   * @returns Migrated source data, if necessary
   */
  static migrateDataSafe(source: object): object;

  /**
   * Take data which conforms to the current data schema and add backwards-compatible accessors to it in order to
   * support older code which uses this data.
   * @param data    - Data which matches the current schema
   * @param options - Additional shimming options
   * @returns Data with added backwards-compatible properties
   */
  static shimData(data: object, options?: DataModel.ShimDataOptions): object;
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
  type CreateData<Schema extends DataSchema> = SchemaField.CreateData<Schema>;

  /**
   * If `CreateData` has no required fields, makes the first argument (`data`) optional.
   */
  type ConstructorArgs<
    Schema extends DataSchema,
    Parent extends DataModel.Any | null = null,
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    ExtraConstructorOptions extends object = {},
  > =
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    {} extends DataModel.CreateData<Schema>
      ? [
          data?: DataModel.CreateData<Schema>,

          // Note(LukeAbby): `{ parent, strict, ...options }`
          options?: DataModel.ConstructionContext<Parent, ExtraConstructorOptions>,
        ]
      : [
          data: DataModel.CreateData<Schema>,

          // Note(LukeAbby): `{ parent, strict, ...options }`
          options?: DataModel.ConstructionContext<Parent, ExtraConstructorOptions>,
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
   * @template ModelType - the `DataModel` for the embedded data
   */
  type SchemaOf<ModelType extends DataModel.Any> = ModelType["schema"]["fields"];

  /**
   * @privateRemarks Note(LukeAbby): This avoids writing `SchemaOf<InstanceType<ConcreteClass>>` to be robust to an issue with this snippet:
   * ```ts
   * EmbeddedDataField<typeof DataModel<{}>> extends SchemaField<infer SubSchema> ? SubSchema : never
   * ```
   */
  type SchemaOfClass<ConcreteClass extends DataModel.AnyConstructor> = ReturnType<ConcreteClass["defineSchema"]>;

  /**
   * {@linkcode ValidateOptions} has already had `InexactPartial` applied, so this inherits that optionality/nullishness.
   * @internal
   */
  type _ConstructionContext<
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    ExtraConstructionOptions extends object = {},
  > = Pick<ValidateOptions<DataSchema>, "strict" | "fallback" | "dropInvalidEmbedded"> & ExtraConstructionOptions;

  type ConstructionContext<
    Parent extends DataModel.Any | null = DataModel.Any | null,
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    ExtraConstructionOptions extends object = {},
  > = _ConstructionContext<ExtraConstructionOptions> & {
    /**
     * A parent `DataModel` instance to which this `DataModel` belongs
     * @defaultValue `null`
     */
    parent?: Parent | undefined;
  };

  type CloneContext<
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    ExtraConstructionOptions extends object = {},
  > = _ConstructionContext<ExtraConstructionOptions> & {
    /**
     * A parent `DataModel` instance to which this `DataModel` belongs
     * @defaultValue `this.parent`
     * @remarks The above default is only applied if this parameter is omitted entirely. Passing `parent: undefined` will
     * cause the returned DataModel's `parent` (*at runtime*) to be `null`, because it will override the spread-object
     * default of `this.parent`, and then the parameter default in `new DataModel()` (`null`) will apply.
     *
     * **NOTE:** At the type level, the returned model will necessarily have the same parent as the instance `#clone()` is being called
     * on; Accurate typing of `#parent` requires a cast.
     */
    parent?: DataModel.Any | null | undefined;
  };

  /** @internal */
  interface _ValidateOptions<Schema extends DataSchema> {
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
    changes: SchemaField.UpdateData<Schema>;

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
     * @see {@linkcode DataField.ValidateOptions.fallback}
     */
    fallback: boolean;

    /**
     * If true, invalid embedded documents will emit a warning and be placed in the invalidDocuments collection rather
     * than causing the parent to be considered invalid. This option mutates the provided changes.
     * @defaultValue `false`
     * @see {@linkcode DataField.ValidateOptions.dropInvalidEmbedded}
     */
    dropInvalidEmbedded: boolean;
  }

  interface ValidateOptions<Schema extends DataSchema> extends InexactPartial<_ValidateOptions<Schema>> {}

  /**
   * `DataModel#constructor` pulls `parent` out of the passed `ConstructionContext` before forwarding to
   * {@linkcode DataModel._initializeSource | #_initializeSource}.
   */
  type InitializeSourceOptions<
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    ExtraConstructionOptions extends object = {},
  > = _ConstructionContext<ExtraConstructionOptions>;

  /**
   * `DataModel#constructor` pulls `parent` and `strict` out of the passed `ConstructionContext` before forwarding to
   * {@linkcode DataModel._configure | #_configure}.
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  type ConfigureOptions<ExtraConstructionOptions extends object = {}> = Omit<_ConstructionContext, "strict"> &
    ExtraConstructionOptions;

  /**
   * `DataModel#constructor` pulls `parent` out of the passed `ConstructionContext` before forwarding to
   * {@linkcode DataModel._initialize #_initialize}.
   */
  type InitializeOptions<
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    ExtraConstructionOptions extends object = {},
  > = _ConstructionContext<ExtraConstructionOptions>;

  /** @internal */
  interface _UpdateOptions {
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
     * @remarks No actual default is applied to this property anywhere in Foundry code, but behaviour depending on this option uses  `=== false`
     * checks, so it effectively is `true` by default
     */
    recursive: boolean;

    /** An advanced option used specifically and internally by the ActorDelta model */
    restoreDelta: boolean;
  }

  interface UpdateOptions extends InexactPartial<_UpdateOptions> {}

  /**
   * Only necessary to change the default value of `strict`
   * @internal
   */
  interface _FromSourceOptions {
    /**
     * Models created from trusted source data are validated non-strictly
     * @defaultValue `false`
     * @remarks The property description is describing why the default is `false` here,
     * rather than `true` in normal construction
     */
    strict: boolean;
  }

  /**
   * @remarks `.fromSource` could take and pass on a specific `Parent`, but this causes
   * inheritance issues and complicates subclass overriding
   */
  interface FromSourceOptions extends Omit<ConstructionContext, "strict">, InexactPartial<_FromSourceOptions> {}

  /** @internal */
  interface _ShimDataOptions {
    /**
     * Apply shims to embedded models?
     * @defaultValue `true`
     */
    embedded: boolean;
  }

  interface ShimDataOptions extends InexactPartial<_ShimDataOptions> {}

  interface ValidationFailures {
    fields: DataModelValidationFailure | null;
    joint: DataModelValidationFailure | null;
  }

  /**
   * @deprecated Replaced by {@linkcode DataModel.CreateData}
   */
  type ConstructorDataFor<ConcreteDataModel extends DataModel.Any> = CreateData<SchemaOf<ConcreteDataModel>>;
}

// This uses `any` because `Schema` and `Parent` are invariant
declare abstract class AnyDataModel extends DataModel<DataSchema, any, AnyObject> {
  constructor(...args: never);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-object-type
declare class ConcreteDataModel extends DataModel<DataSchema, DataModel.Any | null, {}> {}

// Matches foundry exporting class as both default and non-default
export { DataModel };
