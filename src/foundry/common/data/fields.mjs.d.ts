import type { ConfiguredFlags } from "../../../types/helperTypes.js";
import type DataModel from "../abstract/data.mjs.js";
import { type Document } from "../abstract/module.mjs";
import type { DOCUMENT_OWNERSHIP_LEVELS } from "../constants.mjs.js";
import type { CONST } from "../module.mjs.js";

declare global {
  /**
   * @typeParam BaseAssignmentType - the base assignment type for a DataField, without null or undefined
   */
  interface DataFieldOptions<BaseAssignmentType> {
    /** Is this field required to be populated? */
    required?: boolean;

    /** Can this field have null values? */
    nullable?: boolean;

    /** The initial value of a field, or a function which assigns that initial value. */
    initial?: DataFieldOptions.InitialType<
      DataFieldOptions.InitialReturnType<BaseAssignmentType, this["nullable"], this["required"]>
    >;

    /** A data validation function which accepts one argument with the current value. */
    validate?: (
      this: DataField.Any,
      value: any,
      options?: DataField.ValidationOptions<DataField.Any>
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
  PersistedType extends unknown | null | undefined = InitializedType
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
   * Default parameters for this field type
   * @remarks This is not entirely type-safe, overrides should specifiy a more concrete return type.
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
    options?: Options
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
   * A validation failure can be provided as a raised Error (with a string message) or by returning false.
   * A validator which returns true denotes that the result is certainly valid and further validations are unnecessary.
   * @param value   - The initial value
   * @param options - Options which affect validation behavior
   *                  (default: `{}`)
   * @returns Returns a ModelValidationError if a validation failure occurred
   */
  validate(
    value: AssignmentType,
    options?: DataField.ValidationOptions<DataField.Any>
  ): ModelValidationError | undefined;

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
   * @returns A boolean to indicate with certainty whether the value is valid.
   *          Otherwise, return void.
   * @throws May throw a specific error if the value is not valid
   */
  protected _validateType(value: InitializedType, options?: DataField.ValidationOptions<DataField.Any>): boolean | void;

  /**
   * Initialize the original source data into a mutable copy for the DataModel instance.
   * @param value - The source value of the field
   * @param model - The DataModel instance that this field belongs to
   * @returns An initialized copy of the source data
   */
  initialize(value: PersistedType, model: DataModel.Any): (() => InitializedType | null) | InitializedType;

  /**
   * Export the current value of the field into a serializable object.
   * @param value - The initialized value of the field
   * @returns An exported representation of the field
   */
  toObject(value: InitializedType): PersistedType;
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

  /** A helper type for the given options type merged into the default options of the DataField class. */
  type MergedOptions<Options extends DataFieldOptions.Any> = SimpleMerge<DefaultOptions, Options>;

  /** Any DataField. */
  type Any = DataField<any, any, any, any>;

  /** A DataField with unknown inner types. */
  type Unknown = DataField<any, unknown, unknown, unknown>;

  /** A type to decorate the base assignment type to a DataField, based on the options of the field. */
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

  /** A type to decorate the base initialized type of a DataField, based on the options of the field. */
  type DerivedInitializedType<BaseInitializedType, Options extends DataFieldOptions.Any> =
    | Exclude<BaseInitializedType, null | undefined>
    | (Options["nullable"] extends true ? null : never)
    | (Options["required"] extends true ? never : undefined);

  /** A shorthand for the assignment type of a DataField class. */
  type AssignmentType<Options extends DataFieldOptions.Any> = DerivedAssignmentType<any, MergedOptions<Options>>;

  /** A shorthand for the initialized type of a DataField class. */
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

  /** An interface for the options of the {@link DataField} validation functions. */
  interface ValidationOptions<DataField> extends DataValidationOptions {
    source?: object;
    validate?: (this: DataField, value: unknown, options: ValidationOptions<DataField>) => boolean;
  }
}

/**
 * A special class of {@link DataField} which defines a data schema.
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
  PersistedType extends object | null | undefined = SchemaField.PersistedType<Fields, Options>
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

  protected static override get _defaults(): DataFieldOptions.Any;

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
  [Symbol.iterator](): Iterable<DataField.Unknown>;

  /**
   * An array of field names which are present in the schema.
   */
  keys(): string[];

  /**
   * An array of DataField instances which are present in the schema.
   */
  values(): unknown;

  /**
   * An array of [name, DataField] tuples which define the schema.
   */
  entries(): [name: string, dataField: unknown][];

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

  protected override _cast(value: AssignmentType): InitializedType;

  protected override _cleanType(value: InitializedType, options?: DataField.CleanOptions | undefined): InitializedType;

  override initialize(value: PersistedType, model: DataModel.Any): InitializedType | (() => InitializedType | null);

  protected override _validateType(
    value: InitializedType,
    options?: DataField.ValidationOptions<DataField.Any> | undefined
  ): boolean | void;

  override toObject(value: InitializedType): PersistedType;

  override apply<Value, Options, Return>(
    fn: keyof this | ((this: this, value: Value, options: Options) => Return),
    value: Value,
    options?: Options | undefined
  ): Return;
}

declare namespace SchemaField {
  /** A shorthand for the options of a SchemaField class. */
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

  /** Get the inner assignment type for the given DataSchema. */
  type InnerAssignmentType<Schema extends DataSchema> = {
    [Key in keyof Schema]?: Schema[Key] extends DataField<any, infer AssignType, any, any>
      ? Schema[Key] extends SchemaField<infer SubSchema, any, any, any, any>
        ? InnerAssignmentType<SubSchema>
        : AssignType
      : never;
  };

  /** Get the inner initialized type for the given DataSchema. */
  type InnerInitializedType<Schema extends DataSchema> = {
    [Key in keyof Schema]: Schema[Key] extends DataField<any, any, infer InitType, any>
      ? Schema[Key] extends SchemaField<infer SubSchema, any, any, any, any>
        ? InnerInitializedType<SubSchema>
        : InitType
      : never;
  };

  /** Get the inner persisted type for the given DataSchema. */
  type InnerPersistedType<Schema extends DataSchema> = {
    [Key in keyof Schema]: Schema[Key] extends DataField<any, any, any, infer PersistType>
      ? Schema[Key] extends SchemaField<infer SubSchema, any, any, any, any>
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

  /** A helper type for the given options type merged into the default options of the SchemaField class. */
  type MergedOptions<Fields extends DataSchema, Opts extends Options<Fields>> = SimpleMerge<DefaultOptions, Opts>;

  /** A shorthand for the assignment type of a SchemaField class. */
  type AssignmentType<
    Fields extends DataSchema,
    Opts extends Options<Fields> = DefaultOptions
  > = DataField.DerivedAssignmentType<InnerAssignmentType<Fields>, MergedOptions<Fields, Opts>>;

  /** A shorthand for the assignment type of a SchemaField class. */
  type InitializedType<
    Fields extends DataSchema,
    Opts extends Options<Fields> = DefaultOptions
  > = DataField.DerivedInitializedType<InnerInitializedType<Fields>, MergedOptions<Fields, Opts>>;

  /** A shorthand for the assignment type of a SchemaField class. */
  type PersistedType<
    Fields extends DataSchema,
    Opts extends Options<Fields> = DefaultOptions
  > = DataField.DerivedInitializedType<InnerPersistedType<Fields>, MergedOptions<Fields, Opts>>;
}

/**
 * A subclass of [DataField]{@link DataField} which deals with boolean-typed data.
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
  PersistedType extends boolean | null | undefined = BooleanField.InitializedType<Options>
> extends DataField<Options, AssignmentType, InitializedType, PersistedType> {
  /** @defaultValue `true` */
  override required: boolean;

  /** @defaultValue `false` */
  override nullable: boolean;

  /** @defaultValue `false` */
  override initial: DataFieldOptions.InitialType<InitializedType>;

  protected static override get _defaults(): DataFieldOptions.Any;

  protected override _cast(value: AssignmentType): InitializedType;

  protected override _validateType(
    value: InitializedType,
    options?: DataField.ValidationOptions<DataField.Any> | undefined
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

  /** A helper type for the given options type merged into the default options of the BooleanField class. */
  type MergedOptions<Opts extends Options> = SimpleMerge<DefaultOptions, Opts>;

  /** A shorthand for the assignment type of a BooleanField class. */
  type AssignmentType<Opts extends Options> = DataField.DerivedAssignmentType<boolean, MergedOptions<Opts>>;

  /** A shorthand for the initialized type of a BooleanField class. */
  type InitializedType<Opts extends Options> = DataField.DerivedInitializedType<boolean, MergedOptions<Opts>>;
}

declare global {
  interface NumberFieldOptions extends DataFieldOptions<number> {
    /** A minimum allowed value */
    min?: number | undefined;

    /** A maximum allowed value */
    max?: number | undefined;

    /** A permitted step size */
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
     */
    choices?: number[] | Record<number, string> | (() => number[] | Record<number, string>) | undefined;
  }
}

/**
 * A subclass of [DataField]{@link DataField} which deals with number-typed data.
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
  PersistedType extends number | null | undefined = NumberField.InitializedType<Options>
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
    options?: DataField.ValidationOptions<DataField.Any> | undefined
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

  /** A helper type for the given options type merged into the default options of the NumberField class. */
  type MergedOptions<Options extends NumberFieldOptions> = SimpleMerge<DefaultOptions, Options>;

  /** A shorthand for the assignment type of a NumberField class. */
  type AssignmentType<Options extends NumberFieldOptions> = DataField.DerivedAssignmentType<
    number,
    MergedOptions<Options>
  >;

  /** A shorthand for the initialized type of a NumberField class. */
  type InitializedType<Options extends NumberFieldOptions> = DataField.DerivedInitializedType<
    number,
    MergedOptions<Options>
  >;
}

declare global {
  interface StringFieldOptions extends DataFieldOptions<string> {
    /** Is the string allowed to be blank (empty)? */
    blank?: boolean;

    /** Should any provided string be trimmed as part of cleaning? */
    trim?: boolean;

    /**
     * An array of values or an object of values/labels which represent
     * allowed choices for the field. A function may be provided which dynamically
     * returns the array of choices.
     */
    choices?: string[] | Record<string, string> | (() => string[] | Record<string, string>) | undefined;
  }
}

/**
 * A subclass of [DataField]{@link DataField} which deals with string-typed data.
 * @remarks
 * Defaults:
 * AssignmentType: `string | null | undefined`
 * InitializedType: `string`
 * PersistedType: `string`
 * InitialValue: `""`
 */
declare class StringField<
  Options extends StringFieldOptions = StringField.DefaultOptions,
  AssignmentType = StringField.AssignmentType<Options>,
  InitializedType = StringField.InitializedType<Options>,
  PersistedType extends string | null | undefined = StringField.InitializedType<Options>
> extends DataField<Options, AssignmentType, InitializedType, PersistedType> {
  /**
   * @param options - Options which configure the behavior of the field
   */
  constructor(options?: Options);

  /** @defaultValue `""` */
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

  protected static override get _defaults(): StringFieldOptions;

  override clean(value: AssignmentType, options?: DataField.CleanOptions | undefined): InitializedType;

  protected override _cast(value: AssignmentType): InitializedType;

  protected override _validateSpecial(value: AssignmentType): boolean | void;

  protected override _validateType(
    value: InitializedType,
    options?: DataField.ValidationOptions<DataField.Any> | undefined
  ): boolean | void;

  /**
   * Test whether a provided value is a valid choice from the allowed choice set
   * @param value - The provided value
   * @returns Is the choice valid?
   */
  #isValidChoice(value: AssignmentType): boolean;
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

  /** A helper type for the given options type merged into the default options of the StringField class. */
  type MergedOptions<Options extends StringFieldOptions> = SimpleMerge<DefaultOptions, Options>;

  /** A shorthand for the assignment type of a StringField class. */
  type AssignmentType<Options extends StringFieldOptions> = DataField.DerivedAssignmentType<
    string,
    MergedOptions<Options>
  >;

  /** A shorthand for the initialized type of a StringField class. */
  type InitializedType<Options extends StringFieldOptions> = DataField.DerivedInitializedType<
    string,
    MergedOptions<Options>
  >;
}

/**
 * A subclass of [DataField]{@link DataField} which deals with object-typed data.
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
  PersistedType extends object | null | undefined = ObjectField.InitializedType<Options>
> extends DataField<Options, AssignmentType, InitializedType, PersistedType> {
  /** @defaultValue `true` */
  override required: boolean;

  /** @defaultValue `false` */
  override nullable: boolean;

  /** @defaultValue `() => ({})` */
  override initial: DataFieldOptions.InitialType<InitializedType>;

  protected static override get _defaults(): DataFieldOptions.Any;

  protected override _cast(value: AssignmentType): InitializedType;

  override initialize(value: PersistedType, model: DataModel.Any): InitializedType | (() => InitializedType | null);

  override toObject(value: InitializedType): PersistedType;

  protected override _validateType(
    value: InitializedType,
    options?: DataField.ValidationOptions<DataField.Any> | undefined
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

  /** A helper type for the given options type merged into the default options of the ObjectField class. */
  type MergedOptions<Options extends DataFieldOptions<object>> = SimpleMerge<DefaultOptions, Options>;

  /** A shorthand for the assignment type of a ObjectField class. */
  type AssignmentType<Options extends DataFieldOptions<object>> = DataField.DerivedAssignmentType<
    object,
    MergedOptions<Options>
  >;

  /** A shorthand for the initialized type of a ObjectField class. */
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
    Options extends DataFieldOptions.Any = {}
  > = ObjectField<
    Options,
    DataField.DerivedAssignmentType<ConfiguredFlags<Key> & ExtensionFlags, MergedOptions<Options>>,
    DataField.DerivedInitializedType<ConfiguredFlags<Key> & ExtensionFlags, MergedOptions<Options>>,
    DataField.DerivedInitializedType<ConfiguredFlags<Key> & ExtensionFlags, MergedOptions<Options>>
  >;
}

/**
 * A subclass of [DataField]{@link DataField} which deals with array-typed data.
 * @remarks
 * Defaults:
 * AssignmentType: `ArrayField.BaseAssignmentType<AssignmentElementType> | null | undefined`
 * InitializedType: `InitializedElementType[]`
 * PersistedType: `PersistedElementType[]`
 * InitialValue: `[]`
 */
declare class ArrayField<
  ElementFieldType extends DataField.Any | Document.Constructor,
  AssignmentElementType = ArrayField.AssignmentElementType<ElementFieldType>,
  InitializedElementType = ArrayField.InitializedElementType<ElementFieldType>,
  Options extends ArrayField.Options<AssignmentElementType> = ArrayField.DefaultOptions<AssignmentElementType>,
  AssignmentType = ArrayField.AssignmentType<AssignmentElementType, Options>,
  InitializedType = ArrayField.InitializedType<AssignmentElementType, InitializedElementType, Options>,
  PersistedElementType = ArrayField.PersistedElementType<ElementFieldType>,
  PersistedType extends PersistedElementType[] | null | undefined = ArrayField.PersistedType<
    AssignmentElementType,
    PersistedElementType,
    Options
  >
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

  /**
   * Validate the contained element type of the ArrayField
   * @param element - The type of Array element
   * @returns The validated element type
   * @throws An error if the element is not a valid type
   */
  protected static _validateElementType<T extends DataField.Any>(element: T): T;

  protected static override get _defaults(): DataFieldOptions.Any;

  protected override _cast(value: AssignmentType): InitializedType;

  protected override _cleanType(value: InitializedType, options?: DataField.CleanOptions | undefined): InitializedType;

  protected override _validateType(
    value: InitializedType,
    options?: DataField.ValidationOptions<DataField.Any> | undefined
  ): boolean | void;

  /**
   * Validate every element of the ArrayField
   * @param value   - The array to validate
   * @param options - Validation options
   * @returns An array of element-specific errors
   */
  protected _validateElements(
    value: any[],
    options?: DataField.ValidationOptions<DataField.Any>
  ): ModelValidationError[];

  override initialize(value: PersistedType, model: DataModel.Any): InitializedType | (() => InitializedType | null);

  override toObject(value: InitializedType): PersistedType;

  override apply<Value, Options, Return>(
    fn: keyof this | ((this: this, value: Value, options: Options) => Return),
    value: Value,
    options?: Options | undefined
  ): Return;
}

