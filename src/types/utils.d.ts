/**
 * Recursively sets keys of an object to optional. Used primarily for update methods
 * @internal
 */
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/**
 * Make all properties in T optional and explicitly allow `undefined`
 * @internal
 */
type InexactPartial<T> = {
  [P in keyof T]?: T[P] | undefined;
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
      [KO in keyof O as KO extends `${infer A}.${string}` ? A : KO]: KO extends `${string}.${infer B}`
        ? Expanded<{ [EB in B]: O[KO] }>
        : Expanded<O[KO]>;
    }
  : O;

/**
 * Union type of the types of the values in `T`
 * @internal
 */
type ValueOf<T> = T extends Array<unknown> | ReadonlyArray<unknown> ? T[number] : T[keyof T];

/**
 * Transforms a string to lowercase and the first character to uppercase.
 * @internal
 */
type Titlecase<S extends string> = S extends `${infer A} ${infer B}`
  ? `${Titlecase<A>} ${Titlecase<B>}`
  : Capitalize<Lowercase<S>>;

/**
 * Deeply merge two types. If either of the given types is not an `object`, `U`
 * simply overwrites `T`.
 *
 * Nested properties of type `object` are merged recursively unless the property
 * in `U` is an `Array`.
 *
 * @typeParam T - The base type that `U` will be merged into.
 * @typeParam U - The type that will be merged into `T`.
 */
type Merge<T, U> = T extends object
  ? U extends Array<any> | ReadonlyArray<any>
    ? U
    : U extends object
    ? {
        [Key in keyof T | keyof U]: Key extends keyof T
          ? Key extends keyof U
            ? Merge<T[Key], U[Key]>
            : T[Key]
          : Key extends keyof U
          ? U[Key]
          : never;
      }
    : U
  : U;

/**
 * Instance of `T`, which may or may not be in a promise.
 * @typeParam T - the type which might be wrapped in a promise.
 */
type MaybePromise<T> = T | Promise<T>;

type StoredDocument<D extends { data: { _source: unknown } }> = D & {
  id: string;
  data: D["data"] & {
    _id: string;
    _source: D["data"]["_source"] & { _id: string };
  };
};

type TemporaryDocument<D> = D extends StoredDocument<infer U> ? U : D;

type PropertyTypeOrFallback<T, Key extends string, Fallback> = Key extends keyof T ? T[Key] : Fallback;

/**
 * Makes the given keys `K` of the type `T` required
 */
type RequiredProps<T, K extends keyof T> = Required<Pick<T, K>> & Omit<T, K>;
