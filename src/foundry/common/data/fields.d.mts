import type { FieldReturnType } from "../../../types/helperTypes.d.mts";
import type { ConstructorOf, SimpleMerge, ValueOf } from "../../../types/utils.d.mts";
import type { DataModel } from "../abstract/data.mts";
import type { Document } from "../abstract/module.d.mts";
import type { DOCUMENT_PERMISSION_LEVELS } from "../constants.d.mts";
import type { isColorString, isJSON } from "./validators.d.mts";
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
   * @param {object} data       Candidate data for joint model validation
   * @param {object} options    Options which modify joint model validation
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
 * A required boolean field which may be used in a Document.
 */
export declare const BOOLEAN_FIELD: BooleanField;
/**
 * Property type: `boolean`
 * Constructor type: `boolean | null | undefined`
 * Default: `false`
 */
export interface BooleanField extends DocumentField<boolean> {
  type: typeof Boolean;
  required: true;
  default: false;
}

/**
 * A standard string color field which may be used in a Document.
 */
export declare const COLOR_FIELD: ColorField;
/**
 * Property type: `string | null | undefined`
 * Constructor type: `string | null | undefined`
 */
export interface ColorField extends DocumentField<string> {
  type: typeof String;
  required: false;
  nullable: true;
  validate: typeof isColorString;
  validationError: '{name} {field} "{value}" is not a valid hexadecimal color string';
}

/**
 * A standard string field for an image file path which may be used in a Document.
 */
export declare const IMAGE_FIELD: ImageField;
/**
 * Property type: `string | null | undefined`
 * Constructor type: `string | null | undefined`
 */
export interface ImageField extends DocumentField<string> {
  type: typeof String;
  required: false;
  nullable: true;
  validate: (path: string) => boolean;
  validationError: '{name} {field} "{value}" does not have a valid image file extension';
}

/**
 * A standard string field for a video or image file path may be used in a Document.
 */
export declare const VIDEO_FIELD: VideoField;
/**
 * Property type: `string | null | undefined`
 * Constructor type: `string | null | undefined`
 */
export interface VideoField extends DocumentField<string> {
  type: typeof String;
  required: false;
  nullable: true;
  validate: (src: string | null) => boolean;
  validationError: '{name} {field} "{value}" does not have a valid image or video file extension';
}

/**
 * A standard string field for an audio file path which may be used in a Document.
 */
export declare const AUDIO_FIELD: AudioField;
/**
 * Property type: `string | null | undefined`
 * Constructor type: `string | null | undefined`
 */
export interface AudioField extends DocumentField<string> {
  type: typeof String;
  required: false;
  nullable: true;
  validate: (src: string | null) => boolean;
  validationError: '{name} {field} "{value}" does not have a valid audio file extension';
}

/**
 * A standard integer field which may be used in a Document.
 */
export declare const INTEGER_FIELD: IntegerField;
/**
 * Property type: `number | undefined`
 * Constructor type: `number | null | undefined`
 */
export interface IntegerField extends DocumentField<number> {
  type: typeof Number;
  required: false;
  validate: typeof Number.isInteger;
  validationError: '{name} {field} "{value}" does not have an integer value';
}

/**
 * A string field which contains serialized JSON data that may be used in a Document.
 */
export declare const JSON_FIELD: JsonField;
/**
 * Property type: `string | undefined`
 * Constructor type: `string | object | null | undefined`
 */
export interface JsonField extends DocumentField<string> {
  type: typeof String;
  required: false;
  clean: (s: unknown) => string;
  validate: typeof isJSON;
  validationError: '{name} {field} "{value}" is not a valid JSON string';
}

/**
 * A non-negative integer field which may be used in a Document.
 */
export declare const NONNEGATIVE_INTEGER_FIELD: NonnegativeIntegerField;
/**
 * Property type: `number | undefined`
 * Constructor type: `number | null | undefined`
 */
export interface NonnegativeIntegerField extends DocumentField<number> {
  type: typeof Number;
  required: false;
  validate: (n: unknown) => boolean;
  validationError: '{name} {field} "{value}" does not have an non-negative integer value';
}

/**
 * A non-negative integer field which may be used in a Document.
 *
 * @remarks The validation actually checks for `> 0`, the JSDoc is incorrect in foundry.
 */
export declare const POSITIVE_INTEGER_FIELD: PositiveIntegerField;
/**
 * Property type: `number | undefined`
 * Constructor type: `number | null | undefined`
 */
export interface PositiveIntegerField extends DocumentField<number> {
  type: typeof Number;
  required: false;
  validate: (n: unknown) => boolean;
  validationError: '{name} {field} "{value}" does not have an non-negative integer value';
}

/**
 * A template for a required inner-object field which may be used in a Document.
 */
export declare const OBJECT_FIELD: ObjectField;
/**
 * Property type: `object`
 * Constructor type: `object | null | undefined`
 * Default `{}`
 */
export interface ObjectField extends DocumentField<object> {
  type: typeof Object;
  default: Record<string, never>;
  required: true;
}

/**
 * An optional string field which may be included by a Document.
 */
