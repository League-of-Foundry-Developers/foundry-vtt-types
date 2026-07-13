import type { Identity } from "#utils";

/**
 * A symbol used to reference the operator value which ensures it does not collide with a proxied key of that value.
 */
export declare const OPERATOR_VALUE: unique symbol;

/**
 * A unique string used in serialization to identify that an object should be deserialized to a `DataFieldOperator`.
 */
export declare const OPERATOR_IDENTIFIER: "__$OPERATOR$__";

/** A base class used for all special database operations. */
declare class DataFieldOperator<Value = undefined> {
  constructor(value?: Value);

  [OPERATOR_VALUE]: Value;

  toJSON(): string;

  /**
   * Create a `DataFieldOperator` using a provided value.
   * @privateRemarks The return is widened to `.Any` for subclassing purposes.
   */
  static create<Value = undefined>(value?: Value): DataFieldOperator.Any;

  /**
   * Retrieve the inner value of the `DataFieldOperator`, or return the value passed if not a `DataFieldOperator`.
   */
  static get<Target>(value: Target): DataFieldOperator.UnwrapIfDFO<Target>;

  /**
   * Assign the inner value of the DataFieldOperator.
   */
  static set<Value = undefined>(operator: DataFieldOperator.Any, value?: Value): Value;

  /**
   * A comparison helper function that asserts whether two values are equal when one or both values may be
   * `DataFieldOperator` instances.
   * @privateRemarks Since passed `DataFieldOperator`s get unwrapped, we can't be narrower than this.
   */
  static equals(a: unknown, b: unknown): boolean;
}

declare namespace DataFieldOperator {
  interface Any extends AnyDataFieldOperator {}
  interface AnyConstructor extends Identity<typeof AnyDataFieldOperator> {}

  type UnwrapIfDFO<Target> = Target extends DataFieldOperator<infer Value> ? Value : Target;
}

/**
 * Force the deletion of a certain DataModel field, resetting its value back to undefined.
 * @privateRemarks Doesn't use the passed `Value`, just calls `super()`, so `undefined`
 */
declare class ForcedDeletion extends DataFieldOperator<undefined> {
  constructor(_value?: undefined);

  // fake type override
  static override create(): ForcedDeletion;
}

declare class ForcedReplacement<Value = undefined> extends DataFieldOperator<DataFieldOperator.UnwrapIfDFO<Value>> {
  constructor(value?: Value);

  override [OPERATOR_VALUE]: DataFieldOperator.UnwrapIfDFO<Value>;

  /**
   * Create a `ForcedReplacement` instance that is wrapped in a `Proxy` so that it can be inspected.
   */
  static override create<Value = undefined>(
    value?: Value,
  ): ForcedReplacement.CreateReturn<DataFieldOperator.UnwrapIfDFO<Value>>;
}

declare namespace ForcedReplacement {
  interface Any extends AnyForcedReplacement {}
  interface AnyConstructor extends Identity<typeof AnyForcedReplacement> {}

  // eslint-disable-next-line @typescript-eslint/no-empty-object-type -- we want it to collapse on intersection
  type CreateReturn<Value> = ForcedReplacement<Value> & (Value extends object ? Value : {});
}

/**
 * Reconstruct a DataFieldOperator instance from a serialized object.
 */
declare function reconstructOperator<Object extends reconstructOperator.ReconstructionObject>(
  obj: Object,
): reconstructOperator.Return<Object>;

declare namespace reconstructOperator {
  interface ReconstructionObject {
    [OPERATOR_IDENTIFIER]: string;
    value?: unknown;
  }

  type Return<Object> = Object extends { [OPERATOR_IDENTIFIER]: "ForcedDeletion" }
    ? ForcedDeletion
    : Object extends { [OPERATOR_IDENTIFIER]: "ForcedReplacement"; value: infer Value }
      ? ForcedReplacement.CreateReturn<Value>
      : never;
}

export { DataFieldOperator, ForcedDeletion, ForcedReplacement, reconstructOperator };

declare abstract class AnyDataFieldOperator extends DataFieldOperator<unknown> {
  constructor(...args: never);
}

declare abstract class AnyForcedReplacement extends ForcedReplacement<unknown> {
  constructor(...args: never);
}
