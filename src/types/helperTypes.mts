import type DocumentData from "../foundry/common/abstract/data.mts";
import type { DataModel } from "../foundry/common/abstract/data.mts";
import type Document from "../foundry/common/abstract/document.mts";
import type { AnyMetadata } from "../foundry/common/abstract/document.mts";
import type EmbeddedCollection from "../foundry/common/abstract/embedded-collection.mts";
import type { fields } from "../foundry/common/data/module.mts";

type PropertyTypeToSourceType<T> = T extends EmbeddedCollection<infer U, any>
  ? SourceDataType<InstanceType<U>>[]
  : T extends Array<infer U>
    ? Array<PropertyTypeToSourceType<U>>
    : T extends DataModel.Any
      ? SourceDataType<T>
      : T;

export type PropertiesToSource<T extends object> = {
  [Key in keyof T]: PropertyTypeToSourceType<T[Key]>;
};

type SourceDataType<T extends Document.Any | DataModel.Any> = T extends DocumentData<any, any, infer U>
  ? U
  : T extends Document<infer U, any, any>
    ? SourceDataType<U>
    : never;

/**
 * Returns the type of the constructor data for the given {@link DataModel}.
 */
export type ConstructorDataType<DM extends DataModel.Any> = DM extends DataModel<any, any, infer ConstructorData>
  ? ConstructorData
  : never;

// TODO: Find a way to avoid this helper
export type FieldReturnType<T extends DocumentField<any>, U extends Partial<DocumentField<any>>> = Omit<T, keyof U> &
  Exclude<U, "undefined">;

export type PlaceableObjectConstructor = Pick<typeof PlaceableObject, keyof typeof PlaceableObject> &
  (new (...args: any[]) => PlaceableObject<any>);

export type ConfiguredDocumentClass<T extends { metadata: AnyMetadata }> = ConfiguredDocumentClassForName<
  T["metadata"]["name"]
>;

export type DocumentSubTypes<T extends Document.TypeName> = "type" extends keyof InstanceType<
  ConfiguredDocumentClassForName<T>
>["data"]
  ? InstanceType<ConfiguredDocumentClassForName<T>>["data"]["type"]
  : typeof foundry.CONST.BASE_DOCUMENT_TYPE;

export type ConfiguredDocumentClassForName<Name extends Document.TypeName> = CONFIG[Name]["documentClass"];

export type ConfiguredObjectClassForName<Name extends Document.PlaceableTypeName> = CONFIG[Name]["objectClass"];

export type ConfiguredProperties<Name extends string> = Name extends keyof PropertiesConfig
  ? PropertiesConfig[Name]
  : {};

export type ConfiguredSource<Name extends string> = Name extends keyof SourceConfig ? SourceConfig[Name] : {};

/**
 * A helper to get the configured flags for the given key in the {@link FlagConfig}.
 * @typeParam Key - the key to look for in the FlagConfig.
 */
export type ConfiguredFlags<Key extends string> = Key extends keyof FlagConfig
  ? FlagConfig[Key] & Record<string, unknown>
  : Record<string, unknown>;

export type ModuleRequiredOrOptional<Name extends string> = Name extends keyof RequiredModules ? never : undefined;

export type ConfiguredModuleData<Name extends string> = Name extends keyof ModuleConfig ? ModuleConfig[Name] : {};

export type ConfiguredModule<Name extends string> = ModuleRequiredOrOptional<Name> extends never
  ? ConfiguredModuleData<Name>
  :
      | (ConfiguredModuleData<Name> & { active: true })
      // flawed, can't use `key in module` this way, but omitting the Partial Record type kills nullish
      // collocating, which is probably the better DX.
      | ({ active: false } & Record<keyof ConfiguredModuleData<Name>, undefined>);

export type ToObjectFalseType<T> = T extends {
  toObject: (source: false) => infer U;
}
  ? U
  : T;

export type ConfiguredSheetClass<T extends Document.Constructor> = T["metadata"]["name"] extends keyof CONFIG
  ? "sheetClass" extends keyof CONFIG[T["metadata"]["name"]]
    ? CONFIG[T["metadata"]["name"]]["sheetClass"]
    : never
  : T;

export type ObjectClass<T extends Document.Constructor> = T["metadata"]["name"] extends keyof CONFIG
  ? "objectClass" extends keyof CONFIG[T["metadata"]["name"]]
    ? CONFIG[T["metadata"]["name"]]["objectClass"]
    : never
  : T;

export type LayerClass<T extends Document.Constructor> = T["metadata"]["name"] extends keyof CONFIG
  ? "layerClass" extends keyof CONFIG[T["metadata"]["name"]]
    ? CONFIG[T["metadata"]["name"]]["layerClass"]
    : never
  : T;

export type DataSourceForPlaceable<P extends PlaceableObject> = P extends PlaceableObject<infer Doc>
  ? Doc extends Document<infer D, any, any>
    ? fields.SchemaField.InnerPersistedType<D["fields"]>
    : never
  : never;
