import type { AnyDataModel, DataModel } from "../foundry/common/abstract/data.mjs.js";
import Document, { type AnyDocument } from "../foundry/common/abstract/document.mjs";
import EmbeddedCollection from "../foundry/common/abstract/embedded-collection.mjs";
import type { SchemaField } from "../foundry/common/data/fields.mjs.js";

export type PropertiesDataType<D extends AnyDataModel> = D extends DataModel<infer Schema, any>
  ? Schema extends SchemaField<infer Value>
    ? Value
    : never
  : never;

type PropertyTypeToSourceType<T> = T extends EmbeddedCollection<infer U, any>
  ? SourceDataType<InstanceType<U>>[]
  : T extends Array<infer U>
  ? Array<PropertyTypeToSourceType<U>>
  : T extends AnyDataModel
  ? SourceDataType<T>
  : T;

export type PropertiesToSource<T extends object> = {
  [Key in keyof T]: PropertyTypeToSourceType<T[Key]>;
};

type SourceDataType<D extends AnyDataModel> = D extends DataModel<any, infer SourceData> ? SourceData : never;

/**
 * Returns the type of the constructor data for the given {@link DataModel}.
 */
export type ConstructorDataType<D extends AnyDataModel> = D extends DataModel<any, any, infer ConstructorData>
  ? ConstructorData
  : never;

type ObjectToDeepPartial<T> = T extends object ? DeepPartial<T> : T;

export type PropertyTypeToSourceParameterType<T> = ObjectToDeepPartial<PropertyTypeToSourceType<T>>;

// TODO: Find a way to avoid this helper
export type FieldReturnType<T extends DocumentField<any>, U extends Partial<DocumentField<any>>> = Omit<T, keyof U> &
  Exclude<U, "undefined">;

export type DocumentConstructor = Pick<typeof Document, keyof typeof Document> & (new (...args: any[]) => AnyDocument);

export type PlaceableObjectConstructor = Pick<typeof PlaceableObject, keyof typeof PlaceableObject> &
  (new (...args: any[]) => PlaceableObject<any>);

export type ConfiguredDocumentClass<T extends DocumentConstructor> = ConfiguredDocumentClassForName<
  T["metadata"]["name"]
>;

export type DocumentType =
  | "Actor"
  | "Adventure"
  | "Cards"
  | "ChatMessage"
  | "Combat"
  | "FogExploration"
  | "Folder"
  | "Item"
  | "JournalEntry"
  | "Macro"
  | "Playlist"
  | "RollTable"
  | "Scene"
  | "Setting"
  | "User"
  | "ActiveEffect"
  | "Card"
  | "TableResult"
  | "PlaylistSound"
  | "AmbientLight"
  | "AmbientSound"
  | "Combatant"
  | "Drawing"
  | "MeasuredTemplate"
  | "Note"
  | "Tile"
  | "Token"
  | "Wall";

export type PlaceableDocumentType =
  | "AmbientLight"
  | "AmbientSound"
  | "Drawing"
  | "MeasuredTemplate"
  | "Note"
  | "Tile"
  | "Token"
  | "Wall";

export type DocumentSubTypes<T extends DocumentType> = "type" extends keyof InstanceType<
  ConfiguredDocumentClassForName<T>
>["data"]
  ? InstanceType<ConfiguredDocumentClassForName<T>>["data"]["type"]
  : typeof foundry.CONST.BASE_DOCUMENT_TYPE;

export type ConfiguredDocumentClassForName<Name extends DocumentType> = CONFIG[Name]["documentClass"];

export type ConfiguredObjectClassForName<Name extends PlaceableDocumentType> = CONFIG[Name]["objectClass"];

export type ConfiguredData<Name extends string> = Name extends keyof DataConfig ? DataConfig[Name] : {};

export type ConfiguredSource<Name extends string> = Name extends keyof SourceConfig ? SourceConfig[Name] : {};

export type ConfiguredFlags<T extends string> = T extends keyof FlagConfig
  ? FlagConfig[T] & Record<string, unknown>
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

export type ConfiguredSheetClass<T extends DocumentConstructor> = T["metadata"]["name"] extends keyof CONFIG
  ? "sheetClass" extends keyof CONFIG[T["metadata"]["name"]]
    ? CONFIG[T["metadata"]["name"]]["sheetClass"]
    : never
  : T;

export type ObjectClass<T extends DocumentConstructor> = T["metadata"]["name"] extends keyof CONFIG
  ? "objectClass" extends keyof CONFIG[T["metadata"]["name"]]
    ? CONFIG[T["metadata"]["name"]]["objectClass"]
    : never
  : T;

export type LayerClass<T extends DocumentConstructor> = T["metadata"]["name"] extends keyof CONFIG
  ? "layerClass" extends keyof CONFIG[T["metadata"]["name"]]
    ? CONFIG[T["metadata"]["name"]]["layerClass"]
    : never
  : T;

export type DataSourceForPlaceable<P extends PlaceableObject> = P extends PlaceableObject<infer Doc>
  ? Doc extends Document<infer D, any>
    ? D["_source"]
    : never
  : never;
