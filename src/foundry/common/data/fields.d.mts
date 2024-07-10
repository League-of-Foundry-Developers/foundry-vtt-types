import type {
  ConfiguredDocumentClass,
  ConfiguredDocumentClassForName,
  ConfiguredFlags,
} from "../../../types/helperTypes.mts";
import type { RemoveIndexSignatures, ConstructorOf, SimpleMerge, ValueOf } from "../../../types/utils.d.mts";
import type { DataModel } from "../abstract/data.mts";
import type Document from "../abstract/document.mts";
import type { EmbeddedCollection, EmbeddedCollectionDelta } from "../abstract/module.d.mts";
import type { DOCUMENT_OWNERSHIP_LEVELS } from "../constants.d.mts";
import type { CONST } from "../../client-esm/client.mjs";
import type { DataModelValidationFailure } from "./validation-failure.mts";

declare global {
  /**
   * @typeParam BaseAssignmentType - the base assignment type for a DataField, without null or undefined
   */
  interface DataFieldOptions<BaseAssignmentType> {
    /**
     * Is this field required to be populated?
     * @defaultValue `false`
     */
    required?: boolean | undefined;

    /**
     * Can this field have null values?
     * @defaultValue `false`
     */
    nullable?: boolean | undefined;

    /** The initial value of a field, or a function which assigns that initial value. */
    initial?:
      | DataFieldOptions.InitialType<
          DataFieldOptions.InitialReturnType<BaseAssignmentType, this["nullable"], this["required"]>
        >
      | undefined;

    /** A data validation function which accepts one argument with the current value. */
    validate?:
      | ((this: DataField.Any, value: any, options?: DataField.ValidationOptions<DataField.Any>) => boolean | void)
      | undefined;

    /** A localizable label displayed on forms which render this field. */
    label?: string | undefined;

    /** Localizable help text displayed on forms which render this field. */
    hint?: string | undefined;

    /**
     * A custom validation error string. When displayed will be prepended with the
     * document name, field name, and candidate value.
     */
    validationError?: string | undefined;
  }

  namespace DataFieldOptions {
    /** Any DataFieldOptions. */
    type Any = DataFieldOptions<any>;

    /**
     * A helper type for the {@link DataFieldOptions.initial} option.
     * @typeParam ReturnType - the return type of the option
     */
    type InitialType<ReturnType> = ReturnType | ((initialData: unknown) => ReturnType);

    /**
     * The decorated return type for the {@link DataFieldOptions.initial} option.
     * @typeParam BaseAssignmentType - the base assignment type for a DataField
     * @typeParam NullableOption     - the value of the nullable option
     * @typeParam RequiredOption     - the value of the required option
     */
    type InitialReturnType<BaseAssignmentType, NullableOption, RequiredOption> =
      | Exclude<BaseAssignmentType, null | undefined>
      | (NullableOption extends true ? null : never)
      | (RequiredOption extends true ? never : undefined);

    type Choices<T> = T[] | Record<string, T> | (() => T[] | Record<string, T>);
  }

  interface DataFieldValidationOptions {
    /** Whether this is a partial schema validation, or a complete one. */
    partial?: boolean;

    /** Whether to allow replacing invalid values with valid fallbacks. */
    fallback?: boolean;

    /** The full source object being evaluated. */
    source?: object;

    /**
     * If true, invalid embedded documents will emit a warning and be placed in
     * the invalidDocuments collection rather than causing the parent to be
     * considered invalid.
     */
    dropInvalidEmbedded?: boolean;
  }
}

/**
 * An abstract class that defines the base pattern for a data field within a data schema.
 * @typeParam Options         - the options of the DataField instance
 * @typeParam AssignmentType  - the type of the allowed assignment values of the DataField
 * @typeParam InitializedType - the type of the initialized values of the DataField
 * @typeParam PersistedType   - the type of the persisted values of the DataField
 * @remarks
 * Defaults:
 * AssignmentType: `any | null | undefined`
 * InitializedType: `unknown | undefined`
 * PersistedType: `unknown | undefined`
 * InitialValue: `undefined`
 */
declare abstract class DataField<
  const Options extends DataFieldOptions.Any = DataField.DefaultOptions,
  const AssignmentType = DataField.AssignmentType<Options>,
  const InitializedType = DataField.InitializedType<Options>,
  const PersistedType extends unknown | null | undefined = InitializedType,
> {
  /**
   * @param options - Options which configure the behavior of the field
   */
  constructor(options?: Options);

  /** The initially provided options which configure the data field */
  options: Options;

  /**
   * Is this field required to be populated?
   * @defaultValue `false`
   */
  required: boolean;

  /**
   * Can this field have null values?
   * @defaultValue `false`
   */
  nullable: boolean;

  /**
   * The initial value of a field, or a function which assigns that initial value.
   * @defaultValue `undefined`
   */
  initial: DataFieldOptions.InitialType<InitializedType>;

  /**
   * Should the prepared value of the field be read-only, preventing it from being
   * changed unless a change to the _source data is applied.
   * @defaultValue `false`
   */
  readonly: boolean;

  /**
   * A localizable label displayed on forms which render this field.
   * @defaultValue `""`
   */
  label: string;

  /**
   * Localizable help text displayed on forms which render this field.
   * @defaultValue `""`
   */
  hint: string;

  /**
   * A custom validation error string. When displayed will be prepended with the
   * document name, field name, and candidate value.
   * @defaultValue `"is not a valid value"`
   */
  validationError: string;

  /**
   * The name of this data field within the schema that contains it
   *
   * The field name of this DataField instance.
   * This is assigned by SchemaField#initialize.
   * @internal
   */
  name: string | undefined;

  /**
   * A reference to the parent schema to which this DataField belongs.
   * This is assigned by SchemaField#initialize.
   * @internal
   */
  parent: DataField.Any | undefined;

  /**
   * Whether this field defines part of a Document/Embedded Document hierarchy.
   * @defaultValue `false`
   */
  static hierarchical: boolean;

  /**
   * Does this field type contain other fields in a recursive structure?
   * Examples of recursive fields are SchemaField, ArrayField, or TypeDataField
   * Examples of non-recursive fields are StringField, NumberField, or ObjectField
   * @defaultValue `false`
   */
  static recursive: boolean;

  /**
   * Default parameters for this field type
   * @remarks This is not entirely type-safe, overrides should specify a more concrete return type.
   */
  protected static get _defaults(): DataFieldOptions.Any;

  /**
   * A dot-separated string representation of the field path within the parent schema.
   */
  get fieldPath(): string;

  /**
   * Apply a function to this DataField which propagates through recursively to any contained data schema.
   * @param fn      - The function to apply
   * @param value   - The current value of this field
   * @param options - Additional options passed to the applied function
   *                  (default `{}`)
   * @returns The results object
   */
  apply<Value, Options, Return>(
    fn: keyof this | ((this: this, value: Value, options: Options) => Return),
    value: Value,
    options?: Options,
  ): Return;

  /**
   * Coerce source data to ensure that it conforms to the correct data type for the field.
   * Data coercion operations should be simple and synchronous as these are applied whenever a DataModel is constructed.
   * For one-off cleaning of user-provided input the sanitize method should be used.
   * @param value   - The initial value
   * @param options - Additional options for how the field is cleaned
   * @returns The cast value
   */
  clean(value: AssignmentType, options?: DataField.CleanOptions): InitializedType;

  /**
   * Apply any cleaning logic specific to this DataField type.
   * @param value   - The appropriately coerced value.
   * @param options - Additional options for how the field is cleaned.
   * @returns The cleaned value.
   */
  protected _cleanType(value: InitializedType, options?: DataField.CleanOptions): InitializedType;

  /**
   * Cast a non-default value to ensure it is the correct type for the field
   * @param value - The provided non-default value
   * @returns The standardized value
   */
  protected abstract _cast(value: AssignmentType): InitializedType;

  /**
   * Attempt to retrieve a valid initial value for the DataField.
   * @param data - The source data object for which an initial value is required
   * @returns A valid initial value
   * @throws An error if there is no valid initial value defined
   */
  getInitialValue(data: DataField.CleanOptions["source"]): InitializedType;

  /**
   * Validate a candidate input for this field, ensuring it meets the field requirements.
   * A validation failure can be provided as a raised Error (with a string message), by returning false, or by returning
   * a DataModelValidationFailure instance.
   * A validator which returns true denotes that the result is certainly valid and further validations are unnecessary.
   * @param value   - The initial value
   * @param options - Options which affect validation behavior
   *                  (default: `{}`)
   * @returns Returns a ModelValidationError if a validation failure occurred
   */
  validate(
    value: AssignmentType,
    options?: DataField.ValidationOptions<DataField.Any>,
  ): DataModelValidationFailure | undefined;

  /**
   * Special validation rules which supersede regular field validation.
   * This validator screens for certain values which are otherwise incompatible with this field like null or undefined.
   * @param value - The candidate value
   * @returns A boolean to indicate with certainty whether the value is valid.
   *          Otherwise, return void.
   * @throws May throw a specific error if the value is not valid
   */
  protected _validateSpecial(value: AssignmentType): boolean | void;

  /**
   * A default type-specific validator that can be overridden by child classes
   * @param value   - The candidate value
   * @param options - Options which affect validation behavior
   * @returns A boolean to indicate with certainty whether the value is
   *          valid, or specific DataModelValidationFailure information,
   *          otherwise void.
   * @throws May throw a specific error if the value is not valid
   */
  protected _validateType(value: InitializedType, options?: DataField.ValidationOptions<DataField.Any>): boolean | void;

  /**
   * Certain fields may declare joint data validation criteria.
   * This method will only be called if the field is designated as recursive.
   * @param data    - Candidate data for joint model validation
   * @param options - Options which modify joint model validation
   * @throws  An error if joint model validation fails
   * @internal
   */
  protected _validateModel(data: object, options?: object): void; // TODO: Type further.

  /**
   * Initialize the original source data into a mutable copy for the DataModel instance.
   * @param value   - The source value of the field
   * @param model   - The DataModel instance that this field belongs to
   * @param options - Initialization options
   * @returns An initialized copy of the source data
   */
  initialize(
    value: PersistedType,
    model: DataModel.Any,
    options: object, // TODO: Type further.
  ): (() => InitializedType | null) | InitializedType;

  /**
   * Export the current value of the field into a serializable object.
   * @param value - The initialized value of the field
   * @returns An exported representation of the field
   */
  toObject(value: InitializedType): PersistedType;

  /**
   * Recursively traverse a schema and retrieve a field specification by a given path
   * @param path - The field path as an array of strings
   */
  protected _getField(path: string[]): unknown; // TODO: Type further.
}

declare namespace DataField {
  /** The type of the default options for the {@link DataField} class. */
  type DefaultOptions = {
    required: false;
    nullable: false;
    initial: undefined;
    readonly: false;
    label: "";
    hint: "";
    validationError: "is not a valid value";
  };

  /**
   * A helper type for the given options type merged into the default options of the DataField class.
   * @typeParam Options - the options that override the default options
   */
  type MergedOptions<Options extends DataFieldOptions.Any> = SimpleMerge<DefaultOptions, Options>;

  /** Any DataField. */
  type Any = DataField<any, any, any, any>;

  /** A DataField with unknown inner types. */
  type Unknown = DataField<any, unknown, unknown, unknown>;

  /**
   * A type to decorate the base assignment type to a DataField, based on the options of the field.
   * @typeParam BaseAssignmentType - the base assignment type of the DataField, without null or undefined
   * @typeParam Options            - the options of the DataField
   */
  type DerivedAssignmentType<BaseAssignmentType, Options extends DataFieldOptions.Any> =
    | Exclude<BaseAssignmentType, null | undefined> // Always include the base type
    | (Options["nullable"] extends true // determine whether null is in the union
        ? // when nullable, null is always allowed
          null
        : // otherwise, it depends on required
          Options["required"] extends true
          ? // when required and not nullable, null can only be passed when initial is present
            "initial" extends keyof Options
            ? // when initial is present, null can be passed
              null
            : // when initial is not in the options, then null can not be passed
              never
          : // when not required, null can safely be passed
            null)
    | (Options["required"] extends true // determine whether undefined is in the union
        ? // when required, it depends on initial
          "initial" extends keyof Options
          ? // when initial is in the options, undefined is allowed
            undefined
          : // when initial is not in the options, then undefined is not allowed
            never
        : // when not required, undefined can safely be passed
          undefined);

  /**
   * A type to decorate the base initialized type of a DataField, based on the options of the field.
   * @typeParam BaseInitializedType - the base initialized type of the DataField, without null or undefined
   * @typeParam Options             - the options of the DataField
   */
  type DerivedInitializedType<BaseInitializedType, Options extends DataFieldOptions.Any> =
    | Exclude<BaseInitializedType, null | undefined>
    | (Options["nullable"] extends true ? null : never)
    | (Options["required"] extends true ? never : undefined);

  /**
   * A shorthand for the assignment type of a DataField class.
   * @typeParam Options - the options overriding the defaults
   */
  type AssignmentType<Options extends DataFieldOptions.Any> = DerivedAssignmentType<any, MergedOptions<Options>>;

  /**
   * A shorthand for the initialized type of a DataField class.
   * @typeParam Options - the options overriding the defaults
   */
  type InitializedType<Options extends DataFieldOptions.Any> = DerivedInitializedType<any, MergedOptions<Options>>;

  /** An interface for the options of the {@link DataField} clean functions. */
  interface CleanOptions {
    /** Whether to perform partial cleaning? */
    partial?: boolean;

    /** The root data model being cleaned */
    source?: {
      type?: string;
    };
  }

  /**
   * An interface for the options of the {@link DataField} validation functions.
   * @typeParam DataField - the type of the DataField, which is the receiver of the validate function
   */
  interface ValidationOptions<DataField extends DataField.Any> extends DataValidationOptions {
    source?: object;
    validate?: (this: DataField, value: unknown, options: ValidationOptions<DataField>) => boolean;
  }
}

/**
 * A special class of {@link DataField} which defines a data schema.
 * @typeParam Fields          - the DataSchema fields of the SchemaField
 * @typeParam Options         - the options of the SchemaField instance
 * @typeParam AssignmentType  - the type of the allowed assignment values of the SchemaField
 * @typeParam InitializedType - the type of the initialized values of the SchemaField
 * @typeParam PersistedType   - the type of the persisted values of the SchemaField
 * @remarks
 * Defaults:
 * AssignmentType: `SchemaField.AssignmentType<Fields> | null | undefined`
 * InitializedType: `SchemaField.InitializedType<Fields>`
 * PersistedType: `SchemaField.PersistedType<Fields>`
 * InitialValue: `{}`
 */
declare class SchemaField<
  Fields extends DataSchema,
  Options extends SchemaField.Options<Fields> = SchemaField.DefaultOptions,
  AssignmentType = SchemaField.AssignmentType<Fields, SimpleMerge<Options, SchemaField.DefaultOptions>>,
  InitializedType = SchemaField.InitializedType<Fields, SimpleMerge<Options, SchemaField.DefaultOptions>>,
  PersistedType extends object | null | undefined = SchemaField.PersistedType<
    Fields,
    SimpleMerge<Options, SchemaField.DefaultOptions>
  >,
