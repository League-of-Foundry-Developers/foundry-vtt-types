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
 * If `T` is `Promise<TResult>` then `TResult`; otherwise `T`.
 * @typeParam T - the type which, if a Promise, will be unwrapped.
 */
type PromisedType<T> = T extends Promise<infer TResult> ? TResult : T;

type StoredDocument<D extends { _source: unknown }> = D & {
  id: string;
  _source: D['_source'] & { _id: string };
};

type TemporaryDocument<D> = D extends StoredDocument<infer U> ? U : D;

type PropertyTypeOrFallback<T, Key extends string, Fallback> = Key extends keyof T ? T[Key] : Fallback;

type SimpleMerge<T, U> = Omit<T, keyof U> & U;

/**
 * Makes the given keys `K` of the type `T` required
 */
type RequiredProps<T, K extends keyof T> = SimpleMerge<T, Required<Pick<T, K>>>;

/**
 * Makes the given keys `K` of the type `T` partial.
 */
type PartialProps<T, K extends keyof T> = SimpleMerge<T, Partial<Pick<T, K>>>;

/**
 * Makes the given keys `K` of the type `T` readonly.
 */
type ReadonlyProps<T, K extends keyof T> = SimpleMerge<T, Readonly<Pick<T, K>>>;

/**
 * Return whether the value `V` is in the union `U`.
 */
type InUnion<V, U> = Equals<V extends U ? true : never, true>;

/**
 * Returns whether `T` loosely equals `U`. This equality is looser than `Equals` because if `T` or `U` are `any` it will always return true.
 */
type LooseEquals<T, U> = [T] extends [U] ? ([U] extends [T] ? true : false) : false;

/**
 * Built as a analog to `&&`. Returns whether both `T` and `U` are true.
 */
type And<T extends boolean, U extends boolean> = LooseEquals<T, true> extends true ? LooseEquals<U, true> : false;

/**
 * @see {@link And}
 *
 * @remarks Trying to express something like `A && B && C && ...` quickly becomes unwieldy with just `And` so this function becomes more convenient to call.
 */
type AndList<T extends boolean[]> = LooseEquals<T[number] extends false ? false : never, never>;

/**
 * Built as a analog to `||`. Returns whether either `T` or `U` is true.
 */
type Or<T extends boolean, U extends boolean> = LooseEquals<T, true> extends true ? true : LooseEquals<U, true>;

/**
 * @see {@link Or}
 *
 * @remarks Trying to express something like `A || B || C || ...` quickly becomes unwieldy with just `Or` so this function becomes more convenient to call.
 */
type OrList<T extends boolean[]> = T[number] extends false ? false : true;

/**
 * Returns whether `T` is _exactly_ `any`.
 *
 * @privateRemarks
 * This type works because of specific unsoundness of `any` specifically that `any` breaks transitivity. If Typescript were fully sound when a given `T` extends `U` and `U` extends `T` they would have to be strictly equal. This is in short because extends is similar to `>=` or `⊆` (notation for is a subset of or equal to) where a condition like `a >= b && b >= a` can be true is if `a === b`. However `any` will always extend `T` and vice versa unless `T` is `never` which nothing extends except `never`.
 * For this reason `LooseEquals<0, T>` will be true if `T` is `0` or `any`. `0` is an entirely arbitrary choice but for any arbitrary choice like it `IsAny<0>` should return false. To ensure this we use another property of `any` which is that `any | T` strictly equals `any`. We chose `1` here leading to the full type `LooseEquals<0, 1 | T>`. With this neither `0`, `1`, `number`, nor any other existing type can meet this condition except `any`.
 */
type IsAny<T> = LooseEquals<0, 1 | T>;

/**
 * Returns whether `T` is exactly `U`. Unlike `LooseEquals` if `T` or `U` are `any` while the other is not this will return false.
 */
type Equals<T, U> = And<LooseEquals<T, U>, LooseEquals<IsAny<T>, IsAny<U>>>;

/**
 * An analog to `!`. Returns true if `T` is false and returns false otherwise.
 */
type Not<T extends boolean> = LooseEquals<T, true> extends true ? false : true;

/**
 * Returns whether the key `K` is in `T`.
 */
type KeyIn<K, T> = SingleExtends<K extends keyof T ? true : never, true>;

type SingleExtends<T, U> = T extends U ? true : false;
type Extends<T, U> = LooseEquals<T extends U ? true : never, true>;

/**
 * Makes `T` partial if `B` is true and returns `T` otherwise.
 */
type PartialIf<T, B extends boolean> = Extends<B, true> extends true ? Partial<T> : T;

type AllKeysOf<T> = T extends unknown ? keyof T : never;

type GetKey<T, K extends string | number | symbol, D = undefined> = T extends unknown
  ? K extends keyof T
    ? T[K]
    : D
  : never;

type NullishCoalesce<T, D> = T extends unknown ? (T extends undefined | null ? D : T) : never;

type RemoveIndex<T> = {
  [K in keyof T as string extends K ? never : number extends K ? never : symbol extends K ? never : K]: T[K];
};

type OptionalChaining<T, K extends string | number | symbol> = T extends unknown
  ? K extends keyof T
    ? T[K]
    : undefined
  : never;

type IsPropertyOptional<T, K extends keyof T> = { [_ in K]?: any } extends T ? true : false;

type OptionalProperties<T> = keyof T extends unknown
  ? IsPropertyOptional<T, keyof T> extends true
    ? keyof T
    : never
  : never;

type RequiredProperties<T> = keyof T extends unknown
  ? IsPropertyOptional<T, keyof T> extends true
    ? never
    : keyof T
  : never;

type ExpandDeep<T> = T extends Record<string | number | symbol, unknown>
  ? T extends unknown
    ? { [K in keyof T]: ExpandDeep<T[K]> }
    : never
  : T;

/**
 * Expands the type representation of a complex type such that the final result is computed and displayed, e.g. `{ foo: 123 } | { bar: 456 }` instead of `ComplexOperation<T>`.
 *
 * @privateRemarks the type representation of Typescript is undefined so it is possible at any moment that this method becomes unreliable.
 */
type Expand<T> = T extends unknown
  ? {
      [K in keyof T]: T[K];
    }
  : never;

type ItemExtends<T, U> = T extends unknown ? LooseEquals<T extends U ? true : never, true> : never;

type Coalesce<T, C, D> = T extends C ? D : T;
