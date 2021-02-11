/**
 * Recursively sets keys of an object to optional. Used primarily for update methods
 * @internal
 */
declare type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/**
 * References the constructor of type `T`
 * @internal
 */
type ConstructorOf<T> = new (...args: any) => T;

/**
 * Omit properties of `T` which are of type `U`.
 *
 * @typeParam T - Object type from which properties will be omitted.
 * @typeParam U - Properties of this type will be omitted.
 * @internal
 */
type OmitOfType<T extends object, U> = { [k in keyof T as T[k] extends U ? never : k]: T[k] };

/**
 * If T extends `U`, the resulting type is `R`, otherwise it is `T`.
 *
 * @typeParam T - Original type.
 * @typeParam U - Only convert types of this type.
 * @typeParam R - Adjust to this type.
 * @internal
 */
type TypeToType<T, U, R> = T extends U ? R : T;

/**
 * Map the types of properties of `T` to `R` if they are of type `U`.
 *
 * @typeParam T - Object type that will have its properties' types adjusted.
 * @typeParam U - Adjust the types of properties of this type.
 * @typeParam R - Type that properties' types will be adjusted to.
 * @internal
 */
type MapTypeToType<T, U, R> = { [k in keyof T]: TypeToType<T[k], U, R> };

/**
 * Omit properties of `T` which are assignable from `U`.
 *
 * @typeParam T - Object type that will have its properties omitted.
 * @typeParam U - Properties with types that are assignable from this type will be omitted.
 * @internal
 */
type OmitAssignableFromType<T extends object, U> = { [k in keyof T as U extends T[k] ? never : k]: T[k] };

/**
 * Omit properties of `T` which are not assignable from `U`.
 *
 * @typeParam T - Object type that will have its properties omitted.
 * @typeParam U - Properties with types that are not assignable from this type will be omitted.
 * @internal
 */
type OmitNotAssignableFromType<T extends object, U> = { [k in keyof T as U extends T[k] ? k : never]: T[k] };

/**
 * Expand an object that contains keys in dotted notation
 * @internal
 */
type Expanded<O> = O extends Record<string, unknown>
  ? {
      [KO in keyof O]: KO extends `${infer A}.${infer B}` //`
        ? { [EA in A]: Expanded<{ [EB in B]: O[KO] }> }
        : { [K in KO]: Expanded<O[KO]> };
    }[keyof O]
  : O;
