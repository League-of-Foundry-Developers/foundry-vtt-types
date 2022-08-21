import _Collection from "../utils/collection.mjs";
import { AnyDocumentData } from "./data.mjs";
import { DocumentConstructor, ToObjectFalseType } from "../../../types/helperTypes";

type Collection<T> = Omit<_Collection<T>, "set" | "delete">;

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
  ContainedDocumentConstructor extends DocumentConstructor,
  ParentDocumentData extends AnyDocumentData
> extends Collection<InstanceType<ContainedDocumentConstructor>> {
  /**
   * @param documentData  - The parent DocumentData instance to which this collection belongs
   * @param sourceArray   - The source data array for the collection in the parent Document data
   * @param documentClass - The Document class implementation contained by the collection
   */
  constructor(
    documentData: ParentDocumentData,
    sourceArray: ConstructorParameters<ContainedDocumentConstructor>[0][],
    documentClass: ContainedDocumentConstructor
  );

  /**
   * The parent DocumentData to which this EmbeddedCollection instance belongs.
   */
  readonly parent: ParentDocumentData;

  /**
   * The parent DocumentData to which this EmbeddedCollection instance belongs.
   */
  readonly document: ParentDocumentData["document"];

  /**
   * The Document implementation used to construct instances within this collection
   */
  readonly documentClass: ContainedDocumentConstructor;

  /**
   * The source data array from which the embedded collection is created
   */
  readonly _source: DeepPartial<InstanceType<ContainedDocumentConstructor>["data"]["_source"]>[];

  /**
   * Initialize the EmbeddedCollection object by constructing its contained Document instances
   */
  protected _initialize(): void;

  set(
    key: string,
    value: InstanceType<ContainedDocumentConstructor>,
    { modifySource }: { modifySource?: boolean }
  ): this;

  delete(key: string, { modifySource }: { modifySource?: boolean }): boolean;

  /**
   * Convert the EmbeddedCollection to an array of simple objects.
   * @param source - Draw data for contained Documents from the underlying data source?
   *                 (default: `true`)
   * @returns The extracted array of primitive objects
   */
  toObject(source?: true): ReturnType<InstanceType<ContainedDocumentConstructor>["data"]["toJSON"]>[];
  toObject(source: false): ToObjectFalseType<InstanceType<ContainedDocumentConstructor>["data"]>[];
}

export default EmbeddedCollection;