> extends DataField<Options, AssignmentType, InitializedType, PersistedType> {
  /**
   * @param fields  - The contained field definitions
   * @param options - Options which configure the behavior of the field
   */
  // Saying `fields: Fields` here causes the inference for the fields to be unnecessarily widened. This might effectively be a no-op but it fixes the inference.
  constructor(fields: { [K in keyof Fields]: Fields[K] }, options?: Options);

  /** @defaultValue `true` */
  override required: boolean;

  /** @defaultValue `false` */
  override nullable: boolean;

  /** @defaultValue `() => this.clean({})` */
  override initial: DataFieldOptions.InitialType<InitializedType>;

  protected static override get _defaults(): SchemaField.Options<DataSchema>;

  /** @defaultValue `true` */
  static override recursive: boolean;

  /**
   * The contained field definitions.
   */
  fields: Fields;

  /**
   * Initialize and validate the structure of the provided field definitions.
   * @param fields - The provided field definitions
   * @returns The validated schema
   */
  protected _initialize(fields: Fields): Fields;

  /**
   * Iterate over a SchemaField by iterating over its fields.
   */
  [Symbol.iterator](): Generator<DataField.Unknown>;

  /**
   * An array of field names which are present in the schema.
   */
  keys(): string[];

  /**
   * An array of DataField instances which are present in the schema.
   */
  values(): DataField.Unknown[];

  /**
   * An array of [name, DataField] tuples which define the schema.
   */
  entries(): [name: string, dataField: DataField.Unknown][];

  /**
   * Test whether a certain field name belongs to this schema definition.
   * @param fieldName - The field name
   * @returns Does the named field exist in this schema?
   */
  has(fieldName: string): boolean;

  /**
   * Get a DataField instance from the schema by name
   * @param fieldName - The field name
   * @returns The DataField instance or undefined
   */
  get(fieldName: string): DataField.Unknown | undefined;

  /**
   * Traverse the schema, obtaining the DataField definition for a particular field.
   * @param fieldName - A field path like ["abilities", "strength"] or "abilities.strength"
   * @returns The corresponding DataField definition for that field, or undefined
   */
  getField(fieldName: string | string[]): DataField.Unknown | undefined;

  protected override _getField(path: string[]): DataField.Unknown;

  protected override _cast(value: AssignmentType): InitializedType;

  protected override _cleanType(value: InitializedType, options?: DataField.CleanOptions): InitializedType;

  override initialize(value: PersistedType, model: DataModel.Any): InitializedType | (() => InitializedType | null);

  protected override _validateType(
    value: InitializedType,
    options?: DataField.ValidationOptions<DataField.Any>,
  ): boolean | void;

  protected override _validateModel(data: object, options?: object): void;

  override toObject(value: InitializedType): PersistedType;

  override apply<Value, Options, Return>(
    fn: keyof this | ((this: this, value: Value, options: Options) => Return),
    value: Value,
    options?: Options,
  ): Return;

  /**
   * Migrate this field's candidate source data.
   * @param sourceData - Candidate source data of the root model
   * @param fieldData  - The value of this field within the source data
   */
  migrateSource(sourceData: object, fieldData: unknown): unknown;
}

declare namespace SchemaField {
  /**
   * A shorthand for the options of a SchemaField class.
   * @typeParam Fields - the DataSchema fields of the SchemaField
   */
  type Options<Fields extends DataSchema> = DataFieldOptions<InnerAssignmentType<Fields>>;

  /** Any SchemaField. */
  type Any = SchemaField<any, any, any, any, any>;

  /**
   * Get the constructor type for the given DataSchema.
   * @typeParam Fields - the DataSchema fields of the SchemaField
   */
  type InnerConstructorType<Fields extends DataSchema> = InnerAssignmentType<Fields>;

  /**
   * Get the inner assignment type for the given DataSchema.
   * @typeParam Fields - the DataSchema fields of the SchemaField
   */
  type InnerAssignmentType<Fields extends DataSchema> = RemoveIndexSignatures<{
    [Key in keyof Fields]?: Fields[Key] extends DataField<any, infer AssignType, any, any>
      ? Fields[Key] extends SchemaField<infer SubSchema, any, any, any, any>
        ? // FIXME(LukeAbby): This is a quick hack into InnerAssignmentType that assumes that the `initial` of `SchemaField` is not changed from the default of `{}`
          // This will be fixed with the refactoring of the types
          {} extends InnerAssignmentType<SubSchema>
          ? InnerAssignmentType<SubSchema> | undefined | null
          : InnerAssignmentType<SubSchema>
        : AssignType
      : never;
  }>;

  /**
   * Get the inner initialized type for the given DataSchema.
   * @typeParam Fields - the DataSchema fields of the SchemaField
   */
  type InnerInitializedType<Fields extends DataSchema> = RemoveIndexSignatures<{
    [Key in keyof Fields]: Fields[Key] extends DataField<any, any, infer InitType, any>
      ? Fields[Key] extends EmbeddedDataField<infer Model, any, any, any, any>
        ? Model
        : Fields[Key] extends SchemaField<infer SubSchema, any, any, any, any>
          ? InnerInitializedType<SubSchema>
          : InitType
      : never;
  }>;

  /**
   * Get the inner persisted type for the given DataSchema.
   * @typeParam Fields - the DataSchema fields of the SchemaField
   */
  type InnerPersistedType<Fields extends DataSchema> = RemoveIndexSignatures<{
    [Key in keyof Fields]: Fields[Key] extends DataField<any, any, any, infer PersistType>
      ? Fields[Key] extends SchemaField<infer SubSchema, any, any, any, any>
        ? InnerPersistedType<SubSchema>
        : PersistType
      : never;
  }>;

  /** The type of the default options for the {@link SchemaField} class. */
  type DefaultOptions = SimpleMerge<
    DataField.DefaultOptions,
    {
      required: true;
      nullable: false;
      initial: Record<string, never>;
    }
  >;

  /**
   * A helper type for the given options type merged into the default options of the SchemaField class.
   * @typeParam Fields - the DataSchema fields of the SchemaField
   * @typeParam Opts   - the options that override the default options
   */
  type MergedOptions<Fields extends DataSchema, Opts extends Options<Fields>> = SimpleMerge<DefaultOptions, Opts>;

  // FIXME: null or undefined should be permissible, cast as the initialized type
  /**
   * A shorthand for the assignment type of a SchemaField class.
   * @typeParam Fields - the DataSchema fields of the SchemaField
   * @typeParam Opts   - the options that override the default options
   */
  type AssignmentType<
    Fields extends DataSchema,
    Opts extends Options<Fields> = DefaultOptions,
  > = DataField.DerivedAssignmentType<InnerAssignmentType<Fields>, MergedOptions<Fields, Opts>>;

  /**
   * A shorthand for the assignment type of a SchemaField class.
   * @typeParam Fields - the DataSchema fields of the SchemaField
   * @typeParam Opts   - the options that override the default options
   */
  type InitializedType<
    Fields extends DataSchema,
    Opts extends Options<Fields> = DefaultOptions,
  > = DataField.DerivedInitializedType<InnerInitializedType<Fields>, MergedOptions<Fields, Opts>>;

  /**
   * A shorthand for the assignment type of a SchemaField class.
   * @typeParam Fields - the DataSchema fields of the SchemaField
   * @typeParam Opts   - the options that override the default options
   */
  type PersistedType<
    Fields extends DataSchema,
    Opts extends Options<Fields> = DefaultOptions,
  > = DataField.DerivedInitializedType<InnerPersistedType<Fields>, MergedOptions<Fields, Opts>>;
}

/**
 * A subclass of [DataField]{@link DataField} which deals with boolean-typed data.
 * @typeParam Options         - the options of the BooleanField instance
 * @typeParam AssignmentType  - the type of the allowed assignment values of the BooleanField
 * @typeParam InitializedType - the type of the initialized values of the BooleanField
 * @typeParam PersistedType   - the type of the persisted values of the BooleanField
 * @remarks
 * Defaults:
 * AssignmentType: `boolean | null | undefined`
 * InitializedType: `boolean`
 * PersistedType: `boolean`
 * InitialValue: `false`
 */
declare class BooleanField<
  const Options extends BooleanField.Options = BooleanField.DefaultOptions,
  const AssignmentType = BooleanField.AssignmentType<SimpleMerge<Options, BooleanField.DefaultOptions>>,
  const InitializedType = BooleanField.InitializedType<SimpleMerge<Options, BooleanField.DefaultOptions>>,
  const PersistedType extends boolean | null | undefined = BooleanField.InitializedType<
    SimpleMerge<Options, BooleanField.DefaultOptions>
  >,
> extends DataField<SimpleMerge<Options, BooleanField.DefaultOptions>, AssignmentType, InitializedType, PersistedType> {
  /** @defaultValue `true` */
  override required: boolean;

  /** @defaultValue `false` */
  override nullable: boolean;

  /** @defaultValue `false` */
  override initial: DataFieldOptions.InitialType<InitializedType>;

  protected static override get _defaults(): BooleanField.Options;

  protected override _cast(value: AssignmentType): InitializedType;

  protected override _validateType(
    value: InitializedType,
    options?: DataField.ValidationOptions<DataField.Any>,
  ): boolean | void;
}

declare namespace BooleanField {
  /** A shorthand for the options of a BooleanField class. */
  type Options = DataFieldOptions<boolean>;

  /** The type of the default options for the {@link BooleanField} class. */
  type DefaultOptions = SimpleMerge<
    DataField.DefaultOptions,
    {
      required: true;
      nullable: false;
      initial: boolean;
    }
  >;

  /**
   * A helper type for the given options type merged into the default options of the BooleanField class.
   * @typeParam Opts - the options that override the default options
   */
  type MergedOptions<Opts extends Options> = SimpleMerge<DefaultOptions, Opts>;

  /**
   * A shorthand for the assignment type of a BooleanField class.
   * @typeParam Opts - the options that override the default options
   */
  type AssignmentType<Opts extends Options> = DataField.DerivedAssignmentType<boolean, MergedOptions<Opts>>;

  /**
   * A shorthand for the initialized type of a BooleanField class.
   * @typeParam Opts - the options that override the default options
   */
  type InitializedType<Opts extends Options> = DataField.DerivedInitializedType<boolean, MergedOptions<Opts>>;
}

declare global {
  interface NumberFieldOptions extends DataFieldOptions<number> {
    /**
     * A minimum allowed value
     * @defaultValue `undefined`
     */
    min?: number | undefined;

    /**
     * A maximum allowed value
     * @defaultValue `undefined`
     */
    max?: number | undefined;

    /**
     * A permitted step size
     * @defaultValue `undefined`
     */
    step?: number | undefined;

    /**
     * Must the number be an integer?
     * @defaultValue `false`
     */
    integer?: boolean | undefined;

    /**
     * Must the number be positive?
     * @defaultValue `false`
     */
    positive?: boolean | undefined;

    /**
     * An array of values or an object of values/labels which represent
     * allowed choices for the field. A function may be provided which dynamically
     * returns the array of choices.
     * @defaultValue `undefined`
     */
    choices?: DataFieldOptions.Choices<number> | undefined;
  }
}

/**
 * A subclass of [DataField]{@link DataField} which deals with number-typed data.
 * @typeParam Options         - the options of the NumberField instance
 * @typeParam AssignmentType  - the type of the allowed assignment values of the NumberField
 * @typeParam InitializedType - the type of the initialized values of the NumberField
 * @typeParam PersistedType   - the type of the persisted values of the NumberField
 * @remarks
 * Defaults:
 * AssignmentType: `number | null | undefined`
 * InitializedType: `number | null`
 * PersistedType: `number | null`
 * InitialValue: `null`
 */
declare class NumberField<
  const Options extends NumberFieldOptions = NumberField.DefaultOptions,
  const AssignmentType = NumberField.AssignmentType<Options>,
  const InitializedType = NumberField.InitializedType<Options>,
  const PersistedType extends number | null | undefined = NumberField.InitializedType<Options>,
> extends DataField<Options, AssignmentType, InitializedType, PersistedType> {
  /**
   * @param options - Options which configure the behavior of the field
   */
  constructor(options?: Options);

  /** @defaultValue `null` */
  override initial: DataFieldOptions.InitialType<InitializedType>;

  /** @defaultValue `true` */
  override nullable: boolean;

  /**
   * A minimum allowed value
   * @defaultValue `undefined`
   */
  min: number | undefined;

  /**
   * A maximum allowed value
   * @defaultValue `undefined`
   */
  max: number | undefined;

  /**
   * A permitted step size
   * @defaultValue `undefined`
   */
  step: number | undefined;

  /**
   * Must the number be an integer?
   * @defaultValue `false`
   */
  integer: boolean;

  /**
   * Must the number be positive?
   * @defaultValue `false`
   */
  positive: boolean;

  /**
   * An array of values or an object of values/labels which represent
   * allowed choices for the field. A function may be provided which dynamically
   * returns the array of choices.
   * @defaultValue `undefined`
   */
  choices: number[] | Record<number, string> | (() => number[] | Record<number, string>) | undefined;

  protected static override get _defaults(): NumberFieldOptions;

  protected override _cast(value: AssignmentType): InitializedType;

  protected override _cleanType(value: InitializedType, options?: DataField.CleanOptions): InitializedType;

  protected override _validateType(
    value: InitializedType,
    options?: DataField.ValidationOptions<DataField.Any>,
  ): boolean | void;

  /**
   * Test whether a provided value is a valid choice from the allowed choice set
   * @param value - The provided value
   * @returns Is the choice valid?
   */
  #isValidChoice(value: AssignmentType): boolean;
}

declare namespace NumberField {
  /** The type of the default options for the {@link NumberField} class. */
  type DefaultOptions = SimpleMerge<
    DataField.DefaultOptions,
    {
      initial: null;
      nullable: true;
      min: undefined;
      max: undefined;
      step: undefined;
      integer: false;
      positive: false;
      choices: undefined;
    }
  >;

  /** The type of the default options for the {@link NumberField} class when choices are provided. */
  type DefaultOptionsWhenChoicesProvided = SimpleMerge<DefaultOptions, { nullable: false }>;

  /**
   * A helper type for the given options type merged into the default options of the NumberField class.
   * @typeParam Options - the options that override the default options
   */
  type MergedOptions<Options extends NumberFieldOptions> = SimpleMerge<
    undefined extends Options["choices"] ? DefaultOptions : DefaultOptionsWhenChoicesProvided,
    Options
  >;

  /**
   * A shorthand for the assignment type of a NumberField class.
   * @typeParam Options - the options that override the default options
   */
  type AssignmentType<Options extends NumberFieldOptions> = DataField.DerivedAssignmentType<
    number,
    MergedOptions<Options>
  >;

