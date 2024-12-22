import type { Document } from "../foundry/common/abstract/module.d.mts";
import type * as utils from "../utils/index.d.mts";

/**
 * @deprecated import from `fvtt-types/utils` instead.
 */
export type DeepPartial<T> = utils.DeepPartial<T>;

/**
 * @deprecated import from `fvtt-types/utils` instead.
 */
export type AllKeysOf<T extends object> = utils.AllKeysOf<T>;

/**
 * @deprecated import from `fvtt-types/utils` instead.
 */
export type InexactPartial<T extends object, K extends utils.AllKeysOf<T> = utils.AllKeysOf<T>> = utils.InexactPartial<
  T,
  K
>;

/**
 * @deprecated import from `fvtt-types/utils` instead.
 */
export type NullishProps<T extends object, K extends utils.AllKeysOf<T> = utils.AllKeysOf<T>> = utils.NullishProps<
  T,
  K
>;

/**
 * @deprecated - Deprecated with no replacement. This type is almost always an anti-pattern because
 * going from the instance-side of a class to a constructor loses static properties. Where you would
 * reach for `ConstructorOf<T>` you should instead generally use the class directly. Specifically use
 * `ClassName.AnyConstructor` if that exists or make `AnyConstructor` yourself.
 *
 * The `AnyConstructor` type differentiates itself from `typeof ClassName` by truly allowing any
 * constructor, including abstract ones unlike `ConstructorOf`. Writing `AnyConstructor` is a manual
 * process and is likely impossible to ergonomically automate.
 *
 * The reason why `AnyConstructor` has to be written manually is because of a few reasons that
 * culminate in a human authorship being required. Firstly the type parameters must be given the most
 * appropriate supertype. For most type parameters this is their constraint.
 *
 * For example `T extends number` in most cases should probably be substituted with `number`. However
 * formally speaking this depends on the variance of `T`. `never` is more appropriate for contravariant
 * type parameters and `any` is the only appropriate type for invariant type parameters.
 *
 * This determination could be done automatically in a type but a lack of first class higher-kinded type
 * support makes it impossible to pass a generic constructor of any size and operate over its type parameters
 * and bounds. There are in theory ways more limited ways involving passing it through a `HKT` interface but
 * would require breaking the signature of `ConstructorOf` anyways and is probably more boilerplate than its worth.
 */
export type ConstructorOf<T> = new (arg0: never, ...args: never[]) => T;

/**
 * @deprecated import from `fvtt-types/utils` instead.
 */
export type Expanded<O> = utils.Expanded<O>;

/**
 * @deprecated import from `fvtt-types/utils` instead.
 */
export type ValueOf<T> = utils.ValueOf<T>;

/**
 * @deprecated import from `fvtt-types/utils` instead.
 */
export type ConcreteKeys<T> = utils.ConcreteKeys<T>;

/**
 * @deprecated import from `fvtt-types/utils` instead.
 */
export type RemoveIndexSignatures<T extends AnyObject> = utils.RemoveIndexSignatures<T>;

/**
 * @deprecated import from `fvtt-types/utils` instead.
 */
export type Titlecase<S extends string> = utils.Titlecase<S>;

/**
 * @deprecated import from `fvtt-types/utils` instead.
 */
export type Merge<T, U> = utils.Merge<T, U>;

/**
 * @deprecated import from `fvtt-types/utils` instead.
 */
export type IsObject<T> = utils.IsObject<T>;

/**
 * @deprecated import from `fvtt-types/utils` instead.
 */
export type SimpleMerge<Target, Override> = utils.SimpleMerge<Target, Override>;

/**
 * @deprecated - {@link GetKey | `GetKey`}
 */
export type PropertyTypeOrFallback<T, Key extends string, Fallback> = Key extends keyof T ? T[Key] : Fallback;

/**
 * @deprecated import from `fvtt-types/utils` instead.
 */
export type RequiredProps<T, K extends keyof T> = utils.RequiredProps<
  Extract<T, object>,
  Extract<K, utils.AllKeysOf<Extract<T, object>>>
>;

/**
 * @deprecated import from `fvtt-types/utils` instead.
 */
export type Mixin<MixinClass extends AnyConcreteConstructor, BaseClass extends AnyConstructor> = utils.Mixin<
  MixinClass,
  BaseClass
>;

/**
 * @deprecated import from `fvtt-types/utils` instead.
 */
export type GetDataReturnType<T extends object> = utils.GetDataReturnType<T>;

/**
 * @deprecated import from `fvtt-types/utils` instead.
 */
export type HandleEmptyObject<T extends object, D extends object = EmptyObject> = utils.HandleEmptyObject<T, D>;

/**
 * @deprecated import from `fvtt-types/utils` instead.
 */
export type AnyObject = utils.AnyObject;

/**
 * @deprecated import from `fvtt-types/utils` instead.
 */
export type AnyMutableObject = utils.AnyMutableObject;

/**
 * @deprecated import from `fvtt-types/utils` instead.
 */
export type AnyArray = utils.AnyArray;

/**
 * @deprecated import from `fvtt-types/utils` instead.
 */
export type MutableArray<T> = utils.MutableArray<T>;

/**
 * @deprecated import from `fvtt-types/utils` instead.
 */
export type AnyFunction = utils.AnyFunction;

/**
 * @deprecated import from `fvtt-types/utils` instead.
 */
export type AnyConstructor = utils.AnyConstructor;

/**
 * @deprecated import from `fvtt-types/utils` instead.
 */
export type AnyConcreteConstructor = utils.AnyConcreteConstructor;

/**
 * @deprecated import from `fvtt-types/utils` instead.
 */
export type MustBePromise<T> = utils.MustBePromise<T>;

/**
 * @deprecated import from `fvtt-types/utils` instead.
 */
export type MaybePromise<T> = utils.MaybePromise<T>;

/**
 * @deprecated import from `fvtt-types/utils` instead.
 */
export type NonNullish = utils.NonNullish;

/**
 * @deprecated import from `fvtt-types/utils` instead.
 */
export type EmptyObject = utils.EmptyObject;

/**
 * @deprecated import from `fvtt-types/utils` instead.
 */
export type ShapeWithIndexSignature<
  T extends utils.AnyObject,
  // Uses `extends object` to allow interfaces and if useful other objects.
  PrimaryShape extends object,
  IndexSignature extends PropertyKey,
  IndexType,
> = utils.ShapeWithIndexSignature<T, PrimaryShape, IndexSignature, IndexType>;

/**
 * @deprecated import from `fvtt-types/utils` instead.
 */
export type Defer<T> = utils.Defer<T>;

/**
 * @deprecated {@link Document.ToConfiguredStored | `Document.ToConfiguredStored`}
 */
export type ConfiguredStoredDocument<T extends Document.AnyConstructor> = Document.ToConfiguredStored<T>;

/**
 * @deprecated {@link Document.Stored | `Document.Stored`}
 */
export type StoredDocument<D extends { _source: unknown }> = Document.Stored<
  utils.MakeConform<D, Document.Internal.Instance.Any>
>;

/**
 * @deprecated {@link Document.Temporary | `Document.Temporary`}
 */
export type TemporaryDocument<D> = Document.Temporary<utils.MakeConform<D, Document.Internal.Instance.Any>>;
