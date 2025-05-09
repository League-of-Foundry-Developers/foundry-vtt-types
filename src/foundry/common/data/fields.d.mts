import type {
  RemoveIndexSignatures,
  SimpleMerge,
  AnyObject,
  EmptyObject,
  NullishProps,
  InexactPartial,
  FixedInstanceType,
  Identity,
  PrettifyType,
  InterfaceToObject,
  AnyArray,
  GetKey,
  SplitString,
  ValueOf,
} from "fvtt-types/utils";
import type { DataModel } from "../abstract/data.mts";
import type Document from "../abstract/document.mts";
import type { EmbeddedCollection, EmbeddedCollectionDelta, TypeDataModel } from "../abstract/_module.d.mts";
import type { DOCUMENT_OWNERSHIP_LEVELS } from "../constants.d.mts";
import type { CONST } from "#client-esm/client.d.mts";
import type { DataModelValidationFailure } from "./validation-failure.mts";
import type {
  FormGroupConfig,
  FormInputConfig,
  FormSelectOption,
  MultiSelectInputConfig,
  SelectInputConfig,
  TextAreaInputConfig,
} from "#client-esm/applications/forms/fields.d.mts";

export type DataSchema = Record<string, DataField.Any>;

/**
 * An abstract class that defines the base pattern for a data field within a data schema.
 * @template Options         - the options of the DataField instance
 * @template AssignmentType  - the type of the allowed assignment values of the DataField
 * @template InitializedType - the type of the initialized values of the DataField
 * @template PersistedType   - the type of the persisted values of the DataField
 * @remarks
 * Defaults:
 * - AssignmentType: `unknown | null | undefined`
 * - InitializedType: `unknown | undefined`
 * - PersistedType: `unknown | undefined`
 * - InitialValue: `undefined`
 */
declare abstract class DataField<
  const Options extends DataField.Options.Any = DataField.DefaultOptions,
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  const AssignmentType = DataField.AssignmentType<Options>,
  const InitializedType = DataField.InitializedType<Options>,
  const PersistedType = InitializedType,
> {
  // Prevent from being bivariant.
  #assignmentType: AssignmentType;

  /**
   * @param options - Options which configure the behavior of the field
   * @param context - Additional context which describes the field
   */
  // options: not null (unchecked `in` operation), context: not null (destructured)
  constructor(options?: Options, context?: DataField.ConstructionContext);

  /** @internal */
  " __fvtt_types_internal_source_data": PersistedType;

  /** @internal */
  " __fvtt_types_internal_assignment_data": AssignmentType;

  /** @internal */
  " __fvtt_types_internal_initialized_data": InitializedType;

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
   * @remarks Foundry marked `@internal`
   */
  name: string | undefined;

  /**
   * A reference to the parent schema to which this DataField belongs.
   * This is assigned by SchemaField#initialize.
   * @remarks Foundry marked `@internal`
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
   * @remarks Returns `""` if both `this.parent?.fieldPath` and `this.name` are falsey
   */
  get fieldPath(): string;

  /**
   * Apply a function to this DataField which propagates through recursively to any contained data schema.
   * @param fn      - The function to apply
   * @param value   - The current value of this field
   * @param options - Additional options passed to the applied function (default `{}`)
   * @returns The results object
   */
  // TODO: Determine `value` based upon the field metadata in fields-v2 (while allowing subclasses to narrow allowed values)
  // options: not null (could be forwarded somewhere destructured, parameter default only)
  apply<Options, Return>(
    fn: keyof this | ((this: this, value: unknown, options: Options) => Return),
    value?: unknown,
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
  // options: not null (parameter default only, property access)
  clean(value: AssignmentType, options?: DataField.CleanOptions): InitializedType;

  /**
   * Apply any cleaning logic specific to this DataField type.
   * @param value   - The appropriately coerced value.
   * @param options - Additional options for how the field is cleaned.
   * @returns The cleaned value.
   * @remarks Simply returns `value` in `DataField`. `options` is unused in `DataField`
   */
  protected _cleanType(value: InitializedType, options?: DataField.CleanOptions | null): InitializedType;

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
   * @remarks The `@throws` is Foundry's, and is wrong, as all fields will at a minimum inherit `initial: undefined` from DataField.
   *
   * `data` is unused if the field's `initial` is not a function.
   */
  // TODO: the @throws is omitted in v13, clean up remarks
  getInitialValue(data?: unknown): InitializedType;

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
  // options: not null (parameter default only, property access)
  validate(value: AssignmentType, options?: DataField.ValidateOptions<this>): DataModelValidationFailure | void;

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
  // options: not null (parameter default only, property access in subclasses)
  protected _validateType(
    value: InitializedType,
    options?: DataField.ValidateOptions<this>,
  ): boolean | DataModelValidationFailure | void;

  /**
   * Certain fields may declare joint data validation criteria.
   * This method will only be called if the field is designated as recursive.
   * @param data    - Candidate data for joint model validation
   * @param options - Options which modify joint model validation
   * @throws  An error if joint model validation fails
   * @remarks Foundry marked `@internal`
   *
   * The only place core checks the `options` for any property is in {@link TypeDataField._validateModel | `TypeDataField#_validateModel`},
   * where it checks `options.source?.type`
   *
   * {@link SchemaField._validateModel | `SchemaField._validateModel`} enforces `source`'s existence for subsidiary calls
   *
   * The only place core *calls* this at a top level, it does not pass anything for `options`, relying on SchemaField above
   * to make TypeDataField work
   */
  protected _validateModel(data: AnyObject, options?: DataField.ValidateModelOptions | null): void; // TODO: Type further.

  /**
   * Initialize the original source data into a mutable copy for the DataModel instance.
   * @param value   - The source value of the field
   * @param model   - The DataModel instance that this field belongs to
   * @param options - Initialization options
   * @returns An initialized copy of the source data
   * @remarks Core fields that return a function:
   * - {@link ForeignDocumentField | `ForeignDocumentField`}
   * - `ActorDeltaField` (exported in the BaseToken file but not re-exported by the relevant `_module`, so unlinkable)
   */
  // TODO: investigate narrowing return to just `InitializedType` on inheritance lines that don't possibly return one
  // TODO: (everything except SchemaField and ObjectField and their descendants)
  // options: not null (parameter default only)
  initialize(
    value: PersistedType,
    model: DataModel.Any,
    options?: DataField.InitializeOptions,
  ): InitializedType | (() => InitializedType | null);

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
  protected _getField(path: string[]): DataField.Any | undefined;

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
  applyChange(value: InitializedType, model: DataModel.Any, change: ActiveEffect.EffectChangeData): InitializedType;

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
   *
   * @remarks Returns `value + delta`. `model` and `change` are unused in `DataField`
   */
  protected _applyChangeAdd(
    value: InitializedType,
    delta: InitializedType,
    model: DataModel.Any,
    change: ActiveEffect.EffectChangeData,
  ): InitializedType;

  /**
   * Apply a MULTIPLY change to this field.
   * @param value  - The field's current value.
   * @param delta  - The change delta.
   * @param model  - The model instance.
   * @param change - The original change data.
   * @returns The updated value.
   *
   * @remarks No-op in `DataField`, returns `undefined` unless overridden
   */
  protected _applyChangeMultiply(
    value: InitializedType,
    delta: InitializedType,
    model: DataModel.Any,
    change: ActiveEffect.EffectChangeData,
  ): InitializedType | undefined;

  /**
   * Apply an OVERRIDE change to this field.
   * @param value  - The field's current value.
   * @param delta  - The change delta.
   * @param model  - The model instance.
   * @param change - The original change data.
   * @returns The updated value.
   *
   * @returns Simply returns `delta`. `value`, `model`, and `change` are unused in `DataField`
   */
  protected _applyChangeOverride(
    value: InitializedType,
    delta: InitializedType,
    model: DataModel.Any,
    change: ActiveEffect.EffectChangeData,
  ): InitializedType;

  /**
   * Apply an UPGRADE change to this field.
   * @param value - The field's current value.
   * @param delta - The change delta.
   * @param model - The model instance.
   * @param change - The original change data.
   * @returns - The updated value.
   *
   * @remarks No-op in `DataField`, returns `undefined` unless overridden
   */
  protected _applyChangeUpgrade(
    value: InitializedType,
    delta: InitializedType,
    model: DataModel.Any,
    change: ActiveEffect.EffectChangeData,
  ): InitializedType | undefined;

  /**
   * Apply a DOWNGRADE change to this field.
   * @param value  - The field's current value.
   * @param delta  - The change delta.
   * @param model  - The model instance.
   * @param change - The original change data.
   * @returns The updated value.
   *
   * @remarks No-op in `DataField`, returns `undefined` unless overridden
   */
  protected _applyChangeDowngrade(
    value: InitializedType,
    delta: InitializedType,
    model: DataModel.Any,
    change: ActiveEffect.EffectChangeData,
  ): InitializedType | undefined;

  /**
   * Apply a CUSTOM change to this field.
   * @param value - The field's current value.
   * @param delta - The change delta.
   * @param model - The model instance.
   * @param change - The original change data.
   * @returns - The updated value.
   * @remarks Only returns a value if the target value of the change actually changed
   */
  protected _applyChangeCustom(
    value: InitializedType,
    delta: InitializedType,
    model: DataModel.Any,
    change: ActiveEffect.EffectChangeData,
  ): InitializedType | undefined;
}

declare namespace DataField {
  /** Any DataField. */
  interface Any extends AnyDataField {}
  interface AnyConstructor extends Identity<typeof AnyDataField> {}

  /** A DataField with unknown inner types. */
  type Unknown = DataField<any, unknown, unknown, unknown>;

  namespace Internal {
    interface ElementFieldImplementation<Element extends DataField.Any = DataField.Any> {
      " __fvtt_types_get_field_element": Element;
    }

    interface NestedFieldImplementation<Schema extends DataSchema = DataSchema> {
      " __fvtt_types_get_field_schema": Schema;
    }
  }

  /**
   * @deprecated - AssignmentType is being deprecated. See {@linkcode SchemaField.AssignmentData}
   * for more details.
   */
  type AssignmentTypeFor<ConcreteDataField extends Any> =
    ConcreteDataField extends DataField<any, infer AssignmentType, any, any> ? AssignmentType : never;

  type InitializedTypeFor<ConcreteDataField extends Any> =
    ConcreteDataField extends DataField<any, any, infer InitializedType, any> ? InitializedType : never;

  type PersistedTypeFor<ConcreteDataField extends Any> =
    ConcreteDataField extends DataField<any, any, any, infer PersistedType> ? PersistedType : never;

  /** The type of the default options for the {@linkcode DataField} class. */
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
          // TODO(LukeAbby): Add a `ValidateOptions` type or something of that sort in order to
          // catch incorrect initial types.
          DataField.Options.InitialReturnType<BaseAssignmentType, boolean, boolean>
        >
      | undefined;

    /** A data validation function which accepts one argument with the current value. */
    validate?: DataField.Validator<DataField.Any, BaseAssignmentType> | undefined;

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
    // This is an issue because `{ integer: true }` does not extend `{ required?: boolean }` because they have no properties in common.
    // Even though `{ integer: true, required: undefined }` would extend `{ required?: boolean }` following the regular rules of surplus properties being allowed.
    // `object` was chosen over `AnyObject` so that people may pass in interfaces.
    interface Any extends DataField.Options<any>, Identity<object> {}

    /**
     * A helper type for the {@linkcode DataField.Options.initial} option.
     * @template ReturnType - the return type of the option
     */
    type InitialType<ReturnType> = ReturnType | ((initialData: unknown) => ReturnType);

    /**
     * The decorated return type for the {@linkcode DataField.Options.initial} option.
     * @template BaseAssignmentType - the base assignment type for a DataField
     * @template NullableOption     - the value of the nullable option
     * @template RequiredOption     - the value of the required option
     */
    type InitialReturnType<BaseAssignmentType, NullableOption, RequiredOption> =
      | Exclude<BaseAssignmentType, null | undefined>
      | (NullableOption extends true ? null : never)
      | (RequiredOption extends true ? never : undefined);
  }

  /**
   * A helper type for the given options type merged into the default options of the DataField class.
   * @template Options - the options that override the default options
   */
  type MergedOptions<Options extends DataField.Options.Any> = SimpleMerge<DefaultOptions, Options>;

  /**
   * A type to decorate the base assignment type to a DataField, based on the options of the field.
   * @template BaseAssignmentType - the base assignment type of the DataField, without null or undefined
   * @template Options            - the options of the DataField
   *
   * @deprecated - This type is being phased out alongside the entirety of the concept of the
   * `Assignment` type.
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
   * @template BaseInitializedType - the base initialized type of the DataField, without null or undefined
   * @template Options             - the options of the DataField
   */
  type DerivedInitializedType<BaseInitializedType, Options extends DataField.Options.Any> =
    | Exclude<BaseInitializedType, null | undefined>
    | (Options["nullable"] extends true ? null : never)
    | (Options["required"] extends true ? never : undefined);

  /**
   * A shorthand for the assignment type of a DataField class.
   * @template Options - the options overriding the defaults
   *
   * @deprecated - AssignmentData is being phased out. See {@linkcode SchemaField.AssignmentData}
   * for more details.
   */
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  type AssignmentType<Options extends DataField.Options.Any> = DerivedAssignmentType<any, MergedOptions<Options>>;

  /**
   * A shorthand for the initialized type of a DataField class.
   * @template Options - the options overriding the defaults
   */
  type InitializedType<Options extends DataField.Options.Any> = DerivedInitializedType<any, MergedOptions<Options>>;

  /** @internal */
  type _ConstructionContext = NullishProps<{
    /** A field name to assign to the constructed field */
    name?: string;
  }> &
    InexactPartial<{
      /**
       * Another data field which is a hierarchical parent of this one
       * @remarks Can't be `null` as there's a `!== undefined` check in {@link SchemaField._initialize | `SchemaField#_initialize`}
       */
      parent?: DataField.Any;
    }>;

  interface ConstructionContext extends _ConstructionContext {}

  /** @internal */
  type _ValidationOptions = NullishProps<{
    /** Whether this is a partial schema validation, or a complete one. */
    partial: boolean;

    /** Whether to allow replacing invalid values with valid fallbacks. */
    fallback: boolean;

    /**
     * If true, invalid embedded documents will emit a warning and be placed in the invalidDocuments
     * collection rather than causing the parent to be considered invalid.
     */
    dropInvalidEmbedded?: boolean;
  }> &
    InexactPartial<{
      /**
       * The full source object being evaluated.
       * @privateRemarks Disallowing `null` as this value gets passed to provided `initial` functions,
       * and users shouldn't have to expect `null`
       */
      source: AnyObject;
    }>;

  /**
   * @remarks This is the type for the options for `#validate` and associate methods *without* the
   * possible inclusion of a `validator` function.
   *
   * If you are looking for the type with a generic formerly under this name, see {@link ValidateOptions | `DataField.ValidateOptions`}
   */
  interface ValidationOptions extends _ValidationOptions {}

  /**
   * @deprecated Use {@link ValidateOptions | `DataField.ValidationOptions`} instead if you need a direct replacement,
   * or {@link ValidateOptions | `DataField.ValidateOptions`} if you're typing the options of `#validate` or an associated
   * method.
   */
  interface DataValidationOptions extends ValidationOptions {}

  /** @internal */
  type _CleanOptions = NullishProps<{
    /** Whether to perform partial cleaning? */
    partial: boolean;

    /** The root data model being cleaned */
    source: AnyObject;
  }>;

  /** An interface for the options of {@link DataField.clean | `DataField#clean`} and {@link DataField._cleanType | `DataField#_cleanType`}. */
  interface CleanOptions extends _CleanOptions {}

  /**
   * @remarks The only place core checks the `options` for any property is in {@link TypeDataField._validateModel | `TypeDataField#_validateModel`},
   * where it checks `options.source?.type`
   *
   * {@link SchemaField._validateModel | `SchemaField._validateModel`} enforces `source`'s existence for subsidiary calls
   *
   * The only place core *calls* this at a top level, it does not pass anything for `options`, relying on SchemaField above
   * to make TypeDataField work
   */
  interface ValidateModelOptions extends Pick<ValidationOptions, "source"> {}

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
  type Validator<CurrentField extends DataField.Any, BaseAssignmentType> =
    | {
        validate(
          this: CurrentField,
          value: unknown,
          options: ValidateOptions<CurrentField>,
        ): value is BaseAssignmentType;
      }["validate"]
    | {
        validate(
          this: CurrentField,
          value: unknown,
          options: ValidateOptions<CurrentField>,
        ): asserts value is BaseAssignmentType;
      }["validate"]
    | {
        validate(
          this: CurrentField,
          value: unknown,
          options: ValidateOptions<CurrentField>,
        ): DataModelValidationFailure | boolean | void;
      }["validate"];

  /**
   * An interface for the options of the {@linkcode DataField} validation functions.
   * @template CurrentField - the type of the DataField, which is the receiver of the validate function
   */
  interface ValidateOptions<CurrentField extends DataField.Any> extends ValidationOptions {
    /**
     * @remarks If {@link DataField.validate | `DataField#validate`} is called with a `validate: someFunc` in its `options`,
     * it will then pass that `options` object on to that function when it calls it, without alteration.
     * Nothing in core makes use of the fact that a reference to the function is available, this seems incidental.
     */
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    validate?: Validator<CurrentField, DataField.AssignmentTypeFor<CurrentField>>;
  }

  /**
   * @remarks The `options` passed to {@link DataField.initialize | `DataField#initialize`} exclusively (in core) come from
   * {@link DataModel._initialize | `DataModel#_initialize`} or an override (meaning `parent` has been stripped from the
   * interface), and eventually hits one of:
   * 1. Document construction, in all cases with `parent` already provided
   * 2. Gets fed back {@link DataModel._initialize | `DataModel#_initialize`} or an override
   * 3. {@link Document.get | `Document.get`}, but the one place this happens, `pack` is already provided, and that's the only
   * option that method cares about.
   *
   * This extends the `Document` interface because several core fields use the `pack` property, which isn't available on the
   * `DataModel` interface
   */
  interface InitializeOptions extends Document.InitializeOptions {}

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
  constructor(...args: never);
}

