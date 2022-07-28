import _Collection from '../utils/collection.mjs';
import { DataModel } from './data.mjs';
import { ToObjectFalseType } from '../../../types/helperTypes';

type Collection<T> = Omit<_Collection<T>, 'set' | 'delete'>;

interface CollectionConstructor {
  new (): Collection<any>;
  new <T>(entries?: readonly (readonly [string, T])[] | null): Collection<T>;
  new <T>(iterable: Iterable<readonly [string, T]>): Collection<T>;
  readonly [Symbol.species]: CollectionConstructor;
  readonly prototype: Collection<any>;
}

declare const Collection: CollectionConstructor;

/**
 * An extension of the Collection.
 * Used for the specific task of containing embedded Document instances within a parent Document.
 */
declare class EmbeddedCollection<
  DocumentClass extends foundry.abstract.Document.AnyConstructor,
  ConcreteDataModel extends DataModel.Any
> extends Collection<InstanceType<DocumentClass>> {
  /**
   * @param model         - The parent DataModel instance to which this collection belongs
   * @param sourceArray   - The source data array for the collection in the parent Document data
   * @param documentClass - The Document class implementation contained by the collection
   */
  constructor(
    model: ConcreteDataModel,
    sourceArray: DeepPartial<InstanceType<DocumentClass>['_source']>[],
    documentClass: DocumentClass
  );

  /**
   * The Document implementation used to construct instances within this collection.
   */
  readonly documentClass: DocumentClass;

  /**
   * The parent DataModel to which this EmbeddedCollection instance belongs.
   */
  #model: ConcreteDataModel;

  /**
   * The source data array from which the embedded collection is created
   */
  readonly _source: DeepPartial<InstanceType<DocumentClass>['_source']>[];

  /**
   * Initialize the EmbeddedCollection object by constructing its contained Document instances
   */
  #initialize(): void;

  set(key: string, value: InstanceType<DocumentClass>, { modifySource }: { modifySource?: boolean }): this;

  delete(key: string, { modifySource }: { modifySource?: boolean }): boolean;

  /**
   * Convert the EmbeddedCollection to an array of simple objects.
   * @param source - Draw data for contained Documents from the underlying data source?
   *                 (default: `true`)
   * @returns The extracted array of primitive objects
   */
  toObject(source?: true): ReturnType<ConcreteDataModel['toJSON']>[];
  toObject(source: false): ToObjectFalseType<ConcreteDataModel>[];
}

export default EmbeddedCollection;