export declare const STRING_FIELD: StringField;
/**
 * Property type: `string | undefined`
 * Constructor type: `string | null | undefined`
 */
export interface StringField extends DocumentField<string> {
  type: typeof String;
  required: false;
  nullable: false;
}

/**
 * An optional numeric field which may be included in a Document.
 */
export declare const NUMERIC_FIELD: NumericField;
/**
 * Property type: `number | null | undefined`
 * Constructor type: `number | null | undefined`
 */
export interface NumericField extends DocumentField<number> {
  type: typeof Number;
  required: false;
  nullable: true;
}

/**
 * A required numeric field which may be included in a Document and may not be null.
 */
export declare const REQUIRED_NUMBER: RequiredNumber;
/**
 * Property type: `number`
 * Constructor type: `number | null | undefined`
 * Default: `0`
 */
export interface RequiredNumber extends DocumentField<number> {
  type: typeof Number;
  required: true;
  nullable: false;
  default: 0;
}

/**
 * A field used to designate a non-negative number
 */
export declare const NONNEGATIVE_NUMBER_FIELD: NonnegativeNumberField;
/**
 * Property type: `number`
 * Constructor type: `number | null | undefined`
 * Default: `0`
 */
export interface NonnegativeNumberField extends DocumentField<number> {
  type: typeof Number;
  required: true;
  nullable: false;
  default: 0;
  validate: (n: unknown) => boolean;
  validationError: '{name} {field} "{value}" must be a non-negative number';
}

/**
 * A required numeric field which must be a positive finite value that may be included in a Document.
 */
export declare const REQUIRED_POSITIVE_NUMBER: RequiredPositiveNumber;
/**
 * Property type: `number`
 * Constructor type: `number`
 */
export interface RequiredPositiveNumber extends DocumentField<number> {
  type: typeof Number;
  required: true;
  nullable: false;
  validate: (n: unknown) => boolean;
  validationError: '{name} {field} "{value}" is not a positive number';
}

/**
 * A required numeric field which represents an angle of rotation in degrees between 0 and 360.
 */
export declare const ANGLE_FIELD: AngleField;
/**
 * Property type: `number`
 * Constructor type: `number | null | undefined`
 * Default: `360`
 */
export interface AngleField extends DocumentField<number> {
  type: typeof Number;
  required: true;
  nullable: false;
  default: 360;
  clean: (n: unknown) => number;
  validate: (n: number) => boolean;
  validationError: '{name} {field} "{value}" is not a number between 0 and 360';
}

/**
 * A required numeric field which represents a uniform number between 0 and 1.
 */
export declare const ALPHA_FIELD: AlphaField;
/**
 * Property type: `number`
 * Constructor type: `number | null | undefined`
 * Default: `1`
 */
export interface AlphaField extends DocumentField<number> {
  type: typeof Number;
  required: true;
  nullable: false;
  default: 1;
  validate: (n: number) => boolean;
  validationError: '{name} {field} "{value}" is not a number between 0 and 1';
}

/**
 * A string field which requires a non-blank value and may not be null.
 */
export declare const REQUIRED_STRING: RequiredString;
/**
 * Property type: `string`
 * Constructor type: `string`
 */
export interface RequiredString extends DocumentField<string> {
  type: typeof String;
  required: true;
  nullable: false;
  clean: <T>(v: T) => T extends undefined ? undefined : string;
}

/**
 * A string field which is required, but may be left blank as an empty string.
 */
export declare const BLANK_STRING: BlankString;
/**
 * Property type: `string`
 * Constructor type: `string | null | undefined`
 * Default: `""`
 */
export interface BlankString extends DocumentField<string> {
  type: typeof String;
  required: true;
  nullable: false;
  clean: (v: unknown) => string;
  default: "";
}

/**
 * A field used for integer sorting of a Document relative to its siblings
 */
export declare const INTEGER_SORT_FIELD: IntegerSortField;
/**
 * Property type: `number`
 * Constructor type: `number | null | undefined`
 * Default: `0`
 */
export interface IntegerSortField extends DocumentField<number> {
  type: typeof Number;
  required: true;
  default: 0;
  validate: typeof Number.isInteger;
  validationError: '{name} {field} "{value}" is not an integer';
}

/**
 * A numeric timestamp field which may be used in a Document.
 */
export declare const TIMESTAMP_FIELD: TimestampField;
/**
 * Property type: `number | undefined`
 * Constructor type: `number | null | undefined`
 * Default: `Date.now()`
 */
export interface TimestampField extends DocumentField<number> {
  type: typeof Number;
  required: false;
  default: typeof Date.now;
  nullable: false;
}

/**
 * Validate that the ID of a Document object is either null (not yet saved) or a valid string.
 * @param id - The _id to test
 * @returns Is it valid?
 */
declare function _validateId(id: string | null): boolean;

/**
 * The standard identifier for a Document.
 */
export declare const DOCUMENT_ID: DocumentId;
/**
 * Property type: `string | null`
 * Constructor type: `string | null | undefined`
 * Default: `null`
 */
