import type { Document } from "../foundry/common/abstract/module.d.mts";
import type { MakeConform } from "./helperTypes.d.mts";

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
 * References the constructor of type `T`
 * @internal
 */
export type ConstructorOf<T> = new (arg0: never, ...args: never[]) => T;

/**
 * Expand an object that contains keys in dotted notation
 * @internal
 */
export type Expanded<O> = O extends AnyObject
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
export type ValueOf<T> = T extends ReadonlyArray<infer V> ? V : T[keyof T];

type OmitIndex<K extends PropertyKey> = string extends K
  ? never
  : number extends K
    ? never
    : symbol extends K
      ? never
      : K;

/**
 * Gets the keys of `T` but excluding index signatures unlike `keyof T`. For example `Record<string, any> & { foo: number }` will produce `string` with `keyof` but `foo` with `ConcreteKeys`.
 */
export type ConcreteKeys<T> = T extends never
  ? never
  : keyof {
      [K in keyof T as OmitIndex<K>]: never;
    };

/**
 * Removes all index signatures from an object. Use this instead of `[K in keyof ConcreteKeys<T>]` to preserve modifiers e.g. readonly, or optional.
 */
// DO NOT CHANGE (LukeAbby): It may seem easier to write `Pick<T, ConcreteKeys<T>>` but this behaves poorly with generic parameters.
// See: https://www.typescriptlang.org/play/?#code/KYDwDg9gTgLgBDAnmYcDCEB2BjKwbADSwiAzgDwAqAfHALxwDWJEAZnAN4BQccA2oTgBLTExbtKcAIak4pGFBEBzOKAKYAJrMEB+OJmAA3YFDgAufQFcAtgCMTqkOq1xd+ow4ulEdiABtHZ204PQNjUwtCAF0LMJMAbi4AX0SuJBQ4ACVgawhjAElNUABlISVMKRhLPAoaejgABSFsRioAGnQsXHwiElrqalTsPxlZABFKqQBZCA1gP3Ji7AALHKlabl454ak8OFy5vwts3IKikFLyyurgCiXV63Xkri4d0lliy1sZw8WVtcCwE0sg4cCUQJMzQaUAgYAsUkwiHi-EIXgUyhiVjsDiStDUQJcExg01m8z+D3WnB4+3wy1mAAoAJRU3i8AD0bLglGWQlkYBhKCgiDkdMsfg0jl58FslngGggt0wAHIYAA6am8GA80iqg7zVXggyKbDQ2GpVkIbW60l+VVSWzYRK8JLJIA
export type RemoveIndexSignatures<T extends AnyObject> = {
  [K in keyof T as OmitIndex<K>]: T[K];
};

/**
 * Transforms a string to lowercase and the first character to uppercase.
 * @internal
 */
export type Titlecase<S extends string> = S extends `${infer A} ${infer B}`
  ? `${Titlecase<A>} ${Titlecase<B>}`
  : Capitalize<Lowercase<S>>;

/**
 * Deeply merge two types. If either of the given types is not an object then `U`
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
 *
 * @example
 * ```ts
 * interface ObjectInterface {
 *  prop: number;
 * }
 *
 * type Interface = IsObject<ObjectInterface>; // true
 * type Object = IsObject<{ prop: number }>; // true
 * type Array = IsObject<number[]>; // false
 * type Function = IsObject<() => void>; // false
 *
 * // By comparison, simply comparing against `Record<string, unknown>` fails.
 * type RecordFails = Interface extends Record<string, unknown> ? true : false; // false
 * ```
 */
// eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style
export type IsObject<T> = T extends { readonly [K: string]: any }
  ? T extends AnyArray | AnyFunction
    ? false
    : true
  : false;

/**
 * A simple, non-recursive merge type.
 * @typeParam Target - the target type to merge into
 * @typeParam Override - the type whose properties override the ones in Target
 */
