import type { DatabaseOperationMap, Operation } from "../foundry/common/abstract/document.d.mts";
import type Document from "../foundry/common/abstract/document.d.mts";
import type { ConfiguredDocuments } from "./configuredDocuments.d.mts";
import type { EmptyObject } from "./utils.d.mts";

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
 */
export type IntentionalPartial<T> = Partial<T>;

/**
 * This type is used to make a constraint where `T` must be statically known to overlap with `U`.
 */
export type OverlapsWith<T, U> = [T & U] extends [never] ? U : T;

/**
 * Use this whenever a type is given that should match some constraint but is
 * not guaranteed to. For example when additional properties can be declaration
 * merged into an interface. When the type does not conform then `ConformTo` is
 * used instead.
 *
 * See `MustConform` for a version that throws a compilation error when the type
 * cannot be statically known to conform.
 */
export type MakeConform<T, ConformTo> = T extends ConformTo ? T : ConformTo;

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
  // functions they strip the function signatures and if there's no additional
  // properties returns `{}`.
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
  [K in keyof T]: [T[K]] extends [V] ? T[K] : never;
};

/**
 * This is a helper type that gets the right DatabaseOperation (including the
 * proper options) for a particular Document type.
 */
export type DatabaseOperationsFor<
  Name extends Document.Type,
  ConcreteOperation extends Operation,
> = DatabaseOperationMap[Name][ConcreteOperation];

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