/**
 * A special class of {@linkcode DataField} which defines a data schema.
 * @template Fields          - the DataSchema fields of the SchemaField
 * @template Options         - the options of the SchemaField instance
 * @template AssignmentType  - the type of the allowed assignment values of the SchemaField
 * @template InitializedType - the type of the initialized values of the SchemaField
 * @template PersistedType   - the type of the persisted values of the SchemaField
 * @remarks
 * Defaults:
 * - AssignmentType: `SchemaField.AssignmentType<Fields> | null | undefined`
 * - InitializedType: `SchemaField.InitializedType<Fields>`
 * - PersistedType: `SchemaField.PersistedType<Fields>`
 */
declare class SchemaField<
    Fields extends DataSchema,
    Options extends SchemaField.Options<Fields> = SchemaField.DefaultOptions,
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    AssignmentType = SchemaField.Internal.AssignmentType<Fields, SimpleMerge<Options, SchemaField.DefaultOptions>>,
    InitializedType = SchemaField.Internal.InitializedType<Fields, SimpleMerge<Options, SchemaField.DefaultOptions>>,
    PersistedType extends AnyObject | null | undefined = SchemaField.Internal.PersistedType<
      Fields,
      SimpleMerge<Options, SchemaField.DefaultOptions>
    >,
  >
  extends DataField<Options, AssignmentType, InitializedType, PersistedType>
  implements DataField.Internal.NestedFieldImplementation
{
  /**
   * @param fields  - The contained field definitions
   * @param options - Options which configure the behavior of the field
   * @param context - Additional context which describes the field
   */
  // Saying `fields: Fields` here causes the inference for the fields to be unnecessarily widened. This might effectively be a no-op but it fixes the inference.
  // options: not null (unchecked `in` operation in super), context: not null (destructured in super)
  constructor(fields: { [K in keyof Fields]: Fields[K] }, options?: Options, context?: DataField.ConstructionContext);

  /** @internal */
  " __fvtt_types_get_field_schema": Fields;

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

  // TODO: see if its viable to narrow keys, values, entries, has, and get's types via the schema
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
  // TODO(LukeAbby): Enabling this signatures causes a circularity but it would be ideal.
  // get<FieldName extends string>(fieldName: OverlapsWith<FieldName, keyof Fields>): SchemaField.Get<Fields, FieldName>;
  get(fieldName: string): DataField.Unknown | undefined;

  /**
   * Traverse the schema, obtaining the DataField definition for a particular field.
   * @param fieldName - A field path like ["abilities", "strength"] or "abilities.strength"
   * @returns The corresponding DataField definition for that field, or undefined
   */
  getField(fieldName: string | string[]): DataField.Unknown | undefined;
  // TODO(LukeAbby): Enabling this signatures causes a circularity but it would be ideal.
  // getField<FieldName extends SchemaField.FieldName<Fields>>(
  //   fieldName: FieldName,
  // ): SchemaField.GetField<this, Fields, FieldName>;

  protected override _getField(path: string[]): DataField.Any;

  protected override _cast(value: AssignmentType): InitializedType;

  /**
   * @remarks Ensures `options.source` is set via effectively `||= data`, then forwards to each field's `#clean`
   *
   * Deletes any keys from `value` not in the schema
   */
  // options: not null (parameter default only, property access)
  protected override _cleanType(value: InitializedType, options?: DataField.CleanOptions): InitializedType;

  // options: not null (parameter default only)
  override initialize(
    value: PersistedType,
    model: DataModel.Any,
    options?: DataField.InitializeOptions,
  ): InitializedType | (() => InitializedType | null);

  // options: not null (parameter default only, property access)
  protected override _validateType(
    value: InitializedType,
    options?: DataField.ValidateOptions<this>,
  ): boolean | DataModelValidationFailure | void;

  // options: not null (parameter default only, property access)
  protected override _validateModel(data: AnyObject, options?: DataField.ValidateModelOptions): void;

  override toObject(value: InitializedType): PersistedType;

  // options: not null (could be forwarded somewhere destructured, parameter default only)
  override apply<Options, Return>(
    fn: keyof this | ((this: this, value: AnyObject, options: Options) => Return),
    value?: AnyObject,
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
// This will be superseded once proper field treatment is applied.
declare const __SchemaFieldInitialSymbol: unique symbol;

type __SchemaFieldInitial = typeof __SchemaFieldInitialSymbol;

declare namespace SchemaField {
  /**
   * A shorthand for the options of a SchemaField class.
   * @template Fields - the DataSchema fields of the SchemaField
   */
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  type Options<Fields extends DataSchema> = DataField.Options<AssignmentData<Fields> | __SchemaFieldInitial>;

  /** Any SchemaField. */
  interface Any extends SchemaField<any, any, any, any, any> {}

  /**
   * Get the constructor type for the given DataSchema.
   * @template Fields - the DataSchema fields of the SchemaField
   */
  // Note(LukeAbby): Currently this is identical to the assignment type. The intent is to make this
  // More accurate in the future, e.g. requiring some requisite properties instead of always being
  // optional. This does mean the deprecation of `AssignmentData` is a "lie"
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  type CreateData<Fields extends DataSchema> = AssignmentData<Fields>;

  /**
   * Get the inner assignment type for the given DataSchema.
   * @template Fields - the DataSchema fields of the SchemaField
   *
   * @deprecated This type is a relic of the early days of data models. It was meant to represent
   * the types that would be valid for the expression `this.schemaProperty = ...`. Modern users will
   * recognize that the only sane thing to do here is to use `InitializedData` but when data models
   * were first being introduced there was an attempt to support a sort of strange compromise between
   * `InitializedData`, `SourceData`, and even `CreateData` for backwards compatability with existing patterns.
   *
   * You should instead use those types as appropriate.
   */
  type AssignmentData<Fields extends DataSchema> = PrettifyType<
    RemoveIndexSignatures<{
      [Key in keyof Fields]?: Fields[Key] extends EmbeddedDataField<any, any, infer AssignmentType, any, any>
        ? AssignmentType
        : Fields[Key] extends SchemaField<infer SubSchema, any, any, any, any>
          ? // FIXME(LukeAbby): This is a quick hack into AssignmentData that assumes that the `initial` of `SchemaField` is not changed from the default of `{}`
            // This will be fixed with the refactoring of the types
            // eslint-disable-next-line @typescript-eslint/no-deprecated
            EmptyObject extends AssignmentData<SubSchema>
            ? // eslint-disable-next-line @typescript-eslint/no-deprecated
              AssignmentData<SubSchema> | undefined | null
            : // eslint-disable-next-line @typescript-eslint/no-deprecated
              AssignmentData<SubSchema>
          : Fields[Key] extends DataField<any, infer AssignType, any, any>
            ? AssignType
            : never;
    }>
  >;

  /**
   * The required type of data used when updating a document.
   * @template Fields - the DataSchema fields of the SchemaField
   */
  // Note(LukeAbby): Currently this is identical to `AssignmentData` but the intent is to make it
  // more accurate in the future.
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  type UpdateData<Fields extends DataSchema> = AssignmentData<Fields>;

  /**
   * Gets the initialized version of a schema. This means a
   * @template Fields - the DataSchema fields of the SchemaField
   */
  type InitializedData<Fields extends DataSchema> = PrettifyType<
    RemoveIndexSignatures<{
      [Key in keyof Fields]: Fields[Key] extends EmbeddedDataField<infer Model, any, any, any, any>
        ? FixedInstanceType<Model>
        : Fields[Key] extends SchemaField<infer SubSchema, any, any, any, any>
          ? InitializedData<SubSchema>
          : Fields[Key] extends DataField<any, any, infer InitType, any>
            ? InitType
            : never;
    }>
  >;

  /**
   * @deprecated Replaced with {@linkcode SourceData}
   */
  type PersistedData<Fields extends DataSchema> = SourceData<Fields>;

  /**
   * Get the persisted type for the given DataSchema. This is the type used for source.
   * @template Fields - the DataSchema fields of the SchemaField
   */
  type SourceData<Fields extends DataSchema> = PrettifyType<
    RemoveIndexSignatures<{
      [Key in keyof Fields]: Fields[Key] extends EmbeddedDataField<any, any, any, any, infer PersistType>
        ? PersistType
        : Fields[Key] extends SchemaField<infer SubSchema, any, any, any, any>
          ? SourceData<SubSchema>
          : Fields[Key] extends DataField<any, any, any, infer PersistType>
            ? PersistType
            : never;
    }>
  >;

  type UpdateSourceData<Fields extends DataSchema> = PrettifyType<
    RemoveIndexSignatures<{
      [Key in keyof Fields]: Fields[Key] extends EmbeddedDataField<any, any, any, any, infer PersistType>
        ? PersistType
        : Fields[Key] extends SchemaField<infer SubSchema, any, any, any, any>
          ? SourceData<SubSchema>
          : Fields[Key] extends DataField<any, any, any, infer PersistType>
            ? PersistType
            : never;
    }>
  >;

  /** The type of the default options for the {@linkcode SchemaField} class. */
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
   * @template Fields - the DataSchema fields of the SchemaField
   * @template Opts   - the options that override the default options
   */
  type MergedOptions<Fields extends DataSchema, Opts extends Options<Fields>> = SimpleMerge<DefaultOptions, Opts>;

  // These exist for calculating the type of schema field with options.
  // This will be deleted once fields are refactored.
  // The names are also confusing. Hence these it's put into `Internal.
  namespace Internal {
    // FIXME: null or undefined should be permissible, cast as the initialized type

    /**
     * A shorthand for the assignment type of a SchemaField class.
     * @template Fields - the DataSchema fields of the SchemaField
     * @template Opts   - the options that override the default options
     *
     * @deprecated This type is a relic of the early days of data models. It was meant to represent
     * the types that would be valid for the expression `this.schemaProperty = ...`. Modern users will
     * recognize that the only sane thing to do here is to use `InitializedType` but when data models
     * were first being introduced there was an attempt to support a sort of strange compromise between
     * `InitializedType`, `SourceType`, and even `CreateType` to an extent.
     *
     * You should instead use those types as appropriate.
     */
    type AssignmentType<
      Fields extends DataSchema,
      Opts extends Options<Fields> = DefaultOptions,
      // eslint-disable-next-line @typescript-eslint/no-deprecated
    > = DataField.DerivedAssignmentType<AssignmentData<Fields>, MergedOptions<Fields, Opts>>;

    /**
     * A shorthand for the assignment type of a SchemaField class.
     * @template Fields - the DataSchema fields of the SchemaField
     * @template Opts   - the options that override the default options
     */
    type InitializedType<
      Fields extends DataSchema,
      Opts extends Options<Fields> = DefaultOptions,
    > = DataField.DerivedInitializedType<InitializedData<Fields>, MergedOptions<Fields, Opts>>;

    /**
     * A shorthand for the assignment type of a SchemaField class.
     * @template Fields - the DataSchema fields of the SchemaField
     * @template Opts   - the options that override the default options
     */
    type PersistedType<
      Fields extends DataSchema,
      Opts extends Options<Fields> = DefaultOptions,
    > = DataField.DerivedInitializedType<SourceData<Fields>, MergedOptions<Fields, Opts>>;
  }

  /**
   * This is deprecated because of likely confusion between `SchemaField.AssignmentData` and `SchemaField.AssignmentType`.
   * @deprecated Replaced with {@linkcode SchemaField.Internal.AssignmentType}
   */
  type AssignmentType<
    Fields extends DataSchema,
    Opts extends Options<Fields> = DefaultOptions,
    // eslint-disable-next-line @typescript-eslint/no-deprecated
  > = Internal.AssignmentType<Fields, Opts>;

  /**
   * This is deprecated because of likely confusion between `SchemaField.InitializedData` and `SchemaField.InitializedType`.
   * @deprecated Replaced with {@linkcode SchemaField.Internal.InitializedType}
   */
  type InitializedType<
    Fields extends DataSchema,
    Opts extends Options<Fields> = DefaultOptions,
  > = Internal.InitializedType<Fields, Opts>;

  /**
   * This is deprecated because of likely confusion between `SchemaField.PersistedData` and `SchemaField.PersistedType`.
   * @deprecated Replaced with {@linkcode SchemaField.Internal.PersistedType}
   */
  type PersistedType<Fields extends DataSchema, Opts extends Options<Fields> = DefaultOptions> = Internal.PersistedType<
    Fields,
    Opts
  >;

  /**
   * @deprecated Replaced with {@linkcode SchemaField.CreateData}
   */
  type InnerConstructorType<Fields extends DataSchema> = CreateData<Fields>;

  /**
   * @deprecated This type is a relic of the early days of data models. It was meant to represent
   * the types that would be valid for the expression `this.schemaProperty = ...`. Modern users will
   * recognize that the only sane thing to do here is to use `InitializedData` but when data models
   * were first being introduced there was an attempt to support a sort of strange compromise between
   * `InitializedData`, `SourceData`, and even `CreateData` to an extent.
   *
   * You should instead use those types as appropriate.
   */
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  type InnerAssignmentType<Fields extends DataSchema> = AssignmentData<Fields>;

  /**
   * @deprecated Replaced with {@linkcode SchemaField.InitializedData}
   */
  type InnerInitializedType<Fields extends DataSchema> = InitializedData<Fields>;

  /**
   * @deprecated Replaced with {@linkcode SchemaField.UpdateData}
   */
  type InnerUpdateData<Fields extends DataSchema> = UpdateData<Fields>;

  /**
   * @deprecated Replaced with {@linkcode SchemaField.SourceData}
   */
  type InnerPersistedType<Fields extends DataSchema> = SourceData<Fields>;

  type Get<Schema extends DataSchema, FieldName extends string> = GetKey<Schema, FieldName, undefined>;

  type FieldName<Schema extends DataSchema> = "" | [] | _FieldName<Schema>;

  /**
   * Essentially sets a field depth of 10.
   *
   * @internal
   */
  type _MaxFieldDepth = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1];

  /**
   * @internal
   */
  type _FieldName<
    Schema extends DataSchema,
    PrefixString extends string = "",
    PrefixArray extends string[] = [],
    Depth extends number[] = [],
  > = Depth extends _MaxFieldDepth
    ? never
    : ValueOf<{
        [K in keyof Schema as string extends K ? never : K]-?: K extends string
          ? _DataFieldFieldName<Schema[K], `${PrefixString}${K}`, [...PrefixArray, K], Depth>
          : never;
      }>;

  type _DataFieldFieldName<
    DataField extends DataField.Any,
    PrefixString extends string = "",
    PrefixArray extends string[] = [],
    Depth extends number[] = [],
  > =
    DataField extends DataField.Internal.NestedFieldImplementation<infer Schema>
      ? PrefixString | PrefixArray | _FieldName<Schema, `${PrefixString}.`, PrefixArray, [...Depth, 1]>
      : DataField extends DataField.Internal.ElementFieldImplementation<infer Element>
        ?
            | PrefixString
            | `${PrefixString}.element`
            | PrefixArray
            | [...PrefixArray, "element"]
            | _DataFieldFieldName<Element, `${PrefixString}.element`, [...PrefixArray, "element"], [...Depth, 1]>
        : PrefixString | PrefixArray;

  type GetField<
    CurrentField extends SchemaField.Any,
    Schema extends DataSchema,
    Path extends SchemaField.FieldName<Schema>,
  > =
    | (Path extends readonly string[] ? _GetField<CurrentField, Schema, Path> : never)
    | (Path extends string ? _GetField<CurrentField, Schema, SplitString<Path, ".">> : never);

  /** @internal */
  type _GetField<
    CurrentField extends DataField.Any,
    Schema extends DataSchema,
    Path extends readonly string[],
  > = Path extends readonly [infer Key extends string, ...infer SubKeys extends string[]]
    ? Schema[Key] extends DataField.Internal.NestedFieldImplementation<infer SubSchema>
      ? _GetField<Schema[Key], SubSchema, SubKeys>
      : Schema[Key] extends DataField.Internal.ElementFieldImplementation<infer SubField>
        ? SubKeys extends readonly ["element", ...infer Rest extends string[]]
          ? SubField extends SchemaField<infer Schema, infer _1, infer _2, infer _3, infer _4>
            ? _GetField<SubField, Schema, Rest>
            : Rest extends readonly []
              ? SubField
              : ["never0"]
          : SubKeys extends readonly []
            ? Schema[Key]
            : ["never1"]
        : SubKeys extends readonly []
          ? Schema[Key]
          : ["never2"]
    : Path extends readonly []
      ? CurrentField
      : ["never3"]; // An array like `["element"?]` or `string[]` just falls back to any
}

/**
 * A subclass of {@linkcode DataField} which deals with boolean-typed data.
 * @template Options         - the options of the BooleanField instance
 * @template AssignmentType  - the type of the allowed assignment values of the BooleanField
 * @template InitializedType - the type of the initialized values of the BooleanField
 * @template PersistedType   - the type of the persisted values of the BooleanField
 * @remarks
 * Defaults:
 * - AssignmentType: `boolean | null | undefined`
 * - InitializedType: `boolean`
 * - PersistedType: `boolean`
 * - InitialValue: `false`
 */
declare class BooleanField<
  const Options extends BooleanField.Options = BooleanField.DefaultOptions,
  // eslint-disable-next-line @typescript-eslint/no-deprecated
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

  /** @remarks `options` is unused in `BooleanField` */
  protected override _validateType(
    value: InitializedType,
    options?: DataField.ValidateOptions<this> | null,
  ): boolean | DataModelValidationFailure | void;

  protected override _toInput(config: DataField.ToInputConfig<InitializedType>): HTMLElement | HTMLCollection;

  /** @remarks Returns `value || delta`. `model` and `change` are unused in `BooleanField` */
  protected override _applyChangeAdd(
    value: InitializedType,
    delta: InitializedType,
    model: DataModel.Any,
    change: ActiveEffect.EffectChangeData,
  ): InitializedType;

  /** @remarks Returns `value && delta`. `model` and `change` are unused in `BooleanField` */
  protected override _applyChangeMultiply(
    value: InitializedType,
    delta: InitializedType,
    model: DataModel.Any,
    change: ActiveEffect.EffectChangeData,
  ): InitializedType;

  /** @remarks Returns `delta > value ? delta : value`. `model` and `change` are unused in `BooleanField` */
  protected override _applyChangeUpgrade(
    value: InitializedType,
    delta: InitializedType,
    model: DataModel.Any,
    change: ActiveEffect.EffectChangeData,
  ): InitializedType;

  /** @remarks Returns `delta < value ? delta : value`. `model` and `change` are unused in `BooleanField` */
  protected override _applyChangeDowngrade(
    value: InitializedType,
    delta: InitializedType,
    model: DataModel.Any,
    change: ActiveEffect.EffectChangeData,
  ): InitializedType;
}

