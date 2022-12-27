import { AnyDataModel, Document } from "../abstract/module.mjs";
import type DataModel from "../abstract/data.mjs.js";
import type { CONST } from "../module.mjs.js";
import type { DOCUMENT_OWNERSHIP_LEVELS } from "../constants.mjs.js";
import type { AnyDocument } from "../abstract/document.mjs.js";

// FIXME: Document all helper types and type params

/**
 * @typeParam InitializedType - the type of the initialized value of the field
 */
type InitialType<InitializedType> = InitializedType | ((initialData: unknown) => InitializedType);

interface BaseTypeExtendingOptions {
  required?: boolean;
  nullable?: boolean;
  initial?: InitialType<any>;
}

export type AnyDataFieldOptions = DataFieldOptions<any, any>;
export type HomogenousDataFieldOptions<T> = DataFieldOptions<DataField.AssignmentType<T>, DataField.InitializedType<T>>;

declare global {
  interface DataFieldOptions<AssignmentType, InitializedType> {
    /** Is this field required to be populated? */
    required?: boolean;

    /** Can this field have null values? */
    nullable?: boolean;

    /** The initial value of a field, or a function which assigns that initial value. */
    initial?: InitialType<InitializedType>;

    /** A data validation function which accepts one argument with the current value. */
    validate?: (value: AssignmentType) => void;

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
}

export type AnyDataField = DataField<any, any>;
export type UnknownDataField = DataField<AnyDataFieldOptions, unknown>;

/**
 * An abstract class that defines the base pattern for a data field within a data schema.
 */
declare abstract class DataField<
  Options extends DataFieldOptions<DataField.AssignmentType<any, Options>, DataField.InitializedType<any, Options>> = {
    required: false;
    nullable: false;
    initial: undefined;
  },
  AssignmentType extends DataField.AssignmentType<any, Options> = DataField.InferredAssignmentType<any, Options>,
  InitializedType extends DataField.InitializedType<any, Options> = DataField.InferredInitializedType<any, Options>,
  PersistedType = InitializedType
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
  initial: InitialType<InitializedType>;

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
  parent: AnyDataField | undefined;

  /**
   * Default parameters for this field type
   * @remarks This is not entirely type-safe, overrides should specifiy a more concrete return type.
   */
  protected static get _defaults(): AnyDataFieldOptions;

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
    options?: DataField.ValidationOptions<AnyDataField>
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
  protected _validateType(value: InitializedType, options?: DataField.ValidationOptions<AnyDataField>): boolean | void;

  /**
   * Initialize the original source data into a mutable copy for the DataModel instance.
   * @param value - The source value of the field
   * @param model - The DataModel instance that this field belongs to
   * @returns An initialized copy of the source data
   */
  initialize(value: PersistedType, model: AnyDataModel): (() => InitializedType | null) | InitializedType;

  /**
   * Export the current value of the field into a serializable object.
   * @param value - The initialized value of the field
   * @returns An exported representation of the field
   */
  toObject(value: InitializedType): PersistedType;
}

declare namespace DataField {
  /** A type to infer the possible assignment type to a DataField, based on the options of the field. */
  type AssignmentType<BaseType, Options extends BaseTypeExtendingOptions = BaseTypeExtendingOptions> =
    | BaseType
    | (Options["nullable"] extends true
        ? null
        : Options["required"] extends true
        ? undefined extends Options["initial"]
          ? never
          : null
        : null)
    | (Options["required"] extends false ? undefined : undefined extends Options["initial"] ? never : undefined);

  /** A type to infer the possible initialized type of a DataField, based on the options of the field. */
  type InitializedType<BaseType, Options extends BaseTypeExtendingOptions = BaseTypeExtendingOptions> =
    | BaseType
    | (Options["nullable"] extends true ? null : never)
    | (Options["required"] extends true ? never : undefined extends Options["initial"] ? undefined : never);

  /** A type to infer the concrete assignment type from the given base and options. */
  type InferredAssignmentType<
    BaseAssignmentType,
    Options extends DataFieldOptions<any, any>
  > = Options extends DataFieldOptions<infer A extends AssignmentType<BaseAssignmentType, Options>, any> ? A : never;

  /** A type to infer the concrete initialized type from the given base and options. */
  type InferredInitializedType<
    BaseInitializedType,
    Options extends DataFieldOptions<any, any>
  > = Options extends DataFieldOptions<any, infer I extends InitializedType<BaseInitializedType, Options>> ? I : never;

  interface CleanOptions {
    /** Whether to perform partial cleaning? */
    partial?: boolean;

    /** The root data model being cleaned */
    source?: {
      type?: string;
    };
  }

  interface ValidationOptions<DataField> extends DataValidationOptions {
    source?: object;
    validate?: (this: DataField, value: unknown, options: ValidationOptions<DataField>) => boolean;
  }
}

/**
 * A special class of {@link DataField} which defines a data schema.
 */
