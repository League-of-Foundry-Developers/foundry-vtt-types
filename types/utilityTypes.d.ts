declare namespace UtilityTypes {
  type Flattened<T> = T extends Array<infer U> ? Flattened<U> : T;
}
