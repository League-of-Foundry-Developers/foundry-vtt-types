import type { Identity, InexactPartial } from "#utils";
import type _Collection from "../utils/collection.d.mts";
import type { DatabaseBackend } from "#common/abstract/_module.d.mts";
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
  ContainedDocument extends Document.Any,
  ParentDocument extends Document.Any,
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
   * @remarks Defined via `Object.defineProperties` during construction with `{ writable: false }`
   */
  readonly documentClass: abstract new (arg0: never, ...args: never) => ContainedDocument;

  /**
   * The Document name of Documents stored in this collection.
   * @remarks Will probably always be a `string` in practice as it just gets the {@linkcode Document.documentName} from
   * {@linkcode documentClass}, but it does optional chain.
   */
  get documentName(): string | undefined;

  /**
   * The name of this collection in the parent Document.
   * @remarks Defined via `Object.defineProperties` during construction with `{ writable: false }`
   */
  readonly name: string;

  /**
   * The parent DataModel to which this EmbeddedCollection instance belongs.
   * @remarks Defined via `Object.defineProperties` during construction with `{ writable: false }`
   */
  readonly model: ParentDocument;

  /**
   * Has this embedded collection been initialized as a one-time workflow?
   * @defaultValue `false`
   */
  protected _initialized: boolean;

  /**
   * The source data array from which the embedded collection is created
   * @remarks Foundry explicitly marks this `@public`.
   *
   * Defined via `Object.defineProperties` during construction with `{ writable: false }`
   */
  readonly _source: ContainedDocument["_source"][];

  /**
   * Record the set of document ids where the Document was not initialized because of invalid source data
   * @defaultValue `new Set()`
   */
  invalidDocumentIds: Set<string>;

  /**
   * This collection's contents grouped by subtype, lazily (re-)computed as needed.
   * If the document type does not support subtypes, all will be in the "base" group.
   */
  get documentsByType(): Record<string, ContainedDocument[]>;

  /**
   * Initialize the EmbeddedCollection object by constructing its contained Document instances
   * @param options - Initialization options
   */
  protected initialize(options: EmbeddedCollection.InitializeOptions): void;

  /**
   * Initialize an embedded document and store it in the collection.
   * @param data    - The Document data.
   * @param options - Options to configure Document initialization.
   */
  protected _initializeDocument(
    data: ContainedDocument["_source"][],
    options: EmbeddedCollection.InitializeDocumentOptions,
  ): void;

  /**
   * Instantiate a Document for inclusion in the Collection
   */
  createDocument(
    data: Document.CreateDataForName<ContainedDocument["documentName"]>,
    context: EmbeddedCollection.DocumentConstructionContext,
  ): ContainedDocument;

  /**
   * Log warnings or errors when a Document is found to be invalid.
   * @param id      - The invalid Document's ID.
   * @param err     - The validation error
   * @param options - Options to configure invalid Document handling.
   */
  _handleInvalidDocument(id: string, err: Error, options: EmbeddedCollection.HandleInvalidDocumentOptions): void;

  /**
   * Get a document from the EmbeddedCollection by its ID.
   * @param id      - The ID of the Embedded Document to retrieve.
   * @param options - Additional options to configure retrieval.
   */
  get(id: string, options?: EmbeddedCollection.GetOptions): ContainedDocument | undefined;

  /**
   * Get a document from the EmbeddedCollection by its ID.
   * @param id      - The ID of the Embedded Document to retrieve.
   * @param options - Additional options to configure retrieval.
   */
  get(id: string, options: { strict: true; invalid?: false }): ContainedDocument;

  /**
   * Get a document from the EmbeddedCollection by its ID.
   * @param id      - The ID of the Embedded Document to retrieve.
   * @param options - Additional options to configure retrieval.
   */
  get(id: string, options: { strict?: boolean; invalid: true }): unknown;

  /**
   * Add a document to the collection
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
   * Remove a document from the collection.
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
  toObject(source?: boolean | null): ContainedDocument["_source"][];

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
    action: DatabaseBackend.DatabaseAction,
    documents: ContainedDocument[],
    result: unknown,
    operation: DatabaseBackend.DatabaseOperation,
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
      filters: foundry.applications.ux.SearchFilter.FieldFilter[];

      /**
       * An array of document IDs to exclude from search results
       * @defaultValue `[]`
       */
      exclude: string[];
    }>,
  ): ContainedDocument[];

  #EmbeddedCollection: true;
}

declare namespace EmbeddedCollection {
  interface Any extends AnyEmbeddedCollection {}
  interface AnyConstructor extends Identity<typeof AnyEmbeddedCollection> {}

  /**
   * Options for {@linkcode EmbeddedCollection.initialize | EmbeddedCollection#initialize}, which get passed to
   * {@linkcode EmbeddedCollection._initializeDocument | EmbeddedCollection#_initializeDocument}
   */
  interface InitializeOptions extends InitializeDocumentOptions {}

  /**
   * Options for {@linkcode EmbeddedCollection._initializeDocument | EmbeddedCollection#_initializeDocument}, which get passed to
   * {@linkcode Document._initialize | Document#_initialize},
   * {@linkcode EmbeddedCollection.createDocument | EmbeddedCollection#createDocument}, and possibly
   * {@linkcode EmbeddedCollection._handleInvalidDocument | EmbeddedCollection#_handleInvalidDocument}
   */
  interface InitializeDocumentOptions extends DocumentConstructionContext, HandleInvalidDocumentOptions {}

  /**
   * The context interface for {@linkcode EmbeddedCollection.createDocument | EmbeddedCollection#createDocument}
   * The omitted properties are defined after spreading the passed context into a new object, overwriting any passed values
   */
  interface DocumentConstructionContext
    extends Omit<Document.ConstructionContext, "parent" | "parentCollection" | "pack"> {}

  interface HandleInvalidDocumentOptions {
    /**
     * Whether to throw an error or only log a warning.
     * @defaultValue `true`
     */
    // TODO: strip null when cleaning up DataModel types, this is only required because of a NullishProps somewhere
    strict?: boolean | null | undefined;
  }

  /** @internal */
  type _GetOptions = InexactPartial<{
    /**
     * Throw an Error if the requested Embedded Document does not exist.
     * @defaultValue `false`
     */
    strict: boolean;

    /**
     * Allow retrieving an invalid Embedded Document.
     * @defaultValue `false`
     */
    invalid: boolean;
  }>;

  interface GetOptions extends _GetOptions {}

  type _SetOptions = InexactPartial<{
    /**
     * Whether to modify the collection's source as part of the operation.
     */
    modifySource: boolean;
  }>;

  /**
   * Options for {@linkcode EmbeddedCollection.set | EmbeddedCollection#set}
   *
   * @privateRemarks Foundry collects keys other than `modifySource` as `...options` and passes them on to `this._set`; that method does not
   * take `options` in `EmbeddedCollection`, but does in {@linkcode foundry.abstract.EmbeddedCollectionDelta | EmbeddedCollectionDelta}.
   * Since that class also has a `#set` override, the extra property(s) are not included here.
   */
  interface SetOptions extends _SetOptions {}
}

export default EmbeddedCollection;

declare abstract class AnyEmbeddedCollection extends EmbeddedCollection<Document.Any, Document.Any> {
  constructor(...args: never);
}