declare class SchemaField<
  Options extends DataFieldOptions<
    DataField.AssignmentType<object, Options>,
    DataField.InitializedType<object, Options>
  > = {
    required: true;
    nullable: false;
    initial: object;
  },
  AssignmentType extends DataField.AssignmentType<object, Options> = DataField.InferredAssignmentType<object, Options>,
  InitializedType extends DataField.InitializedType<object, Options> = DataField.InferredInitializedType<
    object,
    Options
  >,
  PersistedType = DataField.InitializedType<object, Options>
> extends DataField<Options, AssignmentType, InitializedType, PersistedType> {
  /**
   * @param fields  - The contained field definitions
   * @param options - Options which configure the behavior of the field
   */
  constructor(fields: DataSchema, options?: Options);

  /** @defaultValue `true` */
  override required: boolean;

  /** @defaultValue `false` */
  override nullable: boolean;

  /** @defaultValue `() => this.clean({})` */
  override initial: InitialType<InitializedType>;

  protected static override get _defaults(): HomogenousDataFieldOptions<object>;

  /**
   * The contained field definitions.
   */
  fields: DataSchema;

  /**
   * Initialize and validate the structure of the provided field definitions.
   * @param fields - The provided field definitions
   * @returns The validated schema
   */
  protected _initialize(fields: DataSchema): DataSchema;

  /**
   * Iterate over a SchemaField by iterating over its fields.
   */
  [Symbol.iterator](): Iterable<UnknownDataField>;

  /**
   * An array of field names which are present in the schema.
   */
  keys(): keyof this["fields"];

  /**
   * An array of DataField instances which are present in the schema.
   */
  values(): ValueOf<this["fields"]>;

  /**
   * An array of [name, DataField] tuples which define the schema.
   */
  entries(): [name: keyof this["fields"], dataField: ValueOf<this["fields"]>][];

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
  get(fieldName: string): UnknownDataField | undefined;

  protected override _cast(value: AssignmentType): InitializedType;

  protected override _cleanType(value: InitializedType, options?: DataField.CleanOptions | undefined): InitializedType;

  override initialize(value: PersistedType, model: AnyDataModel): InitializedType | (() => InitializedType | null);

  protected override _validateType(
    value: InitializedType,
    options?: DataField.ValidationOptions<AnyDataField> | undefined
  ): boolean | void;

  override toObject(value: InitializedType): PersistedType;

  override apply<Value, Options, Return>(
    fn: keyof this | ((this: this, value: Value, options: Options) => Return),
    value: Value,
    options?: Options | undefined
  ): Return;
}

/**
 * A subclass of [DataField]{@link DataField} which deals with boolean-typed data.
 */
declare class BooleanField<
  Options extends DataFieldOptions<
    DataField.AssignmentType<BooleanField.BaseAssignmentType, Options>,
    DataField.InitializedType<boolean, Options>
  > = {
    required: true;
    nullable: false;
    initial: false;
  },
  AssignmentType extends DataField.AssignmentType<
    BooleanField.BaseAssignmentType,
    Options
  > = DataField.InferredAssignmentType<BooleanField.BaseAssignmentType, Options>,
  InitializedType extends DataField.InitializedType<boolean, Options> = DataField.InferredInitializedType<
    boolean,
    Options
  >,
  PersistedType = DataField.InitializedType<boolean, Options>
> extends DataField<Options, AssignmentType, InitializedType, PersistedType> {
  /** @defaultValue `true` */
  override required: boolean;

  /** @defaultValue `false` */
  override nullable: boolean;

  /** @defaultValue `false` */
  override initial: InitialType<InitializedType>;

  protected static override get _defaults(): DataFieldOptions<
    BooleanField.BaseAssignmentType | null | undefined,
    boolean | null | undefined
  >;

  protected override _cast(value: AssignmentType): InitializedType;

  protected override _validateType(
    value: InitializedType,
    options?: DataField.ValidationOptions<AnyDataField> | undefined
  ): boolean | void;
}

declare namespace BooleanField {
  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean#boolean_coercion
   */
  type BaseAssignmentType = boolean | number | object | string;
}

declare global {
  interface NumberFieldOptions<AssignmentType, InitializedType>
    extends DataFieldOptions<AssignmentType, InitializedType> {
    /** A minimum allowed value */
    min?: number;

    /** A maximum allowed value */
    max?: number;

    /** A permitted step size */
    step?: number;

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
    choices?: number[] | Record<number, string> | (() => number[] | Record<number, string>);
  }
}

/**
 * A subclass of [DataField]{@link DataField} which deals with number-typed data.
 */
declare class NumberField<
  Options extends NumberFieldOptions<
    DataField.AssignmentType<NumberField.BaseAssignmentType, Options>,
    DataField.InitializedType<number, Options>
  > = {
    required: false;
    initial: null;
    nullable: true;
  },
  AssignmentType extends DataField.AssignmentType<
    NumberField.BaseAssignmentType,
    Options
  > = DataField.InferredAssignmentType<NumberField.BaseAssignmentType, Options>,
  InitializedType extends DataField.InitializedType<number, Options> = DataField.InferredInitializedType<
    number,
    Options
  >,
  PersistedType = DataField.InitializedType<number, Options>
