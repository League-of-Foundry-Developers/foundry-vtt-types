import type { DataModel } from "../../client/config.js";

export interface DataFieldOptions<T> {
  /**
   * Is this field required to be populated?
   * Default: false
   */
  required: boolean;

  /**
   * Can this field have null values?
   * Default: false
   */
  nullable: boolean;

  /**
   * The initial value of a field, or a function which assigns that initial
   * value.
   * Default: undefined
   */
  initial: T | (() => T);

  /**
   * A data validation function which accepts one argument with the current
   * value.
   */
  validate: (value: any, options: any) => boolean;

  /**
   * Should the prepared value of the field be read-only, preventing it from
   * being changed unless a change to the _source data is applied.
   * Default: false
   */
  readonly: boolean;

  /**
   * A localizable label displayed on forms which render this field.
   * Default: ""
   */
  label: string;

  /**
   * Localizable help text displayed on forms which render this field.
   * Default: ""
   */
  hint: string;

  /**
   * A custom validation error string. When displayed will be prepended with
   * the document name, field name, and candidate value.
   * Default: "is not a valid value"
   */
  validationError: string;
}

export class ModelValidationError extends Error {
  constructor(errors: any);

  errors: any;

  /**
   * Collect all the errors into a single message for consumers who do not
   * handle the ModelValidationError specially.
   *
   * @param errors - The raw error structure
   * @returns A formatted error message
   */
  static formatErrors(errors: any): string;
}

/**
 * An abstract class that defines the base pattern for a data field within a
 * data schema.
 * @typeparam T - the inner type of the document field
 */
export abstract class DataField<T> {
  constructor(options: DataFieldOptions<T>);

  /**
   * The initially provided options which configure the data field
   */
  options: DataFieldOptions<T>;

  /**
   * The field name of this DataField instance. This is assigned by
   * SchemaField#initialize.
   */
  name: any;

  /**
   * A reference to the parent schema to which this DataField belongs. This is
   * assigned by SchemaField#initialize.
   */
  parent: any;

  /**
   * Is this field required to be populated?
   */
  required: boolean;

  /**
   * Can this field have null values?
   */
  nullable: boolean;

  /**
   * The initial value of a field, or a function which assigns that initial
   * value.
   */
  initial: T | (() => T);

  /**
   * Should the prepared value of the field be read-only, preventing it from
   * being changed unless a change to the _source data is applied.
   */
  readonly: boolean;

  /**
   * A localizable label displayed on forms which render this field.
   */
  label: string;

  /**
   * Localizable help text displayed on forms which render this field.
   */
  hint: string;

  /**
   * A custom validation error string. When displayed will be prepended with
   * the document name, field name, and candidate value.
   */
  validationError: string;

  /**
   * A dot-separated string representation of the field path within the parent
   * schema.
   */
  get fieldPath(): string;

  /**
   * Default parameters for this field type
   */
  protected static get _defaults(): DataFieldOptions<unknown>;

  /**
   * Apply a function to this DataField which propagates through recursively
   * to any contained data schema.
   *
   * @param fn      - The function to apply
   * @param value   - The current value of the field
   * @param options - Additional options passed to the applied function
   *                  (default: `{}`)
   * @returns The results object
   */
  apply(fn: string | ((value: T, options: any) => any), value: T, options?: any): any;

  /**
   * Coerce source data to ensure that it conforms to the correct data type
   * for the field. Data coercion operations should be simple and synchronous
   * as these are applied whenever a DataModel is constructed. For one-off
   * cleaning of user-provided input the sanitize method should be used.
   *
   * @param value           - The initial value
   * @param options         - Additional options for how the field is cleaned
   * @param options.partial - Whether to perform partial cleaning?
   * @param options.source  - The root data model being cleaned
   * @returns The cast value
   */
  clean(value: any, options: { partial: boolean; source: any }): T;

  /**
   * Apply any cleaning logic specific to this DataField type.
   *
   * @param value   - The appropriately coerced value.
   * @param options - Additional options for how the field is cleaned.
   * @returns The cleaned value.
   */
  protected _cleanType(value: T, options: any): T;

  /**
   * Cast a non-default value to ensure it is the correct type for the field
   *
   * @param value - The provided non-default value
   * @returns The standardized value
   */
  protected _cast(value: any): T;

  /**
   * Attempt to retrieve a valid initial value for the DataField.
   *
   * @param data - The source data object for which an initial value is required
   * @returns A valid initial value
   * @throws An error if there is no valid initial value defined
   */
  getInitialValue(data: any): T;

  /**
   * Validate a candidate input for this field, ensuring it meets the field
   * requirements. A validation failure can be provided as a raised Error
   * (with a string message) or by returning false. A validator which returns
   * true denotes that the result is certainly valid and further validations
   * are unnecessary.
   *
   * @param value   - The initial value
   * @param options - Options which affect validation behavior
   *                  (default: `{}`)
   * @returns Returns a ModelValidationError if a validation failure occurred
   */
  validate(value: any, options?: any): ModelValidationError | undefined;

  /**
   * Special validation rules which supersede regular field validation. This
   * validator screens for certain values which are otherwise incompatible
   * with this field like null or undefined.
   *
   * @param value - The candidate value
   * @returns A boolean to indicate with certainty whether the value is valid.
   *          Otherwise, return undefined
   * @throws  May throw a specific error if the value is not valid
   */
  protected _validateSpecial(value: any): boolean | undefined;

  /**
   * A default type-specific validator that can be overridden by child classes
   *
   * @param value   - The candidate value
   * @param options - Options which affect validation behavior
   *                  (default: `{}`)
   * @returns A boolean to indicate with certainty whether the value is valid.
   *          Otherwise, return undefined.
   * @throws  May throw a specific error if the value is not valid
   */
  protected _validateType(value: T, options?: any): boolean | undefined;

  /**
   * Initialize the original source data into a mutable copy for the DataModel
   * instance.
   *
   * @param value - The source value of the field
   * @param model - The DataModel instance that this field belongs to
   * @returns An initialized copy of the source data
   */
  initialize(value: T, model: DataModel): T;

  /**
   * @param value - The initialized value of the field
   * @returns An exported representation of the field
   */
  toObject(value: T): T;
}
