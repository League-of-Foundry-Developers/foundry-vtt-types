import type {
  RemoveIndexSignatures,
  SimpleMerge,
  AnyObject,
  EmptyObject,
  NullishProps,
  InexactPartial,
  ToMethod,
  InstanceType,
} from "../../../utils/index.d.mts";
import type { DataModel } from "../abstract/data.mts";
import type Document from "../abstract/document.mts";
import type { EmbeddedCollection, EmbeddedCollectionDelta, TypeDataModel } from "../abstract/module.d.mts";
import type { DOCUMENT_OWNERSHIP_LEVELS } from "../constants.d.mts";
import type { CONST } from "../../client-esm/client.d.mts";
import type { DataModelValidationFailure } from "./validation-failure.mts";
import type { EffectChangeData } from "../documents/_types.d.mts";
import type {
  FormGroupConfig,
  FormInputConfig,
  FormSelectOption,
  MultiSelectInputConfig,
  SelectInputConfig,
  TextAreaInputConfig,
} from "../../client-esm/applications/forms/fields.d.mts";

export type DataSchema = Record<string, DataField.Any>;

/**
 * An abstract class that defines the base pattern for a data field within a data schema.
 * @typeParam Options         - the options of the DataField instance
 * @typeParam AssignmentType  - the type of the allowed assignment values of the DataField
 * @typeParam InitializedType - the type of the initialized values of the DataField
 * @typeParam PersistedType   - the type of the persisted values of the DataField
 * @remarks
 * Defaults:
 * AssignmentType: `unknown | null | undefined`
 * InitializedType: `unknown | undefined`
 * PersistedType: `unknown | undefined`
 * InitialValue: `undefined`
 */
declare abstract class DataField<
  const Options extends DataField.Options.Any = DataField.DefaultOptions,
  const AssignmentType = DataField.AssignmentType<Options>,
  const InitializedType = DataField.InitializedType<Options>,
  const PersistedType extends unknown | null | undefined = InitializedType,
> {
  // Prevent from being bivariant.
  #assignmentType: AssignmentType;

  /**
   * @param options - Options which configure the behavior of the field
   */
  constructor(options?: Options, context?: DataField.Context);

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
   * Can this field only be modified by a gamemaster or assistant gamemaster?
   * @defaultValue `false`
   */
  gmOnly: boolean;

  /**
   * The initial value of a field, or a function which assigns that initial value.
   * @defaultValue `undefined`
   */
  initial: DataField.Options.InitialType<InitializedType>;

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
   * document name, field name, and candidate value. This error string is only
   * used when the return type of the validate function is a boolean. If an Error
   * is thrown in the validate function, the string message of that Error is used.
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
  protected static get _defaults(): DataField.Options.Any;

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
  ): DataModelValidationFailure | void;

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
  protected _validateType(
    value: InitializedType,
    options?: DataField.ValidationOptions<DataField.Any>,
  ): boolean | DataModelValidationFailure | void;

  /**
   * Certain fields may declare joint data validation criteria.
   * This method will only be called if the field is designated as recursive.
   * @param data    - Candidate data for joint model validation
   * @param options - Options which modify joint model validation
   * @throws  An error if joint model validation fails
   * @internal
   */
  protected _validateModel(data: AnyObject, options?: AnyObject): void; // TODO: Type further.

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
    options?: AnyObject, // TODO: Type further.
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

  /**
   * Does this form field class have defined form support?
   */
  static get hasFormSupport(): boolean;

  /**
   * Render this DataField as an HTML element.
   * @param config - Form element configuration parameters
   * @throws An Error if this DataField subclass does not support input rendering
   * @returns A rendered HTMLElement for the field
   */
  toInput(config?: DataField.ToInputConfig<InitializedType>): HTMLElement | HTMLCollection;

  /**
   * Render this DataField as an HTML element.
   * Subclasses should implement this method rather than the public toInput method which wraps it.
   * @param config - Form element configuration parameters
   * @throws An Error if this DataField subclass does not support input rendering
   * @returns A rendered HTMLElement for the field
   */
  protected _toInput(config: DataField.ToInputConfig<InitializedType>): HTMLElement | HTMLCollection;

  /**
   * Render this DataField as a standardized form-group element.
   * @param groupConfig - Configuration options passed to the wrapping form-group
   * @param inputConfig - Input element configuration options passed to DataField#toInput
   * @returns The rendered form group element
   */
  toFormGroup(
    groupConfig?: DataField.GroupConfig,
    inputConfig?: DataField.ToInputConfig<InitializedType>,
  ): HTMLDivElement;

  /**
   * Apply an ActiveEffectChange to this field.
   * @param value  - The field's current value.
   * @param model  - The model instance.
   * @param change - The change to apply.
   * @returns The updated value.
   */
  applyChange(value: InitializedType, model: DataModel.Any, change: EffectChangeData): InitializedType;

  /**
   * Cast a change delta into an appropriate type to be applied to this field.
   * @param delta - The change delta.
   * @internal
   */
  // Note(LukeAbby): Technically since this defers to `_cast` it should take whatever `_cast` can.
  // But it always must be able to take a `string` because that's how `applyChange` calls it.
  protected _castChangeDelta(delta: string): InitializedType;

  /**
   * Apply an ADD change to this field.
   * @param value  - The field's current value.
   * @param delta  - The change delta.
   * @param model  - The model instance.
   * @param change - The original change data.
   * @returns - The updated value.
   */
  protected _applyChangeAdd(
    value: InitializedType,
    delta: InitializedType,
    model: DataModel.Any,
    change: EffectChangeData,
  ): InitializedType | undefined;

  /**
   * Apply a MULTIPLY change to this field.
   * @param value  - The field's current value.
   * @param delta  - The change delta.
   * @param model  - The model instance.
   * @param change - The original change data.
   * @returns The updated value.
   */
  protected _applyChangeMultiply(
    value: InitializedType,
    delta: InitializedType,
    model: DataModel.Any,
    change: EffectChangeData,
  ): InitializedType | undefined;

  /**
   * Apply an OVERRIDE change to this field.
   * @param value  - The field's current value.
   * @param delta  - The change delta.
   * @param model  - The model instance.
   * @param change - The original change data.
   * @returns The updated value.
   */
  protected _applyChangeOverride(
    value: InitializedType,
    delta: InitializedType,
    model: DataModel.Any,
    change: EffectChangeData,
  ): InitializedType | undefined;

  /**
   * Apply an UPGRADE change to this field.
   * @param value - The field's current value.
   * @param delta - The change delta.
   * @param model - The model instance.
   * @param change - The original change data.
   * @returns - The updated value.
   */
  protected _applyChangeUpgrade(
    value: InitializedType,
    delta: InitializedType,
    model: DataModel.Any,
    change: EffectChangeData,
  ): InitializedType | undefined;

  /**
   * Apply a DOWNGRADE change to this field.
   * @param value  - The field's current value.
   * @param delta  - The change delta.
   * @param model  - The model instance.
   * @param change - The original change data.
   * @returns The updated value.
   */
  protected _applyChangeDowngrade(
    value: InitializedType,
    delta: InitializedType,
    model: DataModel.Any,
    change: EffectChangeData,
  ): InitializedType | undefined;

  /**
   * Apply a CUSTOM change to this field.
   * @param value - The field's current value.
   * @param delta - The change delta.
   * @param model - The model instance.
   * @param change - The original change data.
   * @returns - The updated value.
   */
  protected _applyChangeCustom(
    value: InitializedType,
    delta: InitializedType,
    model: DataModel.Any,
    change: EffectChangeData,
  ): InitializedType;
}

declare namespace DataField {
  /** Any DataField. */
  type Any = DataField<DataField.Options.Any, unknown, unknown, unknown>;

  type AnyConstructor = typeof AnyDataField;

  /** A DataField with unknown inner types. */
  type Unknown = DataField<any, unknown, unknown, unknown>;

  type AssignmentTypeFor<ConcreteDataField extends Any> =
    ConcreteDataField extends DataField<any, infer AssignmentType, any, any> ? AssignmentType : never;

  type InitializedTypeFor<ConcreteDataField extends Any> =
    ConcreteDataField extends DataField<any, any, infer InitializedType, any> ? InitializedType : never;

  type PersistedTypeFor<ConcreteDataField extends Any> =
    ConcreteDataField extends DataField<any, any, any, infer PersistedType> ? PersistedType : never;

  /** The type of the default options for the {@link DataField} class. */
  interface DefaultOptions {
    required: false;
    nullable: false;
    initial: undefined;
    readonly: false;
    gmOnly: false;
    label: "";
    hint: "";
    validationError: "is not a valid value";
  }

  interface Options<BaseAssignmentType> {
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

    /**
     * Can this field only be modified by a gamemaster or assistant gamemaster?
     * @defaultValue `false`
     */
    gmOnly?: boolean | undefined;

    /** The initial value of a field, or a function which assigns that initial value. */
    initial?:
      | DataField.Options.InitialType<
          DataField.Options.InitialReturnType<BaseAssignmentType, this["nullable"], this["required"]>
        >
      | undefined;

    /** A data validation function which accepts one argument with the current value. */
    validate?: DataField.Validator<BaseAssignmentType> | undefined;

    /** A localizable label displayed on forms which render this field. */
    label?: string | undefined;

    /** Localizable help text displayed on forms which render this field. */
    hint?: string | undefined;

    /**
     * A custom validation error string. When displayed will be prepended with the
     * document name, field name, and candidate value. This error string is only
     * used when the return type of the validate function is a boolean. If an Error
     * is thrown in the validate function, the string message of that Error is used.
     */
    validationError?: string | undefined;
  }

  namespace Options {
    /** Any DataField.Options. */
    // Note(LukeAbby): This `& object` is intentional. Its purpose is to allow options like `{ integer: true }` to be assigned.
    // This is an issue because `{ integer: true }` does not extend `{ required?: boolean }` because they have properties in common.
    // Even though `{ integer: true, required: undefined }` would extend `{ required?: boolean }` following the regular rules of surplus properties being allowed.
    // `object` was chosen over `AnyObject` so that people may pass in interfa
    type Any = DataField.Options<any> & object;

    /**
     * A helper type for the {@link DataField.Options.initial} option.
     * @typeParam ReturnType - the return type of the option
     */
    type InitialType<ReturnType> = ReturnType | ((initialData: unknown) => ReturnType);

    /**
     * The decorated return type for the {@link DataField.Options.initial} option.
     * @typeParam BaseAssignmentType - the base assignment type for a DataField
     * @typeParam NullableOption     - the value of the nullable option
     * @typeParam RequiredOption     - the value of the required option
     */
    type InitialReturnType<BaseAssignmentType, NullableOption, RequiredOption> =
      | Exclude<BaseAssignmentType, null | undefined>
      | (NullableOption extends true ? null : never)
      | (RequiredOption extends true ? never : undefined);
  }

  interface DataValidationOptions {
    /** Whether this is a partial schema validation, or a complete one. */
    partial?: boolean;

    /** Whether to allow replacing invalid values with valid fallbacks. */
    fallback?: boolean;

    /** The full source object being evaluated. */
    source?: AnyObject;

    /**
     * If true, invalid embedded documents will emit a warning and be placed in
     * the invalidDocuments collection rather than causing the parent to be
     * considered invalid.
     */
    dropInvalidEmbedded?: boolean;
  }

  /**
   * A helper type for the given options type merged into the default options of the DataField class.
   * @typeParam Options - the options that override the default options
   */
  type MergedOptions<Options extends DataField.Options.Any> = SimpleMerge<DefaultOptions, Options>;