> extends DataField<Options, AssignmentType, InitializedType, PersistedType> {
  /**
   * @param options - Options which configure the behavior of the field
   */
  constructor(options?: Options);

  /** @defaultValue `null` */
  override initial: InitialType<InitializedType>;

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

  protected static override get _defaults(): DataFieldOptions<
    NumberField.BaseAssignmentType | null | undefined,
    number | null | undefined
  >;

  protected override _cast(value: AssignmentType): InitializedType;

  protected override _cleanType(value: InitializedType, options?: DataField.CleanOptions | undefined): InitializedType;

  protected override _validateType(
    value: InitializedType,
    options?: DataField.ValidationOptions<AnyDataField> | undefined
  ): boolean | void;

  /**
   * Test whether a provided value is a valid choice from the allowed choice set
   * @param value - The provided value
   * @returns Is the choice valid?
   */
  #isValidChoice(value: AssignmentType): boolean;
}

declare namespace NumberField {
  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number#number_coercion
   */
  type BaseAssignmentType = number | boolean | string | BigInt | object;
}

declare global {
  /**
   * @typeParam Value - the type of the value of the field
   */
  interface StringFieldOptions<AssignmentType, InitializedType>
    extends DataFieldOptions<AssignmentType, InitializedType> {
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
 */
declare class StringField<
  Options extends StringFieldOptions<
    DataField.AssignmentType<StringField.BaseAssignmentType, Options>,
    DataField.InitializedType<string | object | AnyDocument, Options>
  > = {
    required: false;
    initial: string;
    nullable: false;
  },
  AssignmentType extends DataField.AssignmentType<
    StringField.BaseAssignmentType,
    Options
  > = DataField.InferredAssignmentType<StringField.BaseAssignmentType, Options>,
  InitializedType extends DataField.InitializedType<
    string | object | AnyDocument,
    Options
  > = DataField.InferredInitializedType<string | object | AnyDocument, Options>,
  PersistedType = DataField.InitializedType<string, Options>
> extends DataField<Options, AssignmentType, InitializedType, PersistedType> {
  /**
   * @param options - Options which configure the behavior of the field
   */
  constructor(options?: Options);

  /** @defaultValue `""` */
  override initial: InitialType<InitializedType>;

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

  protected static override get _defaults(): DataFieldOptions<
    StringField.BaseAssignmentType | AnyDocument | null | undefined,
    string | AnyDocument | null | undefined
  >;

  override clean(value: AssignmentType, options?: DataField.CleanOptions | undefined): InitializedType;

  protected override _cast(value: AssignmentType): InitializedType;

  protected override _validateSpecial(value: AssignmentType): boolean | void;

  protected override _validateType(
    value: InitializedType,
    options?: DataField.ValidationOptions<AnyDataField> | undefined
  ): boolean | void;

  /**
   * Test whether a provided value is a valid choice from the allowed choice set
   * @param value - The provided value
   * @returns Is the choice valid?
   */
  #isValidChoice(value: AssignmentType): boolean;
}

declare namespace StringField {
  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String#string_coercion
   */
  type BaseAssignmentType = string | boolean | number | BigInt | symbol | object;
}

/**
 * A subclass of [DataField]{@link DataField} which deals with object-typed data.
 */
declare class ObjectField<
  Options extends DataFieldOptions<
    DataField.AssignmentType<object, Options>,
    DataField.InitializedType<object, Options>
  > = {
    required: true;
    nullable: false;
    initial: () => object;
  },
  AssignmentType extends DataField.AssignmentType<object, Options> = DataField.InferredAssignmentType<object, Options>,
  InitializedType extends DataField.InitializedType<object, Options> = DataField.InferredInitializedType<
    object,
    Options
  >,
  PersistedType = DataField.InitializedType<object, Options>
> extends DataField<Options, AssignmentType, InitializedType, PersistedType> {
  /** @defaultValue `true` */
  override required: boolean;

  /** @defaultValue `false` */
  override nullable: boolean;

  /** @defaultValue `() => ({})` */
  override initial: InitialType<InitializedType>;

  protected static override get _defaults(): DataFieldOptions<object | null | undefined, object | null | undefined>;

  protected override _cast(value: AssignmentType): InitializedType;

  override initialize(value: PersistedType, model: AnyDataModel): InitializedType | (() => InitializedType | null);

  override toObject(value: InitializedType): PersistedType;

  protected override _validateType(
    value: InitializedType,
    options?: DataField.ValidationOptions<AnyDataField> | undefined
  ): boolean | void;
}

/**
 * A subclass of [DataField]{@link DataField} which deals with array-typed data.
 */
declare class ArrayField<
  ElementFieldType extends AnyDataField | typeof Document,
  AssignmentElementType,
  InitializedElementType,
  Options extends DataFieldOptions<
    DataField.AssignmentType<ArrayField.BaseAssignmentType<AssignmentElementType>, Options>,
    DataField.InitializedType<
      InitializedElementType[] | Set<InitializedElementType> | Collection<InitializedElementType>,
      Options
    >
  > = {
    required: true;
    nullable: false;
    initial: () => InitializedElementType[];
  },
  AssignmentType extends DataField.AssignmentType<
    ArrayField.BaseAssignmentType<AssignmentElementType>,
    Options
  > = DataField.InferredAssignmentType<ArrayField.BaseAssignmentType<AssignmentElementType>, Options>,
  InitializedType extends DataField.InitializedType<
    InitializedElementType[] | Set<InitializedElementType> | Collection<InitializedElementType>,
    Options
  > = DataField.InferredInitializedType<
    InitializedElementType[] | Set<InitializedElementType> | Collection<InitializedElementType>,
    Options
  >,
  PersistedElementType = InitializedElementType,
  PersistedType = DataField.InitializedType<PersistedElementType[]>
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
  override initial: InitialType<InitializedType>;

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
  protected static _validateElementType<T extends AnyDataField>(element: T): T;

  protected static override get _defaults(): HomogenousDataFieldOptions<any[] | null | undefined>;

  protected override _cast(value: AssignmentType): InitializedType;

  protected override _cleanType(value: InitializedType, options?: DataField.CleanOptions | undefined): InitializedType;

  protected override _validateType(
    value: InitializedType,
    options?: DataField.ValidationOptions<AnyDataField> | undefined
  ): boolean | void;

  /**
   * Validate every element of the ArrayField
   * @param value   - The array to validate
   * @param options - Validation options
   * @returns An array of element-specific errors
   */
  protected _validateElements(
    value: any[],
    options?: DataField.ValidationOptions<AnyDataField>
  ): ModelValidationError[];

  override initialize(value: PersistedType, model: AnyDataModel): InitializedType | (() => InitializedType | null);

  override toObject(value: InitializedType): PersistedType;

  override apply<Value, Options, Return>(
    fn: keyof this | ((this: this, value: Value, options: Options) => Return),
    value: Value,
    options?: Options | undefined
  ): Return;
}

declare namespace ArrayField {
  type BaseAssignmentType<AssignmentElementType> =
    | Record<number | string, AssignmentElementType>
    | AssignmentElementType[]
    | AssignmentElementType;
}

/**
 * A subclass of [ArrayField]{@link ArrayField} which supports a set of contained elements.
 * Elements in this set are treated as fungible and may be represented in any order or discarded if invalid.
 */
declare class SetField<
  ElementFieldType extends AnyDataField,
  AssignmentElementType,
  InitializedElementType,
  Options extends DataFieldOptions<
    DataField.AssignmentType<ArrayField.BaseAssignmentType<AssignmentElementType>, Options>,
    DataField.InitializedType<Set<InitializedElementType>, Options>
  > = {
    required: true;
    nullable: false;
    initial: () => InitializedElementType[];
  },
  AssignmentType extends DataField.AssignmentType<
    ArrayField.BaseAssignmentType<AssignmentElementType>,
    Options
  > = DataField.InferredAssignmentType<ArrayField.BaseAssignmentType<AssignmentElementType>, Options>,
  InitializedType extends DataField.InitializedType<
    Set<InitializedElementType>,
    Options
  > = DataField.InferredInitializedType<Set<InitializedElementType>, Options>,
  PersistedElementType = InitializedElementType,
  PersistedType = DataField.InitializedType<PersistedElementType[]>
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
    options?: DataField.ValidationOptions<AnyDataField> | undefined
  ): ModelValidationError<ModelValidationError.Errors>[];

  override initialize(value: PersistedType, model: AnyDataModel): InitializedType | (() => InitializedType | null);

  override toObject(value: InitializedType): PersistedType;
}

