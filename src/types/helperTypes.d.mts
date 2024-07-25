import type { ConfiguredDocuments } from "./configuredDocuments.d.mts";
import type { DeepPartial } from "./utils.d.mts";

/**
 * Returns the type of the constructor data for the given {@link foundry.abstract.Document}.
 */
export type ConstructorDataType<T extends DocumentConstructor> = foundry.data.fields.SchemaField.InnerAssignmentType<
  ReturnType<T["defineSchema"]>
>;

type ObjectToDeepPartial<T> = T extends object ? DeepPartial<T> : T;

export type DocumentConstructor = foundry.abstract.Document.AnyConstructor;

export type PlaceableObjectConstructor = Pick<typeof PlaceableObject, keyof typeof PlaceableObject> &
  (new (...args: any[]) => PlaceableObject<any>);

export type ConfiguredDocumentClass<ConcreteDocument extends DocumentConstructor> =
  ConfiguredDocuments[ConcreteDocument["metadata"]["name"]];

// TODO: Remove the Exclude after the appropriate classes are set up
export type DocumentType = Exclude<foundry.CONST.ALL_DOCUMENT_TYPES, "Region" | "RegionBehavior">;

// TODO: Add Region after the appropriate classes are set up
export type PlaceableDocumentType =
  | "AmbientLight"
  | "AmbientSound"
  | "Drawing"
  | "MeasuredTemplate"
  | "Note"
  | "Tile"
  | "Token"
  | "Wall";

// TODO: Investigate if feasible to determine from the metadata (hasTypeData: true)
type DocumentTypeWithTypeData = "Actor" | "Card" | "Cards" | "Item" | "JournalEntryPage";

/**
 * Actual document types that go in folders
 */
export type FolderDocumentTypes = Exclude<foundry.CONST.FOLDER_DOCUMENT_TYPES, "Compendium">;

export type DocumentSubTypes<T extends DocumentType> = "type" extends keyof InstanceType<
  ConfiguredDocumentClassForName<T>
>
  ? InstanceType<ConfiguredDocumentClassForName<T>>["type"]
  : typeof foundry.CONST.BASE_DOCUMENT_TYPE;

export type ConfiguredDocumentClassForName<Name extends DocumentType> = ConfiguredDocuments[Name];

export type ConfiguredObjectClassForName<Name extends PlaceableDocumentType> = CONFIG[Name]["objectClass"];

export type ConfiguredLayerClassForName<Name extends PlaceableDocumentType> = CONFIG[Name]["layerClass"];

export type ConfiguredData<Name extends string> = Name extends keyof DataConfig ? DataConfig[Name] : {};

export type ConfiguredSource<Name extends string> = Name extends keyof SourceConfig ? SourceConfig[Name] : {};

export type ConfiguredFlags<T extends string> = T extends keyof FlagConfig
  ? FlagConfig[T] & Record<string, unknown>
  : Record<string, unknown>;

export type ModuleRequiredOrOptional<Name extends string> = Name extends keyof RequiredModules ? never : undefined;

export type ConfiguredModuleData<Name extends string> = Name extends keyof ModuleConfig ? ModuleConfig[Name] : {};

export type ConfiguredModule<Name extends string> =
  ModuleRequiredOrOptional<Name> extends never
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

/** Keys of functions of console.log / globalThis.logger */
export type LoggingLevels = "debug" | "log" | "info" | "warn" | "error";