declare namespace BooleanField {
  /** A shorthand for the options of a BooleanField class. */
  type Options = DataField.Options<boolean>;

  /** The type of the default options for the {@linkcode BooleanField} class. */
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
   * @template Opts - the options that override the default options
   */
  type MergedOptions<Opts extends Options> = SimpleMerge<DefaultOptions, Opts>;

  /**
   * A shorthand for the assignment type of a BooleanField class.
   * @template Opts - the options that override the default options
   *
   * @deprecated - AssignmentData is being phased out. See {@linkcode SchemaField.AssignmentData}
   * for more details.
   */
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  type AssignmentType<Opts extends Options> = DataField.DerivedAssignmentType<boolean, MergedOptions<Opts>>;

  /**
   * A shorthand for the initialized type of a BooleanField class.
   * @template Opts - the options that override the default options
   */
  type InitializedType<Opts extends Options> = DataField.DerivedInitializedType<boolean, MergedOptions<Opts>>;
}

/**
 * A subclass of {@linkcode DataField} which deals with number-typed data.
 * @template Options         - the options of the NumberField instance
 * @template AssignmentType  - the type of the allowed assignment values of the NumberField
 * @template InitializedType - the type of the initialized values of the NumberField
 * @template PersistedType   - the type of the persisted values of the NumberField
 * @remarks
 * Defaults:
 * - AssignmentType: `number | null | undefined`
 * - InitializedType: `number | null`
 * - PersistedType: `number | null`
 * - InitialValue: `null`
 */
declare class NumberField<
  const Options extends NumberField.Options = NumberField.DefaultOptions,
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  const AssignmentType = NumberField.AssignmentType<Options>,
  const InitializedType = NumberField.InitializedType<Options>,
  const PersistedType extends number | null | undefined = NumberField.InitializedType<Options>,
> extends DataField<Options, AssignmentType, InitializedType, PersistedType> {
  /**
   * @param options - Options which configure the behavior of the field
   * @param context - Additional context which describes the field
   * @remarks Changes the default of `nullable` if passed `choices`
   */
  // options: not null (unchecked `in` operation in super), context: not null (destructured in super)
  constructor(options?: Options, context?: DataField.ConstructionContext);

  /** @defaultValue `null` */
  override initial: DataField.Options.InitialType<InitializedType>;

  /**
   * @defaultValue `true`
   * @remarks If this field is created with `choices`, the default becomes `false`
   */
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

  /**
   * @remarks Applies `integer`, `min`, `max`, and `step`
   *
   * `options` is only passed to super, so effectively unused
   */
  protected override _cleanType(value: InitializedType, options?: DataField.CleanOptions | null): InitializedType;

  /** @remarks `options` is unused in `NumberField` */
  protected override _validateType(
    value: InitializedType,
    options?: DataField.ValidateOptions<this> | null,
  ): boolean | DataModelValidationFailure | void;

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

  /** @remarks Returns `value * delta`. `model` and `change` are unused in `NumberField` */
  protected override _applyChangeMultiply(
    value: InitializedType,
    delta: InitializedType,
    model: DataModel.Any,
    change: ActiveEffect.EffectChangeData,
  ): InitializedType;

  /** @remarks Returns `delta > value ? delta : value`. `model` and `change` are unused in `NumberField` */
  protected override _applyChangeUpgrade(
    value: InitializedType,
    delta: InitializedType,
    model: DataModel.Any,
    change: ActiveEffect.EffectChangeData,
  ): InitializedType;

  /** @remarks Returns `delta < value ? delta : value`. `model` and `change` are unused in `NumberField` */
  protected override _applyChangeDowngrade(
    value: InitializedType,
    delta: InitializedType,
    model: DataModel.Any,
    change: ActiveEffect.EffectChangeData,
  ): InitializedType;
}

declare namespace NumberField {
  /** The type of the default options for the {@linkcode NumberField} class. */
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

  /** The type of the default options for the {@linkcode NumberField} class when choices are provided. */
  type DefaultOptionsWhenChoicesProvided = SimpleMerge<DefaultOptions, { nullable: false }>;

  /**
   * A helper type for the given options type merged into the default options of the NumberField class.
   * @template Options - the options that override the default options
   */
  type MergedOptions<Options extends NumberField.Options> = SimpleMerge<
    undefined extends Options["choices"] ? DefaultOptions : DefaultOptionsWhenChoicesProvided,
    Options
  >;

  /**
   * A shorthand for the assignment type of a NumberField class.
   * @template Options - the options that override the default options
   *
   * @deprecated - AssignmentData is being phased out. See {@linkcode SchemaField.AssignmentData}
   * for more details.
   */
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  type AssignmentType<Options extends NumberField.Options> = DataField.DerivedAssignmentType<
    number,
    MergedOptions<Options>
  >;