  /**
   * A shorthand for the initialized type of a NumberField class.
   * @typeParam Options - the options that override the default options
   */
  type InitializedType<Options extends NumberFieldOptions> = DataField.DerivedInitializedType<
    number,
    MergedOptions<Options>
  >;
}

declare global {
  interface StringFieldOptions extends DataFieldOptions<string> {
    /**
     * Is the string allowed to be blank (empty)?
     * @defaultValue `true`
     */
    blank?: boolean | undefined;

    /**
     * Should any provided string be trimmed as part of cleaning?
     * @defaultValue `true`
     */
    trim?: boolean | undefined;

    /**
     * An array of values or an object of values/labels which represent
     * allowed choices for the field. A function may be provided which dynamically
     * returns the array of choices.
     * @defaultValue `undefined`
     */
    choices?: DataFieldOptions.Choices<string> | undefined;

    /**
     * @defaultValue `false`
     */
    textSearch?: boolean | undefined;
  }
}

/**
 * A subclass of [DataField]{@link DataField} which deals with string-typed data.
 * @typeParam Options         - the options of the StringField instance
 * @typeParam AssignmentType  - the type of the allowed assignment values of the StringField
 * @typeParam InitializedType - the type of the initialized values of the StringField
 * @typeParam PersistedType   - the type of the persisted values of the StringField
 * @remarks
 * Defaults:
 * AssignmentType: `string | null | undefined`
 * InitializedType: `string`
 * PersistedType: `string`
 * InitialValue: `""`
 */
declare class StringField<
  const Options extends StringFieldOptions = StringField.DefaultOptions,
  const AssignmentType = StringField.AssignmentType<Options>,
  const InitializedType = StringField.InitializedType<Options>,
  const PersistedType extends string | null | undefined = StringField.InitializedType<Options>,
> extends DataField<Options, AssignmentType, InitializedType, PersistedType> {
  /**
   * @param options - Options which configure the behavior of the field
   */
  constructor(options?: Options);

  /** @defaultValue `undefined` */
  override initial: DataFieldOptions.InitialType<InitializedType>;

  /**
   * Is the string allowed to be blank (empty)?
   * @defaultValue `true`
   */
  blank: boolean;

  /**
   * Should any provided string be trimmed as part of cleaning?
   * @defaultValue `true`
   */
  trim: boolean;

  /** @defaultValue `false` */
  override nullable: boolean;

  /**
   * An array of values or an object of values/labels which represent
   * allowed choices for the field. A function may be provided which dynamically
   * returns the array of choices.
   * @defaultValue `undefined`
   */
  choices: string[] | Record<string, string> | (() => string[] | Record<string, string>) | undefined;

  /** @defaultValue `false` */
  textSearch: boolean;

  protected static override get _defaults(): StringFieldOptions;

  override clean(value: AssignmentType, options?: DataField.CleanOptions): InitializedType;

  protected override _cast(value: AssignmentType): InitializedType;

  protected override _validateSpecial(value: AssignmentType): boolean | void;

  protected override _validateType(
    value: InitializedType,
    options?: DataField.ValidationOptions<DataField.Any>,
  ): boolean | void;

  /**
   * Test whether a provided value is a valid choice from the allowed choice set
   * @param value - The provided value
   * @returns Is the choice valid?
   */
  protected _isValidChoice(value: AssignmentType): boolean;
}

declare namespace StringField {
  /** The type of the default options for the {@link StringField} class. */
  type DefaultOptions = SimpleMerge<
    DataField.DefaultOptions,
    {
      initial: string;
      blank: true;
      trim: true;
      nullable: false;
      choices: undefined;
    }
  >;

  /** The type of the default options for the {@link StringField} class when choices are provided. */
  type DefaultOptionsWhenChoicesProvided = SimpleMerge<DefaultOptions, { nullable: false; blank: false }>;

  /**
   * A helper type for the given options type merged into the default options of the StringField class.
   * @typeParam Options - the options that override the default options
   */
  type MergedOptions<Options extends StringFieldOptions> = SimpleMerge<
    _OptionsForInitial<_OptionsForChoices<Options["choices"]>>,
    Options
  >;

  type _OptionsForChoices<Choices extends StringFieldOptions["choices"]> = undefined extends Choices
    ? DefaultOptions
    : DefaultOptionsWhenChoicesProvided;

  // FIXME: `"initial" extends keyof Options` does not work for modeling `"initial" in options`.
  type _OptionsForInitial<Options extends StringFieldOptions> = "initial" extends keyof Options
    ? Options
    : SimpleMerge<Options, { initial: _InitialForOptions<Options> }>;

  type _InitialForOptions<Options extends StringFieldOptions> = Options["required"] extends false | undefined
    ? undefined
    : Options["blank"] extends true
      ? string
      : Options["nullable"] extends true
        ? null
        : undefined;

  // choices?: string[] | Record<string, string> | (() => string[] | Record<string, string>) | undefined;

  type ValidChoice<Options extends StringFieldOptions> = Options["choices"] extends undefined
    ? string
    : Options["choices"] extends (...args: any) => infer Choices
      ? FixedChoice<Choices>
      : FixedChoice<Options["choices"]>;

  type FixedChoice<Choices> = Choices extends Array<infer U> ? U : Choices extends Record<infer K, any> ? K : string;

  /**
   * A shorthand for the assignment type of a StringField class.
   * @typeParam Options - the options that override the default options
   */
  type AssignmentType<Options extends StringFieldOptions> = DataField.DerivedAssignmentType<
    ValidChoice<Options>,
    MergedOptions<Options>
  >;

  /**
   * A shorthand for the initialized type of a StringField class.
   * @typeParam Options - the options that override the default options
   */
  type InitializedType<Options extends StringFieldOptions> = DataField.DerivedInitializedType<
    ValidChoice<Options>,
    MergedOptions<Options>
  >;
}

/**
 * A subclass of [DataField]{@link DataField} which deals with object-typed data.
 * @typeParam Options         - the options of the ObjectField instance
 * @typeParam AssignmentType  - the type of the allowed assignment values of the ObjectField
 * @typeParam InitializedType - the type of the initialized values of the ObjectField
 * @typeParam PersistedType   - the type of the persisted values of the ObjectField
 * @remarks
 * Defaults:
 * AssignmentType: `object | null | undefined`
 * InitializedType: `object`
 * PersistedType: `object`
 * InitialValue: `{}`
 */
declare class ObjectField<
  const Options extends DataFieldOptions<object> = ObjectField.DefaultOptions,
  const AssignmentType = ObjectField.AssignmentType<Options>,
  const InitializedType = ObjectField.InitializedType<Options>,
  const PersistedType extends object | null | undefined = ObjectField.InitializedType<Options>,
> extends DataField<Options, AssignmentType, InitializedType, PersistedType> {
  /** @defaultValue `true` */
  override required: boolean;

  /** @defaultValue `false` */
  override nullable: boolean;

  /** @defaultValue `() => ({})` */
  override initial: DataFieldOptions.InitialType<InitializedType>;

  protected static override get _defaults(): DataFieldOptions<object>;

  protected override _cast(value: AssignmentType): InitializedType;

  override initialize(value: PersistedType, model: DataModel.Any): InitializedType | (() => InitializedType | null);

  override toObject(value: InitializedType): PersistedType;

  protected override _validateType(
    value: InitializedType,
    options?: DataField.ValidationOptions<DataField.Any>,
  ): boolean | void;
}

declare namespace ObjectField {
  /** The type of the default options for the {@link ObjectField} class. */
  type DefaultOptions = SimpleMerge<
    DataField.DefaultOptions,
    {
      required: true;
      nullable: false;
      initial: () => object;
    }
  >;

  /**
   * A helper type for the given options type merged into the default options of the ObjectField class.
   * @typeParam Options - the options that override the default options
   */
  type MergedOptions<Options extends DataFieldOptions<object>> = SimpleMerge<DefaultOptions, Options>;

  /**
   * A shorthand for the assignment type of a ObjectField class.
   * @typeParam Options - the options that override the default options
   */
  type AssignmentType<Options extends DataFieldOptions<object>> = DataField.DerivedAssignmentType<
    object,
    MergedOptions<Options>
  >;

  /**
   * A shorthand for the initialized type of a ObjectField class.
   * @typeParam Options - the options that override the default options
   */
  type InitializedType<Options extends DataFieldOptions<object>> = DataField.DerivedInitializedType<
    object,
    MergedOptions<Options>
  >;

  /**
   * A helper to create a flags object field for the given key in the {@link FlagConfig}.
   * @typeParam Key            - the key to look for in the FlagConfig
   * @typeParam ExtensionFlags - additional flags besides the ones configured for the class
   * @typeParam Options        - the options of the field
   */
  type FlagsField<
    Key extends string,
    ExtensionFlags extends object = {},
    Options extends DataFieldOptions.Any = {},
  > = ObjectField<
    Options,
    DataField.DerivedAssignmentType<ConfiguredFlags<Key> & ExtensionFlags, MergedOptions<Options>>,
    DataField.DerivedInitializedType<ConfiguredFlags<Key> & ExtensionFlags, MergedOptions<Options>>,
    DataField.DerivedInitializedType<ConfiguredFlags<Key> & ExtensionFlags, MergedOptions<Options>>
  >;
}

/**
 * A subclass of [DataField]{@link DataField} which deals with array-typed data.
 * @typeParam ElementFieldType       - the field type for the elements in the ArrayField
 * @typeParam AssignmentElementType  - the assignment type for the elements in the array
 * @typeParam InitializedElementType - the initialized type for the elements in the array
 * @typeParam Options                - the options of the ArrayField instance
 * @typeParam AssignmentType         - the type of the allowed assignment values of the ArrayField
 * @typeParam InitializedType        - the type of the initialized values of the ArrayField
 * @typeParam PersistedElementType   - the persisted type for the elements in the array
 * @typeParam PersistedType          - the type of the persisted values of the ArrayField
 * @remarks
 * Defaults:
 * AssignmentType: `ArrayField.BaseAssignmentType<AssignmentElementType> | null | undefined`
 * InitializedType: `InitializedElementType[]`
 * PersistedType: `PersistedElementType[]`
 * InitialValue: `[]`
 */
declare class ArrayField<
  const ElementFieldType extends DataField.Any | Document.AnyConstructor,
  const AssignmentElementType = ArrayField.AssignmentElementType<ElementFieldType>,
  const InitializedElementType = ArrayField.InitializedElementType<ElementFieldType>,
  const Options extends ArrayField.Options<AssignmentElementType> = ArrayField.DefaultOptions<AssignmentElementType>,
  const AssignmentType = ArrayField.AssignmentType<AssignmentElementType, Options>,
  const InitializedType = ArrayField.InitializedType<AssignmentElementType, InitializedElementType, Options>,
  const PersistedElementType = ArrayField.PersistedElementType<ElementFieldType>,
  const PersistedType extends PersistedElementType[] | null | undefined = ArrayField.PersistedType<
    AssignmentElementType,
    PersistedElementType,
    Options
  >,
> extends DataField<Options, AssignmentType, InitializedType, PersistedType> {
  /**
   * @param element - A DataField instance which defines the type of element contained in the Array.
   * @param options - Options which configure the behavior of the field
   */
  constructor(element: ElementFieldType, options?: Options);

  /** @defaultValue `true` */
  override required: boolean;

  /** @defaultValue `false` */
  override nullable: boolean;

  /** @defaultValue `() => []` */
  override initial: DataFieldOptions.InitialType<InitializedType>;

  /**
   * The data type of each element in this array
   */
  element: ElementFieldType;

  protected static override get _defaults(): ArrayField.Options<
    ArrayField.AssignmentElementType<DataField.Any | Document.AnyConstructor>
  >;

  /** @defaultValue `true` */
  static override recursive: boolean;

  /**
   * Validate the contained element type of the ArrayField
   * @param element - The type of Array element
   * @returns The validated element type
   * @throws An error if the element is not a valid type
   */
  protected static _validateElementType<T extends DataField.Any>(element: T): T;

  protected override _validateModel(data: object, options?: object): void;

  protected override _cast(value: AssignmentType): InitializedType;

  protected override _cleanType(value: InitializedType, options?: DataField.CleanOptions): InitializedType;

  protected override _validateType(
    value: InitializedType,
    options?: DataField.ValidationOptions<DataField.Any>,
  ): boolean | void;

  /**
   * Validate every element of the ArrayField
   * @param value   - The array to validate
   * @param options - Validation options
   * @returns An array of element-specific errors
   */
  protected _validateElements(
    value: any[],
    options?: DataField.ValidationOptions<DataField.Any>,
  ): DataModelValidationFailure | void;

  /**
   * Validate a single element of the ArrayField.
   * @param value   - The value of the array element
   * @param options - Validation options
   * @returns A validation failure if the element failed validation
   */
  protected _validateElement(
    value: any,
    options: DataField.ValidationOptions<DataField.Any>,
  ): DataModelValidationFailure | void;

  override initialize(value: PersistedType, model: DataModel.Any): InitializedType | (() => InitializedType | null);

  override toObject(value: InitializedType): PersistedType;

  // TODO: Limit to the keys of `this` that are actually callable.
  override apply<Value, Options, Return>(
    fn: keyof this | ((this: this, value: Value, options: Options) => Return),
    value: Value,
    options?: Options,
  ): Return;

  protected override _getField(path: string[]): unknown;

  /**
   * Migrate this field's candidate source data.
   * @param sourceData - Candidate source data of the root model
   * @param fieldData  - The value of this field within the source data
   */
  migrateSource(sourceData: object, fieldData: unknown): unknown;
}

declare namespace ArrayField {
  /**
   * A shorthand for the options of an ArrayField class.
   * @typeParam AssignmentElementType - the assignment type of the elements in the array
   */
  type Options<AssignmentElementType> = DataFieldOptions<BaseAssignmentType<AssignmentElementType>>;

  /**
   * The base assignment type for the {@link ArrayField} class.
   * @typeParam AssignmentElementType - the assignment type of the elements in the array
   */
  type BaseAssignmentType<AssignmentElementType> =
    | Record<number | string, AssignmentElementType>
    | Iterable<AssignmentElementType>
    | AssignmentElementType[]
    | AssignmentElementType;

  /**
   * The type of the default options for the {@link ArrayField} class.
   * @typeParam AssignmentElementType - the assignment type of the elements in the array
   */
  type DefaultOptions<AssignmentElementType> = SimpleMerge<
    DataField.DefaultOptions,
    {
      required: true;
      nullable: false;
      initial: () => AssignmentElementType[];
    }
  >;

  /**
   * A helper type for the given options type merged into the default options of the ArrayField class.
   * @typeParam AssignmentElementType - the assignment type of the elements of the ArrayField
   * @typeParam Opts                  - the options that override the default options
   */
  type MergedOptions<AssignmentElementType, Opts extends Options<AssignmentElementType>> = SimpleMerge<
    DefaultOptions<AssignmentElementType>,
    Opts
  >;