declare namespace SetField {
  type BaseAssignmentType<AssignmentElementType> =
    | ArrayField.BaseAssignmentType<AssignmentElementType>
    | Iterable<AssignmentElementType>;
}

/**
 * A subclass of [ObjectField]{@link ObjectField} which embeds some other DataModel definition as an inner object.
 */
declare class EmbeddedDataField<
  ModelType extends typeof DataModel,
  Options extends DataFieldOptions<
    DataField.AssignmentType<object, Options>,
    DataField.InitializedType<object, Options>
  > = {
    required: true;
    nullable: false;
    initial: object;
  },
  AssignmentType extends DataField.AssignmentType<object, Options> = DataField.AssignmentType<object, Options>,
  InitializedType extends DataField.InitializedType<
    InstanceType<ModelType>["schema"]["fields"],
    Options
  > = DataField.InferredInitializedType<InstanceType<ModelType>["schema"]["fields"], Options>,
  PersistedType = DataField.InitializedType<object, Options>
> extends SchemaField<Options, AssignmentType, InitializedType, PersistedType> {
  /**
   * @param model   - The class of DataModel which should be embedded in this field
   * @param options - Options which configure the behavior of the field
   */
  constructor(model: ModelType, options?: Options);

  /**
   * The embedded DataModel definition which is contained in this field.
   */
  model: ModelType;

  protected override _initialize(fields: DataSchema): DataSchema;

  override initialize(value: PersistedType, model: AnyDataModel): InitializedType | (() => InitializedType | null);

  override toObject(value: InitializedType): PersistedType;
}

/**
 * A subclass of [ArrayField]{@link ArrayField} which supports an embedded Document collection.
 * Invalid elements will be dropped from the collection during validation rather than failing for the field entirely.
 */
