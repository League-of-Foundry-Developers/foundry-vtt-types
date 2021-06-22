import DocumentData, { AnyDocumentData } from '../foundry/common/abstract/data.mjs';
import Document from '../foundry/common/abstract/document.mjs';
import EmbeddedCollection from '../foundry/common/abstract/embedded-collection.mjs';

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

type ObjectToDeepPartial<T> = T extends object ? DeepPartial<T> : T;

export type PropertyTypeToSourceParameterType<T> = ObjectToDeepPartial<PropertyTypeToSourceType<T>>;

// TODO: Find a way to avoid this helper
export type FieldReturnType<T extends DocumentField<any>, U extends Partial<DocumentField<any>>> = Omit<T, keyof U> &
  Exclude<U, 'undefined'>;

export type DocumentConstructor = Pick<typeof Document, keyof typeof Document> &
  (new (...args: any[]) => Document<any, any>);

export type ConfiguredDocumentClass<T extends DocumentConstructor> = ConfiguredDocumentClassForName<
  T['metadata']['name']
>;

export type ConfiguredDocumentClassForName<Name extends keyof CONFIG> = 'documentClass' extends keyof CONFIG[Name]
  ? CONFIG[Name]['documentClass']
  : never;

export type ConfiguredData<Name extends string> = Name extends keyof DataConfig ? DataConfig[Name] : {};

export type ConfiguredSource<Name extends string> = Name extends keyof SourceConfig ? SourceConfig[Name] : {};

export type ToObjectFalseType<T> = T extends {
  toObject: (source: false) => infer U;
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