declare namespace ArrayField {
  /** A shorthand for the options of an ArrayField class. */
  type Options<AssignmentElementType> = DataFieldOptions<BaseAssignmentType<AssignmentElementType>>;

  /** The base assignment type for the {@link ArrayField} class. */
  type BaseAssignmentType<AssignmentElementType> =
    | Record<number | string, AssignmentElementType>
    | Iterable<AssignmentElementType>
    | AssignmentElementType[]
    | AssignmentElementType;

  /** The type of the default options for the {@link ArrayField} class. */
  type DefaultOptions<AssignmentElementType> = SimpleMerge<
    DataField.DefaultOptions,
    {
      required: true;
      nullable: false;
      initial: () => AssignmentElementType[];
    }
  >;

  /** A helper type for the given options type merged into the default options of the ArrayField class. */
  type MergedOptions<AssignmentElementType, Opts extends Options<AssignmentElementType>> = SimpleMerge<
    DefaultOptions<AssignmentElementType>,
    Opts
  >;

  /** A type to infer the assignment element type of an ArrayField from its ElementType. */
  type AssignmentElementType<ElementFieldType extends DataField.Any | Document.Constructor> =
    ElementFieldType extends DataField<any, infer Assign, any, any>
      ? Assign
      : ElementFieldType extends new (...args: any[]) => Document<infer Schema extends SchemaField.Any, any, any>
      ? SchemaField.InnerAssignmentType<Schema["fields"]>
      : never;