declare class EmbeddedCollectionField<
  ElementFieldType extends typeof Document,
  AssignmentElementType,
  InitializedElementType,
  Options extends DataFieldOptions<
    DataField.AssignmentType<ArrayField.BaseAssignmentType<AssignmentElementType>, Options>,
    DataField.InitializedType<Collection<InitializedElementType>, Options>
  > = {
    required: true;
    nullable: false;
    initial: () => InitializedElementType[];
  },
  AssignmentType extends DataField.AssignmentType<
    ArrayField.BaseAssignmentType<AssignmentElementType>,
    Options
  > = DataField.InferredAssignmentType<ArrayField.BaseAssignmentType<AssignmentElementType>, Options>,
  InitializedType extends DataField.InitializedType<
    Collection<InitializedElementType>,
    Options
  > = DataField.InferredInitializedType<Collection<InitializedElementType>, Options>,
  PersistedElementType = InitializedElementType,
  PersistedType = DataField.InitializedType<PersistedElementType[]>
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

  protected static override _validateElementType<T extends AnyDataField | typeof Document>(element: T): T;

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
    options?: DataField.ValidationOptions<AnyDataField> | undefined
  ): ModelValidationError<ModelValidationError.Errors>[];

  override initialize(value: PersistedType, model: AnyDataModel): InitializedType | (() => InitializedType | null);

  override toObject(value: InitializedType): PersistedType;

  override apply<Value, Options, Return>(
    fn: keyof this | ((this: this, value: Value, options: Options) => Return),
    value: Value,
    options?: Options | undefined
  ): Return;
}

/**
 * A subclass of [StringField]{@link StringField} which provides the primary _id for a Document.
 * The field may be initially null, but it must be non-null when it is saved to the database.
 */
declare class DocumentIdField<
  Options extends StringFieldOptions<
    DataField.AssignmentType<StringField.BaseAssignmentType, Options>,
    DataField.InitializedType<string | AnyDocument, Options>
  > = {
    required: true;
    nullable: true;
    initial: null;
  },
  AssignmentType extends DataField.AssignmentType<
    StringField.BaseAssignmentType | AnyDocument,
    Options
  > = DataField.InferredAssignmentType<StringField.BaseAssignmentType | AnyDocument, Options>,
  InitializedType extends DataField.InitializedType<string | AnyDocument, Options> = DataField.InferredInitializedType<
    string | AnyDocument,
    Options
  >,
  PersistedType = DataField.InitializedType<string, Options>
> extends StringField<Options, AssignmentType, InitializedType, PersistedType> {
  /** @defaultValue `true` */
  override required: boolean;

  /** @defaultValue `false` */
  override blank: boolean;

  /** @defaultValue `true` */
  override nullable: boolean;

  /** @defaultValue `null` */
  override initial: InitialType<InitializedType>;

  /** @defaultValue `true` */
  override readonly: boolean;

  /** @defaultValue `"is not a valid Document ID string"` */
  override validationError: string;

  protected static override get _defaults(): DataFieldOptions<
    StringField.BaseAssignmentType | AnyDocument | null | undefined,
    string | AnyDocument | null | undefined
  >;

  protected override _cast(value: AssignmentType): InitializedType;

  protected override _validateType(
    value: InitializedType,
    options?: DataField.ValidationOptions<AnyDataField> | undefined
  ): boolean | void;
}

/**
 * A special class of [StringField]{@link StringField} field which references another DataModel by its id.
 * This field may also be null to indicate that no foreign model is linked.
 */
declare class ForeignDocumentField<
  DocumentType extends typeof Document,
  Options extends StringFieldOptions<
    DataField.AssignmentType<StringField.BaseAssignmentType | InstanceType<DocumentType>, Options>,
    DataField.InitializedType<string | InstanceType<DocumentType>, Options>
  > = {
    required: true;
    nullable: true;
    initial: null;
  },
  AssignmentType extends DataField.AssignmentType<
    StringField.BaseAssignmentType | InstanceType<DocumentType>,
    Options
  > = DataField.InferredAssignmentType<StringField.BaseAssignmentType | InstanceType<DocumentType>, Options>,
  InitializedType extends DataField.InitializedType<
    string | InstanceType<DocumentType>,
    Options
  > = DataField.InferredInitializedType<string | InstanceType<DocumentType>, Options>,
  PersistedType = DataField.InitializedType<string, Options>
> extends DocumentIdField<Options, AssignmentType, InitializedType, PersistedType> {
  /**
   * @param model   - The foreign DataModel class definition which this field should link to.
   * @param options - Options which configure the behavior of the field
   */
  constructor(model: DocumentType, options?: Options & { idOnly?: boolean });

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

  protected static override get _defaults(): DataFieldOptions<
    StringField.BaseAssignmentType | AnyDocument | null | undefined,
    string | AnyDocument | null | undefined
  >;

  protected override _cast(value: AssignmentType): InitializedType;

  override initialize(value: PersistedType, model: AnyDataModel): InitializedType | (() => InitializedType | null);

  override toObject(value: InitializedType): PersistedType;
}

/**
 * A subclass of [ObjectField]{@link ObjectField} which supports a system-level data object.
 */
