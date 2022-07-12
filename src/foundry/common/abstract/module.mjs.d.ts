import DataModel, { DataSchema } from './data.mjs';

export * from './data.mjs';
export { default as Document } from './document.mjs';
export { default as DatabaseBackend } from './backend.mjs';
export { default as EmbeddedCollection } from './embedded-collection.mjs';

/**
 * @deprecated since v10
 * @see DataModel
 */
export class DocumentData<Parent extends AnyDocument | null, ConcreteDataSchema extends DataSchema> extends DataModel<
  Parent,
  ConcreteDataSchema
> {
  constructor(data?: DataModel.SchemaToSourceInput<ConcreteDataSchema>, options?: DataModel.ConstructorOptions);
}