  /** A type to infer the initialized element type of an ArrayField from its ElementType. */
  type InitializedElementType<ElementFieldType extends DataField.Any | Document.Constructor> =
    ElementFieldType extends DataField<any, any, infer Init, any>
      ? Init
      : ElementFieldType extends new (...args: any[]) => Document<infer Schema extends SchemaField.Any, any, any>
      ? SchemaField.InnerInitializedType<Schema["fields"]>
      : never;

  /** A type to infer the initialized element type of an ArrayField from its ElementType. */
  type PersistedElementType<ElementFieldType extends DataField.Any | Document.Constructor> =
    ElementFieldType extends DataField<any, any, any, infer Persist>
      ? Persist
      : ElementFieldType extends new (...args: any[]) => Document<infer Schema extends SchemaField.Any, any, any>
      ? SchemaField.InnerPersistedType<Schema["fields"]>
      : never;

  /** A shorthand for the assignment type of an ArrayField class. */
  type AssignmentType<
    AssignmentElementType,
    Opts extends Options<AssignmentElementType>
  > = DataField.DerivedAssignmentType<
    BaseAssignmentType<AssignmentElementType>,
    MergedOptions<AssignmentElementType, Opts>
  >;

  /** A shorthand for the initialized type of an ArrayField class. */
  type InitializedType<
    AssignmentElementType,
    InitializedElementType,
    Opts extends Options<AssignmentElementType>
  > = DataField.DerivedInitializedType<InitializedElementType[], MergedOptions<AssignmentElementType, Opts>>;