  /**
   * A shorthand for the initialized type of a NumberField class.
   * @template Options - the options that override the default options
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
 * A subclass of {@linkcode DataField} which deals with string-typed data.
 * @template Options         - the options of the StringField instance
 * @template AssignmentType  - the type of the allowed assignment values of the StringField
 * @template InitializedType - the type of the initialized values of the StringField
 * @template PersistedType   - the type of the persisted values of the StringField
 * @remarks
 * Defaults:
 * - AssignmentType: `string | null | undefined`
 * - InitializedType: `string`
 * - PersistedType: `string`
 * - InitialValue: `""`
 */
declare class StringField<
  const Options extends StringField.Options<unknown> = StringField.DefaultOptions,
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  const AssignmentType = StringField.AssignmentType<Options>,
  const InitializedType = StringField.InitializedType<Options>,
  const PersistedType extends string | null | undefined = StringField.InitializedType<Options>,
> extends DataField<Options, AssignmentType, InitializedType, PersistedType> {
  /**
   * @param options - Options which configure the behavior of the field
   * @param context - Additional context which describes the field
   * @remarks If passed `choices`, changes the defaults of `nullable` and `blank`
   */
  // options: not null (unchecked `in` operation in super), context: not null (destructured in super)
  constructor(options?: Options, context?: DataField.ConstructionContext);

  /** @defaultValue `undefined` */
  override initial: DataField.Options.InitialType<InitializedType>;

  /**
   * Is the string allowed to be blank (empty)?
   * @defaultValue `true`
   * @remarks If this field is created with `choices`, the default changes to `false`
   */
  blank: boolean;

  /**
   * Should any provided string be trimmed as part of cleaning?
   * @defaultValue `true`
   */
  trim: boolean;

  /**
   * @defaultValue `false`
   * @remarks If this field is created with `choices`, the default changes to `false`
   */
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

  protected static override get _defaults(): StringField.Options<unknown>;

  // options: not null (parameter default only, property access)
  override clean(value: AssignmentType, options?: DataField.CleanOptions): InitializedType;

  protected override _cast(value: AssignmentType): InitializedType;

  protected override _validateSpecial(value: AssignmentType): boolean | void;

  /** @remarks `options` is unused in `StringField` */
  protected override _validateType(
    value: InitializedType,
    options?: DataField.ValidateOptions<this>,
  ): boolean | DataModelValidationFailure | void;

  /**
   * Test whether a provided value is a valid choice from the allowed choice set
   * @param value - The provided value
   * @returns Is the choice valid?
   *
   * @privateRemarks `#_validateType` throws if `value` is not `string` before forwarding here
   */
  protected _isValidChoice(value: string): boolean;

  /**
   * Get a record of eligible choices for the field.
   * @remarks Foundry marked `@internal`
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
  /** The type of the default options for the {@linkcode StringField} class. */
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

  interface Options<Type = string> extends DataField.Options<Type> {
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

  /** The type of the default options for the {@linkcode StringField} class when choices are provided. */
  type DefaultOptionsWhenChoicesProvided = SimpleMerge<DefaultOptions, { nullable: false; blank: false }>;

  /**
   * A helper type for the given options type merged into the default options of the StringField class.
   * @template Options - the options that override the default options
   */
  type MergedOptions<Options extends StringField.Options<unknown>> = SimpleMerge<
    _OptionsForInitial<_OptionsForChoices<Options["choices"]>>,
    Options
  >;

  type _OptionsForChoices<Choices extends StringField.Options["choices"]> = undefined extends Choices
    ? DefaultOptions
    : DefaultOptionsWhenChoicesProvided;

  // FIXME: `"initial" extends keyof Options` does not work for modeling `"initial" in options`.
  type _OptionsForInitial<Options extends StringField.Options<unknown>> = "initial" extends keyof Options
    ? Options
    : SimpleMerge<Options, { initial: _InitialForOptions<Options> }>;

  type _InitialForOptions<Options extends StringField.Options<unknown>> = Options["required"] extends false | undefined
    ? undefined
    : Options["blank"] extends true
      ? string
      : Options["nullable"] extends true
        ? null
        : undefined;

  // choices?: string[] | Record<string, string> | (() => string[] | Record<string, string>) | undefined;

  type ValidChoice<Options extends StringField.Options<unknown>> = Options["choices"] extends undefined
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
   * @template Options - the options that override the default options
   *
   * @deprecated - AssignmentData is being phased out. See {@linkcode SchemaField.AssignmentData}
   * for more details.
   */
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  type AssignmentType<Options extends StringField.Options<unknown>> = DataField.DerivedAssignmentType<
    ValidChoice<Options>,
    MergedOptions<Options>
  >;

  /**
   * A shorthand for the initialized type of a StringField class.
   * @template Options - the options that override the default options
   */
  type InitializedType<Options extends StringField.Options<unknown>> = DataField.DerivedInitializedType<
    // TODO(LukeAbby): This is a workaround for how `ValidChoice` is defined ignorant of the `StringField`/`NumberField` divide.
    ValidChoice<Options> & (string | null | undefined),
    MergedOptions<Options>
  >;

  type BaseChoices =
    | {
        readonly [K: string]: string;
      }
    | readonly string[];

  // TODO: consolidate with inline type in GetChoicesOptions if possible
  type Choices = BaseChoices | (() => BaseChoices);

  /** @internal */
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
 * A subclass of {@linkcode DataField} which deals with object-typed data.
 * @template Options         - the options of the ObjectField instance
 * @template AssignmentType  - the type of the allowed assignment values of the ObjectField
 * @template InitializedType - the type of the initialized values of the ObjectField
 * @template PersistedType   - the type of the persisted values of the ObjectField
 * @remarks
 * Defaults:
 * - AssignmentType: `object | null | undefined`
 * - InitializedType: `object`
 * - PersistedType: `object`
 * - InitialValue: `{}`
 */
declare class ObjectField<
  const Options extends DataField.Options<AnyObject> = ObjectField.DefaultOptions,
  // eslint-disable-next-line @typescript-eslint/no-deprecated
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

  override getInitialValue(data?: unknown): InitializedType;

  protected override _cast(value: AssignmentType): InitializedType;

  // options: not null (parameter default only)
  override initialize(
    value: PersistedType,
    model: DataModel.Any,
    options?: DataField.InitializeOptions,
  ): InitializedType | (() => InitializedType | null);

  override toObject(value: InitializedType): PersistedType;

  /** @remarks `options` is unused in `ObjectField` */
  // options: not null (parameter default only, despite being unused)
  protected override _validateType(
    value: InitializedType,
    options?: DataField.ValidateOptions<this>,
  ): boolean | DataModelValidationFailure | void;
}

declare namespace ObjectField {
  /** The type of the default options for the {@linkcode ObjectField} class. */
  type DefaultOptions = SimpleMerge<
    DataField.DefaultOptions,
    {
      required: true;
      nullable: false;
    }
  >;

  /**
   * A helper type for the given options type merged into the default options of the ObjectField class.
   * @template Options - the options that override the default options
   */
  type MergedOptions<Options extends DataField.Options<AnyObject>> = SimpleMerge<DefaultOptions, Options>;

  /**
   * A shorthand for the assignment type of a ObjectField class.
   * @template Options - the options that override the default options
   *
   * @deprecated - AssignmentData is being phased out. See {@linkcode SchemaField.AssignmentData}
   * for more details.
   */
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  type AssignmentType<Options extends DataField.Options<AnyObject>> = DataField.DerivedAssignmentType<
    AnyObject,
    MergedOptions<Options>
  >;

  /**
   * A shorthand for the initialized type of a ObjectField class.
   * @template Options - the options that override the default options
   */
  type InitializedType<Options extends DataField.Options<AnyObject>> = DataField.DerivedInitializedType<
    AnyObject,
    MergedOptions<Options>
  >;

  namespace FlagsField {
    /**
     * @internal
     */
    type _TwoLevelPartial<T> = {
      [K in keyof T]?: _PartialObject<T[K]>;
    };

    /**
     * @internal
     */
    type _PartialObject<T> = T extends object ? Partial<T> : T;
  }

  /**
   * A helper to create a flags object field for the given key in the {@linkcode FlagConfig}.
   * @template Key            - the key to look for in the FlagConfig
   * @template ExtensionFlags - additional flags besides the ones configured for the class
   * @template Options        - the options of the field
   */
  type FlagsField<
    Name extends Document.Type,
    // The type `{}` is useful here because in an intersection it reduces down to nothing unlike `EmptyObject`.
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    ExtensionFlags extends AnyObject = {},
    Options extends DataField.Options.Any = ObjectField.DefaultOptions,
  > = ObjectField<
    Options,
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    DataField.DerivedAssignmentType<
      // Note(LukeAbby): This is to make sure `UpdateData` etc. is partial.
      FlagsField._TwoLevelPartial<
        Document.ConfiguredFlagsForName<Name> & ExtensionFlags & InterfaceToObject<Document.CoreFlags>
      >,
      MergedOptions<Options>
    >,
    DataField.DerivedInitializedType<
      Document.ConfiguredFlagsForName<Name> & ExtensionFlags & InterfaceToObject<Document.CoreFlags>,
      MergedOptions<Options>
    >,
    DataField.DerivedInitializedType<
      Document.ConfiguredFlagsForName<Name> & ExtensionFlags & InterfaceToObject<Document.CoreFlags>,
      MergedOptions<Options>
    >
  >;
}

type ArrayFieldElement<ElementFieldType extends DataField.Any | Document.AnyConstructor> =
  ElementFieldType extends abstract new (...args: infer _1) => {
    " __fvtt_types_internal_schema": infer Schema extends DataSchema;
  }
    ? SchemaField<Schema>
    : ElementFieldType;

/**
 * A subclass of {@linkcode DataField} which deals with array-typed data.
 * @template ElementFieldType       - the field type for the elements in the ArrayField
 * @template AssignmentElementType  - the assignment type for the elements in the array
 * @template InitializedElementType - the initialized type for the elements in the array
 * @template Options                - the options of the ArrayField instance
 * @template AssignmentType         - the type of the allowed assignment values of the ArrayField
 * @template InitializedType        - the type of the initialized values of the ArrayField
 * @template PersistedElementType   - the persisted type for the elements in the array
 * @template PersistedType          - the type of the persisted values of the ArrayField
 * @remarks
 * `ArrayField` itself will not accept Document class instances, that exists on `ElementFieldType` to support
 * {@link EmbeddedCollectionField | `EmbeddedCollectionField` }
 *
 * Defaults:
 * - AssignmentType: `ArrayField.BaseAssignmentType<AssignmentElementType> | null | undefined`
 * - InitializedType: `InitializedElementType[]`
 * - PersistedType: `PersistedElementType[]`
 * - InitialValue: `[]`
 */
declare class ArrayField<
    const ElementFieldType extends DataField.Any | Document.AnyConstructor,
    const Options extends ArrayField.AnyOptions = ArrayField.DefaultOptions<
      // eslint-disable-next-line @typescript-eslint/no-deprecated
      ArrayField.AssignmentElementType<ElementFieldType>
    >,
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    const AssignmentElementType = ArrayField.AssignmentElementType<ElementFieldType>,
    const InitializedElementType = ArrayField.InitializedElementType<ElementFieldType>,
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    const AssignmentType = ArrayField.AssignmentType<AssignmentElementType, Options>,
    const InitializedType = ArrayField.InitializedType<AssignmentElementType, InitializedElementType, Options>,
    const PersistedElementType = ArrayField.PersistedElementType<ElementFieldType>,
    const PersistedType extends PersistedElementType[] | null | undefined = ArrayField.PersistedType<
      AssignmentElementType,
      PersistedElementType,
      Options
    >,
  >
  extends DataField<Options, AssignmentType, InitializedType, PersistedType>
  implements DataField.Internal.ElementFieldImplementation
{
  /**
   * @param element - A DataField instance which defines the type of element contained in the Array.
   * @param options - Options which configure the behavior of the field
   * @param context - Additional context which describes the field
   * @throws If provided a `max` that is lower than `min` (default `0`)
   */
  // options: not null (unchecked `in` operation in super), context: not null (destructured in super)
  constructor(element: ElementFieldType, options?: Options, context?: DataField.ConstructionContext);

  /** @internal */
  " __fvtt_types_get_field_element": ArrayFieldElement<ElementFieldType>;

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
    // eslint-disable-next-line @typescript-eslint/no-deprecated
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

  // options: not null (could be destructured in element#_validateModel)
  protected override _validateModel(data: AnyObject, options?: DataField.ValidateModelOptions): void;

  protected override _cast(value: AssignmentType): InitializedType;

  /**
   * @remarks `options` gets its `partial` property forced `false`, then each element gets run through its field's `#clean`
   * @privateRemarks `null` is allowed for `options` as it gets spread, and `...null` doesn't error
   */
  protected override _cleanType(value: InitializedType, options?: DataField.CleanOptions | null): InitializedType;

  // options: not null (parameter default only)
  protected override _validateType(
    value: InitializedType,
    options?: DataField.ValidateOptions<this>,
  ): boolean | DataModelValidationFailure | void;

  /**
   * Validate every element of the ArrayField
   * @param value   - The array to validate
   * @param options - Validation options
   * @returns An array of element-specific errors
   */
  protected _validateElements(
    value: AnyArray,
    options?: DataField.ValidateOptions<this> | null,
  ): DataModelValidationFailure | void;

  /**
   * Validate a single element of the ArrayField.
   * @param value   - The value of the array element
   * @param options - Validation options
   * @returns A validation failure if the element failed validation
   */
  protected _validateElement(
    value: unknown,
    options: DataField.ValidateOptions<this>,
  ): DataModelValidationFailure | void;

  // options: not null (parameter default only)
  override initialize(
    value: PersistedType,
    model: DataModel.Any,
    options?: DataField.InitializeOptions,
  ): InitializedType | (() => InitializedType | null);

  override toObject(value: InitializedType): PersistedType;

  // TODO: Limit to the keys of `this` that are actually callable.
  // options: not null (could be forwarded somewhere destructured, parameter default only)
  override apply<Options, Return>(
    fn: keyof this | ((this: this, value: AnyArray, options: Options) => Return),
    value?: AnyArray,
    options?: Options,
  ): Return;

  protected override _getField(path: string[]): DataField.Any;

  /**
   * Migrate this field's candidate source data.
   * @param sourceData - Candidate source data of the root model
   * @param fieldData  - The value of this field within the source data
   */
  migrateSource(sourceData: AnyObject, fieldData: unknown): unknown;

  protected override _castChangeDelta(delta: string): InitializedType;

  /** @remarks Returns `value` with `delta` `push`ed. `model` and `change` are unused in `ArrayField` */
  protected override _applyChangeAdd(
    value: InitializedType,
    delta: InitializedType,
    model: DataModel.Any,
    change: ActiveEffect.EffectChangeData,
  ): InitializedType;
}

declare namespace ArrayField {
  /**
   * A shorthand for the options of an ArrayField class.
   * @template AssignmentElementType - the assignment type of the elements in the array
   */
  type Options<AssignmentElementType> = DataField.Options<BaseAssignmentType<AssignmentElementType>>;

  type AnyOptions = Options<unknown>;

  /**
   * The base assignment type for the {@linkcode ArrayField} class.
   * @template AssignmentElementType - the assignment type of the elements in the array
   */
  type BaseAssignmentType<AssignmentElementType> =
    | Record<number | string, AssignmentElementType>
    | Iterable<AssignmentElementType>
    | AssignmentElementType[]
    | AssignmentElementType;

  /**
   * The type of the default options for the {@linkcode ArrayField} class.
   * @template AssignmentElementType - the assignment type of the elements in the array
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
   * @template AssignmentElementType - the assignment type of the elements of the ArrayField
   * @template Opts                  - the options that override the default options
   */
  type MergedOptions<AssignmentElementType, Opts extends AnyOptions> = SimpleMerge<
    DefaultOptions<AssignmentElementType>,
    Opts
  >;

  /**
   * A type to infer the assignment element type of an ArrayField from its ElementFieldType.
   * @template ElementFieldType - the DataField type of the elements in the ArrayField
   *
   * @deprecated - AssignmentData is being phased out. See {@linkcode SchemaField.AssignmentData}
   * for more details.
   */
  type AssignmentElementType<ElementFieldType extends DataField.Any | Document.AnyConstructor> =
    ElementFieldType extends
      | (abstract new (...args: infer _1) => { " __fvtt_types_internal_assignment_data": infer AssignmentData })
      | { " __fvtt_types_internal_assignment_data": infer AssignmentData }
      ? AssignmentData
      : never;

  /**
   * A type to infer the initialized element type of an ArrayField from its ElementFieldType.
   * @template ElementFieldType - the DataField type of the elements in the ArrayField
   */
  type InitializedElementType<ElementFieldType extends DataField.Any | Document.AnyConstructor> =
    ElementFieldType extends
      | (abstract new (...args: infer _1) => { " __fvtt_types_internal_initialized_data": infer InitializedData })
      | { " __fvtt_types_internal_initialized_data": infer InitializedData }
      ? InitializedData
      : never;

  /**
   * A type to infer the initialized element type of an ArrayField from its ElementFieldType.
   * @template ElementFieldType - the DataField type of the elements in the ArrayField
   */
  type PersistedElementType<ElementFieldType extends DataField.Any | Document.AnyConstructor> =
    ElementFieldType extends
      | (abstract new (...args: infer _1) => { " __fvtt_types_internal_source_data": infer PersistedData })
      | { " __fvtt_types_internal_source_data": infer PersistedData }
      ? PersistedData
      : never;

  /**
   * A shorthand for the assignment type of an ArrayField class.
   * @template AssignmentElementType - the assignment type of the elements of the ArrayField
   * @template Opts                  - the options that override the default options
   *
   * @deprecated - AssignmentData is being phased out. See {@linkcode SchemaField.AssignmentData}
   * for more details.
   */
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  type AssignmentType<AssignmentElementType, Opts extends AnyOptions> = DataField.DerivedAssignmentType<
    BaseAssignmentType<AssignmentElementType>,
    MergedOptions<AssignmentElementType, Opts>
  >;

  /**
   * A shorthand for the initialized type of an ArrayField class.
   * @template AssignmentElementType  - the assignment type of the elements of the ArrayField
   * @template InitializedElementType - the initialized type of the elements of the ArrayField
   * @template Opts                   - the options that override the default options
   */
  type InitializedType<
    AssignmentElementType,
    InitializedElementType,
    Opts extends AnyOptions,
  > = DataField.DerivedInitializedType<InitializedElementType[], MergedOptions<AssignmentElementType, Opts>>;

  /**
   * A shorthand for the persisted type of an ArrayField class.
   * @template AssignmentElementType - the assignment type of the elements of the ArrayField
   * @template PersistedElementType  - the persisted type of the elements of the ArrayField
   * @template Opts                  - the options that override the default options
   */
  type PersistedType<
    AssignmentElementType,
    PersistedElementType,
    Opts extends AnyOptions,
  > = DataField.DerivedInitializedType<PersistedElementType[], MergedOptions<AssignmentElementType, Opts>>;
}

/**
 * A subclass of {@linkcode ArrayField} which supports a set of contained elements.
 * Elements in this set are treated as fungible and may be represented in any order or discarded if invalid.
 * @template ElementFieldType       - the field type for the elements in the SetField
 * @template AssignmentElementType  - the assignment type for the elements in the set
 * @template InitializedElementType - the initialized type for the elements in the set
 * @template Options                - the options of the SetField instance
 * @template AssignmentType         - the type of the allowed assignment values of the SetField
 * @template InitializedType        - the type of the initialized values of the SetField
 * @template PersistedElementType   - the persisted type for the elements in the set
 * @template PersistedType          - the type of the persisted values of the SetField
 * @remarks
 * Defaults:
 * - AssignmentType: `SetField.BaseAssignmentType<AssignmentElementType> | null | undefined`
 * - InitializedType: `Set<InitializedElementType>`
 * - PersistedType: `PersistedElementType[]`
 * - InitialValue: `new Set()`
 */
declare class SetField<
  ElementFieldType extends DataField.Any,
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  Options extends SetField.AnyOptions = SetField.DefaultOptions<ArrayField.AssignmentElementType<ElementFieldType>>,
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  AssignmentElementType = ArrayField.AssignmentElementType<ElementFieldType>,
  InitializedElementType = ArrayField.InitializedElementType<ElementFieldType>,
  // eslint-disable-next-line @typescript-eslint/no-deprecated
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
  // options: required (property access with no default)
  protected override _validateElements(
    value: any[],
    options: DataField.ValidateOptions<this>,
  ): void | DataModelValidationFailure;

  // options: not null (parameter default only)
  override initialize(
    value: PersistedType,
    model: DataModel.Any,
    options?: DataField.InitializeOptions,
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

  protected override _castChangeDelta(delta: string): InitializedType;

  /**
   * @remarks Returns `value` with each element of `delta` `add`ed in order.
   * `model` and `change` are unused in `SetField`
   */
  protected override _applyChangeAdd(
    value: InitializedType,
    delta: InitializedType,
    model: DataModel.Any,
    change: ActiveEffect.EffectChangeData,
  ): InitializedType;
}

declare namespace SetField {
  /** Any SetField */
  interface Any extends SetField<DataField.Any, any, any, any, any, any, any, any> {}

  /**
   * A shorthand for the options of a SetField class.
   * @template AssignmentElementType - the assignment type of the elements in the array
   */
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  type Options<AssignmentElementType> = DataField.Options<SetField.BaseAssignmentType<AssignmentElementType>>;

  type AnyOptions = Options<unknown>;

  /**
   * The base assignment type for the {@linkcode SetField} class.
   * @template AssignmentElementType - the assignment type of the elements in the array
   *
   * @deprecated - Assignment type is being deprecated.
   */
  type BaseAssignmentType<AssignmentElementType> = ArrayField.BaseAssignmentType<AssignmentElementType>;

  /**
   * The type of the default options for the {@linkcode SetField} class.
   * @template AssignmentElementType - the assignment type of the elements in the array
   */
  type DefaultOptions<AssignmentElementType> = ArrayField.DefaultOptions<AssignmentElementType>;

  /**
   * A helper type for the given options type merged into the default options of the SetField class.
   * @template AssignmentElementType - the assignment type of the elements of the SetField
   * @template Opts                  - the options that override the default options
   */
  type MergedOptions<AssignmentElementType, Opts extends AnyOptions> = SimpleMerge<
    DefaultOptions<AssignmentElementType>,
    Opts
  >;

  /**
   * A shorthand for the assignment type of a SetField class.
   * @template AssignmentElementType - the assignment type of the elements of the SetField
   * @template Opts                  - the options that override the default options
   *
   * @deprecated - AssignmentData is being phased out. See {@linkcode SchemaField.AssignmentData}
   * for more details.
   */
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  type AssignmentType<AssignmentElementType, Opts extends AnyOptions> = DataField.DerivedAssignmentType<
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    BaseAssignmentType<AssignmentElementType>,
    MergedOptions<AssignmentElementType, Opts>
  >;

  /**
   * A shorthand for the initialized type of a SetField class.
   * @template AssignmentElementType - the assignment type of the elements of the SetField
   * @template InitializedElementType - the initialized type of the elements of the SetField
   * @template Opts                  - the options that override the default options
   */
  type InitializedType<
    AssignmentElementType,
    InitializedElementType,
    Opts extends AnyOptions,
  > = DataField.DerivedInitializedType<Set<InitializedElementType>, MergedOptions<AssignmentElementType, Opts>>;

  /**
   * A shorthand for the persisted type of a SetField class.
   * @template AssignmentElementType - the assignment type of the elements of the SetField
   * @template PersistedElementType  - the persisted type of the elements of the SetField
   * @template Opts                  - the options that override the default options
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
 * A subclass of {@linkcode ObjectField} which embeds some other DataModel definition as an inner object.
 * @template ModelType       - the DataModel for the embedded data
 * @template Options         - the options of the EmbeddedDataField instance
 * @template AssignmentType  - the type of the allowed assignment values of the EmbeddedDataField
 * @template InitializedType - the type of the initialized values of the EmbeddedDataField
 * @template PersistedType   - the type of the persisted values of the EmbeddedDataField
 * @remarks
 * Defaults:
 * - AssignmentType: `SchemaField.AssignmentType<ModelType["schema"]["fields"]> | null | undefined`
 * - InitializedType: `SchemaField.InitializedType<ModelType["schema"]["fields"]>`
 * - PersistedType: `SchemaField.PersistedType<ModelType["schema"]["fields"]>`
 * - InitialValue: `{}`
 */
declare class EmbeddedDataField<
  const ModelType extends DataModel.AnyConstructor,
  const Options extends EmbeddedDataField.Options<ModelType> = EmbeddedDataField.DefaultOptions,
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  const AssignmentType = EmbeddedDataField.AssignmentType<ModelType, Options>,
  const InitializedType = EmbeddedDataField.InitializedType<ModelType, Options>,
  const PersistedType extends AnyObject | null | undefined = EmbeddedDataField.PersistedType<ModelType, Options>,
> extends SchemaField<DataModel.SchemaOfClass<ModelType>, Options, AssignmentType, InitializedType, PersistedType> {
  /**
   * @param model   - The class of DataModel which should be embedded in this field
   * @param options - Options which configure the behavior of the field
   * @param context - Additional context which describes the field
   */
  // options: not null (unchecked `in` operation in super), context: not null (destructured in super)
  constructor(model: ModelType, options?: Options, context?: DataField.ConstructionContext);

  /**
   * The embedded DataModel definition which is contained in this field.
   */
  model: ModelType;

  /** @remarks Passed `options.source` will be ignored, forwarded to super with `source: value` */
  // options: not null (parameter default only, property access)
  override clean(value: AssignmentType, options?: DataField.CleanOptions): InitializedType;

  /** @remarks Forwards to super with `options.source: value` */
  // options: not null (parameter default only, property access)
  override validate(
    value: AssignmentType,
    options?: DataField.ValidateOptions<this>,
  ): DataModelValidationFailure | void;

  // options: not null (parameter default only)
  override initialize(
    value: PersistedType,
    model: DataModel.Any,
    options?: DataField.InitializeOptions,
  ): InitializedType | (() => InitializedType | null);

  override toObject(value: InitializedType): PersistedType;

  /**
   * Migrate this field's candidate source data.
   * @param sourceData - Candidate source data of the root model
   * @param fieldData  - The value of this field within the source data
   */
  migrateSource(sourceData: AnyObject, fieldData: unknown): unknown;

  protected override _validateModel(data: AnyObject, options?: DataField.ValidateModelOptions | null): void;
}

declare namespace EmbeddedDataField {
  /**
   * A shorthand for the options of an EmbeddedDataField class.
   * @template ModelType - the DataModel for the embedded data
   */
  type Options<ModelType extends DataModel.AnyConstructor> = DataField.Options<
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    SchemaField.AssignmentData<DataModel.SchemaOfClass<ModelType>> | __SchemaFieldInitial
  >;

  /** The type of the default options for the {@linkcode EmbeddedDataField} class. */
  type DefaultOptions = SchemaField.DefaultOptions;

  /**
   * A helper type for the given options type merged into the default options of the EmbeddedDataField class.
   * @template ModelType - the DataModel for the embedded data
   * @template Opts      - the options that override the default options
   */
  type MergedOptions<ModelType extends DataModel.AnyConstructor, Opts extends Options<ModelType>> = SimpleMerge<
    DefaultOptions,
    Opts
  >;

  /**
   * A shorthand for the assignment type of an EmbeddedDataField class.
   * @template ModelType - the DataModel for the embedded data
   * @template Opts      - the options that override the default options
   *
   * @deprecated - AssignmentType is being deprecated. See {@linkcode SchemaField.AssignmentData}
   * for more details.
   */
  type AssignmentType<
    ModelType extends DataModel.AnyConstructor,
    Opts extends Options<ModelType>,
    // eslint-disable-next-line @typescript-eslint/no-deprecated
  > = DataField.DerivedAssignmentType<
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    SchemaField.AssignmentData<DataModel.SchemaOfClass<ModelType>>,
    MergedOptions<ModelType, Opts>
  >;

  /**
   * A shorthand for the initialized type of an EmbeddedDataField class.
   * @template ModelType - the DataModel for the embedded data
   * @template Opts      - the options that override the default options
   */
  // FIXME: Schema is unsure in src/foundry/common/data/data.d.mts
  type InitializedType<
    ModelType extends DataModel.AnyConstructor,
    Opts extends Options<ModelType>,
  > = DataField.DerivedInitializedType<FixedInstanceType<ModelType>, MergedOptions<ModelType, Opts>>;

  /**
   * A shorthand for the persisted type of an EmbeddedDataField class.
   * @template ModelType - the DataModel for the embedded data
   * @template Opts      - the options that override the default options
   */
  type PersistedType<
    ModelType extends DataModel.AnyConstructor,
    Opts extends Options<ModelType>,
  > = DataField.DerivedInitializedType<
    SchemaField.SourceData<DataModel.SchemaOfClass<ModelType>>,
    MergedOptions<ModelType, Opts>
  >;
}

/**
 * A subclass of {@linkcode ArrayField} which supports an embedded Document collection.
 * Invalid elements will be dropped from the collection during validation rather than failing for the field entirely.
 * @template ElementFieldType       - the field type for the elements in the EmbeddedCollectionField
 * @template AssignmentElementType  - the assignment type for the elements in the collection
 * @template InitializedElementType - the initialized type for the elements in the collection
 * @template Options                - the options of the EmbeddedCollectionField instance
 * @template AssignmentType         - the type of the allowed assignment values of the EmbeddedCollectionField
 * @template InitializedType        - the type of the initialized values of the EmbeddedCollectionField
 * @template PersistedElementType   - the persisted type for the elements in the collection
 * @template PersistedType          - the type of the persisted values of the EmbeddedCollectionField
 * @remarks
 * Defaults:
 * - AssignmentType: `ArrayField.BaseAssignmentType<AssignmentElementType> | null | undefined`
 * - InitializedType: `Collection<InitializedElementType>`
 * - PersistedType: `PersistedElementType[]`
 * - InitialValue: `[]`
 */
declare class EmbeddedCollectionField<
  ElementFieldType extends Document.AnyConstructor,
  // TODO(LukeAbby): See if `ParentDataModel` can be made redundant by automatically inferring.
  ParentDataModel extends Document.Any,
  Options extends EmbeddedCollectionField.Options<any> = EmbeddedCollectionField.DefaultOptions<
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    EmbeddedCollectionField.AssignmentElementType<ElementFieldType>
  >,
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  AssignmentElementType = EmbeddedCollectionField.AssignmentElementType<ElementFieldType>,
  InitializedElementType extends Document.Any = EmbeddedCollectionField.InitializedElementType<ElementFieldType>,
  // eslint-disable-next-line @typescript-eslint/no-deprecated
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
   * @param context - Additional context which describes the field
   * @remarks Forces `readonly: true`, regardless of passed value
   */
  // options: not null (unchecked `in` operation in super), context: not null (destructured in super)
  constructor(element: ElementFieldType, options?: Options, context?: DataField.ConstructionContext);

  /**
   * @defaultValue `true`
   * @remarks Enforced by the constructor
   */
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

  protected override _cast(value: AssignmentType): InitializedType;

  /**
   * @remarks Calls the Collection's Document's Implementation's `schema.clean` on every entry in `value`,
   * with `options.source` set to that entry
   * @privateRemarks `null` is allowed for `options` as it gets spread, and `...null` doesn't error
   */
  protected override _cleanType(value: InitializedType, options?: DataField.CleanOptions | null): InitializedType;

  // options: required (property access with no default)
  protected override _validateElements(
    value: any[],
    options: DataField.ValidateOptions<this>,
  ): DataModelValidationFailure | void;

  // options: not null (parameter default only)
  override initialize(
    value: PersistedType,
    model: DataModel.Any,
    options?: DataField.InitializeOptions,
  ): InitializedType | (() => InitializedType | null);

  override toObject(value: InitializedType): PersistedType;

  // TODO: Find a way to limit `Value` to `AnyObject | undefined` here while allowing it to be `unknown` in DataField
  // options: not null (could be forwarded somewhere destructured, parameter default only)
  override apply<Value, Options, Return>(
    fn: keyof this | ((this: this, value: Value, options: Options) => Return),
    value?: Value,
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
  interface Any extends EmbeddedCollectionField<any, any, any, any, any, any, any, any, any> {}

  /**
   * A shorthand for the options of an EmbeddedCollectionField class.
   * @template AssignmentElementType - the assignment type of the elements of the EmbeddedCollectionField
   */
  type Options<AssignmentElementType> = DataField.Options<ArrayField.BaseAssignmentType<AssignmentElementType>>;

  /**
   * The type of the default options for the {@linkcode EmbeddedCollectionField} class.
   * @template AssignmentElementType - the assignment type of the elements of the EmbeddedCollectionField
   */
  type DefaultOptions<AssignmentElementType> = ArrayField.DefaultOptions<AssignmentElementType>;

  /**
   * A helper type for the given options type merged into the default options of the EmbeddedCollectionField class.
   * @template AssignmentElementType - the assignment type of the elements of the EmbeddedCollectionField
   * @template Opts                  - the options that override the default options
   */
  type MergedOptions<AssignmentElementType, Opts extends Options<AssignmentElementType>> = SimpleMerge<
    DefaultOptions<AssignmentElementType>,
    Opts
  >;

  /**
   * A type to infer the assignment element type of an EmbeddedCollectionField from its ElementFieldType.
   * @template ElementFieldType - the DataField type of the elements in the EmbeddedCollectionField
   *
   * @deprecated - AssignmentType is being deprecated. See {@linkcode SchemaField.AssignmentData}
   * for more details.
   */
  // Note(LukeAbby): For some reason checking `extends Document` causes issues where this doesn't.
  type AssignmentElementType<ElementFieldType extends Document.AnyConstructor> = ElementFieldType extends abstract new (
    ...args: infer _1
  ) => { " __fvtt_types_internal_assignment_data": infer AssignmentData }
    ? AssignmentData
    : never;

  /**
   * A type to infer the initialized element type of an EmbeddedCollectionField from its ElementFieldType.
   * @template ElementFieldType - the DataField type of the elements in the EmbeddedCollectionField
   */
  type InitializedElementType<ElementFieldType extends Document.AnyConstructor> =
    Document.ToConfiguredInstance<ElementFieldType>;

  /**
   * A type to infer the initialized element type of an EmbeddedCollectionField from its ElementFieldType.
   * @template ElementFieldType - the DataField type of the elements in the EmbeddedCollectionField
   */
  // Note(LukeAbby): For some reason checking `extends Document` causes issues where this doesn't.
  type PersistedElementType<ElementFieldType extends Document.AnyConstructor> = ElementFieldType extends abstract new (
    ...args: infer _1
  ) => { " __fvtt_types_internal_source_data": infer AssignmentData }
    ? AssignmentData
    : never;

  /**
   * A shorthand for the assignment type of an ArrayField class.
   * @template AssignmentElementType - the assignment type of the elements of the EmbeddedCollectionField
   * @template Opts                  - the options that override the default options
   *
   * @deprecated - AssignmentType is being deprecated. See {@linkcode SchemaField.AssignmentData}
   * for more details.
   */
  type AssignmentType<
    AssignmentElementType,
    Opts extends Options<AssignmentElementType>,
    // eslint-disable-next-line @typescript-eslint/no-deprecated
  > = DataField.DerivedAssignmentType<
    ArrayField.BaseAssignmentType<AssignmentElementType>,
    MergedOptions<AssignmentElementType, Opts>
  >;

  /**
   * A shorthand for the initialized type of an ArrayField class.
   * @template AssignmentElementType  - the assignment type of the elements of the EmbeddedCollectionField
   * @template InitializedElementType - the initialized type of the elements of the EmbeddedCollectionField
   * @template Opts                   - the options that override the default options
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
   * @template AssignmentElementType - the assignment type of the elements of the EmbeddedCollectionField
   * @template PersistedElementType  - the persisted type of the elements of the EmbeddedCollectionField
   * @template Opts                  - the options that override the default options
   */
  type PersistedType<
    AssignmentElementType,
    PersistedElementType,
    Opts extends Options<AssignmentElementType>,
  > = DataField.DerivedInitializedType<PersistedElementType[], MergedOptions<AssignmentElementType, Opts>>;
}

/**
 * A subclass of {@linkcode EmbeddedCollectionField} which manages a collection of delta objects relative to another
 * collection.
 * @template ElementFieldType       - the field type for the elements in the EmbeddedCollectionDeltaField
 * @template AssignmentElementType  - the assignment type for the elements in the collection
 * @template InitializedElementType - the initialized type for the elements in the collection
 * @template Options                - the options of the EmbeddedCollectionDeltaField instance
 * @template AssignmentType         - the type of the allowed assignment values of the EmbeddedCollectionDeltaField
 * @template InitializedType        - the type of the initialized values of the EmbeddedCollectionDeltaField
 * @template PersistedElementType   - the persisted type for the elements in the collection
 * @template PersistedType          - the type of the persisted values of the EmbeddedCollectionDeltaField
 * @remarks
 * Defaults:
 * - AssignmentType: `ArrayField.BaseAssignmentType<AssignmentElementType> | null | undefined`
 * - InitializedType: `Collection<InitializedElementType>`
 * - PersistedType: `PersistedElementType[]`
 * - InitialValue: `[]`
 */
declare class EmbeddedCollectionDeltaField<
  ElementFieldType extends Document.AnyConstructor,
  ParentDataModel extends Document.Any,
  Options extends EmbeddedCollectionDeltaField.Options<any> = EmbeddedCollectionDeltaField.DefaultOptions<
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    EmbeddedCollectionDeltaField.AssignmentElementType<ElementFieldType>
  >,
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  AssignmentElementType = EmbeddedCollectionDeltaField.AssignmentElementType<ElementFieldType>,
  InitializedElementType extends Document.Any = EmbeddedCollectionDeltaField.InitializedElementType<ElementFieldType>,
  // eslint-disable-next-line @typescript-eslint/no-deprecated
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

  /**
   * @remarks Calls the Collection's Document's Implementation's `schema.clean` on every entry in `value`,
   * with `options.source` set to that entry, and some special handling for Tombstone data
   * @privateRemarks `null` is allowed for `options` as it gets spread, and `...null` doesn't error
   */
  protected override _cleanType(value: InitializedType, options?: DataField.CleanOptions | null): InitializedType;

  // options: required (property access with no default)
  protected override _validateElements(
    value: any[],
    options: DataField.ValidateOptions<this>,
  ): void | DataModelValidationFailure;
}

declare namespace EmbeddedCollectionDeltaField {
  /**
   * A shorthand for the options of an EmbeddedCollectionDeltaField class.
   * @template AssignmentElementType - the assignment type of the elements of the EmbeddedCollectionDeltaField
   */
  type Options<AssignmentElementType> = DataField.Options<ArrayField.BaseAssignmentType<AssignmentElementType>>;

  /**
   * The type of the default options for the {@linkcode EmbeddedCollectionDeltaField} class.
   * @template AssignmentElementType - the assignment type of the elements of the EmbeddedCollectionDeltaField
   */
  type DefaultOptions<AssignmentElementType> = ArrayField.DefaultOptions<AssignmentElementType>;

  /**
   * A helper type for the given options type merged into the default options of the EmbeddedCollectionDeltaField class.
   * @template AssignmentElementType - the assignment type of the elements of the EmbeddedCollectionDeltaField
   * @template Opts                  - the options that override the default options
   */
  type MergedOptions<AssignmentElementType, Opts extends Options<AssignmentElementType>> = SimpleMerge<
    DefaultOptions<AssignmentElementType>,
    Opts
  >;

  /**
   * A type to infer the assignment element type of an EmbeddedCollectionDeltaField from its ElementFieldType.
   * @template ElementFieldType - the DataField type of the elements in the EmbeddedCollectionDeltaField
   *
   * @deprecated - AssignmentType is being deprecated. See {@linkcode SchemaField.AssignmentData}
   * for more details.
   */
  type AssignmentElementType<ElementFieldType extends Document.AnyConstructor> = ElementFieldType extends abstract new (
    ...args: infer _1
  ) => { " __fvtt_types_internal_assignment_data": infer AssignmentData }
    ? AssignmentData
    : never;

  /**
   * A type to infer the initialized element type of an EmbeddedCollectionDeltaField from its ElementFieldType.
   * @template ElementFieldType - the DataField type of the elements in the EmbeddedCollectionDeltaField
   */
  type InitializedElementType<ElementFieldType extends Document.AnyConstructor> =
    Document.ToConfiguredInstance<ElementFieldType>;

  /**
   * A type to infer the initialized element type of an EmbeddedCollectionDeltaField from its ElementFieldType.
   * @template ElementFieldType - the DataField type of the elements in the EmbeddedCollectionDeltaField
   */
  // Note(LukeAbby): For some reason checking `extends Document` causes issues where `extends DataModel` doesn't.
  type PersistedElementType<ElementFieldType extends Document.AnyConstructor> = ElementFieldType extends abstract new (
    ...args: infer _1
  ) => { " __fvtt_types_internal_source_data": infer AssignmentData }
    ? AssignmentData
    : never;

  /**
   * A shorthand for the assignment type of an ArrayField class.
   * @template AssignmentElementType - the assignment type of the elements of the EmbeddedCollectionDeltaField
   * @template Opts                  - the options that override the default options
   *
   * @deprecated - AssignmentType is being deprecated. See {@linkcode SchemaField.AssignmentData}
   * for more details.
   */
  type AssignmentType<
    AssignmentElementType,
    Opts extends Options<AssignmentElementType>,
    // eslint-disable-next-line @typescript-eslint/no-deprecated
  > = DataField.DerivedAssignmentType<
    ArrayField.BaseAssignmentType<AssignmentElementType>,
    MergedOptions<AssignmentElementType, Opts>
  >;

  /**
   * A shorthand for the initialized type of an ArrayField class.
   * @template AssignmentElementType  - the assignment type of the elements of the EmbeddedCollectionDeltaField
   * @template InitializedElementType - the initialized type of the elements of the EmbeddedCollectionDeltaField
   * @template Opts                   - the options that override the default options
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
   * @template AssignmentElementType - the assignment type of the elements of the EmbeddedCollectionDeltaField
   * @template PersistedElementType  - the persisted type of the elements of the EmbeddedCollectionDeltaField
   * @template Opts                  - the options that override the default options
   */
  type PersistedType<
    AssignmentElementType,
    PersistedElementType,
    Opts extends Options<AssignmentElementType>,
  > = DataField.DerivedInitializedType<PersistedElementType[], MergedOptions<AssignmentElementType, Opts>>;
}

/**
 * A subclass of {@linkcode EmbeddedDataField} which supports a single embedded Document.
 * @template DocumentType    - the type of the embedded Document
 * @template Options         - the options of the EmbeddedDocumentField instance
 * @template AssignmentType  - the type of the allowed assignment values of the EmbeddedDocumentField
 * @template InitializedType - the type of the initialized values of the EmbeddedDocumentField
 * @template PersistedType   - the type of the persisted values of the EmbeddedDocumentField
 * @remarks
 * Defaults:
 * - AssignmentType: `SchemaField.AssignmentType<DocumentType["schema"]["fields"]> | null | undefined`
 * - InitializedType: `SchemaField.InitializedType<DocumentType["schema"]["fields"]> | null`
 * - PersistedType: `SchemaField.PersistedType<DocumentType["schema"]["fields"]> | null`
 * - InitialValue: `{}`
 */
declare class EmbeddedDocumentField<
  const DocumentType extends Document.AnyConstructor,
  const Options extends EmbeddedDocumentField.Options<DocumentType> = EmbeddedDocumentField.DefaultOptions,
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  const AssignmentType = EmbeddedDocumentField.AssignmentType<DocumentType, Options>,
  const InitializedType = EmbeddedDocumentField.InitializedType<DocumentType, Options>,
  const PersistedType extends AnyObject | null | undefined = EmbeddedDocumentField.PersistedType<DocumentType, Options>,
> extends EmbeddedDataField<DocumentType, Options, AssignmentType, InitializedType, PersistedType> {
  /**
   * @param model   - The type of Document which is embedded.
   * @param options - Options which configure the behavior of the field.
   * @param context - Additional context which describes the field
   */
  // options: not null (unchecked `in` operation in super), context: not null (destructured in super)
  constructor(model: DocumentType, options?: Options, context?: DataField.ConstructionContext);

  /** @defaultValue `true` */
  override nullable: boolean;

  protected static override get _defaults(): EmbeddedDocumentField.Options<Document.AnyConstructor>;

  /** @defaultValue `true` */
  static override hierarchical: boolean;

  // options: not null (parameter default only)
  override initialize(
    value: PersistedType,
    model: DataModel.Any,
    options?: DataField.InitializeOptions,
  ): InitializedType | (() => InitializedType | null);

  /**
   * Return the embedded document(s) as a Collection.
   * @param parent - The parent document.
   */
  getCollection<P extends Document.Any>(parent: P): Collection<P>;
}

declare namespace EmbeddedDocumentField {
  interface Any extends EmbeddedDocumentField<any, any, any, any, any> {}

  /**
   * A shorthand for the options of an EmbeddedDocumentField class.
   * @template DocumentType - the type of the embedded Document
   */
  type Options<DocumentType extends Document.AnyConstructor> = DataField.Options<
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    SchemaField.AssignmentData<DataModel.SchemaOfClass<DocumentType>> | __SchemaFieldInitial
  >;

  /** The type of the default options for the {@linkcode EmbeddedDocumentField} class. */
  type DefaultOptions = SimpleMerge<
    EmbeddedDataField.DefaultOptions,
    {
      nullable: true;
    }
  >;

  /**
   * A helper type for the given options type merged into the default options of the EmbeddedDocumentField class.
   * @template DocumentType - the type of the embedded Document
   * @template Opts         - the options that override the default options
   */
  type MergedOptions<DocumentType extends Document.AnyConstructor, Opts extends Options<DocumentType>> = SimpleMerge<
    DefaultOptions,
    Opts
  >;

  /**
   * A shorthand for the assignment type of an EmbeddedDocumentField class.
   * @template DocumentType - the type of the embedded Document
   * @template Opts         - the options that override the default options
   *
   * @deprecated - AssignmentType is being deprecated. See {@linkcode SchemaField.AssignmentData}
   * for more details.
   */
  type AssignmentType<
    DocumentType extends Document.AnyConstructor,
    Opts extends Options<DocumentType>,
    // eslint-disable-next-line @typescript-eslint/no-deprecated
  > = DataField.DerivedAssignmentType<
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    SchemaField.AssignmentData<DataModel.SchemaOfClass<DocumentType>>,
    MergedOptions<DocumentType, Opts>
  >;

  /**
   * A shorthand for the initialized type of an EmbeddedDocumentField class.
   * @template DocumentType - the type of the embedded Document
   * @template Opts         - the options that override the default options
   */
  type InitializedType<
    DocumentType extends Document.AnyConstructor,
    Opts extends Options<DocumentType>,
  > = DataField.DerivedInitializedType<
    SchemaField.InitializedData<DataModel.SchemaOfClass<DocumentType>>,
    MergedOptions<DocumentType, Opts>
  >;

  /**
   * A shorthand for the persisted type of an EmbeddedDocumentField class.
   * @template DocumentType - the type of the embedded Document
   * @template Opts         - the options that override the default options
   */
  type PersistedType<
    DocumentType extends Document.AnyConstructor,
    Opts extends Options<DocumentType>,
  > = DataField.DerivedInitializedType<
    SchemaField.SourceData<DataModel.SchemaOfClass<DocumentType>>,
    MergedOptions<DocumentType, Opts>
  >;
}

/**
 * A subclass of {@linkcode StringField} which provides the primary _id for a Document.
 * The field may be initially null, but it must be non-null when it is saved to the database.
 * @template Options         - the options of the DocumentIdField instance
 * @template AssignmentType  - the type of the allowed assignment values of the DocumentIdField
 * @template InitializedType - the type of the initialized values of the DocumentIdField
 * @template PersistedType   - the type of the persisted values of the DocumentIdField
 * @remarks
 * Defaults:
 * - AssignmentType: `string | Document.Any | null | undefined`
 * - InitializedType: `string | null`
 * - PersistedType: `string | null`
 * - InitialValue: `null`
 */
declare class DocumentIdField<
  Options extends DocumentIdField.Options = DocumentIdField.DefaultOptions,
  // eslint-disable-next-line @typescript-eslint/no-deprecated
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

  protected static override get _defaults(): StringField.Options<unknown>;

  protected override _cast(value: AssignmentType): InitializedType;

  /** @remarks `options` is unused in `DocumentIdField` */
  protected override _validateType(
    value: InitializedType,
    options?: DataField.ValidateOptions<this> | null,
  ): boolean | DataModelValidationFailure | void;
}

declare namespace DocumentIdField {
  type Options = StringField.Options<unknown> & {
    readonly?: boolean;
  };

