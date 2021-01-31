/**
 * Recursively sets keys of an object to optional. Used primarily for update methods
 * @internal
 */
declare type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};
