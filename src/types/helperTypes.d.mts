import type { Operation } from "../foundry/common/abstract/document.d.mts";
import type Document from "../foundry/common/abstract/document.d.mts";
import type * as utils from "../utils/index.d.mts";

/**
 * @deprecated No replacement.
 */
export type ModuleRequiredOrOptional<Name extends string> = Name extends keyof RequiredModules ? never : undefined;

/**
 * @deprecated without replacement, use `ConfiguredModule` instead.
 */
export type ConfiguredModuleData<Name extends string> = utils.ConfiguredModuleData<Name>;

/**
 * @deprecated import from `fvtt-types/utils` instead.
 */
export type ConfiguredModule<Name extends string> = utils.ConfiguredModule<Name>;

/**
 * @deprecated import from `fvtt-types/utils` instead.
 */
export type LoggingLevels = utils.LoggingLevels;

/**
 * @deprecated import from `fvtt-types/utils` instead.
 */
export type GetKey<T, K extends PropertyKey, D = never> = utils.GetKey<T, K, D>;

/**
 * @deprecated import from `fvtt-types/utils` instead.
 */
export type IntentionalPartial<T> = utils.IntentionalPartial<T>;

/**
 * @deprecated import from `fvtt-types/utils` instead.
 */
export type OverlapsWith<T, U> = utils.OverlapsWith<T, U>;

/**
 * @deprecated import from `fvtt-types/utils` instead.
 */
export type ArrayOverlaps<T, Item> = utils.ArrayOverlaps<T, Item>;

/**
 * @deprecated import from `fvtt-types/utils` instead.
 */
export type MakeConform<T, ConformTo> = utils.MakeConform<T, ConformTo>;

/**
 * @deprecated import from `fvtt-types/utils` instead.
 */
export type MustConform<T extends ConformTo, ConformTo> = utils.MustConform<T, ConformTo>;

/**
 * @deprecated import from `fvtt-types/utils` instead.
 */
export type InterfaceToObject<T extends object> = utils.InterfaceToObject<T>;

/**
 * @deprecated import from `fvtt-types/utils` instead.
 */
export type ConformRecord<T extends object, V> = utils.ConformRecord<T, V>;

/**
 * @deprecated {@link Document.DatabaseOperationsFor | `Document.DatabaseOperationsFor`}.
 */
export type DatabaseOperationsFor<
  Name extends Document.Type,
  ConcreteOperation extends Operation,
> = Document.DatabaseOperationsFor<Name, ConcreteOperation>;

/**
 * @deprecated import from `fvtt-types/utils` instead.
 */
export type ToMethod<T extends utils.AnyFunction> = utils.ToMethod<T>;

/**
 * @deprecated import from `fvtt-types/utils` instead.
 */
export type Brand<BaseType, BrandName extends string> = utils.Brand<BaseType, BrandName>;

/**
 * @deprecated import from `fvtt-types/utils` instead.
 */
export type PrettifyType<T> = utils.PrettifyType<T>;

/**
 * @deprecated import from `fvtt-types/utils` instead.
 */
export type PrettifyTypeDeep<T> = utils.PrettifyTypeDeep<T>;

/**
 * @deprecated import from `fvtt-types/utils` instead.
 */
export type UnionToIntersection<U> = (U extends unknown ? (arg: U) => void : never) extends (arg: infer I) => void
  ? I
  : never;

/**
 * @deprecated {@link Document.ConfiguredSheetClassFor | `Document.ConfiguredSheetClassFor`}
 */
export type ConfiguredSheetClass<T extends Document.AnyConstructor> = Document.ConfiguredSheetClassFor<T["metadata"]["name"]>

/**
 * @deprecated {@link Document.ConfiguredObjectClassFor | `Document.ConfiguredObjectClassFor`}
 */
export type ObjectClass<T extends Document.AnyConstructor> = Document.ConfiguredObjectClassFor<T["metadata"]["name"]>;

/**
 * @deprecated {@link Document.ConfiguredLayerClassFor | `Document.ConfiguredLayerClassFor`}
 */
export type LayerClass<T extends Document.AnyConstructor> = Document.ConfiguredLayerClassFor<T["metadata"]["name"]>;

/**
 * @deprecated import from `fvtt-types/utils` instead.
 */
export type MaybeEmpty<T extends utils.AnyObject> =
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
 * @deprecated {@link Folder.DocumentType | `Folder.DocumentType`}.
 */
export type FolderDocumentTypes = Folder.DocumentType;

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

/**
 * @deprecated {@link Document.SubTypesOf | `Document.SubTypesOf`}.
 */
export type DocumentSubTypes<T extends Document.Type> = Document.SubTypesOf<T>;

/**
 * @deprecated {@link Document.ConfiguredClassForName | `Document.ConfiguredClassForName`}.
 */
export type ConfiguredDocumentClassForName<Name extends Document.Type> = Document.ConfiguredClassForName<Name>;

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
 * @deprecated {@link Document.ConfiguredDataForName | `Document.ConfiguredDataForName`}.
 */
export type ConfiguredData<Name extends string> = Document.ConfiguredDataForName<utils.MakeConform<Name, Document.Type>>;

/**
 * @deprecated {@link Document.ConfiguredDataForName | `Document.ConfiguredDataForName`}.
 */
export type ConfiguredSource<Name extends string> = Document.ConfiguredDataForName<utils.MakeConform<Name, Document.Type>>;

/**
 * @deprecated {@link Document.ConfiguredFlagsForName | `Document.ConfiguredFlagsForName`}.
 */
export type ConfiguredFlags<Name extends string> = Document.ConfiguredFlagsForName<utils.MakeConform<Name, Document.Type>>;

/**
 * @deprecated {@link Document.ToObjectFalseType | `Document.ToObjectFalseType`}.
 */
export type ToObjectFalseType<T> = Document.ToObjectFalseType<utils.MakeConform<T, Document.Internal.Instance.Any>>;

/**
 * @deprecated {@link PropertyKey | `PropertyKey`}
 */
export type AnyKey = keyof any;
