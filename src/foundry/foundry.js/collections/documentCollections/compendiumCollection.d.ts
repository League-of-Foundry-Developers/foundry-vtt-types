import { ConfiguredDocumentClassForName } from '../../../../types/helperTypes';
import { IdQuery } from '../../../common/abstract/backend.mjs';
import { DocumentModificationOptions } from '../../../common/abstract/document.mjs';

declare global {
  /**
   * A collection of Document objects contained within a specific compendium pack.
   * Each Compendium pack has its own associated instance of the CompendiumCollection class which contains its contents.
   *
   * @see {@link Game#packs}
   */
  class CompendiumCollection<T extends CompendiumCollection.Metadata> extends DocumentCollection<
    DocumentClassForCompendiumMetadata<T>,
    'CompendiumCollection'
  > {
    /** @param metadata - The compendium metadata, an object provided by game.data */
    constructor(metadata: T);

    /** The compendium metadata which defines the compendium content and location */
    metadata: T;

    /**  A subsidiary collection which contains the more minimal index of the pack */
    index: IndexTypeForMetadata<T>;

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
     */
    static CONFIG_SETTING: 'compendiumConfiguration';

    /** The canonical Compendium name - comprised of the originating package and the pack name */
    get collection(): string;

    /** Access the compendium configuration data for this pack */
    get config(): CompendiumCollection.Configuration | {};

    get documentName(): this['metadata']['entity'];

    /** Track whether the Compendium Collection is locked for editing */
    get locked(): boolean;

    /** Track whether the Compendium Collection is private */
    get private(): boolean;

    /** A convenience reference to the label which should be used as the title for the Compendium pack. */
    get title(): string;

    get(key: string, { strict }: { strict: true }): DocumentInstanceForCompendiumMetadata<T>;
    get(key: string, { strict }?: { strict?: false }): DocumentInstanceForCompendiumMetadata<T> | undefined;

    set(id: string, document: DocumentInstanceForCompendiumMetadata<T>): this;

    delete: (id: string) => boolean;

    /** Load the Compendium index and cache it as the keys and values of the Collection. */
    getIndex(): Promise<this['index']>;

    /**
     * Get a single Document from this Compendium by ID.
     * The document may already be locally cached, otherwise it is retrieved from the server.
     * @param id -  The requested Document id
     * @returns The retrieved Document instance
     */
    getDocument(id: string): Promise<DocumentInstanceForCompendiumMetadata<T> | undefined | null>;

    /**
     * Load multiple documents from the Compendium pack using a provided query object.
     * @param query - A database query used to retrieve documents from the underlying database
     *                default: `{}`
     * @returns The retrieved Document instances
     */
    getDocuments(query?: IdQuery): Promise<DocumentInstanceForCompendiumMetadata<T>[]>;

    /**
     * Import a Document into this Compendium Collection.
     * @param document - The existing Document you wish to import
     * @returns The imported Document instance
     */
    importDocument(
      document: DocumentInstanceForCompendiumMetadata<T>
    ): Promise<DocumentInstanceForCompendiumMetadata<T> | undefined>;

    /**
     * Fully import the contents of a Compendium pack into a World folder.
     * @returns The imported Documents, now existing within the World
     */
    importAll({ folderId, folderName, options }: ImportAllOptions): Promise<DocumentInstanceForCompendiumMetadata<T>[]>;

    /**
     * Add a Document to the index, capturing it's relevant index attributes
     * @param document -The document to index
     */
    indexDocument(document: DocumentInstanceForCompendiumMetadata<T>): void;

    /**
     * Create a new Compendium Collection using provided metadata.
     * @param metadata - The compendium metadata used to create the new pack
     * @param options - Additional options which modify the Compendium creation request
     *                  default `{}`
     */
    static createCompendium<T extends CompendiumCollection.Metadata>(
      metadata: T,
      options?: Partial<DocumentModificationOptions>
    ): Promise<CompendiumCollection<T>>;

    /**
     * Assign configuration metadata settings to the compendium pack
     * @param settings - The object of compendium settings to define
     *                   default: `{}`
     * @returns A Promise which resolves once the setting is updated
     */
    configure(settings?: Partial<CompendiumCollection.Configuration>): Promise<CompendiumCollection.Configuration>;

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
    protected _assertUserCanModify({ requireUnlocked }?: { requireUnlocked?: boolean }): true;

    /**
     * Request that a Compendium pack be migrated to the latest System data template
     * TODO: find better type for options, used in socket dispatch
     */
    migrate(options?: object): Promise<this>;

    _onCreateDocuments(
      documents: DocumentInstanceForCompendiumMetadata<T>[],
      result: DocumentInstanceForCompendiumMetadata<T>['data']['_source'][],
      options: DocumentModificationOptions,
      userId: string
    ): void;

    _onUpdateDocuments(
      documents: DocumentInstanceForCompendiumMetadata<T>[],
      result: DeepPartial<DocumentInstanceForCompendiumMetadata<T>>[],
      options: DocumentModificationOptions,
      userId: string
    ): void;

    _onDeleteDocuments(
      documents: DocumentInstanceForCompendiumMetadata<T>[],
      result: string[],
      options: DocumentModificationOptions,
      userId: string
    ): void;

    /**
     * Follow-up actions taken when Documents within this Compendium pack are modified
     */
    protected _onModifyContents(
      documents: DocumentInstanceForCompendiumMetadata<T>[],
      options: DocumentModificationOptions,
      userId: string
    ): void;

    /** @deprecated since 0.8.0 */
    get entity(): this['documentClass']['documentName'];

    /** @deprecated since 0.8.0 */
    getContent(): ReturnType<this['getDocuments']>;

    /** @deprecated since 0.8.0 */
    getEntry(id: string): Promise<DocumentInstanceForCompendiumMetadata<T>['data']>;

    /** @deprecated since 0.8.0 */
    getEntity(id: string): ReturnType<this['getDocument']>;

    /** @deprecated since 0.8.0 */
    importEntity(document: DocumentInstanceForCompendiumMetadata<T>): ReturnType<this['importDocument']>;

    /** @deprecated since 0.8.0 */
    createEntity(
      data: Parameters<DocumentInstanceForCompendiumMetadata<T>['data']['_initializeSource']>[0],
      options?: Partial<DocumentModificationOptions>
    ): ReturnType<this['documentClass']['create']>;

    /** @deprecated since 0.8.0 */
    updateEntity(
      data: DeepPartial<Parameters<DocumentInstanceForCompendiumMetadata<T>['data']['_initializeSource']>[0]> & {
        _id: string;
      },
      options?: Partial<DocumentModificationOptions>
    ): ReturnType<DocumentInstanceForCompendiumMetadata<T>['update']>;

    /** @deprecated since 0.8.0 */
    deleteEntity(
      id: string,
      options?: Partial<DocumentModificationOptions>
    ): ReturnType<DocumentInstanceForCompendiumMetadata<T>['delete']>;
  }

  namespace CompendiumCollection {
    interface Configuration {
      private: boolean;
      locked: boolean;
    }
    interface Metadata {
      entity: 'Actor' | 'Item' | 'JournalEntry' | 'Macro' | 'Playlist' | 'RollTable' | 'Scene';
      name: string;
      label: string;
      path: string;
      private: boolean;
      package: string;
      system?: string;
    }
  }
}

interface ImportAllOptions {
  /**
   * An existing Folder _id to use.
   * @defaultValue `null`
   * */
  folderId?: string | null;
  /**
   * A new Folder name to create.
   * @defaultValue `''`
   * */
  folderName?: string;
  /**
   * Additional options forwarded to Document.createDocuments
   * @defaultValue `{}`
   */
  options?: DocumentModificationContext;
}

type DocumentClassForCompendiumMetadata<T extends CompendiumCollection.Metadata> = ConfiguredDocumentClassForName<
  T['entity']
>;

type DocumentInstanceForCompendiumMetadata<T extends CompendiumCollection.Metadata> = InstanceType<
  DocumentClassForCompendiumMetadata<T>
>;

type IndexTypeForMetadata<T extends CompendiumCollection.Metadata> = foundry.utils.Collection<
  Pick<
    DocumentInstanceForCompendiumMetadata<T>['data'],
    '_id' | 'name' | 'img' | 'type' extends keyof DocumentInstanceForCompendiumMetadata<T>['data'] ? 'type' : never
  >
>;