export interface DocumentId extends DocumentField<string | null> {
  type: typeof String;
  required: true;
  default: null;
  nullable: false;
  validate: typeof _validateId;
  validationError: '{name} {field} "{value}" is not a valid document ID string';
}

/**
 * The standard permissions object which may be included by a Document.
 */
export declare const DOCUMENT_PERMISSIONS: DocumentPermissions;
/**
 * Property type: `Partial<Record<string, DOCUMENT_PERMISSION_LEVELS>>`
 * Constructor type: `Partial<Record<string, DOCUMENT_PERMISSION_LEVELS>> | null | undefined`
 * Default: `{ default: DOCUMENT_PERMISSION_LEVELS.NONE }`
 */
export interface DocumentPermissions extends DocumentField<Partial<Record<string, DOCUMENT_PERMISSION_LEVELS>>> {
  type: typeof Object;
  required: true;
  nullable: false;
  default: { default: typeof DOCUMENT_PERMISSION_LEVELS.NONE };
  validate: typeof _validatePermissions;
  validationError: '{name} {field} "{value}" is not a mapping of user IDs and document permission levels';
}

/**
 * Validate the structure of the permissions object: all keys are valid IDs and all values are permission levels
 * @param perms - The provided permissions object
 * @returns Is the object valid?
 */
declare function _validatePermissions(perms: object): boolean;

interface ForeignDocumentFieldOptions {
  type: {
    readonly documentName: string;
  };
  required?: boolean;
  nullable?: boolean;
  default?: any;
}

/**
 * Create a foreign key field which references a primary Document id
 */
export declare function foreignDocumentField<T extends ForeignDocumentFieldOptions>(
  options: T,
): ForeignDocumentField<T>;
/**
 * Default config:
 * ```
 * {
 *   type: String,
 *   required: false,
 *   nullable: true,
 *   default: null
 * }
 * ```
 * With default config:
 * Property type: `string | null`
 * Constructor type: `ForeignDocument | string | null | undefined`
 * Default: `null`
 */
export interface ForeignDocumentField<T extends ForeignDocumentFieldOptions> extends DocumentField<string | null> {
  type: typeof String;
  required: T extends {
    required: true;
  }
    ? true
    : false;
  nullable: T extends {
    nullable?: true;
  }
    ? true
    : T extends { nullable: false }
      ? false
      : boolean;
  default: T extends {
    default: infer U;
  }
    ? U
    : null;
  clean: (d: unknown) => string | null;
  validate: typeof _validateId;
  validationError: `{name} {field} "{value}" is not a valid ${T["type"]["documentName"]} id`;
}

interface EmbeddedCollectionFieldOptions {
  required?: boolean;
  default?: any[];
}

/**
 * Create a special field which contains a Collection of embedded Documents
 * @param document - The Document class definition
 * @param options  - Additional field options
 *                   (default: `{}`)
 */
export declare function embeddedCollectionField<
  ConcreteDocumentConstructor extends { readonly documentName: string } & ConstructorOf<Document<any, any>>,
  Options extends EmbeddedCollectionFieldOptions,
>(
  document: ConcreteDocumentConstructor,
  options?: Options,
): EmbeddedCollectionField<ConcreteDocumentConstructor, Options>;
/**
 * Default config:
 * ```
 * {
 *   type: {
 *     [documentName]: DocumentConstructor
 *   },
 *   required: true,
 *   default: [],
 *   isCollection: true
 * }
 * ```
 * With default config:
 * Property type: `EmbeddedCollection<DocumentConstructor, ParentDocumentData>`
 * Constructor type: `DocumentConstructorData[] | null | undefined`
 * Default: `new EmbeddedCollection(DocumentData, [], DocumentConstructor)`
 */
// TODO: Improve
export interface EmbeddedCollectionField<
  ConcreteDocumentConstructor extends ConstructorOf<Document<any, any>>,
  Options extends EmbeddedCollectionFieldOptions = {},
> extends DocumentField<any> {
  type: Partial<Record<string, ConcreteDocumentConstructor>>;
  required: Options extends { required?: true } ? true : Options extends { required: false } ? false : boolean;
  default: Options extends { default?: Array<infer U> } ? Array<U> : unknown[];
  isCollection: true;
}

/**
 * A special field which contains a data object defined from the game System model.
 * @param document - The Document class definition
 */
export declare function systemDataField<
  DocumentSpecifier extends { readonly documentName: keyof Game.SystemData<any>["model"] },
>(document: DocumentSpecifier): SystemDataField;
/**
 * Default config:
 * ```
 * {
 *   type: Object,
 *   required: true,
 *   default: object // template object of object type from template.json
 * }
 * ```
 * Property type: `object`
 * Constructor type: `object | null | undefined`
 * Default: `{}`
 */
// TODO: Improve
export interface SystemDataField extends DocumentField<any> {
  type: typeof Object;
  default: (data: { type?: string }) => Record<string, Record<string, unknown>>;
  required: true;
}

/**
 * Return a document field which is a modification of a static field type
 */
export declare function field<T extends DocumentField<any>, U extends Partial<DocumentField<any>>>(
  field: T,
  options?: U,
): FieldReturnType<T, U>;

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

export { DataField };
