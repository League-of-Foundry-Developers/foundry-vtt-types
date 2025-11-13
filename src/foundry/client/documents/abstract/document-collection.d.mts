import type { InexactPartial, Identity, DeepPartial, AnyObject } from "#utils";
import type { Collection } from "#common/utils/_module.d.mts";
import type { Document } from "#common/abstract/_module.d.mts";
import type { Application } from "#client/appv1/api/_module.d.mts";
import type { ApplicationV2 } from "#client/applications/api/_module.d.mts";
import type { SearchFilter } from "#client/applications/ux/_module.d.mts";
import type { DatabaseAction, DatabaseOperationMap, DatabaseUpdateOperation } from "#common/abstract/_types.mjs";

/** @privateRemarks `DatabaseBackend` is only used for links */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type DatabaseBackend from "#common/abstract/backend.d.mts";

/** @privateRemarks `CompendiumCollection` and `CompendiumFolderCollection` only used for links */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { CompendiumCollection, CompendiumFolderCollection } from "#client/documents/collections/_module.d.mts";

/** @privateRemarks `WorldCollection` only used for links */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { WorldCollection } from "#client/documents/abstract/_module.d.mts";

/**
 * An abstract subclass of the Collection container which defines a collection of Document instances.
 * @remarks The `data` passed to the constructor is *not* put unconditionally into the `Collection`, it's set as
 * {@linkcode DocumentCollection._source | #_source} and then {@linkcode DocumentCollection._initialize | #initialize}
 * adds valid documents to the `Collection` and invalid `id`s to {@linkcode DocumentCollection.invalidDocumentIds | #invalidDocumentIds}.
 */
declare abstract class DocumentCollection<
  DocumentName extends Document.Type,
  Methods extends Collection.Methods.Any = DocumentCollection.Methods<DocumentName>,