  /** A shorthand for the persisted type of an ArrayField class. */
  type PersistedType<
    AssignmentElementType,
    PersistedElementType,
    Opts extends Options<AssignmentElementType>
  > = DataField.DerivedInitializedType<PersistedElementType[], MergedOptions<AssignmentElementType, Opts>>;
}

/**
 * A subclass of [ArrayField]{@link ArrayField} which supports a set of contained elements.
 * Elements in this set are treated as fungible and may be represented in any order or discarded if invalid.
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
  >
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
    options?: DataField.ValidationOptions<DataField.Any> | undefined
  ): ModelValidationError<ModelValidationError.Errors>[];

  override initialize(value: PersistedType, model: DataModel.Any): InitializedType | (() => InitializedType | null);

  override toObject(value: InitializedType): PersistedType;
}

declare namespace SetField {
  /** A shorthand for the options of a SetField class. */
  type Options<AssignmentElementType> = DataFieldOptions<SetField.BaseAssignmentType<AssignmentElementType>>;

  /** The base assignment type for the {@link SetField} class. */
  type BaseAssignmentType<AssignmentElementType> = ArrayField.BaseAssignmentType<AssignmentElementType>;

  /** The type of the default options for the {@link SetField} class. */
  type DefaultOptions<InitializedElementType> = ArrayField.DefaultOptions<InitializedElementType>;

  /** A helper type for the given options type merged into the default options of the SetField class. */
  type MergedOptions<AssignmentElementType, Opts extends Options<AssignmentElementType>> = SimpleMerge<
    DefaultOptions<AssignmentElementType>,
    Opts
  >;

  /** A shorthand for the assignment type of a SetField class. */
  type AssignmentType<
    AssignmentElementType,
    Opts extends Options<AssignmentElementType>
  > = DataField.DerivedAssignmentType<
    BaseAssignmentType<AssignmentElementType>,
    MergedOptions<AssignmentElementType, Opts>
  >;

  /** A shorthand for the initialized type of a SetField class. */
  type InitializedType<
    AssignmentElementType,
    InitializedElementType,
    Opts extends Options<AssignmentElementType>
  > = DataField.DerivedInitializedType<Set<InitializedElementType>, MergedOptions<AssignmentElementType, Opts>>;

  /** A shorthand for the persisted type of a SetField class. */
  type PersistedType<
    AssignmentElementType,
    PersistedElementType,
    Opts extends Options<AssignmentElementType>
  > = DataField.DerivedInitializedType<PersistedElementType[], MergedOptions<AssignmentElementType, Opts>>;
}

/**
 * A subclass of [ObjectField]{@link ObjectField} which embeds some other DataModel definition as an inner object.
 * @remarks
 * Defaults:
 * AssignmentType: `SchemaField.AssignmentType<ModelType["schema"]["fields"]> | null | undefined`
 * InitializedType: `SchemaField.InitializedType<ModelType["schema"]["fields"]>`
 * PersistedType: `SchemaField.PersistedType<ModelType["schema"]["fields"]>`
 * InitialValue: `{}`
 */
declare class EmbeddedDataField<
  ModelType extends DataModel.Any,
  Options extends EmbeddedDataField.Options<ModelType> = EmbeddedDataField.DefaultOptions,
  AssignmentType = EmbeddedDataField.AssignmentType<ModelType, Options>,
  InitializedType = EmbeddedDataField.InitializedType<ModelType, Options>,
  PersistedType extends object | null | undefined = EmbeddedDataField.PersistedType<ModelType, Options>
> extends SchemaField<
  EmbeddedDataField.DataSchema<ModelType>,
  Options,
  AssignmentType,
  InitializedType,
  PersistedType
> {
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
}

declare namespace EmbeddedDataField {
  /** A shorthand for the options of an EmbeddedDataField class. */
  type Options<ModelType extends DataModel.Any> = DataFieldOptions<
    SchemaField.InnerAssignmentType<DataSchema<ModelType>>
  >;

  /** The type of the default options for the {@link EmbeddedDataField} class. */
  type DefaultOptions = SchemaField.DefaultOptions;

  /** A helper type for the given options type merged into the default options of the EmbeddedDataField class. */
  type MergedOptions<ModelType extends DataModel.Any, Opts extends Options<ModelType>> = SimpleMerge<
    DefaultOptions,
    Opts
  >;

  /** A helper type to extract the {@link DataSchema} from a {@link DataModel}. */
  type DataSchema<ModelType extends DataModel.Any> = ModelType["schema"]["fields"];

  /** A shorthand for the assignment type of an EmbeddedDataField class. */
  type AssignmentType<
    ModelType extends DataModel.Any,
    Opts extends Options<ModelType>
  > = DataField.DerivedAssignmentType<
    SchemaField.InnerAssignmentType<DataSchema<ModelType>>,
    MergedOptions<ModelType, Opts>
  >;

  /** A shorthand for the initialized type of an EmbeddedDataField class. */
  type InitializedType<
    ModelType extends DataModel.Any,
    Opts extends Options<ModelType>
  > = DataField.DerivedInitializedType<
    SchemaField.InnerInitializedType<DataSchema<ModelType>>,
    MergedOptions<ModelType, Opts>
  >;

  /** A shorthand for the persisted type of an EmbeddedDataField class. */
  type PersistedType<
    ModelType extends DataModel.Any,
    Opts extends Options<ModelType>
  > = DataField.DerivedInitializedType<
    SchemaField.InnerPersistedType<DataSchema<ModelType>>,
    MergedOptions<ModelType, Opts>
  >;
}

/**
 * A subclass of [ArrayField]{@link ArrayField} which supports an embedded Document collection.
 * Invalid elements will be dropped from the collection during validation rather than failing for the field entirely.
 * @remarks
 * Defaults:
 * AssignmentType: `ArrayField.BaseAssignmentType<AssignmentElementType> | null | undefined`
 * InitializedType: `Collection<InitializedElementType>`
 * PersistedType: `PersistedElementType[]`
 * InitialValue: `[]`
 */
