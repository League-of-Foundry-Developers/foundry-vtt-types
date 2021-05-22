import _Collection from '../utils/collection';
import DocumentData from './data';
import { SourceDataType } from './helperTypes';

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
  ContainedDocumentData extends DocumentData<any, any, any>,
  ParentDocumentData extends DocumentData<any, any, any>
> extends Collection {
  /**
   * @param documentData  - The parent DocumentData instance to which this collection belongs
   * @param sourceArray   - The source data array for the collection in the parent Document data
   * @param documentClass - The Document class implementation contained by the collection
   */
  constructor(
    documentData: ParentDocumentData,
    sourceArray: DeepPartial<SourceDataType<ContainedDocumentData>>[],
    documentClass: ConstructorOf<ContainedDocumentData>
  );

  /**
   * The source data array from which the embedded collection is created
   */
  _source: DeepPartial<SourceDataType<ContainedDocumentData>>[];

  /**
   * The parent DocumentData to which this EmbeddedCollection instance belongs.
   */
  document: ParentDocumentData['document'];

  /**
   * The Document implementation used to construct instances within this collection
   */
  documentClass: ConstructorOf<ContainedDocumentData>;

  /**
   * The parent DocumentData to which this EmbeddedCollection instance belongs.
   */
  parent: ParentDocumentData;

  delete(key: string, { modifySource }: { modifySource?: boolean }): boolean;

  set(key: string, value: ContainedDocumentData, { modifySource }: { modifySource?: boolean }): this;

  /**
   * Convert the EmbeddedCollection to an array of simple objects.
   * @param source - Draw data for contained Documents from the underlying data source?
   *                 (default: `true`)
   * @returns The extracted array of primitive objects
   */
  toObject(source?: true): ReturnType<ContainedDocumentData['toJSON']>[];
  toObject(source: false): ReturnType<ContainedDocumentData['toObject']>[];

  /**
   * Initialize the EmbeddedCollection object by constructing its contained Document instances
   */
  protected _initialize(): void;
}

export default EmbeddedCollection;
