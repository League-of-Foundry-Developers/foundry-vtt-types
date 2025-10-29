import type { Identity, InexactPartial } from "#utils";
import type _Collection from "../utils/collection.d.mts";
import type Document from "./document.d.mts";
import type { DocumentCollection } from "#client/documents/abstract/_module.d.mts";

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
  readonly documentClass: Document.ImplementationClassFor<ContainedDocument["documentName"]>;

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
   * @param options - Initialization options (default: `{}`)
   */
  initialize(options?: EmbeddedCollection.InitializeOptions): void;

  /**
   * Initialize an embedded document and store it in the collection.
   * @param data    - The Document data.
   * @param options - Options to configure Document initialization.
   *
   * @remarks `options` doesn't have a parameter default, but it only passed to places that do, so it's optional here
   */
  protected _initializeDocument(
    data: ContainedDocument["_source"],
    options?: EmbeddedCollection.InitializeDocumentOptions,
  ): void;

  /**
   * Instantiate a Document for inclusion in the Collection
   * @remarks `parent`, `parentCollection`, and `pack` are overwritten, see {@linkcode EmbeddedCollection.DocumentConstructionContext}.
   */
  createDocument(
    data: Document.CreateDataForName<ContainedDocument["documentName"]>,
    context?: EmbeddedCollection.DocumentConstructionContext,
  ): ContainedDocument;

  /**
   * Log warnings or errors when a Document is found to be invalid.
   * @param id      - The invalid Document's ID.
   * @param err     - The validation error
   * @param options - Options to configure invalid Document handling.
   */
  protected _handleInvalidDocument(
    id: string,
    err: Error,
    options?: EmbeddedCollection.HandleInvalidDocumentOptions,
  ): void;

  /**
   * Get a document from the EmbeddedCollection by its ID.
   * @param id      - The ID of the Embedded Document to retrieve.
   * @param options - Additional options to configure retrieval.
   *
   * @remarks @see {@linkcode EmbeddedCollection.GetReturn}
   */
  get<Invalid extends boolean | undefined = undefined, Strict extends boolean | undefined = undefined>(
    id: string,
    options?: EmbeddedCollection.GetOptions<Invalid, Strict>,
  ): EmbeddedCollection.GetReturn<ContainedDocument, Invalid, Strict>;

  /**
   * Add a document to the collection
   * @param key     - The embedded Document ID
   * @param value   - The embedded Document instance
   * @param options - Additional options to the set operation
   */
  set(key: string, value: ContainedDocument, options?: EmbeddedCollection.SetOptions): this;

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
  delete(key: string, options?: EmbeddedCollection.DeleteOptions): boolean;

  /**
   * Remove the value from the underlying source array.
   * @param key     - The Document ID key.
   * @param options - Additional options to configure deletion behavior.
   *
   * @remarks This implementation makes no use of `options`
   */
  protected _delete(key: string, options?: EmbeddedCollection.DeleteOptions): void;

  /**
   * Obtain a temporary Document instance for a document id which currently has invalid source data.
   * @param id      - A document ID with invalid source data.
   * @param options - Additional options to configure retrieval.
   * @returns An in-memory instance for the invalid Document
   * @throws If strict is true and the requested ID is not in the set of invalid IDs for this collection.
   */
  getInvalid<Strict extends boolean | undefined = undefined>(
    id: string,
    options?: EmbeddedCollection.GetInvalidOptions<Strict>,
  ): EmbeddedCollection.GetInvalidReturn<ContainedDocument, Strict>;

  /**
   * Convert the EmbeddedCollection to an array of simple objects.
   * @param source - Draw data for contained Documents from the underlying data source? (default: `true`)
   * @returns The extracted array of primitive objects
   */
  toObject(source?: boolean): ContainedDocument["_source"][];

  /**
   * Follow-up actions to take when a database operation modifies Documents in this EmbeddedCollection.
   * @param action    - The database action performed
   * @param documents - The array of modified Documents
   * @param result    - The result of the database operation
   * @param operation - Database operation details
   * @param user      - The User who performed the operation
   * @internal
   */
  _onModifyContents<Action extends Document.Database2.OperationAction>(
    action: Action,
    documents: ContainedDocument[],
    result: EmbeddedCollection.OnModifyContentsResult<ContainedDocument, Action>,
    operation: EmbeddedCollection.OnModifyContentsOperation<ContainedDocument, Action>,
    user: User.Stored,
  ): void;

  /**
   * Find all Documents which match a given search term using a full-text search against their indexed HTML fields and their name.
   * If filters are provided, results are filtered to only those that match the provided values.
   * @param search - An object configuring the search
   *
   * @remarks This is added in `Game#setupGame` through monkeypatching:
   * ```js
   * foundry.abstract.EmbeddedCollection.prototype.search = DocumentCollection.prototype.search;
   * ```
   * This technically means it's not set until right after `init`/before `setup`.
   *
   * @see {@linkcode DocumentCollection.search | DocumentCollection#search}
   *
   * @privateRemarks While the `DocumentCollection` method has a TODO for index entries, because `EmbeddedCollection`s never have `index`es,
   * `ContainedDocument[]` is the correct return type.
   */
  search(search: DocumentCollection.SearchOptions): ContainedDocument[];

  /** @deprecated Removed without replacement in v13. This method will be removed inv 14 */
  protected _createOrUpdate(...args: never): never;

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

  interface GetOptions<Strict extends boolean | undefined, Invalid extends boolean | undefined> {
    /**
     * Throw an Error if the requested Embedded Document does not exist.
     * @defaultValue `false`
     */
    strict?: Strict;

    /**
     * Allow retrieving an invalid Embedded Document.
     * @defaultValue `false`
     */
    invalid?: Invalid;
  }

  /**
   * The return type for {@linkcode EmbeddedCollection.get | EmbeddedCollection#get}.
   * - If `invalid` is true, the document half of the return is `InvalidForName`, otherwise it's the passed document
   * (has to be passed because it's a type param on the class)
   * - If `strict` is true, a completely absent ID will throw an error (so `never`), otherwise it's possible to return `undefined`.
   */
  type GetReturn<
    ConcreteDocument extends Document.Any,
    Strict extends boolean | undefined,
    Invalid extends boolean | undefined,
  > =
    | (true extends Invalid ? Document.InvalidForName<ConcreteDocument["documentName"]> : ConcreteDocument)
    | ([Strict] extends [true] ? never : undefined);

  /**
   * Re-used with the same property description and default in both {@linkcode SetOptions} and {@linkcode DeleteOptions}
   * @internal
   */
  type _ModifySource = InexactPartial<{
    /**
     * Whether to modify the collection's source as part of the operation.
     * @defaultValue `true`
     */
    modifySource: boolean;
  }>;

  /**
   * Options for {@linkcode EmbeddedCollection.set | EmbeddedCollection#set}
   *
   * @privateRemarks Foundry collects keys other than `modifySource` as `...options` and passes them on to `this._set`; this has no effect
   * in `EmbeddedCollection`, as its `#_set` implementation takes no `options` param, but is made use of in
   * {@linkcode foundry.abstract.EmbeddedCollectionDelta.set | EmbeddedCollectionDelta#set} and `#_set`.
   *
   * @see {@linkcode foundry.abstract.EmbeddedCollectionDelta.SetOptions}.
   */
  interface SetOptions extends _ModifySource {}

  /**
   * Options for {@linkcode EmbeddedCollection.delete | EmbeddedCollection#_delete}
   *
   * @privateRemarks Foundry collects keys other than `modifySource` as `...options` and passes them on to `this._delete`; this has no
   * effect in `EmbeddedCollection`, as its `#_delete` implementation makes no use of its `options` param, but is made use of in
   * {@linkcode foundry.abstract.EmbeddedCollectionDelta.delete | EmbeddedCollectionDelta#delete} and `#_delete`.
   *
   * @see {@linkcode foundry.abstract.EmbeddedCollectionDelta.DeleteOptions}.
   */
  interface DeleteOptions extends _ModifySource {}

  /**
   * Options for {@linkcode EmbeddedCollection.getInvalid | EmbeddedCollection#getInvalid}.
   *
   * @remarks Unlike other EC methods, `strict` defaults to `true` here.
   */
  interface GetInvalidOptions<Strict extends boolean | undefined> {
    /**
     * Throw an Error if the requested ID is not in the set of invalid IDs for this collection.
     * @defaultValue `true`
     */
    strict?: Strict;
  }

  /**
   * The return type for {@linkcode EmbeddedCollection.getInvalid | EmbeddedCollection#getInvalid}.
   *
   * If `strict` is `true` (the default), passing anything that isn't a known invalid ID throws; if it's `false`, then the return can be
   * `undefined`.
   */
  type GetInvalidReturn<ConcreteDocument extends Document.Any, Strict extends boolean | undefined> =
    | Document.InvalidForName<ConcreteDocument["documentName"]>
    | ([Strict] extends [false] ? undefined : never);

  /**
   * Type for the 3rd param of {@linkcode EmbeddedCollection._onModifyContents | EmbeddedCollection#_onModifyContents}.
   *
   *
   */
  type OnModifyContentsResult<
    ConcreteDocument extends Document.Any,
    Action extends Document.Database2.OperationAction,
  > =
    | (Action extends "create" ? Array<Document.CreateDataForName<ConcreteDocument["documentName"]>> : never)
    | (Action extends "update" ? Array<Document.UpdateDataForName<ConcreteDocument["documentName"]>> : never)
    | (Action extends "delete" ? string[] : never);

  type OnModifyContentsOperation<
    ConcreteDocument extends Document.Any,
    Action extends Document.Database2.OperationAction,
  > =
    | (Action extends "create" ? Document.Database2.OnCreateOperationForName<ConcreteDocument["documentName"]> : never)
    | (Action extends "update" ? Document.Database2.OnUpdateOperationForName<ConcreteDocument["documentName"]> : never)
    | (Action extends "delete" ? Document.Database2.OnDeleteOperationForName<ConcreteDocument["documentName"]> : never);
}

export default EmbeddedCollection;

declare abstract class AnyEmbeddedCollection extends EmbeddedCollection<Document.Any, Document.Any> {
  constructor(...args: never);
}