export type SimpleMerge<Target, Override> = Omit<Target, keyof Override> & Override;

export type PropertyTypeOrFallback<T, Key extends string, Fallback> = Key extends keyof T ? T[Key] : Fallback;

/**
 * Makes the given keys `K` of the type `T` required
 */
export type RequiredProps<T, K extends keyof T> = Required<Pick<T, K>> & Omit<T, K>;

export type Mixin<MixinClass extends AnyConcreteConstructor, BaseClass extends AnyConstructor> = MixinClass & BaseClass;

interface GetDataConfigOptions<T> {
  partial: Partial<T> & Record<string, unknown>;
  exact: T;
  object: object;
}

type GetDataConfigOption = GetDataConfig extends {
  mode: infer Mode extends keyof GetDataConfigOptions<unknown>;
}
  ? Mode
  : "object";

export type GetDataReturnType<T extends object> = GetDataConfigOptions<T>[GetDataConfigOption];

/**
 * Replaces the type `{}` with `Record<string, never>` by default which is
 * usually a better representation of an empty object. The type `{}` actually
 * allows any type be assigned to it except for `null` and `undefined`.
 *
 * The theory behind this is that all non-nullish types allow
 * you to access any property on them without erroring. Primitive types like
 * `number` will not store the property but it still will not error to simply
 * try to get and set properties.
 *
 * The type `{}` can appear for example after operations like `Omit` if it
 * removes all properties rom an object, because an empty interface was given,
 * or so on.
 *
 * @example
 * ```ts
 * type ObjectArray<T extends Record<string, unknown>> = T[];
 *
 * // As you would hope a union can't be assigned. It errors with:
 * // "type 'string' is not assignable to type 'Record<string, unknown>'."
 * type UnionErrors = ObjectArray<string | { x: number }>;
 *
 * // However, this works.
 * type EmptyObjectArray = ObjectArray<{}>;
 *
 * // But it allows likely unsound behavior like this:
 * const emptyObject: EmptyObjectArray = [1, "foo", () => 3];
 *
 * // So it may be better to define `ObjectArray` like so:
 * type ObjectArray<T extends Record<string, unknown>> = HandleEmptyObject<T>[];
 *
 * // If it were, then this line would error appropriately!
 * const emptyObject: EmptyObjectArray = [1, "foo", () => 3];
 * ```
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type HandleEmptyObject<T extends AnyObject, D extends AnyObject = EmptyObject> = [{}] extends [T] ? D : T;

/**
 * This type allows any plain objects. In other words it disallows functions
 * and arrays.
 *
 * Use this type instead of:
 * - `object`/`Record<any, any>` - This allows functions, classes, and arrays.
 * - `{}` - This type allows anything besides `null` and `undefined`.
 * - `Record<string, unknown>` - This is the appropriate type for any mutable object but doesn't allow readonly objects.
 */
// This type is not meant to be extended and it has to use an indexed type.
// eslint-disable-next-line @typescript-eslint/consistent-type-definitions, @typescript-eslint/consistent-indexed-object-style
export type AnyObject = {
  readonly [K: string]: unknown;
};

/**
 * This type allows mutable plain objects. This means readonly objects cannot be
 * assigned.
 *
 * Use this type instead of:
 * - `object` - This allows functions and arrays.
 * - `Record<string, any>`/`{}` - These allows anything besides `null` and `undefined`.
 * - `Record<string, unknown>` - These types are equivalent but `AnyMutableObject` is preferred for explicitness.
 */
// eslint-disable-next-line @typescript-eslint/consistent-type-definitions, @typescript-eslint/consistent-indexed-object-style
export type AnyMutableObject = {
  [K: string]: unknown;
};