  /**
   * A type to infer the assignment element type of an ArrayField from its ElementFieldType.
   * @typeParam ElementFieldType - the DataField type of the elements in the ArrayField
   */
  type AssignmentElementType<ElementFieldType extends DataField.Any | Document.AnyConstructor> =
    ElementFieldType extends DataField<any, infer Assign, any, any>
      ? Assign
      : ElementFieldType extends new (...args: any[]) => Document<infer Schema extends DataSchema, any, any>
        ? SchemaField.InnerAssignmentType<Schema>
        : never;

  /**
   * A type to infer the initialized element type of an ArrayField from its ElementFieldType.
   * @typeParam ElementFieldType - the DataField type of the elements in the ArrayField
   */
  type InitializedElementType<ElementFieldType extends DataField.Any | Document.AnyConstructor> =
    ElementFieldType extends DataField<any, any, infer Init, any>
      ? Init
      : ElementFieldType extends new (...args: any[]) => Document<infer Schema extends DataSchema, any, any>
        ? SchemaField.InnerInitializedType<Schema>
        : never;

  /**
   * A type to infer the initialized element type of an ArrayField from its ElementFieldType.
   * @typeParam ElementFieldType - the DataField type of the elements in the ArrayField
   */
  type PersistedElementType<ElementFieldType extends DataField.Any | Document.AnyConstructor> =
    ElementFieldType extends DataField<any, any, any, infer Persist>
      ? Persist
      : ElementFieldType extends new (...args: any[]) => Document<infer Schema extends DataSchema, any, any>
        ? SchemaField.InnerPersistedType<Schema>
        : never;

  /**
   * A shorthand for the assignment type of an ArrayField class.
   * @typeParam AssignmentElementType - the assignment type of the elements of the ArrayField
   * @typeParam Opts                  - the options that override the default options
   */
  type AssignmentType<
    AssignmentElementType,
    Opts extends Options<AssignmentElementType>,
  > = DataField.DerivedAssignmentType<
    BaseAssignmentType<AssignmentElementType>,
    MergedOptions<AssignmentElementType, Opts>
  >;

  /**
   * A shorthand for the initialized type of an ArrayField class.
   * @typeParam AssignmentElementType  - the assignment type of the elements of the ArrayField
   * @typeParam InitializedElementType - the initialized type of the elements of the ArrayField
   * @typeParam Opts                   - the options that override the default options
   */
  type InitializedType<
    AssignmentElementType,
    InitializedElementType,
    Opts extends Options<AssignmentElementType>,
  > = DataField.DerivedInitializedType<InitializedElementType[], MergedOptions<AssignmentElementType, Opts>>;

  /**
   * A shorthand for the persisted type of an ArrayField class.
   * @typeParam AssignmentElementType - the assignment type of the elements of the ArrayField
   * @typeParam PersistedElementType  - the perssited type of the elements of the ArrayField
   * @typeParam Opts                  - the options that override the default options
   */
  type PersistedType<
    AssignmentElementType,
    PersistedElementType,
    Opts extends Options<AssignmentElementType>,
  > = DataField.DerivedInitializedType<PersistedElementType[], MergedOptions<AssignmentElementType, Opts>>;
}

/**
 * A subclass of [ArrayField]{@link ArrayField} which supports a set of contained elements.
 * Elements in this set are treated as fungible and may be represented in any order or discarded if invalid.
 * @typeParam ElementFieldType       - the field type for the elements in the SetField
 * @typeParam AssignmentElementType  - the assignment type for the elements in the set
 * @typeParam InitializedElementType - the initialized type for the elements in the set
 * @typeParam Options                - the options of the SetField instance
 * @typeParam AssignmentType         - the type of the allowed assignment values of the SetField
 * @typeParam InitializedType        - the type of the initialized values of the SetField
 * @typeParam PersistedElementType   - the persisted type for the elements in the set
 * @typeParam PersistedType          - the type of the persisted values of the SetField
 * @remarks
 * Defaults:
 * AssignmentType: `SetField.BaseAssignmentType<AssignmentElementType> | null | undefined`
 * InitializedType: `Set<InitializedElementType>`
 * PersistedType: `PersistedElementType[]`
 * InitialValue: `new Set()`
 */
declare class SetField<
  ElementFieldType extends DataField.Any,
  AssignmentElementType = ArrayField.AssignmentElementType<ElementFieldType>,
  InitializedElementType = ArrayField.InitializedElementType<ElementFieldType>,
  Options extends SetField.Options<AssignmentElementType> = SetField.DefaultOptions<AssignmentElementType>,
  AssignmentType = SetField.AssignmentType<AssignmentElementType, Options>,
  InitializedType = SetField.InitializedType<AssignmentElementType, InitializedElementType, Options>,
  PersistedElementType = ArrayField.PersistedElementType<ElementFieldType>,
  PersistedType extends PersistedElementType[] | null | undefined = SetField.PersistedType<
    AssignmentElementType,
    PersistedElementType,
    Options
  >,
> extends ArrayField<
  ElementFieldType,
  AssignmentElementType,
  InitializedElementType,
  Options,
  AssignmentType,
  InitializedType,
  PersistedElementType,
  PersistedType
> {
  protected override _validateElements(
    value: any[],
    options?: DataField.ValidationOptions<DataField.Any>,
  ): void | DataModelValidationFailure;

  override initialize(value: PersistedType, model: DataModel.Any): InitializedType | (() => InitializedType | null);

  override toObject(value: InitializedType): PersistedType;
}

declare namespace SetField {
  /** Any SetField */
  type Any = SetField<DataField.Any, any, any, any, any, any, any, any>;

  /**
   * A shorthand for the options of a SetField class.
   * @typeParam AssignmentElementType - the assignment type of the elements in the array
   */
  type Options<AssignmentElementType> = DataFieldOptions<SetField.BaseAssignmentType<AssignmentElementType>>;

  /**
   * The base assignment type for the {@link SetField} class.
   * @typeParam AssignmentElementType - the assignment type of the elements in the array
   */
  type BaseAssignmentType<AssignmentElementType> = ArrayField.BaseAssignmentType<AssignmentElementType>;

  /**
   * The type of the default options for the {@link SetField} class.
   * @typeParam AssignmentElementType - the assignment type of the elements in the array
   */
  type DefaultOptions<AssignmentElementType> = ArrayField.DefaultOptions<AssignmentElementType>;

  /**
   * A helper type for the given options type merged into the default options of the SetField class.
   * @typeParam AssignmentElementType - the assignment type of the elements of the SetField
   * @typeParam Opts                  - the options that override the default options
   */
  type MergedOptions<AssignmentElementType, Opts extends Options<AssignmentElementType>> = SimpleMerge<
    DefaultOptions<AssignmentElementType>,
    Opts
  >;

  /**
   * A shorthand for the assignment type of a SetField class.
   * @typeParam AssignmentElementType - the assignment type of the elements of the SetField
   * @typeParam Opts                  - the options that override the default options
   */
  type AssignmentType<
    AssignmentElementType,
    Opts extends Options<AssignmentElementType>,
  > = DataField.DerivedAssignmentType<
    BaseAssignmentType<AssignmentElementType>,
    MergedOptions<AssignmentElementType, Opts>
  >;

  /**
   * A shorthand for the initialized type of a SetField class.
   * @typeParam AssignmentElementType - the assignment type of the elements of the SetField
   * @typeParam InitializedElementType - the initialized type of the elements of the SetField
   * @typeParam Opts                  - the options that override the default options
   */
  type InitializedType<
    AssignmentElementType,
    InitializedElementType,
    Opts extends Options<AssignmentElementType>,
  > = DataField.DerivedInitializedType<Set<InitializedElementType>, MergedOptions<AssignmentElementType, Opts>>;

  /**
   * A shorthand for the persisted type of a SetField class.
   * @typeParam AssignmentElementType - the assignment type of the elements of the SetField
   * @typeParam PersistedElementType  - the perssited type of the elements of the SetField
   * @typeParam Opts                  - the options that override the default options
   */
  type PersistedType<
    AssignmentElementType,
    PersistedElementType,
    Opts extends Options<AssignmentElementType>,
  > = DataField.DerivedInitializedType<PersistedElementType[], MergedOptions<AssignmentElementType, Opts>>;
}

/**
 * A subclass of [ObjectField]{@link ObjectField} which embeds some other DataModel definition as an inner object.
 * @typeParam ModelType       - the DataModel for the embedded data
 * @typeParam Options         - the options of the EmbeddedDataField instance
 * @typeParam AssignmentType  - the type of the allowed assignment values of the EmbeddedDataField
 * @typeParam InitializedType - the type of the initialized values of the EmbeddedDataField
 * @typeParam PersistedType   - the type of the persisted values of the EmbeddedDataField
 * @remarks
 * Defaults:
 * AssignmentType: `SchemaField.AssignmentType<ModelType["schema"]["fields"]> | null | undefined`
 * InitializedType: `SchemaField.InitializedType<ModelType["schema"]["fields"]>`
 * PersistedType: `SchemaField.PersistedType<ModelType["schema"]["fields"]>`
 * InitialValue: `{}`
 */
declare class EmbeddedDataField<
  const ModelType extends DataModel.Any,
  const Options extends EmbeddedDataField.Options<ModelType> = EmbeddedDataField.DefaultOptions,
  const AssignmentType = EmbeddedDataField.AssignmentType<ModelType, Options>,
  const InitializedType = EmbeddedDataField.InitializedType<ModelType, Options>,
  const PersistedType extends object | null | undefined = EmbeddedDataField.PersistedType<ModelType, Options>,
> extends SchemaField<DataModel.SchemaFor<ModelType>, Options, AssignmentType, InitializedType, PersistedType> {
  /**
   * @param model   - The class of DataModel which should be embedded in this field
   * @param options - Options which configure the behavior of the field
   */
  constructor(model: ConstructorOf<ModelType>, options?: Options);

  /**
   * The embedded DataModel definition which is contained in this field.
   */
  model: ConstructorOf<ModelType>;

  protected override _initialize(fields: DataSchema): DataSchema;

  override initialize(value: PersistedType, model: DataModel.Any): InitializedType | (() => InitializedType | null);

  override toObject(value: InitializedType): PersistedType;

  /**
   * Migrate this field's candidate source data.
   * @param sourceData - Candidate source data of the root model
   * @param fieldData  - The value of this field within the source data
   */
  migrateSource(sourceData: object, fieldData: unknown): unknown;

  protected override _validateModel(data: object, options?: object): void;
}

declare namespace EmbeddedDataField {
  /**
   * A shorthand for the options of an EmbeddedDataField class.
   * @typeParam ModelType - the DataModel for the embedded data
   */
  type Options<ModelType extends DataModel.Any> = DataFieldOptions<
    SchemaField.InnerAssignmentType<DataModel.SchemaFor<ModelType>>
  >;

  /** The type of the default options for the {@link EmbeddedDataField} class. */
  type DefaultOptions = SchemaField.DefaultOptions;

  /**
   * A helper type for the given options type merged into the default options of the EmbeddedDataField class.
   * @typeParam ModelType - the DataModel for the embedded data
   * @typeParam Opts      - the options that override the default options
   */
  type MergedOptions<ModelType extends DataModel.Any, Opts extends Options<ModelType>> = SimpleMerge<
    DefaultOptions,
    Opts
  >;

  /**
   * A shorthand for the assignment type of an EmbeddedDataField class.
   * @typeParam ModelType - the DataModel for the embedded data
   * @typeParam Opts      - the options that override the default options
   */
  type AssignmentType<
    ModelType extends DataModel.Any,
    Opts extends Options<ModelType>,
  > = DataField.DerivedAssignmentType<
    SchemaField.InnerAssignmentType<DataModel.SchemaFor<ModelType>>,
    MergedOptions<ModelType, Opts>
  >;

  /**
   * A shorthand for the initialized type of an EmbeddedDataField class.
   * @typeParam ModelType - the DataModel for the embedded data
   * @typeParam Opts      - the options that override the default options
   */
  // FIXME: Schema is unsure in src\foundry\common\data\data.d.mts
  type InitializedType<
    ModelType extends DataModel.Any,
    Opts extends Options<ModelType>,
  > = DataField.DerivedInitializedType<
    SchemaField.InnerInitializedType<DataModel.SchemaFor<ModelType>>,
    MergedOptions<ModelType, Opts>
  >;

  /**
   * A shorthand for the persisted type of an EmbeddedDataField class.
   * @typeParam ModelType - the DataModel for the embedded data
   * @typeParam Opts      - the options that override the default options
   */
  type PersistedType<
    ModelType extends DataModel.Any,
    Opts extends Options<ModelType>,
  > = DataField.DerivedInitializedType<
    SchemaField.InnerPersistedType<DataModel.SchemaFor<ModelType>>,
    MergedOptions<ModelType, Opts>
  >;
}

/**
 * A subclass of [ArrayField]{@link ArrayField} which supports an embedded Document collection.
 * Invalid elements will be dropped from the collection during validation rather than failing for the field entirely.
 * @typeParam ElementFieldType       - the field type for the elements in the EmbeddedCollectionField
 * @typeParam AssignmentElementType  - the assignment type for the elements in the collection
 * @typeParam InitializedElementType - the initialized type for the elements in the collection
 * @typeParam Options                - the options of the EmbeddedCollectionField instance
 * @typeParam AssignmentType         - the type of the allowed assignment values of the EmbeddedCollectionField
 * @typeParam InitializedType        - the type of the initialized values of the EmbeddedCollectionField
 * @typeParam PersistedElementType   - the persisted type for the elements in the collection
 * @typeParam PersistedType          - the type of the persisted values of the EmbeddedCollectionField
 * @remarks
 * Defaults:
 * AssignmentType: `ArrayField.BaseAssignmentType<AssignmentElementType> | null | undefined`
 * InitializedType: `Collection<InitializedElementType>`
 * PersistedType: `PersistedElementType[]`
 * InitialValue: `[]`
 */
declare class EmbeddedCollectionField<
  ElementFieldType extends Document.AnyConstructor,
  ParentDataModel extends Document.Any,
  AssignmentElementType = EmbeddedCollectionField.AssignmentElementType<ElementFieldType>,
  InitializedElementType extends Document.Any = EmbeddedCollectionField.InitializedElementType<ElementFieldType>,
  Options extends
    EmbeddedCollectionField.Options<AssignmentElementType> = EmbeddedCollectionField.DefaultOptions<AssignmentElementType>,
  AssignmentType = EmbeddedCollectionField.AssignmentType<AssignmentElementType, Options>,
  InitializedType = EmbeddedCollectionField.InitializedType<
    AssignmentElementType,
    InitializedElementType,
    ParentDataModel,
    Options
  >,
  PersistedElementType = EmbeddedCollectionField.PersistedElementType<ElementFieldType>,
  PersistedType extends PersistedElementType[] | null | undefined = EmbeddedCollectionField.PersistedType<
    AssignmentElementType,
    PersistedElementType,
    Options
  >,
