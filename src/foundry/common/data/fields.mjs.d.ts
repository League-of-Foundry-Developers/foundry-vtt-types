import { AnyDataModel, Document } from "../abstract/module.mjs";
import type DataModel from "../abstract/data.mjs.js";
import type { CONST } from "../module.mjs.js";
import type { DOCUMENT_OWNERSHIP_LEVELS } from "../constants.mjs.js";
import type { AnyDocument } from "../abstract/document.mjs.js";

/**
 * @typeParam InitializedType - the type of the initialized value of the field
 */
type InitialType<InitializedType> = InitializedType | ((initialData: unknown) => InitializedType);

interface BaseTypeExtendingOptions {
  required?: boolean;
  nullable?: boolean;
  initial?: InitialType<any>;
}

declare global {
  /**
   * @typeParam BaseType - the base type of the associated DataField, without `null` or `undefined`
   */
  interface DataFieldOptions<BaseType> {
    /** Is this field required to be populated? */
    required?: boolean;

    /** Can this field have null values? */
    nullable?: boolean;

    /** The initial value of a field, or a function which assigns that initial value. */
    initial?: InitialType<DataField.InitializedType<BaseType, this>>;

    /** A data validation function which accepts one argument with the current value. */
    validate?: (value: DataField.AssignmentType<BaseType, this>) => void;

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

declare namespace DataField {
  /** A type to infer the possible assignment type to a DataField, based on the options of the field. */
  type AssignmentType<BaseType, Options extends BaseTypeExtendingOptions> =
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
  type InitializedType<BaseType, Options extends BaseTypeExtendingOptions> =
    | BaseType
    | (Options["nullable"] extends true ? null : never)
    | (Options["required"] extends true ? never : undefined extends Options["initial"] ? undefined : never);
}

/**
 * An abstract class that defines the base pattern for a data field within a data schema.
 * @typeParam Value         - the type of the value of the field
 * @typeParam PersistedType - the type of the persisted value of the field
 */
declare abstract class DataField<BaseType, Options extends DataFieldOptions<BaseType>, Value, PersistedType = Value> {
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
  initial: ((data: any) => Value) | Value | null | undefined;

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
  parent: DataField<any> | undefined;

  /**
   * Default parameters for this field type
   * @remarks This is not entirely type-safe, overrides should specifiy a more concrete return type.
   */
  protected static get _defaults(): DataFieldOptions<any>;

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
    fn: keyof this | ((this: DataField<any>, value: Value, options: Options) => Return),
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
  clean(value: any | null | undefined, options?: DataField.CleanOptions): Value;

  /**
   * Apply any cleaning logic specific to this DataField type.
   * @param value   - The appropriately coerced value.
   * @param options - Additional options for how the field is cleaned.
   * @returns The cleaned value.
   */
  protected _cleanType(value: Value, options?: DataField.CleanOptions): Value;

  /**
   * Cast a non-default value to ensure it is the correct type for the field
   * @param value - The provided non-default value
   * @returns The standardized value
   */
  protected abstract _cast(value: any): Value;

  /**
   * Attempt to retrieve a valid initial value for the DataField.
   * @param data - The source data object for which an initial value is required
   * @returns A valid initial value
   * @throws An error if there is no valid initial value defined
   */
  getInitialValue(data: DataField.CleanOptions["source"]): Value;

  /**
   * Validate a candidate input for this field, ensuring it meets the field requirements.
   * A validation failure can be provided as a raised Error (with a string message) or by returning false.
   * A validator which returns true denotes that the result is certainly valid and further validations are unnecessary.
   * @param value   - The initial value
   * @param options - Options which affect validation behavior
   *                  (default: `{}`)
   * @returns Returns a ModelValidationError if a validation failure occurred
   */
  validate(value: any, options?: DataField.ValidationOptions<DataField<any>>): ModelValidationError | undefined;

  /**
   * Special validation rules which supersede regular field validation.
   * This validator screens for certain values which are otherwise incompatible with this field like null or undefined.
   * @param value - The candidate value
   * @returns A boolean to indicate with certainty whether the value is valid.
   *          Otherwise, return void.
   * @throws May throw a specific error if the value is not valid
   */
  protected _validateSpecial(value: any): boolean | void;

  /**
   * A default type-specific validator that can be overridden by child classes
   * @param value   - The candidate value
   * @param options - Options which affect validation behavior
   * @returns A boolean to indicate with certainty whether the value is valid.
   *          Otherwise, return void.
   * @throws May throw a specific error if the value is not valid
   */
  protected _validateType(value: any, options?: DataField.ValidationOptions<DataField<any>>): boolean | void;

  /**
   * Initialize the original source data into a mutable copy for the DataModel instance.
   * @param value - The source value of the field
   * @param model - The DataModel instance that this field belongs to
   * @returns An initialized copy of the source data
   */
  initialize(value: PersistedType, model: AnyDataModel): (() => Value | null) | Value;

  /**
   * Export the current value of the field into a serializable object.
   * @param value - The initialized value of the field
   * @returns An exported representation of the field
   */
  toObject(value: Value): PersistedType;
}

declare namespace DataField {
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
 * @typeParam Value         - the type of the value of the field
 * @typeParam PersistedType - the type of the persisted value of the field
 */
declare class SchemaField<
  Value extends Record<string, DataField<any>> | null | undefined,
  PersistedType extends object | null | undefined = object | null | undefined
> extends DataField<Value, PersistedType> {
  /**
   * @param fields  - The contained field definitions
   * @param options - Options which configure the behavior of the field
   */
  constructor(fields: DataSchema, options?: DataFieldOptions<DataSchema>);

  /** @defaultValue `true` */
  override required: boolean;

  /** @defaultValue `false` */
  override nullable: boolean;

  /** @defaultValue `() => this.clean({})` */
  override initial: Value | ((data: any) => Value) | null | undefined;

  protected static override get _defaults(): DataFieldOptions<DataSchema>;

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
  [Symbol.iterator](): Iterable<DataField<unknown>>;

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
  get(fieldName: string): DataField<unknown> | undefined;

  protected override _cast(value: any): Value;

  protected override _cleanType(value: Value, options?: DataField.CleanOptions | undefined): Value;

  override initialize(value: PersistedType, model: AnyDataModel): Value;

  protected override _validateType(
    value: any,
    options?: DataField.ValidationOptions<DataField<any>> | undefined
  ): boolean | void;

  override toObject(value: Value): PersistedType;

  override apply<Value, Options, Return>(
    fn: keyof this | ((this: DataField<any>, value: Value, options: Options) => Return),
    value: Value,
    options?: Options | undefined
  ): Return;
}

/**
 * A subclass of [DataField]{@link DataField} which deals with boolean-typed data.
 * @typeParam Value         - the type of the value of the field
 * @typeParam PersistedType - the type of the persisted value of the field
 */
declare class BooleanField<
  Value extends boolean | null | undefined = boolean,
  PersistedType extends boolean | null | undefined = Value
> extends DataField<Value, PersistedType> {
  /** @defaultValue `true` */
  override required: boolean;

  /** @defaultValue `false` */
  override nullable: boolean;

  /** @defaultValue `false` */
  override initial: Value | ((data: any) => Value) | null | undefined;

  protected static override get _defaults(): DataFieldOptions<boolean | null | undefined>;

  protected override _cast(value: any): Value;

  protected override _validateType(value: any): boolean | void;
}

declare global {
  /**
   * @typeParam Value - the type of the value of the field
   */
  interface NumberFieldOptions<Value extends number | null | undefined = number | null | undefined>
    extends DataFieldOptions<Value> {
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
 * @typeParam Value         - the type of the value of the field
 * @typeParam PersistedType - the type of the persisted value of the field
 */
declare class NumberField<
  Value extends number | null | undefined = number | null | undefined,
  PersistedType extends number | null | undefined = Value
> extends DataField<Value, PersistedType> {
  /**
   * @param options - Options which configure the behavior of the field
   */
  constructor(options?: NumberFieldOptions<Value>);

  /** @defaultValue `null` */
  override initial: Value | ((data: any) => Value) | null | undefined;

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

  protected static override get _defaults(): DataFieldOptions<number | null | undefined>;

  protected override _cast(value: any): Value;

  protected override _cleanType(value: Value, options?: DataField.CleanOptions | undefined): Value;

  protected override _validateType(
    value: any,
    options?: DataField.ValidationOptions<DataField<any>> | undefined
  ): boolean | void;

  /**
   * Test whether a provided value is a valid choice from the allowed choice set
   * @param value - The provided value
   * @returns Is the choice valid?
   */
  #isValidChoice(value: number): boolean;
}

declare global {
  /**
   * @typeParam Value - the type of the value of the field
   */
  interface StringFieldOptions<Value extends object | string | null | undefined = string | undefined>
    extends DataFieldOptions<Value> {
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
 * @typeParam Value         - the type of the value of the field
 * @typeParam PersistedType - the type of the persisted value of the field
 */
declare class StringField<
  Value extends object | string | null | undefined = string | undefined,
  PersistedType extends string | null | undefined = string | undefined
> extends DataField<Value, PersistedType> {
  /**
   * @param options - Options which configure the behavior of the field
   */
  constructor(options?: StringFieldOptions<Value>);

  /** @defaultValue `""` */
  override initial: Value | ((data: any) => Value) | null | undefined;

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

  protected static override get _defaults(): DataFieldOptions<object | string | null | undefined>;

  override clean(value: any, options?: DataField.CleanOptions | undefined): Value;

  protected override _cast(value: any): Value;

  protected override _validateSpecial(value: any): boolean | void;

  protected override _validateType(
    value: any,
    options?: DataField.ValidationOptions<DataField<any>> | undefined
  ): boolean | void;

  /**
   * Test whether a provided value is a valid choice from the allowed choice set
   * @param value - The provided value
   * @returns Is the choice valid?
   */
  #isValidChoice(value: string): boolean;
}

/**
 * A subclass of [DataField]{@link DataField} which deals with object-typed data.
 * @typeParam Value         - the type of the value of the field
 * @typeParam PersistedType - the type of the persisted value of the field
 */
declare class ObjectField<
  Value extends object | null | undefined = object,
  PersistedType extends object | null | undefined = Value
> extends DataField<Value, PersistedType> {
  /** @defaultValue `true` */
  override required: boolean;

  /** @defaultValue `false` */
  override nullable: boolean;

  /** @defaultValue `() => ({})` */
  override initial: Value | ((data: any) => Value) | null | undefined;

  protected static override get _defaults(): DataFieldOptions<object | null | undefined>;

  protected override _cast(value: any): Value;

  override initialize(value: PersistedType, model: AnyDataModel): Value;

  override toObject(value: Value): PersistedType;

  protected override _validateType(
    value: any,
    options?: DataField.ValidationOptions<DataField<any>> | undefined
  ): boolean | void;
}

/**
 * A subclass of [DataField]{@link DataField} which deals with array-typed data.
 * @typeParam ElementType           - the type of the DataField or Document of the field's elements
 * @typeParam ElementValue          - the type of the field's elements' values
 * @typeParam PersistedElementValue - the type of the field's elements' persisted values
 * @typeParam Value                 - the type of the value of the field
 * @typeParam PersistedType         - the type of the persisted value of the field
 */
declare class ArrayField<
  ElementType extends DataField<any> | typeof Document,
  ElementValue,
  PersistedElementValue = ElementValue,
  Value extends Collection<ElementValue> | Set<ElementValue> | ElementValue[] | null | undefined = ElementValue[],
  PersistedType extends PersistedElementValue[] | null | undefined = PersistedElementValue[]
> extends DataField<Value, PersistedType> {
  /**
   * @param element - A DataField instance which defines the type of element contained in the Array.
   * @param options - Options which configure the behavior of the field
   */
  constructor(element: ElementType, options?: DataFieldOptions<ElementValue>);

  /** @defaultValue `true` */
  override required: boolean;

  /** @defaultValue `false` */
  override nullable: boolean;

  /** @defaultValue `() => []` */
  override initial: Value | ((data: any) => Value) | null | undefined;

  /**
   * The data type of each element in this array
   */
  element: ElementType;

  /**
   * Validate the contained element type of the ArrayField
   * @param element - The type of Array element
   * @returns The validated element type
   * @throws An error if the element is not a valid type
   */
  protected static _validateElementType<T extends DataField<any> | typeof Document>(element: T): T;

  protected static override get _defaults(): DataFieldOptions<any[]>;

  protected override _cast(value: any): Value;

  protected override _cleanType(value: Value, options?: DataField.CleanOptions | undefined): Value;

  protected override _validateType(
    value: any,
    options?: DataField.ValidationOptions<DataField<any>> | undefined
  ): boolean | void;

  /**
   * Validate every element of the ArrayField
   * @param value   - The array to validate
   * @param options - Validation options
   * @returns An array of element-specific errors
   */
  protected _validateElements(
    value: any[],
    options?: DataField.ValidationOptions<DataField<any>>
  ): ModelValidationError[];

  override initialize(value: PersistedType, model: AnyDataModel): Value;

  override toObject(value: Value): PersistedType;

  override apply<Value, Options, Return>(
    fn: keyof this | ((this: DataField<any>, value: Value, options: Options) => Return),
    value: Value,
    options?: Options | undefined
  ): Return;
}

/**
 * A subclass of [ArrayField]{@link ArrayField} which supports a set of contained elements.
 * Elements in this set are treated as fungible and may be represented in any order or discarded if invalid.
 * @typeParam ElementType           - the type of the DataField or Document of the field's elements
 * @typeParam ElementValue          - the type of the field's elements' values
 * @typeParam PersistedElementValue - the type of the field's elements' persisted values
 * @typeParam Value                 - the type of the value of the field
 * @typeParam PersistedType         - the type of the persisted value of the field
 */
declare class SetField<
  ElementType extends DataField<any> | typeof Document,
  ElementValue,
  PersistedElementValue = ElementValue,
  Value extends Set<ElementValue> | null | undefined = Set<ElementValue>,
  PersistedType extends PersistedElementValue[] | null | undefined = PersistedElementValue[]
> extends ArrayField<ElementType, ElementValue, PersistedElementValue, Value, PersistedType> {
  protected override _validateElements(
    value: any[],
    options?: DataField.ValidationOptions<DataField<any>> | undefined
  ): ModelValidationError<ModelValidationError.Errors>[];

  override initialize(value: PersistedType, model: AnyDataModel): Value;

  override toObject(value: Value): PersistedType;
}

/**
 * A subclass of [ObjectField]{@link ObjectField} which embeds some other DataModel definition as an inner object.
 * @typeParam Value         - the type of the value of the field
 * @typeParam PersistedType - the type of the persisted value of the field
 */
declare class EmbeddedDataField<
  ModelType extends typeof DataModel,
  Value extends InstanceType<ModelType>["schema"]["fields"] | null | undefined,
  PersistedType extends object | null | undefined = object | null | undefined
> extends SchemaField<Value, PersistedType> {
  /**
   * @param model   - The class of DataModel which should be embedded in this field
   * @param options - Options which configure the behavior of the field
   */
  constructor(model: ModelType, options?: DataFieldOptions<ModelType>);

  /**
   * The embedded DataModel definition which is contained in this field.
   */
  model: ModelType;

  protected override _initialize(fields: DataSchema): DataSchema;

  override initialize(value: PersistedType, model: AnyDataModel): Value;

  override toObject(value: Value): PersistedType;
}

/**
 * A subclass of [ArrayField]{@link ArrayField} which supports an embedded Document collection.
 * Invalid elements will be dropped from the collection during validation rather than failing for the field entirely.
 * @typeParam ElementType           - the type of the DataField or Document of the field's elements
 * @typeParam ElementValue          - the type of the field's elements' values
 * @typeParam PersistedElementValue - the type of the field's elements' persisted values
 * @typeParam Value                 - the type of the value of the field
 * @typeParam PersistedType         - the type of the persisted value of the field
 */
declare class EmbeddedCollectionField<
  ElementType extends typeof Document,
  ElementValue,
  PersistedElementValue = ElementValue,
  Value extends Collection<ElementValue> | null | undefined = Collection<ElementValue>,
  PersistedType extends PersistedElementValue[] | null | undefined = PersistedElementValue[]
> extends ArrayField<ElementType, ElementValue, PersistedElementValue, Value, PersistedType> {
  /**
   * @param element - The type of Document which belongs to this embedded collection
   * @param options - Options which configure the behavior of the field
   */
  constructor(element: ElementType, options?: DataFieldOptions<ElementValue>);

  /** @defaultValue `true` */
  override readonly: true;

  protected static override _validateElementType<T extends DataField<any> | typeof Document>(element: T): T;

  /**
   * A reference to the DataModel subclass of the embedded document element
   */
  get model(): typeof DataModel;

  /**
   * The DataSchema of the contained Document model.
   */
  get schema(): this["element"]["schema"];

  protected override _cleanType(value: Value, options?: DataField.CleanOptions | undefined): Value;

  protected override _validateElements(
    value: any[],
    options?: DataField.ValidationOptions<DataField<any>> | undefined
  ): ModelValidationError<ModelValidationError.Errors>[];

  override initialize(value: PersistedType, model: AnyDataModel): Value;

  override toObject(value: Value): PersistedType;

  override apply<Value, Options, Return>(
    fn: keyof this | ((this: DataField<any>, value: Value, options: Options) => Return),
    value: Value,
    options?: Options | undefined
  ): Return;
}

/**
 * A subclass of [StringField]{@link StringField} which provides the primary _id for a Document.
 * The field may be initially null, but it must be non-null when it is saved to the database.
 * @typeParam Value         - the type of the value of the field
 * @typeParam PersistedType - the type of the persisted value of the field
 */
declare class DocumentIdField<
  Value extends AnyDocument | string | null | undefined = string | null,
  PersistedType extends string | null | undefined = string | null
> extends StringField<Value, PersistedType> {
  /** @defaultValue `true` */
  override required: boolean;

  /** @defaultValue `false` */
  override blank: boolean;

  /** @defaultValue `true` */
  override nullable: boolean;

  /** @defaultValue `null` */
  override initial: Value | ((data: any) => Value) | null | undefined;

  /** @defaultValue `true` */
  override readonly: boolean;

  /** @defaultValue `"is not a valid Document ID string"` */
  override validationError: string;

  protected static override get _defaults(): DataFieldOptions<string | object | null | undefined>;

  protected override _cast(value: any): Value;

  protected override _validateType(
    value: any,
    options?: DataField.ValidationOptions<DataField<any>> | undefined
  ): boolean | void;
}

/**
 * A special class of [StringField]{@link StringField} field which references another DataModel by its id.
 * This field may also be null to indicate that no foreign model is linked.
 * @typeParam DocumentType  - the type of the document of the field
 * @typeParam Value         - the type of the value of the field
 * @typeParam PersistedType - the type of the persisted value of the field
 */
declare class ForeignDocumentField<
  DocumentType extends typeof Document,
  Value extends InstanceType<DocumentType> | string | null | undefined = InstanceType<DocumentType> | null,
  PersistedType extends string | null | undefined = string | null
> extends DocumentIdField<Value, PersistedType> {
  /**
   * @param model   - The foreign DataModel class definition which this field should link to.
   * @param options - Options which configure the behavior of the field
   */
  constructor(model: DocumentType, options?: StringFieldOptions<Value> & { idOnly?: boolean });

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

  protected static override get _defaults(): DataFieldOptions<string | object | null | undefined>;

  protected override _cast(value: any): Value;

  override initialize(value: PersistedType, model: AnyDataModel): Value | (() => Value | null);

  override toObject(value: Value): PersistedType;
}

/**
 * A subclass of [ObjectField]{@link ObjectField} which supports a system-level data object.
 * @typeParam DocumentType  - the type of the document of the field
 * @typeParam Value         - the type of the value of the field
 * @typeParam PersistedType - the type of the persisted value of the field
 */
declare class SystemDataField<
  DocumentType extends typeof Document,
  Value extends AnyDataModel | object | null | undefined = object,
  PersistedType extends object | null | undefined = Value
> extends ObjectField<Value, PersistedType> {
  /**
   * @param document - The base document class which belongs in this field
   * @param options  - Options which configure the behavior of the field
   */
  constructor(document: DocumentType, options?: DataFieldOptions<DocumentType>);

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

  override getInitialValue(data: { type?: string } | undefined): Value;

  protected override _cleanType(value: Value, options?: DataField.CleanOptions | undefined): Value;

  override initialize(value: PersistedType, model: AnyDataModel): Value;

  override toObject(value: Value): PersistedType;
}

/**
 * A special [StringField]{@link StringField} which records a standardized CSS color string.
 * @typeParam Value         - the type of the value of the field
 * @typeParam PersistedType - the type of the persisted value of the field
 */
declare class ColorField<
  Value extends string | null | undefined = string | null | undefined,
  PersistedType extends string | null | undefined = Value
> extends StringField<Value, PersistedType> {
  /** @defaultValue `true` */
  override nullable: boolean;

  /** @defaultValue `null` */
  override initial: Value | ((data: any) => Value) | null | undefined;

  /** @defaultValue `false` */
  override blank: boolean;

  /** @defaultValue `"is not a valid hexadecimal color string"` */
  override validationError: string;

  protected static override get _defaults(): DataFieldOptions<string | object | null | undefined>;

  override clean(value: any, options?: DataField.CleanOptions | undefined): Value;

  protected override _validateType(
    value: any,
    options?: DataField.ValidationOptions<DataField<any>> | undefined
  ): boolean | void;
}

declare global {
  /**
   * @typeParam Value  - the type of the value of the field
   */
  interface FilePathFieldOptions<Value extends string | null | undefined = string | undefined>
    extends StringFieldOptions<Value> {
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
 * @typeParam Value         - the type of the value of the field
 * @typeParam PersistedType - the type of the persisted value of the field
 */
declare class FilePathField<
  Value extends string | null | undefined = string | null | undefined,
  PersistedType extends string | null | undefined = string | null | undefined
> extends StringField<Value, PersistedType> {
  /**
   * @param options - Options which configure the behavior of the field
   */
  constructor(options?: FilePathFieldOptions<Value>);

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
  override initial: Value | ((data: any) => Value) | null | undefined;

  protected static override get _defaults(): DataFieldOptions<string | object | null | undefined>;

  protected override _validateType(
    value: any,
    options?: DataField.ValidationOptions<DataField<any>> | undefined
  ): boolean | void;
}

/**
 * A special [NumberField]{@link NumberField} which represents an angle of rotation in degrees between 0 and 360.
 * @typeParam Value         - the type of the value of the field
 * @typeParam PersistedType - the type of the persisted value of the field
 */
declare class AngleField<
  Value extends number | null | undefined = number,
  PersistedType extends number | null | undefined = Value
> extends NumberField<Value, PersistedType> {
  /** @defaultValue `true` */
  override required: boolean;

  /** @defaultValue `false` */
  override nullable: boolean;

  /** @defaultValue `0` */
  override initial: Value | ((data: any) => Value) | null | undefined;

  /** @defaultValue `0` */
  base: number;

  /** @defaultValue `0` */
  override min: number | undefined;

  /** @defaultValue `360` */
  override max: number | undefined;

  /** @defaultValue `"is not a number between 0 and 360"` */
  override validationError: string;

  protected static override get _defaults(): DataFieldOptions<number | null | undefined>;

  protected override _cast(value: any): Value;
}

/**
 * A special [NumberField]{@link NumberField} represents a number between 0 and 1.
 * @typeParam Value         - the type of the value of the field
 * @typeParam PersistedType - the type of the persisted value of the field
 */
declare class AlphaField<
  Value extends number | null | undefined = number,
  PersistedType extends number | null | undefined = Value
> extends NumberField<Value, PersistedType> {
  /** @defaultValue `true` */
  override required: boolean;

  /** @defaultValue `false` */
  override nullable: boolean;

  /** @defaultValue `1` */
  override initial: Value | ((data: any) => Value) | null | undefined;

  /** @defaultValue `0` */
  override min: number | undefined;

  /** @defaultValue `1` */
  override max: number | undefined;

  /** @defaultValue `"is not a number between 0 and 1"` */
  override validationError: string;

  protected static override get _defaults(): DataFieldOptions<number | null | undefined>;
}

/**
 * A special [ObjectField]{@link ObjectField} which captures a mapping of User IDs to Document permission levels.
 * @typeParam Value         - the type of the value of the field
 * @typeParam PersistedType - the type of the persisted value of the field
 */
declare class DocumentOwnershipField<
  Value extends Record<string, DOCUMENT_OWNERSHIP_LEVELS> | null | undefined = Record<
    string,
    DOCUMENT_OWNERSHIP_LEVELS
  >,
  PersistedType extends Record<string, DOCUMENT_OWNERSHIP_LEVELS> | null | undefined = Value
> extends ObjectField<Value, PersistedType> {
  /** @defaultValue `{"default": DOCUMENT_OWNERSHIP_LEVELS.NONE}` */
  override initial: Value | ((data: any) => Value) | null | undefined;

  /** @defaultValue `"is not a mapping of user IDs and document permission levels"` */
  override validationError: string;

  protected static override get _defaults(): DataFieldOptions<object | null | undefined>;

  protected override _validateType(
    value: any,
    options?: DataField.ValidationOptions<DataField<any>> | undefined
  ): boolean | void;
}

/**
 * A special [StringField]{@link StringField} which contains serialized JSON data.
 * @typeParam Value         - the type of the value of the field
 * @typeParam PersistedType - the type of the persisted value of the field
 */
declare class JSONField<
  Value extends object | null | undefined = object | undefined,
  PersistedType extends string | null | undefined = string | undefined
> extends StringField<Value, PersistedType> {
  /** @defaultValue `false` */
  override blank: boolean;

  /** @defaultValue `undefined` */
  override initial: Value | ((data: any) => Value) | null | undefined;

  /** @defaultValue `"is not a valid JSON string"` */
  override validationError: string;

  protected static override get _defaults(): DataFieldOptions<string | object | null | undefined>;

  override clean(value: any, options?: DataField.CleanOptions | undefined): Value;

  protected override _validateType(
    value: any,
    options?: DataField.ValidationOptions<DataField<any>> | undefined
  ): boolean | void;

  override initialize(value: PersistedType, model: AnyDataModel): Value;

  override toObject(value: Value): PersistedType;
}

/**
 * A subclass of [StringField]{@link StringField} which contains a sanitized HTML string.
 * This class does not override any StringField behaviors, but is used by the server-side to identify fields which
 * require sanitization of user input.
 * @typeParam Value         - the type of the value of the field
 * @typeParam PersistedType - the type of the persisted value of the field
 */
declare class HTMLField<
  Value extends string | null | undefined = string,
  PersistedType extends string | null | undefined = Value
> extends StringField<Value, PersistedType> {
  /** @defaultValue `true` */
  override required: boolean;

  /** @defaultValue `true` */
  override blank: boolean;

  protected static override get _defaults(): DataFieldOptions<string | object | null | undefined>;
}

/**
 * A subclass of {@link NumberField} which is used for storing integer sort keys.
 * @typeParam Value         - the type of the value of the field
 * @typeParam PersistedType - the type of the persisted value of the field
 */
declare class IntegerSortField<
  Value extends number | null | undefined = number,
  PersistedType extends number | null | undefined = Value
> extends NumberField<Value, PersistedType> {
  /** @defaultValue `true` */
  override required: boolean;

  /** @defaultValue `false` */
  override nullable: boolean;

  /** @defaultValue `true` */
  override integer: boolean;

  /** @defaultValue `0` */
  override initial: Value | ((data: any) => Value) | null | undefined;

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
  systemId: StringField<string | null, string | null>;
  systemVersion: StringField<string | null, string | null>;
  coreVersion: StringField<string | null, string | null>;
  createdTime: NumberField;
  modifiedTime: NumberField;
  lastModifiedBy: ForeignDocumentField<typeof foundry.documents.BaseUser>;
}

/**
 * A subclass of {@link SchemaField} which stores document metadata in the _stats field.
 * @typeParam Value         - the type of the value of the field
 * @typeParam PersistedType - the type of the persisted value of the field
 */
declare class DocumentStatsField<
  Value extends DocumentStatsFieldDataSchema | null | undefined,
  PersistedType extends object | null | undefined = object | null | undefined
> extends SchemaField<Value, PersistedType> {
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