declare class SystemDataField<
  DocumentType extends typeof Document,
  Options extends DataFieldOptions<
    DataField.AssignmentType<AnyDataModel | object, Options>,
    DataField.InitializedType<object, Options>
  > = {
    required: true;
    nullable: false;
    initial: () => object;
  },
  AssignmentType extends DataField.AssignmentType<AnyDataModel | object, Options> = DataField.InferredAssignmentType<
    AnyDataModel | object,
    Options
  >,
  InitializedType extends DataField.InitializedType<object, Options> = DataField.InferredInitializedType<
    object,
    Options
  >,
  PersistedType = DataField.InitializedType<object, Options>
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
  getModelForType(type: string): typeof DataModel | null;

  override getInitialValue(data: { type?: string } | undefined): InitializedType;

  protected override _cleanType(value: InitializedType, options?: DataField.CleanOptions | undefined): InitializedType;

  override initialize(value: PersistedType, model: AnyDataModel): InitializedType | (() => InitializedType | null);

  override toObject(value: InitializedType): PersistedType;
}

/**
 * A special [StringField]{@link StringField} which records a standardized CSS color string.
 */
declare class ColorField<
  Options extends StringFieldOptions<
    DataField.AssignmentType<StringField.BaseAssignmentType, Options>,
    DataField.InitializedType<string, Options>
  > = {
    required: false;
    initial: null;
    nullable: true;
  },
  AssignmentType extends DataField.AssignmentType<string | object, Options> = DataField.InferredAssignmentType<
    string | object,
    Options
  >,
  InitializedType extends DataField.InitializedType<string, Options> = DataField.InferredInitializedType<
    string,
    Options
  >,
  PersistedType = DataField.InitializedType<string, Options>
> extends StringField<Options, AssignmentType, InitializedType, PersistedType> {
  /** @defaultValue `true` */
  override nullable: boolean;

  /** @defaultValue `null` */
  override initial: InitialType<InitializedType>;

  /** @defaultValue `false` */
  override blank: boolean;

  /** @defaultValue `"is not a valid hexadecimal color string"` */
  override validationError: string;

  protected static override get _defaults(): DataFieldOptions<
    StringField.BaseAssignmentType | null | undefined,
    string | null | undefined
  >;

  override clean(value: AssignmentType, options?: DataField.CleanOptions | undefined): InitializedType;

  protected override _validateType(
    value: InitializedType,
    options?: DataField.ValidationOptions<AnyDataField> | undefined
  ): boolean | void;
}

declare global {
  /**
   * @typeParam Value  - the type of the value of the field
   */
  interface FilePathFieldOptions<AssignmentType, InitializedType>
    extends StringFieldOptions<AssignmentType, InitializedType> {
    /** A set of categories in CONST.FILE_CATEGORIES which this field supports */
    categories?: (keyof typeof CONST.FILE_CATEGORIES)[];

    /** Is embedded base64 data supported in lieu of a file path? */
    base64?: string;

    /** Does this file path field allow wildcard characters? */
    wildcard?: string;
  }
}

/**
 * A special [StringField]{@link StringField} which records a file path or inline base64 data.
 */
declare class FilePathField<
  Options extends FilePathFieldOptions<
    DataField.AssignmentType<StringField.BaseAssignmentType, Options>,
    DataField.InitializedType<string, Options>
  > = {
    required: false;
    nullable: true;
    initial: null;
  },
  AssignmentType extends DataField.AssignmentType<
    StringField.BaseAssignmentType,
    Options
  > = DataField.InferredAssignmentType<StringField.BaseAssignmentType, Options>,
  InitializedType extends DataField.InitializedType<string, Options> = DataField.InferredInitializedType<
    string,
    Options
  >,
  PersistedType = DataField.InitializedType<string, Options>
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
  override initial: InitialType<InitializedType>;

  protected static override get _defaults(): DataFieldOptions<
    StringField.BaseAssignmentType | null | undefined,
    string | null | undefined
  >;

  protected override _validateType(
    value: InitializedType,
    options?: DataField.ValidationOptions<AnyDataField> | undefined
  ): boolean | void;
}

/**
 * A special [NumberField]{@link NumberField} which represents an angle of rotation in degrees between 0 and 360.
 */
declare class AngleField<
  Options extends NumberFieldOptions<
    DataField.AssignmentType<NumberField.BaseAssignmentType, Options>,
    DataField.InitializedType<number, Options>
  > = {
    required: true;
    nullable: false;
    initial: number;
  },
  AssignmentType extends DataField.AssignmentType<
    NumberField.BaseAssignmentType,
    Options
  > = DataField.InferredAssignmentType<NumberField.BaseAssignmentType, Options>,
  InitializedType extends DataField.InitializedType<number, Options> = DataField.InferredInitializedType<
    number,
    Options
  >,
  PersistedType = DataField.InitializedType<number, Options>
> extends NumberField<Options, AssignmentType, InitializedType, PersistedType> {
  /** @defaultValue `true` */
  override required: boolean;

  /** @defaultValue `false` */
  override nullable: boolean;

  /** @defaultValue `0` */
  override initial: InitialType<InitializedType>;

  /** @defaultValue `0` */
  base: number;

  /** @defaultValue `0` */
  override min: number | undefined;

  /** @defaultValue `360` */
  override max: number | undefined;

  /** @defaultValue `"is not a number between 0 and 360"` */
  override validationError: string;

  protected static override get _defaults(): DataFieldOptions<
    NumberField.BaseAssignmentType | null | undefined,
    number | null | undefined
  >;

  protected override _cast(value: AssignmentType): InitializedType;
}

