import { ConfiguredDocumentClassForName } from "../../../../types/helperTypes";
import { DocumentModificationOptions } from "../../../common/abstract/document.mjs.js";

declare global {
  /**
   * A collection of Document objects contained within a specific compendium pack.
   * Each Compendium pack has its own associated instance of the CompendiumCollection class which contains its contents.
   *
   * @see {@link Game#packs}
   */
  class CompendiumCollection<T extends CompendiumCollection.Metadata> extends DocumentCollection<
    DocumentClassForCompendiumMetadata<T>,
    "CompendiumCollection"
  > {
    /** @param metadata - The compendium metadata, an object provided by game.data */
    constructor(metadata: T);

    /** The compendium metadata which defines the compendium content and location */
    metadata: T & {
      /** @deprecated "The "entity" field of compendium metadata is deprecated. Please use CompendiumCollection#documentName instead." */
      get entity(): T["type"];
    };

    /**  A subsidiary collection which contains the more minimal index of the pack */
    index: IndexTypeForMetadata<T>;

    /**
     * A debounced function which will clear the contents of the Compendium pack if it is not accessed frequently.
     * @internal
     */
    _flush: () => void;

    /**
     * Has this Compendium pack been fully indexed?
     * @defaultValue `false`
     */
    indexed: boolean;

    /**
     * The amount of time that Document instances within this CompendiumCollection are held in memory.
     * Accessing the contents of the Compendium pack extends the duration of this lifetime.
     * @defaultValue `300`
     */
    static CACHE_LIFETIME_SECONDS: number;

    /**
     * The named game setting which contains Compendium configurations.
     */
    static CONFIG_SETTING: "compendiumConfiguration";

    /**
     * The default index fields which should be retrieved for each Compendium document type
     * @remarks TODO: We should also allow nested paths
     */
    static INDEX_FIELDS: {
      /** @defaultValue `["name", "img", "type"]` */
      Actor: (keyof foundry.data.ActorData["_source"])[];

      /** @defaultValue `["name", "img"]` */
      Adventure: (keyof foundry.data.AdventureData["_source"])[];

      /** @defaultValue `["name", "img", "type"]` */
      Item: (keyof foundry.data.ItemData["_source"])[];

      /** @defaultValue `["name", "img", "type"]` */
      Cards: (keyof foundry.data.CardsData["_source"])[];

      /** @defaultValue `["name", "thumb"]` */
      Scene: (keyof foundry.data.SceneData["_source"])[];

      /** @defaultValue `["name", "img"]` */
      JournalEntry: (keyof foundry.data.JournalEntryData["_source"])[];

      /** @defaultValue `["name", "img"]` */
      Macro: (keyof foundry.data.MacroData["_source"])[];

      /** @defaultValue `["name", "img"]` */
      RollTable: (keyof foundry.data.RollTableData["_source"])[];

      /** @defaultValue `["name"]` */
      Playlist: (keyof foundry.data.PlaylistData["_source"])[];
    };

    /** The canonical Compendium name - comprised of the originating package and the pack name */
    get collection(): string;

    /** Access the compendium configuration data for this pack */
    get config(): CompendiumCollection.Configuration | {};

    get documentName(): this["metadata"]["type"];

    /** Track whether the Compendium Collection is locked for editing */
    get locked(): boolean;

    /** Track whether the Compendium Collection is private */
    get private(): boolean;

    /** A convenience reference to the label which should be used as the title for the Compendium pack. */
    get title(): string;

    get(key: string, { strict }: { strict: true }): StoredDocument<DocumentInstanceForCompendiumMetadata<T>>;
    get(
      key: string,
      { strict }?: { strict?: false | undefined } | undefined
    ): StoredDocument<DocumentInstanceForCompendiumMetadata<T>> | undefined;

    set(id: string, document: StoredDocument<DocumentInstanceForCompendiumMetadata<T>>): this;

    delete: (id: string) => boolean;

    /**
     * Load the Compendium index and cache it as the keys and values of the Collection.
     * @param options - Options which customize how the index is created
     */
    getIndex(options?: CompendiumCollection.GetIndexOptions<T> | undefined): Promise<this["index"]>;

    /**
     * Get a single Document from this Compendium by ID.
     * The document may already be locally cached, otherwise it is retrieved from the server.
     * @param id -  The requested Document id
     * @returns The retrieved Document instance
     */
    getDocument(id: string): Promise<StoredDocument<DocumentInstanceForCompendiumMetadata<T>> | undefined | null>;

    /**
     * Load multiple documents from the Compendium pack using a provided query object.
     * @param query - A database query used to retrieve documents from the underlying database
     *                default: `{}`
     * @returns The retrieved Document instances
     */
    getDocuments(
      query?: Record<string, unknown> | undefined
    ): Promise<StoredDocument<DocumentInstanceForCompendiumMetadata<T>>[]>;

    /**
     * Import a Document into this Compendium Collection.
     * @param document - The existing Document you wish to import
     * @param options  - Additional options which modify how the data is imported. See {@link ClientDocumentMixin#toCompendium}
     *                   (default: `{}`)
     * @returns The imported Document instance
     */
    importDocument(
      document: DocumentInstanceForCompendiumMetadata<T>,
      options?: ClientDocumentMixin.CompendiumExportOptions | undefined
    ): Promise<StoredDocument<DocumentInstanceForCompendiumMetadata<T>> | undefined>;

    /**
     * Fully import the contents of a Compendium pack into a World folder.
     * @param folderId   - An existing Folder _id to use.
     *                     (default: `null`)
     * @param folderName - A new Folder name to create.
     *                     (default: `""`)
     * @param options    - Additional options forwarded to {@link WorldCollection#fromCompendium} and {@link Document.createDocuments}
     *                     (default: `{}`)
     * @returns The imported Documents, now existing within the World
     */
    importAll({
      folderId,
      folderName,
      options
    }?: ImportAllOptions | undefined): Promise<StoredDocument<DocumentInstanceForCompendiumMetadata<T>>[]>;

    /**
     * Provide a dialog form that prompts the user to import the full contents of a Compendium pack into the World.
     * @param options - Additional options passed to the Dialog.confirm method
     *                  (default: `{}`)
     * @returns A promise which resolves in the following ways: an array of imported
     *          Documents if the "yes" button was pressed, false if the "no" button was pressed, or
     *          null if the dialog was closed without making a choice.
     */
    importDialog(
      options?: DialogOptions | undefined
    ): Promise<StoredDocument<DocumentInstanceForCompendiumMetadata<T>>[] | null | false>;

    /**
     * Add a Document to the index, capturing it's relevant index attributes
     * @param document -The document to index
     */
    indexDocument(document: StoredDocument<DocumentInstanceForCompendiumMetadata<T>>): void;

    /**
     * Create a new Compendium Collection using provided metadata.
     * @param metadata - The compendium metadata used to create the new pack
     * @param options - Additional options which modify the Compendium creation request
     *                  default `{}`
     */
    static createCompendium<T extends CompendiumCollection.Metadata>(
      metadata: T,
      options?: Partial<DocumentModificationOptions> | undefined
    ): Promise<CompendiumCollection<T>>;

    /**
     * Assign configuration metadata settings to the compendium pack
     * @param settings - The object of compendium settings to define
     *                   default: `{}`
     * @returns A Promise which resolves once the setting is updated
     */
    configure(
      settings?: Partial<CompendiumCollection.Configuration> | undefined
    ): Promise<CompendiumCollection.Configuration>;

    /**
     * Delete an existing world-level Compendium Collection.
     * This action may only be performed for world-level packs by a Gamemaster User.
     */
    deleteCompendium(): Promise<this>;

    /**
     * Duplicate a compendium pack to the current World.
     * @param label - A new Compendium label
     */
    duplicateCompendium({ label }?: { label?: string | undefined }): Promise<this>;

    /**
     * Validate that the current user is able to modify content of this Compendium pack
     * @param requireUnlocked - `(default: true)`
     * @internal
     */
    protected _assertUserCanModify({ requireUnlocked }?: { requireUnlocked?: boolean | undefined } | undefined): true;

    /**
     * Request that a Compendium pack be migrated to the latest System data template
     * @remarks
     * Currently, there are no options that are being considered by foundry when migrating a
     * a compendium pack.
     */
    migrate(options?: Record<string, unknown> | undefined): Promise<this>;

    override updateAll(
      transformation:
        | DeepPartial<DocumentInstanceForCompendiumMetadata<T>["data"]["_source"]>
        | ((
            doc: StoredDocument<DocumentInstanceForCompendiumMetadata<T>>
          ) => DeepPartial<DocumentInstanceForCompendiumMetadata<T>["data"]["_source"]>),
      condition?: ((obj: StoredDocument<DocumentInstanceForCompendiumMetadata<T>>) => boolean) | null,
      options?: DocumentModificationContext
    ): ReturnType<this["documentClass"]["updateDocuments"]>;

    protected _onCreateDocuments(
      documents: StoredDocument<DocumentInstanceForCompendiumMetadata<T>>[],
      result: (DocumentInstanceForCompendiumMetadata<T>["data"]["_source"] & { _id: string })[],
      options: DocumentModificationOptions,
      userId: string
    ): void;

    protected _onUpdateDocuments(
      documents: StoredDocument<DocumentInstanceForCompendiumMetadata<T>>[],
      result: (DeepPartial<DocumentInstanceForCompendiumMetadata<T>["data"]["_source"]> & { _id: string })[],
      options: DocumentModificationOptions,
      userId: string
    ): void;

    protected _onDeleteDocuments(
      documents: StoredDocument<DocumentInstanceForCompendiumMetadata<T>>[],
      result: string[],
      options: DocumentModificationOptions,
      userId: string
    ): void;

    /**
     * Follow-up actions taken when Documents within this Compendium pack are modified
     * @internal
     */
    protected _onModifyContents(
      documents: StoredDocument<DocumentInstanceForCompendiumMetadata<T>>[],
      options: DocumentModificationOptions,
      userId: string
    ): void;
  }

  namespace CompendiumCollection {
    interface Configuration {
      private: boolean;
      locked: boolean;
    }
    interface Metadata {
      type: foundry.CONST.COMPENDIUM_DOCUMENT_TYPES;
      name: string;
      label: string;
      path: string;
      private: boolean;
      package: string;
      system?: string;
    }

    interface GetIndexOptions<T extends CompendiumCollection.Metadata> {
      /** An array of fields to return as part of the index */
      fields?: (keyof DocumentInstanceForCompendiumMetadata<T>["data"]["_source"])[];
    }
  }
}

interface ImportAllOptions {
  /**
   * An existing Folder _id to use.
   * @defaultValue `null`
   * */
  folderId?: string | null | undefined;
  /**
   * A new Folder name to create.
   * @defaultValue `""`
   * */
  folderName?: string | undefined;
  /**
   * Additional options forwarded to {@link WorldCollection#fromCompendium} and {@link Document.createDocuments}
   * @defaultValue `{}`
   */
  options?: (DocumentModificationContext & WorldCollection.FromCompendiumOptions) | undefined;
}

type DocumentClassForCompendiumMetadata<T extends CompendiumCollection.Metadata> = ConfiguredDocumentClassForName<
  T["type"]
>;

type DocumentInstanceForCompendiumMetadata<T extends CompendiumCollection.Metadata> = InstanceType<
  DocumentClassForCompendiumMetadata<T>
>;

type IndexTypeForMetadata<T extends CompendiumCollection.Metadata> = foundry.utils.Collection<
  { _id: string } & Partial<DocumentInstanceForCompendiumMetadata<T>["data"]["_source"]>
>;