declare class EmbeddedCollectionField<
  ElementFieldType extends Document.Constructor,
  AssignmentElementType = EmbeddedCollectionField.AssignmentElementType<ElementFieldType>,
  InitializedElementType = EmbeddedCollectionField.InitializedElementType<ElementFieldType>,
  Options extends EmbeddedCollectionField.Options<AssignmentElementType> = EmbeddedCollectionField.DefaultOptions<AssignmentElementType>,
  AssignmentType = EmbeddedCollectionField.AssignmentType<AssignmentElementType, Options>,
  InitializedType = EmbeddedCollectionField.InitializedType<AssignmentElementType, InitializedElementType, Options>,
  PersistedElementType = EmbeddedCollectionField.PersistedElementType<ElementFieldType>,
  PersistedType extends PersistedElementType[] | null | undefined = EmbeddedCollectionField.PersistedType<
    AssignmentElementType,
    PersistedElementType,
    Options
  >
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

  protected static override _validateElementType<T extends DataField.Any | Document.Constructor>(element: T): T;

  /**
   * A reference to the DataModel subclass of the embedded document element
   */
  get model(): typeof DataModel;

  /**
   * The DataSchema of the contained Document model.
   */
  get schema(): this["element"]["schema"];

  protected override _cleanType(value: InitializedType, options?: DataField.CleanOptions | undefined): InitializedType;

  protected override _validateElements(
    value: any[],
    options?: DataField.ValidationOptions<DataField.Any> | undefined
  ): ModelValidationError<ModelValidationError.Errors>[];

  override initialize(value: PersistedType, model: DataModel.Any): InitializedType | (() => InitializedType | null);

  override toObject(value: InitializedType): PersistedType;

  override apply<Value, Options, Return>(
    fn: keyof this | ((this: this, value: Value, options: Options) => Return),
    value: Value,
    options?: Options | undefined
  ): Return;
}

declare namespace EmbeddedCollectionField {
  /** A shorthand for the options of an EmbeddedCollectionField class. */
  type Options<AssignmentElementType> = DataFieldOptions<ArrayField.BaseAssignmentType<AssignmentElementType>>;

  /** The type of the default options for the {@link EmbeddedCollectionField} class. */
  type DefaultOptions<AssignmentElementType> = ArrayField.DefaultOptions<AssignmentElementType>;

  /** A helper type for the given options type merged into the default options of the EmbeddedCollectionField class. */
  type MergedOptions<AssignmentElementType, Opts extends Options<AssignmentElementType>> = SimpleMerge<
    DefaultOptions<AssignmentElementType>,
    Opts
  >;

  /** A type to infer the assignment element type of an EmbeddedCollectionField from its ElementFieldType. */
  type AssignmentElementType<ElementFieldType extends Document.Constructor> = ElementFieldType extends new (
    ...args: any[]
  ) => Document<infer Schema extends SchemaField.Any, any, any>
    ? SchemaField.InnerAssignmentType<Schema["fields"]>
    : never;

  /** A type to infer the initialized element type of an EmbeddedCollectionField from its ElementFieldType. */
  type InitializedElementType<ElementFieldType extends Document.Constructor> = InstanceType<ElementFieldType>;

  /** A type to infer the initialized element type of an EmbeddedCollectionField from its ElementFieldType. */
  type PersistedElementType<ElementFieldType extends Document.Constructor> = ElementFieldType extends new (
    ...args: any[]
  ) => Document<infer Schema extends SchemaField.Any, any, any>
    ? SchemaField.InnerPersistedType<Schema["fields"]>
    : never;

  /** A shorthand for the assignment type of an ArrayField class. */
  type AssignmentType<
    AssignmentElementType,
    Opts extends Options<AssignmentElementType>
  > = DataField.DerivedAssignmentType<
    ArrayField.BaseAssignmentType<AssignmentElementType>,
    MergedOptions<AssignmentElementType, Opts>
  >;

  /** A shorthand for the initialized type of an ArrayField class. */
  type InitializedType<
    AssignmentElementType,
    InitializedElementType,
    Opts extends Options<AssignmentElementType>
  > = DataField.DerivedInitializedType<Collection<InitializedElementType>, MergedOptions<AssignmentElementType, Opts>>;

  /** A shorthand for the persisted type of an ArrayField class. */
  type PersistedType<
    AssignmentElementType,
    PersistedElementType,
    Opts extends Options<AssignmentElementType>
  > = DataField.DerivedInitializedType<PersistedElementType[], MergedOptions<AssignmentElementType, Opts>>;
}

/**
 * A subclass of [StringField]{@link StringField} which provides the primary _id for a Document.
 * The field may be initially null, but it must be non-null when it is saved to the database.
 * @remarks
 * Defaults:
 * AssignmentType: `string | AnyDocument | null | undefined`
 * InitializedType: `string | null`
 * PersistedType: `string | null`
 * InitialValue: `null`
 */
declare class DocumentIdField<
  Options extends StringFieldOptions = DocumentIdField.DefaultOptions,
  AssignmentType = DocumentIdField.AssignmentType<Options>,
  InitializedType = DocumentIdField.InitializedType<Options>,
  PersistedType extends string | null | undefined = DocumentIdField.InitializedType<Options>
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
    options?: DataField.ValidationOptions<DataField.Any> | undefined
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

  /** A helper type for the given options type merged into the default options of the DocumentIdField class. */
  type MergedOptions<Options extends StringFieldOptions> = SimpleMerge<DefaultOptions, Options>;

  /** A shorthand for the assignment type of a StringField class. */
  type AssignmentType<Options extends StringFieldOptions> = DataField.DerivedAssignmentType<
    string | Document.Any,
    MergedOptions<Options>
  >;

  /** A shorthand for the initialized type of a StringField class. */
  type InitializedType<Options extends StringFieldOptions> = DataField.DerivedInitializedType<
    string,
    MergedOptions<Options>
  >;
}

/**
 * A special class of [StringField]{@link StringField} field which references another DataModel by its id.
 * This field may also be null to indicate that no foreign model is linked.
 * @remarks
 * Defaults:
 * AssignmentType: `string | InstanceType<DocumentType> | null | undefined`
 * InitializedType: `InstanceType<DocumentType> | null`
 * PersistedType: `string | null`
 * InitialValue: `null`
 */
declare class ForeignDocumentField<
  DocumentType extends Document.Constructor,
  Options extends ForeignDocumentField.Options<DocumentType> = ForeignDocumentField.DefaultOptions,
  AssignmentType = ForeignDocumentField.AssignmentType<DocumentType, Options>,
  InitializedType = ForeignDocumentField.InitializedType<DocumentType, Options>,
  PersistedType extends string | null | undefined = ForeignDocumentField.PersistedType<DocumentType, Options>
