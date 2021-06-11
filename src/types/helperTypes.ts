import DocumentData from '../foundry/common/abstract/data.mjs';
import Document from '../foundry/common/abstract/document.mjs';
import EmbeddedCollection from '../foundry/common/abstract/embedded-collection.mjs';

export type PropertiesDataType<T extends Document<any, any> | DocumentData<any, any, any>> = T extends DocumentData<
  any,
  infer U,
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
  : T extends DocumentData<any, infer U, any>
  ? PropertyTypeToSourceType<U>
  : T;

export type PropertiesToSource<T extends object> = {
  [Key in keyof T]: PropertyTypeToSourceType<T[Key]>;
};

export type SourceDataType<T extends Document<any, any> | DocumentData<any, any, any>> = PropertiesToSource<
  PropertiesDataType<T>
>;

type ObjectToDeepPartial<T> = T extends object ? DeepPartial<T> : T;

export type PropertyTypeToSourceParameterType<T> = ObjectToDeepPartial<PropertyTypeToSourceType<T>>;

// TODO: Find a way to avoid this helper
export type FieldReturnType<T extends DocumentField<any>, U extends Partial<DocumentField<any>>> = Omit<T, keyof U> &
  Exclude<U, 'undefined'>;

export type DocumentConstructor = Pick<typeof Document, keyof typeof Document> &
  (new (...args: any[]) => Document<any, any>);

export type ConfiguredDocumentClass<T extends DocumentConstructor> = T['metadata']['name'] extends keyof CONFIG
  ? 'documentClass' extends keyof CONFIG[T['metadata']['name']]
    ? CONFIG[T['metadata']['name']]['documentClass']
    : never
  : T;

export type ConfiguredData<Name extends string, T extends DocumentData<any, any, any>> = Name extends keyof DataConfig
  ? DataConfig[Name]
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
