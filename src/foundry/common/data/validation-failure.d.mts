import type { InexactPartial } from "#utils";

/**
 * A class responsible for recording information about a validation failure.
 */
declare class DataModelValidationFailure {
  constructor(message?: string, options?: DataModelValidationFailure.ConstructorOptions);

  /** The value that failed validation for this field. */
  invalidValue: unknown;

  /** The value it was replaced by, if any. */
  fallbackValue: unknown;

  /** The path of the field responsible for the failure. */
  fieldPath: string | undefined;

  /** Whether the value was dropped from some parent collection. */
  dropped: boolean;

  /**
   * If this field contains other fields that are validated as part of its validation, their results are recorded here.
   */
  fields: Record<string, DataModelValidationFailure>;

  /**
   * If this field contains a list of elements that are validated as part of its validation, their results are recorded here.
   */
  elements: DataModelValidationFailure.ElementValidationFailure[];

  /**
   * If this field has a joint validation failure across multiple sub-fields, the failure message is recorded here.
   */
  joint: string | undefined;

  /** The error message. */
  message: string;

  /** Options forwarded to the Error constructor. */
  options: ErrorOptions;

  /**
   * Record whether a validation failure is unresolved.
   * This reports as true if validation for this field or any hierarchically contained field is unresolved.
   * A failure is unresolved if the value was invalid and there was no valid fallback value available.
   */
  unresolved: boolean;

  /** Whether this failure contains other sub-failures. */
  get empty(): boolean;

  /** Return this validation failure as an Error instance. */
  asError(): DataModelValidationError;

  /** Copy the data of this DataModelValidationFailure to another one. */
  copyTo(failure: DataModelValidationFailure): void;

  /**
   * Retrieve the leaf node failure that caused this, or a specific sub-failure via a path.
   * @param key - The property key to the failure.
   *
   * @example Retrieving a failure.
   * ```js
   * const changes = {
   *   "foo.bar": "validValue",
   *   "foo.baz": "invalidValue"
   * };
   * try {
   *   doc.validate(expandObject(changes));
   * } catch ( err ) {
   *   const failure = err.getFailure("foo.baz");
   *   console.log(failure.invalidValue); // "invalidValue"
   * }
   * ```
   */
  getFailure(key?: string): DataModelValidationFailure | null;

  /**
   * Retrieve a flattened object of all the properties that failed validation as part of this error.
   *
   * @example Removing invalid changes from an update delta.
   * ```js
   * const changes = {
   *   "foo.bar": "validValue",
   *   "foo.baz": "invalidValue"
   * };
   * try {
   *   doc.validate(expandObject(changes));
   * } catch ( err ) {
   *   const failures = err.getAllFailures();
   *   if ( failures ) {
   *     for ( const prop in failures ) delete changes[prop];
   *     doc.validate(expandObject(changes));
   *   }
   * }
   * ```
   */
  getAllFailures(): Record<string, DataModelValidationFailure>;

  /** Return the base properties of this failure, omitting any nested failures. */
  toObject(): DataModelValidationFailure.ToObjectReturn;

  /** Represent the DataModelValidationFailure as a string. */
  toString(): string;

  /** Log the validation error as a table. */
  logAsTable(): void;

  /** Generate a nested tree view of the error as an HTML string. */
  asHTML(): string;

  /** @deprecated since v14 in favor of the {@linkcode empty} property */
  isEmpty(): boolean;

  /** @deprecated since v14, renamed to {@linkcode fallbackValue} */
  get fallback(): unknown;

  static #DataModelValidationFailure: true;
}

/**
 * A specialized Error to indicate a model validation failure.
 */
declare class DataModelValidationError extends Error {
  /**
   * @param failure - The failure that triggered this error or an error message
   * @param params  - Additional Error constructor parameters
   */
  constructor(failure: DataModelValidationFailure | string, ...params: unknown[]);

  /** @see {@link DataModelValidationFailure.getFailure | `DataModelValidationFailure#getFailure`} */
  getFailure(key?: string): DataModelValidationFailure | null;

  /** @see {@link DataModelValidationFailure.getAllFailures | `DataModelValidationFailure#getAllFailures`} */
  getAllFailures(): Record<string, DataModelValidationFailure>;

  /** Log the validation error as a table. */
  logAsTable(): void;

  /** Generate a nested tree view of the error as an HTML string. */
  asHTML(): string;

  override toString(): string;

  #DataModelValidationError: true;
}

declare namespace DataModelValidationFailure {
  /** @internal */
  interface _ConstructorOptions extends ErrorOptions {
    /** The value that failed validation for this field. */
    invalidValue: unknown;

    /** The value it was replaced by, if any. */
    fallbackValue: unknown;

    /** The path of the field responsible for the failure. */
    fieldPath: string;

    /** Whether the value was dropped from some parent collection. */
    dropped: boolean;

    /** Whether this failure was unresolved. */
    unresolved: boolean;
  }

  interface ConstructorOptions extends InexactPartial<_ConstructorOptions> {}

  /** @internal */
  interface _ElementValidationFailure {
    /** Optionally a user-friendly name for the element. */
    name: string;
  }

  interface ElementValidationFailure extends InexactPartial<_ElementValidationFailure> {
    /** Either the element's index or some other identifier for it. */
    id: string | number;

    /** The element's validation failure. */
    failure: DataModelValidationFailure;
  }

  interface ToObjectReturn extends Pick<
    DataModelValidationFailure,
    "invalidValue" | "fallbackValue" | "dropped" | "message"
  > {}
}

export { DataModelValidationFailure, DataModelValidationError };