> extends DocumentIdField<Options, AssignmentType, InitializedType, PersistedType> {
  /**
   * @param model   - The foreign DataModel class definition which this field should link to.
   * @param options - Options which configure the behavior of the field
   */
  constructor(model: DocumentType, options?: Options);

  /** @defaultValue `true` */
  override nullable: boolean;

  /** @defaultValue `false` */
  override readonly: boolean;

  /** @defaultValue `false` */
  idOnly: boolean;

  /**
   * A reference to the model class which is stored in this field
   */
  model: DocumentType;

  protected static override get _defaults(): StringFieldOptions;

  protected override _cast(value: AssignmentType): InitializedType;

  override initialize(value: PersistedType, model: DataModel.Any): InitializedType | (() => InitializedType | null);

  override toObject(value: InitializedType): PersistedType;
}

declare namespace ForeignDocumentField {
  /** The options for the ForeignDocumentField class. */
  type Options<DocumentType extends Document.Constructor> = StringFieldOptions &
    DataFieldOptions<string | InstanceType<DocumentType>> & {
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

  /** A helper type for the given options type merged into the default options of the ForeignDocumentField class. */
  type MergedOptions<DocumentType extends Document.Constructor, Opts extends Options<DocumentType>> = SimpleMerge<
    DefaultOptions,
    Opts
  >;

  /** A shorthand for the assignment type of a StringField class. */
  type AssignmentType<
    DocumentType extends Document.Constructor,
    Opts extends Options<DocumentType>
  > = DataField.DerivedAssignmentType<string | InstanceType<DocumentType>, MergedOptions<DocumentType, Opts>>;

  /** A shorthand for the initialized type of a StringField class. */
  type InitializedType<
    DocumentType extends Document.Constructor,
    Opts extends Options<DocumentType>
  > = DataField.DerivedInitializedType<
    Opts["idOnly"] extends true ? string : InstanceType<DocumentType>,
    MergedOptions<DocumentType, Opts>
  >;

  type PersistedType<
    DocumentType extends Document.Constructor,
    Opts extends Options<DocumentType>
  > = DataField.DerivedInitializedType<string, MergedOptions<DocumentType, Opts>>;
}

/**
 * A subclass of [ObjectField]{@link ObjectField} which supports a system-level data object.
 * @remarks
 * Defaults:
 * AssignmentType: `SchemaField.AssignmentType<DataModelSchemas<DocumentType>["fields"]> | SystemDataField.DataModels<DocumentType> | null | undefined`
 * InitializedType: `DataModels<DocumentType>`
 * PersistedType: `SchemaField.PersistedType<DataModelSchemas<DocumentType>["fields"]>`
 * InitialValue: `{}`
 */
declare class SystemDataField<
  DocumentType extends Document.SystemConstructor,
  TypeName extends SystemDataField.TypeNames<DocumentType> = SystemDataField.TypeNames<DocumentType>,
  Options extends SystemDataField.Options<DocumentType, TypeName> = SystemDataField.DefaultOptions,
  AssignmentType = SystemDataField.AssignmentType<DocumentType, TypeName, Options>,
  InitializedType = SystemDataField.InitializedType<DocumentType, TypeName, Options>,
  PersistedType extends object | null | undefined = SystemDataField.PersistedType<DocumentType, TypeName, Options>
> extends ObjectField<Options, AssignmentType, InitializedType, PersistedType> {
  /**
   * @param document - The base document class which belongs in this field
   * @param options  - Options which configure the behavior of the field
   */
  constructor(document: DocumentType, options?: Options);

  /** @defaultValue `true` */
  override required: boolean;

  /**
   * The canonical document name of the document type which belongs in this field
   */
  document: DocumentType;

  /**
   * A convenience accessor for the name of the document type associated with this SystemDataField
   */
  get documentName(): this["document"]["documentName"];

  /**
   * Get the DataModel definition that should be used for this type of document.
   * @param type - The Document instance type
   * @returns The DataModel class, or null
   */
  getModelForType<SystemType extends SystemDataField.TypeNames<DocumentType>>(
    type: SystemType
  ): SystemDataField.ConcreteDataModel<DocumentType, SystemType> | null;

  override getInitialValue(data: { type?: string } | undefined): InitializedType;

  protected override _cleanType(value: InitializedType, options?: DataField.CleanOptions | undefined): InitializedType;

  override initialize(
    value: PersistedType,
    model: SystemDataField.DataModels<DocumentType>
  ): InitializedType | (() => InitializedType | null);

  override toObject(value: InitializedType): PersistedType;
}

declare namespace SystemDataField {
  /** A shorthand for the options of a SystemDataField class. */
  type Options<
    DocumentType extends Document.SystemConstructor,
    TypeName extends TypeNames<DocumentType>
  > = DataFieldOptions<SchemaField.InnerAssignmentType<ConcreteDataModelSchema<DocumentType, TypeName>["fields"]>>;

  /** The type of the default options for the {@link SystemDataField} class. */
  type DefaultOptions = SimpleMerge<
    ObjectField.DefaultOptions,
    {
      required: true;
    }
  >;

  /** A helper type for the given options type merged into the default options of the SystemDataField class. */
  type MergedOptions<
    DocumentType extends Document.SystemConstructor,
    TypeName extends TypeNames<DocumentType>,
    Opts extends Options<DocumentType, TypeName>
  > = SimpleMerge<DefaultOptions, Opts>;

  /** Get the system DataModel configuration for a specific document type. */
  type Config<DocumentType extends Document.SystemConstructor> = SystemConfig[DocumentType["metadata"]["name"]];

  /** Get the configured system type names for a specific document type. */
  type TypeNames<DocumentType extends Document.SystemConstructor> = keyof Config<DocumentType>;

  /** Get the configured DataModels for a specific document type. */
  type DataModels<DocumentType extends Document.SystemConstructor> = ValueOf<Config<DocumentType>>;

  /** Get the configured system DataModel for a specific document type and system type name. */
  type ConcreteDataModel<
    DocumentType extends Document.SystemConstructor,
    TypeName extends TypeNames<DocumentType>
  > = Config<DocumentType>[TypeName];

  /** Get the configured system DataSchema for a specific document type and system type name. */
  type ConcreteDataModelSchema<
    DocumentType extends Document.SystemConstructor,
    TypeName extends TypeNames<DocumentType>
  > = ConcreteDataModel<DocumentType, TypeName> extends DataModel.Any
    ? ConcreteDataModel<DocumentType, TypeName>["schema"]
    : never;

