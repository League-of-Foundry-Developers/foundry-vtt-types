import DataModel from '../foundry/common/abstract/data.mjs';
import Document from '../foundry/common/abstract/document.mjs';
import type { SubTypeShape } from './config.js';

type ObjectToDeepPartial<T> = T extends object ? DeepPartial<T> : T;

export type DataModelConstructor = Pick<typeof DataModel, keyof typeof DataModel> &
  (new (...args: any[]) => Document<any, any, any, any>);

export type DocumentConstructor = Pick<typeof Document, keyof typeof Document> &
  (new (...args: any[]) => Document<any, any, any, any>);

export type PlaceableObjectConstructor = Pick<typeof PlaceableObject, keyof typeof PlaceableObject> &
  (new (...args: any[]) => PlaceableObject<any>);

export type ConfiguredDocumentClass<T extends DocumentConstructor> = ConfiguredDocumentClassForName<
  T['metadata']['name']
>;

export type SystemDocumentType = 'Actor' | 'Card' | 'Cards' | 'Item';

export type DocumentType =
  | 'Actor'
  | 'Adventure'
  | 'Cards'
  | 'ChatMessage'
  | 'Combat'
  | 'FogExploration'
  | 'Folder'
  | 'Item'
  | 'JournalEntry'
  | 'JournalEntryPage'
  | 'Macro'
  | 'Playlist'
  | 'RollTable'
  | 'Scene'
  | 'Setting'
  | 'User'
  | 'ActiveEffect'
  | 'Card'
  | 'TableResult'
  | 'PlaylistSound'
  | 'AmbientLight'
  | 'AmbientSound'
  | 'Combatant'
  | 'Drawing'
  | 'MeasuredTemplate'
  | 'Note'
  | 'Tile'
  | 'Token'
  | 'Wall';

export type PlaceableDocumentType =
  | 'AmbientLight'
  | 'AmbientSound'
  | 'Drawing'
  | 'MeasuredTemplate'
  | 'Note'
  | 'Tile'
  | 'Token'
  | 'Wall';

export type DocumentSubTypes<T extends DocumentType> = 'type' extends keyof InstanceType<
  ConfiguredDocumentClassForName<T>
>['_source']
  ? InstanceType<ConfiguredDocumentClassForName<T>>['_source']['type']
  : typeof foundry.CONST.BASE_DOCUMENT_TYPE;

export type ConfiguredDocumentClassForName<Name extends DocumentType> = CONFIG[Name]['documentClass'];

export type ConfiguredObjectClassForName<Name extends PlaceableDocumentType> = CONFIG[Name]['objectClass'];

type SubtypeData<SubType, SubTypeValue extends SubTypeShape | undefined> = SubTypeValue extends undefined
  ? Record<string, unknown>
  : (
      | GetKey<SubTypeValue, 'data', never>
      | DataModel.SchemaToData<GetKey<GetKey<SubTypeValue, 'model', never>, 'schema', never>>
    ) & {
      type: SubType;
    };

export type ConfiguredData<Name extends SystemDocumentType> = Coalesce<
  | (Name extends keyof DataConfig ? DataConfig[Name] : never)
  | (SystemConfig[Name] extends undefined
      ? Record<string, unknown>
      : {
          [K in keyof SystemConfig[Name]]: SystemConfig[Name][K] extends SubTypeShape
            ? SubtypeData<K, SystemConfig[Name][K]>
            : never;
        }[keyof SystemConfig[Name]]),
  never,
  {}
>;

type SubtypeSource<SubType, SubTypeValue extends SubTypeShape | undefined> = SubTypeValue extends undefined
  ? Record<string, unknown>
  : (
      | GetKey<SubTypeValue, 'source', never>
      | DataModel.SchemaToSource<GetKey<GetKey<SubTypeValue, 'model', never>, 'schema', never>>
    ) & {
      type: SubType;
    };

export type ConfiguredSource<Name extends SystemDocumentType> = Coalesce<
  | (Name extends keyof SourceConfig ? SourceConfig[Name] : never)
  | ([SystemConfig[Name]] extends [undefined]
      ? never
      : {
          [K in keyof SystemConfig[Name]]: SystemConfig[Name][K] extends SubTypeShape
            ? SubtypeSource<K, SystemConfig[Name][K]>
            : never;
        }[keyof SystemConfig[Name]]),
  never,
  {}
>;

export type ConfiguredFlags<T extends string> = T extends keyof FlagConfig
  ? FlagConfig[T] & Record<string, unknown>
  : Record<string, unknown>;

export type ToObjectFalseType<T> = ToObjectType<T, false>;
export type ToObjectType<T, Source extends boolean> = T extends {
  toObject: (source: Source) => infer U;
}
  ? U
  : T;

export type ConfiguredSheetClass<T extends DocumentConstructor> = T['metadata']['name'] extends keyof CONFIG
  ? 'sheetClass' extends keyof CONFIG[T['metadata']['name']]
    ? CONFIG[T['metadata']['name']]['sheetClass']
    : never
  : T;

export type ObjectClass<T extends DocumentConstructor> = T['metadata']['name'] extends keyof CONFIG
  ? 'objectClass' extends keyof CONFIG[T['metadata']['name']]
    ? CONFIG[T['metadata']['name']]['objectClass']
    : never
  : T;

export type LayerClass<T extends DocumentConstructor> = T['metadata']['name'] extends keyof CONFIG
  ? 'layerClass' extends keyof CONFIG[T['metadata']['name']]
    ? CONFIG[T['metadata']['name']]['layerClass']
    : never
  : T;

export type DataSourceForPlaceable<P extends PlaceableObject> = P extends PlaceableObject<infer Doc>
  ? Doc['_source']
  : never;

export type Falsy = 0 | 0n | null | undefined | typeof NaN | '' | typeof document['all'];
export type JSOr<T, U> = T extends unknown ? (T extends Falsy ? U : T) : never;

/**
 * In various places we need to add computed top level properties. Unfortunately that seems to be impossible using `declare class` as mapped types and other things enabling computed properties don't work there.
 * In order to get around this limitation we define the class as it really is structurally, just a constructor function.
 * This version of a class is not feature complete, for example inside of it you cannot have method modifiers such as private/public/abstract. For this reason it's only used for computed properties.
 * `Instance` MUST be an object, as in `{ ... }` and not an array which the _type_ `object` allows. The reason why the type `object` is used is because `Record<string, unknown>` or other variants that more accurately type this also include an index signature which we do not want.
 * In the context of a class an index signature is very undesirable because any classes extending this will have to combat the index signature emitting errors about any added properties potentially colliding and also allowing any property to be accessed.
 * We cannot use `RemoveIndex` within this type itself because then it becomes impossible to extend correctly because of extremely buggy behavior.
 * To work around this users of `StructuralClass` are recommended to have a generic parameter like `_ComputedInstance extends Record<string, unknown> = RemoveIndex<...>`
 */
export const StructuralClass: new <Instance extends object, Args extends any[] = []>(...args: Args) => Instance;

export type OmitByValue<T, ValueType> = { [Key in keyof T as T[Key] extends ValueType ? never : Key]: T[Key] };
