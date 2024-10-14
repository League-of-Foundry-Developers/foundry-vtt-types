import type {
  ConfiguredDocumentClass,
  ConfiguredDocumentInstance,
  DocumentConstructor,
} from "../../../../types/helperTypes.d.mts";
import type { DeepPartial, InexactPartial, ConfiguredStoredDocument } from "../../../../types/utils.d.mts";
import type Document from "../../../common/abstract/document.d.mts";
import type { DocumentModificationOptions } from "../../../common/abstract/document.d.mts";
// import type _Collection from "../../../common/utils/collection.d.mts";

// Fix for "Class 'Collection<ConfiguredStoredDocument<T>>' defines instance member property 'delete',
// but extended class 'DocumentCollection<T, Name>' defines it as instance member function."
// type Collection<T> = Omit<_Collection<T>, "set" | "delete" | "get">;

declare global {
  /**
   * An abstract subclass of the Collection container which defines a collection of Document instances.
   */
  class DocumentCollection<T extends DocumentConstructor, Name extends string> extends foundry.utils.Collection<
    ConfiguredStoredDocument<T>
  > {
    constructor(data: InstanceType<T>["_source"][]);

    /**
     * The source data array from which the Documents in the WorldCollection are created
     */
    _source: InstanceType<T>["_source"][];

    /**
     * An Array of application references which will be automatically updated when the collection content changes
     * @defaultValue `[]`
     */
    apps: Application[];

    /**
     * Initialize the DocumentCollection by constructing any initially provided Document instances
     * @internal
     */
    protected _initialize(): void;

    /**
     * A reference to the Document class definition which is contained within this DocumentCollection.
     */
    get documentClass(): ConfiguredDocumentClass<T>;

    /**
     * A reference to the named Document class which is contained within this DocumentCollection.
     * @remarks This accessor is abstract: A subclass of DocumentCollection must implement the documentName getter
     */
    get documentName(): ConfiguredDocumentClass<T>["metadata"]["name"];

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
      // TODO: This probably needs refinement for mandatory assignment fields like name
      data: DeepPartial<InstanceType<T>["_source"]>,
      context: Document.ConstructionContext<Document.Any | null>,
    ): InstanceType<T>;

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
    ): ConfiguredStoredDocument<T> | undefined;
    get(key: string, options: { strict: true; invalid?: false }): ConfiguredStoredDocument<T>;
    get(key: string, options: { strict?: boolean; invalid: true }): unknown;

    /**
     * @remarks The parameter `id` is ignored, instead `document.id` is used as the key.
     */
    set(id: string, document: ConfiguredStoredDocument<T>): this;

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
    static getSearchableFields(
      documentName: foundry.CONST.DOCUMENT_TYPES,
      documentSubtype?: string,
      isEmbedded?: boolean,
    ): Set<string>;

    /**
     * Find all Documents which match a given search term using a full-text search against their indexed HTML fields and their name.
     * If filters are provided, results are filtered to only those that match the provided values.
     * @param search   - An object configuring the search
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
    ): ConfiguredDocumentInstance<T>[];

    /**
     * Update all objects in this DocumentCollection with a provided transformation.
     * Conditionally filter to only apply to Entities which match a certain condition.
     * @param transformation - An object of data or function to apply to all matched objects
     * @param condition      - A function which tests whether to target each object
     *                         (default: `null`)
     * @param options        - Additional options passed to Document.update
     *                         (default: `{}`)
     * @returns An array of updated data once the operation is complete
     */
    updateAll(
      transformation:
        | DeepPartial<ConfiguredDocumentInstance<T>["_source"]>
        | ((doc: ConfiguredStoredDocument<T>) => DeepPartial<ConfiguredDocumentInstance<T>["_source"]>),
      condition?: ((obj: ConfiguredStoredDocument<T>) => boolean) | null,
      options?: Document.ModificationContext<Document.Any | null>,
    ): ReturnType<this["documentClass"]["updateDocuments"]>;

    /**
     * Preliminary actions taken before a set of Documents in this Collection are created.
     * @param result  - An Array of created data objects
     * @param options - Options which modified the creation operation
     * @param userId  - The ID of the User who triggered the operation
     */
    protected _preCreateDocuments(
      result: (InstanceType<T>["_source"] & { _id: string })[],
      options: DocumentModificationOptions,
      userId: string,
    ): void;

    /**
     * Follow-up actions taken after a set of Documents in this Collection are created.
     * @param documents - An Array of created Documents
     * @param result    - An Array of created data objects
     * @param options   - Options which modified the creation operation
     * @param userId    - The ID of the User who triggered the operation
     */
    protected _onCreateDocuments(
      documents: ConfiguredStoredDocument<T>[],
      result: (InstanceType<T>["_source"] & { _id: string })[],
      options: DocumentModificationOptions,
      userId: string,
    ): void;

    /**
     * Preliminary actions taken before a set of Documents in this Collection are updated.
     * @param result  - An Array of incremental data objects
     * @param options - Options which modified the update operation
     * @param userId  - The ID of the User who triggered the operation
     */
    protected _preUpdateDocuments(
      result: (DeepPartial<InstanceType<T>["_source"]> & { _id: string })[],
      options: DocumentModificationOptions,
      userId: string,
    ): void;

    /**
     * Follow-up actions taken after a set of Documents in this Collection are updated.
     * @param documents - An Array of updated Documents
     * @param result    - An Array of incremental data objects
     * @param options   - Options which modified the update operation
     * @param userId    - The ID of the User who triggered the operation
     */
    protected _onUpdateDocuments(
      documents: ConfiguredStoredDocument<T>[],
      result: (DeepPartial<InstanceType<T>["_source"]> & { _id: string })[],
      options: DocumentModificationOptions,
      userId: string,
    ): void;

    /**
     * Preliminary actions taken before a set of Documents in this Collection are deleted.
     * @param result  - An Array of document IDs being deleted
     * @param options - Options which modified the deletion operation
     * @param userId  - The ID of the User who triggered the operation
     */
    protected _preDeleteDocuments(result: string[], options: DocumentModificationOptions, userId: string): void;

    /**
     * Follow-up actions taken after a set of Documents in this Collection are deleted.
     * @param documents - An Array of deleted Documents
     * @param result    - An Array of document IDs being deleted
     * @param options   - Options which modified the deletion operation
     * @param userId    - The ID of the User who triggered the operation
     */
    protected _onDeleteDocuments(
      documents: ConfiguredStoredDocument<T>[],
      result: string[],
      options: DocumentModificationOptions,
      userId: string,
    ): void;

    /**
     * Handle shifting documents in a deleted folder to a new parent folder.
     * @param parentFolder   - The parent folder to which documents should be shifted
     * @param deleteFolderId - The ID of the folder being deleted
     * @param deleteContents - Whether to delete the contents of the folder
     */
    protected _onDeleteFolder(parentFolder: Folder, deleteFolderId: string, deleteContents?: boolean): string[];

    /**
     * Generate the render context information provided for CRUD operations.
     * @param action    - The CRUD operation.
     * @param documents - The documents being operated on.
     * @param data      - An array of creation or update objects, or an array of document IDs, depending on
     *                    the operation.
     * @internal
     */
    protected _getRenderContext(
      action: DocumentCollection.RenderContext.Create<T>["action"],
      documents: ConfiguredStoredDocument<T>[],
      data: (InstanceType<T>["_source"] & { _id: string })[],
    ): DocumentCollection.RenderContext.Create<T>;
    protected _getRenderContext(
      action: DocumentCollection.RenderContext.Update<T>["action"],
      documents: ConfiguredStoredDocument<T>[],
      data: (DeepPartial<InstanceType<T>["_source"]> & { _id: string })[],
    ): DocumentCollection.RenderContext.Update<T>;
    protected _getRenderContext(
      action: DocumentCollection.RenderContext.Delete<T>["action"],
      documents: ConfiguredStoredDocument<T>[],
      data: string[],
    ): DocumentCollection.RenderContext.Delete<T>;
  }

  namespace DocumentCollection {
    type Any = DocumentCollection<any, any>;

    namespace RenderContext {
      interface Base<T extends DocumentConstructor> {
        documentType: T["metadata"]["name"];
        documents: ConfiguredStoredDocument<T>[];

        /** @deprecated The "entities" render context is deprecated. Please use "documents" instead. */
        get entities(): this["documents"];

        /** @deprecated The "entityType" render context is deprecated. Please use "documentType" instead. */
        get entityType(): this["documentType"];
      }

      interface Create<T extends DocumentConstructor> extends Base<T> {
        action: "create";
        data: (InstanceType<T>["_source"] & { _id: string })[];
      }

      interface Update<T extends DocumentConstructor> extends Base<T> {
        action: "update";
        data: (DeepPartial<InstanceType<T>["_source"]> & { _id: string })[];
      }

      interface Delete<T extends DocumentConstructor> extends Base<T> {
        action: "delete";
        data: string[];
      }
    }
  }
}
