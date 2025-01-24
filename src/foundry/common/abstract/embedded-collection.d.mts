import type { InexactPartial } from "../../../utils/index.d.mts";
import type _Collection from "../utils/collection.d.mts";
import type { DatabaseAction, DatabaseOperation } from "./_types.d.mts";
import type Document from "./document.d.mts";

// Fix for "Class 'Collection<ContainedDocument>' defines instance member property 'get',
// but extended class 'EmbeddedCollection<ContainedDocument, ParentDataModel>' defines it as instance member function."
type Collection<T> = Omit<_Collection<T>, "set" | "delete" | "get">;

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
  ContainedDocument extends foundry.abstract.Document.Any,
  ParentDocument extends foundry.abstract.Document.Any,
> extends Collection<ContainedDocument> {
  /**
   * @param name          - The name of this collection in the parent Document.
   * @param parent        - The parent Document instance to which this collection belongs
   * @param sourceArray   - The source data array for the collection in the parent Document data
   *
   * @remarks Foundry documents parent as being a `DataModel` but it actually has to be a `Document`.
   */
  constructor(name: string, parent: ParentDocument, sourceArray: ContainedDocument["_source"][]);

  /**
   * The Document implementation used to construct instances within this collection
   */
  readonly documentClass: abstract new (arg0: never, ...args: never) => ContainedDocument;

  /**
   * The name of this collection in the parent Document.
   */
  readonly name: string;

  /**
   * The parent DataModel to which this EmbeddedCollection instance belongs.
   */
  readonly model: ParentDocument;

  /**
   * Has this embedded collection been initialized as a one-time workflow?
   * @defaultValue `false`
   */
  protected _initialized: boolean;

  /**
   * The source data array from which the embedded collection is created
   */
  protected readonly _source: ContainedDocument["_source"][];

  /**
   * Record the set of document ids where the Document was not initialized because of invalid source data
   */
  invalidDocumentIds: Set<string>;

  /**
   * Instantiate a Document for inclusion in the Collection
   */
  createDocument(
    data: ContainedDocument["_source"][],
    context: Document.ConstructionContext<Document.Any | null>,
  ): ContainedDocument;

  /**
   * Initialize the EmbeddedCollection object by constructing its contained Document instances
   * @param options - Initialization options
   */
  protected initialize(options: Document.ConstructionContext<ContainedDocument>): void;

  /**
   * Initialize an embedded document and store it in the collection.
   * @param data    - The Document data.
   * @param options - Options to configure Document initialization.
   */
  protected _initializeDocument(
    data: ContainedDocument["_source"][],
    options: Document.ConstructionContext<ContainedDocument>,
  ): void;

  /**
   * Log warnings or errors when a Document is found to be invalid.
   * @param id      - The invalid Document's ID.
   * @param err     - The validation error
   * @param options - Options to configure invalid Document handling.
   */
  _handleInvalidDocument(
    id: string,
    err: Error,
    options: InexactPartial<{
      /**
       * Whether to throw an error or only log a warning.
       */
      strict: boolean;
    }>,
  ): void;

  /**
   * Get an element from the EmbeddedCollection by its ID.
   * @param id      - The ID of the Embedded Document to retrieve.
   * @param options - Additional options to configure retrieval.
   */
  get(
    key: string,
    options?: InexactPartial<{
      /**
       * Throw an Error if the requested Embedded Document does not exist.
       * @defaultValue `false`
       */
      strict: false;
      /**
       * Allow retrieving an invalid Embedded Document.
       * @defaultValue `false`
       */
      invalid: false;
    }>,
  ): ContainedDocument | undefined;
  /**
   * Get an element from the EmbeddedCollection by its ID.
   * @param id      - The ID of the Embedded Document to retrieve.
   * @param options - Additional options to configure retrieval.
   */
  get(id: string, options: { strict: true; invalid?: false }): ContainedDocument;
  /**
   * Get an element from the EmbeddedCollection by its ID.
   * @param id      - The ID of the Embedded Document to retrieve.
   * @param options - Additional options to configure retrieval.
   */
  get(id: string, options: { strict?: boolean; invalid: true }): unknown;

  /**
   * Add an item to the collection
   * @param key     - The embedded Document ID
   * @param value   - The embedded Document instance
   * @param options - Additional options to the set operation
   */
  set(
    key: string,
    value: ContainedDocument,
    options?: InexactPartial<{
      /**
       * Whether to modify the collection's source as part of the operation.
       * @defaultValue `true`
       */
      modifySource: boolean;
    }>,
  ): this;

  /**
   * Modify the underlying source array to include the Document.
   * @param key   - The Document ID Key
   * @param value - The Document
   */
  protected _set(key: string, value: ContainedDocument): void;

  /**
   * @param key     - The embedded Document ID.
   * @param options - Additional options to the delete operation.
   */
  delete(
    key: string,
    options?: {
      /**
       * Whether to modify the collection's source as part of the operation.
       */
      modifySource?: boolean;
    },
  ): boolean;

  /**
   * Remove the value from the underlying source array.
   * @param key     - The Document ID key.
   * @param options - Additional options to configure deletion behavior.
   */
  protected _delete(key: string, options: Record<string, unknown>): void;

  /**
   * Update an EmbeddedCollection using an array of provided document data.
   * @param changes - An array of provided Document data
   * @param options - Additional options which modify how the collection is updated
   */
  update(changes: ContainedDocument["_source"][][], options?: Record<string, unknown>): void;

  protected _createOrUpdate(
    data: ContainedDocument["_source"][][],
    options?: Parameters<ContainedDocument["updateSource"]>[1],
  ): void;

  // TODO: Improve typing on invalid documents
  /**
   * Obtain a temporary Document instance for a document id which currently has invalid source data.
   * @param id      - A document ID with invalid source data.
   * @param options - Additional options to configure retrieval.
   * @returns An in-memory instance for the invalid Document
   * @throws If strict is true and the requested ID is not in the set of invalid IDs for this collection.
   */
  getInvalid(
    id: string,
    options?: {
      /**
       * Throw an Error if the requested ID is not in the set of invalid IDs for this collection
       */
      strict?: false;
    },
  ): unknown;
  getInvalid(
    id: string,
    options: {
      /**
       * Throw an Error if the requested ID is not in the set of invalid IDs for this collection
       */
      strict: true;
    },
  ): unknown;

  /**
   * Convert the EmbeddedCollection to an array of simple objects.
   * @param source - Draw data for contained Documents from the underlying data source?
   *                 (default: `true`)
   * @returns The extracted array of primitive objects
   */
  toObject(source?: true): ContainedDocument["_source"][];
  toObject(source: false): ReturnType<ContainedDocument["schema"]["toObject"]>[];

  /**
   * Follow-up actions to take when a database operation modifies Documents in this EmbeddedCollection.
   * @param action    - The database action performed
   * @param documents - The array of modified Documents
   * @param result    - The result of the database operation
   * @param operation - Database operation details
   * @param user      - The User who performed the operation
   * @internal
   */
  _onModifyContents(
    action: DatabaseAction,
    documents: foundry.abstract.Document.Any[],
    result: unknown,
    operation: DatabaseOperation,
    user: User.Implementation,
  ): void;

  /**
   * Find all Documents which match a given search term using a full-text search against their indexed HTML fields and their name.
   * If filters are provided, results are filtered to only those that match the provided values.
   * @param search   - An object configuring the search
   *
   * @remarks This is added in `Game#setupGame` through monkeypatching; `foundry.abstract.EmbeddedCollection.prototype.search = DocumentCollection.prototype.search;`
   * this technically means it's not set until right after init.
   */
  search(
    search?: InexactPartial<{
      /**
       * A case-insensitive search string
       * @defaultValue `""`
       */
      query: string;
      /**
       * An array of filters to apply
       * @defaultValue `[]`
       */
      filters: FieldFilter[];
      /**
       * An array of document IDs to exclude from search results
       * @defaultValue `[]`
       */
      exclude: string[];
    }>,
  ): ContainedDocument[];
}

export default EmbeddedCollection;
