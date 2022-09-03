import DocumentData, { AnyDocumentData } from "../foundry/common/abstract/data.mjs";
import Document from "../foundry/common/abstract/document.mjs";
import EmbeddedCollection from "../foundry/common/abstract/embedded-collection.mjs";

export type PropertiesDataType<T extends Document<any, any> | AnyDocumentData> = T extends DocumentData<
  any,
  infer U,
  any,
  any
>
  ? U
  : T extends Document<infer U, any>
  ? PropertiesDataType<U>
  : never;

type PropertyTypeToSourceType<T> = T extends EmbeddedCollection<infer U, any>
  ? SourceDataType<InstanceType<U>>[]
  : T extends Array<infer U>
  ? Array<PropertyTypeToSourceType<U>>
  : T extends AnyDocumentData
  ? SourceDataType<T>
  : T;

export type PropertiesToSource<T extends object> = {
  [Key in keyof T]: PropertyTypeToSourceType<T[Key]>;
};

type SourceDataType<T extends Document<any, any> | AnyDocumentData> = T extends DocumentData<
  any,
  any,
  infer U,
  any,
  any
>
  ? U
  : T extends Document<infer U, any>
  ? SourceDataType<U>
  : never;

/**
 * Returns the type of the constructor data for the given {@link DocumentData}.
 */
export type ConstructorDataType<T extends AnyDocumentData> = T["_initializeSource"] extends (data: infer U) => any
  ? U
  : never;

type ObjectToDeepPartial<T> = T extends object ? DeepPartial<T> : T;

export type PropertyTypeToSourceParameterType<T> = ObjectToDeepPartial<PropertyTypeToSourceType<T>>;

// TODO: Find a way to avoid this helper
export type FieldReturnType<T extends DocumentField<any>, U extends Partial<DocumentField<any>>> = Omit<T, keyof U> &
  Exclude<U, "undefined">;

export type DocumentConstructor = Pick<typeof Document, keyof typeof Document> &
  (new (...args: any[]) => Document<any, any>);

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

type EndValue = string | bigint | number | boolean | null | undefined;
export type InputValue = object | Array<unknown>;

type Split<S extends string, D extends string> = string extends S
  ? string[]
  : S extends ""
  ? []
  : S extends `${infer T}${D}${infer U}`
  ? [T, ...Split<U, D>]
  : [S];

type JoinParts<T extends (string | number)[], D extends string> = T extends []
  ? never
  : T extends [infer F]
  ? `${F & (number | string)}`
  : T extends [infer F, ...infer R]
  ? F extends EndValue
    ? `${F}${D}${JoinParts<Extract<R, (string | number)[]>, D>}`
    : never
  : string;
// TODO: fix for TS4.8 for tuples, string to number literal cast
export type ArrayOrTupleKey<T> = StringNumber<keyof T & string> extends never ? number : StringNumber<keyof T & string>;

type GetPathParts<T, LeafsOnly extends boolean = false> = T extends EndValue
  ? []
  : Exclude<
      T extends Array<unknown>
        ?
            | {
                [K in ArrayOrTupleKey<T>]: [K, ...GetPathParts<T[K], LeafsOnly>];
              }[ArrayOrTupleKey<T>]
            | (LeafsOnly extends true ? never : [ArrayOrTupleKey<T>])
        :
            | {
                [K in Extract<keyof T, EndValue>]: [K, ...GetPathParts<T[K], LeafsOnly>];
              }[Extract<keyof T, EndValue>]
            | (LeafsOnly extends true ? never : [Extract<keyof T, EndValue>]),
      never
    >;

type GetPathPartsObjectOnly<T extends object> = T extends EndValue
  ? []
  : Exclude<
      {
        [K in Extract<keyof T, EndValue>]: [K, ...GetPathParts<T[K]>];
      }[Extract<keyof T, EndValue>],
      never
    >;

export type GetValueFromDotKey<T, P extends string> = InnerGetValueFromDotKey<T, Split<P, ".">>;
type InnerGetValueFromDotKey<T, P extends string[]> = T extends Array<unknown>
  ? InnerGetValueFromDotKeyArray<T, P>
  : T extends object
  ? InnerGetValueFromDotKeyObject<T, P>
  : never;
// TODO: fix for TS4.8 for tuples, string to number literal cast
type InnerGetValueFromDotKeyArray<T extends Array<unknown>, P extends string[]> = P extends [string]
  ? T[number]
  : P extends [string, ...infer R]
  ? InnerGetValueFromDotKey<T[number], Extract<R, string[]>>
  : never;
type InnerGetValueFromDotKeyObject<T extends object, P extends string[]> = P extends [infer K]
  ? T[K & keyof T]
  : P extends [keyof T, ...infer R]
  ? InnerGetValueFromDotKey<T[P[0] & keyof T], Extract<R, string[]>>
  : never;

/** @internal exported for tests */
export type DotNotationKeys<T extends InputValue, LeafsOnly extends boolean = false> = JoinParts<
  GetPathParts<T, LeafsOnly>,
  "."
>;

export type DotNotationObject<T extends InputValue> = {
  [K in DotNotationKeys<T>]: GetValueFromDotKey<T, K>;
};

export type FlatObject<T extends Record<string, unknown>> = {
  [K in JoinParts<GetPathPartsObjectOnly<T>, ".">]: GetValueFromDotKey<T, K>;
};

type AddDeletionMarkToLastPart<T> = T extends [...infer L, infer B]
  ? L extends (string | number)[]
    ? [...L, `-=${B & (string | number)}`]
    : never
  : never;
/** @internal exported for tests */
export type DeleteKeys<T> = JoinParts<AddDeletionMarkToLastPart<GetPathParts<T>>, ".">;
export type DeletionUpdate<T extends InputValue> = {
  [K in DeleteKeys<T> | DotNotationKeys<T>]?: K extends DeleteKeys<T> ? unknown : GetValueFromDotKey<T, K>;
};