/**
 * A special [NumberField]{@link NumberField} represents a number between 0 and 1.
 */
declare class AlphaField<
  Options extends NumberFieldOptions<
    DataField.AssignmentType<NumberField.BaseAssignmentType, Options>,
    DataField.InitializedType<number, Options>
  > = {
    required: true;
    nullable: false;
    initial: number;
  },
  AssignmentType extends DataField.AssignmentType<
    NumberField.BaseAssignmentType,
    Options
  > = DataField.InferredAssignmentType<NumberField.BaseAssignmentType, Options>,
  InitializedType extends DataField.InitializedType<number, Options> = DataField.InferredInitializedType<
    number,
    Options
  >,
  PersistedType = DataField.InitializedType<number, Options>
> extends NumberField<Options, AssignmentType, InitializedType, PersistedType> {
  /** @defaultValue `true` */
  override required: boolean;

  /** @defaultValue `false` */
  override nullable: boolean;

  /** @defaultValue `1` */
  override initial: InitialType<InitializedType>;

  /** @defaultValue `0` */
  override min: number | undefined;

  /** @defaultValue `1` */
  override max: number | undefined;

  /** @defaultValue `"is not a number between 0 and 1"` */
  override validationError: string;

  protected static override get _defaults(): DataFieldOptions<
    NumberField.BaseAssignmentType | null | undefined,
    number | null | undefined
  >;
}

/**
 * A special [ObjectField]{@link ObjectField} which captures a mapping of User IDs to Document permission levels.
 */
declare class DocumentOwnershipField<
  Options extends DataFieldOptions<
    DataField.AssignmentType<object, Options>,
    DataField.InitializedType<Record<string, DOCUMENT_OWNERSHIP_LEVELS>, Options>
  > = {
    required: true;
    nullable: false;
    initial: Record<string, DOCUMENT_OWNERSHIP_LEVELS>;
  },
  AssignmentType extends DataField.AssignmentType<
    Record<string, DOCUMENT_OWNERSHIP_LEVELS>,
    Options
  > = DataField.InferredAssignmentType<Record<string, DOCUMENT_OWNERSHIP_LEVELS>, Options>,
  InitializedType extends DataField.InitializedType<
    Record<string, DOCUMENT_OWNERSHIP_LEVELS>,
    Options
  > = DataField.InferredInitializedType<Record<string, DOCUMENT_OWNERSHIP_LEVELS>, Options>,
  PersistedType = DataField.InitializedType<object, Options>
> extends ObjectField<Options, AssignmentType, InitializedType, PersistedType> {
  /** @defaultValue `{"default": DOCUMENT_OWNERSHIP_LEVELS.NONE}` */
  override initial: InitialType<InitializedType>;

  /** @defaultValue `"is not a mapping of user IDs and document permission levels"` */
  override validationError: string;

  protected static override get _defaults(): DataFieldOptions<object | null | undefined, object | null | undefined>;

  protected override _validateType(
    value: InitializedType,
    options?: DataField.ValidationOptions<AnyDataField> | undefined
  ): boolean | void;
}

/**
 * A special [StringField]{@link StringField} which contains serialized JSON data.
 */
declare class JSONField<
  Options extends StringFieldOptions<
    DataField.AssignmentType<StringField.BaseAssignmentType, Options>,
    DataField.InitializedType<object, Options>
  > = {
    required: false;
    nullable: false;
    initial: undefined;
  },
  AssignmentType extends DataField.AssignmentType<string, Options> = DataField.InferredAssignmentType<string, Options>,
  InitializedType extends DataField.InitializedType<object, Options> = DataField.InferredInitializedType<
    object,
    Options
  >,
  PersistedType = DataField.InitializedType<string, Options>
> extends StringField<Options, AssignmentType, InitializedType, PersistedType> {
  /** @defaultValue `false` */
  override blank: boolean;

  /** @defaultValue `undefined` */
  override initial: InitialType<InitializedType>;

  /** @defaultValue `"is not a valid JSON string"` */
  override validationError: string;

  protected static override get _defaults(): DataFieldOptions<
    StringField.BaseAssignmentType | null | undefined,
    string | null | undefined
  >;

  override clean(value: AssignmentType, options?: DataField.CleanOptions | undefined): InitializedType;

  protected override _validateType(
    value: InitializedType,
    options?: DataField.ValidationOptions<AnyDataField> | undefined
  ): boolean | void;

  override initialize(value: PersistedType, model: AnyDataModel): InitializedType | (() => InitializedType | null);

  override toObject(value: InitializedType): PersistedType;
}

/**
 * A subclass of [StringField]{@link StringField} which contains a sanitized HTML string.
 * This class does not override any StringField behaviors, but is used by the server-side to identify fields which
 * require sanitization of user input.
 */