> extends ArrayField<
  ElementFieldType,
  AssignmentElementType,
  InitializedElementType,
  Options,
  AssignmentType,
  InitializedType,
  PersistedElementType,
  PersistedType
> {
  /**
   * @param element - The type of Document which belongs to this embedded collection
   * @param options - Options which configure the behavior of the field
   */
  constructor(element: ElementFieldType, options?: Options);

  /** @defaultValue `true` */
  override readonly: true;

  protected static override _validateElementType<T extends DataField.Any | Document.AnyConstructor>(element: T): T;

  /**
   * The Collection implementation to use when initializing the collection.
   */
  static get implementation(): typeof EmbeddedCollection;

  /** @defaultValue `true` */
  static override hierarchical: boolean;

  /**
   * A reference to the DataModel subclass of the embedded document element
   */
  get model(): typeof Document;

  /**
   * The DataSchema of the contained Document model.
   */
  get schema(): this["model"]["schema"];

  protected override _cleanType(value: InitializedType, options?: DataField.CleanOptions): InitializedType;

  protected override _validateElements(
    value: any[],
    options?: DataField.ValidationOptions<DataField.Any>,
  ): DataModelValidationFailure | void;

  override initialize(value: PersistedType, model: DataModel.Any): InitializedType | (() => InitializedType | null);

  override toObject(value: InitializedType): PersistedType;

  override apply<Value, Options, Return>(
    fn: keyof this | ((this: this, value: Value, options: Options) => Return),
    value: Value,
    options?: Options,
  ): Return;

  /**
   * Migrate this field's candidate source data.
   * @param sourceData - Candidate source data of the root model
   * @param fieldData  - The value of this field within the source data
   */
  migrateSource(sourceData: object, fieldData: unknown): unknown;

  /**
   * Return the embedded document(s) as a Collection.
   * @param parent - The parent document.
   */
  getCollection<P extends Document.Any>(parent: P): Collection<P>;
}

declare namespace EmbeddedCollectionField {
  /**
   * A shorthand for the options of an EmbeddedCollectionField class.
   * @typeParam AssignmentElementType - the assignment type of the elements of the EmbeddedCollectionField
   */
  type Options<AssignmentElementType> = DataFieldOptions<ArrayField.BaseAssignmentType<AssignmentElementType>>;

  /**
   * The type of the default options for the {@link EmbeddedCollectionField} class.
   * @typeParam AssignmentElementType - the assignment type of the elements of the EmbeddedCollectionField
   */
  type DefaultOptions<AssignmentElementType> = ArrayField.DefaultOptions<AssignmentElementType>;

  /**
   * A helper type for the given options type merged into the default options of the EmbeddedCollectionField class.
   * @typeParam AssignmentElementType - the assignment type of the elements of the EmbeddedCollectionField
   * @typeParam Opts                  - the options that override the default options
   */
  type MergedOptions<AssignmentElementType, Opts extends Options<AssignmentElementType>> = SimpleMerge<
    DefaultOptions<AssignmentElementType>,
    Opts
  >;

  /**
   * A type to infer the assignment element type of an EmbeddedCollectionField from its ElementFieldType.
   * @typeParam ElementFieldType - the DataField type of the elements in the EmbeddedCollectionField
   */
  type AssignmentElementType<ElementFieldType extends Document.AnyConstructor> = ElementFieldType extends new (
    ...args: any[]
  ) => Document<infer Schema extends DataSchema, any, any>
    ? SchemaField.InnerAssignmentType<Schema>
    : never;

  /**
   * A type to infer the initialized element type of an EmbeddedCollectionField from its ElementFieldType.
   * @typeParam ElementFieldType - the DataField type of the elements in the EmbeddedCollectionField
   */
  type InitializedElementType<ElementFieldType extends Document.AnyConstructor> = InstanceType<
    ConfiguredDocumentClass<ElementFieldType>
  >;

  /**
   * A type to infer the initialized element type of an EmbeddedCollectionField from its ElementFieldType.
   * @typeParam ElementFieldType - the DataField type of the elements in the EmbeddedCollectionField
   */
  type PersistedElementType<ElementFieldType extends Document.AnyConstructor> = ElementFieldType extends new (
    ...args: any[]
  ) => Document<infer Schema extends DataSchema, any, any>
    ? SchemaField.InnerPersistedType<Schema>
    : never;

  /**
   * A shorthand for the assignment type of an ArrayField class.
   * @typeParam AssignmentElementType - the assignment type of the elements of the EmbeddedCollectionField
   * @typeParam Opts                  - the options that override the default options
   */
  type AssignmentType<
    AssignmentElementType,
    Opts extends Options<AssignmentElementType>,
  > = DataField.DerivedAssignmentType<
    ArrayField.BaseAssignmentType<AssignmentElementType>,
    MergedOptions<AssignmentElementType, Opts>
  >;

  /**
   * A shorthand for the initialized type of an ArrayField class.
   * @typeParam AssignmentElementType  - the assignment type of the elements of the EmbeddedCollectionField
   * @typeParam InitializedElementType - the initialized type of the elements of the EmbeddedCollectionField
   * @typeParam Opts                   - the options that override the default options
   */
  type InitializedType<
    AssignmentElementType,
    InitializedElementType extends Document.Any,
    ParentDataModel extends Document.Any,
    Opts extends Options<AssignmentElementType>,
  > = DataField.DerivedInitializedType<
    EmbeddedCollection<InitializedElementType, ParentDataModel>,
    MergedOptions<AssignmentElementType, Opts>
  >;

  /**
   * A shorthand for the persisted type of an ArrayField class.
   * @typeParam AssignmentElementType - the assignment type of the elements of the EmbeddedCollectionField
   * @typeParam PersistedElementType  - the perssited type of the elements of the EmbeddedCollectionField
   * @typeParam Opts                  - the options that override the default options
   */
  type PersistedType<
    AssignmentElementType,
    PersistedElementType,
    Opts extends Options<AssignmentElementType>,
  > = DataField.DerivedInitializedType<PersistedElementType[], MergedOptions<AssignmentElementType, Opts>>;
}

/**
 * A subclass of {@link EmbeddedCollectionField} which manages a collection of delta objects relative to another
 * collection.
 * @typeParam ElementFieldType       - the field type for the elements in the EmbeddedCollectionDeltaField
 * @typeParam AssignmentElementType  - the assignment type for the elements in the collection
 * @typeParam InitializedElementType - the initialized type for the elements in the collection
 * @typeParam Options                - the options of the EmbeddedCollectionDeltaField instance
 * @typeParam AssignmentType         - the type of the allowed assignment values of the EmbeddedCollectionDeltaField
 * @typeParam InitializedType        - the type of the initialized values of the EmbeddedCollectionDeltaField
 * @typeParam PersistedElementType   - the persisted type for the elements in the collection
 * @typeParam PersistedType          - the type of the persisted values of the EmbeddedCollectionDeltaField
 * @remarks
 * Defaults:
 * AssignmentType: `ArrayField.BaseAssignmentType<AssignmentElementType> | null | undefined`
 * InitializedType: `Collection<InitializedElementType>`
 * PersistedType: `PersistedElementType[]`
 * InitialValue: `[]`
 */
declare class EmbeddedCollectionDeltaField<
  ElementFieldType extends Document.AnyConstructor,
  ParentDataModel extends Document.Any,
  AssignmentElementType = EmbeddedCollectionDeltaField.AssignmentElementType<ElementFieldType>,
  InitializedElementType extends Document.Any = EmbeddedCollectionDeltaField.InitializedElementType<ElementFieldType>,
  Options extends
    EmbeddedCollectionDeltaField.Options<AssignmentElementType> = EmbeddedCollectionDeltaField.DefaultOptions<AssignmentElementType>,
  AssignmentType = EmbeddedCollectionDeltaField.AssignmentType<AssignmentElementType, Options>,
  InitializedType = EmbeddedCollectionDeltaField.InitializedType<
    AssignmentElementType,
    InitializedElementType,
    ParentDataModel,
    Options
  >,
  PersistedElementType = EmbeddedCollectionDeltaField.PersistedElementType<ElementFieldType>,
  PersistedType extends PersistedElementType[] | null | undefined = EmbeddedCollectionDeltaField.PersistedType<
    AssignmentElementType,
    PersistedElementType,
    Options
  >,
> extends EmbeddedCollectionField<
  ElementFieldType,
  ParentDataModel,
  AssignmentElementType,
  InitializedElementType,
  Options,
  AssignmentType,
  InitializedType,
  PersistedElementType,
  PersistedType
> {
  static override get implementation(): typeof EmbeddedCollectionDelta;

  protected override _cleanType(value: InitializedType, options?: DataField.CleanOptions): InitializedType;

  protected override _validateElements(
    value: any[],
    options?: DataField.ValidationOptions<DataField.Any>,
  ): void | DataModelValidationFailure;
}

declare namespace EmbeddedCollectionDeltaField {
  /**
   * A shorthand for the options of an EmbeddedCollectionDeltaField class.
   * @typeParam AssignmentElementType - the assignment type of the elements of the EmbeddedCollectionDeltaField
   */
  type Options<AssignmentElementType> = DataFieldOptions<ArrayField.BaseAssignmentType<AssignmentElementType>>;

  /**
   * The type of the default options for the {@link EmbeddedCollectionDeltaField} class.
   * @typeParam AssignmentElementType - the assignment type of the elements of the EmbeddedCollectionDeltaField
   */
  type DefaultOptions<AssignmentElementType> = ArrayField.DefaultOptions<AssignmentElementType>;

  /**
   * A helper type for the given options type merged into the default options of the EmbeddedCollectionDeltaField class.
   * @typeParam AssignmentElementType - the assignment type of the elements of the EmbeddedCollectionDeltaField
   * @typeParam Opts                  - the options that override the default options
   */
  type MergedOptions<AssignmentElementType, Opts extends Options<AssignmentElementType>> = SimpleMerge<
    DefaultOptions<AssignmentElementType>,
    Opts
  >;

  /**
   * A type to infer the assignment element type of an EmbeddedCollectionDeltaField from its ElementFieldType.
   * @typeParam ElementFieldType - the DataField type of the elements in the EmbeddedCollectionDeltaField
   */
  type AssignmentElementType<ElementFieldType extends Document.AnyConstructor> = ElementFieldType extends new (
    ...args: any[]
  ) => Document<infer Schema extends DataSchema, any, any>
    ? SchemaField.InnerAssignmentType<Schema>
    : never;

  /**
   * A type to infer the initialized element type of an EmbeddedCollectionDeltaField from its ElementFieldType.
   * @typeParam ElementFieldType - the DataField type of the elements in the EmbeddedCollectionDeltaField
   */
  type InitializedElementType<ElementFieldType extends Document.AnyConstructor> = InstanceType<
    ConfiguredDocumentClass<ElementFieldType>
  >;

  /**
   * A type to infer the initialized element type of an EmbeddedCollectionDeltaField from its ElementFieldType.
   * @typeParam ElementFieldType - the DataField type of the elements in the EmbeddedCollectionDeltaField
   */
  type PersistedElementType<ElementFieldType extends Document.AnyConstructor> = ElementFieldType extends new (
    ...args: any[]
  ) => Document<infer Schema extends DataSchema, any, any>
    ? SchemaField.InnerPersistedType<Schema>
    : never;

  /**
   * A shorthand for the assignment type of an ArrayField class.
   * @typeParam AssignmentElementType - the assignment type of the elements of the EmbeddedCollectionDeltaField
   * @typeParam Opts                  - the options that override the default options
   */
  type AssignmentType<
    AssignmentElementType,
    Opts extends Options<AssignmentElementType>,
  > = DataField.DerivedAssignmentType<
    ArrayField.BaseAssignmentType<AssignmentElementType>,
    MergedOptions<AssignmentElementType, Opts>
  >;

  /**
   * A shorthand for the initialized type of an ArrayField class.
   * @typeParam AssignmentElementType  - the assignment type of the elements of the EmbeddedCollectionDeltaField
   * @typeParam InitializedElementType - the initialized type of the elements of the EmbeddedCollectionDeltaField
   * @typeParam Opts                   - the options that override the default options
   */
  type InitializedType<
    AssignmentElementType,
    InitializedElementType extends Document.Any,
    ParentDataModel extends Document.Any,
    Opts extends Options<AssignmentElementType>,
  > = DataField.DerivedInitializedType<
    EmbeddedCollectionDelta<InitializedElementType, ParentDataModel>,
    MergedOptions<AssignmentElementType, Opts>
  >;

  /**
   * A shorthand for the persisted type of an ArrayField class.
   * @typeParam AssignmentElementType - the assignment type of the elements of the EmbeddedCollectionDeltaField
   * @typeParam PersistedElementType  - the perssited type of the elements of the EmbeddedCollectionDeltaField
   * @typeParam Opts                  - the options that override the default options
   */
  type PersistedType<
    AssignmentElementType,
    PersistedElementType,
    Opts extends Options<AssignmentElementType>,
  > = DataField.DerivedInitializedType<PersistedElementType[], MergedOptions<AssignmentElementType, Opts>>;
}

/**
 * A subclass of {@link EmbeddedDataField} which supports a single embedded Document.
 * @typeParam DocumentType    - the type of the embedded Document
 * @typeParam Options         - the options of the EmbeddedDocumentField instance
 * @typeParam AssignmentType  - the type of the allowed assignment values of the EmbeddedDocumentField
 * @typeParam InitializedType - the type of the initialized values of the EmbeddedDocumentField
 * @typeParam PersistedType   - the type of the persisted values of the EmbeddedDocumentField
 * @remarks
 * Defaults:
 * AssignmentType: `SchemaField.AssignmentType<DocumentType["schema"]["fields"]> | null | undefined`
 * InitializedType: `SchemaField.InitializedType<DocumentType["schema"]["fields"]> | null`
 * PersistedType: `SchemaField.PersistedType<DocumentType["schema"]["fields"]> | null`
 * InitialValue: `{}`
 */
declare class EmbeddedDocumentField<
  const DocumentType extends Document.Any,
  const Options extends EmbeddedDocumentField.Options<DocumentType> = EmbeddedDocumentField.DefaultOptions,
  const AssignmentType = EmbeddedDocumentField.AssignmentType<DocumentType, Options>,
  const InitializedType = EmbeddedDocumentField.InitializedType<DocumentType, Options>,
  const PersistedType extends object | null | undefined = EmbeddedDocumentField.PersistedType<DocumentType, Options>,
> extends EmbeddedDataField<DocumentType, Options, AssignmentType, InitializedType, PersistedType> {
  /**
   * @param model   - The type of Document which is embedded.
   * @param options - Options which configure the behavior of the field.
   */
  constructor(model: ConstructorOf<DocumentType>, options?: Options);

  /** @defaultValue `true` */
  override nullable: boolean;

  protected static override get _defaults(): EmbeddedDocumentField.Options<Document.Any>;

  /** @defaultValue `true` */
  static override hierarchical: boolean;

  override initialize(value: PersistedType, model: DataModel.Any): InitializedType | (() => InitializedType | null);

  /**
   * Return the embedded document(s) as a Collection.
   * @param parent - The parent document.
   */
  getCollection<P extends Document.Any>(parent: P): Collection<P>;
}