  /** The type of the default options for the {@linkcode DocumentIdField} class. */
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
   * @template Options - the options that override the default options
   */
  type MergedOptions<Options extends StringField.Options<unknown>> = SimpleMerge<DefaultOptions, Options>;

  /**
   * A shorthand for the assignment type of a StringField class.
   * @template Options - the options that override the default options
   *
   * @deprecated - AssignmentType is being deprecated. See {@linkcode SchemaField.AssignmentData}
   * for more details.
   */
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  type AssignmentType<Options extends StringField.Options<unknown>> = DataField.DerivedAssignmentType<
    string | Document.Any,
    MergedOptions<Options>
  >;

  /**
   * A shorthand for the initialized type of a StringField class.
   * @template Options - the options that override the default options
   */
  type InitializedType<Options extends StringField.Options<unknown>> = DataField.DerivedInitializedType<
    string,
    MergedOptions<Options>
  >;
}

/**
 * A subclass of {@linkcode StringField} which supports referencing some other Document by its UUID.
 * This field may not be blank, but may be null to indicate that no UUID is referenced.
 */
declare class DocumentUUIDField<
  const Options extends DocumentUUIDField.Options = DocumentUUIDField.DefaultOptions,
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  const AssignmentType = StringField.AssignmentType<Options>,
  const InitializedType = StringField.InitializedType<Options>,
  const PersistedType extends string | null | undefined = StringField.InitializedType<Options>,
> extends StringField<Options, AssignmentType, InitializedType, PersistedType> {
  /**
   * @param options - Options which configure the behavior of the field
   * @param context - Additional context which describes the field
   */
  // options: not null (unchecked `in` operation in super), context: not null (destructured in super)
  constructor(options?: Options, context?: DataField.ConstructionContext);

  /** A specific document type in CONST.ALL_DOCUMENT_TYPES required by this field */
  type: Document.Type | undefined;

  /** Does this field require (or prohibit) embedded documents? */
  embedded: boolean | undefined;

  static get _defaults(): DocumentUUIDField.Options;

  /** @remarks `options` is unused in `DocumentUUIDField` */
  protected override _validateType(
    value: InitializedType,
    options?: DataField.ValidateOptions<this> | null,
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
  type Options = StringField.Options & {
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
 * A special class of {@linkcode StringField} field which references another DataModel by its id.
 * This field may also be null to indicate that no foreign model is linked.
 * @template DocumentType    - the type of the foreign document constructor
 * @template Options         - the options for the ForeignDocumentField
 * @template AssignmentType  - the type of the allowed assignment values of the ForeignDocumentField
 * @template InitializedType - the type of the initialized values of the ForeignDocumentField
 * @template PersistedType   - the type of the persisted values of the ForeignDocumentField
 * @remarks
 * Defaults:
 * - AssignmentType: `string | InstanceType<DocumentType> | null | undefined`
 * - InitializedType: `InstanceType<DocumentType> | null`
 * - PersistedType: `string | null`
 * - InitialValue: `null`
 */
declare class ForeignDocumentField<
  DocumentType extends Document.AnyConstructor,
  Options extends ForeignDocumentField.Options = ForeignDocumentField.DefaultOptions,
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  AssignmentType = ForeignDocumentField.AssignmentType<DocumentType, Options>,
  InitializedType = ForeignDocumentField.InitializedType<DocumentType, Options>,
  PersistedType extends string | null | undefined = ForeignDocumentField.PersistedType<Options>,
> extends DocumentIdField<Options, AssignmentType, InitializedType, PersistedType> {
  /**
   * @param model   - The foreign DataModel class definition which this field should link to.
   * @param options - Options which configure the behavior of the field
   * @param context - Additional context which describes the field
   *
   * @privateRemarks Technically the runtime check allows any DataModel, but that seems unintended
   */
  // options: not null (unchecked `in` operation in super), context: not null (destructured in super)
  constructor(model: DocumentType, options?: Options, context?: DataField.ConstructionContext);

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

  // options: not null (parameter default only)
  override initialize(
    value: PersistedType,
    model: DataModel.Any,
    options?: DataField.InitializeOptions,
  ): InitializedType | (() => InitializedType | null);

  override toObject(value: InitializedType): PersistedType;

  //TODO: _toInput
}

declare namespace ForeignDocumentField {
  /** The options for the ForeignDocumentField class. */
  // TODO(LukeAbby)
  interface Options extends StringField.Options<string | Document.Any> {
    //                                          ^ Making this more concrete leads to excessively deep instantiation
    idOnly?: boolean;
  }

  /** The type of the default options for the {@linkcode ForeignDocumentField} class. */
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
   * @template Opts - the options that override the default options
   */
  type MergedOptions<Opts extends Options> = SimpleMerge<DefaultOptions, Opts>;

  /**
   * A shorthand for the assignment type of a ForeignDocumentField class.
   * @template Opts - the options that override the default options
   *
   * @deprecated - AssignmentType is being deprecated. See {@linkcode SchemaField.AssignmentData}
   * for more details.
   */
  type AssignmentType<
    ConcreteDocument extends Document.AnyConstructor,
    Opts extends Options,
    // eslint-disable-next-line @typescript-eslint/no-deprecated
  > = DataField.DerivedAssignmentType<string | Document.ToConfiguredInstance<ConcreteDocument>, MergedOptions<Opts>>;

  /**
   * A shorthand for the initialized type of a ForeignDocumentField class.
   * @template Opts - the options that override the default options
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
   * @template Opts - the options that override the default options
   */
  type PersistedType<Opts extends Options> = DataField.DerivedInitializedType<string, MergedOptions<Opts>>;
}

/**
 * A special {@linkcode StringField} which records a standardized CSS color string.
 * @template Options         - the options of the ColorField instance
 * @template AssignmentType  - the type of the allowed assignment values of the ColorField
 * @template InitializedType - the type of the initialized values of the ColorField
 * @template PersistedType   - the type of the persisted values of the ColorField
 * @remarks
 * Defaults:
 * - AssignmentType: `string | null | undefined`
 * - InitializedType: `string | null`
 * - PersistedType: `string | null`
 * - InitialValue: `null`
 */
declare class ColorField<
  Options extends StringField.Options = ColorField.DefaultOptions,
  // eslint-disable-next-line @typescript-eslint/no-deprecated
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

  // options: not null (parameter default only)
  override initialize(
    value: PersistedType,
    model: DataModel.Any,
    options?: DataField.InitializeOptions,
  ): InitializedType | (() => InitializedType | null);

  /** @throws If the value isn't a valid {@link foundry.utils.Color.Source | `Color.Source`} *after* going through `super` */
  override getInitialValue(data?: unknown): InitializedType;

  protected override _cast(value: AssignmentType): InitializedType;

  /**
   * @remarks Returns `value.css` if it's a `.valid` `Color`, otherwise `this.getInitialValue(options.source)`
   *
   * `options` is required as it lacks any default handling and has its `.source` property accessed
   */
  protected override _cleanType(value: InitializedType, options: DataField.CleanOptions): InitializedType;

  /** @remarks `options` is only passed to super, where it is unused in `StringField` */
  protected override _validateType(
    value: InitializedType,
    options?: DataField.ValidateOptions<this> | null,
  ): boolean | DataModelValidationFailure | void;

  protected override _toInput(config: DataField.ToInputConfig<InitializedType>): HTMLElement | HTMLCollection;
}

declare namespace ColorField {
  /** The type of the default options for the {@linkcode ColorField} class. */
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
   * @template Options - the options that override the default options
   */
  type MergedOptions<Options extends StringField.Options> = SimpleMerge<DefaultOptions, Options>;

  /**
   * A shorthand for the assignment type of a ColorField class.
   * @template Options - the options that override the default options
   *
   * @deprecated - AssignmentType is being deprecated. See {@linkcode SchemaField.AssignmentData}
   * for more details.
   */
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  type AssignmentType<Options extends StringField.Options> = DataField.DerivedAssignmentType<
    string,
    MergedOptions<Options>
  >;

  /**
   * A shorthand for the initialized type of a ColorField class.
   * @template Options - the options that override the default options
   */
  type InitializedType<Options extends StringField.Options> = DataField.DerivedInitializedType<
    Color,
    MergedOptions<Options>
  >;

  /**
   * A shorthand for the persisted type of a ColorField class.
   * @template Options - the options that override the default options
   */
  type PersistedType<Options extends StringField.Options> = DataField.DerivedInitializedType<
    string,
    MergedOptions<Options>
  >;
}

/**
 * A special {@linkcode StringField} which records a file path or inline base64 data.
 * @template Options         - the options of the FilePathField instance
 * @template AssignmentType  - the type of the allowed assignment values of the FilePathField
 * @template InitializedType - the type of the initialized values of the FilePathField
 * @template PersistedType   - the type of the persisted values of the FilePathField
 * @remarks
 * Defaults:
 * - AssignmentType: `string | null | undefined`
 * - InitializedType: `string | null`
 * - PersistedType: `string | null`
 * - InitialValue: `null`
 */
declare class FilePathField<
  Options extends FilePathField.Options = FilePathField.DefaultOptions,
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  AssignmentType = FilePathField.AssignmentType<Options>,
  InitializedType = FilePathField.InitializedType<Options>,
  PersistedType extends string | null | undefined = FilePathField.InitializedType<Options>,
> extends StringField<Options, AssignmentType, InitializedType, PersistedType> {
  /**
   * @param options - Options which configure the behavior of the field
   * @param context - Additional context which describes the field
   */
  // options: not null (unchecked `in` operation in super), context: not null (destructured in super)
  constructor(options?: Options, context?: DataField.ConstructionContext);

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

  /** @remarks `options` is unused in `FilePathField` */
  protected override _validateType(
    value: InitializedType,
    options?: DataField.ValidateOptions<this>,
  ): boolean | DataModelValidationFailure | void;

  // TODO: _toInput
}

declare namespace FilePathField {
  /** The type of the default options for the {@linkcode FilePathField} class. */
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
   * @template Options - the options that override the default options
   */
  type MergedOptions<Options extends StringField.Options> = SimpleMerge<DefaultOptions, Options>;

  /**
   * A shorthand for the assignment type of a FilePathField class.
   * @template Options - the options that override the default options
   *
   * @deprecated - AssignmentType is being deprecated. See {@linkcode SchemaField.AssignmentData}
   * for more details.
   */
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  type AssignmentType<Options extends StringField.Options> = DataField.DerivedAssignmentType<
    string,
    MergedOptions<Options>
  >;

  /**
   * A shorthand for the initialized type of a FilePathField class.
   * @template Options - the options that override the default options
   */
  type InitializedType<Options extends StringField.Options> = DataField.DerivedInitializedType<
    string,
    MergedOptions<Options>
  >;
}

/**
 * A special {@linkcode NumberField} which represents an angle of rotation in degrees between 0 and 360.
 * @template Options         - the options of the AngleField instance
 * @template AssignmentType  - the type of the allowed assignment values of the AngleField
 * @template InitializedType - the type of the initialized values of the AngleField
 * @template PersistedType   - the type of the persisted values of the AngleField
 * @remarks
 * Defaults:
 * - AssignmentType: `number | null | undefined`
 * - InitializedType: `number`
 * - PersistedType: `number`
 * - InitialValue: `0`
 */
declare class AngleField<
  Options extends NumberField.Options = AngleField.DefaultOptions,
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  AssignmentType = AngleField.AssignmentType<Options>,
  InitializedType = AngleField.InitializedType<Options>,
  PersistedType extends number | null | undefined = AngleField.InitializedType<Options>,
> extends NumberField<Options, AssignmentType, InitializedType, PersistedType> {
  /**
   * @param options - Options which configure the behavior of the field
   * @param context - Additional context which describes the field
   */
  // options: not null (unchecked `in` operation in super), context: not null (destructured in super)
  constructor(options?: Options, context?: DataField.ConstructionContext);

  /** @defaultValue `true` */
  override required: boolean;

  /** @defaultValue `false` */
  override nullable: boolean;

  /** @defaultValue `0` */
  override initial: DataField.Options.InitialType<InitializedType>;

  /**
   * Whether the angle should be normalized to [0,360) before being clamped to [0,360]. The default is true.
   * @defaultValue `true`
   */
  normalize: boolean;

  /** @defaultValue `0` */
  override min: number | undefined;

  /** @defaultValue `360` */
  override max: number | undefined;

  /** @defaultValue `"is not a number between 0 and 360"` */
  override validationError: string;

  protected static override get _defaults(): NumberField.Options;

  protected override _cast(value: AssignmentType): InitializedType;

  /**
   * @deprecated since v12, until v14
   * @remarks "The `AngleField#base` is deprecated in favor of {@link AngleField.normalize | `AngleField#normalize`}."
   */
  get base(): number;

  set base(value);
}

declare namespace AngleField {
  /** The type of the default options for the {@linkcode AngleField} class. */
  type DefaultOptions = SimpleMerge<
    NumberField.DefaultOptions,
    {
      required: true;
      nullable: false;
      initial: 0;
      normalize: true;
      min: 0;
      max: 360;
      validationError: "is not a number between 0 and 360";
    }
  >;

  /**
   * A helper type for the given options type merged into the default options of the AngleField class.
   * @template Options - the options that override the default options
   */
  type MergedOptions<Options extends NumberField.Options> = SimpleMerge<DefaultOptions, Options>;

  /**
   * A shorthand for the assignment type of a AngleField class.
   * @template Options - the options that override the default options
   *
   * @deprecated - AssignmentType is being deprecated. See {@linkcode SchemaField.AssignmentData}
   * for more details.
   */
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  type AssignmentType<Options extends NumberField.Options> = DataField.DerivedAssignmentType<
    number,
    MergedOptions<Options>
  >;

  /**
   * A shorthand for the initialized type of a AngleField class.
   * @template Options - the options that override the default options
   */
  type InitializedType<Options extends NumberField.Options> = DataField.DerivedInitializedType<
    number,
    MergedOptions<Options>
  >;
}

/**
 * A special {@linkcode NumberField} represents a number between 0 and 1.
 * @template Options         - the options of the AlphaField instance
 * @template AssignmentType  - the type of the allowed assignment values of the AlphaField
 * @template InitializedType - the type of the initialized values of the AlphaField
 * @template PersistedType   - the type of the persisted values of the AlphaField
 * @remarks
 * Defaults:
 * - AssignmentType: `number | null | undefined`
 * - InitializedType: `number`
 * - PersistedType: `number`
 * - InitialValue: `1`
 */
declare class AlphaField<
  Options extends NumberField.Options = AlphaField.DefaultOptions,
  // eslint-disable-next-line @typescript-eslint/no-deprecated
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
  /** The type of the default options for the {@linkcode AlphaField} class. */
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
   * @template Options - the options that override the default options
   */
  type MergedOptions<Options extends NumberField.Options> = SimpleMerge<DefaultOptions, Options>;

  /**
   * A shorthand for the assignment type of a AlphaField class.
   * @template Options - the options that override the default options
   *
   * @deprecated - AssignmentType is being deprecated. See {@linkcode SchemaField.AssignmentData}
   * for more details.
   */
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  type AssignmentType<Options extends NumberField.Options> = DataField.DerivedAssignmentType<
    number,
    MergedOptions<Options>
  >;

  /**
   * A shorthand for the initialized type of a AlphaField class.
   * @template Options - the options that override the default options
   */
  type InitializedType<Options extends NumberField.Options> = DataField.DerivedInitializedType<
    number,
    MergedOptions<Options>
  >;
}

/**
 * A special {@linkcode NumberField} represents a number between 0 (inclusive) and 1 (exclusive).
 * Its values are normalized (modulo 1) to the range [0, 1) instead of being clamped.
 */
declare class HueField<
  const Options extends NumberField.Options = NumberField.DefaultOptions,
  // eslint-disable-next-line @typescript-eslint/no-deprecated
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
 * A special {@linkcode ObjectField} which captures a mapping of User IDs to Document permission levels.
 * @template Options         - the options of the DocumentOwnershipField instance
 * @template AssignmentType  - the type of the allowed assignment values of the DocumentOwnershipField
 * @template InitializedType - the type of the initialized values of the DocumentOwnershipField
 * @template PersistedType   - the type of the persisted values of the DocumentOwnershipField
 * @remarks
 * Defaults:
 * - AssignmentType: `Record<string, DOCUMENT_OWNERSHIP_LEVELS> | null | undefined`
 * - InitializedType: `Record<string, DOCUMENT_OWNERSHIP_LEVELS>`
 * - PersistedType: `Record<string, DOCUMENT_OWNERSHIP_LEVELS>`
 * - InitialValue: `{ default: DOCUMENT_OWNERSHIP_LEVELS.NONE }`
 */
declare class DocumentOwnershipField<
  Options extends DocumentOwnershipField.Options = DocumentOwnershipField.DefaultOptions,
  // eslint-disable-next-line @typescript-eslint/no-deprecated
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

  /** @remarks `options` is unused in `DocumentOwnershipField` */
  protected override _validateType(
    value: InitializedType,
    options?: DataField.ValidateOptions<this> | null,
  ): boolean | DataModelValidationFailure | void;
}

declare namespace DocumentOwnershipField {
  /** A shorthand for the options of a DocumentOwnershipField class. */
  type Options = DataField.Options<Record<string, DOCUMENT_OWNERSHIP_LEVELS>>;

