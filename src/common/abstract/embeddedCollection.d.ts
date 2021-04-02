import Collection from '../utils/collection';

interface EmbeddedCollection<T> extends Omit<Collection<T>, 'set' | 'delete'> {
  /** {@inheritdoc} */
  set(key: string, value: T, { modifySource }: { modifySource?: boolean }): this;

  /** {@inheritdoc} */
  delete(key: string, { modifySource }: { modifySource?: boolean }): boolean;
}

interface EmbeddedCollectionConstructor {
  new (sourceArray: Array<{ _id: string | null } & Record<string, unknown>>): EmbeddedCollection<any>;
  readonly [Symbol.species]: EmbeddedCollectionConstructor;
  readonly prototype: EmbeddedCollection<any>;
}

declare var EmbeddedCollection: EmbeddedCollectionConstructor; // eslint-disable-line no-var

export default EmbeddedCollection;