  /** Get the configured system assignment type for a specific document type and system type name. */
  type AssignmentType<
    DocumentType extends Document.SystemConstructor,
    TypeName extends TypeNames<DocumentType>,
    Opts extends Options<DocumentType, TypeName>
  > = DataField.DerivedAssignmentType<
    | SchemaField.InnerAssignmentType<ConcreteDataModelSchema<DocumentType, TypeName>["fields"]>
    | ConcreteDataModel<DocumentType, TypeName>,
    MergedOptions<DocumentType, TypeName, Opts>
  >;

  /** Get the configured system initialized type for a specific document type and system type name. */
  type InitializedType<
    DocumentType extends Document.SystemConstructor,
    TypeName extends TypeNames<DocumentType>,
    Opts extends Options<DocumentType, TypeName>
  > = DataField.DerivedInitializedType<
    ConcreteDataModel<DocumentType, TypeName>,
    MergedOptions<DocumentType, TypeName, Opts>
  >;

  /** Get the configured system persisted type for a specific document type and system type name. */
  type PersistedType<
    DocumentType extends Document.SystemConstructor,
    TypeName extends TypeNames<DocumentType>,
    Opts extends Options<DocumentType, TypeName>
  > = DataField.DerivedInitializedType<
    SchemaField.InnerPersistedType<ConcreteDataModelSchema<DocumentType, TypeName>["fields"]>,
    MergedOptions<DocumentType, TypeName, Opts>
  >;
}

/**
 * A special [StringField]{@link StringField} which records a standardized CSS color string.
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
  PersistedType extends string | null | undefined = ColorField.InitializedType<Options>
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

  override clean(value: AssignmentType, options?: DataField.CleanOptions | undefined): InitializedType;

  protected override _validateType(
    value: InitializedType,
    options?: DataField.ValidationOptions<DataField.Any> | undefined
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

  /** A helper type for the given options type merged into the default options of the ColorField class. */
  type MergedOptions<Options extends StringFieldOptions> = SimpleMerge<DefaultOptions, Options>;

  /** A shorthand for the assignment type of a ColorField class. */
  type AssignmentType<Options extends StringFieldOptions> = DataField.DerivedAssignmentType<
    string,
    MergedOptions<Options>
  >;

  /** A shorthand for the initialized type of a ColorField class. */
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
    /** A set of categories in CONST.FILE_CATEGORIES which this field supports */
    categories?: (keyof typeof CONST.FILE_CATEGORIES)[];

    /** Is embedded base64 data supported in lieu of a file path? */
    base64?: boolean;

    /** Does this file path field allow wildcard characters? */
    wildcard?: boolean;
  }
}

/**
 * A special [StringField]{@link StringField} which records a file path or inline base64 data.
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
  PersistedType extends string | null | undefined = FilePathField.InitializedType<Options>
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

  protected override _validateType(
    value: InitializedType,
    options?: DataField.ValidationOptions<DataField.Any> | undefined
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

  /** A helper type for the given options type merged into the default options of the FilePathField class. */
  type MergedOptions<Options extends StringFieldOptions> = SimpleMerge<DefaultOptions, Options>;

  /** A shorthand for the assignment type of a FilePathField class. */
  type AssignmentType<Options extends StringFieldOptions> = DataField.DerivedAssignmentType<
    string,
    MergedOptions<Options>
  >;

  /** A shorthand for the initialized type of a FilePathField class. */
  type InitializedType<Options extends StringFieldOptions> = DataField.DerivedInitializedType<
    string,
    MergedOptions<Options>
  >;
}

/**
 * A special [NumberField]{@link NumberField} which represents an angle of rotation in degrees between 0 and 360.
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
  PersistedType extends number | null | undefined = AngleField.InitializedType<Options>
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

  /** A helper type for the given options type merged into the default options of the AngleField class. */
  type MergedOptions<Options extends NumberFieldOptions> = SimpleMerge<DefaultOptions, Options>;

  /** A shorthand for the assignment type of a AngleField class. */
  type AssignmentType<Options extends NumberFieldOptions> = DataField.DerivedAssignmentType<
    number,
    MergedOptions<Options>
  >;

  /** A shorthand for the initialized type of a AngleField class. */
  type InitializedType<Options extends NumberFieldOptions> = DataField.DerivedInitializedType<
    number,
    MergedOptions<Options>
  >;
}

/**
 * A special [NumberField]{@link NumberField} represents a number between 0 and 1.
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
  PersistedType extends number | null | undefined = AlphaField.InitializedType<Options>
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

  /** A helper type for the given options type merged into the default options of the AlphaField class. */
  type MergedOptions<Options extends NumberFieldOptions> = SimpleMerge<DefaultOptions, Options>;

  /** A shorthand for the assignment type of a AlphaField class. */
  type AssignmentType<Options extends NumberFieldOptions> = DataField.DerivedAssignmentType<
    number,
    MergedOptions<Options>
  >;

  /** A shorthand for the initialized type of a AlphaField class. */
  type InitializedType<Options extends NumberFieldOptions> = DataField.DerivedInitializedType<
    number,
    MergedOptions<Options>
  >;
}

/**
 * A special [ObjectField]{@link ObjectField} which captures a mapping of User IDs to Document permission levels.
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
    | undefined = DocumentOwnershipField.InitializedType<Options>
> extends ObjectField<Options, AssignmentType, InitializedType, PersistedType> {
  /** @defaultValue `{"default": DOCUMENT_OWNERSHIP_LEVELS.NONE}` */
  override initial: DataFieldOptions.InitialType<InitializedType>;

  /** @defaultValue `"is not a mapping of user IDs and document permission levels"` */
  override validationError: string;

  protected static override get _defaults(): DocumentOwnershipField.Options;

  protected override _validateType(
    value: InitializedType,
    options?: DataField.ValidationOptions<DataField.Any> | undefined
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

  /** A helper type for the given options type merged into the default options of the ObjectField class. */
  type MergedOptions<Opts extends Options> = SimpleMerge<DefaultOptions, Opts>;

  /** A shorthand for the assignment type of a ObjectField class. */
  type AssignmentType<Opts extends Options> = DataField.DerivedAssignmentType<
    Record<string, DOCUMENT_OWNERSHIP_LEVELS>,
    MergedOptions<Opts>
  >;

  /** A shorthand for the initialized type of a ObjectField class. */
  type InitializedType<Opts extends Options> = DataField.DerivedInitializedType<
    Record<string, DOCUMENT_OWNERSHIP_LEVELS>,
    MergedOptions<Opts>
  >;
}

