import { StructuralClass } from './../../../types/helperTypes.d';
import type { DataField, EmbeddedCollectionField } from '../data/fields.mjs';

declare namespace DataModel {
  export type ConstructorOptions = InexactPartial<{
    /**
     * A parent DataModel instance to which this DataModel belongs
     * (default: `null`)
     */
    parent: Any | null;

    /**
     * Control the strictness of validation for initially provided data
     * (default: `true`)
     */
    strict: boolean;
  }>;

  export type FormatValidationErrorsOptions = InexactPartial<{
    /** A prefix label that should prepend any error messages */
    label: string;

    /** A field namespace that should prepend key names with dot-notation */
    namespace: string;
  }>;

  export type CleanDataOptions = Partial<{
    /**
     * Allow partial cleaning of source data, ignoring absent fields
     * (default: `false`)
     */
    partial: boolean;
  }>;

  export type InitializeOptions = Record<string, never>;

  export type ValidateOptions<SourceData extends Record<string, unknown>> = InexactPartial<{
    /** A specific set of proposed changes to validate, rather than the full source data of the model. */
    changes: DeepPartial<SourceData>;

    /**
     * If changes are provided, attempt to clean the changes before validating them
     * (default: `false`)
     */
    clean: boolean;

    /**
     * Allow replacement of invalid values with valid defaults?
     * (default: `false`)
     */
    fallback: boolean;

    /**
     * Throw if an invalid value is encountered, otherwise log a warning?
     */
    strict: boolean;

    /**
     * Perform validation on individual fields?
     */
    fields: boolean;

    /**
     * Perform joint validation on the full data model?
     * Joint validation will be performed by default if no changes are passed.
     * Joint validation will be disabled by default if changes are passed.
     * Joint validation can be performed on a complete set of changes (for example testing a complete data model) by explicitly passing true.
     */
    joint?: boolean;
  }>;

  /** Includes `ConstructorData`. */
  export type FromSourceContext = {
    /**
     * Models created from trusted source data are validated non-strictly
     * (default: `false`)
     */
    strict?: boolean;
  } & Record<string, unknown>;

  export type UpdateSourceOptions = {
    /**
     * Allow replacement of invalid values with valid defaults?
     * (default: `false`)
     */
    fallback: boolean;
  };

  export type UpdateDataOptions = {
    _backup: Record<string, unknown>;
    _diff: Record<string, unknown>;
  } & UpdateFieldOptions;

  export type UpdateFieldOptions = {
    /**
     * Allow replacement of invalid values with valid defaults?
     * (default: `false`)
     */
    fallback?: boolean;
    recursive?: boolean;
    _collections?: Record<string, EmbeddedCollectionField<any, any>>;
    _diff: Record<string, unknown>;
  };

  export type ShimDataOptions = Partial<{
    /**
     * Apply shims to embedded models?
     * (default: `true`)
     */
    embedded: boolean;
  }>;

  export type InitializedDataFor<Model extends Any> = Model extends DataModel<any, infer ConcreteDataSchema>
    ? SchemaToData<ConcreteDataSchema>
    : never;

  export type SchemaToSourceInput<ConcreteDataSchema extends DataSchema> = ExpandDeep<
    FlattenSystem<
      GetSchemaValue<ConstructPartial<ConstructReadonly<RemoveIndex<ConcreteDataSchema>>, 'SourceType'>, 'SourceType'>
    >
  >;

  type ConstructPartial<
    out ConcreteDataSchema extends DataSchema,
    out ExtendsOptionsKey extends keyof DataField.AnyExtendsOptions,
    out Computed = {
      [K in keyof ConcreteDataSchema]: ConcreteDataSchema[K]['initial'] extends '' ? true : false;
    }
  > = {
    [K in keyof ConcreteDataSchema]: ConcreteDataSchema[K];
  };

  type ConstructPartialInner<
    ConcreteDataSchema extends DataSchema,
    ExtendsOptionsKey extends keyof DataField.AnyExtendsOptions
  > = PartialProps<
    ConcreteDataSchema,
    {
      // Essentially tests this condition that will give if it's required:
      //   !fieldTypes(field, ExtendsOptionsKey).includes(initial) ||
      //   (field instanceof StringField && blank === false && initial === '')
      // In both cases validation will automatically fail if given no value thusly a value must be given to prevent this error.
      [K in keyof ConcreteDataSchema]: Or<
        // Check if the initial type is in any of the field source types
        Not<
          ItemExtends<
            DataField.InitialTypeFor<ConcreteDataSchema[K]>,
            FieldType<ConcreteDataSchema[K], ExtendsOptionsKey, true>
          >
        >,
        'blank' extends keyof ConcreteDataSchema[K]
          ? And<Extends<ConcreteDataSchema[K]['blank'], false>, Equals<ConcreteDataSchema[K]['initial'], ''>>
          : false
      > extends false
        ? K
        : never;
    }[keyof ConcreteDataSchema]
  >;

