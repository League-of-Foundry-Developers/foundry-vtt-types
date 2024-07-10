import type { ConfiguredDocumentClass, DocumentConstructor } from "./helperTypes.d.mts";

/**
 * Recursively sets keys of an object to optional. Used primarily for update methods
 * @internal
 */
export type DeepPartial<T> = T extends unknown
  ? IsObject<T> extends true
    ? {
        [P in keyof T]?: DeepPartial<T[P]>;
      }
    : T
  : T;

/**
 * Make all properties in T optional and explicitly allow `undefined`
 * @internal
 */
export type InexactPartial<T> = {
  [P in keyof T]?: T[P] | undefined;
};

/**
 * Any valid class constructor.
 * @internal
 */
export type AnyClass = abstract new (...args: any[]) => any;

/**
 * References the constructor of type `T`
 * @internal
 */
export type ConstructorOf<T> = new (...args: any) => T;

/**
 * Expand an object that contains keys in dotted notation
 * @internal
 */
export type Expanded<O> =
  O extends Record<string, unknown>
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
export type ValueOf<T> = T extends ReadonlyArray<unknown> ? T[number] : T[keyof T];

/**
 * Gets the keys of `T` but excluding index signatures unlike `keyof T`. For example `Record<string, any> & { foo: number }` will produce `string` with `keyof` but `foo` with `ConcreteKeys`.
 */
export type ConcreteKeys<T> = T extends never
  ? never
  : keyof {
      [K in keyof T as string extends K ? never : number extends K ? never : symbol extends K ? never : K]: never;
    };

/**
 * Removes all index signatures from an object. Use this instead of `[K in keyof ConcreteKeys<T>]` to preserve modifiers e.g. readonly, or optional.
 */
export type RemoveIndexSignatures<T> = Pick<T, ConcreteKeys<T>>;

/**
 * Transforms a string to lowercase and the first character to uppercase.
 * @internal
 */
export type Titlecase<S extends string> = S extends `${infer A} ${infer B}`
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
export type Merge<T, U> =
  IsObject<U> extends true
    ? IsObject<T> extends true
      ? SimpleMerge<
          T,
          {
            [K in keyof U]: T extends { readonly [_ in K]?: infer V } ? Merge<V, U[K]> : U[K];
          }
        >
      : U
    : U;

/**
 * Returns whether the type is a plain object. Excludes functions and arrays while still being friendly to interfaces.
 */
export type IsObject<T> =
  // `Record<string, any>` can be a function or an array, so we need to exclude those
  T extends Record<string, any>
    ? T extends readonly any[]
      ? false
      : T extends (...args: any[]) => any
        ? false
        : true
    : false;

/**
 * A simple, non-recursive merge type.
 * @typeParam Target - the target type to merge into
 * @typeParam Override - the type whose properties override the ones in Target
 */
export type SimpleMerge<Target, Override> = Omit<Target, keyof Override> & Override;

/**
 * Instance of `T`, which may or may not be in a promise.
 * @typeParam T - the type which might be wrapped in a promise.
 */
export type MaybePromise<T> = T | Promise<T>;

export type StoredDocument<D extends { _source: unknown }> = D & {
  id: string;
  _id: string;
  _source: D["_source"] & { _id: string };
};

export type ConfiguredStoredDocument<T extends DocumentConstructor> = StoredDocument<
  InstanceType<ConfiguredDocumentClass<T>>
>;

export type TemporaryDocument<D> = D extends StoredDocument<infer U> ? U : D;

export type PropertyTypeOrFallback<T, Key extends string, Fallback> = Key extends keyof T ? T[Key] : Fallback;

/**
 * Makes the given keys `K` of the type `T` required
 */
export type RequiredProps<T, K extends keyof T> = Required<Pick<T, K>> & Omit<T, K>;

export type AnyConstructorFor<Class extends abstract new (...args: any[]) => any> = Pick<Class, keyof Class> &
  (Class extends new (...args: any[]) => any
    ? new (...args: any[]) => InstanceType<Class>
    : abstract new (...args: any[]) => InstanceType<Class>);

export type Mixin<
  MixinClass extends new (...args: any[]) => any,
  BaseClass extends abstract new (...args: any[]) => any,
> = MixinClass & BaseClass;

type GetDataConfigOptions<T> = {
  partial: Partial<T> & Record<string, unknown>;
  exact: T;
  object: object;
};

type GetDataConfigOption = GetDataConfig extends {
  mode: keyof GetDataConfigOptions<unknown> & infer Mode;
}
  ? Mode
  : "object";

export type GetDataReturnType<T extends object> = GetDataConfigOptions<T>[GetDataConfigOption];