  /**
   * A type to decorate the base assignment type to a DataField, based on the options of the field.
   * @typeParam BaseAssignmentType - the base assignment type of the DataField, without null or undefined
   * @typeParam Options            - the options of the DataField
   */
  type DerivedAssignmentType<BaseAssignmentType, Options extends DataField.Options.Any> =
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
  type DerivedInitializedType<BaseInitializedType, Options extends DataField.Options.Any> =
    | Exclude<BaseInitializedType, null | undefined>
    | (Options["nullable"] extends true ? null : never)
    | (Options["required"] extends true ? never : undefined);

  /**
   * A shorthand for the assignment type of a DataField class.
   * @typeParam Options - the options overriding the defaults
   */
  type AssignmentType<Options extends DataField.Options.Any> = DerivedAssignmentType<any, MergedOptions<Options>>;

  /**
   * A shorthand for the initialized type of a DataField class.
   * @typeParam Options - the options overriding the defaults
   */
  type InitializedType<Options extends DataField.Options.Any> = DerivedInitializedType<any, MergedOptions<Options>>;

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
   * A Custom DataField validator function.
   *
   * A boolean return value indicates that the value is valid (true) or invalid (false) with certainty. With an explicit
   * boolean return value no further validation functions will be evaluated.
   *
   * An undefined return indicates that the value may be valid but further validation functions should be performed,
   * if defined.
   *
   * An Error may be thrown which provides a custom error message explaining the reason the value is invalid.
   */
  type Validator<BaseAssignmentType> = ToMethod<
    (
      this: DataField,
      // TODO(LukeAbby): Always allowing `null | undefined` may be too lenient but it's probably the best type for the time being.
      value: BaseAssignmentType | null | undefined,
      options: ValidationOptions<DataField>,
    ) => DataModelValidationFailure | boolean | void
  >;

  /**
   * An interface for the options of the {@link DataField} validation functions.
   * @typeParam DataField - the type of the DataField, which is the receiver of the validate function
   */
  interface ValidationOptions<DataField extends DataField.Any> extends DataValidationOptions {
    source?: AnyObject;
    validate?: Validator<DataField.AssignmentTypeFor<DataField>>;
  }

  interface Context {
    /** A field name to assign to the constructed field */
    name: string;

    /** Another data field which is a hierarchical parent of this one */
    parent: DataField.Any;
  }

  interface ToInputConfig<InitializedType> extends FormInputConfig<InitializedType> {}

  interface ToInputConfigWithOptions<InitializedType> extends FormInputConfig<InitializedType>, SelectInputConfig {}

  type AnyChoices = StringField.Choices | NumberField.Choices;

  type ToInputConfigWithChoices<InitializedType, Choices extends AnyChoices | undefined> = SimpleMerge<
    Omit<ToInputConfigWithOptions<InitializedType>, "options">,
    Choices extends undefined ? StringField.GetChoicesOptions : NullishProps<StringField.GetChoicesOptions, "choices">
  >;

  type SelectableToInputConfig<InitializedType, Choices extends StringField.Choices | undefined> =
    | ToInputConfig<InitializedType>
    | ToInputConfigWithOptions<InitializedType>
    | ToInputConfigWithChoices<InitializedType, Choices>;

  // `DataField#toFormGroup` provides default values for these by way of `??=`.
  interface GroupConfig extends NullishProps<FormGroupConfig, "label" | "hint" | "input"> {}
}

declare abstract class AnyDataField extends DataField<any, any, any, any> {
  constructor(arg0: never, ...args: never[]);
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
 */
declare class SchemaField<
  Fields extends DataSchema,
  Options extends SchemaField.Options<Fields> = SchemaField.DefaultOptions,
  AssignmentType = SchemaField.AssignmentType<Fields, SimpleMerge<Options, SchemaField.DefaultOptions>>,
  InitializedType = SchemaField.InitializedType<Fields, SimpleMerge<Options, SchemaField.DefaultOptions>>,
  PersistedType extends AnyObject | null | undefined = SchemaField.PersistedType<
    Fields,
    SimpleMerge<Options, SchemaField.DefaultOptions>
  >,
> extends DataField<Options, AssignmentType, InitializedType, PersistedType> {
  /**
   * @param fields  - The contained field definitions
   * @param options - Options which configure the behavior of the field
   */
  // Saying `fields: Fields` here causes the inference for the fields to be unnecessarily widened. This might effectively be a no-op but it fixes the inference.
  constructor(fields: { [K in keyof Fields]: Fields[K] }, options?: Options, context?: DataField.Context);

  /** @defaultValue `true` */
  override required: boolean;

  /** @defaultValue `false` */
  override nullable: boolean;

  /** @defaultValue `() => this.clean({})` */
  override initial: DataField.Options.InitialType<InitializedType>;

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

  override initialize(
    value: PersistedType,
    model: DataModel.Any,
    options?: AnyObject,
  ): InitializedType | (() => InitializedType | null);

  protected override _validateType(
    value: InitializedType,
    options?: DataField.ValidationOptions<DataField.Any>,
  ): boolean | DataModelValidationFailure | void;

  protected override _validateModel(data: AnyObject, options?: AnyObject): void;

  override toObject(value: InitializedType): PersistedType;

  override apply<Options, Return>(
    fn: keyof this | ((this: this, value: undefined | null, options: Options) => Return),
    value?: undefined | null,
    options?: Options,
  ): Return;
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
  migrateSource(sourceData: AnyObject, fieldData: unknown): unknown;
}

// FIXME(LukeAbby): This is a quick patch that avoids issues with the fact that the `initial` in `SchemaField` is not actually assignable to its assignment type etc.
// This will be superceded once proper field treatment is applied.
declare const __SchemaFieldInitialSymbol: unique symbol;

type __SchemaFieldInitial = typeof __SchemaFieldInitialSymbol;

declare namespace SchemaField {
  /**
   * A shorthand for the options of a SchemaField class.
   * @typeParam Fields - the DataSchema fields of the SchemaField
   */
  type Options<Fields extends DataSchema> = DataField.Options<InnerAssignmentType<Fields> | __SchemaFieldInitial>;

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
    [Key in keyof Fields]?: Fields[Key] extends EmbeddedDataField<any, any, infer AssignmentType, any, any>
      ? AssignmentType
      : Fields[Key] extends SchemaField<infer SubSchema, any, any, any, any>
        ? // FIXME(LukeAbby): This is a quick hack into InnerAssignmentType that assumes that the `initial` of `SchemaField` is not changed from the default of `{}`
          // This will be fixed with the refactoring of the types
          EmptyObject extends InnerAssignmentType<SubSchema>
          ? InnerAssignmentType<SubSchema> | undefined | null
          : InnerAssignmentType<SubSchema>
        : Fields[Key] extends DataField<any, infer AssignType, any, any>
          ? AssignType
          : never;
  }>;

  type InnerUpdateData<Fields extends DataSchema> = InnerAssignmentType<Fields>;

  /**
   * Get the inner initialized type for the given DataSchema.
   * @typeParam Fields - the DataSchema fields of the SchemaField
   */
  type InnerInitializedType<Fields extends DataSchema> = RemoveIndexSignatures<{
    [Key in keyof Fields]: Fields[Key] extends EmbeddedDataField<infer Model, any, any, any, any>
      ? InstanceType<Model>
      : Fields[Key] extends SchemaField<infer SubSchema, any, any, any, any>
        ? InnerInitializedType<SubSchema>
        : Fields[Key] extends DataField<any, any, infer InitType, any>
          ? InitType
          : never;
  }>;

  /**
   * Get the inner persisted type for the given DataSchema.
   * @typeParam Fields - the DataSchema fields of the SchemaField
   */
  type InnerPersistedType<Fields extends DataSchema> = RemoveIndexSignatures<{
    [Key in keyof Fields]: Fields[Key] extends EmbeddedDataField<any, any, any, any, infer PersistType>
      ? PersistType
      : Fields[Key] extends SchemaField<infer SubSchema, any, any, any, any>
        ? InnerPersistedType<SubSchema>
        : Fields[Key] extends DataField<any, any, any, infer PersistType>
          ? PersistType
          : never;
  }>;

