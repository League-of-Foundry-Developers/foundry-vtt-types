import { ConfiguredDocumentClass, DocumentConstructor } from "../../../../types/helperTypes";
import { DocumentModificationOptions } from "../../../common/abstract/document.mjs";

declare global {
  /**
   * An abstract subclass of the Collection container which defines a collection of Document instances.
   */
  abstract class DocumentCollection<T extends DocumentConstructor, Name extends string> extends foundry.utils
    .Collection<StoredDocument<InstanceType<ConfiguredDocumentClass<T>>>> {
    constructor();

    /**
     * An Array of application references which will be automatically updated when the collection content changes
     * @defaultValue `[]`
     */
    apps: Application[];

    /**
     * The Collection class name
     */
    get name(): Name;

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
     * @remarks The parameter `id` is ignored, instead `document.id` is used as the key.
     */
    set(id: string, document: StoredDocument<InstanceType<ConfiguredDocumentClass<T>>>): this;

    /**
     * Render any Applications associated with this DocumentCollection.
     */
    render(force?: boolean, options?: ApplicationOptions): void;

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
        | DeepPartial<InstanceType<ConfiguredDocumentClass<T>>["data"]["_source"]>
        | ((
            doc: StoredDocument<InstanceType<ConfiguredDocumentClass<T>>>
          ) => DeepPartial<InstanceType<ConfiguredDocumentClass<T>>["data"]["_source"]>),
      condition?: ((obj: StoredDocument<InstanceType<ConfiguredDocumentClass<T>>>) => boolean) | null,
      options?: DocumentModificationContext
    ): ReturnType<this["documentClass"]["updateDocuments"]>;

    /**
     * Preliminary actions taken before a set of Documents in this Collection are created.
     * @param result  - An Array of created data objects
     * @param options - Options which modified the creation operation
     * @param userId  - The ID of the User who triggered the operation
     */
    protected _preCreateDocuments(
      result: (InstanceType<T>["data"]["_source"] & { _id: string })[],
      options: DocumentModificationOptions,
      userId: string
    ): void;

    /**
     * Follow-up actions taken after a set of Documents in this Collection are created.
     * @param documents - An Array of created Documents
     * @param result    - An Array of created data objects
     * @param options   - Options which modified the creation operation
     * @param userId    - The ID of the User who triggered the operation
     */
    protected _onCreateDocuments(
      documents: StoredDocument<InstanceType<ConfiguredDocumentClass<T>>>[],
      result: (InstanceType<T>["data"]["_source"] & { _id: string })[],
      options: DocumentModificationOptions,
      userId: string
    ): void;

    /**
     * Preliminary actions taken before a set of Documents in this Collection are updated.
     * @param result  - An Array of incremental data objects
     * @param options - Options which modified the update operation
     * @param userId  - The ID of the User who triggered the operation
     */
    protected _preUpdateDocuments(
      result: (DeepPartial<InstanceType<T>["data"]["_source"]> & { _id: string })[],
      options: DocumentModificationOptions,
      userId: string
    ): void;

    /**
     * Follow-up actions taken after a set of Documents in this Collection are updated.
     * @param documents - An Array of updated Documents
     * @param result    - An Array of incremental data objects
     * @param options   - Options which modified the update operation
     * @param userId    - The ID of the User who triggered the operation
     */
    protected _onUpdateDocuments(
      documents: StoredDocument<InstanceType<ConfiguredDocumentClass<T>>>[],
      result: (DeepPartial<InstanceType<T>["data"]["_source"]> & { _id: string })[],
      options: DocumentModificationOptions,
      userId: string
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
      documents: StoredDocument<InstanceType<ConfiguredDocumentClass<T>>>[],
      result: string[],
      options: DocumentModificationOptions,
      userId: string
    ): void;

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
      documents: StoredDocument<InstanceType<ConfiguredDocumentClass<T>>>[],
      data: (InstanceType<T>["data"]["_source"] & { _id: string })[]
    ): DocumentCollection.RenderContext.Create<T>;
    protected _getRenderContext(
      action: DocumentCollection.RenderContext.Update<T>["action"],
      documents: StoredDocument<InstanceType<ConfiguredDocumentClass<T>>>[],
      data: (DeepPartial<InstanceType<T>["data"]["_source"]> & { _id: string })[]
    ): DocumentCollection.RenderContext.Update<T>;
    protected _getRenderContext(
      action: DocumentCollection.RenderContext.Delete<T>["action"],
      documents: StoredDocument<InstanceType<ConfiguredDocumentClass<T>>>[],
      data: string[]
    ): DocumentCollection.RenderContext.Delete<T>;
  }

  namespace DocumentCollection {
    namespace RenderContext {
      interface Base<T extends DocumentConstructor> {
        documentType: T["metadata"]["name"];
        documents: StoredDocument<InstanceType<ConfiguredDocumentClass<T>>>[];

        /** @deprecated The "entities" render context is deprecated. Please use "documents" instead. */
        get entities(): this["documents"];

        /** @deprecated The "entityType" render context is deprecated. Please use "documentType" instead. */
        get entityType(): this["documentType"];
      }

      interface Create<T extends DocumentConstructor> extends Base<T> {
        action: "create";
        data: (InstanceType<T>["data"]["_source"] & { _id: string })[];
      }

      interface Update<T extends DocumentConstructor> extends Base<T> {
        action: "update";
        data: (DeepPartial<InstanceType<T>["data"]["_source"]> & { _id: string })[];
      }

      interface Delete<T extends DocumentConstructor> extends Base<T> {
        action: "delete";
        data: string[];
      }
    }
  }
}
