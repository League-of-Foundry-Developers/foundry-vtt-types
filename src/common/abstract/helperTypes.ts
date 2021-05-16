import DocumentData from './data';

export type PropertiesToSource<T extends object> = {
  [Key in keyof T]: PropertyTypeToSourceType<T[Key]>;
};

type PropertyTypeToSourceType<T> = T extends Array<infer U>
  ? Array<PropertyTypeToSourceType<U>>
  : T extends DocumentData<any, infer U, any>
  ? U
  : T;

// TODO: Find a way to avoid this helper
export type FieldReturnType<T extends DocumentField<any>, U extends Partial<DocumentField<any>>> = Omit<T, keyof U> &
  Exclude<U, 'undefined'>;