declare namespace EmbeddedDocumentField {
  /**
   * A shorthand for the options of an EmbeddedDocumentField class.
   * @typeParam DocumentType - the type of the embedded Document
   */
  type Options<DocumentType extends Document.Any> = DataFieldOptions<
    SchemaField.InnerAssignmentType<DataModel.SchemaFor<DocumentType>>
  >;

  /** The type of the default options for the {@link EmbeddedDocumentField} class. */
  type DefaultOptions = SimpleMerge<
    EmbeddedDataField.DefaultOptions,
    {
      nullable: true;
    }
  >;

  /**
   * A helper type for the given options type merged into the default options of the EmbeddedDocumentField class.
   * @typeParam DocumentType - the type of the embedded Document
   * @typeParam Opts         - the options that override the default options
   */
  type MergedOptions<DocumentType extends Document.Any, Opts extends Options<DocumentType>> = SimpleMerge<
    DefaultOptions,
    Opts
  >;

  /**
   * A shorthand for the assignment type of an EmbeddedDocumentField class.
   * @typeParam DocumentType - the type of the embedded Document
   * @typeParam Opts         - the options that override the default options
   */
  type AssignmentType<
    DocumentType extends Document.Any,
    Opts extends Options<DocumentType>,
  > = DataField.DerivedAssignmentType<
    SchemaField.InnerAssignmentType<DataModel.SchemaFor<DocumentType>>,
    MergedOptions<DocumentType, Opts>
  >;

  /**
   * A shorthand for the initialized type of an EmbeddedDocumentField class.
   * @typeParam DocumentType - the type of the embedded Document
   * @typeParam Opts         - the options that override the default options
   */
  type InitializedType<
    DocumentType extends Document.Any,
    Opts extends Options<DocumentType>,
  > = DataField.DerivedInitializedType<
    SchemaField.InnerInitializedType<DataModel.SchemaFor<DocumentType>>,
    MergedOptions<DocumentType, Opts>
  >;

  /**
   * A shorthand for the persisted type of an EmbeddedDocumentField class.
   * @typeParam DocumentType - the type of the embedded Document
   * @typeParam Opts         - the options that override the default options
   */
  type PersistedType<
    DocumentType extends Document.Any,
    Opts extends Options<DocumentType>,
  > = DataField.DerivedInitializedType<
    SchemaField.InnerPersistedType<DataModel.SchemaFor<DocumentType>>,
    MergedOptions<DocumentType, Opts>
  >;
}

/**
 * A subclass of [StringField]{@link StringField} which provides the primary _id for a Document.
 * The field may be initially null, but it must be non-null when it is saved to the database.
 * @typeParam Options         - the options of the DocumentIdField instance
 * @typeParam AssignmentType  - the type of the allowed assignment values of the DocumentIdField
 * @typeParam InitializedType - the type of the initialized values of the DocumentIdField
 * @typeParam PersistedType   - the type of the persisted values of the DocumentIdField
 * @remarks
 * Defaults:
 * AssignmentType: `string | Document.Any | null | undefined`
 * InitializedType: `string | null`
 * PersistedType: `string | null`
 * InitialValue: `null`
 */
declare class DocumentIdField<
  Options extends StringFieldOptions = DocumentIdField.DefaultOptions,
  AssignmentType = DocumentIdField.AssignmentType<Options>,
  InitializedType = DocumentIdField.InitializedType<Options>,
  PersistedType extends string | null | undefined = DocumentIdField.InitializedType<Options>,
> extends StringField<Options, AssignmentType, InitializedType, PersistedType> {
  /** @defaultValue `true` */
  override required: boolean;

  /** @defaultValue `false` */
  override blank: boolean;

  /** @defaultValue `true` */
  override nullable: boolean;

  /** @defaultValue `null` */
  override initial: DataFieldOptions.InitialType<InitializedType>;

  /** @defaultValue `true` */
  override readonly: boolean;

  /** @defaultValue `"is not a valid Document ID string"` */
  override validationError: string;

  protected static override get _defaults(): StringFieldOptions;

  protected override _cast(value: AssignmentType): InitializedType;

  protected override _validateType(
    value: InitializedType,
    options?: DataField.ValidationOptions<DataField.Any>,
  ): boolean | void;
}

declare namespace DocumentIdField {
  /** The type of the default options for the {@link DocumentIdField} class. */
  type DefaultOptions = SimpleMerge<
    StringField.DefaultOptions,
    {
      required: true;
      blank: false;
      nullable: true;
      initial: null;
      readonly: true;
      validationError: "is not a valid Document ID string";
    }
  >;

  /**
   * A helper type for the given options type merged into the default options of the DocumentIdField class.
   * @typeParam Options - the options that override the default options
   */
  type MergedOptions<Options extends StringFieldOptions> = SimpleMerge<DefaultOptions, Options>;

  /**
   * A shorthand for the assignment type of a StringField class.
   * @typeParam Options - the options that override the default options
   */
  type AssignmentType<Options extends StringFieldOptions> = DataField.DerivedAssignmentType<
    string | Document.Any,
    MergedOptions<Options>
  >;

  /**
   * A shorthand for the initialized type of a StringField class.
   * @typeParam Options - the options that override the default options
   */
  type InitializedType<Options extends StringFieldOptions> = DataField.DerivedInitializedType<
    string,
    MergedOptions<Options>
  >;
}

/**
 * A special class of [StringField]{@link StringField} field which references another DataModel by its id.
 * This field may also be null to indicate that no foreign model is linked.
 * @typeParam DocumentType    - the type of the foreign document constructor
 * @typeParam Options         - the options for the ForeignDocumentField
 * @typeParam AssignmentType  - the type of the allowed assignment values of the ForeignDocumentField
 * @typeParam InitializedType - the type of the initialized values of the ForeignDocumentField
 * @typeParam PersistedType   - the type of the persisted values of the ForeignDocumentField
 * @remarks
 * Defaults:
 * AssignmentType: `string | InstanceType<DocumentType> | null | undefined`
 * InitializedType: `InstanceType<DocumentType> | null`
 * PersistedType: `string | null`
 * InitialValue: `null`
 */
declare class ForeignDocumentField<
  DocumentType extends Document.Any,
  Options extends ForeignDocumentField.Options = ForeignDocumentField.DefaultOptions,
  AssignmentType = ForeignDocumentField.AssignmentType<DocumentType, Options>,
  InitializedType = ForeignDocumentField.InitializedType<DocumentType, Options>,
  PersistedType extends string | null | undefined = ForeignDocumentField.PersistedType<Options>,
> extends DocumentIdField<Options, AssignmentType, InitializedType, PersistedType> {
  /**
   * @param model   - The foreign DataModel class definition which this field should link to.
   * @param options - Options which configure the behavior of the field
   */
  constructor(model: ConstructorOf<DocumentType>, options?: Options);

  /** @defaultValue `true` */
  override nullable: boolean;

  /** @defaultValue `false` */
  override readonly: boolean;

  /** @defaultValue `false` */
  idOnly: boolean;

  /**
   * A reference to the model class which is stored in this field
   */
  model: ConstructorOf<DocumentType>;

  protected static override get _defaults(): ForeignDocumentField.Options;

  protected override _cast(value: AssignmentType): InitializedType;

  override initialize(value: PersistedType, model: DataModel.Any): InitializedType | (() => InitializedType | null);

  override toObject(value: InitializedType): PersistedType;
}

declare namespace ForeignDocumentField {
  /** The options for the ForeignDocumentField class. */
  type Options = StringFieldOptions &
    DataFieldOptions<string | Document.Any> & {
      // Making this ---------^ more concrete leads to excessively deep instantiation
      idOnly?: boolean;
    };

  /** The type of the default options for the {@link ForeignDocumentField} class. */
  type DefaultOptions = SimpleMerge<
    DocumentIdField.DefaultOptions,
    {
      nullable: true;
      readonly: false;
      idOnly: false;
    }
  >;

  /**
   * A helper type for the given options type merged into the default options of the ForeignDocumentField class.
   * @typeParam Opts - the options that override the default options
   */
  type MergedOptions<Opts extends Options> = SimpleMerge<DefaultOptions, Opts>;

  /**
   * A shorthand for the assignment type of a ForeignDocumentField class.
   * @typeParam Opts - the options that override the default options
   */
  type AssignmentType<DocumentType extends Document.Any, Opts extends Options> = DataField.DerivedAssignmentType<
    string | DocumentType,
    MergedOptions<Opts>
  >;

  /**
   * A shorthand for the initialized type of a ForeignDocumentField class.
   * @typeParam Opts - the options that override the default options
   */
  type InitializedType<DocumentType extends Document.Any, Opts extends Options> = DataField.DerivedInitializedType<
    Opts["idOnly"] extends true ? string : InstanceType<ConfiguredDocumentClassForName<DocumentType["documentName"]>>,
    MergedOptions<Opts>
  >;

  /**
   * A shorthand for the persisted type of a ForeignDocumentField class.
   * @typeParam Opts - the options that override the default options
   */
  type PersistedType<Opts extends Options> = DataField.DerivedInitializedType<string, MergedOptions<Opts>>;
}

/**
 * A special [StringField]{@link StringField} which records a standardized CSS color string.
 * @typeParam Options         - the options of the ColorField instance
 * @typeParam AssignmentType  - the type of the allowed assignment values of the ColorField
 * @typeParam InitializedType - the type of the initialized values of the ColorField
 * @typeParam PersistedType   - the type of the persisted values of the ColorField
 * @remarks
 * Defaults:
 * AssignmentType: `string | null | undefined`
 * InitializedType: `string | null`
 * PersistedType: `string | null`
 * InitialValue: `null`
 */
declare class ColorField<
  Options extends StringFieldOptions = ColorField.DefaultOptions,
  AssignmentType = ColorField.AssignmentType<Options>,
  InitializedType = ColorField.InitializedType<Options>,
  PersistedType extends string | null | undefined = ColorField.InitializedType<Options>,
> extends StringField<Options, AssignmentType, InitializedType, PersistedType> {
  /** @defaultValue `true` */
  override nullable: boolean;

  /** @defaultValue `null` */
  override initial: DataFieldOptions.InitialType<InitializedType>;

  /** @defaultValue `false` */
  override blank: boolean;

  /** @defaultValue `"is not a valid hexadecimal color string"` */
  override validationError: string;

  protected static override get _defaults(): StringFieldOptions;

  override clean(value: AssignmentType, options?: DataField.CleanOptions): InitializedType;

  protected override _validateType(
    value: InitializedType,
    options?: DataField.ValidationOptions<DataField.Any>,
  ): boolean | void;
}

declare namespace ColorField {
  /** The type of the default options for the {@link ColorField} class. */
  type DefaultOptions = SimpleMerge<
    StringField.DefaultOptions,
    {
      nullable: true;
      initial: null;
      blank: false;
      validationError: "is not a valid hexadecimal color string";
    }
  >;

  /**
   * A helper type for the given options type merged into the default options of the ColorField class.
   * @typeParam Options - the options that override the default options
   */
  type MergedOptions<Options extends StringFieldOptions> = SimpleMerge<DefaultOptions, Options>;

  /**
   * A shorthand for the assignment type of a ColorField class.
   * @typeParam Options - the options that override the default options
   */
  type AssignmentType<Options extends StringFieldOptions> = DataField.DerivedAssignmentType<
    string,
    MergedOptions<Options>
  >;

  /**
   * A shorthand for the initialized type of a ColorField class.
   * @typeParam Options - the options that override the default options
   */
  type InitializedType<Options extends StringFieldOptions> = DataField.DerivedInitializedType<
    string,
    MergedOptions<Options>
  >;
}

declare global {
  /**
   * @typeParam Value  - the type of the value of the field
   */
  interface FilePathFieldOptions extends StringFieldOptions {
    /**
     * A set of categories in CONST.FILE_CATEGORIES which this field supports
     * @defaultValue `[]`
     */
    categories?: (keyof typeof CONST.FILE_CATEGORIES)[];

    /**
     * Is embedded base64 data supported in lieu of a file path?
     * @defaultValue `false`
     */
    base64?: boolean;

    /**
     * Does this file path field allow wildcard characters?
     * @defaultValue `false`
     */
    wildcard?: boolean;
  }
}

/**
 * A special [StringField]{@link StringField} which records a file path or inline base64 data.
 * @typeParam Options         - the options of the FilePathField instance
 * @typeParam AssignmentType  - the type of the allowed assignment values of the FilePathField
 * @typeParam InitializedType - the type of the initialized values of the FilePathField
 * @typeParam PersistedType   - the type of the persisted values of the FilePathField
 * @remarks
 * Defaults:
 * AssignmentType: `string | null | undefined`
 * InitializedType: `string | null`
 * PersistedType: `string | null`
 * InitialValue: `null`
 */
declare class FilePathField<
  Options extends FilePathFieldOptions = FilePathField.DefaultOptions,
  AssignmentType = FilePathField.AssignmentType<Options>,
  InitializedType = FilePathField.InitializedType<Options>,
  PersistedType extends string | null | undefined = FilePathField.InitializedType<Options>,
> extends StringField<Options, AssignmentType, InitializedType, PersistedType> {
  /**
   * @param options - Options which configure the behavior of the field
   */
  constructor(options?: Options);

  /**
   * A set of categories in CONST.FILE_CATEGORIES which this field supports
   * @defaultValue `[]`
   */
  categories: (keyof typeof CONST.FILE_CATEGORIES)[];

  /**
   * Is embedded base64 data supported in lieu of a file path?
   * @defaultValue `false`
   */
  base64: boolean;

  /**
   * Does this file path field allow wildcard characters?
   * @defaultValue `false`
   */
  wildcard: boolean;

  /** @defaultValue `true` */
  override nullable: boolean;

  /** @defaultValue `false` */
  override blank: boolean;

  /** @defaultValue `null` */
  override initial: DataFieldOptions.InitialType<InitializedType>;

  protected static override get _defaults(): FilePathFieldOptions;

  override clean(value: AssignmentType, options?: DataField.CleanOptions): InitializedType;

  protected override _validateType(
    value: InitializedType,
    options?: DataField.ValidationOptions<DataField.Any>,
  ): boolean | void;
}

declare namespace FilePathField {
  /** The type of the default options for the {@link FilePathField} class. */
  type DefaultOptions = SimpleMerge<
    StringField.DefaultOptions,
    {
      categories: (keyof typeof CONST.FILE_CATEGORIES)[];
      base64: false;
      wildcard: false;
      nullable: true;
      blank: false;
      initial: null;
    }
  >;

  /**
   * A helper type for the given options type merged into the default options of the FilePathField class.
   * @typeParam Options - the options that override the default options
   */
  type MergedOptions<Options extends StringFieldOptions> = SimpleMerge<DefaultOptions, Options>;