  /** The type of the default options for the {@linkcode DocumentOwnershipField} class. */
  type DefaultOptions = SimpleMerge<
    ObjectField.DefaultOptions,
    {
      initial: Record<string, DOCUMENT_OWNERSHIP_LEVELS>;
      validationError: "is not a mapping of user IDs and document permission levels";
    }
  >;

  /**
   * A helper type for the given options type merged into the default options of the ObjectField class.
   * @template Opts - the options that override the default options
   */
  type MergedOptions<Opts extends Options> = SimpleMerge<DefaultOptions, Opts>;

  /**
   * A shorthand for the assignment type of a ObjectField class.
   * @template Opts - the options that override the default options
   *
   * @deprecated - AssignmentType is being deprecated. See {@linkcode SchemaField.AssignmentData}
   * for more details.
   */
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  type AssignmentType<Opts extends Options> = DataField.DerivedAssignmentType<
    Record<string, DOCUMENT_OWNERSHIP_LEVELS>,
    MergedOptions<Opts>
  >;

  /**
   * A shorthand for the initialized type of a ObjectField class.
   * @template Opts - the options that override the default options
   */
  type InitializedType<Opts extends Options> = DataField.DerivedInitializedType<
    Record<string, DOCUMENT_OWNERSHIP_LEVELS>,
    MergedOptions<Opts>
  >;
}

/**
 * A special {@linkcode StringField} which contains serialized JSON data.
 * @template Options         - the options of the JSONField instance
 * @template AssignmentType  - the type of the allowed assignment values of the JSONField
 * @template InitializedType - the type of the initialized values of the JSONField
 * @template PersistedType   - the type of the persisted values of the JSONField
 * @remarks
 * Defaults:
 * - AssignmentType: `string | null | undefined`
 * - InitializedType: `object | undefined`
 * - PersistedType: `string | undefined`
 * - InitialValue: `undefined`
 */
declare class JSONField<
  // TODO(LukeAbby): Due to the unconditional setting of `blank`, `trim`, and `choices` setting them is meaningless which basically means they're removed from the options.
  Options extends StringField.Options = JSONField.DefaultOptions,
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  AssignmentType = JSONField.AssignmentType<Options>,
  InitializedType = JSONField.InitializedType<Options>,
  PersistedType extends string | null | undefined = JSONField.PersistedType<Options>,
> extends StringField<Options, AssignmentType, InitializedType, PersistedType> {
  // options: not null (unchecked `in` operation in super), context: not null (destructured in super)
  constructor(options?: Options, context?: DataField.ConstructionContext);

  /** @defaultValue `false` */
  override blank: boolean;

  /** @defaultValue `undefined` */
  override initial: DataField.Options.InitialType<InitializedType>;

  /** @defaultValue `"is not a valid JSON string"` */
  override validationError: string;

  protected static override get _defaults(): StringField.Options;

  override clean(value: AssignmentType, options?: DataField.CleanOptions): InitializedType;

  /** @remarks `options` is unused in `JSONField` */
  protected override _validateType(
    value: InitializedType,
    options?: DataField.ValidateOptions<this> | null,
  ): boolean | DataModelValidationFailure | void;

  // options: not null (parameter default only)
  override initialize(
    value: PersistedType,
    model: DataModel.Any,
    options?: DataField.InitializeOptions,
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
  /** The type of the default options for the {@linkcode JSONField} class. */
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
   * @template Options - the options that override the default options
   */
  type MergedOptions<Options extends StringField.Options> = SimpleMerge<DefaultOptions, Options>;

  /**
   * A shorthand for the assignment type of a JSONField class.
   * @template Options - the options that override the default options
   *
   * @deprecated - AssignmentType is being deprecated. See {@linkcode SchemaField.AssignmentData}
   * for more details.
   */
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  type AssignmentType<Options extends StringField.Options> = DataField.DerivedAssignmentType<
    string,
    MergedOptions<Options>
  >;

  /**
   * A shorthand for the initialized type of a JSONField class.
   * @template Options - the options that override the default options
   */
  type InitializedType<Options extends StringField.Options> = DataField.DerivedInitializedType<
    AnyObject,
    MergedOptions<Options>
  >;

  /**
   * A shorthand for the persisted type of a JSONField class.
   * @template Options - the options that override the default options
   */
  type PersistedType<Options extends StringField.Options> = DataField.DerivedInitializedType<
    string,
    MergedOptions<Options>
  >;
}

/**
 * A special subclass of {@linkcode DataField} which can contain any value of any type.
 * Any input is accepted and is treated as valid.
 * It is not recommended to use this class except for very specific circumstances.
 */
// TODO(LukeAbby): This field effectively removes all options because there's no point asking for an options when none of them do anything.
declare class AnyField extends DataField<DataField.Options.Any, unknown, unknown, unknown> {
  /** @remarks Simply returns `value` */
  override _cast(value: unknown): unknown;

  /**
   * @remarks `options` is unused in `AnyField`
   *
   * Always returns `true`
   */
  protected override _validateType(
    value: unknown,
    options?: DataField.ValidateOptions<this> | null,
  ): boolean | DataModelValidationFailure | void;
}

/**
 * A subclass of {@linkcode StringField} which contains a sanitized HTML string.
 * This class does not override any StringField behaviors, but is used by the server-side to identify fields which
 * require sanitization of user input.
 * @template Options         - the options of the HTMLField instance
 * @template AssignmentType  - the type of the allowed assignment values of the HTMLField
 * @template InitializedType - the type of the initialized values of the HTMLField
 * @template PersistedType   - the type of the persisted values of the HTMLField
 * @remarks
 * Defaults:
 * - AssignmentType: `string | null | undefined`
 * - InitializedType: `string`
 * - PersistedType: `string`
 * - InitialValue: `""`
 */
declare class HTMLField<
  Options extends StringField.Options = HTMLField.DefaultOptions,
  // eslint-disable-next-line @typescript-eslint/no-deprecated
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
  /** @remarks Sets `groupConfig.stacked ??= true` before calling super */
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
  /** The type of the default options for the {@linkcode HTMLField} class. */
  type DefaultOptions = SimpleMerge<
    StringField.DefaultOptions,
    {
      required: true;
      blank: true;
    }
  >;

  /**
   * A helper type for the given options type merged into the default options of the HTMLField class.
   * @template Options - the options that override the default options
   */
  type MergedOptions<Options extends StringField.Options> = SimpleMerge<DefaultOptions, Options>;

  /**
   * A shorthand for the assignment type of a HTMLField class.
   * @template Options - the options that override the default options
   *
   * @deprecated - AssignmentType is being deprecated. See {@linkcode SchemaField.AssignmentData}
   * for more details.
   */
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  type AssignmentType<Options extends StringField.Options> = DataField.DerivedAssignmentType<
    string,
    MergedOptions<Options>
  >;

  /**
   * A shorthand for the initialized type of a HTMLField class.
   * @template Options - the options that override the default options
   */
  type InitializedType<Options extends StringField.Options> = DataField.DerivedInitializedType<
    string,
    MergedOptions<Options>
  >;

  // `HTMLField#toFormGroup` provides a default by way of `groupConfig.stacked ??= true`.
  interface GroupConfig extends NullishProps<DataField.GroupConfig, "stacked"> {}
}

/**
 * A subclass of {@linkcode NumberField} which is used for storing integer sort keys.
 * @template Options         - the options of the IntegerSortField instance
 * @template AssignmentType  - the type of the allowed assignment values of the IntegerSortField
 * @template InitializedType - the type of the initialized values of the IntegerSortField
 * @template PersistedType   - the type of the persisted values of the IntegerSortField
 * @remarks
 * Defaults:
 * - AssignmentType: `number | null | undefined`
 * - InitializedType: `number`
 * - PersistedType: `number`
 * - InitialValue: `0`
 */
declare class IntegerSortField<
  Options extends NumberField.Options = IntegerSortField.DefaultOptions,
  // eslint-disable-next-line @typescript-eslint/no-deprecated
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

