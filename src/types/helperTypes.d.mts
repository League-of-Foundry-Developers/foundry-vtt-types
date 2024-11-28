import type { DatabaseOperationMap, Operation } from "../foundry/common/abstract/document.d.mts";
import type Document from "../foundry/common/abstract/document.d.mts";
import type { ConfiguredDocuments } from "./configuredDocuments.d.mts";
import type { AnyFunction, AnyObject, EmptyObject } from "./utils.d.mts";

export type ModuleRequiredOrOptional<Name extends string> = Name extends keyof RequiredModules ? never : undefined;

export type ConfiguredModuleData<Name extends string> = Name extends keyof ModuleConfig
  ? ModuleConfig[Name]
  : EmptyObject;

export type ConfiguredModule<Name extends string> =
  ModuleRequiredOrOptional<Name> extends never
    ? ConfiguredModuleData<Name>
    :
        | ({ active: true } & ConfiguredModuleData<Name>)
        // flawed, can't use `key in module` this way, but omitting the Partial Record type kills nullish
        // collocating, which is probably the better DX.
        | ({ active: false } & Record<keyof ConfiguredModuleData<Name>, undefined>);

/** Keys of functions of console.log / globalThis.logger */
export type LoggingLevels = "debug" | "log" | "info" | "warn" | "error";

/**
 * `GetKey` accesses a property while intentionally ignoring index signatures. This means `GetKey<Record<string, unknown>, "foo">` will return `never`.
 */
// Note(LukeAbby): There are two tricky cases:
// - `T = {}` would regularly always return `unknown`. The fix here adding a single dummy property `{ _?: any } & T`.
// - `T = never` would regularly always return `unknown`. The fix here is adding `_GetKey` which makes the type distributive and therefore `never` as an input becomes `never` in the output.
export type GetKey<T, K extends PropertyKey, D = never> = _GetKey<{ _?: any } & T, K, D>;

type _GetKey<T, K extends PropertyKey, D> = T extends { readonly [_ in K]?: infer V } ? V : D;

/**
 * `Partial` is usually the wrong type.
 * In order to make it easier to audit unintentional uses of `Partial` this type is provided.
 *
 * ### Picking the right helper type
 * - Favor `NullishProps` whenever it is valid. Allowing both `null` and
 *   `undefined` is convenient for the end user and it is very common that
 *   wherever `undefined` is valid so is `null`. For some examples it is valid
 *   for `options.prop ??= "default"`, `options.prop ||= "default"`,
 *   `if (options.prop) { ... }`, `if (options.prop == null)`, or so on.
 * - Use `IntentionalPartial` when an explicit `undefined` is problematic but
 *   leaving off the property entirely is fine. This primarily occurs when
 *   patterns like `options = { ...defaultOptions, ...options }`,
 *   `Object.assign({}, defaultOptions, options)`,
 *   `foundry.utils.mergeObject(defaultOptions, options)`, or so on.
 *
 *   Note that {@link foundry.utils.mergeObject | `foundry.utils.mergeObject`}
 *   also expands the object. So once `ExpandsTo` exists you should also use
 *   that helper type.
 *
 *   What these patterns have in common is that if `options` looks like
 *   `{ prop: undefined }` that will override whatever is in `defaultOptions`
 *   and may cause issues. Note that even if you see one of these patterns you
 *   also need to ensure that `undefined` would cause issues down the road
 *   before using `IntentionalPartial` as it could be an intended way of
 *   resetting a property.
 * - Use `InexactPartial` when `null` is problematic but `undefined` is not.
 *   The most common time this shows up is with the pattern
 *   `exampleFunction({ prop = "foo" } = {}) { ... }`.
 */
export type IntentionalPartial<T> = Partial<T>;

/**
 * This type is used to make a constraint where `T` must be statically known to overlap with `U`.
 *
 * @example
 * ```ts
 * // The `const T` allows inference to be a bit more specific. This is useful for a utility type like this.`
 * function takesNumber<const T>(input: OverlapsWith<T, number>): void {
 *   // This function body is an example of a method this might be useful for.
 *   // If the input isn't an number it simply returns in this case.
 *   if (typeof input !== "number") {
 *       return;
 *   }
 *
 *   // Assumes, unchecked, that `element` is a number.
 *   // This means an input like `number[] | string[]` would be unsound as it could be a string.
 *   element + 1;
 * }
 *
 * takesNumber(1); // Ok!
 * takesNumber("foo"); // Error, statically known to never an number and so presumed to be a mistake.
 * takesNumber(Math.random() > 0.5 ? 1 : "foo"); // Ok, `"foo"` doesn't actually cause any runtime issues, it was just disallowed above because then it'd never do anything useful.
 * ```
 */
