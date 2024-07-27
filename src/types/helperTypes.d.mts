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

export type DocumentType =
  | "ActiveEffect"
  | "ActorDelta"
  | "Actor"
  | "Adventure"
  | "Card"
  | "Cards"
  | "ChatMessage"
  | "Combat"
  | "Combatant"
  | "FogExploration"
  | "Folder"
  | "Item"
  | "JournalEntryPage"
  | "JournalEntry"
  | "Macro"
  | "PlaylistSound"
  | "Playlist"
  | "RollTable"
  | "Scene"
  | "Setting"
  | "TableResult"
  | "User"
  // All placeables also have a corresponding document class.
  | PlaceableDocumentType;

export type PlaceableDocumentType =
  | "AmbientLight"
  | "AmbientSound"
  | "Drawing"
  | "MeasuredTemplate"
  | "Note"
  | "Tile"
  | "Token"
  | "Wall";

// TODO: Probably a way to auto-determine this
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
