import type { Document } from "../foundry/common/abstract/module.d.mts";

type ConfiguredModuleData<Name extends string> = Name extends keyof ModuleConfig ? ModuleConfig[Name] : EmptyObject;

/**
 * This type exists due to https://github.com/microsoft/TypeScript/issues/55667
 * This will be deprecated once this issue is solved.
 */
export type FixedInstanceType<T extends AnyConstructor> = T extends abstract new (...args: infer _) => infer R
  ? R
  : never;

export type ConfiguredModule<Name extends string> = Name extends keyof RequiredModules
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
export type MakeConform<T, ConformTo, D extends ConformTo = ConformTo> = [T] extends [ConformTo] ? T : D;

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
  // This mapped type would be a no-op on most types (even primitives like string)
  // but for functions, classes, and arrays they convert them to "proper" objects by
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
export type ConformRecord<T extends object, V, D extends V = V> = {
  [K in keyof T]: T[K] extends V ? T[K] : D;
};

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
 *     // It's a very common thing for subclasses to ask for extra properties.
 *     // This appears in the DOM APIs.
 *     methodOne(arg: { x: string; y: string }): number;
 *
 *     // Only taking `"foo" | "bar"` should seem pretty unsound.
 *     // The above is actually equally unsound but it's less obvious to many people.
 *     methodTwo(arg: "foo" | "bar"): number;
 * }
 *
 * // This is allowed. If it wasn't subclassing would be less useful.
 * const exampleMethodSubclass: ExampleBaseClass = new MethodSubclassing();
 *
 * // TypeScript does not error here. However at runtime `MethodSubclassing#methodOne`
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
 * declare class MethodLikeSubclassing extends ExampleBaseClass {
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
  : // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
    T & unknown;

/**
 * This behaves the same as {@link PrettifyType | `PrettifyType`} except instead
 * of prettifying only the first level it prettifies all levels of an object. of prettifying only the first level it prettifies all levels of an object.
 */
export type PrettifyTypeDeep<T> = T extends AnyObject
  ? {
      [K in keyof T]: PrettifyTypeDeep<T[K]>;
    }
  : // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
    T & unknown;

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

// Helper Types

/**
 * Recursively sets keys of an object to optional. Used primarily for update methods.
 *
 * Note: This function is intended to work with plain objects. It takes any object only because
 * otherwise it makes it more difficult to pass in interfaces.
 *
 * Its behavior is unspecified when run on a non-plain object.
 */
// Allowing passing any `object` is done because it's more convenient for the end user.
// Note that `{}` should always be assignable to `DeepPartial<T>`.
export type DeepPartial<T extends object> = {
  [K in keyof T]?: _DeepPartial<T[K]>;
};

// This type has to be factored out for distributivity.
type _DeepPartial<T> = T extends object ? (T extends AnyArray | AnyFunction | AnyConstructor ? T : DeepPartial<T>) : T;

/**
 * Gets all possible keys of `T`. This is useful because if `T` is a union type
 * it will get the properties of all types in the union. Otherwise it functions identically to `keyof T`.
 */
export type AllKeysOf<T extends object> = T extends unknown ? keyof T : never;

/**
 * Make all properties in `T` optional and explicitly allow `undefined`
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
 *
 * @internal
 */
export type InexactPartial<T extends object, K extends AllKeysOf<T> = AllKeysOf<T>> = {
  [K2 in keyof T as Extract<K2, K>]?: T[K2] | undefined;
} & {
  // Note(LukeAbby): This effectively inlines `Omit<T, K>`, hoping for slightly better type display.
  [K2 in keyof T as Exclude<K2, K>]: T[K2];
};

/**
 * Makes select properties in `T` optional and explicitly allows both `null` and
 * `undefined` values.
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
 *
 * @internal
 */
export type NullishProps<T extends object, K extends AllKeysOf<T> = AllKeysOf<T>> = {
  [K2 in keyof T as Extract<K2, K>]?: T[K2] | null | undefined;
} & {
  // Note(LukeAbby): This effectively inlines `Omit<T, K>`, hoping for slightly better type display.
  [K2 in keyof T as Exclude<K2, K>]: T[K2];
};

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
// NOTE(LukeAbby): It may seem easier to write `Pick<T, ConcreteKeys<T>>` but this stops it from being a homomorphic mapped type and regresses its power when given a generic type parameter or `this`.
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

/**
 * Makes the given keys `K` of the type `T` required
 */
export type RequiredProps<T extends object, K extends AllKeysOf<T>> = Required<Pick<T, K>> & Omit<T, K>;

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
 * Type params extend `object` instead of `AnyObject` to allow interfaces
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
export type HandleEmptyObject<T extends object, D extends object = EmptyObject> = [{}] extends [T] ? D : T;

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
// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
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
// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
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
export type EmptyObject = Record<string, never>;

declare const empty: unique symbol;

/**
 * This helper type helps emulate index signatures for types with incompatible concrete keys.
 *
 * For example the type `{ foo: number; [K: string]: string }` is not allowed because the index signature is incompatible with the concrete key `foo`.
 * It may seem like tricks like `{ foo: number; } & { [K: string]: string }` work but this defers the error to the caller.
 *
 * @example
 * ```typescript
 * type NaiveType = { foo: number; [K: string]: boolean };
 * //                 ^ Property 'foo' of type 'number' is not assignable to 'string' index type 'boolean'.
 *
 * type NaiveIntersection = { foo: number } & { [K: string]: string };
 *
 * function usesIntersection(intersection: NaiveIntersection) { ... }
 *
 * usesIntersection({ foo: 1, x: true });
 * //               ^ Argument of type '{ foo: number; }' is not assignable to parameter of type 'NaiveIntersection'.
 * //                   Type '{ foo: number; }' is not assignable to type '{ [K: string]: boolean; }'.
 * //                     Property 'foo' is incompatible with index signature.
 * //                       Type 'number' is not assignable to type 'boolean'.
 *
 * function usesCorrectly<T extends AnyObject>(withIndex: ShapeWithIndexSignature<T, { foo: number }, string, boolean>) { ... }
 *
 * usesCorrectly({ foo: 1, x: true });
 * ```
 */
// Note: If https://github.com/microsoft/TypeScript/issues/17867 or https://github.com/microsoft/TypeScript/issues/43826 (depending on implementation) is implemented it's likely this type can be expressed in a better way.
export type ShapeWithIndexSignature<
  T extends AnyObject,
  // Uses `extends object` to allow interfaces and if useful other objects.
  PrimaryShape extends object,
  IndexSignature extends PropertyKey,
  IndexType,
> = PrimaryShape & {
  readonly [K in keyof T & IndexSignature]: K extends keyof PrimaryShape ? PrimaryShape[K] : IndexType;
};

/**
 * Defer is a utility type that allows you to defer the evaluation of a type.
 * The use cases for this are extremely advanced. In essence they have to do with breaking cycles in evaluation.
 */
export type Defer<T> = [T][T extends any ? 0 : never];

export type MustBeValidUuid<Uuid extends string, Type extends Document.Type = Document.Type> = _MustBeValidUuid<
  Uuid,
  Uuid,
  Type
>;

/**
 * Quotes a string for human readability. This is useful for error messages.
 *
 * @example
 * ```ts
 * type Quote1 = Quote<"foo">;
 * //   ^ "'foo'"
 *
 * type Quote2 = Quote<"can't">;
 * //   ^ "'can\\'t'"
 * ```
 */
export type Quote<T extends string> = T extends `${string}'${string}` ? `'${Escape<T>}'` : `'${T}'`;

type Escape<T extends string> = T extends `${infer Prefix}'${infer Suffix}` ? `${Prefix}\\'${Escape<Suffix>}` : T;

declare class InvalidUuid<OriginalUuid extends string> {
  #invalidUuid: true;

  message: `The UUID ${Quote<OriginalUuid>} is invalid .`;
}

type _MustBeValidUuid<
  Uuid extends string,
  OriginalUuid extends string,
  Type extends Document.Type,
> = Uuid extends `${string}.${string}.${infer Rest}`
  ? _MustBeValidUuid<Rest, OriginalUuid, Type>
  : Uuid extends `${string}.${string}`
    ? Uuid extends `${Type}.${string}`
      ? OriginalUuid
      : InvalidUuid<OriginalUuid>
    : `${Type}.${string}` | `${string}.${string}.${Type}.${string}`;

/**
 * Drops the first element of an array
 */
type DropFirst<T extends AnyArray> = T extends [infer _1, ...infer V] ? V : T;

/**
 * This type is used when you want to use `unknown` in a union.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type LazyUnknown = {} | null | undefined;
