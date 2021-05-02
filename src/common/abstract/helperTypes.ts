/**
 * A convenience type to get the data type based on a {@link DocumentSchema}.
 * // TODO: Verify that `nullable` handling is correct.
 */
export type DocumentSchemaToData<
  ConcreteDocumentSchema extends DocumentSchema
> = RequiredFieldsToData<ConcreteDocumentSchema> & NonRequiredFieldsFieldsToData<ConcreteDocumentSchema>;

type RequiredFieldsToData<ConcreteDocumentSchema extends DocumentSchema> = {
  [Key in keyof ConcreteDocumentSchema as ConcreteDocumentSchema[Key] extends DocumentField<any>
    ? ConcreteDocumentSchema[Key] extends { required: true }
      ? Key
      : never
    : never]: ConcreteDocumentSchema[Key] extends DocumentField<infer U>
    ? ConcreteDocumentSchema[Key] extends { nullable: true }
      ? U | null
      : U
    : never;
};

type NonRequiredFieldsFieldsToData<ConcreteDocumentSchema extends DocumentSchema> = {
  [Key in keyof ConcreteDocumentSchema as ConcreteDocumentSchema[Key] extends DocumentField<any>
    ? ConcreteDocumentSchema[Key] extends { required: true }
      ? never
      : Key
    : never]?: ConcreteDocumentSchema[Key] extends DocumentField<infer U>
    ? ConcreteDocumentSchema[Key] extends { nullable: true }
      ? U | null
      : U
    : never;
};

// TODO: Find a way to avoid this helper
export type FieldReturnType<T extends DocumentField<any>, U extends Partial<DocumentField<any>>> = Omit<T, keyof U> &
  Exclude<U, 'undefined'>;
