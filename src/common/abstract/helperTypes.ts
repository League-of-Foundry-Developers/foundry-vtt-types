import DocumentData from './data';
import Document from './document';
import EmbeddedCollection from './embeddedCollection';

type PropertiesDataType<T extends Document<any, any> | DocumentData<any, any, any>> = T extends DocumentData<
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
  ? U
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

export type ConfiguredDocumentClass<T extends DocumentConstructor> = OnlyIfExtends<
  T['metadata']['name'] extends keyof CONFIG
    ? 'documentClass' extends keyof CONFIG[T['metadata']['name']]
      ? CONFIG[T['metadata']['name']]['documentClass']
      : never
    : T,
  DocumentConstructor
>;

type OnlyIfExtends<T, U> = T extends U ? T : never;