  export type SchemaToSource<ConcreteDataSchema extends DataSchema> = {
    [K in keyof ConcreteDataSchema]?: any;
  };

  export type FieldType<
    Field extends DataField.Any,
    Key extends keyof DataField.AnyExtendsOptions,
    IsInput extends true | false
  > = DataField.ExtendsOptionsFor<Field>[Key] | DataField.ExtraTypes<Field, IsInput>;

  export type GetSchemaValue<
    // `Partial` is applied because of `ConstructPartial`.
    out ConcreteDataSchema extends Partial<DataSchema>,
    out ExtendsOptionsKey extends keyof DataField.AnyExtendsOptions
  > = {
    [K in keyof ConcreteDataSchema]: FieldType<Exclude<ConcreteDataSchema[K], undefined>, ExtendsOptionsKey, true>;
  };

  export type ConstructReadonly<ConcreteDataSchema extends DataSchema> = ConcreteDataSchema;
  //   export type ConstructReadonly<
  //     out ConcreteDataSchema extends DataSchema,
  //     out Computed = ReadonlyProps<
  //       ConcreteDataSchema,
  //       {
  //         [K in keyof ConcreteDataSchema]: ConcreteDataSchema[K]['readonly'] extends true ? K : never;
  //       }[keyof ConcreteDataSchema]
  //     >
  //   > = { [K in keyof Computed]: Computed[K] };

  // The given source and data type of system is a lie. It's a union that looks like `{ type: SubType1, system: SystemData1 } | ...`, when in reality it's just `SystemData1 | SystemData2 | ...`
  // However, it keeps these types extraordinarily simple compared to alternatives.
  type DistributeSystem<ConstructedSchema extends Record<string, unknown>> = [
    unknown
  ] extends ConstructedSchema['system']
    ? ConstructedSchema
    : ConstructedSchema['system'] & Omit<ConstructedSchema, 'type' | 'system'>;

  // Flatten the system. Be careful about changes here.
  // Variance MUST be correct.
  type FlattenSystem<out ConstructedSchema extends Record<string, unknown>> = {
    [K in keyof ConstructedSchema]: ['system'] extends [K]
      ? GetKey<ConstructedSchema['system'], 'system', never>
      : ConstructedSchema[K];
  };

  //   export type SchemaToData<ConcreteDataSchema extends DataSchema> = FlattenSystem<
  //     GetSchemaValue<ConstructReadonly<RemoveIndex<ConcreteDataSchema>>, 'InitializedType'>
  //   >;

  type SchemaToData<ConcreteDataSchema extends DataSchema> = {
    [K in keyof ConcreteDataSchema]?: any;
  };

  export type Any = DataModel<any, any, any>;

  export type AnyConstructor = Pick<typeof DataModel, keyof typeof DataModel> &
    (abstract new (...params: any[]) => DataModel.Any);
}

export type DataSchema = {
  [name: string]: DataField.Any;
};

type DataModelConstructorParameters<ConcreteDataSchema extends DataSchema> = PartialIf<
  [
    /**
     * Initial data used to construct the data object
     * (default: `{}`)
     */
    data: DataModel.SchemaToSourceInput<ConcreteDataSchema>,

    /**
     * Options which affect DataModel construction
     * (default: `{}`)
     */
    options?: DataModel.ConstructorOptions
  ],
  Equals<DataModel.SchemaToSourceInput<ConcreteDataSchema>, {}>
>;

// @ts-expect-error subclassing StructuralClass gives an error
declare abstract class _InternalDataModel<
  // These variance annotations are required to make sure tsserver doesn't get tripped up, see https://github.com/microsoft/TypeScript/issues/52813.
  out ConcreteDataSchema extends DataSchema,
  out ConstructorParameters extends any[] = DataModelConstructorParameters<ConcreteDataSchema>,
  out _ComputedDataModel extends object = RemoveIndex<DataModel.SchemaToData<ConcreteDataSchema>>
> extends StructuralClass<_ComputedDataModel, ConstructorParameters> {}

type DataModelShims = {
  /**
   * @deprecated since v10
   */
  update: DataModel<any, any, any>['updateSource'];
};

/**
 * The abstract base class which defines the data schema contained within a Document.
 */
declare abstract class DataModel<
  out Parent extends AnyDocument | null,
  out ConcreteDataSchema extends DataSchema,
  out ConcreteDataModelShims extends Record<string, unknown> = {},
  out ConstructorParameters extends any[] = DataModelConstructorParameters<ConcreteDataSchema>