export type OverlapsWith<T, U> = [Extract<T, U>, any] extends [U, Extract<T, U>] ? T : U extends T ? T : U;

/**
 * Used to build a constraint where `T` to overlap with `Item[]` but disallows unrelated arrays.
 * This is safer than what `OverlapsWith` provides as it ensures that if the type is an array it is an array of `Item`.
 * Assumes readonly arrays are permitted.
 *
 * Note that `never[]` and `any[]` are still accepted due to the unsoundness of those types.
 *
 * @example
 * ```ts
 * // The `const T` allows inference to be a bit more specific. This is useful for a utility type like this.`
 * function takesNumericArray<const T>(input: ArrayOverlaps<T, number>): void {
 *   // This function body is an example of a method this might be useful for.
 *   // If the input isn't an array it simply returns in this case.
 *   if (!Array.isArray(input)) {
 *       return;
 *   }
 *
 *   for (const element of input) {
 *       // Assumes, unchecked, that `element` is a number.
 *       // This means an input like `number[] | string[]` would be unsound as it could be a string.
 *       element + 1;
 *   }
 * }
 *
 * takesNumericArray([1, 2, 3]); // Ok!
 * takesNumericArray("foo"); // Error, statically known to never an array and so presumed to be a mistake.
 * takesNumericArray(Math.random() > 0.5 ? [1, 2, 3] : "foo"); // Ok, `"foo"` doesn't actually cause any runtime issues, it was just disallowed above because then it'd never do anything useful.
 * takesNumericArray(Math.random() > 0.5 ? [1, 2, 3] : ["foo", "bar"]); // Error, at runtime it could be an array of the wrong type and that isn't handled. Notably this would succeed with `OverlapsWith`.
 * ```
 */
export type ArrayOverlaps<T, Item> =
  Extract<T, readonly unknown[]> extends readonly Item[] ? OverlapsWith<T, readonly Item[]> : readonly Item[];

/**
 * Use this whenever a type is given that should match some constraint but is
 * not guaranteed to. For example when additional properties can be declaration
 * merged into an interface. When the type does not conform then `ConformTo` is
 * used instead.
 *
 * See `MustConform` for a version that throws a compilation error when the type
 * cannot be statically known to conform.
 */
export type MakeConform<T, ConformTo> = [T] extends [ConformTo] ? T : ConformTo;

/**
 * This is useful when you want to ensure that a type conforms to a certain
 * constraint. If it is not guaranteed to conform then a compilation error is
 * thrown. This makes it too conservative in some cases.
 */
export type MustConform<T extends ConformTo, ConformTo> = T;

/**
 * This allows you to treat all interfaces as a plain object. But beware, if the
 * interface represents a function, array, or constructor then these will be
 * stripped from the interface.
 *
 * This is generally intended for cases where an interface is given in order to
 * be declaration merged and then must be assigned to a plain object type.
 *
 * The constraint `T extends object` is used because `object` includes functions
 * and arrays etc. This is crucial to allow interfaces to be given to this type.
 */
export type InterfaceToObject<T extends object> = {
  // Mapped types are no-ops on most types (even primitives like string) but for
  // functions, classes, and arrays they convert them to "proper" objects by
  // stripping constructors/function signatures. One side effect is a type like
  // `() => number` will result in `{}`.
  [K in keyof T]: T[K];
};

/**
 * Replaces the type `{}` with `Record<string, never>` which is usually a better
 * representation of an empty object. The type `{}` actually allows any type be
 * assigned to it except for `null` and `undefined`.
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
export type HandleEmptyObject<
  T extends Record<string, unknown>,
  D extends Record<string, unknown> = Record<string, never>,
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
> = [{}] extends [T] ? D : T;

/**
 * This is a helper type that allows you to ensure that a record conforms to a
 * certain shape. This is useful when you want to ensure that a record has all
 * keys of a certain type.
 *
 * When a value does not conform it is replaced with `never` to indicate that
 * there is an issue.
 */
export type ConformRecord<T extends object, V> = {
  [K in keyof T]: T[K] extends V ? T[K] : never;
};

/**
 * This is a helper type that gets the right DatabaseOperation (including the
 * proper options) for a particular Document type.
 */
export type DatabaseOperationsFor<
  Name extends Document.Type,
  ConcreteOperation extends Operation,