  /**
   * A shorthand for the assignment type of a FilePathField class.
   * @typeParam Options - the options that override the default options
   */
  type AssignmentType<Options extends StringFieldOptions> = DataField.DerivedAssignmentType<
    string,
    MergedOptions<Options>
  >;

  /**
   * A shorthand for the initialized type of a FilePathField class.
   * @typeParam Options - the options that override the default options
   */
  type InitializedType<Options extends StringFieldOptions> = DataField.DerivedInitializedType<
    string,
    MergedOptions<Options>
  >;
}

/**
 * A special [NumberField]{@link NumberField} which represents an angle of rotation in degrees between 0 and 360.
 * @typeParam Options         - the options of the AngleField instance
 * @typeParam AssignmentType  - the type of the allowed assignment values of the AngleField
 * @typeParam InitializedType - the type of the initialized values of the AngleField
 * @typeParam PersistedType   - the type of the persisted values of the AngleField
 * @remarks
 * Defaults:
 * AssignmentType: `number | null | undefined`
 * InitializedType: `number`
 * PersistedType: `number`
 * InitialValue: `0`
 */
declare class AngleField<
  Options extends NumberFieldOptions = AngleField.DefaultOptions,
  AssignmentType = AngleField.AssignmentType<Options>,
  InitializedType = AngleField.InitializedType<Options>,
  PersistedType extends number | null | undefined = AngleField.InitializedType<Options>,
> extends NumberField<Options, AssignmentType, InitializedType, PersistedType> {
  /** @defaultValue `true` */
  override required: boolean;

  /** @defaultValue `false` */
  override nullable: boolean;

  /** @defaultValue `0` */
  override initial: DataFieldOptions.InitialType<InitializedType>;

  /** @defaultValue `0` */
  base: number;

  /** @defaultValue `0` */
  override min: number | undefined;

  /** @defaultValue `360` */
  override max: number | undefined;

  /** @defaultValue `"is not a number between 0 and 360"` */
  override validationError: string;

  protected static override get _defaults(): NumberFieldOptions;

  protected override _cast(value: AssignmentType): InitializedType;
}

declare namespace AngleField {
  /** The type of the default options for the {@link AngleField} class. */
  type DefaultOptions = SimpleMerge<
    NumberField.DefaultOptions,
    {
      required: true;
      nullable: false;
      initial: 0;
      base: 0;
      min: 0;
      max: 360;
      validationError: "is not a number between 0 and 360";
    }
  >;

  /**
   * A helper type for the given options type merged into the default options of the AngleField class.
   * @typeParam Options - the options that override the default options
   */
  type MergedOptions<Options extends NumberFieldOptions> = SimpleMerge<DefaultOptions, Options>;

  /**
   * A shorthand for the assignment type of a AngleField class.
   * @typeParam Options - the options that override the default options
   */
  type AssignmentType<Options extends NumberFieldOptions> = DataField.DerivedAssignmentType<
    number,
    MergedOptions<Options>
  >;

  /**
   * A shorthand for the initialized type of a AngleField class.
   * @typeParam Options - the options that override the default options
   */
  type InitializedType<Options extends NumberFieldOptions> = DataField.DerivedInitializedType<
    number,
    MergedOptions<Options>
  >;
}

/**
 * A special [NumberField]{@link NumberField} represents a number between 0 and 1.
 * @typeParam Options         - the options of the AlphaField instance
 * @typeParam AssignmentType  - the type of the allowed assignment values of the AlphaField
 * @typeParam InitializedType - the type of the initialized values of the AlphaField
 * @typeParam PersistedType   - the type of the persisted values of the AlphaField
 * @remarks
 * Defaults:
 * AssignmentType: `number | null | undefined`
 * InitializedType: `number`
 * PersistedType: `number`
 * InitialValue: `1`
 */
declare class AlphaField<
  Options extends NumberFieldOptions = AlphaField.DefaultOptions,
  AssignmentType = AlphaField.AssignmentType<Options>,
  InitializedType = AlphaField.InitializedType<Options>,
  PersistedType extends number | null | undefined = AlphaField.InitializedType<Options>,
> extends NumberField<Options, AssignmentType, InitializedType, PersistedType> {
  /** @defaultValue `true` */
  override required: boolean;

  /** @defaultValue `false` */
  override nullable: boolean;

  /** @defaultValue `1` */
  override initial: DataFieldOptions.InitialType<InitializedType>;

  /** @defaultValue `0` */
  override min: number | undefined;

  /** @defaultValue `1` */
  override max: number | undefined;

  /** @defaultValue `"is not a number between 0 and 1"` */
  override validationError: string;

  protected static override get _defaults(): NumberFieldOptions;
}

declare namespace AlphaField {
  /** The type of the default options for the {@link AlphaField} class. */
  type DefaultOptions = SimpleMerge<
    NumberField.DefaultOptions,
    {
      required: true;
      nullable: false;
      initial: 1;
      min: 0;
      max: 1;
      validationError: "is not a number between 0 and 1";
    }
  >;

  /**
   * A helper type for the given options type merged into the default options of the AlphaField class.
   * @typeParam Options - the options that override the default options
   */
  type MergedOptions<Options extends NumberFieldOptions> = SimpleMerge<DefaultOptions, Options>;

  /**
   * A shorthand for the assignment type of a AlphaField class.
   * @typeParam Options - the options that override the default options
   */
  type AssignmentType<Options extends NumberFieldOptions> = DataField.DerivedAssignmentType<
    number,
    MergedOptions<Options>
  >;

  /**
   * A shorthand for the initialized type of a AlphaField class.
   * @typeParam Options - the options that override the default options
   */
  type InitializedType<Options extends NumberFieldOptions> = DataField.DerivedInitializedType<
    number,
    MergedOptions<Options>
  >;
}

/**
 * A special [ObjectField]{@link ObjectField} which captures a mapping of User IDs to Document permission levels.
 * @typeParam Options         - the options of the DocumentOwnershipField instance
 * @typeParam AssignmentType  - the type of the allowed assignment values of the DocumentOwnershipField
 * @typeParam InitializedType - the type of the initialized values of the DocumentOwnershipField
 * @typeParam PersistedType   - the type of the persisted values of the DocumentOwnershipField
 * @remarks
 * Defaults:
 * AssignmentType: `Record<string, DOCUMENT_OWNERSHIP_LEVELS> | null | undefined`
 * InitializedType: `Record<string, DOCUMENT_OWNERSHIP_LEVELS>`
 * PersistedType: `Record<string, DOCUMENT_OWNERSHIP_LEVELS>`
 * InitialValue: `{ default: DOCUMENT_OWNERSHIP_LEVELS.NONE }`
 */
declare class DocumentOwnershipField<
  Options extends DocumentOwnershipField.Options = DocumentOwnershipField.DefaultOptions,
  AssignmentType = DocumentOwnershipField.AssignmentType<Options>,
  InitializedType = DocumentOwnershipField.InitializedType<Options>,
  PersistedType extends
    | Record<string, DOCUMENT_OWNERSHIP_LEVELS>
    | null
    | undefined = DocumentOwnershipField.InitializedType<Options>,
> extends ObjectField<Options, AssignmentType, InitializedType, PersistedType> {
  /** @defaultValue `{"default": DOCUMENT_OWNERSHIP_LEVELS.NONE}` */
  override initial: DataFieldOptions.InitialType<InitializedType>;

  /** @defaultValue `"is not a mapping of user IDs and document permission levels"` */
  override validationError: string;

  protected static override get _defaults(): DocumentOwnershipField.Options;

  protected override _validateType(
    value: InitializedType,
    options?: DataField.ValidationOptions<DataField.Any> | undefined,
  ): boolean | void;
}

declare namespace DocumentOwnershipField {
  /** A shorthand for the options of a DocumentOwnershipField class. */
  type Options = DataFieldOptions<Record<string, DOCUMENT_OWNERSHIP_LEVELS>>;

  /** The type of the default options for the {@link DocumentOwnershipField} class. */
  type DefaultOptions = SimpleMerge<
    ObjectField.DefaultOptions,
    {
      initial: Record<string, DOCUMENT_OWNERSHIP_LEVELS>;
      validationError: "is not a mapping of user IDs and document permission levels";
    }
  >;

  /**
   * A helper type for the given options type merged into the default options of the ObjectField class.
   * @typeParam Opts - the options that override the default options
   */
  type MergedOptions<Opts extends Options> = SimpleMerge<DefaultOptions, Opts>;

  /**
   * A shorthand for the assignment type of a ObjectField class.
   * @typeParam Opts - the options that override the default options
   */
  type AssignmentType<Opts extends Options> = DataField.DerivedAssignmentType<
    Record<string, DOCUMENT_OWNERSHIP_LEVELS>,
    MergedOptions<Opts>
  >;

  /**
   * A shorthand for the initialized type of a ObjectField class.
   * @typeParam Opts - the options that override the default options
   */
  type InitializedType<Opts extends Options> = DataField.DerivedInitializedType<
    Record<string, DOCUMENT_OWNERSHIP_LEVELS>,
    MergedOptions<Opts>
  >;
}

/**
 * A special [StringField]{@link StringField} which contains serialized JSON data.
 * @typeParam Options         - the options of the JSONField instance
 * @typeParam AssignmentType  - the type of the allowed assignment values of the JSONField
 * @typeParam InitializedType - the type of the initialized values of the JSONField
 * @typeParam PersistedType   - the type of the persisted values of the JSONField
 * @remarks
 * Defaults:
 * AssignmentType: `string | null | undefined`
 * InitializedType: `object | undefined`
 * PersistedType: `string | undefined`
 * InitialValue: `undefined`
 */
declare class JSONField<
  Options extends StringFieldOptions = JSONField.DefaultOptions,
  AssignmentType = JSONField.AssignmentType<Options>,
  InitializedType = JSONField.InitializedType<Options>,
  PersistedType extends string | null | undefined = JSONField.PersistedType<Options>,
> extends StringField<Options, AssignmentType, InitializedType, PersistedType> {
  /** @defaultValue `false` */
  override blank: boolean;

  /** @defaultValue `undefined` */
  override initial: DataFieldOptions.InitialType<InitializedType>;

  /** @defaultValue `"is not a valid JSON string"` */
  override validationError: string;

  protected static override get _defaults(): StringFieldOptions;

  override clean(value: AssignmentType, options?: DataField.CleanOptions): InitializedType;

  protected override _validateType(
    value: InitializedType,
    options?: DataField.ValidationOptions<DataField.Any>,
  ): boolean | void;

  override initialize(value: PersistedType, model: DataModel.Any): InitializedType | (() => InitializedType | null);

  override toObject(value: InitializedType): PersistedType;
}

declare namespace JSONField {
  /** The type of the default options for the {@link JSONField} class. */
  type DefaultOptions = SimpleMerge<
    StringField.DefaultOptions,
    {
      blank: false;
      initial: undefined;
      validationError: "is not a valid JSON string";
    }
  >;

  /**
   * A helper type for the given options type merged into the default options of the JSONField class.
   * @typeParam Options - the options that override the default options
   */
  type MergedOptions<Options extends StringFieldOptions> = SimpleMerge<DefaultOptions, Options>;

  /**
   * A shorthand for the assignment type of a JSONField class.
   * @typeParam Options - the options that override the default options
   */
  type AssignmentType<Options extends StringFieldOptions> = DataField.DerivedAssignmentType<
    string,
    MergedOptions<Options>
  >;

  /**
   * A shorthand for the initialized type of a JSONField class.
   * @typeParam Options - the options that override the default options
   */
  type InitializedType<Options extends StringFieldOptions> = DataField.DerivedInitializedType<
    object,
    MergedOptions<Options>
  >;

  /**
   * A shorthand for the persisted type of a JSONField class.
   * @typeParam Options - the options that override the default options
   */
  type PersistedType<Options extends StringFieldOptions> = DataField.DerivedInitializedType<
    string,
    MergedOptions<Options>
  >;
}

/**
 * A subclass of [StringField]{@link StringField} which contains a sanitized HTML string.
 * This class does not override any StringField behaviors, but is used by the server-side to identify fields which
 * require sanitization of user input.
 * @typeParam Options         - the options of the HTMLField instance
 * @typeParam AssignmentType  - the type of the allowed assignment values of the HTMLField
 * @typeParam InitializedType - the type of the initialized values of the HTMLField
 * @typeParam PersistedType   - the type of the persisted values of the HTMLField
 * @remarks
 * Defaults:
 * AssignmentType: `string | null | undefined`
 * InitializedType: `string`
 * PersistedType: `string`
 * InitialValue: `""`
 */
declare class HTMLField<
  Options extends StringFieldOptions = HTMLField.DefaultOptions,
  AssignmentType = HTMLField.AssignmentType<Options>,
  InitializedType = HTMLField.InitializedType<Options>,
  PersistedType extends string | null | undefined = HTMLField.InitializedType<Options>,
> extends StringField<Options, AssignmentType, InitializedType, PersistedType> {
  /** @defaultValue `true` */
  override required: boolean;

  /** @defaultValue `true` */
  override blank: boolean;

  protected static override get _defaults(): StringFieldOptions;
}

declare namespace HTMLField {
  /** The type of the default options for the {@link HTMLField} class. */
  type DefaultOptions = SimpleMerge<
    StringField.DefaultOptions,
    {
      required: true;
      blank: true;
    }
  >;

  /**
   * A helper type for the given options type merged into the default options of the HTMLField class.
   * @typeParam Options - the options that override the default options
   */
  type MergedOptions<Options extends StringFieldOptions> = SimpleMerge<DefaultOptions, Options>;

  /**
   * A shorthand for the assignment type of a HTMLField class.
   * @typeParam Options - the options that override the default options
   */
  type AssignmentType<Options extends StringFieldOptions> = DataField.DerivedAssignmentType<
    string,
    MergedOptions<Options>
  >;

  /**
   * A shorthand for the initialized type of a HTMLField class.
   * @typeParam Options - the options that override the default options
   */
  type InitializedType<Options extends StringFieldOptions> = DataField.DerivedInitializedType<
    string,
    MergedOptions<Options>
  >;
}

/**
 * A subclass of {@link NumberField} which is used for storing integer sort keys.
 * @typeParam Options         - the options of the IntegerSortField instance
 * @typeParam AssignmentType  - the type of the allowed assignment values of the IntegerSortField
 * @typeParam InitializedType - the type of the initialized values of the IntegerSortField
 * @typeParam PersistedType   - the type of the persisted values of the IntegerSortField
 * @remarks
 * Defaults:
 * AssignmentType: `number | null | undefined`
 * InitializedType: `number`
 * PersistedType: `number`
 * InitialValue: `0`
 */
declare class IntegerSortField<
  Options extends NumberFieldOptions = IntegerSortField.DefaultOptions,
  AssignmentType = IntegerSortField.AssignmentType<Options>,
  InitializedType = IntegerSortField.InitializedType<Options>,
  PersistedType extends number | null | undefined = IntegerSortField.InitializedType<Options>,
