import type { Identity, InexactPartial } from "#utils";
import type Collection from "../utils/collection.d.mts";
/** @privateRemarks `EmbeddedCollectionDelta` used only for links */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { Document, EmbeddedCollectionDelta } from "#common/abstract/_module.d.mts";
import type { DocumentCollection } from "#client/documents/abstract/_module.d.mts";
import type { DatabaseAction, DatabaseOperation } from "./_types.d.mts";

/**
 * An extension of the Collection.
 * Used for the specific task of containing embedded Document instances within a parent Document.
 *
 * @privateRemarks `ParentDocument` would ideally be `NonNullable<Document.ParentForName<ContainedDocument["documentName"]>>`, but this
 * breaks the `AnyEmbeddedDocument` type, among other things.
 */
declare class EmbeddedCollection<
  ContainedDocument extends Document.Any,
  ParentDocument extends Document.Any,
  Methods extends Collection.Methods.Any = EmbeddedCollection.Methods<ContainedDocument>,
> extends Collection<ContainedDocument, Methods> {
  /**
   * @param name        - The name of this collection in the parent Document.
   * @param parent      - The parent Document instance to which this collection belongs
   * @param sourceArray - The source data array for the collection in the parent Document data
   */
  constructor(
    name: string,
    parent: ParentDocument,
    // TODO: revisit CreateData vs Source once the Source assignability investigation is complete
    sourceArray: Document.CreateDataForName<ContainedDocument["documentName"]>[],
  );

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
  get documentName(): Document.Type | undefined;

  /**
   * The name of this collection in the parent Document.
   * @remarks Defined via `Object.defineProperties` during construction with `{ writable: false }`
   */
  // TODO: 4th type param? or 3rd, if we make this generic as a treat when we can remove Methods
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
  readonly _source: Document.CreateDataForName<ContainedDocument["documentName"]>[];

  /**
   * Record the set of document ids where the Document was not initialized because of invalid source data
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
   * @remarks `options` doesn't have a parameter default, but it's only passed to places that do, so it's optional here
   */
  protected _initializeDocument(
    data: Document.CreateDataForName<ContainedDocument["documentName"]>,
    options?: EmbeddedCollection.InitializeDocumentOptions,
  ): void;

  /**
   * Instantiate a Document for inclusion in the Collection
   * @remarks `parent`, `parentCollection`, and `pack` are overwritten, see {@linkcode EmbeddedCollection.DocumentConstructionContext}.
   *
   * @privateRemarks Can't just return `ContainedDocument`, as that should be a `Stored` type, while this returns a temporary document.
   */
  createDocument(
    data: Document.CreateDataForName<ContainedDocument["documentName"]>,
    context?: EmbeddedCollection.DocumentConstructionContext,
  ): Document.ImplementationFor<ContainedDocument["documentName"]>;

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
   * @remarks See {@linkcode EmbeddedCollection.Methods.get}, {@linkcode EmbeddedCollection.GetReturn}
   */
  override get: Methods["get"];

  /**
   * Add a document to the collection
   * @param key     - The embedded Document ID
   * @param value   - The embedded Document instance
   * @param options - Additional options to the set operation
   *
   * @remarks See {@linkcode EmbeddedCollection.Methods.set}, {@linkcode Collection.SetMethod}
   */
  override set: Collection.SetMethod<this, Methods>;

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
   *
   * @remarks See {@linkcode EmbeddedCollection.Methods.delete}
   */
  override delete: Methods["delete"];

  /**
   * Remove the value from the underlying source array.
   * @param key     - The Document ID key.
   * @param options - Additional options to configure deletion behavior.
   *
   * @remarks The `EmbeddedCollection` implementation makes no use of `options`
   */
  protected _delete(key: string, options?: EmbeddedCollection.DeleteOptions): void;

  /**
   * Obtain a temporary Document instance for a document id which currently has invalid source data.
   * @param id      - A document ID with invalid source data.
   * @param options - Additional options to configure retrieval.
   * @returns An in-memory instance for the invalid Document
   * @throws If strict is true and the requested ID is not in the set of invalid IDs for this collection.
   */
  getInvalid<Options extends EmbeddedCollection.GetInvalidOptions | undefined = undefined>(
    id: string,
    options?: Options,
  ): EmbeddedCollection.GetInvalidReturn<ContainedDocument, Options>;

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
    documents: Document.StoredForName<ContainedDocument["documentName"]>[],
    result: Collection.OnModifyContentsResult<ContainedDocument["documentName"], Action>,
    operation: Collection.OnModifyContentsOperation<ContainedDocument["documentName"], Action>,
    user: User.Stored,
  ): void;

  /**
   * Find all Documents which match a given search term using a full-text search against their indexed HTML fields and their name.
   * If filters are provided, results are filtered to only those that match the provided values.
   * @param search - An object configuring the search
   *
   * @remarks This is added in {@linkcode foundry.Game.setupGame | Game#setupGame} through monkeypatching:
   * ```js
   * foundry.abstract.EmbeddedCollection.prototype.search = DocumentCollection.prototype.search;
   * ```
   * This technically means it's not set until right after `init`/before `setup`.
   *
   * @see {@linkcode DocumentCollection.search | DocumentCollection#search}
   *
   * @privateRemarks `EmbeddedCollection` doesn't have an `index`, so this return type is correct
   */
  search(search: DocumentCollection.SearchOptions): ContainedDocument[];

  /** @deprecated Removed without replacement in v13. This warning will be removed in v14. */
  update(...args: never): never;

  /** @deprecated Removed without replacement in v13. This warning will be removed in v14. */
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

  /**
   * Options for {@linkcode EmbeddedCollection.get | EmbeddedCollection#get}.
   * @privateRemarks Despite extending interfaces containing only the keys `strict` and `invalid`,
   * both are redefined here for the more specific property description.
   */
  interface GetOptions extends Collection._GetOptions, Collection._InvalidOption {
    /**
     * Throw an Error if the requested Embedded Document does not exist.
     * @defaultValue `false`
     */
    strict?: boolean | undefined;

    /**
     * Allow retrieving an invalid Embedded Document.
     * @defaultValue `false`
     */
    invalid?: boolean | undefined;
  }

  type GetReturn<
    ConcreteDocument extends Document.Any,
    Options extends EmbeddedCollection.GetOptions | undefined,
  > = Collection._GetReturn<Collection._ApplyInvalid<ConcreteDocument["documentName"], Options>, Options>;

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
   * @privateRemarks Foundry collects keys other than `modifySource` as `...options` and passes them on to `this._set`; this
   * has no effect in `EmbeddedCollection`, as its `#_set` implementation takes no `options` param, but is made use of in
   * {@linkcode EmbeddedCollectionDelta.set | EmbeddedCollectionDelta#set} and {@linkcode EmbeddedCollectionDelta.set | #_set}.
   *
   * @see {@linkcode EmbeddedCollectionDelta.SetOptions}.
   */
  interface SetOptions extends _ModifySource {}

  /**
   * Options for {@linkcode EmbeddedCollection.delete | EmbeddedCollection#_delete}
   *
   * @privateRemarks Foundry collects keys other than `modifySource` as `...options` and passes them on to `this._delete`; this
   * has no effect in `EmbeddedCollection`, as its `#_delete` implementation makes no use of its `options` param, but is made
   * use of in {@linkcode EmbeddedCollectionDelta.delete | EmbeddedCollectionDelta#delete} and
   * {@linkcode EmbeddedCollectionDelta._delete | #_delete}.
   *
   * @see {@linkcode EmbeddedCollectionDelta.DeleteOptions}.
   */
  interface DeleteOptions extends _ModifySource {}

  /** Options for {@linkcode EmbeddedCollection.getInvalid | EmbeddedCollection#getInvalid}. */
  interface GetInvalidOptions extends Collection._GetInvalidOptions {}

  /**
   * The return type for {@linkcode EmbeddedCollection.getInvalid | EmbeddedCollection#getInvalid}.
   *
   * @privateRemarks While effectively identical to {@linkcode DocumentCollection.GetInvalidReturn}, the types are not unified in
   * `namespace Collection` to allow different named option interfaces for potential unrelated declaration merging.
   */
  type GetInvalidReturn<
    ConcreteDocument extends Document.Any,
    Options extends EmbeddedCollection.GetInvalidOptions | undefined,
  > = Collection._GetReturn<Document.InvalidForName<ConcreteDocument["documentName"]>, Options, true>;

  /**
   * The method signatures for {@linkcode EmbeddedCollection}.
   *
   * @see {@linkcode Collection.Methods}
   * @see {@linkcode Collection.SetMethod}
   */
  interface Methods<ContainedDocument extends Document.Any> {
    self: unknown;

    get<Options extends EmbeddedCollection.GetOptions | undefined = undefined>(
      id: string,
      options?: Options,
    ): EmbeddedCollection.GetReturn<ContainedDocument, Options>;

    set(key: string, value: ContainedDocument, options?: EmbeddedCollection.SetOptions): this["self"];

    delete(key: string, options?: EmbeddedCollection.DeleteOptions): boolean;
  }
}

export default EmbeddedCollection;

declare abstract class AnyEmbeddedCollection extends EmbeddedCollection<Document.Any, Document.Any> {
  constructor(...args: never);
}
