import type { DatabaseOperationMap, Operation } from "../foundry/common/abstract/document.d.mts";
import type Document from "../foundry/common/abstract/document.d.mts";
import type { ConfiguredDocuments } from "./documentConfiguration.d.mts";
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

declare class Branded<in out BrandName extends string> {
  #brand: BrandName;
}

/**
 * Brands a type such that is behaves just like the input type while preventing
 * assignment to it. This is useful to create types that indicate a specific
 * invariant that the type must adhere to that a more basic type wouldn't have.
 *
 * Note: You can brand most types but due to its implementation this
 * helper is incompatible with `any`, `unknown`, and `never`. See "Brand Implementation"
 * for more details.
 *
 * For example enum members can be branded to prevent an arbitrary number from
 * being mistakenly used in their place:
 *
 * @example
 * ```ts
 * type NUMBER_ENUM = Brand<number, "NUMBER_ENUM">;
 *
 * const NUMBER_ENUM: {
 *     X: NUMBER_ENUM,
 *     Y: NUMBER_ENUM
 * };
 *
 * function useNumberEnum(value: NUMBER_ENUM) { ... }
 * usesNumberEnum(NUMBER_ENUM.X); // Works.
 * usesNumberEnum(1); // Error.
 * ```
 *
 * ### Brand Implementation
 *
 * The fundamental trick of the implementation is that it intersects the base
 * type with a compile-time only marker property. This marker property will not
 * exist on the base type and so prevents assignment just like how `{ foo: string }`
 * can't be assigned to `{ foo: string; bar: number }` because it's missing a property.
 *
 * A more basic implementation might look like this:
 *
 * ```ts
 * type Brand<BaseType, BrandName extends string> = BaseType & { brandType: BrandName };
 * ```
 *
 * But this has two problems:
 * - In theory anyone can add this `brandType` property.
 * - The `brandType` property is accessible and visible, e.g.
 *   `keyof Brand<BaseType, BrandName>` would include `brandType` because it's a visible property.
 *
 * The implementation here solves both of these problems by using a private class field.
 * This class is unexported and so due to the way that private class properties work this
 * means there is no other way to create a compatible property (outside of `any`). Using a
 * class also has the added benefit that the type parameter can be specifically marked as
 * invariant for a bit of extra protection.
 *
 * This does mean that `Brand` only works with types where an intersection is meaningful.
 * These are the problematic types:
 * - `any` will become `any` still because `any & T` is still `any`. This makes `Brand` useless.
 * - `never` stays `never` because `never & T` is `never`. This makes `Brand` useless.
 * - `unknown` becomes `Branded` because `unknown & T` is `T`. This is a problem because `unknown` can be any type, e.g. `number` but `Branded<unknown, BrandName>` is always an object.
 *
 * Unfortunately there aren't really good workarounds either.
 */
export type Brand<BaseType, BrandName extends string> = BaseType & Branded<BrandName>;

/**
 * An at a best effort level expands a type from something complex that shows up like
 * `DeepPartial<{ x: { y: number } }>` in intellisense to `{ x?: { y?: number } }`.
 * This is useful for when you want to see what a type looks like in a more human
 * readable form.
 *
 * Using this type is a performance tradeoff, might increase the likelihood of
 * circularities, and technically in some extremely niche cases changes the type behavior.
 * ```@example
 * // The implementation of this type is outside the scope of this example.
 * // See UnionToIntersection.
 * type UnionToIntersection<U> = (U extends unknown ? (arg: U) => void : never) extends (arg: infer I) => void ? I : never;
 *
 * type ObjectIntersection = UnionToIntersection<{ x: string } | { y: number }>;
 * //   ^ { x: string } & { y: number }
 *
 * type PrettyObjectIntersection = PrettifyType<ObjectIntersection>;
 * //   ^ { x: string, y: number }
 *
 * function example<T extends { someProp: number } | { anotherProp: string }>(t: T) {
 *   Object.assign(t, { a: "foo" }, {b: 2}) satisfies ObjectIntersection
 *   Object.assign(t, { a: "foo" }, {b: 2}) satisfies PrettyObjectIntersection
 *   //                                     ^ Type 'T & { a: string; } & { b: number; }' does not satisfy the expected type '{ a: string; b: number; }'.
 *   // This is an example of changing type behavior. The first line is allowed but the second errors.
 *   // This type of situation will realistically never come up in real code because it's so contrived.
 *   // Note that this difference only appears when generic, specifically `T extends Object | NonObject`.
 *   // See https://github.com/microsoft/TypeScript/pull/60726 for some context.
 * }
 * ```
 */