  static override get _defaults(): NumberField.Options;
}

declare namespace IntegerSortField {
  /** The type of the default options for the {@linkcode IntegerSortField} class. */
  type DefaultOptions = SimpleMerge<
    NumberField.DefaultOptions,
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
   * @template Options - the options that override the default options
   */
  type MergedOptions<Options extends NumberField.Options> = SimpleMerge<DefaultOptions, Options>;

  /**
   * A shorthand for the assignment type of a IntegerSortField class.
   * @template Options - the options that override the default options
   *
   * @deprecated - AssignmentType is being deprecated. See {@linkcode SchemaField.AssignmentData}
   * for more details.
   */
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  type AssignmentType<Options extends NumberField.Options> = DataField.DerivedAssignmentType<
    number,
    MergedOptions<Options>
  >;

  /**
   * A shorthand for the initialized type of a IntegerSortField class.
   * @template Options - the options that override the default options
   */
  type InitializedType<Options extends NumberField.Options> = DataField.DerivedInitializedType<
    number,
    MergedOptions<Options>
  >;
}

/**
 * A subclass of {@linkcode SchemaField} which stores document metadata in the _stats field.
 * @template Options         - the options of the DocumentStatsField instance
 * @template AssignmentType  - the type of the allowed assignment values of the DocumentStatsField
 * @template InitializedType - the type of the initialized values of the DocumentStatsField
 * @template PersistedType   - the type of the persisted values of the DocumentStatsField
 * @remarks
 * Defaults:
 * - AssignmentType: `Partial<DocumentStats> | null | undefined`
 * - InitializedType: `DocumentStats`
 * - PersistedType: `object`
 * - InitialValue:
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
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  AssignmentType = DocumentStatsField.AssignmentType<Options>,
  InitializedType = DocumentStatsField.InitializedType<Options>,
  PersistedType extends AnyObject | null | undefined = DocumentStatsField.PersistedType<Options>,
> extends SchemaField<DocumentStatsField.Schema, Options, AssignmentType, InitializedType, PersistedType> {
  /**
   * @param options - Options which configure the behavior of the field
   * @param context - Additional context which describes the field
   */
  // options: not null (unchecked `in` operation in super), context: not null (destructured in super)
  constructor(options?: Options, context?: DataField.ConstructionContext);

  /**
   * All Document stats.
   * @defaultValue
   * ```js
   * [
   *   "coreVersion",
   *   "systemId",
   *   "systemVersion",
   *   "createdTime",
   *   "modifiedTime",
   *   "lastModifiedBy",
   *   "compendiumSource",
   *   "duplicateSource"
   * ]
   * ```
   */
  static fields: string[];

  /**
   * These fields are managed by the server and are ignored if they appear in creation or update data.
   * @defaultValue
   * ```js
   * [
   *   "coreVersion",
   *   "systemId",
   *   "systemVersion",
   *   "createdTime",
   *   "modifiedTime",
   *   "lastModifiedBy",
   * ]
   * ```
   * @remarks The only fields not managed are `compendiumSource` and `duplicateSource`
   */
  static managedFields: string[];
}