> = DatabaseOperationMap[Name][ConcreteOperation];

/**
 * Converts a regular function type into a function derived from a method.
 *
 * Methods have a special exception in TypeScript that allows unsound subtyping
 * that unfortunately has been deeply engrained into not just JavaScript codebases
 * but the core APIs of JavaScript itself in the DOM.
 *
 * It might seem odd to want to opt-in to this unsoundness but it's unfortunately
 * useful in several cases, such as when you have a property like
 * `prop: ((arg: Options) => number) | undefined` and you want to meet the expectations
 * from other similar methods.
 *
 * @example
 * ```typescript
 * declare class ExampleBaseClass {
 *     // This demonstrates a typical example of where the allowed unsoundness is useful.
 *     methodOne(arg: { x: string }): number;
 *
 *     // This helps demonstrates an example that may be easier to recognize as unsound.
 *     methodTwo(arg: string): number;
 *
 *     functionProperty: (arg: string) => number;
 *     methodLikeProperty: ToMethod<(arg: string) => number>;
 * }
 *
 * // TypeScript allows this without any errors.
 * declare class MethodSubclassing extends ExampleBaseClass {
 *     // It's a very common thing for subclasses to ask for extra arguments.
 *     methodOne(arg: { x: string; y: string }): number;
 *
 *     // Only taking `"foo" | "bar"` should seem pretty unsound.
 *     // The above is actually equally unsound but it's less obvious to many people.
 *     methodTwo(arg: "foo" | "bar"): number;
 * }
 *
 * const exampleMethodSubclass: ExampleBaseClass = new MethodSubclassing();
 *
 * // This is allowed, however at runtime `MethodSubclassing#methodOne` could
 * // will almost certainly error as it has the required property `y`.
 * // The reason why there's no errors is an intentional unsoundness in TypeScript.
 * exampleMethodSubclass.methodOne({ x: "foo" });
 *
 * // Similarly this is allowed.
 * // Both methods show taking arguments that are 'subtypes' of the original.
 * // In the case of functions this is unsound as demonstrated because in both
 * // examples you're substituting a function that has to be able to be called
 * // with a wide variety of arguments with one that will error for many of them.
 * exampleMethodSubclass.methodTwo("lorem");
 *
 * declare class PropertySubclassing extends ExampleBaseClass {
 *     // This errors right here. This preventative error is because of the prior
 *     // explained unsoundness. It errors here because there's really only 3
 *     // places to error at compile time to prevent a runtime error:
 *     // 1. At the call site when a subclass is used unsoundly. Unfortunately
 *     //    at this point it's too late to know for certain if it's a subclass
 *     //    or not. For example there could be a guarded condition to avoid
 *     //    subclasses that TypeScript can't possibly track.
 *     // 2. When trying to assign `PropertySubclassing` to `ExampleBaseClass`.
 *     //    This would be a feasible alternative but would likely come as a
 *     //    surprise as the subclass could have been used for quite a while
 *     //    before trying to be assigned to its superclass.
 *     // 3. Error at the definition. This is where TypeScript has chosen to error.
 *     //    The error is unfortunately not the most intuitive but it is correct.
 *     functionProperty: (arg: "foo" | "bar") => number;
 * }
 *
 * declare class MethodLikeSubclassing {
 *     // This is unsound but by using the `ToMethod` in the parent class it's allowed.
 *     methodLikeProperty: (arg: "foo" | "bar") => number;
 * }
 * ```
 *
 * The TypeScript FAQ explains this in a way that may either be intuitive and
 * explain all lingering questions or be confusing and muddle the waters.
 * It's also worth mentioning that it claims all function parameters work this way,
 * this behavior is disabled for functions in most codebases (including this one)
 * because of the `strictFunctionTypes` compiler flag, implicit under `strict: true`.
 * See: https://github.com/Microsoft/TypeScript/wiki/FAQ#why-are-function-parameters-bivariant
 */
export type ToMethod<T extends AnyFunction> = {
  method(...args: Parameters<T>): ReturnType<T>;
}["method"];

// Deprecated types, to be removed in the first stable v12 release or at the latest v13.

/**
 * @deprecated {@link Document.SystemType | `Document.SystemType`}.
 */
type DocumentTypeWithTypeData = Document.SystemType;

/**
 * @deprecated {@link Document.AnyConstructor | `Document.ConstructorDataFor`}.
 */
export type ConstructorDataType<T extends Document.AnyConstructor> = Document.ConstructorDataFor<T>;

