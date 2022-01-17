import { ConfiguredDocumentClass, DocumentConstructor } from '../../../types/helperTypes';
import { DocumentModificationOptions } from '../../common/abstract/document.mjs';

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
    get documentName(): ConfiguredDocumentClass<T>['metadata']['name'];

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
     * @param options        - Additional options passed to Entity.update
     *                         (default: `{}`)
     * @returns An array of updated data once the operation is complete
     */
    updateAll(
      transformation:
        | DeepPartial<InstanceType<ConfiguredDocumentClass<T>>['data']['_source']>
        | ((
            doc: StoredDocument<InstanceType<ConfiguredDocumentClass<T>>>
          ) => DeepPartial<InstanceType<ConfiguredDocumentClass<T>>['data']['_source']>),
      condition?: ((obj: StoredDocument<InstanceType<ConfiguredDocumentClass<T>>>) => boolean) | null,
      options?: DocumentModificationContext
    ): ReturnType<this['documentClass']['updateDocuments']>;

    /**
     * Preliminary actions taken before a set of Documents in this Collection are created.
     * @param result  - An Array of created data objects
     * @param options - Options which modified the creation operation
     * @param userId  - The ID of the User who triggered the operation
     */
    _preCreateDocuments(
      result: InstanceType<ConfiguredDocumentClass<T>>['data']['_source'][],
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
    _onCreateDocuments(
      documents: StoredDocument<InstanceType<ConfiguredDocumentClass<T>>>[],
      result: StoredDocument<InstanceType<ConfiguredDocumentClass<T>>>['data']['_source'][],
      options: DocumentModificationOptions,
      userId: string
    ): void;

    /**
     * Preliminary actions taken before a set of Documents in this Collection are updated.
     * @param result  - An Array of incremental data objects
     * @param options - Options which modified the update operation
     * @param userId  - The ID of the User who triggered the operation
     */
    _preUpdateDocuments(
      result: DeepPartial<StoredDocument<InstanceType<ConfiguredDocumentClass<T>>>>[],
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
    _onUpdateDocuments(
      documents: StoredDocument<InstanceType<ConfiguredDocumentClass<T>>>[],
      result: DeepPartial<StoredDocument<InstanceType<ConfiguredDocumentClass<T>>>>[],
      options: DocumentModificationOptions,
      userId: string
    ): void;

    /**
     * Preliminary actions taken before a set of Documents in this Collection are deleted.
     * @param result  - An Array of document IDs being deleted
     * @param options - Options which modified the deletion operation
     * @param userId  - The ID of the User who triggered the operation
     */
    _preDeleteDocuments(result: string[], options: DocumentModificationOptions, userId: string): void;

    /**
     * Follow-up actions taken after a set of Documents in this Collection are deleted.
     * @param documents - An Array of deleted Documents
     * @param result    - An Array of document IDs being deleted
     * @param options   - Options which modified the deletion operation
     * @param userId    - The ID of the User who triggered the operation
     */
    _onDeleteDocuments(
      documents: StoredDocument<InstanceType<ConfiguredDocumentClass<T>>>[],
      result: string[],
      options: DocumentModificationOptions,
      userId: string
    ): void;
  }
}