  /** The type of the default options for the {@link SchemaField} class. */
  type DefaultOptions = SimpleMerge<
    DataField.DefaultOptions,
    {
      required: true;
      nullable: false;
      initial: __SchemaFieldInitial;
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
> extends DataField<Options, AssignmentType, InitializedType, PersistedType> {
  /** @defaultValue `true` */
  override required: boolean;

  /** @defaultValue `false` */
  override nullable: boolean;

  /** @defaultValue `false` */
  override initial: DataField.Options.InitialType<InitializedType>;

  protected static override get _defaults(): BooleanField.Options;

  protected override _cast(value: AssignmentType): InitializedType;

  protected override _validateType(
    value: InitializedType,
    options?: DataField.ValidationOptions<DataField.Any>,
  ): boolean | DataModelValidationFailure | void;

  protected override _toInput(config: DataField.ToInputConfig<InitializedType>): HTMLElement | HTMLCollection;
}

declare namespace BooleanField {
  /** A shorthand for the options of a BooleanField class. */
  type Options = DataField.Options<boolean>;

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
  const Options extends NumberField.Options = NumberField.DefaultOptions,
  const AssignmentType = NumberField.AssignmentType<Options>,
  const InitializedType = NumberField.InitializedType<Options>,
  const PersistedType extends number | null | undefined = NumberField.InitializedType<Options>,
> extends DataField<Options, AssignmentType, InitializedType, PersistedType> {
  /**
   * @param options - Options which configure the behavior of the field
   */
  constructor(options?: Options, context?: DataField.Context);

  /** @defaultValue `null` */
  override initial: DataField.Options.InitialType<InitializedType>;

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

  protected static override get _defaults(): NumberField.Options;

  protected override _cast(value: AssignmentType): InitializedType;

  protected override _cleanType(value: InitializedType, options?: DataField.CleanOptions): InitializedType;

  protected override _validateType(
    value: InitializedType,
    options?: DataField.ValidationOptions<DataField.Any>,
  ): boolean | DataModelValidationFailure | void;

  /**
   * Test whether a provided value is a valid choice from the allowed choice set
   * @param value - The provided value
   * @returns Is the choice valid?
   */
  #isValidChoice(value: AssignmentType): boolean;

  // These verbose overloads are because otherwise there would be a misleading errors about `choices` being required without mentioning `options` or vice versa.
  toFormGroup(
    groupConfig?: DataField.GroupConfig,
    // TODO(LukeAbby): `Options["Choices"]` is inappropriate as it does not account for `DefaultOptions`.
    inputConfig?:
      | NumberField.ToInputConfig<InitializedType, Options["choices"]>
      | NumberField.ToInputConfigWithOptions<InitializedType>,
  ): HTMLDivElement;
  toFormGroup(
    groupConfig?: DataField.GroupConfig,
    inputConfig?: NumberField.ToInputConfigWithChoices<InitializedType, Options["choices"]>,
  ): HTMLDivElement;

  toInput(
    config?:
      | NumberField.ToInputConfig<InitializedType, Options["choices"]>
      | NumberField.ToInputConfigWithOptions<InitializedType>,
  ): HTMLElement | HTMLCollection;
  toInput(
    config?: NumberField.ToInputConfigWithChoices<InitializedType, Options["choices"]>,
  ): HTMLElement | HTMLCollection;

  protected override _toInput(
    config:
      | NumberField.ToInputConfig<InitializedType, Options["choices"]>
      | NumberField.ToInputConfigWithOptions<InitializedType>,
  ): HTMLElement | HTMLCollection;
  protected override _toInput(
    config: NumberField.ToInputConfigWithChoices<InitializedType, Options["choices"]>,
  ): HTMLElement | HTMLCollection;
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

  interface Options extends DataField.Options<number> {
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
    choices?: NumberField.Choices | undefined;
  }

  /** The type of the default options for the {@link NumberField} class when choices are provided. */
  type DefaultOptionsWhenChoicesProvided = SimpleMerge<DefaultOptions, { nullable: false }>;

  /**
   * A helper type for the given options type merged into the default options of the NumberField class.
   * @typeParam Options - the options that override the default options
   */
  type MergedOptions<Options extends NumberField.Options> = SimpleMerge<
    undefined extends Options["choices"] ? DefaultOptions : DefaultOptionsWhenChoicesProvided,
    Options
  >;

  /**
   * A shorthand for the assignment type of a NumberField class.
   * @typeParam Options - the options that override the default options
   */
  type AssignmentType<Options extends NumberField.Options> = DataField.DerivedAssignmentType<
    number,
    MergedOptions<Options>
  >;

  /**
   * A shorthand for the initialized type of a NumberField class.
   * @typeParam Options - the options that override the default options
   */
  type InitializedType<Options extends NumberField.Options> = DataField.DerivedInitializedType<
    number,
    MergedOptions<Options>
  >;

  type BaseChoices =
    | {
        readonly [K: number | `${number}`]: string;
      }
    | readonly number[];

  type Choices = BaseChoices | (() => BaseChoices);

  /** @internal */
  type _ToInputConfig<InitializedType> = DataField.ToInputConfig<InitializedType> &
    NullishProps<{
      min: number;
      max: number;
      step: number;
    }>;

  type ToInputConfigWithChoices<InitializedType, Choices extends NumberField.Choices | undefined> = SimpleMerge<
    DataField.ToInputConfigWithChoices<InitializedType, Choices>,
    _ToInputConfig<InitializedType>
  >;

  interface ToInputConfigWithOptions<InitializedType>
    extends DataField.ToInputConfigWithOptions<InitializedType>,
      _ToInputConfig<InitializedType> {}

  type ToInputConfig<InitializedType, Choices extends NumberField.Choices | undefined> =
    | _ToInputConfig<InitializedType>
    | ToInputConfigWithChoices<InitializedType, Choices>
    | ToInputConfigWithOptions<InitializedType>;
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
  const Options extends StringField.Options = StringField.DefaultOptions,
  const AssignmentType = StringField.AssignmentType<Options>,
  const InitializedType = StringField.InitializedType<Options>,
  const PersistedType extends string | null | undefined = StringField.InitializedType<Options>,
> extends DataField<Options, AssignmentType, InitializedType, PersistedType> {
  /**
   * @param options - Options which configure the behavior of the field
   */
  constructor(options?: Options, context?: DataField.Context);

  /** @defaultValue `undefined` */
  override initial: DataField.Options.InitialType<InitializedType>;

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

  protected static override get _defaults(): StringField.Options;

  override clean(value: AssignmentType, options?: DataField.CleanOptions): InitializedType;

  protected override _cast(value: AssignmentType): InitializedType;

  protected override _validateSpecial(value: AssignmentType): boolean | void;

  protected override _validateType(
    value: InitializedType,
    options?: DataField.ValidationOptions<DataField.Any>,
  ): boolean | DataModelValidationFailure | void;

  /**
   * Test whether a provided value is a valid choice from the allowed choice set
   * @param value - The provided value
   * @returns Is the choice valid?
   */
  protected _isValidChoice(value: AssignmentType): boolean;

  /**
   * Get a record of eligible choices for the field.
   */
  static _getChoices(options?: StringField.GetChoicesOptions): FormSelectOption[];

  // These verbose overloads are because otherwise there would be a misleading errors about `choices` being required without mentioning `options` or vice versa.
  toFormGroup(
    groupConfig?: DataField.GroupConfig,
    inputConfig?: DataField.ToInputConfig<InitializedType> | DataField.ToInputConfigWithOptions<InitializedType>,
  ): HTMLDivElement;
  toFormGroup(
    groupConfig?: DataField.GroupConfig,
    inputConfig?: DataField.ToInputConfigWithChoices<InitializedType, Options["choices"]>,
  ): HTMLDivElement;

  toInput(
    config?: DataField.ToInputConfig<InitializedType> | DataField.ToInputConfigWithOptions<InitializedType>,
  ): HTMLElement | HTMLCollection;
  toInput(
    config?: DataField.ToInputConfigWithChoices<InitializedType, Options["choices"]>,
  ): HTMLElement | HTMLCollection;

  protected override _toInput(
    config: DataField.ToInputConfig<InitializedType> | DataField.ToInputConfigWithOptions<InitializedType>,
  ): HTMLElement | HTMLCollection;
  protected override _toInput(
    config: DataField.ToInputConfigWithChoices<InitializedType, Options["choices"]>,
  ): HTMLElement | HTMLCollection;
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

  interface Options extends DataField.Options<string> {
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
    choices?: StringField.Choices | undefined;

    /**
     * @defaultValue `false`
     */
    textSearch?: boolean | undefined;
  }

  /** The type of the default options for the {@link StringField} class when choices are provided. */
  type DefaultOptionsWhenChoicesProvided = SimpleMerge<DefaultOptions, { nullable: false; blank: false }>;

  /**
   * A helper type for the given options type merged into the default options of the StringField class.
   * @typeParam Options - the options that override the default options
   */
  type MergedOptions<Options extends StringField.Options> = SimpleMerge<
    _OptionsForInitial<_OptionsForChoices<Options["choices"]>>,
    Options
  >;

  type _OptionsForChoices<Choices extends StringField.Options["choices"]> = undefined extends Choices
    ? DefaultOptions
    : DefaultOptionsWhenChoicesProvided;

  // FIXME: `"initial" extends keyof Options` does not work for modeling `"initial" in options`.
  type _OptionsForInitial<Options extends StringField.Options> = "initial" extends keyof Options
    ? Options
    : SimpleMerge<Options, { initial: _InitialForOptions<Options> }>;

  type _InitialForOptions<Options extends StringField.Options> = Options["required"] extends false | undefined
    ? undefined
    : Options["blank"] extends true
      ? string
      : Options["nullable"] extends true
        ? null
        : undefined;

  // choices?: string[] | Record<string, string> | (() => string[] | Record<string, string>) | undefined;

  type ValidChoice<Options extends StringField.Options> = Options["choices"] extends undefined
    ? string
    : Options["choices"] extends (...args: infer _1) => infer Choices
      ? FixedChoice<Choices>
      : FixedChoice<Options["choices"]>;

  type FixedChoice<Choices> =
    Choices extends ReadonlyArray<infer U>
      ? U
      : Choices extends { readonly [_ in infer K]: infer _1 }
        ? K & string
        : string;

  /**
   * A shorthand for the assignment type of a StringField class.
   * @typeParam Options - the options that override the default options
   */
  type AssignmentType<Options extends StringField.Options> = DataField.DerivedAssignmentType<
    ValidChoice<Options>,
    MergedOptions<Options>
  >;

  /**
   * A shorthand for the initialized type of a StringField class.
   * @typeParam Options - the options that override the default options
   */
  type InitializedType<Options extends StringField.Options> = DataField.DerivedInitializedType<
    // TODO(LukeAbby): This is a workaround for how `ValidChoice` is defined ignorant of the `StringField`/`NumberField` divide.
    ValidChoice<Options> & (string | null | undefined),
    MergedOptions<Options>
  >;

  type BaseChoices =
    | {
        readonly [K: string]: string;
      }
    | readonly string[];

  type Choices = BaseChoices | (() => BaseChoices);

  /**
   * @internal
   */
  interface _GetChoicesOptions {
    /**
     * The property in the choice object values to use as the option label.
     * @defaultValue `"label"`
     */
    labelAttr: string;

    valueAttr: string;

    /**
     * Pass each label through string localization?
     *
     * @defaultValue `false`
     */
    localize: boolean;
  }

  // Note: This usage of `InexactPartial` is correct over `NonNullish` because
  // Foundry writes `static _getChoices({choices, labelAttr="label", valueAttr, localize=false}={})`.
  interface GetChoicesOptions extends InexactPartial<_GetChoicesOptions> {
    choices: { readonly [K: string]: string } | { readonly [K: number]: string } | ReadonlyArray<number | string>;
  }
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
  const Options extends DataField.Options<AnyObject> = ObjectField.DefaultOptions,
  const AssignmentType = ObjectField.AssignmentType<Options>,
  const InitializedType = ObjectField.InitializedType<Options>,
  const PersistedType extends AnyObject | null | undefined = ObjectField.InitializedType<Options>,
> extends DataField<Options, AssignmentType, InitializedType, PersistedType> {
  /** @defaultValue `true` */
  override required: boolean;

  /** @defaultValue `false` */
  override nullable: boolean;

  /** @defaultValue `() => ({})` */
  override initial: DataField.Options.InitialType<InitializedType>;

  protected static override get _defaults(): DataField.Options<AnyObject>;

  protected override _cast(value: AssignmentType): InitializedType;

  override initialize(
    value: PersistedType,
    model: DataModel.Any,
    options?: AnyObject,
  ): InitializedType | (() => InitializedType | null);

  override toObject(value: InitializedType): PersistedType;

  protected override _validateType(
    value: InitializedType,
    options?: DataField.ValidationOptions<DataField.Any>,
  ): boolean | DataModelValidationFailure | void;
}

declare namespace ObjectField {
  /** The type of the default options for the {@link ObjectField} class. */
  type DefaultOptions = SimpleMerge<
    DataField.DefaultOptions,
    {
      required: true;
      nullable: false;
    }
  >;

  /**
   * A helper type for the given options type merged into the default options of the ObjectField class.
   * @typeParam Options - the options that override the default options
   */
  type MergedOptions<Options extends DataField.Options<AnyObject>> = SimpleMerge<DefaultOptions, Options>;

  /**
   * A shorthand for the assignment type of a ObjectField class.
   * @typeParam Options - the options that override the default options
   */
  type AssignmentType<Options extends DataField.Options<AnyObject>> = DataField.DerivedAssignmentType<
    AnyObject,
    MergedOptions<Options>
  >;

  /**
   * A shorthand for the initialized type of a ObjectField class.
   * @typeParam Options - the options that override the default options
   */
  type InitializedType<Options extends DataField.Options<AnyObject>> = DataField.DerivedInitializedType<
    AnyObject,
    MergedOptions<Options>
  >;

  /**
   * A helper to create a flags object field for the given key in the {@link FlagConfig}.
   * @typeParam Key            - the key to look for in the FlagConfig
   * @typeParam ExtensionFlags - additional flags besides the ones configured for the class
   * @typeParam Options        - the options of the field
   */
  type FlagsField<
    Name extends Document.Type,
    // The type `{}` is useful here because in an intersection it reduces down to nothing unlike `EmptyObject`.
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    ExtensionFlags extends AnyObject = {},
    Options extends DataField.Options.Any = ObjectField.DefaultOptions,
  > = ObjectField<
    Options,
    DataField.DerivedAssignmentType<Document.ConfiguredFlagsForName<Name> & ExtensionFlags, MergedOptions<Options>>,
    DataField.DerivedInitializedType<Document.ConfiguredFlagsForName<Name> & ExtensionFlags, MergedOptions<Options>>,
    DataField.DerivedInitializedType<Document.ConfiguredFlagsForName<Name> & ExtensionFlags, MergedOptions<Options>>
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
  const Options extends ArrayField.AnyOptions = ArrayField.DefaultOptions<
    ArrayField.AssignmentElementType<ElementFieldType>
  >,
  const AssignmentElementType = ArrayField.AssignmentElementType<ElementFieldType>,
  const InitializedElementType = ArrayField.InitializedElementType<ElementFieldType>,
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
  constructor(element: ElementFieldType, options?: Options, context?: DataField.Context);

  /** @defaultValue `true` */
  override required: boolean;

  /** @defaultValue `false` */
  override nullable: boolean;

  /** @defaultValue `() => []` */
  override initial: DataField.Options.InitialType<InitializedType>;

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

  protected override _validateModel(data: AnyObject, options?: AnyObject): void;

  protected override _cast(value: AssignmentType): InitializedType;

  protected override _cleanType(value: InitializedType, options?: DataField.CleanOptions): InitializedType;

  protected override _validateType(
    value: InitializedType,
    options?: DataField.ValidationOptions<DataField.Any>,
  ): boolean | DataModelValidationFailure | void;

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

  override initialize(
    value: PersistedType,
    model: DataModel.Any,
    options?: AnyObject,
  ): InitializedType | (() => InitializedType | null);

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
  migrateSource(sourceData: AnyObject, fieldData: unknown): unknown;
}

declare namespace ArrayField {
  /**
   * A shorthand for the options of an ArrayField class.
   * @typeParam AssignmentElementType - the assignment type of the elements in the array
   */
  type Options<AssignmentElementType> = DataField.Options<BaseAssignmentType<AssignmentElementType>>;

  type AnyOptions = Options<unknown>;

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
  type MergedOptions<AssignmentElementType, Opts extends AnyOptions> = SimpleMerge<
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
      : ElementFieldType extends new (...args: any[]) => Document<any, infer Schema extends DataSchema, any>
        ? SchemaField.InnerAssignmentType<Schema>
        : never;

  /**
   * A type to infer the initialized element type of an ArrayField from its ElementFieldType.
   * @typeParam ElementFieldType - the DataField type of the elements in the ArrayField
   */
  type InitializedElementType<ElementFieldType extends DataField.Any | Document.AnyConstructor> =
    ElementFieldType extends DataField<any, any, infer Init, any>
      ? Init
      : ElementFieldType extends new (...args: any[]) => Document<any, infer Schema extends DataSchema, any>
        ? SchemaField.InnerInitializedType<Schema>
        : never;

  /**
   * A type to infer the initialized element type of an ArrayField from its ElementFieldType.
   * @typeParam ElementFieldType - the DataField type of the elements in the ArrayField
   */
  type PersistedElementType<ElementFieldType extends DataField.Any | Document.AnyConstructor> =
    ElementFieldType extends DataField<any, any, any, infer Persist>
      ? Persist
      : ElementFieldType extends new (...args: any[]) => Document<any, infer Schema extends DataSchema, any>
        ? SchemaField.InnerPersistedType<Schema>
        : never;

  /**
   * A shorthand for the assignment type of an ArrayField class.
   * @typeParam AssignmentElementType - the assignment type of the elements of the ArrayField
   * @typeParam Opts                  - the options that override the default options
   */
  type AssignmentType<AssignmentElementType, Opts extends AnyOptions> = DataField.DerivedAssignmentType<
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
    Opts extends AnyOptions,
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
    Opts extends AnyOptions,
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
  Options extends SetField.AnyOptions = SetField.DefaultOptions<ArrayField.AssignmentElementType<ElementFieldType>>,
  AssignmentElementType = ArrayField.AssignmentElementType<ElementFieldType>,
  InitializedElementType = ArrayField.InitializedElementType<ElementFieldType>,
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
  Options,
  AssignmentElementType,
  InitializedElementType,
  AssignmentType,
  InitializedType,
  PersistedElementType,
  PersistedType
> {
  protected override _validateElements(
    value: any[],
    options?: DataField.ValidationOptions<DataField.Any>,
  ): void | DataModelValidationFailure;

  override initialize(
    value: PersistedType,
    model: DataModel.Any,
    options?: AnyObject,
  ): InitializedType | (() => InitializedType | null);

  override toObject(value: InitializedType): PersistedType;

  toFormGroup(
    groupConfig?: DataField.GroupConfig,
    inputConfig?: SetField.ToInputConfig<ElementFieldType, InitializedType>,
  ): HTMLDivElement;

  toInput(config?: SetField.ToInputConfig<ElementFieldType, InitializedType>): HTMLElement | HTMLCollection;

  protected override _toInput(
    config: SetField.ToInputConfig<ElementFieldType, InitializedType>,
  ): HTMLElement | HTMLCollection;
}

declare namespace SetField {
  /** Any SetField */
  type Any = SetField<DataField.Any, any, any, any, any, any, any, any>;

  /**
   * A shorthand for the options of a SetField class.
   * @typeParam AssignmentElementType - the assignment type of the elements in the array
   */
  type Options<AssignmentElementType> = DataField.Options<SetField.BaseAssignmentType<AssignmentElementType>>;

  type AnyOptions = Options<unknown>;

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
  type MergedOptions<AssignmentElementType, Opts extends AnyOptions> = SimpleMerge<
    DefaultOptions<AssignmentElementType>,
    Opts
  >;

  /**
   * A shorthand for the assignment type of a SetField class.
   * @typeParam AssignmentElementType - the assignment type of the elements of the SetField
   * @typeParam Opts                  - the options that override the default options
   */
  type AssignmentType<AssignmentElementType, Opts extends AnyOptions> = DataField.DerivedAssignmentType<
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
    Opts extends AnyOptions,
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
    Opts extends AnyOptions,
  > = DataField.DerivedInitializedType<PersistedElementType[], MergedOptions<AssignmentElementType, Opts>>;

  type ToInputConfig<ElementFieldType extends DataField.Any, InitializedType> = ElementFieldType extends {
    readonly choices: readonly string[];
  }
    ? // If the field has `choices` then you _must_ provide options for `createMultiSelectInput`.
      DataField.ToInputConfig<InitializedType> & MultiSelectInputConfig
    : // Otherwise it's optional to provide.
      DataField.ToInputConfig<InitializedType> | (DataField.ToInputConfig<InitializedType> & MultiSelectInputConfig);
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
  const ModelType extends DataModel.AnyConstructor,
  const Options extends EmbeddedDataField.Options<ModelType> = EmbeddedDataField.DefaultOptions,
  const AssignmentType = EmbeddedDataField.AssignmentType<ModelType, Options>,
  const InitializedType = EmbeddedDataField.InitializedType<ModelType, Options>,
  const PersistedType extends AnyObject | null | undefined = EmbeddedDataField.PersistedType<ModelType, Options>,
> extends SchemaField<DataModel.SchemaOfClass<ModelType>, Options, AssignmentType, InitializedType, PersistedType> {
  /**
   * @param model   - The class of DataModel which should be embedded in this field
   * @param options - Options which configure the behavior of the field
   */
  constructor(model: ModelType, options?: Options, context?: DataField.Context);

  /**
   * The embedded DataModel definition which is contained in this field.
   */
  model: ModelType;

  protected override _initialize(fields: DataModel.SchemaOfClass<ModelType>): DataModel.SchemaOfClass<ModelType>;

  override initialize(
    value: PersistedType,
    model: DataModel.Any,
    options?: AnyObject,
  ): InitializedType | (() => InitializedType | null);

  override toObject(value: InitializedType): PersistedType;

  /**
   * Migrate this field's candidate source data.
   * @param sourceData - Candidate source data of the root model
   * @param fieldData  - The value of this field within the source data
   */
  migrateSource(sourceData: AnyObject, fieldData: unknown): unknown;

  protected override _validateModel(data: AnyObject, options?: AnyObject): void;
}

declare namespace EmbeddedDataField {
  /**
   * A shorthand for the options of an EmbeddedDataField class.
   * @typeParam ModelType - the DataModel for the embedded data
   */
  type Options<ModelType extends DataModel.AnyConstructor> = DataField.Options<
    SchemaField.InnerAssignmentType<DataModel.SchemaOfClass<ModelType>> | __SchemaFieldInitial
  >;

  /** The type of the default options for the {@link EmbeddedDataField} class. */
  type DefaultOptions = SchemaField.DefaultOptions;

  /**
   * A helper type for the given options type merged into the default options of the EmbeddedDataField class.
   * @typeParam ModelType - the DataModel for the embedded data
   * @typeParam Opts      - the options that override the default options
   */
  type MergedOptions<ModelType extends DataModel.AnyConstructor, Opts extends Options<ModelType>> = SimpleMerge<
    DefaultOptions,
    Opts
  >;

  /**
   * A shorthand for the assignment type of an EmbeddedDataField class.
   * @typeParam ModelType - the DataModel for the embedded data
   * @typeParam Opts      - the options that override the default options
   */
  type AssignmentType<
    ModelType extends DataModel.AnyConstructor,
    Opts extends Options<ModelType>,
  > = DataField.DerivedAssignmentType<
    SchemaField.InnerAssignmentType<DataModel.SchemaOfClass<ModelType>>,
    MergedOptions<ModelType, Opts>
  >;

  /**
   * A shorthand for the initialized type of an EmbeddedDataField class.
   * @typeParam ModelType - the DataModel for the embedded data
   * @typeParam Opts      - the options that override the default options
   */
  // FIXME: Schema is unsure in src\foundry\common\data\data.d.mts
  type InitializedType<
    ModelType extends DataModel.AnyConstructor,
    Opts extends Options<ModelType>,
  > = DataField.DerivedInitializedType<InstanceType<ModelType>, MergedOptions<ModelType, Opts>>;

  /**
   * A shorthand for the persisted type of an EmbeddedDataField class.
   * @typeParam ModelType - the DataModel for the embedded data
   * @typeParam Opts      - the options that override the default options
   */
  type PersistedType<
    ModelType extends DataModel.AnyConstructor,
    Opts extends Options<ModelType>,
  > = DataField.DerivedInitializedType<
    SchemaField.InnerPersistedType<DataModel.SchemaOfClass<ModelType>>,
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
  // TODO(LukeAbby): See if `ParentDataModel` can be made redundant by automatically inferring.
  ParentDataModel extends Document.Any,
  Options extends EmbeddedCollectionField.Options<any> = EmbeddedCollectionField.DefaultOptions<
    EmbeddedCollectionField.AssignmentElementType<ElementFieldType>
  >,
  AssignmentElementType = EmbeddedCollectionField.AssignmentElementType<ElementFieldType>,
  InitializedElementType extends Document.Any = EmbeddedCollectionField.InitializedElementType<ElementFieldType>,
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
  Options,
  AssignmentElementType,
  InitializedElementType,
  AssignmentType,
  InitializedType,
  PersistedElementType,
  PersistedType
> {
  /**
   * @param element - The type of Document which belongs to this embedded collection
   * @param options - Options which configure the behavior of the field
   */
  constructor(element: ElementFieldType, options?: Options, context?: DataField.Context);

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
  get model(): Document.AnyConstructor;

  /**
   * The DataSchema of the contained Document model.
   */
  get schema(): this["model"]["schema"];

  protected override _cleanType(value: InitializedType, options?: DataField.CleanOptions): InitializedType;

  protected override _validateElements(
    value: any[],
    options?: DataField.ValidationOptions<DataField.Any>,
  ): DataModelValidationFailure | void;

  override initialize(
    value: PersistedType,
    model: DataModel.Any,
    options?: AnyObject,
  ): InitializedType | (() => InitializedType | null);

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
  migrateSource(sourceData: AnyObject, fieldData: unknown): unknown;

  /**
   * Return the embedded document(s) as a Collection.
   * @param parent - The parent document.
   */
  getCollection<P extends Document.Any>(parent: P): Collection<P>;
}

declare namespace EmbeddedCollectionField {
  type Any = EmbeddedCollectionField<any, any, any, any, any, any, any, any, any>;

  /**
   * A shorthand for the options of an EmbeddedCollectionField class.
   * @typeParam AssignmentElementType - the assignment type of the elements of the EmbeddedCollectionField
   */
  type Options<AssignmentElementType> = DataField.Options<ArrayField.BaseAssignmentType<AssignmentElementType>>;

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
  ) => Document<any, infer Schema extends DataSchema, any>
    ? SchemaField.InnerAssignmentType<Schema>
    : never;

  /**
   * A type to infer the initialized element type of an EmbeddedCollectionField from its ElementFieldType.
   * @typeParam ElementFieldType - the DataField type of the elements in the EmbeddedCollectionField
   */
  type InitializedElementType<ElementFieldType extends Document.AnyConstructor> =
    Document.ToConfiguredInstance<ElementFieldType>;

  /**
   * A type to infer the initialized element type of an EmbeddedCollectionField from its ElementFieldType.
   * @typeParam ElementFieldType - the DataField type of the elements in the EmbeddedCollectionField
   */
  type PersistedElementType<ElementFieldType extends Document.AnyConstructor> = ElementFieldType extends new (
    ...args: any[]
  ) => Document<any, infer Schema extends DataSchema, any>
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
    InitializedElementType extends Document.Internal.Instance.Any,
    ParentDataModel extends Document.Any,
    Opts extends Options<AssignmentElementType>,
  > = DataField.DerivedInitializedType<
    EmbeddedCollection<Document.Internal.Instance.Complete<InitializedElementType>, ParentDataModel>,
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
  Options extends EmbeddedCollectionDeltaField.Options<any> = EmbeddedCollectionDeltaField.DefaultOptions<
    EmbeddedCollectionDeltaField.AssignmentElementType<ElementFieldType>
  >,
  AssignmentElementType = EmbeddedCollectionDeltaField.AssignmentElementType<ElementFieldType>,
  InitializedElementType extends Document.Any = EmbeddedCollectionDeltaField.InitializedElementType<ElementFieldType>,
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
  Options,
  AssignmentElementType,
  InitializedElementType,
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
  type Options<AssignmentElementType> = DataField.Options<ArrayField.BaseAssignmentType<AssignmentElementType>>;

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
  ) => Document<any, infer Schema extends DataSchema, any>
    ? SchemaField.InnerAssignmentType<Schema>
    : never;

  /**
   * A type to infer the initialized element type of an EmbeddedCollectionDeltaField from its ElementFieldType.
   * @typeParam ElementFieldType - the DataField type of the elements in the EmbeddedCollectionDeltaField
   */
  type InitializedElementType<ElementFieldType extends Document.AnyConstructor> =
    Document.ToConfiguredInstance<ElementFieldType>;

  /**
   * A type to infer the initialized element type of an EmbeddedCollectionDeltaField from its ElementFieldType.
   * @typeParam ElementFieldType - the DataField type of the elements in the EmbeddedCollectionDeltaField
   */
  type PersistedElementType<ElementFieldType extends Document.AnyConstructor> = ElementFieldType extends new (
    ...args: any[]
  ) => Document<any, infer Schema extends DataSchema, any>
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
    InitializedElementType extends Document.Internal.Instance.Any,
    ParentDataModel extends Document.Any,
    Opts extends Options<AssignmentElementType>,
  > = DataField.DerivedInitializedType<
    EmbeddedCollectionDelta<Document.Internal.Instance.Complete<InitializedElementType>, ParentDataModel>,
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
  const DocumentType extends Document.AnyConstructor,
  const Options extends EmbeddedDocumentField.Options<DocumentType> = EmbeddedDocumentField.DefaultOptions,
  const AssignmentType = EmbeddedDocumentField.AssignmentType<DocumentType, Options>,
  const InitializedType = EmbeddedDocumentField.InitializedType<DocumentType, Options>,
  const PersistedType extends AnyObject | null | undefined = EmbeddedDocumentField.PersistedType<DocumentType, Options>,
> extends EmbeddedDataField<DocumentType, Options, AssignmentType, InitializedType, PersistedType> {
  /**
   * @param model   - The type of Document which is embedded.
   * @param options - Options which configure the behavior of the field.
   */
  constructor(model: DocumentType, options?: Options, context?: DataField.Context);

  /** @defaultValue `true` */
  override nullable: boolean;

  protected static override get _defaults(): EmbeddedDocumentField.Options<Document.AnyConstructor>;

  /** @defaultValue `true` */
  static override hierarchical: boolean;

  override initialize(
    value: PersistedType,
    model: DataModel.Any,
    options?: AnyObject,
  ): InitializedType | (() => InitializedType | null);

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
  type Options<DocumentType extends Document.AnyConstructor> = DataField.Options<
    SchemaField.InnerAssignmentType<DataModel.SchemaOfClass<DocumentType>> | __SchemaFieldInitial
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
  type MergedOptions<DocumentType extends Document.AnyConstructor, Opts extends Options<DocumentType>> = SimpleMerge<
    DefaultOptions,
    Opts
  >;

  /**
   * A shorthand for the assignment type of an EmbeddedDocumentField class.
   * @typeParam DocumentType - the type of the embedded Document
   * @typeParam Opts         - the options that override the default options
   */
  type AssignmentType<
    DocumentType extends Document.AnyConstructor,
    Opts extends Options<DocumentType>,
  > = DataField.DerivedAssignmentType<
    SchemaField.InnerAssignmentType<DataModel.SchemaOfClass<DocumentType>>,
    MergedOptions<DocumentType, Opts>
  >;

  /**
   * A shorthand for the initialized type of an EmbeddedDocumentField class.
   * @typeParam DocumentType - the type of the embedded Document
   * @typeParam Opts         - the options that override the default options
   */
  type InitializedType<
    DocumentType extends Document.AnyConstructor,
    Opts extends Options<DocumentType>,
  > = DataField.DerivedInitializedType<
    SchemaField.InnerInitializedType<DataModel.SchemaOfClass<DocumentType>>,
    MergedOptions<DocumentType, Opts>
  >;

  /**
   * A shorthand for the persisted type of an EmbeddedDocumentField class.
   * @typeParam DocumentType - the type of the embedded Document
   * @typeParam Opts         - the options that override the default options
   */
  type PersistedType<
    DocumentType extends Document.AnyConstructor,
    Opts extends Options<DocumentType>,
  > = DataField.DerivedInitializedType<
    SchemaField.InnerPersistedType<DataModel.SchemaOfClass<DocumentType>>,
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
  Options extends StringField.Options = DocumentIdField.DefaultOptions,
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
  override initial: DataField.Options.InitialType<InitializedType>;

  /** @defaultValue `true` */
  override readonly: boolean;

  /** @defaultValue `"is not a valid Document ID string"` */
  override validationError: string;

  protected static override get _defaults(): StringField.Options;

  protected override _cast(value: AssignmentType): InitializedType;

  protected override _validateType(
    value: InitializedType,
    options?: DataField.ValidationOptions<DataField.Any>,
  ): boolean | DataModelValidationFailure | void;
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
  type MergedOptions<Options extends StringField.Options> = SimpleMerge<DefaultOptions, Options>;

  /**
   * A shorthand for the assignment type of a StringField class.
   * @typeParam Options - the options that override the default options
   */
  type AssignmentType<Options extends StringField.Options> = DataField.DerivedAssignmentType<
    string | Document.Any,
    MergedOptions<Options>
  >;

  /**
   * A shorthand for the initialized type of a StringField class.
   * @typeParam Options - the options that override the default options
   */
  type InitializedType<Options extends StringField.Options> = DataField.DerivedInitializedType<
    string,
    MergedOptions<Options>
  >;
}

/**
 * A subclass of {@link StringField} which supports referencing some other Document by its UUID.
 * This field may not be blank, but may be null to indicate that no UUID is referenced.
 */
declare class DocumentUUIDField<
  const Options extends DocumentUUIDField.Options = DocumentUUIDField.DefaultOptions,
  const AssignmentType = StringField.AssignmentType<Options>,
  const InitializedType = StringField.InitializedType<Options>,
  const PersistedType extends string | null | undefined = StringField.InitializedType<Options>,
> extends StringField<Options, AssignmentType, InitializedType, PersistedType> {
  /**
   * @param options - Options which configure the behavior of the field
   * @param context - Additional context which describes the field
   */
  constructor(options?: Options, context?: DataField.Context);

  /** A specific document type in CONST.ALL_DOCUMENT_TYPES required by this field */
  type: Document.Type | undefined;

  /** Does this field require (or prohibit) embedded documents? */
  embedded: boolean | undefined;

  static get _defaults(): DocumentUUIDField.Options;

  protected override _validateType(
    value: InitializedType,
    options?: DataField.ValidationOptions<DataField.Any>,
  ): boolean | DataModelValidationFailure | void;

  // These verbose overloads are because otherwise there would be a misleading errors about `choices` being required without mentioning `options` or vice versa.
  toFormGroup(
    groupConfig?: DataField.GroupConfig,
    inputConfig?:
      | DocumentUUIDField.RootToInputConfig<InitializedType>
      | DocumentUUIDField.ToInputConfigWithOptions<InitializedType>,
  ): HTMLDivElement;
  toFormGroup(
    groupConfig?: DataField.GroupConfig,
    inputConfig?: DocumentUUIDField.ToInputConfigWithChoices<InitializedType>,
  ): HTMLDivElement;

  toInput(
    config?:
      | DocumentUUIDField.RootToInputConfig<InitializedType>
      | DocumentUUIDField.ToInputConfigWithOptions<InitializedType>,
  ): HTMLElement | HTMLCollection;
  toInput(config?: DocumentUUIDField.ToInputConfigWithChoices<InitializedType>): HTMLElement | HTMLCollection;

  protected override _toInput(
    config:
      | DocumentUUIDField.RootToInputConfig<InitializedType>
      | DocumentUUIDField.ToInputConfigWithOptions<InitializedType>,
  ): HTMLElement | HTMLCollection;
  protected override _toInput(
    config: DocumentUUIDField.ToInputConfigWithChoices<InitializedType>,
  ): HTMLElement | HTMLCollection;
}

declare namespace DocumentUUIDField {
  type Options = StringField.Options &
    StringField.Options & {
      /* A specific document type in CONST.ALL_DOCUMENT_TYPES required by this field */
      type?: Document.Type | undefined;

      /* Does this field require (or prohibit) embedded documents? */
      embedded?: boolean | undefined;
    };

  type DefaultOptions = SimpleMerge<
    StringField.DefaultOptions,
    {
      required: true;
      blank: false;
      nullable: true;
      initial: null;
      type: undefined;
      embedded: undefined;
    }
  >;

  interface RootToInputConfig<InitializedType>
    extends Omit<DataField.ToInputConfig<InitializedType>, "type" | "single"> {}

  /** @internal */
  type _Choices = Omit<SelectInputConfig, "options"> & StringField.GetChoicesOptions;

  interface ToInputConfigWithOptions<InitializedType> extends RootToInputConfig<InitializedType>, SelectInputConfig {}
  interface ToInputConfigWithChoices<InitializedType>
    extends SimpleMerge<RootToInputConfig<InitializedType>, _Choices> {}

  /**
   * @remarks `DocumentUUIDField#_toInput` writes `Object.assign(config, {type: this.type, single: true});` which is why they have been removed as options.
   */
  type ToInputConfig<InitializedType> =
    | RootToInputConfig<InitializedType>
    | ToInputConfigWithOptions<InitializedType>
    | ToInputConfigWithChoices<InitializedType>;
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
  DocumentType extends Document.AnyConstructor,
  Options extends ForeignDocumentField.Options = ForeignDocumentField.DefaultOptions,
  AssignmentType = ForeignDocumentField.AssignmentType<DocumentType, Options>,
  InitializedType = ForeignDocumentField.InitializedType<DocumentType, Options>,
  PersistedType extends string | null | undefined = ForeignDocumentField.PersistedType<Options>,
> extends DocumentIdField<Options, AssignmentType, InitializedType, PersistedType> {
  /**
   * @param model   - The foreign DataModel class definition which this field should link to.
   * @param options - Options which configure the behavior of the field
   */
  constructor(model: DocumentType, options?: Options, context?: DataField.Context);

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

  protected static override get _defaults(): ForeignDocumentField.Options;

  protected override _cast(value: AssignmentType): InitializedType;

  override initialize(
    value: PersistedType,
    model: DataModel.Any,
    options?: AnyObject,
  ): InitializedType | (() => InitializedType | null);

  override toObject(value: InitializedType): PersistedType;
}

declare namespace ForeignDocumentField {
  /** The options for the ForeignDocumentField class. */
  type Options = StringField.Options &
    DataField.Options<string | Document.Any> & {
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
  type AssignmentType<
    ConcreteDocument extends Document.AnyConstructor,
    Opts extends Options,
  > = DataField.DerivedAssignmentType<string | Document.ToConfiguredClass<ConcreteDocument>, MergedOptions<Opts>>;

  /**
   * A shorthand for the initialized type of a ForeignDocumentField class.
   * @typeParam Opts - the options that override the default options
   */
  type InitializedType<
    ConcreteDocument extends Document.AnyConstructor,
    Opts extends Options,
  > = DataField.DerivedInitializedType<
    Opts["idOnly"] extends true ? string : Document.ToConfiguredInstance<ConcreteDocument>,
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
  Options extends StringField.Options = ColorField.DefaultOptions,
  AssignmentType = ColorField.AssignmentType<Options>,
  InitializedType = ColorField.InitializedType<Options>,
  PersistedType extends string | null | undefined = ColorField.PersistedType<Options>,
> extends StringField<Options, AssignmentType, InitializedType, PersistedType> {
  /** @defaultValue `true` */
  override nullable: boolean;

  /** @defaultValue `null` */
  override initial: DataField.Options.InitialType<InitializedType>;

  /** @defaultValue `false` */
  override blank: boolean;

  /** @defaultValue `"is not a valid hexadecimal color string"` */
  override validationError: string;

  protected static override get _defaults(): StringField.Options;

  override clean(value: AssignmentType, options?: DataField.CleanOptions): InitializedType;

  protected override _validateType(
    value: InitializedType,
    options?: DataField.ValidationOptions<DataField.Any>,
  ): boolean | DataModelValidationFailure | void;
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
  type MergedOptions<Options extends StringField.Options> = SimpleMerge<DefaultOptions, Options>;

  /**
   * A shorthand for the assignment type of a ColorField class.
   * @typeParam Options - the options that override the default options
   */
  type AssignmentType<Options extends StringField.Options> = DataField.DerivedAssignmentType<
    string,
    MergedOptions<Options>
  >;

  /**
   * A shorthand for the initialized type of a ColorField class.
   * @typeParam Options - the options that override the default options
   */
  type InitializedType<Options extends StringField.Options> = DataField.DerivedInitializedType<
    Color,
    MergedOptions<Options>
  >;

  /**
   * A shorthand for the persisted type of a ColorField class.
   * @typeParam Options - the options that override the default options
   */
  type PersistedType<Options extends StringField.Options> = DataField.DerivedInitializedType<
    string,
    MergedOptions<Options>
  >;
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
  Options extends FilePathField.Options = FilePathField.DefaultOptions,
  AssignmentType = FilePathField.AssignmentType<Options>,
  InitializedType = FilePathField.InitializedType<Options>,
  PersistedType extends string | null | undefined = FilePathField.InitializedType<Options>,
> extends StringField<Options, AssignmentType, InitializedType, PersistedType> {
  /**
   * @param options - Options which configure the behavior of the field
   */
  constructor(options?: Options, context?: DataField.Context);

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
  override initial: DataField.Options.InitialType<InitializedType>;

  protected static override get _defaults(): FilePathField.Options;

  override clean(value: AssignmentType, options?: DataField.CleanOptions): InitializedType;

  protected override _validateType(
    value: InitializedType,
    options?: DataField.ValidationOptions<DataField.Any>,
  ): boolean | DataModelValidationFailure | void;
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

  interface Options extends StringField.Options {
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

  /**
   * A helper type for the given options type merged into the default options of the FilePathField class.
   * @typeParam Options - the options that override the default options
   */
  type MergedOptions<Options extends StringField.Options> = SimpleMerge<DefaultOptions, Options>;

  /**
   * A shorthand for the assignment type of a FilePathField class.
   * @typeParam Options - the options that override the default options
   */
  type AssignmentType<Options extends StringField.Options> = DataField.DerivedAssignmentType<
    string,
    MergedOptions<Options>
  >;

  /**
   * A shorthand for the initialized type of a FilePathField class.
   * @typeParam Options - the options that override the default options
   */
  type InitializedType<Options extends StringField.Options> = DataField.DerivedInitializedType<
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
  Options extends NumberField.Options = AngleField.DefaultOptions,
  AssignmentType = AngleField.AssignmentType<Options>,
  InitializedType = AngleField.InitializedType<Options>,
  PersistedType extends number | null | undefined = AngleField.InitializedType<Options>,
> extends NumberField<Options, AssignmentType, InitializedType, PersistedType> {
  /** @defaultValue `true` */
  override required: boolean;

  /** @defaultValue `false` */
  override nullable: boolean;

  /** @defaultValue `0` */
  override initial: DataField.Options.InitialType<InitializedType>;

  /** @defaultValue `0` */
  base: number;

  /** @defaultValue `0` */
  override min: number | undefined;

  /** @defaultValue `360` */
  override max: number | undefined;

  /** @defaultValue `"is not a number between 0 and 360"` */
  override validationError: string;

  protected static override get _defaults(): NumberField.Options;

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
  type MergedOptions<Options extends NumberField.Options> = SimpleMerge<DefaultOptions, Options>;

  /**
   * A shorthand for the assignment type of a AngleField class.
   * @typeParam Options - the options that override the default options
   */
  type AssignmentType<Options extends NumberField.Options> = DataField.DerivedAssignmentType<
    number,
    MergedOptions<Options>
  >;

  /**
   * A shorthand for the initialized type of a AngleField class.
   * @typeParam Options - the options that override the default options
   */
  type InitializedType<Options extends NumberField.Options> = DataField.DerivedInitializedType<
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
  Options extends NumberField.Options = AlphaField.DefaultOptions,
  AssignmentType = AlphaField.AssignmentType<Options>,
  InitializedType = AlphaField.InitializedType<Options>,
  PersistedType extends number | null | undefined = AlphaField.InitializedType<Options>,
> extends NumberField<Options, AssignmentType, InitializedType, PersistedType> {
  /** @defaultValue `true` */
  override required: boolean;

  /** @defaultValue `false` */
  override nullable: boolean;

  /** @defaultValue `1` */
  override initial: DataField.Options.InitialType<InitializedType>;

  /** @defaultValue `0` */
  override min: number | undefined;

  /** @defaultValue `1` */
  override max: number | undefined;

  /** @defaultValue `"is not a number between 0 and 1"` */
  override validationError: string;

  protected static override get _defaults(): NumberField.Options;
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
  type MergedOptions<Options extends NumberField.Options> = SimpleMerge<DefaultOptions, Options>;

  /**
   * A shorthand for the assignment type of a AlphaField class.
   * @typeParam Options - the options that override the default options
   */
  type AssignmentType<Options extends NumberField.Options> = DataField.DerivedAssignmentType<
    number,
    MergedOptions<Options>
  >;

  /**
   * A shorthand for the initialized type of a AlphaField class.
   * @typeParam Options - the options that override the default options
   */
  type InitializedType<Options extends NumberField.Options> = DataField.DerivedInitializedType<
    number,
    MergedOptions<Options>
  >;
}

/**
 * A special [NumberField]{@link NumberField} represents a number between 0 (inclusive) and 1 (exclusive).
 * Its values are normalized (modulo 1) to the range [0, 1) instead of being clamped.
 */
declare class HueField<
  const Options extends NumberField.Options = NumberField.DefaultOptions,
  const AssignmentType = NumberField.AssignmentType<Options>,
  const InitializedType = NumberField.InitializedType<Options>,
  const PersistedType extends number | null | undefined = NumberField.InitializedType<Options>,
> extends NumberField<Options, AssignmentType, InitializedType, PersistedType> {
  static get _defaults(): HueField.Options;

  protected override _cast(value: AssignmentType): InitializedType;
}

declare namespace HueField {
  type Options = NumberField.Options;

  type DefaultOptions = SimpleMerge<
    NumberField.DefaultOptions,
    {
      required: true;
      nullable: false;
      initial: 0;
      min: 0;
      max: 1;
      validationError: "is not a number between 0 (inclusive) and 1 (exclusive)";
    }
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
  override initial: DataField.Options.InitialType<InitializedType>;

  /** @defaultValue `"is not a mapping of user IDs and document permission levels"` */
  override validationError: string;

  protected static override get _defaults(): DocumentOwnershipField.Options;

  protected override _validateType(
    value: InitializedType,
    options?: DataField.ValidationOptions<DataField.Any>,
  ): boolean | DataModelValidationFailure | void;
}

declare namespace DocumentOwnershipField {
  /** A shorthand for the options of a DocumentOwnershipField class. */
  type Options = DataField.Options<Record<string, DOCUMENT_OWNERSHIP_LEVELS>>;

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
  // TODO(LukeAbby): Due to the unconditional setting of `blank`, `trim`, and `choices` setting them is meaningless which basically means they're removed from the options.
  Options extends StringField.Options = JSONField.DefaultOptions,
  AssignmentType = JSONField.AssignmentType<Options>,
  InitializedType = JSONField.InitializedType<Options>,
  PersistedType extends string | null | undefined = JSONField.PersistedType<Options>,
> extends StringField<Options, AssignmentType, InitializedType, PersistedType> {
  constructor(options?: Options, context?: DataField.Context);

  /** @defaultValue `false` */
  override blank: boolean;

  /** @defaultValue `undefined` */
  override initial: DataField.Options.InitialType<InitializedType>;

  /** @defaultValue `"is not a valid JSON string"` */
  override validationError: string;

  protected static override get _defaults(): StringField.Options;

  override clean(value: AssignmentType, options?: DataField.CleanOptions): InitializedType;

  protected override _validateType(
    value: InitializedType,
    options?: DataField.ValidationOptions<DataField.Any>,
  ): boolean | DataModelValidationFailure | void;

  override initialize(
    value: PersistedType,
    model: DataModel.Any,
    options?: AnyObject,
  ): InitializedType | (() => InitializedType | null);

  override toObject(value: InitializedType): PersistedType;

  // These verbose overloads are because otherwise there would be a misleading errors about `choices` being required without mentioning `options` or vice versa.
  toFormGroup(
    groupConfig?: DataField.GroupConfig,
    inputConfig?: DataField.ToInputConfig<InitializedType> | DataField.ToInputConfigWithOptions<InitializedType>,
  ): HTMLDivElement;
  toFormGroup(
    groupConfig?: DataField.GroupConfig,
    inputConfig?: DataField.ToInputConfigWithChoices<InitializedType, Options["choices"]>,
  ): HTMLDivElement;

  toInput(
    config?: DataField.ToInputConfig<InitializedType> | DataField.ToInputConfigWithOptions<InitializedType>,
  ): HTMLElement | HTMLCollection;
  toInput(
    config?: DataField.ToInputConfigWithChoices<InitializedType, Options["choices"]>,
  ): HTMLElement | HTMLCollection;

  protected override _toInput(
    config: DataField.ToInputConfig<InitializedType> | DataField.ToInputConfigWithOptions<InitializedType>,
  ): HTMLElement | HTMLCollection;
  protected override _toInput(
    config: DataField.ToInputConfigWithChoices<InitializedType, Options["choices"]>,
  ): HTMLElement | HTMLCollection;
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
  type MergedOptions<Options extends StringField.Options> = SimpleMerge<DefaultOptions, Options>;

  /**
   * A shorthand for the assignment type of a JSONField class.
   * @typeParam Options - the options that override the default options
   */
  type AssignmentType<Options extends StringField.Options> = DataField.DerivedAssignmentType<
    string,
    MergedOptions<Options>
  >;

  /**
   * A shorthand for the initialized type of a JSONField class.
   * @typeParam Options - the options that override the default options
   */
  type InitializedType<Options extends StringField.Options> = DataField.DerivedInitializedType<
    AnyObject,
    MergedOptions<Options>
  >;

  /**
   * A shorthand for the persisted type of a JSONField class.
   * @typeParam Options - the options that override the default options
   */
  type PersistedType<Options extends StringField.Options> = DataField.DerivedInitializedType<
    string,
    MergedOptions<Options>
  >;
}

/**
 * A special subclass of {@link DataField} which can contain any value of any type.
 * Any input is accepted and is treated as valid.
 * It is not recommended to use this class except for very specific circumstances.
 */
// TODO(LukeAbby): This field effectively removes all options because there's no point asking for an options when none of them do anything.
declare class AnyField extends DataField<DataField.Options.Any, unknown, unknown, unknown> {
  override _cast(value: unknown): unknown;

  protected override _validateType(
    value: unknown,
    options?: DataField.ValidationOptions<DataField.Any>,
  ): boolean | DataModelValidationFailure | void;
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
  Options extends StringField.Options = HTMLField.DefaultOptions,
  AssignmentType = HTMLField.AssignmentType<Options>,
  InitializedType = HTMLField.InitializedType<Options>,
  PersistedType extends string | null | undefined = HTMLField.InitializedType<Options>,
> extends StringField<Options, AssignmentType, InitializedType, PersistedType> {
  /** @defaultValue `true` */
  override required: boolean;

  /** @defaultValue `true` */
  override blank: boolean;

  protected static override get _defaults(): StringField.Options;

  // These verbose overloads are because otherwise there would be a misleading errors about `choices` being required without mentioning `options` or vice versa.
  toFormGroup(
    groupConfig?: HTMLField.GroupConfig,
    inputConfig?: DataField.ToInputConfig<InitializedType> | DataField.ToInputConfigWithOptions<InitializedType>,
  ): HTMLDivElement;
  toFormGroup(
    groupConfig?: HTMLField.GroupConfig,
    inputConfig?: DataField.ToInputConfigWithChoices<InitializedType, Options["choices"]>,
  ): HTMLDivElement;

  toInput(
    config?: DataField.ToInputConfig<InitializedType> | DataField.ToInputConfigWithOptions<InitializedType>,
  ): HTMLElement | HTMLCollection;
  toInput(
    config?: DataField.ToInputConfigWithChoices<InitializedType, Options["choices"]>,
  ): HTMLElement | HTMLCollection;

  protected override _toInput(
    config: DataField.ToInputConfig<InitializedType> | DataField.ToInputConfigWithOptions<InitializedType>,
  ): HTMLElement | HTMLCollection;
  protected override _toInput(
    config: DataField.ToInputConfigWithChoices<InitializedType, Options["choices"]>,
  ): HTMLElement | HTMLCollection;
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
  type MergedOptions<Options extends StringField.Options> = SimpleMerge<DefaultOptions, Options>;

  /**
   * A shorthand for the assignment type of a HTMLField class.
   * @typeParam Options - the options that override the default options
   */
  type AssignmentType<Options extends StringField.Options> = DataField.DerivedAssignmentType<
    string,
    MergedOptions<Options>
  >;

  /**
   * A shorthand for the initialized type of a HTMLField class.
   * @typeParam Options - the options that override the default options
   */
  type InitializedType<Options extends StringField.Options> = DataField.DerivedInitializedType<
    string,
    MergedOptions<Options>
  >;

  // `HTMLField#toFormGroup` provides a default by way of `groupConfig.stacked ??= true`.
  interface GroupConfig extends NullishProps<DataField.GroupConfig, "stacked"> {}
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
  Options extends NumberField.Options = IntegerSortField.DefaultOptions,
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
  override initial: DataField.Options.InitialType<InitializedType>;

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
  type MergedOptions<Options extends NumberField.Options> = SimpleMerge<DefaultOptions, Options>;

  /**
   * A shorthand for the assignment type of a IntegerSortField class.
   * @typeParam Options - the options that override the default options
   */
  type AssignmentType<Options extends NumberField.Options> = DataField.DerivedAssignmentType<
    number,
    MergedOptions<Options>
  >;

  /**
   * A shorthand for the initialized type of a IntegerSortField class.
   * @typeParam Options - the options that override the default options
   */
  type InitializedType<Options extends NumberField.Options> = DataField.DerivedInitializedType<
    number,
    MergedOptions<Options>
  >;
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
  PersistedType extends AnyObject | null | undefined = DocumentStatsField.PersistedType<Options>,
> extends SchemaField<DocumentStatsField.Schema, Options, AssignmentType, InitializedType, PersistedType> {
  constructor(options?: Options);
}

declare namespace DocumentStatsField {
  /** A shorthand for the options of a DocumentStatsField class. */
  type Options = DataField.Options<SchemaField.InnerAssignmentType<Schema>>;

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
     * The core version the Document was created in.
     * @defaultValue `null`
     */
    coreVersion: StringField<{ required: true; blank: false; nullable: true; initial: null }>;

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

    compendiumSource: DocumentUUIDField;
    duplicateSource: DocumentUUIDField;
  }
}

/**
 * A subclass of [StringField]{@link StringField} that is used specifically for the Document "type" field.
 */
declare class DocumentTypeField<
  const ConcreteDocumentClass extends Document.AnyConstructor,
  const Options extends DocumentTypeField.Options = DocumentTypeField.DefaultOptions,
  const AssignmentType = DocumentTypeField.AssignmentType<ConcreteDocumentClass, Options>,
  const InitializedType = DocumentTypeField.InitializedType<ConcreteDocumentClass, Options>,
  const PersistedType extends string | null | undefined = DocumentTypeField.InitializedType<
    ConcreteDocumentClass,
    Options
  >,
> extends StringField<
  DocumentTypeField.MergedOptions<ConcreteDocumentClass, Options>,
  AssignmentType,
  InitializedType,
  PersistedType
> {
  /**
   * @param documentClass - The base document class which belongs in this field
   * @param options - Options which configure the behavior of the field
   * @param context - Additional context which describes the field
   */
  constructor(documentClass: ConcreteDocumentClass, options?: DocumentTypeField.Options, context?: DataField.Context);

  static override get _defaults(): DocumentTypeField.Options;

  protected override _validateType(
    value: InitializedType,
    options?: DataField.ValidationOptions<DataField.Any>,
  ): boolean | DataModelValidationFailure | void;
}

declare namespace DocumentTypeField {
  /** The type of the default options for the {@link DocumentTypeField} class. */
  type DefaultOptions = SimpleMerge<
    StringField.DefaultOptions,
    {
      required: true;
      nullable: false;
      blank: false;
    }
  >;

  interface Options extends StringField.Options {}

  // TODO(LukeAbby): This class has effectively removed `choices` and `validationError` since they're unconditionally set in the constructor.
  type MergedOptions<
    ConcreteDocumentClass extends Document.AnyConstructor,
    Options extends StringField.Options,
  > = SimpleMerge<
    SimpleMerge<DefaultOptions, Options>,
    {
      choices: () => ConcreteDocumentClass["TYPES"];
      validationError: string;
    }
  >;

  type AssignmentType<
    ConcreteDocumentClass extends Document.AnyConstructor,
    Options extends StringField.Options,
  > = StringField.AssignmentType<MergedOptions<ConcreteDocumentClass, Options>>;
  type InitializedType<
    ConcreteDocumentClass extends Document.AnyConstructor,
    Options extends StringField.Options,
  > = StringField.InitializedType<MergedOptions<ConcreteDocumentClass, Options>>;
  type PersistedType<
    ConcreteDocumentClass extends Document.AnyConstructor,
    Options extends StringField.Options,
  > = StringField.InitializedType<MergedOptions<ConcreteDocumentClass, Options>>;
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
  const Options extends TypeDataField.Options<SystemDocument> = TypeDataField.DefaultOptions,
  const AssignmentType = TypeDataField.AssignmentType<SystemDocument, Options>,
  const InitializedType = TypeDataField.InitializedType<SystemDocument, Options>,
  const PersistedType extends AnyObject | null | undefined = TypeDataField.PersistedType<SystemDocument, Options>,
> extends ObjectField<Options, AssignmentType, InitializedType, PersistedType> {
  /**
   * @param document - The base document class which belongs in this field
   * @param options  - Options which configure the behavior of the field
   */
  constructor(document: SystemDocument, options?: Options);

  /** @defaultValue `true` */
  override required: boolean;

  /**
   * The canonical document name of the document type which belongs in this field
   */
  document: SystemDocument;

  protected static override get _defaults(): TypeDataField.Options<Document.SystemConstructor>;

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
  getModelForType(type: string): DataModel.AnyConstructor | null;

  override getInitialValue(data: { type?: string }): InitializedType;

  protected override _cleanType(value: InitializedType, options?: DataField.CleanOptions): InitializedType;

  override initialize(
    value: PersistedType,
    model: DataModel.Any,
    options?: AnyObject,
  ): InitializedType | (() => InitializedType | null);

  protected override _validateType(
    value: InitializedType,
    options?: DataField.ValidationOptions<DataField.Any>,
  ): boolean | DataModelValidationFailure | void;

  protected override _validateModel(data: AnyObject, options?: AnyObject): void;

  override toObject(value: InitializedType): PersistedType;

  /**
   * Migrate this field's candidate source data.
   * @param sourceData - Candidate source data of the root model
   * @param fieldData  - The value of this field within the source data
   */
  migrateSource(sourceData: AnyObject, fieldData: unknown): unknown;
}

declare namespace TypeDataField {
  /**
   * A shorthand for the options of a TypeDataField class.
   * @typeParam DocumentType - the type of the embedded Document
   */
  type Options<DocumentType extends Document.SystemConstructor> = DataField.Options<
    SchemaField.InnerAssignmentType<DataModel.SchemaOfClass<DocumentType>>
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
  type MergedOptions<DocumentType extends Document.SystemConstructor, Opts extends Options<DocumentType>> = SimpleMerge<
    DefaultOptions,
    Opts
  >;

  type DataModelsFor<DocumentType extends Document.Type> = DocumentType extends keyof DataModelConfig
    ? DataModelConfig[DocumentType]
    : EmptyObject;

  /**
   * A shorthand for the assignment type of a TypeDataField class.
   * @typeParam DocumentType - the type of the embedded Document
   * @typeParam Options - the options that override the default options
   */
  type AssignmentType<
    SystemDocumentConstructor extends Document.SystemConstructor,
    Opts extends Options<SystemDocumentConstructor>,
  > = DataField.DerivedAssignmentType<AnyObject, MergedOptions<SystemDocumentConstructor, Opts>>;

  /**
   * A shorthand for the initialized type of a TypeDataField class.
   * @typeParam DocumentType - the type of the embedded Document
   * @typeParam Options - the options that override the default options
   */
  type InitializedType<
    SystemDocumentConstructor extends Document.SystemConstructor,
    Opts extends Options<SystemDocumentConstructor>,
  > = DataField.DerivedInitializedType<
    _Instances<DataModelsFor<SystemDocumentConstructor["metadata"]["name"]>> | UnknownSystem,
    MergedOptions<SystemDocumentConstructor, Opts>
  >;

  type _Instances<T> = {
    [K in keyof T]: T[K] extends (abstract new (arg0: never, ...args: never[]) => infer U extends DataModel.Any)
      ? U
      : never;
  };

  /**
   * With the existence of custom module subtypes a system can no longer rely on their configured types being the only ones.
   * A module can provide its own custom type though it is always of the form `${moduleName}.${subType}` so the `.` is a pretty
   * strong indicator.
   *
   * `UnknownSourceData` covers the case where it's configured without a data model.
   * See {@link UnknownSystem | `UnknownSystem`} for other possibilities.
   */
  interface UnknownSourceData extends AnyObject {
    type: `${string}.${string}`;
  }

  /**
   * With the existence of custom module subtypes a system can no longer rely on their configured types being the only ones.
   * A module can provide its own custom type though it is always of the form `${moduleName}.${subType}` so the `.` is a pretty
   * strong indicator.
   *
   * `UnknownTypeDataModel` covers the case where it's configured with a {@link TypeDataModel | `TypeDataModel`}.
   * See {@link UnknownSystem | `UnknownSystem`} for other possibilities.
   */
  interface UnknownTypeDataModel extends TypeDataModel<any, any, any, any> {}

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
   * With the existence of custom module subtypes a system can no longer rely on their configured types being the only ones.
   */
  type UnknownSystem = UnknownSourceData | UnknownTypeDataModel | UnknownDataModel;

  /**
   * A shorthand for the persisted type of a TypeDataField class.
   * @typeParam DocumentType - the type of the embedded Document
   * @typeParam Opts         - the options that override the default options
   */
  type PersistedType<
    ConcreteDocument extends Document.SystemConstructor,
    Opts extends Options<ConcreteDocument>,
  > = DataField.DerivedInitializedType<AnyObject, MergedOptions<ConcreteDocument, Opts>>;
}

/**
 * A subclass of [DataField]{@link DataField} which allows to typed schemas.
 */
declare class TypedSchemaField<
  const Types extends TypedSchemaField.Types,
  const Options extends TypedSchemaField.Options<Types> = TypedSchemaField.DefaultOptions,
  const AssignmentType = TypedSchemaField.AssignmentType<Types, Options>,
  const InitializedType = TypedSchemaField.InitializedType<Types, Options>,
  const PersistedType extends unknown | null | undefined = TypedSchemaField.PersistedType<Types, Options>,
> extends DataField<Options, AssignmentType, InitializedType, PersistedType> {
  /**
   * @param types   - The different types this field can represent.
   * @param options - Options which configure the behavior of the field
   * @param context - Additional context which describes the field
   */
  constructor(types: Types, options?: Options, context?: DataField.Context);

  static get _defaults(): DataField.Options.Any;

  /**
   * The types of this field.
   */
  types: TypedSchemaField.ToConfiguredTypes<Types>;

  protected override _getField(path: string[]): unknown;

  protected override _cleanType(value: InitializedType, options?: DataField.CleanOptions): InitializedType;

  protected override _cast(value: AssignmentType): InitializedType;

  protected override _validateSpecial(value: AssignmentType): boolean | void;

  protected override _validateType(
    value: InitializedType,
    options?: DataField.ValidationOptions<DataField.Any>,
  ): boolean | DataModelValidationFailure | void;

  override initialize(
    value: PersistedType,
    model: DataModel.Any,
    options?: AnyObject, // TODO: Type further.
  ): (() => InitializedType | null) | InitializedType;

  override toObject(value: InitializedType): PersistedType;

  // TODO(LukeAbby): Type `TypedSchemaField#apply`.

  migrateSource(sourceData: AnyObject, fieldData: unknown): unknown;
}

declare namespace TypedSchemaField {
  interface Options<T extends Types> extends DataField.Options<_AssignmentType<ToConfiguredTypes<T>>> {}

  type DefaultOptions = SimpleMerge<
    DataField.DefaultOptions,
    {
      required: true;
    }
  >;

  /**
   * A `ValidDataSchema` must pass the checks in `#configureTypes`. Namely:
   * - No `name` property.
   * - No `parent`.
   *
   * Additionally the `type` property (if any):
   * - Must be a `StringField`.
   * - Must be `required`
   * - Must not be `nullable`.
   * - Must not be `blank`.
   * - Must allow the corresponding type as a valid value.
   */
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  type ValidDataSchema = {
    readonly [field: string]: DataField.Any;
  };

  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  type Types = {
    [type: string]:
      | ValidDataSchema
      | SchemaField<DataSchema, { required: true; nullable: false }, any, any, any>
      | typeof DataModel<DataSchema, null>;
  };

  type ToConfiguredTypes<Types extends TypedSchemaField.Types> = {
    [K in keyof Types]:
      | (Types[K] extends ValidDataSchema ? SchemaField<Types[K]> : never)
      | (Types[K] extends SchemaField.Any ? Types[K] : never)
      | (Types[K] extends DataModel.AnyConstructor ? EmbeddedDataField<Types[K]> : never);
  };

  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  type ConfiguredTypes = {
    [type: string]: SchemaField.Any;
  };

  /**
   * @internal
   */
  type _AssignmentType<Types extends ConfiguredTypes> = {
    [K in keyof Types]: DataField.AssignmentTypeFor<Types[K]> & { type: K };
  }[keyof Types];

  type AssignmentType<
    Types extends TypedSchemaField.Types,
    Options extends TypedSchemaField.Options<Types>,
  > = DataField.DerivedAssignmentType<_AssignmentType<ToConfiguredTypes<Types>>, Options>;

  /**
   * @internal
   */
  type _InitializedType<Types extends ConfiguredTypes> = {
    [K in keyof Types]: DataField.InitializedTypeFor<Types[K]> & { type: K };
  }[keyof Types];

  type InitializedType<
    Types extends TypedSchemaField.Types,
    Options extends TypedSchemaField.Options<Types>,
  > = DataField.DerivedInitializedType<_InitializedType<ToConfiguredTypes<Types>>, Options>;

  /**
   * @internal
   */
  type _PersistedType<Types extends ConfiguredTypes> = {
    [K in keyof Types]: DataField.PersistedTypeFor<Types[K]> & { type: K };
  }[keyof Types];

  type PersistedType<
    Types extends TypedSchemaField.Types,
    Options extends TypedSchemaField.Options<Types>,
  > = DataField.DerivedInitializedType<_PersistedType<ToConfiguredTypes<Types>>, Options>;
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

// The subclassing of `StringField` can't be done in one step because
// `ToInputOptions` both adds and removes properties.
// This is done this way to avoid the need for some `@ts-expect-error`
// directives that could mask other errors.
declare class _InternalJavaScriptField<
  const Options extends JavaScriptField.Options = JavaScriptField.DefaultOptions,
  const AssignmentType = StringField.AssignmentType<Options>,
  const InitializedType = StringField.InitializedType<Options>,
  const PersistedType extends string | null | undefined = StringField.InitializedType<Options>,
> extends StringField<Options, AssignmentType, InitializedType, PersistedType> {
  override toFormGroup(groupConfig?: any, inputConfig?: any): HTMLDivElement;

  protected override _toInput(config: any): HTMLElement | HTMLCollection;
}

/**
 * A subclass of {@link StringField} which contains JavaScript code.
 */
declare class JavaScriptField<
  const Options extends JavaScriptField.Options = JavaScriptField.DefaultOptions,
  const AssignmentType = StringField.AssignmentType<Options>,
  const InitializedType = StringField.InitializedType<Options>,
  const PersistedType extends string | null | undefined = StringField.InitializedType<Options>,
> extends _InternalJavaScriptField<Options, AssignmentType, InitializedType, PersistedType> {
  constructor(options?: Options, context?: DataField.Context);

  static get _defaults(): JavaScriptField.Options;

  protected override _validateType(
    value: InitializedType,
    options?: DataField.ValidationOptions<DataField.Any>,
  ): boolean | DataModelValidationFailure | void;

  override toFormGroup(
    groupConfig?: JavaScriptField.GroupConfig,
    inputConfig?: JavaScriptField.ToInputConfig<InitializedType>,
  ): HTMLDivElement;

  protected override _toInput(config: JavaScriptField.ToInputConfig<InitializedType>): HTMLElement | HTMLCollection;
}

declare namespace JavaScriptField {
  // TODO(LukeAbby): `choices` is effectively deleted due to being unconditionally set to `undefined` in the constructor.
  type Options = StringField.Options & {
    /**
     * Does the field allow async code?
     * @defaultValue `false`
     */
    async?: boolean;
  };

  type DefaultOptions = SimpleMerge<
    StringField.Options,
    {
      async: false;
    }
  >;

  // `JavaScriptField#toFormGroup` provides a default by way of `groupConfig.stacked ??= true`.
  interface GroupConfig extends NullishProps<DataField.GroupConfig, "stacked"> {}

  interface ToInputConfig<InitializedType>
    extends SimpleMerge<DataField.ToInputConfig<InitializedType>, TextAreaInputConfig> {}
}

export {
  AlphaField,
  AngleField,
  AnyField,
  ArrayField,
  BooleanField,
  ColorField,
  DataField,
  DocumentIdField,
  DocumentOwnershipField,
  DocumentStatsField,
  DocumentTypeField,
  DocumentUUIDField,
  EmbeddedDataField,
  EmbeddedCollectionField,
  EmbeddedCollectionDeltaField,
  EmbeddedDocumentField,
  FilePathField,
  ForeignDocumentField,
  HTMLField,
  HueField,
  IntegerSortField,
  JavaScriptField,
  JSONField,
  NumberField,
  ObjectField,
  TypedSchemaField,
  SchemaField,
  SetField,
  StringField,
  TypeDataField,
  ModelValidationError,
};