/**
 * @deprecated {@link Document.AnyConstructor | `Document.AnyConstructor`}.
 */
export type DocumentConstructor = Document.AnyConstructor;

/**
 * @deprecated {@link Document.ToConfiguredClass | `Document.ToConfiguredClass`}.
 */
export type ConfiguredDocumentClass<ConcreteDocument extends Document.AnyConstructor> =
  Document.ToConfiguredClass<ConcreteDocument>;

/**
 * @deprecated {@link Document.ToConfiguredInstance | `Document.Configured.Instance`}.
 */
export type ConfiguredDocumentInstance<ConcreteDocument extends Document.AnyConstructor> =
  Document.ToConfiguredInstance<ConcreteDocument>;

/**
 * @deprecated {@link Document.Type | `Document.Type`}.
 */
export type DocumentType = Document.Type;

/**
 * @deprecated {@link Document.PlaceableType | `Document.PlaceableType`}.
 */
export type PlaceableDocumentType = Document.PlaceableType;

export type ConfiguredSheetClass<T extends Document.AnyConstructor> = GetKey<
  GetKey<CONFIG, T["metadata"]["name"]>,
  "sheetClass",
  T
>;

export type ObjectClass<T extends Document.AnyConstructor> = GetKey<
  GetKey<CONFIG, T["metadata"]["name"]>,
  "objectClass",
  T
>;

export type LayerClass<T extends Document.AnyConstructor> = GetKey<
  GetKey<CONFIG, T["metadata"]["name"]>,
  "layerClass",
  T
>;

/**
 * Actual document types that go in folders
 */
export type FolderDocumentTypes = Exclude<foundry.CONST.FOLDER_DOCUMENT_TYPES, "Compendium">;

export type MaybeEmpty<T extends AnyObject> =
  | T
  | {
      [K in keyof T]?: never;
    };

/**
 * The following uses `extends object` instead of `AnyObject` to allow `O = typeof SomeClass`
 */
export type PropertiesOfType<O extends object, T> = {
  [K in keyof O]: [O[K], T] extends [T, O[K]] ? K : never;
}[keyof O];

/**
 * @deprecated {@link Document.SubTypesOf | `Document.SubTypesOf`}.
 */
export type DocumentSubTypes<T extends Document.Type> = Document.SubTypesOf<T>;

/**
 * @deprecated {@link Document.ConfiguredClassForName | `Document.ConfiguredClassForName`}.
 */
export type ConfiguredDocumentClassForName<Name extends Document.Type> = ConfiguredDocuments[Name];

/**
 * @deprecated {@link Document.ConfiguredInstanceForName | `Document.ConfiguredInstanceForName`}.
 */
export type ConfiguredDocumentInstanceForName<Name extends Document.Type> = Document.ConfiguredInstanceForName<Name>;

/**
 * @deprecated {@link Document.ConfiguredObjectClassForName | `Document.ConfiguredObjectClassForName`}.
 */
export type ConfiguredObjectClassForName<Name extends Document.PlaceableType> =
  Document.ConfiguredObjectClassForName<Name>;

/**
 * @deprecated {@link PlaceablesLayer.ConfiguredClassForName | `PlaceablesLayer.ConfiguredClassForName`}.
 */
export type ConfiguredLayerClassForName<Name extends Document.PlaceableType> = CONFIG[Name]["layerClass"];

/**
 * See {@link Document.ConfiguredDataForName | `Document.ConfiguredDataForName`}.
 */
export type ConfiguredData<Name extends string> = Document.ConfiguredDataForName<MakeConform<Name, Document.Type>>;

/**
 * See {@link Document.ConfiguredDataForName | `Document.ConfiguredDataForName`}.
 */
export type ConfiguredSource<Name extends string> = Document.ConfiguredDataForName<MakeConform<Name, Document.Type>>;

/**
 * See {@link Document.ConfiguredFlagsForName | `Document.ConfiguredFlagsForName`}.
 */
export type ConfiguredFlags<Name extends string> = Document.ConfiguredFlagsForName<MakeConform<Name, Document.Type>>;

/**
 * @deprecated {@link Document.ToObjectFalseType | `Document.ToObjectFalseType`}.
 */
export type ToObjectFalseType<T> = Document.ToObjectFalseType<MakeConform<T, Document.Internal.Instance.Any>>;

/**
 * @deprecated {@link PropertyKey | `PropertyKey`}
 */
export type AnyKey = keyof any;