declare class HTMLField<
  Options extends StringFieldOptions<
    DataField.AssignmentType<StringField.BaseAssignmentType, Options>,
    DataField.InitializedType<string | object | AnyDocument, Options>
  > = {
    required: true;
    nullable: false;
    initial: string;
  },
  AssignmentType extends DataField.AssignmentType<
    StringField.BaseAssignmentType,
    Options
  > = DataField.InferredAssignmentType<StringField.BaseAssignmentType, Options>,
  InitializedType extends DataField.InitializedType<
    string | object | AnyDocument,
    Options
  > = DataField.InferredInitializedType<string | object | AnyDocument, Options>,
  PersistedType = DataField.InitializedType<string, Options>
> extends StringField<Options, AssignmentType, InitializedType, PersistedType> {
  /** @defaultValue `true` */
  override required: boolean;

  /** @defaultValue `true` */
  override blank: boolean;

  protected static override get _defaults(): DataFieldOptions<
    StringField.BaseAssignmentType | null | undefined,
    string | null | undefined
  >;
}

/**
 * A subclass of {@link NumberField} which is used for storing integer sort keys.
 */
declare class IntegerSortField<
  Options extends NumberFieldOptions<
    DataField.AssignmentType<NumberField.BaseAssignmentType, Options>,
    DataField.InitializedType<number, Options>
  > = {
    required: true;
    nullable: false;
    initial: 0;
  },
  AssignmentType extends DataField.AssignmentType<
    NumberField.BaseAssignmentType,
    Options
  > = DataField.InferredAssignmentType<NumberField.BaseAssignmentType, Options>,
  InitializedType extends DataField.InitializedType<number, Options> = DataField.InferredInitializedType<
    number,
    Options
  >,
  PersistedType = DataField.InitializedType<number, Options>
> extends NumberField<Options, AssignmentType, InitializedType, PersistedType> {
  /** @defaultValue `true` */
  override required: boolean;

  /** @defaultValue `false` */
  override nullable: boolean;

  /** @defaultValue `true` */
  override integer: boolean;

  /** @defaultValue `0` */
  override initial: InitialType<InitializedType>;

  /** @defaultValue `"FOLDER.DocumentSort"` */
  override label: string;

  /** @defaultValue `"FOLDER.DocumentSortHint"` */
  override hint: string;
}

declare global {
  interface DocumentStats {
    /** The package name of the system the Document was created in. */
    systemId: string;

    /** The version of the system the Document was created in. */
    systemVersion: string;

    /** The core version the Document was created in. */
    coreVersion: string;

    /** A timestamp of when the Document was created. */
    createdTime: number;

    /** A timestamp of when the Document was last modified. */
    modifiedTime: number;

    /** The ID of the user who last modified the Document. */
    lastModifiedBy: string;
  }
}

interface DocumentStatsFieldDataSchema extends DataSchema {
  systemId: StringField<{ required: true; blank: false; nullable: true; initial: null }>;
  systemVersion: StringField<{ required: true; blank: false; nullable: true; initial: null }>;
  coreVersion: StringField<{ required: true; blank: false; nullable: true; initial: null }>;
  createdTime: NumberField;
  modifiedTime: NumberField;
  lastModifiedBy: ForeignDocumentField<foundry.documents.BaseUser, { idOnly: true }>;
}

/**
 * A subclass of {@link SchemaField} which stores document metadata in the _stats field.
 * @typeParam Value         - the type of the value of the field
 * @typeParam PersistedType - the type of the persisted value of the field
 */
declare class DocumentStatsField<
  Options extends DataFieldOptions<
    DataField.AssignmentType<DocumentStats, Options>,
    DataField.InitializedType<DocumentStats, Options>
  > = {
    required: true;
    nullable: false;
    initial: object;
  },
  AssignmentType extends DataField.AssignmentType<object, Options> = DataField.InferredAssignmentType<object, Options>,
  InitializedType extends DataField.InitializedType<object, Options> = DataField.InferredInitializedType<
    object,
    Options
  >,
  PersistedType = DataField.InitializedType<object, Options>
> extends SchemaField<Options, AssignmentType, InitializedType, PersistedType> {
  constructor(options?: DataFieldOptions<DocumentStats>);
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
export function systemDataField<T extends typeof Document>(document: InstanceType<T>): SystemDataField<T>;

/**
 * @deprecated since v10 and replaced by the ForeignDocumentField class
 * @see ForeignDocumentField
 */
export function foreignDocumentField<T extends typeof Document>(options: {
  type: { model: T };
}): ForeignDocumentField<T>;

/**
 * @deprecated since v10 and replaced by the EmbeddedCollectionField class
 * @see EmbeddedCollectionField
 */
export function embeddedCollectionField<E extends typeof Document, O extends DataFieldOptions<any>>(
  document: E,
  options?: O
): EmbeddedCollectionField<E, O extends DataFieldOptions<infer V> ? V : never>;

/**
 * @deprecated since v10 and should be replaced with explicit use of new field classes
 */
export function field(
  field: { type: typeof String | typeof Number | typeof Boolean | typeof Object | Array<any> | object },
  options?: DataFieldOptions<any>
): DataField<unknown>;

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