> extends Collection<Document.StoredForName<DocumentName>, Methods> {
  constructor(data?: Document.CreateDataForName<DocumentName>[]);

  /**
   * The source data array from which the Documents in the WorldCollection are created
   * @remarks Created via `Object.defineProperty` during construction with `{ writable: false }`,
   * and the `data` param from the constructor as `value`.
   */
  readonly _source: Document.CreateDataForName<DocumentName>[];

  /**
   * An Array of application references which will be automatically updated when the collection content changes
   * @defaultValue `[]`
   */
  apps: (Application.Any | ApplicationV2.Any)[];

  /**
   * Initialize the DocumentCollection by constructing any initially provided Document instances
   */
  protected _initialize(): void;

  /**
   * A reference to the Document class definition which is contained within this DocumentCollection.
   */
  get documentClass(): Document.ImplementationClassFor<DocumentName>;

  /**
   * A reference to the named Document class which is contained within this DocumentCollection.
   * @remarks This accessor is abstract: A subclass of DocumentCollection must implement the documentName getter
   */
  get documentName(): DocumentName;

  /**
   * The base Document type which is contained within this DocumentCollection
   */
  static documentName: string;

  /**
   * Record the set of document ids where the Document was not initialized because of invalid source data
   */
  invalidDocumentIds: Set<string>;

  /**
   * The Collection class name
   * @remarks Returns `this.constructor.name`
   */
  get name(): string;

  /**
   * Instantiate a Document for inclusion in the Collection.
   * @param data    - The Document data
   * @param context - Document creation context (default: `{}`)
   * @remarks Thin wrapper around `new this.documentClass()`, returns a temporary document.
   */
  createDocument(
    data: Document.CreateDataForName<DocumentName>,
    context?: Document.ConstructionContext<Document.ParentForName<DocumentName>>,
  ): Document.ImplementationFor<DocumentName>;

  /**
   * Obtain a temporary Document instance for a document id which currently has invalid source data.
   * @param id - A document ID with invalid source data.
   * @param options - Additional options to configure retrieval.
   * @returns An in-memory instance for the invalid Document
   * @throws If strict is true and the requested ID is not in the set of invalid IDs for this collection.
   */
  getInvalid<Options extends DocumentCollection.GetInvalidOptions | undefined = undefined>(
    id: string,
    options?: Options,
  ): DocumentCollection.GetInvalidReturn<DocumentName, Options>;

  /**
   * Get an element from the `DocumentCollection` by its ID.
   * @param id      - The ID of the Document to retrieve.
   * @param options - Additional options to configure retrieval.
   * @throws If strict is true and the Document cannot be found.
   * @remarks Goto definition breaks here, see {@linkcode DocumentCollection.Methods.get} for the signature
   */
  get: Methods["get"];

  /**
   * @remarks Foundry fails to return the super call here, leading to a `void` return rather than `this` as of 13.350
   * ({@link https://github.com/foundryvtt/foundryvtt/issues/13565}).
   *
   * The parameter `id` is ignored, instead `document.id` is used as the key. This guarantees that all values are stored documents.
   *
   * Goto definition breaks here, see {@linkcode DocumentCollection.Methods.set}.
   * @privateRemarks The bug above means there's no need to use {@linkcode Collection.SetMethod} here.
   */
  set: Methods["set"];

  /** @remarks Goto definition breaks here, see {@linkcode DocumentCollection.Methods.delete} */
  delete: Methods["delete"];

  /**
   * Render any Applications associated with this DocumentCollection.
   * @param force   - Force rendering  (default: `false`)
   * @param options - Optional options (default: `{}`)
   */
  render(force?: boolean, options?: DocumentCollection.RenderOptions): void;

  /**
   * Get the searchable fields for a given document or index, based on its data model
   * @param documentName - The document name
   * @param type         - A document subtype
   * @returns A record of searchable DataField definitions
   *
   * @remarks Currently functional but bugged on 13.350: {@link https://github.com/foundryvtt/foundryvtt/issues/13568}
   */
  // TODO: infer from schema all `StringField`s and subclasses that are `textSearch: true`
  static getSearchableFields<DocumentName extends Document.Type>(
    documentName: DocumentName,
    type?: Document.SubTypesOf<DocumentName>,
  ): Record<string, DocumentCollection.SearchableField>;

  /**
   * Find all Documents which match a given search term using a full-text search against their indexed HTML fields and their name.
   * If filters are provided, results are filtered to only those that match the provided values.
   * @param search - An object configuring the search
   *
   * @remarks `search` is required because it lacks a parameter default, but all of its properties *do* have defaults, so passing an empty
   * object is sufficient. It doesn't make much sense to pass no criteria to a search method, but it will just return all Documents in the
   * collection.
   */
  // TODO: CompendiumCollection doesn't override this method, and the method preferentially operates on `this.index` over `this.contents`,
  // TODO: so the return type here should include index entries
  search(search: DocumentCollection.SearchOptions): Document.StoredForName<DocumentName>[];

  /**
   * Update all objects in this DocumentCollection with a provided transformation.
   * Conditionally filter to only apply to Entities which match a certain condition.
   * @param transformation - An object of data or function to apply to all matched objects
   * @param condition      - A function which tests whether to target each object (default: `null`)
   * @param options        - Additional options passed to Document.updateDocuments (default: `{}`)
   * @returns An array of updated data once the operation is complete
   */
  // TODO: This is updated in the db-ops branch
  updateAll(
    transformation: DocumentCollection.Transformation<DocumentName>,
    condition?: ((obj: Document.StoredForName<DocumentName>) => boolean) | null,
    options?: Document.Database.UpdateDocumentsOperation<DatabaseUpdateOperation>,
  ): Promise<Document.StoredForName<DocumentName>[]>;

  /**
   * Follow-up actions to take when a database operation modifies Documents in this DocumentCollection.
   * @param action    - The database action performed
   * @param documents - The array of modified Documents
   * @param result    - The result of the database operation
   * @param operation - Database operation details
   * @param user      - The User who performed the operation
   * @internal
   *
   * @remarks Foundry types `action` as {@linkcode DatabaseBackend.DatabaseAction} but no path exists from a `get` operation to calling
   * this method.
   */
  // TODO: this is updated in the db-ops branch
  _onModifyContents<A extends DatabaseAction>(
    action: A,
    documents: Document.StoredForName<DocumentName>[],
    result: readonly AnyObject[] | readonly string[],
    operation: DatabaseOperationMap[A],
    user: User.Implementation,
  ): void;

  static #DocumentCollection: true;
}