> extends NumberField<Options, AssignmentType, InitializedType, PersistedType> {
  /** @defaultValue `true` */
  override required: boolean;

  /** @defaultValue `false` */
  override nullable: boolean;

  /** @defaultValue `true` */
  override integer: boolean;

  /** @defaultValue `0` */
  override initial: DataFieldOptions.InitialType<InitializedType>;

  /** @defaultValue `"FOLDER.DocumentSort"` */
  override label: string;

  /** @defaultValue `"FOLDER.DocumentSortHint"` */
  override hint: string;
}

declare namespace IntegerSortField {
  /** The type of the default options for the {@link IntegerSortField} class. */
  type DefaultOptions = SimpleMerge<
    DataField.DefaultOptions,
    {
      required: true;
      nullable: false;
      integer: true;
      initial: 0;
      label: "FOLDER.DocumentSort";
      hint: "FOLDER.DocumentSortHint";
    }
  >;

  /**
   * A helper type for the given options type merged into the default options of the IntegerSortField class.
   * @typeParam Options - the options that override the default options
   */
  type MergedOptions<Options extends NumberFieldOptions> = SimpleMerge<DefaultOptions, Options>;

  /**
   * A shorthand for the assignment type of a IntegerSortField class.
   * @typeParam Options - the options that override the default options
   */
  type AssignmentType<Options extends NumberFieldOptions> = DataField.DerivedAssignmentType<
    number,
    MergedOptions<Options>
  >;

  /**
   * A shorthand for the initialized type of a IntegerSortField class.
   * @typeParam Options - the options that override the default options
   */
  type InitializedType<Options extends NumberFieldOptions> = DataField.DerivedInitializedType<
    number,
    MergedOptions<Options>
  >;
}

declare global {
  type DocumentStats = DocumentStatsField.Properties;
}

/**
 * A subclass of {@link SchemaField} which stores document metadata in the _stats field.
 * @typeParam Options         - the options of the DocumentStatsField instance
 * @typeParam AssignmentType  - the type of the allowed assignment values of the DocumentStatsField
 * @typeParam InitializedType - the type of the initialized values of the DocumentStatsField
 * @typeParam PersistedType   - the type of the persisted values of the DocumentStatsField
 * @remarks
 * Defaults:
 * AssignmentType: `Partial<DocumentStats> | null | undefined`
 * InitializedType: `DocumentStats`
 * PersistedType: `object`
 * InitialValue:
 * ```typescript
 * {
 *   systemId: null,
 *   systemVersion: null,
 *   coreVersion: null,
 *   createdTime: null,
 *   modifiedTime: null,
 *   lastModifiedBy: null
 * }
 * ```
 */
declare class DocumentStatsField<
  Options extends DocumentStatsField.Options = DocumentStatsField.DefaultOptions,
  AssignmentType = DocumentStatsField.AssignmentType<Options>,
  InitializedType = DocumentStatsField.InitializedType<Options>,
  PersistedType extends object | null | undefined = DocumentStatsField.PersistedType<Options>,
> extends SchemaField<DocumentStatsField.Schema, Options, AssignmentType, InitializedType, PersistedType> {
  constructor(options?: Options);
}

declare namespace DocumentStatsField {
  /** A shorthand for the options of a DocumentStatsField class. */
  type Options = DataFieldOptions<SchemaField.InnerAssignmentType<Schema>>;

  /** The type of the default options for the {@link DocumentStatsField} class. */
  type DefaultOptions = SimpleMerge<SchemaField.DefaultOptions, { initial: SchemaField.InnerAssignmentType<Schema> }>;

  /**
   * A helper type for the given options type merged into the default options of the {@link DocumentStatsField} class.
   * @typeParam Opts - the options that override the default options
   */
  type MergedOptions<Opts extends Options> = SimpleMerge<DefaultOptions, Opts>;

  /**
   * A shorthand for the assignment type of a DocumentStatsField class.
   * @typeParam Opts - the options that override the default options
   */
  type AssignmentType<Opts extends Options = DefaultOptions> = DataField.DerivedAssignmentType<
    SchemaField.InnerAssignmentType<Schema>,
    MergedOptions<Opts>
  >;

  /**
   * A shorthand for the assignment type of a DocumentStatsField class.
   * @typeParam Opts - the options that override the default options
   */
  type InitializedType<Opts extends Options = DefaultOptions> = DataField.DerivedInitializedType<
    SchemaField.InnerInitializedType<Schema>,
    MergedOptions<Opts>
  >;

  /**
   * A shorthand for the assignment type of a DocumentStatsField class.
   * @typeParam Opts - the options that override the default options
   */
  type PersistedType<Opts extends Options = DefaultOptions> = DataField.DerivedInitializedType<
    SchemaField.InnerPersistedType<Schema>,
    MergedOptions<Opts>
  >;

  type ConstructorData = SchemaField.InnerConstructorType<Schema>;
  type Properties = SchemaField.InnerInitializedType<Schema>;
  type Source = SchemaField.InnerPersistedType<Schema>;

  interface Schema extends DataSchema {
    /**
     * The package name of the system the Document was created in.
     * @defaultValue `null`
     */
    systemId: StringField<{ required: true; blank: false; nullable: true; initial: null }>;

    /**
     * The version of the system the Document was created in.
     * @defaultValue `null`
     */
    systemVersion: StringField<{ required: true; blank: false; nullable: true; initial: null }>;

    /**
     * The core version the Document was created in.
     * @defaultValue `null`
     */
    coreVersion: StringField<{ required: true; blank: false; nullable: true; initial: null }>;

    /**
     * A timestamp of when the Document was created.
     * @defaultValue `null`
     */
    createdTime: NumberField;

    /**
     * A timestamp of when the Document was last modified.
     * @defaultValue `null`
     */
    modifiedTime: NumberField;

    /**
     * The ID of the user who last modified the Document.
     * @defaultValue `null`
     */
    lastModifiedBy: ForeignDocumentField<foundry.documents.BaseUser, { idOnly: true }>;
  }
}

/**
 * A subclass of [ObjectField]{@link ObjectField} which supports a type-specific data object.
 * @typeParam DocumentType    - the type of the embedded Document
 * @typeParam Options         - the options of the TypeDataField instance
 * @typeParam AssignmentType  - the type of the allowed assignment values of the TypeDataField
 * @typeParam InitializedType - the type of the initialized values of the TypeDataField
 * @typeParam PersistedType   - the type of the persisted values of the TypeDataField
 * @remarks
 * Defaults:
 * AssignmentType: `SchemaField.AssignmentType<DocumentType["schema"]["fields"]> | null | undefined`
 * InitializedType: `SchemaField.InitializedType<DocumentType["schema"]["fields"]>`
 * PersistedType: `SchemaField.PersistedType<DocumentType["schema"]["fields"]>`
 * InitialValue: `{}`
 */
declare class TypeDataField<
  const SystemDocument extends Document.SystemConstructor,
  const Options extends TypeDataField.Options<InstanceType<SystemDocument>> = TypeDataField.DefaultOptions,
  const AssignmentType = TypeDataField.AssignmentType<SystemDocument, Options>,
  const InitializedType = TypeDataField.InitializedType<SystemDocument, Options>,
  const PersistedType extends object | null | undefined = TypeDataField.PersistedType<SystemDocument, Options>,
> extends ObjectField<Options, AssignmentType, InitializedType, PersistedType> {
  /**
   * @param document - The base document class which belongs in this field
   * @param options  - Options which configure the behavior of the field
   */
  constructor(document: ConstructorOf<SystemDocument>, options?: Options);

  /** @defaultValue `true` */
  override required: boolean;

  /**
   * The canonical document name of the document type which belongs in this field
   */
  document: ConstructorOf<SystemDocument>;

  protected static override get _defaults(): TypeDataField.Options<Document.Any>;

  /** @defaultValue `true` */
  static override recursive: boolean;

  /**
   * Return the package that provides the sub-type for the given model.
   * @param model - The model instance created for this sub-type.
   */
  static getModelProvider(model: DataModel.Any): System | Module | null;

  /**
   * A convenience accessor for the name of the document type associated with this TypeDataField
   */
  get documentName(): string;

  /**
   * Get the DataModel definition that should be used for this type of document.
   * @param type - The Document instance type
   * @returns The DataModel class or null
   */
  getModelForType(type: string): ConstructorOf<DataModel.Any> | null;

  override getInitialValue(data: { type?: string }): InitializedType;

  protected override _cleanType(value: InitializedType, options?: DataField.CleanOptions): InitializedType;

  override initialize(value: PersistedType, model: DataModel.Any): InitializedType | (() => InitializedType | null);

  protected override _validateType(
    value: InitializedType,
    options?: DataField.ValidationOptions<DataField.Any>,
  ): boolean | void;

  protected override _validateModel(data: object, options?: object): void;

  override toObject(value: InitializedType): PersistedType;

  /**
   * Migrate this field's candidate source data.
   * @param sourceData - Candidate source data of the root model
   * @param fieldData  - The value of this field within the source data
   */
  migrateSource(sourceData: object, fieldData: unknown): unknown;
}

export declare namespace TypeDataField {
  /**
   * A shorthand for the options of a TypeDataField class.
   * @typeParam DocumentType - the type of the embedded Document
   */
  type Options<DocumentType extends Document.Any> = DataFieldOptions<
    SchemaField.InnerAssignmentType<DataModel.SchemaFor<DocumentType>>
  >;

  /** The type of the default options for the {@link TypeDataField} class. */
  type DefaultOptions = SimpleMerge<
    ObjectField.DefaultOptions,
    {
      required: true;
    }
  >;

  /**
   * A helper type for the given options type merged into the default options of the TypeDataField class.
   * @typeParam DocumentType - the type of the embedded Document
   * @typeParam Options - the options that override the default options
   */
  type MergedOptions<DocumentType extends Document.Any, Opts extends Options<DocumentType>> = SimpleMerge<
    DefaultOptions,
    Opts
  >;

  /**
   * Get the system DataModel configuration for a specific document type.
   * @typeParam DocumentType - the type of the Document this system data is for
   */
  type Config<DocumentType extends Document.SystemConstructor> =
    DocumentType["metadata"]["name"] extends keyof DataModelConfig
      ? DataModelConfig[DocumentType["metadata"]["name"]]
      : {};

  /**
   * Get the configured core and system type names for a specific document type.
   * @typeParam DocumentType - the type of the Document this data is for
   */
  type TypeNames<DocumentType extends Document.SystemConstructor> =
    | CoreTypeNames<DocumentType>
    | SystemTypeNames<DocumentType>;

  /**
   * Get the core type names for a specific document type.
   * @typeParam DocumentType - the type of the Document this data is for
   */
  type CoreTypeNames<DocumentType extends Document.SystemConstructor> =
    DocumentType["metadata"]["coreTypes"] extends string[]
      ? DocumentType["metadata"]["coreTypes"][number] | "base"
      : "base";

  /**
   * Get the configured system type names for a specific document type.
   * @typeParam DocumentType - the type of the Document this system data is for
   */
  type SystemTypeNames<DocumentType extends Document.SystemConstructor> = keyof Config<DocumentType>;

  /**
   * A shorthand for the assignment type of a TypeDataField class.
   * @typeParam DocumentType - the type of the embedded Document
   * @typeParam Options - the options that override the default options
   */
  type AssignmentType<
    SystemDocumentConstructor extends Document.SystemConstructor,
    Opts extends Options<InstanceType<SystemDocumentConstructor>>,
  > = DataField.DerivedAssignmentType<object, MergedOptions<InstanceType<SystemDocumentConstructor>, Opts>>;

  /**
   * A shorthand for the initialized type of a TypeDataField class.
   * @typeParam DocumentType - the type of the embedded Document
   * @typeParam Options - the options that override the default options
   */
  type InitializedType<
    SystemDocumentConstructor extends Document.SystemConstructor,
    Opts extends Options<InstanceType<SystemDocumentConstructor>>,
  > = DataField.DerivedInitializedType<
    ValueOf<Config<SystemDocumentConstructor>> | object,
    MergedOptions<InstanceType<SystemDocumentConstructor>, Opts>
  >;

  /**
   * A shorthand for the persisted type of a TypeDataField class.
   * @typeParam DocumentType - the type of the embedded Document
   * @typeParam Opts         - the options that override the default options
   */
  type PersistedType<
    SystemDocumentConstructor extends Document.SystemConstructor,
    Opts extends Options<InstanceType<SystemDocumentConstructor>>,
  > = DataField.DerivedInitializedType<object, MergedOptions<InstanceType<SystemDocumentConstructor>, Opts>>;
}

/**
 * @deprecated since v11; ModelValidationError is deprecated. Please use DataModelValidationError instead.
 * @typeParam Errors - the type of the errors contained in this error
 */
declare class ModelValidationError<
  Errors extends ModelValidationError.Errors = ModelValidationError.Errors,
> extends Error {
  /**
   * @deprecated since v11; ModelValidationError is deprecated. Please use DataModelValidationError instead.
   * @param errors - An array or object containing several errors.
   */
  constructor(errors: Errors);

  errors: Errors;

  /**
   * Collect all the errors into a single message for consumers who do not handle the ModelValidationError specially.
   * @param errors - The raw error structure
   * @returns A formatted error message
   */
  static formatErrors(errors: ModelValidationError.Errors): string;
}

declare namespace ModelValidationError {
  /**
   * @deprecated since v11; ModelValidationError is deprecated. Please use DataModelValidationError instead.
   */
  type Errors = Record<number | string | symbol, Error> | Error[] | string;
}

/**
 * @deprecated since v10, will be removed in v12
 */
export function systemDataField<const D extends Document.Any>(document: D): TypeDataField<D>;

/**
 * @deprecated since v10, will be removed in v12
 */
export function foreignDocumentField<Model extends Document.Any>(
  options: ForeignDocumentField.Options & { type: { model: Model } },
): ForeignDocumentField<Model>;

/**
 * @deprecated since v10, will be removed in v12
 */
// TODO: Fix the typing on Embedded
// export function embeddedCollectionField<Embedded extends typeof Document>(
//   document: Embedded,
//   options?: EmbeddedCollectionField.Options<Embedded>,
// ): EmbeddedCollectionField<Embedded>;

/**
 * @deprecated since v10, will be removed in v12
 */
export function field(
  field: { type: typeof String | typeof Number | typeof Boolean | typeof Object },
  options?: DataFieldOptions.Any,
): DataField;

export {
  AlphaField,
  AngleField,
  ArrayField,
  BooleanField,
  ColorField,
  DataField,
  DocumentIdField,
  DocumentOwnershipField,
  DocumentStatsField,
  EmbeddedCollectionDeltaField,
  EmbeddedCollectionField,
  EmbeddedDataField,
  EmbeddedDocumentField,
  FilePathField,
  ForeignDocumentField,
  HTMLField,
  IntegerSortField,
  JSONField,
  ModelValidationError,
  NumberField,
  ObjectField,
  SchemaField,
  SetField,
  StringField,
  TypeDataField,
};
