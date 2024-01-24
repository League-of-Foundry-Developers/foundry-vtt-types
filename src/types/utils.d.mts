/**
 * Recursively sets keys of an object to optional. Used primarily for update methods
 * @internal
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

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
export type Merge<T, U> = T extends object
  ? U extends ReadonlyArray<any>
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
export type MaybePromise<T> = T | Promise<T>;

export type StoredDocument<D extends { data: { _source: unknown } }> = D & {
  id: string;
  data: D["data"] & {
    _id: string;
    _source: D["data"]["_source"] & { _id: string };
  };
};

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
> = Pick<BaseClass, keyof BaseClass> &
  Pick<MixinClass, keyof MixinClass> & {
    new (...args: ConstructorParameters<MixinClass>): InstanceType<BaseClass> & InstanceType<MixinClass>;
  };