/**
 * A special [StringField]{@link StringField} which contains serialized JSON data.
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
  PersistedType extends string | null | undefined = JSONField.PersistedType<Options>
> extends StringField<Options, AssignmentType, InitializedType, PersistedType> {
  /** @defaultValue `false` */
  override blank: boolean;

  /** @defaultValue `undefined` */
  override initial: DataFieldOptions.InitialType<InitializedType>;

  /** @defaultValue `"is not a valid JSON string"` */
  override validationError: string;

  protected static override get _defaults(): StringFieldOptions;

  override clean(value: AssignmentType, options?: DataField.CleanOptions | undefined): InitializedType;

  protected override _validateType(
    value: InitializedType,
    options?: DataField.ValidationOptions<DataField.Any> | undefined
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

  /** A helper type for the given options type merged into the default options of the JSONField class. */
  type MergedOptions<Options extends StringFieldOptions> = SimpleMerge<DefaultOptions, Options>;

  /** A shorthand for the assignment type of a JSONField class. */
  type AssignmentType<Options extends StringFieldOptions> = DataField.DerivedAssignmentType<
    string,
    MergedOptions<Options>
  >;

  /** A shorthand for the initialized type of a JSONField class. */
  type InitializedType<Options extends StringFieldOptions> = DataField.DerivedInitializedType<
    object,
    MergedOptions<Options>
  >;

  /** A shorthand for the persisted type of a JSONField class. */
  type PersistedType<Options extends StringFieldOptions> = DataField.DerivedInitializedType<
    string,
    MergedOptions<Options>
  >;
}

/**
 * A subclass of [StringField]{@link StringField} which contains a sanitized HTML string.
 * This class does not override any StringField behaviors, but is used by the server-side to identify fields which
 * require sanitization of user input.
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
  PersistedType extends string | null | undefined = HTMLField.InitializedType<Options>
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

  /** A helper type for the given options type merged into the default options of the HTMLField class. */
  type MergedOptions<Options extends StringFieldOptions> = SimpleMerge<DefaultOptions, Options>;

  /** A shorthand for the assignment type of a HTMLField class. */
  type AssignmentType<Options extends StringFieldOptions> = DataField.DerivedAssignmentType<
    string,
    MergedOptions<Options>
  >;

  /** A shorthand for the initialized type of a HTMLField class. */
  type InitializedType<Options extends StringFieldOptions> = DataField.DerivedInitializedType<
    string,
    MergedOptions<Options>
  >;
}

/**
 * A subclass of {@link NumberField} which is used for storing integer sort keys.
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
  PersistedType extends number | null | undefined = IntegerSortField.InitializedType<Options>
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

  /** A helper type for the given options type merged into the default options of the IntegerSortField class. */
  type MergedOptions<Options extends NumberFieldOptions> = SimpleMerge<DefaultOptions, Options>;

  /** A shorthand for the assignment type of a IntegerSortField class. */
  type AssignmentType<Options extends NumberFieldOptions> = DataField.DerivedAssignmentType<
    number,
    MergedOptions<Options>
  >;

  /** A shorthand for the initialized type of a IntegerSortField class. */
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
 * @typeParam Value         - the type of the value of the field
 * @typeParam PersistedType - the type of the persisted value of the field
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
  PersistedType extends object | null | undefined = DocumentStatsField.PersistedType<Options>
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
   */
  type MergedOptions<Options> = SimpleMerge<DefaultOptions, Options>;

  /** A shorthand for the assignment type of a DocumentStatsField class. */
  type AssignmentType<Opts extends Options = DefaultOptions> = DataField.DerivedAssignmentType<
    SchemaField.InnerAssignmentType<Schema>,
    MergedOptions<Opts>
  >;

  /** A shorthand for the assignment type of a DocumentStatsField class. */
  type InitializedType<Opts extends Options = DefaultOptions> = DataField.DerivedInitializedType<
    SchemaField.InnerInitializedType<Schema>,
    MergedOptions<Opts>
  >;

  /** A shorthand for the assignment type of a DocumentStatsField class. */
  type PersistedType<Opts extends Options = DefaultOptions> = DataField.DerivedInitializedType<
    SchemaField.InnerPersistedType<Schema>,
    MergedOptions<Opts>
  >;

  type ConstructorData = SchemaField.InnerAssignmentType<Schema>;
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
    lastModifiedBy: ForeignDocumentField<typeof foundry.documents.BaseUser, { idOnly: true }>;
  }
}

/**
 * A special type of error that wraps multiple errors which occurred during DataModel validation.
 * @typeParam Errors - the type of the errors contained in this error
 */
declare class ModelValidationError<
  Errors extends ModelValidationError.Errors = ModelValidationError.Errors
> extends Error {
  /**
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
  type Errors = Record<number | string | symbol, Error> | Error[] | string;
}

/**
 * @deprecated since v10 and replaced by the SystemDataField class
 * @see SystemDataField
 */
export function systemDataField<T extends Document.SystemConstructor>(document: InstanceType<T>): SystemDataField<T>;

/**
 * @deprecated since v10 and replaced by the ForeignDocumentField class
 * @see ForeignDocumentField
 */
export function foreignDocumentField<T extends Document.Constructor>(options: {
  type: { model: T };
}): ForeignDocumentField<T>;

/**
 * @deprecated since v10 and replaced by the EmbeddedCollectionField class
 * @see EmbeddedCollectionField
 */
export function embeddedCollectionField<E extends Document.Constructor, O extends DataFieldOptions.Any>(
  document: E,
  options?: O
): EmbeddedCollectionField<
  E,
  EmbeddedCollectionField.AssignmentElementType<E>,
  EmbeddedCollectionField.InitializedElementType<E>,
  O
>;

/**
 * @deprecated since v10 and should be replaced with explicit use of new field classes
 */
export function field(
  field: { type: typeof String | typeof Number | typeof Boolean | typeof Object | Array<any> | object },
  options?: DataFieldOptions.Any
): DataField.Any;

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
  EmbeddedCollectionField,
  EmbeddedDataField,
  FilePathField,
  ForeignDocumentField,
  HTMLField,
  IntegerSortField,
  JSONField,
  NumberField,
  ObjectField,
  SchemaField,
  SetField,
  StringField,
  SystemDataField,
  ModelValidationError
};
