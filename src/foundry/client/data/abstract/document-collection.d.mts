import type { AnyObject, DeepPartial, InexactPartial, GetKey } from "#utils";
import type { DatabaseAction, DatabaseOperationMap, DatabaseUpdateOperation } from "#common/abstract/_types.d.mts";
import type Document from "#common/abstract/document.d.mts";
import type Application from "#client/appv1/api/application-v1.d.mts";
import type ApplicationV2 from "#client/applications/api/application.d.mts";

declare global {
  /**
   * An abstract subclass of the Collection container which defines a collection of Document instances.
   */
  class DocumentCollection<
    DocumentType extends Document.Type,
    Name extends string,
    Methods extends Collection.Methods.Any = DocumentCollection.Methods<DocumentType>,
  > extends foundry.utils.Collection<Document.StoredForName<DocumentType>, Methods> {
    constructor(data: Document.SourceForName<DocumentType>[]);

    /**
     * The source data array from which the Documents in the WorldCollection are created
     */
    _source: Document.SourceForName<DocumentType>[];

    /**
     * An Array of application references which will be automatically updated when the collection content changes
     * @defaultValue `[]`
     */
    apps: (Application.Any | ApplicationV2.Any)[];

    /**
     * Initialize the DocumentCollection by constructing any initially provided Document instances
     * @internal
     */
    protected _initialize(): void;

    /**
     * A reference to the Document class definition which is contained within this DocumentCollection.
     */
    get documentClass(): Document.ImplementationClassFor<DocumentType>;

    /**
     * A reference to the named Document class which is contained within this DocumentCollection.
     * @remarks This accessor is abstract: A subclass of DocumentCollection must implement the documentName getter
     */
    get documentName(): DocumentType;

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
     */
    get name(): Name;

    /**
     * Instantiate a Document for inclusion in the Collection.
     * @param data    - The Document data
     * @param context - Document creation context
     */
    createDocument(
      data: Document.CreateDataForName<DocumentType>,
      // TODO: Should be `Document.ParentOf<T>` or some equivalent.
      context: Document.ConstructionContext<Document.Any | null>,
    ): DocumentType;

    /**
     * Obtain a temporary Document instance for a document id which currently has invalid source data.
     * @param id - A document ID with invalid source data.
     * @param options - Additional options to configure retrieval.
     * @returns An in-memory instance for the invalid Document
     * @throws If strict is true and the requested ID is not in the set of invalid IDs for this collection.
     */
    getInvalid(id: string, options?: DocumentCollection.GetInvalidOptions): Document.InvalidForName<DocumentType>;

    get: Methods["get"];

    /**
     * @remarks The parameter `id` is ignored, instead `document.id` is used as the key.
     */
    set(id: string, document: Document.StoredForName<DocumentType>): this;

    /** @remarks Actually returns void */
    delete: (id: string) => boolean;

    /**
     * Render any Applications associated with this DocumentCollection.
     */
    render(force?: boolean, options?: Application.Options | ApplicationV2.RenderOptions): void;

    /**
     * Get the searchable fields for a given document or index, based on its data model
     * @param documentName    - The document type name
     * @param documentSubtype - The document subtype name
     * @param isEmbedded      - Whether the document is an embedded object
     * @returns The dot-delimited property paths of searchable fields
     */
    // TODO: Could significantly improve this with type defs
    static getSearchableFields<T extends foundry.abstract.Document.Type>(
      documentName: T,
      documentSubtype?: foundry.abstract.Document.SubTypesOf<T>,
      isEmbedded?: boolean,
    ): Set<string>;

    /**
     * Find all Documents which match a given search term using a full-text search against their indexed HTML fields and their name.
     * If filters are provided, results are filtered to only those that match the provided values.
     * @param search   - An object configuring the search
     */
    search(search?: DocumentCollection.SearchOptions): Document.ImplementationFor<DocumentType>[];

    /**
     * Update all objects in this DocumentCollection with a provided transformation.
     * Conditionally filter to only apply to Entities which match a certain condition.
     * @param transformation - An object of data or function to apply to all matched objects
     * @param condition      - A function which tests whether to target each object
     *                         (default: `null`)
     * @param options        - Additional options passed to Document.updateDocuments
     *                         (default: `{}`)
     * @returns An array of updated data once the operation is complete
     */
    updateAll(
      transformation:
        | Document.UpdateDataForName<DocumentType>
        | ((doc: Document.StoredForName<DocumentType>) => Document.UpdateDataForName<DocumentType>),
      condition?: ((obj: Document.StoredForName<DocumentType>) => boolean) | null,
      options?: Document.Database.UpdateDocumentsOperation<DatabaseUpdateOperation>,
    ): ReturnType<this["documentClass"]["updateDocuments"]>;

    /**
     * Follow-up actions to take when a database operation modifies Documents in this DocumentCollection.
     * @param action    - The database action performed
     * @param documents - The array of modified Documents
     * @param result    - The result of the database operation
     * @param operation - Database operation details
     * @param user      - The User who performed the operation
     */
    _onModifyContents<A extends DatabaseAction>(
      action: A,
      documents: Document.StoredForName<DocumentType>[],
      result: readonly AnyObject[] | readonly string[],
      operation: DatabaseOperationMap[A],
      user: User.Implementation,
    ): void;
  }

  namespace DocumentCollection {
    interface Any extends DocumentCollection<Document.Type, string> {}

    interface Methods<T extends Document.Type> {
      get<Options extends DocumentCollection.GetOptions | undefined = undefined>(
        key: string,
        options?: Options,
      ): DocumentCollection.GetReturnType<T, Options>;
    }

    namespace RenderContext {
      interface Base<T extends Document.Type> {
        documentType: T;
        documents: Document.StoredForName<T>[];

        /** @deprecated The "entities" render context is deprecated. Please use "documents" instead. */
        get entities(): this["documents"];

        /** @deprecated The "entityType" render context is deprecated. Please use "documentType" instead. */
        get entityType(): this["documentType"];
      }

      interface Create<T extends Document.Type> extends Base<T> {
        action: "create";
        data: (Document.SourceForName<T> & { _id: string })[];
      }

      interface Update<T extends Document.Type> extends Base<T> {
        action: "update";
        data: (DeepPartial<Document.SourceForName<T>> & { _id: string })[];
      }

      interface Delete<T extends Document.Type> extends Base<T> {
        action: "delete";
        data: string[];
      }
    }

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
      filters: foundry.applications.ux.SearchFilter.FieldFilter[];

      /**
       * An array of document IDs to exclude from search results
       * @defaultValue `[]`
       */
      exclude: string[];
    }

    interface SearchOptions extends InexactPartial<_SearchOptions> {}

    interface GetInvalidOptions {
      /**
       * Throw an Error if the requested ID is not in the set of invalid IDs for this collection.
       */
      strict?: boolean | undefined;
    }

    interface GetOptions extends Collection.GetOptions {
      /**
       * Allow retrieving an invalid Embedded Document.
       * @defaultValue `false`
       */
      invalid?: boolean | undefined;
    }

    type GetReturnType<DocumentType extends Document.Type, Options extends GetOptions | undefined> = _ApplyInvalid<
      DocumentType,
      GetKey<Options, "invalid", false>
    >;

    /** @internal */
    type _ApplyInvalid<DocumentType extends Document.Type, Invalid extends boolean | undefined> = Invalid extends true
      ? Document.InvalidForName<DocumentType> | Document.StoredForName<DocumentType>
      : Document.StoredForName<DocumentType>;
  }
}