declare namespace DocumentStatsField {
  /** A shorthand for the options of a DocumentStatsField class. */
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  type Options = DataField.Options<SchemaField.AssignmentData<Schema>>;

  /** The type of the default options for the {@linkcode DocumentStatsField} class. */
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  type DefaultOptions = SimpleMerge<SchemaField.DefaultOptions, { initial: SchemaField.AssignmentData<Schema> }>;

  /**
   * A helper type for the given options type merged into the default options of the {@linkcode DocumentStatsField} class.
   * @template Opts - the options that override the default options
   */
  type MergedOptions<Opts extends Options> = SimpleMerge<DefaultOptions, Opts>;

  /**
   * A shorthand for the assignment type of a DocumentStatsField class.
   * @template Opts - the options that override the default options
   *
   * @deprecated - AssignmentType is being deprecated. See {@linkcode SchemaField.AssignmentData}
   * for more details.
   */
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  type AssignmentType<Opts extends Options = DefaultOptions> = DataField.DerivedAssignmentType<
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    SchemaField.AssignmentData<Schema>,
    MergedOptions<Opts>
  >;

  /**
   * A shorthand for the assignment type of a DocumentStatsField class.
   * @template Opts - the options that override the default options
   */
  type InitializedType<Opts extends Options = DefaultOptions> = DataField.DerivedInitializedType<
    SchemaField.InitializedData<Schema>,
    MergedOptions<Opts>
  >;

  /**
   * A shorthand for the assignment type of a DocumentStatsField class.
   * @template Opts - the options that override the default options
   */
  type PersistedType<Opts extends Options = DefaultOptions> = DataField.DerivedInitializedType<
    SchemaField.SourceData<Schema>,
    MergedOptions<Opts>
  >;

  interface CreateData extends SchemaField.CreateData<Schema> {}

  interface InitializedData extends SchemaField.InitializedData<Schema> {}

  interface SourceData extends SchemaField.SourceData<Schema> {}

  /** @deprecated Replaced with {@linkcode DocumentStatsField.CreateData} */
  type ConstructorData = CreateData;

  /** @deprecated Replaced with {@linkcode DocumentStatsField.InitializedData} */
  type Properties = SchemaField.InitializedData<Schema>;

  /** @deprecated Replaced with {@linkcode DocumentStatsField.SourceData} */
  type Source = SchemaField.SourceData<Schema>;

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
 * A subclass of {@linkcode StringField} that is used specifically for the Document "type" field.
 */
declare class DocumentTypeField<
  const ConcreteDocumentClass extends Document.AnyConstructor,
  const Options extends DocumentTypeField.Options = DocumentTypeField.DefaultOptions,
  // eslint-disable-next-line @typescript-eslint/no-deprecated
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
   * @remarks Enforces `choices` being `documentClass.TYPES`
   */
  // options: not null (unchecked `in` operation in super), context: not null (destructured in super)
  constructor(
    documentClass: ConcreteDocumentClass,
    options?: DocumentTypeField.Options,
    context?: DataField.ConstructionContext,
  );

  static override get _defaults(): DocumentTypeField.Options;

  /** @remarks `options` is required as it has no default handling and its `fallback` property is accessed */
  protected override _validateType(
    value: InitializedType,
    options: DataField.ValidateOptions<this>,
  ): boolean | DataModelValidationFailure | void;
}

declare namespace DocumentTypeField {
  /** The type of the default options for the {@linkcode DocumentTypeField} class. */
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

  /**
   * @deprecated - AssignmentType is being deprecated. See {@linkcode SchemaField.AssignmentData}
   * for more details.
   */
  type AssignmentType<
    ConcreteDocumentClass extends Document.AnyConstructor,
    Options extends StringField.Options,
    // eslint-disable-next-line @typescript-eslint/no-deprecated
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
 * A subclass of {@linkcode ObjectField} which supports a type-specific data object.
 * @template DocumentType    - the type of the embedded Document
 * @template Options         - the options of the TypeDataField instance
 * @template AssignmentType  - the type of the allowed assignment values of the TypeDataField
 * @template InitializedType - the type of the initialized values of the TypeDataField
 * @template PersistedType   - the type of the persisted values of the TypeDataField
 * @remarks
 * Defaults:
 * - AssignmentType: `SchemaField.AssignmentType<DocumentType["schema"]["fields"]> | null | undefined`
 * - InitializedType: `SchemaField.InitializedType<DocumentType["schema"]["fields"]>`
 * - PersistedType: `SchemaField.PersistedType<DocumentType["schema"]["fields"]>`
 * - InitialValue: `{}`
 */
declare class TypeDataField<
  const SystemDocument extends Document.SystemConstructor,
  const Options extends TypeDataField.Options<SystemDocument> = TypeDataField.DefaultOptions,
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  const AssignmentType = TypeDataField.AssignmentType<SystemDocument, Options>,
  const InitializedType = TypeDataField.InitializedType<SystemDocument, Options>,
  const PersistedType extends AnyObject | null | undefined = TypeDataField.PersistedType<SystemDocument, Options>,
> extends ObjectField<Options, AssignmentType, InitializedType, PersistedType> {
  /**
   * @param document - The base document class which belongs in this field
   * @param options  - Options which configure the behavior of the field
   * @param context - Additional context which describes the field
   */
  // options: not null (unchecked `in` operation in super), context: not null (destructured in super)
  constructor(document: SystemDocument, options?: Options, context?: DataField.ConstructionContext);

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

  /** @remarks If an object with a valid `type` isn't passed, returns `{}` */
  override getInitialValue(data?: { type?: string }): InitializedType;

  /**
   * @remarks Returns:
   * - If a valid TypeDataModel, the `value` run through its `.cleanData` with `options.source: value`, else
   * - If `options.partial`, simply `value`, else
   * - A `mergeObject` of `this.getInitialValue(options.source)` and `value`
   *
   * `options` is required as it lacks any default handling and has its properties accessed
   */
  protected override _cleanType(value: InitializedType, options: DataField.CleanOptions): InitializedType;

  // options: not null (parameter default only)
  override initialize(
    value: PersistedType,
    model: DataModel.Any,
    options?: DataField.InitializeOptions,
  ): InitializedType | (() => InitializedType | null);

  // options: not null (parameter default only, property access)
  protected override _validateType(
    value: InitializedType,
    options?: DataField.ValidateOptions<this>,
  ): boolean | DataModelValidationFailure | void;

  // options: not ull (parameter default only, property access)
  protected override _validateModel(data: AnyObject, options?: DataField.ValidateModelOptions): void;

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
   * @template DocumentType - the type of the embedded Document
   */
  type Options<DocumentType extends Document.SystemConstructor> = DataField.Options<
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    SchemaField.AssignmentData<DataModel.SchemaOfClass<DocumentType>>
  >;

  /** The type of the default options for the {@linkcode TypeDataField} class. */
  type DefaultOptions = SimpleMerge<
    ObjectField.DefaultOptions,
    {
      required: true;
    }
  >;

  /**
   * A helper type for the given options type merged into the default options of the TypeDataField class.
   * @template DocumentType - the type of the embedded Document
   * @template Options - the options that override the default options
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
   * @template DocumentType - the type of the embedded Document
   * @template Options - the options that override the default options
   *
   * @deprecated - AssignmentType is being deprecated. See {@linkcode SchemaField.AssignmentData}
   * for more details.
   */
  type AssignmentType<
    SystemDocumentConstructor extends Document.SystemConstructor,
    Opts extends Options<SystemDocumentConstructor>,
    // eslint-disable-next-line @typescript-eslint/no-deprecated
  > = DataField.DerivedAssignmentType<AnyObject, MergedOptions<SystemDocumentConstructor, Opts>>;

  /**
   * A shorthand for the initialized type of a TypeDataField class.
   * @template DocumentType - the type of the embedded Document
   * @template Options - the options that override the default options
   */
  type InitializedType<
    SystemDocumentConstructor extends Document.SystemConstructor,
    Opts extends Options<SystemDocumentConstructor>,
  > = DataField.DerivedInitializedType<
    _Instances<DataModelsFor<SystemDocumentConstructor["metadata"]["name"]>> | Document.UnknownSystem,
    MergedOptions<SystemDocumentConstructor, Opts>
  >;

  /** @internal */
  type _Instances<T> = {
    [K in keyof T]: T[K] extends (abstract new (...args: never) => infer U extends DataModel.Any) ? U : never;
  }[keyof T];

  /**
   * With the existence of custom module subtypes a system can no longer rely on their configured types being the only ones.
   * A module can provide its own custom type though it is always of the form `${moduleName}.${subType}` so the `.` is a pretty
   * strong indicator.
   *
   * `UnknownTypeDataModel` covers the case where it's configured with a {@linkcode TypeDataModel}.
   * See {@linkcode UnknownSystem} for other possibilities.
   */
  interface UnknownTypeDataModel extends TypeDataModel<any, any, any, any> {}

  /**
   * A shorthand for the persisted type of a TypeDataField class.
   * @template DocumentType - the type of the embedded Document
   * @template Opts         - the options that override the default options
   */
  type PersistedType<
    ConcreteDocument extends Document.SystemConstructor,
    Opts extends Options<ConcreteDocument>,
  > = DataField.DerivedInitializedType<AnyObject, MergedOptions<ConcreteDocument, Opts>>;
}

/**
 * A subclass of {@linkcode DataField} which allows to typed schemas.
 */
declare class TypedSchemaField<
    const Types extends TypedSchemaField.Types,
    const Options extends TypedSchemaField.Options<Types> = TypedSchemaField.DefaultOptions,
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    const AssignmentType = TypedSchemaField.AssignmentType<Types, Options>,
    const InitializedType = TypedSchemaField.InitializedType<Types, Options>,
    const PersistedType = TypedSchemaField.PersistedType<Types, Options>,
  >
  extends DataField<Options, AssignmentType, InitializedType, PersistedType>
  implements DataField.Internal.NestedFieldImplementation
{
  /**
   * @param types   - The different types this field can represent.
   * @param options - Options which configure the behavior of the field
   * @param context - Additional context which describes the field
   */
  // options: not null (unchecked `in` operation in super), context: not null (destructured in super)
  constructor(types: Types, options?: Options, context?: DataField.ConstructionContext);

  /** @internal */
  " __fvtt_types_get_field_schema": TypedSchemaField.ToConfiguredTypes<Types>;

  static get _defaults(): DataField.Options.Any;

  /**
   * The types of this field.
   */
  types: TypedSchemaField.ToConfiguredTypes<Types>;

  protected override _getField(path: string[]): DataField.Any;

  /**
   * @remarks Returns `value` if `value?.type` doesn't map to a valid type, otherwise it runs `value`
   * through the matching type's `#clean`
   */
  // options: not null (parameter default only, property access in super)
  protected override _cleanType(value: InitializedType, options?: DataField.CleanOptions): InitializedType;

  protected override _cast(value: AssignmentType): InitializedType;

  protected override _validateSpecial(value: AssignmentType): boolean | void;

  /** @remarks Forwards to the SchemaField designated by `value.type`'s `#validate` */
  // options: not null (parameter default only, property access in super)
  protected override _validateType(
    value: InitializedType,
    options?: DataField.ValidateOptions<this>,
  ): boolean | DataModelValidationFailure | void;

  // options: not null (parameter default only)
  override initialize(
    value: PersistedType,
    model: DataModel.Any,
    options?: DataField.InitializeOptions,
  ): InitializedType | (() => InitializedType | null);

  override toObject(value: InitializedType): PersistedType;

  // TODO(LukeAbby): Type `TypedSchemaField#apply`.
  // options: not null (could be forwarded somewhere destructured, parameter default only)
  override apply<Options, Return>(
    fn: keyof this | ((this: this, value: AnyObject, options: Options) => Return),
    value?: AnyObject,
    options?: Options,
  ): Return;

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

  type Type =
    | ValidDataSchema
    | SchemaField<DataSchema, { required: true; nullable: false }, any, any, any>
    // Used instead of `AnyConstructor` because the constructor must stay the same.
    // Note(LukeAbby): `AnyObject` for `ExtraConstructorOptions` may not make sense.
    | DataModel.ConcreteConstructor;

  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  type Types = {
    [type: string]: Type;
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
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    [K in keyof Types]: DataField.AssignmentTypeFor<Types[K]> & { type: K };
  }[keyof Types];

  /**
   * @deprecated - AssignmentType is being deprecated. See {@linkcode SchemaField.AssignmentData}
   * for more details.
   */
  type AssignmentType<
    Types extends TypedSchemaField.Types,
    Options extends TypedSchemaField.Options<Types>,
    // eslint-disable-next-line @typescript-eslint/no-deprecated
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
 * @deprecated since v11 until v13; ModelValidationError is deprecated. Please use DataModelValidationError instead.
 * @template Errors - the type of the errors contained in this error
 */
declare class ModelValidationError<
  // eslint-disable-next-line @typescript-eslint/no-deprecated
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
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  static formatErrors(errors: ModelValidationError.Errors): string;
}

declare namespace ModelValidationError {
  /**
   * @deprecated since v11 until v13; ModelValidationError is deprecated. Please use DataModelValidationError instead.
   */
  type Errors = Record<number | string | symbol, Error> | Error[] | string;
}

// The subclassing of `StringField` can't be done in one step because
// `ToInputOptions` both adds and removes properties.
// This is done this way to avoid the need for some `@ts-expect-error`
// directives that could mask other errors.
declare class _InternalJavaScriptField<
  const Options extends JavaScriptField.Options = JavaScriptField.DefaultOptions,
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  const AssignmentType = StringField.AssignmentType<Options>,
  const InitializedType = StringField.InitializedType<Options>,
  const PersistedType extends string | null | undefined = StringField.InitializedType<Options>,
> extends StringField<Options, AssignmentType, InitializedType, PersistedType> {
  override toFormGroup(groupConfig?: any, inputConfig?: any): HTMLDivElement;

  protected override _toInput(config: any): HTMLElement | HTMLCollection;
}

/**
 * A subclass of {@linkcode StringField} which contains JavaScript code.
 */
declare class JavaScriptField<
  const Options extends JavaScriptField.Options = JavaScriptField.DefaultOptions,
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  const AssignmentType = StringField.AssignmentType<Options>,
  const InitializedType = StringField.InitializedType<Options>,
  const PersistedType extends string | null | undefined = StringField.InitializedType<Options>,
> extends _InternalJavaScriptField<Options, AssignmentType, InitializedType, PersistedType> {
  /**
   * @param options - Options which configure the behavior of the field
   * @param context - Additional context which describes the field
   * @remarks Enforces `choices = undefined`
   */
  // options: not null (unchecked `in` operation in super), context: not null (destructured in super)
  constructor(options?: Options, context?: DataField.ConstructionContext);

  static get _defaults(): JavaScriptField.Options;

  /** @remarks `options` is only passed to super, where it is unused in `StringField` */
  protected override _validateType(
    value: InitializedType,
    options?: DataField.ValidateOptions<this> | null,
  ): boolean | DataModelValidationFailure | void;

  /** @remarks Sets `groupConfig.stacked ??= true` then forwards to super */
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