/**
 * Use this type to allow any array. This allows readonly arrays which is
 * generally what you want. If you need a mutable array use the
 * {@link MutableArray | `MutableArray`} type instead of the builtin `T[]` or
 * `Array` types. This allows us to be more explicit about intent.
 *
 * Consider being more specific if possible. You should generally try to use a
 * concrete array with a union or add a type parameter first.
 *
 * Use this instead of:
 * - `any[]` - When elements of this array are accessed you get `any` which is not safe.
 * - `unknown[]` - This is the appropriate type for any mutable array but doesn't allow readonly arrays.
 */
export type AnyArray = readonly unknown[];

/**
 * Use this type to allow a mutable array of type `T`. Only use this if the
 * array can be soundly mutated. Otherwise you should be using
 * `readonly T[]` or {@link ReadonlyArray | `ReadonlyArray`}
 */
export type MutableArray<T> = Array<T>;

/**
 * Use this type to allow any function. Notably since this allows any function
 * it is difficult to call the function in a safe way. This means its uses are
 * mostly niche and it should be avoided.
 *
 * Make sure you have a good reason to use this type. It is almost always better
 * to use a more specific function type. Please consider leaving a comment about
 * why this type is necessary.
 *
 * Use this instead of:
 * - `Function` - This refers to the fundamental `Function` object in JS. It allows classes.
 * - `(...args: any[]) => any` - If someone explicitly accesses the parameters or uses the return value you get `any` which is not safe.
 * - `(...args: any[]) => any` - If someone explicitly accesses the parameters or uses the return value you get `any` which is not safe.
 * - `(...args: unknown[]) => unknown` - This allows obviously unsound calls like `fn(1, "foo")` because it indicates it can take any arguments.
 */
// The explicit arg0 does not prevent a function with no arguments from being assigned to `AnyFunction` because any function that takes less arguments can be assigned to one that takes more.
// The point of this is to prevent it from being possible to call with 0 arguments.
// never is used to make it impossible to call with anything besides `never` or `any`. This makes it the most type safe way to define any function.
export type AnyFunction = (arg0: never, ...args: never[]) => unknown;

/**
 * Use this type to allow any class, abstract class, or class-like constructor.
 *
 * See {@link AnyConcreteConstructor | `AnyConcreteConstructor`} if you cannot
 * allow abstract classes. Please also consider writing a comment
 * explaining why {@link AnyConcreteConstructor | `AnyConcreteConstructor`} is
 * necessary.
 *
 * @example
 * ```ts
 * const concrete: AnyConstructor = class Concrete { ... }
 * const abstract: AnyConstructor = abstract class Abstract { ... }
 *
 * // `Date` is not actually a class but it can be used as a constructor.
 * const classLike: AnyConstructor = Date;
 * ```
 */
export type AnyConstructor = abstract new (arg0: never, ...args: never[]) => unknown;

/**
 * Use this type to allow any class or class-like constructor but disallow
 * class-like constructors.
 *
 * Use this type only when abstract classes would be problematic such as the
 * base type of a mixin. Please consider writing a comment explaining why.
 * See {@link AnyConstructor | `AnyConstructor`} to also allow abstract classes.
 *
 * @example
 * ```ts
 * const concrete: AnyConcreteConstructor = class Concrete { ... }
 *
 * // `Date` is not actually a class but it can be used as a constructor.
 * const classLike: AnyConcreteConstructor = Date;
 *
 * // This next line errors:
 * const abstract: AnyConcreteConstructor = abstract class Abstract { ... }
 * ```
 */
export type AnyConcreteConstructor = new (arg0: never, ...args: never[]) => unknown;

