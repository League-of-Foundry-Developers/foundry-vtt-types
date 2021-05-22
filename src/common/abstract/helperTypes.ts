import DocumentData from './data';
import Document from './document';

export type PropertiesToSource<T extends object> = {
  [Key in keyof T]: PropertyTypeToSourceType<T[Key]>;
};

export type PropertyTypeToSourceParameterType<T> = ObjectToDeepPartial<PropertyTypeToSourceType<T>>;

type ObjectToDeepPartial<T> = T extends object ? DeepPartial<T> : T;

type PropertyTypeToSourceType<T> = T extends Array<infer U>
  ? Array<PropertyTypeToSourceType<U>>
  : T extends DocumentData<any, infer U, any>
  ? U
  : T;

// TODO: Find a way to avoid this helper
export type FieldReturnType<T extends DocumentField<any>, U extends Partial<DocumentField<any>>> = Omit<T, keyof U> &
  Exclude<U, 'undefined'>;

export type SourceDataType<T extends Document<any, any> | DocumentData<any, any, any>> = T extends DocumentData<
  any,
  infer U,
  any
>
  ? U
  : T extends Document<infer U, any>
  ? SourceDataType<U>
  : never;
