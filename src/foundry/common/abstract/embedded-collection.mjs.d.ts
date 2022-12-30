import { ToObjectFalseType } from "../../../types/helperTypes";
import _Collection from "../utils/collection.mjs";
import { AnyDataModel } from "./data.mjs";
import type { AnyDocument } from "./document.mjs.js";

type Collection<T> = Omit<_Collection<T>, "set" | "delete">;

interface CollectionConstructor {
  new (): Collection<any>;
  new <T>(entries?: readonly (readonly [string, T])[] | null): Collection<T>;
  new <T>(iterable: Iterable<readonly [string, T]>): Collection<T>;
  readonly [Symbol.species]: CollectionConstructor;
  readonly prototype: Collection<any>;
}

declare const Collection: CollectionConstructor;

export default EmbeddedCollection;
/**
 * An extension of the Collection.
 * Used for the specific task of containing embedded Document instances within a parent Document.
 */
declare class EmbeddedCollection<
  ContainedDocumentConstructor extends ConstructorOf<AnyDocument>,
  ParentDataModel extends AnyDataModel
> extends Collection<InstanceType<ContainedDocumentConstructor>> {
  /**
   * @param documentData  - The parent DataModel instance to which this collection belongs
   * @param sourceArray   - The source data array for the collection in the parent Document data
   * @param documentClass - The Document class contained in the collection
   */
  constructor(
    documentData: ParentDataModel,
    sourceArray: ConstructorParameters<ContainedDocumentConstructor>[0][],
    documentClass: ContainedDocumentConstructor
  );

  /**
   * The Document implementation used to construct instances within this collection.
   */
  readonly documentClass: ContainedDocumentConstructor;

  /**
   * The parent DataModel to which this EmbeddedCollection instance belongs.
   */
  #model: ParentDataModel;

  /**
   * Has this embedded collection been initialized as a one-time workflow?
   * @defaultValue `false`
   */
  #initialized: boolean;

  /**
   * The source data array from which the embedded collection is created
   * @internal
   */
  protected readonly _source: ConstructorParameters<ContainedDocumentConstructor>[0][];

  /**
   * Record the set of document ids where the Document was not initialized because of invalid source data
   * @defaultValue `new Set()`
   */
  invalidDocumentIds: Set<string>;

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
   * Update an EmbeddedCollection using an array of provided document data.
   * @param changes - An array of provided Document data
   * @param options - Additional options which modify how the collection is updated
   */
  update(
    changes: InstanceType<ContainedDocumentConstructor>[],
    options: Parameters<AnyDataModel["updateSource"]>[1]
  ): void;

  /**
   * Obtain a temporary Document instance for a document id which currently has invalid source data.
   * @param id - A document ID with invalid source data.
   * @returns An in-memory instance for the invalid Document
   */
  getInvalid(id: string): InstanceType<ContainedDocumentConstructor>;

  /**
   * Convert the EmbeddedCollection to an array of simple objects.
   * @param source - Draw data for contained Documents from the underlying data source?
   *                 (default: `true`)
   * @returns The extracted array of primitive objects
   */
  toObject(source?: true): ReturnType<InstanceType<ContainedDocumentConstructor>["toJSON"]>[];
  toObject(source: false): ToObjectFalseType<InstanceType<ContainedDocumentConstructor>>[];
}