/**
 * This type is equivalent to `Promise<T>` but exists to give an explicit signal
 * that this is not a mistake. When Foundry accepts an asynchronous callback the
 * vast majority of the time it is best to use {@link MaybePromise | `MaybePromise`}.
 *
 * By doing it this way the maximum flexibility is given to the definer of the
 * callback. This is okay because typically asynchronous callbacks are simply
 * awaited, meaning that there's no noticeable difference between a `Promise`
 * and {@link MaybePromise | `MaybePromise`}. Even functions like
 * {@link Promise.allSettled | `Promise.allSettled`} function correctly
 * with {@link MaybePromise | `MaybePromise`}.
 *
 * Do not use this type or {@link MaybePromise | `MaybePromise`} for the return
 * type of asynchronous methods on classes. For example for
 * {@link foundry.abstract.Document._preCreate | `Document#_preCreate`} the typing
 * should be `Promise<void>` and not this type. In theory we could use
 * {@link MaybePromise | `MaybePromise`} in this context as well but this seems
 * more likely to be confusing than to be helpful.
 *
 * Use this type only in the rare case where a callback's return type must be a
 * `Promise`, for example if `promise.then` or `promise.catch` is explicitly
 * called. Please also writing a comment explaining why
 * {@link MaybePromise | `MaybePromise`} is problematic in this context.
 */
export type MustBePromise<T> = Promise<T>;

/**
 * Use when a type may be either a promise or not. This is most useful in
 * asynchronous callbacks where in most cases it's sound to provide a synchronous
 * callback instead.
 *
 * If it is not sound to provide a non-Promise for whatever reason, see
 * {@link MustBePromise | `MustBePromise`} to declare this more explicitly than simply writing
 * `Promise<T>`.
 *
 * This should generally not be used in asynchronous methods. For example in
 * {@link foundry.abstract.Document._preCreate | `Document#_preCreate`} the typing
 * is `Promise<void>` because it's declared as an async method. Overriding an
 * asynchronous method with a synchronous method is more confusing than
 * helpful.
 */
export type MaybePromise<T> = T | Promise<T>;

/**
 * Use this to allow any type besides `null` or `undefined`.
 *
 * This type is equivalent to the type `{}`. It exists to give this type a
 * better name. `{}` is not a type representing an empty object. In reality it
 * allows assigning any type besides `null` or `undefined`. This is frustrating
 * but it seems the theory is supposed to be that all types except for `null`
 * and `undefined` will return `undefined` for any property accessed on them.
 *
 * Even primitives like `number` will not error when you get or even set a
 * property on them, although they will not preserve the property. Since the
 * only type that cannot be indexed is `null` or `undefined` this is the chosen
 * semantics of `{}` in TypeScript.
 */
// This type is not meant to be extended and it's meant to be the explicit version of what the type `{}` does, i.e. allow any type besides `null` or `undefined`.
// eslint-disable-next-line @typescript-eslint/consistent-type-definitions, @typescript-eslint/no-empty-object-type
export type NonNullish = {};

/**
 * This is the closest approximation to a type representing an empty object.
 *
 * Use instead of `{}` when you want to represent an empty object. `{}` actually
 * allows any type that is not `null` or `undefined`. see
 * {@link NonNullish | `NonNullish`} if you want that behavior.
 */
// It would be unsound to merge into so an interface is not used.
// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type EmptyObject = Record<string, never>;

declare const empty: unique symbol;

/**
 * Defer is a utility type that allows you to defer the evaluation of a type.
 * The use cases for this are extremely advanced. In essence they have to do with breaking cycles in evaluation.
 */
export type Defer<T> = [T][T extends any ? 0 : never];

/**
 * @deprecated {@link Document.ToConfiguredStored | `Document.ToConfiguredStored`}
 */
export type ConfiguredStoredDocument<T extends Document.AnyConstructor> = Document.ToConfiguredStored<T>;

/**
 * @deprecated {@link Document.Stored | `Document.Stored`}
 */
export type StoredDocument<D extends { _source: unknown }> = Document.Stored<
  MakeConform<D, Document.Internal.Instance.Any>
>;

/**
 * @deprecated {@link Document.Temporary | `Document.Temporary`}
 */
export type TemporaryDocument<D> = Document.Temporary<MakeConform<D, Document.Internal.Instance.Any>>;
