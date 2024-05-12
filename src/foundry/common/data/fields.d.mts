import type { ConfiguredFlags } from "../../../types/helperTypes.mts";
import type { SimpleMerge, ValueOf } from "../../../types/utils.d.mts";
import type { DataModel } from "../abstract/data.mts";
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
    required?: boolean;

    /**
     * Can this field have null values?
     * @defaultValue `false`
     */
    nullable?: boolean;

    /** The initial value of a field, or a function which assigns that initial value. */
    initial?: DataFieldOptions.InitialType<
      DataFieldOptions.InitialReturnType<BaseAssignmentType, this["nullable"], this["required"]>
    >;

    /** A data validation function which accepts one argument with the current value. */
    validate?: (
      this: DataField.Any,
      value: any,
      options?: DataField.ValidationOptions<DataField.Any>,
    ) => boolean | void;

    /** A localizable label displayed on forms which render this field. */
    label?: string;

    /** Localizable help text displayed on forms which render this field. */
    hint?: string;

    /**
     * A custom validation error string. When displayed will be prepended with the
     * document name, field name, and candidate value.
     */
    validationError?: string;
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

    /**
     * A helper type to extract the allowed choices out of options for a NumberField or StringField.
     * @typeParam ChoicesOpt - the type of the choices option
     */
    type Choices<
      ChoicesOpt extends
        | number[]
        | string[]
        | Record<number, string>
        | Record<string, string>
        | (() => number[] | Record<number, string>)
        | (() => string[] | Record<string, string>),
    > = ChoicesOpt extends () => any
      ? Choices<ReturnType<ChoicesOpt>>
      : ChoicesOpt extends number[] | string[]
        ? ValueOf<ChoicesOpt>
        : ChoicesOpt extends Record<number, string> | Record<string, string>
          ? keyof ChoicesOpt
          : never;
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
  Options extends DataFieldOptions.Any = DataField.DefaultOptions,
  AssignmentType = DataField.AssignmentType<Options>,
  InitializedType = DataField.InitializedType<Options>,
  PersistedType extends unknown | null | undefined = InitializedType,
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
  AssignmentType = SchemaField.AssignmentType<Fields, Options>,
  InitializedType = SchemaField.InitializedType<Fields, Options>,
  PersistedType extends object | null | undefined = SchemaField.PersistedType<Fields, Options>,
> extends DataField<Options, AssignmentType, InitializedType, PersistedType> {
  /**
   * @param fields  - The contained field definitions
   * @param options - Options which configure the behavior of the field
   */
  constructor(fields: Fields, options?: Options);

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

  protected override _cleanType(value: InitializedType, options?: DataField.CleanOptions | undefined): InitializedType;

  override initialize(value: PersistedType, model: DataModel.Any): InitializedType | (() => InitializedType | null);

  protected override _validateType(
    value: InitializedType,
    options?: DataField.ValidationOptions<DataField.Any> | undefined,
  ): boolean | void;

  protected override _validateModel(data: object, options?: object | undefined): void;

  override toObject(value: InitializedType): PersistedType;

  override apply<Value, Options, Return>(
    fn: keyof this | ((this: this, value: Value, options: Options) => Return),
    value: Value,
    options?: Options | undefined,
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

  /** Any SchemaField with flags. */
  type AnyWithFlags = SchemaField<
    {
      flags: ObjectField<
        {},
        Record<string, unknown> | null | undefined,
        Record<string, unknown>,
        Record<string, unknown>
      >;
    },
    any,
    any,
    any,
    any
  >;

  /**
   * Get the inner assignment type for the given DataSchema.
   * @typeParam Fields - the DataSchema fields of the SchemaField
   */
  type InnerAssignmentType<Fields extends DataSchema> = {
    [Key in keyof Fields]?: Fields[Key] extends DataField<any, infer AssignType, any, any>
      ? Fields[Key] extends SchemaField<infer SubSchema, any, any, any, any>
        ? InnerAssignmentType<SubSchema>
        : AssignType
      : never;
  };

  /**
   * Get the inner initialized type for the given DataSchema.
   * @typeParam Fields - the DataSchema fields of the SchemaField
   */
  type InnerInitializedType<Fields extends DataSchema> = {
    [Key in keyof Fields]: Fields[Key] extends DataField<any, any, infer InitType, any>
      ? Fields[Key] extends SchemaField<infer SubSchema, any, any, any, any>
        ? InnerInitializedType<SubSchema>
        : InitType
      : never;
  };

  /**
   * Get the inner persisted type for the given DataSchema.
   * @typeParam Fields - the DataSchema fields of the SchemaField
   */
  type InnerPersistedType<Fields extends DataSchema> = {
    [Key in keyof Fields]: Fields[Key] extends DataField<any, any, any, infer PersistType>
      ? Fields[Key] extends SchemaField<infer SubSchema, any, any, any, any>
        ? InnerPersistedType<SubSchema>
        : PersistType
      : never;
  };

  /** The type of the default options for the {@link SchemaField} class. */
  type DefaultOptions = SimpleMerge<
    DataField.DefaultOptions,
    {
      required: true;
      nullable: false;
      initial: object;
    }
  >;

  /**
   * A helper type for the given options type merged into the default options of the SchemaField class.
   * @typeParam Fields - the DataSchema fields of the SchemaField
   * @typeParam Opts   - the options that override the default options
   */
  type MergedOptions<Fields extends DataSchema, Opts extends Options<Fields>> = SimpleMerge<DefaultOptions, Opts>;

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
  Options extends BooleanField.Options = BooleanField.DefaultOptions,
  AssignmentType = BooleanField.AssignmentType<Options>,
  InitializedType = BooleanField.InitializedType<Options>,
  PersistedType extends boolean | null | undefined = BooleanField.InitializedType<Options>,
> extends DataField<Options, AssignmentType, InitializedType, PersistedType> {
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
    options?: DataField.ValidationOptions<DataField.Any> | undefined,
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
    integer?: boolean;

    /**
     * Must the number be positive?
     * @defaultValue `false`
     */
    positive?: boolean;

    /**
     * An array of values or an object of values/labels which represent
     * allowed choices for the field. A function may be provided which dynamically
     * returns the array of choices.
     * @defaultValue `undefined`
     */
    choices?: number[] | Record<number, string> | (() => number[] | Record<number, string>) | undefined;
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
  Options extends NumberFieldOptions = NumberField.DefaultOptions,
  AssignmentType = NumberField.AssignmentType<Options>,
  InitializedType = NumberField.InitializedType<Options>,
  PersistedType extends number | null | undefined = NumberField.InitializedType<Options>,
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

  protected override _cleanType(value: InitializedType, options?: DataField.CleanOptions | undefined): InitializedType;

  protected override _validateType(
    value: InitializedType,
    options?: DataField.ValidationOptions<DataField.Any> | undefined,
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
  Options extends DataFieldOptions<object> = ObjectField.DefaultOptions,
  AssignmentType = ObjectField.AssignmentType<Options>,
  InitializedType = ObjectField.InitializedType<Options>,
  PersistedType extends object | null | undefined = ObjectField.InitializedType<Options>,
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
    options?: DataField.ValidationOptions<DataField.Any> | undefined,
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

export { BooleanField, DataField, NumberField, ObjectField, SchemaField, ModelValidationError };
