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

  /** Validation failures for contained fields. */
  fields: Record<string, DataModelValidationFailure>;

  /** Validation failures for contained elements. */
  elements: DataModelValidationFailure.ElementValidationFailure[];

  /** The joint validation failure message for multiple contained fields. */
  joint: string | undefined;

  /** The error message. */
  message: string;

  /** Options forwarded to the Error constructor. */
  options: ErrorOptions;

  /** Whether this failure or one of its contained failures is unresolved. */
  unresolved: boolean;

  /** Whether this failure contains no sub-failures. */
  get empty(): boolean;

  /** Return this validation failure as an Error instance. */
  asError(): DataModelValidationError;

  /** Copy this failure's data to another failure. */
  copyTo(failure: DataModelValidationFailure): void;

  /** Retrieve the leaf node failure, or a sub-failure at a property path. */
  getFailure(key?: string): DataModelValidationFailure | null;

  /** Retrieve a flattened object of all leaf validation failures. */
  getAllFailures(): Record<string, DataModelValidationFailure>;

  /** Return the base properties of this failure, omitting nested failures. */
  toObject(): DataModelValidationFailure.ToObjectReturn;

  /** Represent this validation failure as a string. */
  toString(): string;

  /** Log the nested failures as a table. */
  logAsTable(): void;

  /** Generate a nested tree view of this failure as HTML. */
  asHTML(): string;

  /** @deprecated since v14 Use {@linkcode empty} instead. */
  isEmpty(): boolean;

  /** @deprecated since v14 Use {@linkcode fallbackValue} instead. */
  get fallback(): unknown;

  static #DataModelValidationFailure: true;
}

/**
 * A specialized Error to indicate a model validation failure.
 */
declare class DataModelValidationError extends Error {
  constructor(failure: DataModelValidationFailure | string, ...params: unknown[]);

  /** Retrieve the root failure, or a sub-failure at a property path. */
  getFailure(key?: string): DataModelValidationFailure | null;

  /** Retrieve a flattened object of all leaf validation failures. */
  getAllFailures(): Record<string, DataModelValidationFailure>;

  /** Log the nested failures as a table. */
  logAsTable(): void;

  /** Generate a nested tree view of this failure as HTML. */
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
