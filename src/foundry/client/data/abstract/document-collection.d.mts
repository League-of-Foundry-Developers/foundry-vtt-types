import type { AnyObject, DeepPartial, InexactPartial, FixedInstanceType } from "../../../../utils/index.d.mts";
import type { DatabaseAction, DatabaseOperationMap } from "../../../common/abstract/_types.d.mts";
import type Document from "../../../common/abstract/document.d.mts";

declare global {
  /**
   * An abstract subclass of the Collection container which defines a collection of Document instances.
   */
  class DocumentCollection<T extends Document.AnyConstructor, Name extends string> extends foundry.utils.Collection<
    Document.ToStored<T>
  > {
    constructor(data: FixedInstanceType<T>["_source"][]);

    /**
     * The source data array from which the Documents in the WorldCollection are created
     */
    _source: FixedInstanceType<T>["_source"][];

    /**
     * An Array of application references which will be automatically updated when the collection content changes
     * @defaultValue `[]`
     */
    apps: Application.Any[];

    /**
     * Initialize the DocumentCollection by constructing any initially provided Document instances
     * @internal
     */
    protected _initialize(): void;

    /**
     * A reference to the Document class definition which is contained within this DocumentCollection.
     */
    get documentClass(): T;

    /**
     * A reference to the named Document class which is contained within this DocumentCollection.
     * @remarks This accessor is abstract: A subclass of DocumentCollection must implement the documentName getter
     */
    get documentName(): T["metadata"]["name"];

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
      data: Document.ConstructorDataFor<T>,
      // TODO: Should be `Document.ParentOf<T>` or some equivalent.
      context: Document.ConstructionContext<Document.Any | null>,
    ): T;

    /**
     * Obtain a temporary Document instance for a document id which currently has invalid source data.
     * @param id - A document ID with invalid source data.
     * @param options - Additional options to configure retrieval.
     * @returns An in-memory instance for the invalid Document
     * @throws If strict is true and the requested ID is not in the set of invalid IDs for this collection.
     */
    getInvalid(
      id: string,
      options?: InexactPartial<{
        /**
         * Throw an Error if the requested ID is not in the set of invalid IDs for this collection.
         */
        strict: boolean;
      }>,
    ): unknown;

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
    ): Document.ToStored<T> | undefined;
    get(key: string, options: { strict: true; invalid?: false }): Document.ToStored<T>;
    get(key: string, options: { strict?: boolean; invalid: true }): unknown;

    /**
     * @remarks The parameter `id` is ignored, instead `document.id` is used as the key.
     */
    set(id: string, document: Document.ToStored<T>): this;

    /** @remarks Actually returns void */
    delete: (id: string) => boolean;

    /**
     * Render any Applications associated with this DocumentCollection.
     */
    render(force?: boolean, options?: ApplicationOptions): void;

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
    search(search?: DocumentCollection.SearchOptions): FixedInstanceType<T>[];

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
      transformation: Document.UpdateDataFor<T> | ((doc: Document.ToStored<T>) => Document.UpdateDataFor<T>),
      condition?: ((obj: Document.ToStored<T>) => boolean) | null,
      options?: Document.OnUpdateOptions<T["metadata"]["name"]>,
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
      documents: Document.ToStored<T>[],
      result: readonly AnyObject[] | readonly string[],
      operation: DatabaseOperationMap[A],
      user: User.Implementation,
    ): void;
  }

  namespace DocumentCollection {
    type Any = DocumentCollection<Document.AnyConstructor, string>;

    namespace RenderContext {
      interface Base<T extends Document.AnyConstructor> {
        documentType: T["metadata"]["name"];
        documents: Document.ToConfiguredStored<T>[];

        /** @deprecated The "entities" render context is deprecated. Please use "documents" instead. */
        get entities(): this["documents"];

        /** @deprecated The "entityType" render context is deprecated. Please use "documentType" instead. */
        get entityType(): this["documentType"];
      }

      interface Create<T extends Document.AnyConstructor> extends Base<T> {
        action: "create";
        data: (FixedInstanceType<T>["_source"] & { _id: string })[];
      }

      interface Update<T extends Document.AnyConstructor> extends Base<T> {
        action: "update";
        data: (DeepPartial<FixedInstanceType<T>["_source"]> & { _id: string })[];
      }

      interface Delete<T extends Document.AnyConstructor> extends Base<T> {
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
      filters: FieldFilter[];

      /**
       * An array of document IDs to exclude from search results
       * @defaultValue `[]`
       */
      exclude: string[];
    }

    interface SearchOptions extends InexactPartial<_SearchOptions> {}
  }
}