export type PrettifyType<T> = T extends AnyObject
  ? {
      [K in keyof T]: T[K];
    }
  : T & unknown;

/**
 * This behaves the same as {@link PrettifyType | `PrettifyType`} except instead
 * of prettifying only the first level it prettifies all levels of an object. of prettifying only the first level it prettifies all levels of an object.
 */
export type PrettifyTypeDeep<T> = T extends AnyObject
  ? {
      [K in keyof T]: PrettifyTypeDeep<T[K]>;
    }
  : T & unknown;

/**
 * Convert a union of the form `T1 | T2 | T3 | ...` into an intersection of the form `T1 & T2 & T3 & ...`.
 *
 * ### Implementation Details
 *
 * Breaking this type down into steps evaluation begins with the expression
 * `U extends unknown ? ... : never`. Note that `U` is a "bare type parameter",
 * that is written directly as opposed to being wrapped like `U[]`. Because of
 * this the type is distributive.
 *
 * Distributivity means that `U extends unknown ? (arg: U) => void : never` turns the input
 * of the form `T1 | T2 | T3 | ...` into `((arg: T1) => void) | ((arg: T2) => void) | ((arg: T3) => void)`.
 * Let's call this new union `FunctionUnion`
 *
 * Finally `FunctionUnion extends (arg: infer I) => void ? I : never` is evaluated.
 * This results in `T1 & T2 & T3 | ...` as promised... but why? Even with distributivity
 * in play, normally `(T extends unknown ? F<T> : never) extends F<infer T> ? T : never`
 * would just be a complex way of writing `T`.
 *
 * The complete answer is fairly deep and is unlikely to make sense unless you are
 * already well versed in this area. In particular it lies in what happens when `F<T>`
 * puts `T` into a contravariant position. In this case inferring `T` back out
 * requires an intersection effectively because the covariant assignment rules
 * are flipped.
 *
 * That explanation is unlikely to have helped much and so let's run through two
 * examples.
 *
 * First, a refresher:
 * ```ts
 * function takesX(arg: { x: number }): number { ... }
 * function takesY(arg: { y: string }): string { ... }
 *
 * let output = ...;
 * if (Math.random() > 0.5) {
 *    output = takesX({ x: 1 });
 * } else {
 *    output = takesY({ y: "example" });
 * }
 * ```
 *
 * What is the best type for `output` in this case? Of course, it'd be `number | string`.
 *
 * What about this example?
 * ```ts
 * function takesX(arg: { x: number }): number { ... }
 * function takesY(arg: { y: string }): string { ... }
 *
 * let input = ...;
 * if (Math.random() > 0.5) {
 *    takesX(input);
 * } else {
 *    takesY(input);
 * }
 * ```
 *
 * What is the best type for `input` in this case? It might be tempting to say `{ x: number } | { y: string }`
 * similarly to how `output` was `number | string`. But that's not quite right. The correct type for `input` is
 * actually `{ x: number } & { y: string }`. The reason why this is the case is that it's unpredictable whether
 * `takesX` or `takesY` will be called. This means that `input` must be able to used to call both functions.
 *
 * This is analogous to asking these two questions at the type level:
 * ```ts
 * type Functions = typeof takesX | typeof takesY;
 * type Output = Functions extends (...args: any[]) => infer Output ? Output : never;
 * //   ^ number | string
 * type Input = Functions extends (arg: infer Input) => any ? Input : never;
 * //   ^ { x: number } & { y: string }
 * ```
 *
 * And if you reflect on the inciting code, `FunctionUnion extends (arg: infer I) => void ? I : never`
 * you'll see that it's effectively doing the same thing.
 *
 * If you want to read more see TypeScript's handbook section on
 * [Distributive Conditional Types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html#distributive-conditional-types)
 * for more information on distributivity. There is also a section on
 * [Variance](https://www.typescriptlang.org/docs/handbook/2/generics.html#variance-annotations)
 * in general but it unfortunately doesn't touch too much on specific details and
 * the emergent behavior of variance like this.
 */
export type UnionToIntersection<U> = (U extends unknown ? (arg: U) => void : never) extends (arg: infer I) => void
  ? I
  : never;