declare namespace DocumentCollection {
  interface Any extends AnyDocumentCollection {}
  interface AnyConstructor extends Identity<typeof AnyDocumentCollection> {}

  /**
   * The method signatures for {@linkcode DocumentCollection}.
   *
   * @remarks {@linkcode Collection.SetMethod} is not used on `set` here, as it returns `void` not `this` in `DocumentCollection`.
   * ({@link https://github.com/foundryvtt/foundryvtt/issues/13565})
   *
   * The type param here is the `documentName` rather than the actual `V` of the `Collection`
   * to allow for invalid document handling.
   */
  interface Methods<DocumentName extends Document.Type> {
    self: unknown;

    get<Options extends DocumentCollection.GetOptions | undefined = undefined>(
      key: string,
      options?: Options,
    ): DocumentCollection.GetReturn<DocumentName, Options>;

    set(id: string, document: Document.StoredForName<DocumentName>): void;

    /** @privateRemarks This could be inherited from {@linkcode Collections.Methods}, but the `extends Pick<...` too long to bother */
    delete(id: string): boolean;
  }

  /**
   * Options for {@linkcode DocumentCollection.render | DocumentCollection#render}.
   *
   * @remarks This is an intersection-like because the same object is {@link foundry.utils.deepClone | copied} and then passed to both
   * {@linkcode Application.render | AppV1#render} and {@linkcode ApplicationV2.render | AppV2#render}; in the latter case,
   * `options.force` is overwritten with the first parameter of `DocumentCollection#render`, so it is omitted here.
   */
  interface RenderOptions extends DeepPartial<Application.Options & Omit<ApplicationV2.RenderOptions, "force">> {}

  /** @internal */
  interface _SearchOptions {
    /**
     * A case-insensitive search string
     * @defaultValue `""`
     */
    query: string;

    /**
     * An array of filters to apply
     * @defaultValue `[]`
     */
    filters: SearchFilter.FieldFilter[];

    /**
     * An array of document IDs to exclude from search results
     * @defaultValue `[]`
     */
    exclude: string[];
  }

  interface SearchOptions extends InexactPartial<_SearchOptions> {}

  /** Used in the {@linkcode DocumentCollection.getSearchableFields} return type. */
  // TODO: infer from schema all `StringField`s and subclasses that are `textSearch: true`
  type SearchableField =
    | foundry.data.fields.StringField
    | {
        [K in string]: SearchableField;
      };

  interface GetInvalidOptions extends Collection._GetInvalidOptions {}

  /**
   * @remarks Differs from {@linkcode Collection.GetReturn} only in the default value of `strict` (and that it doesn't return the exact `V`
   * of the collection).
   */
  type GetInvalidReturn<
    DocumentName extends Document.Type,
    Options extends DocumentCollection.GetInvalidOptions | undefined,
  > = Collection._GetReturn<Document.InvalidForName<DocumentName>, Options, true>;

  interface GetOptions extends Collection.GetOptions, Collection._InvalidOption {}

  type GetReturn<DocumentType extends Document.Type, Options extends GetOptions | undefined> = Collection._GetReturn<
    Collection._ApplyInvalid<DocumentType, Options, false>,
    Options
  >;

  /** @deprecated Use {@linkcode DocumentCollection.GetReturn} instead. This type will be removed in v14. */
  type GetReturnType<DocumentType extends Document.Type, Options extends GetOptions | undefined> = GetReturn<
    DocumentType,
    Options
  >;

  type Transformation<DocumentName extends Document.Type> =
    | Document.UpdateDataForName<DocumentName>
    | {
        // Note(LukeAbby): Written as a method to stay covariant over `DocumentName`.
        transform(doc: Document.StoredForName<DocumentName>): Document.UpdateDataForName<DocumentName>;
      }["transform"];
}

export default DocumentCollection;

declare class AnyDocumentCollection extends DocumentCollection<Document.Type, Collection.Methods.Any> {
  constructor(...args: never);
}
