import { ConfiguredDocumentClassForName } from '../../../../types/helperTypes';
import { Query } from '../../../common/abstract/backend.mjs';
import { DocumentModificationOptions, Metadata } from '../../../common/abstract/document.mjs';

declare global {
  /**
   * A collection of Document objects contained within a specific compendium pack.
   * Each Compendium pack has its own associated instance of the CompendiumCollection class which contains its contents.
   * @param metadata - The compendium metadata, an object provided by game.data
   */
  class CompendiumCollection<T extends Metadata<any>> extends DocumentCollection<
    DocumentClassForMetadata<T>,
    'CompendiumCollection'
  > {
    constructor(metadata: T);

    /** The compendium metadata which defines the compendium content and location */
    metadata: T;

    /**  A subsidiary collection which contains the more minimal index of the pack */
    index: foundry.utils.Collection<DocumentInstanceForMetadata<T>>;

    /** A debounced function which will clear the contents of the Compendium pack if it is not accessed frequently. */
    _flush: () => void;

    /**
     * The amount of time that Document instances within this CompendiumCollection are held in memory.
     * Accessing the contents of the Compendium pack extends the duration of this lifetime.
     * @defaultValue `300`
     */
    static CACHE_LIFETIME_SECONDS: number;

    /**
     * The named game setting which contains Compendium configurations.
     *  @defaultValue `compendiumConfiguration`
     */
    static CONFIG_SETTING: string;

    /** The canonical Compendium name - comprised of the originating package and the pack name */
    get collection(): string;

    /** Access the compendium configuration data for this pack */
    get config(): Record<string, CompendiumConfiguration>;

    get documentName(): T['name'];

    /** Track whether the Compendium Collection is locked for editing */
    get locked(): boolean;

    /** Track whether the Compendium Collection is private */
    get private(): boolean;

    /** A convenience reference to the label which should be used as the title for the Compendium pack. */
    get title(): string;

    get(key: string, { strict }: { strict: true }): DocumentInstanceForMetadata<T>;
    get(key: string, { strict }?: { strict?: false }): DocumentInstanceForMetadata<T> | undefined;

    set(id: string, document: DocumentInstanceForMetadata<T>): this;

    delete(id: string): boolean;

    /** Load the Compendium index and cache it as the keys and values of the Collection. */
    getIndex(): Promise<this['index']>;

    /**
     * Get a single Document from this Compendium by ID.
     * The document may already be locally cached, otherwise it is retrieved from the server.
     * @param id -  The requested Document id
     * @returns The retrieved Document instance
     */
    getDocument(id: string): Promise<DocumentInstanceForMetadata<T> | undefined>;

    /**
     * Load multiple documents from the Compendium pack using a provided query object.
     * @param query - A database query used to retrieve documents from the underlying database
     *                default: `{}`
     * @returns The retrieved Document instances
     */
    getDocuments(query?: Query): Promise<DocumentInstanceForMetadata<T>[]>;

    /**
     * Import a Document into this Compendium Collection.
     * @param document - The existing Document you wish to import
     * @returns The imported Document instance
     */
    importDocument(document: DocumentInstanceForMetadata<T>): Promise<DocumentInstanceForMetadata<T>>;

    /**
     * Fully import the contents of a Compendium pack into a World folder.
     * @returns The imported Documents, now existing within the World
     */
    importAll({ folderId, folderName, options }: Partial<ImportAllOptions>): Promise<DocumentInstanceForMetadata<T>[]>;

    /**
     * Add a Document to the index, capturing it's relevant index attributes
     * @param document -The document to index
     */
    indexDocument(document: DocumentInstanceForMetadata<T>): void;

    /**
     * Create a new Compendium Collection using provided metadata.
     * @param metadata - The compendium metadata used to create the new pack
     * @param options - Additional options which modify the Compendium creation request
     *                  default `{}`
     */
    static createCompendium<T extends Metadata<any>>(
      metadata: T,
      options?: Partial<DocumentModificationOptions>
    ): Promise<CompendiumCollection<T>>;

    /**
     * Assign configuration metadata settings to the compendium pack
     * @param settings - The object of compendium settings to define
     *                   default: `{}`
     * @returns A Promise which resolves once the setting is updated
     */
    configure(settings?: Partial<CompendiumConfiguration>): Promise<void>;

    /**
     * Delete an existing world-level Compendium Collection.
     * This action may only be performed for world-level packs by a Gamemaster User.
     */
    deleteCompendium(): Promise<this>;

    /**
     * Duplicate a compendium pack to the current World.
     * @param label - A new Compendium label
     */
    duplicateCompendium({ label }?: { label?: string }): Promise<this>;

    /**
     * Validate that the current user is able to modify content of this Compendium pack
     * @param requireUnlocked - `(default: true)`
     */
    protected _assertUserCanModify({ requireUnlocked }?: { requireUnlocked?: boolean }): boolean;

    /** Request that a Compendium pack be migrated to the latest System data template */
    migrate(options?: object): Promise<this>;

    _onCreateDocuments(
      documents: DocumentInstanceForMetadata<T>[],
      result: DocumentInstanceForMetadata<T>['data']['_source'][],
      options: DocumentModificationOptions,
      userId: string
    ): void;

    _onUpdateDocuments(
      documents: DocumentInstanceForMetadata<T>[],
      result: DeepPartial<DocumentInstanceForMetadata<T>>[],
      options: DocumentModificationOptions,
      userId: string
    ): void;

    _onDeleteDocuments(
      documents: DocumentInstanceForMetadata<T>[],
      result: string[],
      options: DocumentModificationOptions,
      userId: string
    ): void;

    /**
     * Follow-up actions taken when Documents within this Compendium pack are modified
     */
    protected _onModifyContents(
      documents: DocumentInstanceForMetadata<T>[],
      options: DocumentModificationOptions,
      userId: string
    ): void;

    /** @deprecated since 0.8.0 */
    get entity(): this['documentClass']['documentName'];

    /** @deprecated since 0.8.0 */
    get content(): ReturnType<this['getDocuments']>;

    /** @deprecated since 0.8.0 */
    getEntry(id: string): Promise<DocumentInstanceForMetadata<T>['data']>;

    /** @deprecated since 0.8.0 */
    getEntity(id: string): ReturnType<this['getDocument']>;

    /** @deprecated since 0.8.0 */
    importEntity(document: DocumentInstanceForMetadata<T>): ReturnType<this['importDocument']>;

    /** @deprecated since 0.8.0 */
    createEntity(
      data: any,
      options?: Partial<DocumentModificationOptions>
    ): ReturnType<this['documentClass']['create']>;

    /** @deprecated since 0.8.0 */
    updateEntity(data: any, options?: Partial<DocumentModificationOptions>): DocumentInstanceForMetadata<T>['update'];

    /** @deprecated since 0.8.0 */
    deleteEntity(id: string, options?: Partial<DocumentModificationOptions>): DocumentInstanceForMetadata<T>['delete'];
  }

  interface CompendiumConfiguration {
    private: boolean;
    locked: boolean;
  }

  interface ImportAllOptions {
    /** An existing Folder _id to use. */
    folderId: string | null;
    /** A new Folder name to create. */
    folderName: string;
    /** Additional options forwarded to Document.createDocuments */
    options: object;
  }
}

type DocumentClassForMetadata<T extends Metadata<any>> = ConfiguredDocumentClassForName<T['name']>;

type DocumentInstanceForMetadata<T extends Metadata<any>> = InstanceType<DocumentClassForMetadata<T>>;