> extends _InternalDataModel<ConcreteDataSchema, ConstructorParameters> {
  /**
   * The source data object for this DataModel instance.
   * Once constructed, the source object is sealed such that no keys may be added nor removed.
   */
  readonly _source: DataModel.SchemaToSource<ConcreteDataSchema> & ConcreteDataModelShims & DataModelShims;

  /**
   * The defined and cached Data Schema for all instances of this DataModel.
   */
  private static readonly _schema: DataSchema;

  /**
   * A mapping of EmbeddedCollection instances which correspond to fields of this model.
   */
  //   #collections: {
  //     [K in keyof ConcreteDataSchema as ConcreteDataSchema[K] extends EmbeddedCollectionField<any, any>
  //       ? K
  //       : never]: ConcreteDataSchema[K];
  //   };

  /**
   * An immutable reverse-reference to a parent DataModel to which this model belongs.
   */
  readonly parent: Parent;

  /**
   * Is the current state of the DataModel valid?
   */
  #valid: boolean;

  /* ---------------------------------------- */
  /*  Data Schema                             */
  /* ---------------------------------------- */

  /**
   * Define the data schema for documents of this type.
   * The schema is populated the first time it is accessed and cached for future reuse.
   * @virtual
   *
   * @remarks This method MUST be defined in subclasses as to not is a runtime error. To get runtime and compile time characteristics synced up the return type of `defineSchema` must be the same as `ConcreteDataSchema`. Unfortunately neither of these can be ensured at compile-time.
   */
  static defineSchema(): DataSchema;

  /* ---------------------------------------- */

  /**
   * Define the data schema for documents of this type.
   */
  static get schema(): DataSchema;

  /* ---------------------------------------- */

  /**
   * Define the data schema for this document instance.
   */
  get schema(): ConcreteDataSchema;

  /* ---------------------------------------- */

  /**
   * Is the current state of this DataModel invalid?
   */
  get invalid(): boolean;

  /* ---------------------------------------- */

  /**
   * Apply a certain transformation function to every field in the model's data schema.
   * @param fn - A function to apply or a string which references a named function which must exist on every DataField subclass
   * @param data - Input data which is passed to the applied function
   * @param options - Options which are passed to the applied function
   * @returns - An object with the hierarchical structure of the model schema containing the returned values of the applied function
   */
  static applyToSchema<Data extends Record<string, unknown> = {}, Options extends Record<string, unknown> = {}>(
    fn: (data: Data[string], options: Options) => void | string,
    data?: Data,
    options?: Options
  ): Record<string, unknown>;

  /* ---------------------------------------- */
  /*  Data Cleaning Methods                   */
  /* ---------------------------------------- */

  /**
   * Initialize the source data for a new DataModel instance.
   * One-time migrations and initial cleaning operations are applied to the source data.
   * @param data - The candidate source data from which the model will be constructed
   * @param options - Options provided to the model constructor
   *                  (default: `{}`)
   * @returns Migrated and cleaned source data which will be stored to the model instance
   */
  protected _initializeSource(
    data: DataModel.SchemaToSourceInput<this['schema']>,
    options?: object
  ): DataModel.SchemaToSource<this['schema']>;

  /* ---------------------------------------- */

  /**
   * Clean a data source object to conform to a specific provided schema.
   * @param source  - The source data object
   *                  (default: `{}`)
   * @param options - Additional options which are passed to SchemaField.cleanSchema
   *                  (default: `{}`)
   * @returns The cleaned source data
   */
  static cleanData(source?: Record<string, unknown>, options?: DataModel.CleanDataOptions): Record<string, unknown>;

  /* ---------------------------------------- */
  /*  Data Initialization                     */
  /* ---------------------------------------- */

  /**
   * Initialize the instance by copying data from the source object to instance attributes.     Options provided to the model constructor
   */
  protected _initialize(options: DataModel.InitializeOptions): void;

  /* ---------------------------------------- */

  /**
   * Reset the state of this data instance back to mirror the contained source data, erasing any changes.
   */
  reset(): void;

  /**
   * Validate the data contained in the document to check for type and content
   * This function throws an error if data within the document is not valid
   *
   * @param options - Optional parameters which customize how validation occurs.
   *                  (default: `{}`)
   * @returns - An indicator for whether the document contains valid data
   */
  validate(options: DataModel.ValidateOptions<DataModel.SchemaToData<ConcreteDataSchema>>): boolean;

  /* ---------------------------------------- */

  /**
   * Get an array of validation errors from the provided error structure
   * @param options - (default: `{}`)
   */
  static formatValidationErrors(
    errors: Record<string, Error>,
    options?: DataModel.FormatValidationErrorsOptions
  ): string;

  /* ---------------------------------------- */

  /**
   * Jointly validate the overall data model after each field has been individually validated.
   * @param data - The candidate data object to validate
   * @throws - An error if a validation failure is detected
   */
  protected _validateModel(data: DataModel.SchemaToData<this['schema']>): void;

  /* ---------------------------------------- */
  /*  Data Management                         */
  /* ---------------------------------------- */

  /**
   * Update the DataModel locally by applying an object of changes to its source data.
   * The provided changes are cleaned, validated, and stored to the source data object for this model.
   * The source data is then re-initialized to apply those changes to the prepared data.
   * The method returns an object of differential changes which modified the original data.
   *
   * @param changes - New values which should be applied to the data model
   *                  (default: `{}`)
   * @param options - Options which determine how the new data is merged
   *                  (default: `{}`)
   * @returns - An object containing the changed keys and values
   */
  updateSource(
    changes?: DeepPartial<DataModel.SchemaToSource<ConcreteDataSchema>>,
    options?: DataModel.UpdateSourceOptions
  ): Partial<DataModel.SchemaToSource<ConcreteDataSchema>>;

  /* ---------------------------------------- */

  /**
   * Update the source data for a specific DataSchema.
   * @param schema - The data schema to update
   * @param source - Source data to be updated
   * @param changes - Changes to apply to the source data
   * @param options - Options which modify the update workflow
   *                           (default: `{}`)
   * @returns The updated source data
   * @throws - An error if the update operation was unsuccessful
   */
  static #updateData(
    schema: DataSchema,
    source: Record<string, unknown>,
    changes: Record<string, unknown>,
    options: DataModel.UpdateDataOptions
  ): Record<string, unknown>;

  /* ---------------------------------------- */

  /**
   * Update the source data for a specific DataField.
   * @param name - The field name being updated
   * @param field - The field definition being updated
   * @param source - The source object being updated
   * @param value - The new value for the field
   * @param options - Options which modify the update workflow
   * @throws - An error if the new candidate value is invalid
   */
  static #updateField(
    name: string,
    field: DataField.Any,
    source: Record<string, unknown>,
    value: unknown,
    options: Record<string, unknown>
  ): Record<string, unknown>;

  /* ---------------------------------------- */
  /*  Serialization and Storage               */
  /* ---------------------------------------- */

  /**
   * Copy and transform the DataModel into a plain object.
   * Draw the values of the extracted object from the data source (by default) otherwise from its transformed values.
   * @param source - Draw values from the underlying data source rather than transformed values
   *                 (default: `true`)
   * @returns The extracted primitive object
   */
  toObject(source?: true): this['_source'];

  toObject(source: false): {
    [K in keyof this['schema']]: ReturnType<this['schema'][K]['toObject']>;
  };

  /* ---------------------------------------- */

  /**
   * Extract the source data for the DataModel into a simple object format that can be serialized.
   * @returns - The document source data expressed as a plain object
   */
  toJSON(): Record<string, unknown>;

  /* -------------------------------------------- */

  /**
   * Create a new instance of this DataModel from a source record.
   * The source is presumed to be trustworthy and is not strictly validated.
   * @param source - Initial document data which comes from a trusted source.
   * @param context - Model construction context
   */
  protected static fromSource(source: object, context: DataModel.FromSourceContext): DataModel.Any;

  /* ---------------------------------------- */

  /**
   * Create a DataModel instance using a provided serialized JSON string.
   * @param json - Serialized document data in string format
   * @returns - A constructed data model instance
   */
  static fromJSON(json: string): DataModel.Any;

  /* -------------------------------------------- */

  /**
   * View the schema of this data model in a representative "flattened" format.
   */
  static get flatSchema(): DataSchema;

  /* -------------------------------------------- */
  /*  Deprecations and Compatibility              */
  /* -------------------------------------------- */

  /**
   * Migrate candidate source data for this DataModel which may require initial cleaning or transformations.
   * @param source - The candidate source data from which the model will be constructed
   * @returns Migrated source data, if necessary
   */
  static migrateData(source: Record<string, unknown>): Record<string, unknown>;

  /* ---------------------------------------- */

  /**
   * Take data which conforms to the current data schema and add backwards-compatible accessors to it in order to support older code which uses this data.
   * @param data - Data which matches the current schema
   * @param options - Additional shimming options
   *                  (default: `{}`)
   * @returns - Data with added backwards-compatible properties
   */
  static shimData(data: Record<string, unknown>, options: DataModel.ShimDataOptions): Record<string, unknown>;
}

export default DataModel;

export { DataModel };
