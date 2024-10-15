import type { DeepPartial, EmptyObject, InexactPartial } from "../../../../types/utils.d.mts";
import type {
  DatabaseCreateOperation,
  DatabaseDeleteOperation,
  DatabaseUpdateOperation,
} from "../../../common/abstract/_types.d.mts";
import type Document from "../../../common/abstract/document.d.mts";
import type { DirectoryCollectionMixin_DocumentCollection_Interface } from "../abstract/directory-collection-mixin.d.mts";

declare const DirectoryCollectionMixin_DocumentCollection: DirectoryCollectionMixin_DocumentCollection_Interface;

declare global {
  interface ManageCompendiumRequest extends SocketRequest {
    /**
     * The request action.
     */
    action: string;

    /**
     * The compendium creation data, or the ID of the compendium to delete.
     */
    data: PackageCompendiumData | string;

    /**
     * Additional options.
     */
    options?: Record<string, unknown>;
  }

  // @ts-expect-error Bad inheritance
  interface ManageCompendiumResponse extends SocketResponse {
    /**
     * The original request.
     */
    request: ManageCompendiumRequest;

    /**
     * The compendium creation data, or the collection name of the deleted compendium.
     */
    result: PackageCompendiumData | string;
  }

  /**
   * A collection of Document objects contained within a specific compendium pack.
   * Each Compendium pack has its own associated instance of the CompendiumCollection class which contains its contents.
   *
   * @see {@link Game#packs}
   */
  class CompendiumCollection<
    T extends CompendiumCollection.Metadata,
  > extends DirectoryCollectionMixin_DocumentCollection<DocumentClassForCompendiumMetadata<T>, T["name"]> {
    /** @param metadata - The compendium metadata, an object provided by game.data */
    constructor(metadata: T);

    /** The compendium metadata which defines the compendium content and location */
    metadata: T;

    /**  A subsidiary collection which contains the more minimal index of the pack */
    index: IndexTypeForMetadata<T>;

    /**
     * A debounced function which will clear the contents of the Compendium pack if it is not accessed frequently.
     * @internal
     */
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
    static CONFIG_SETTING: "compendiumConfiguration";

    /** The canonical Compendium name - comprised of the originating package and the pack name */
    get collection(): this["metadata"]["id"];

    /** The banner image for this Compendium pack, or the default image for the pack type if no image is set. */
    get banner(): string | null | void;

    /**
     * A reference to the Application class which provides an interface to interact with this compendium content.
     * @defaultValue `Compendium`
     */
    applicationClass: typeof Application;

    /**
     * A subsidiary collection which contains the folders within the pack
     */
    get folders(): CompendiumFolderCollection;

    /**
     * @remarks 1 less than in-world
     * @defaultValue `CONST.FOLDER_MAX_DEPTH - 1`
     */
    get maxFolderDepth(): number;

    /**
     * Get the Folder that this Compendium is displayed within
     */
    get folder(): (Folder.ConfiguredInstance & { type: "Compendium" }) | null;

    /**
     * Assign this CompendiumCollection to be organized within a specific Folder.
     * @param folder - The desired Folder within the World or null to clear the folder
     * @returns A promise which resolves once the transaction is complete
     */
    setFolder(folder: Folder | string | null): Promise<void>;

    /**
     * Get the sort order for this Compendium
     */
    get sort(): number;

    protected override _getVisibleTreeContents(): DocumentInstanceForCompendiumMetadata<T>[];

    static _sortStandard(a: number, b: number): number;

    /** Access the compendium configuration data for this pack */
    get config(): CompendiumCollection.Configuration | EmptyObject;

    get documentName(): this["metadata"]["type"];

    /** Track whether the Compendium Collection is locked for editing */
    get locked(): boolean;

    /**
     * The visibility configuration of this compendium pack.
     * A value in CONST.USER_ROLES
     * */
    get ownership(): foundry.packages.BasePackage.OwnershipRecord;

    /** Is this Compendium pack visible to the current game User? */
    get visible(): boolean;

    /** A convenience reference to the label which should be used as the title for the Compendium pack. */
    get title(): string;

    /**
     * The index fields which should be loaded for this compendium pack
     * @remarks Contained elements are a concatenation of the document's `metadata.compendiumIndexFields` as well as CONFIG
     */
    get indexFields(): Set<string>;

    /**
     * Has this Compendium pack been fully indexed?
     * @defaultValue `false`
     */
    get indexed(): boolean;

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
    ): Document.Stored<DocumentInstanceForCompendiumMetadata<T>> | undefined;
    get(
      key: string,
      options: { strict: true; invalid?: false },
    ): Document.Stored<DocumentInstanceForCompendiumMetadata<T>>;
    get(key: string, options: { strict?: boolean; invalid: true }): unknown;

    set(id: string, document: Document.Stored<DocumentInstanceForCompendiumMetadata<T>>): this;

    delete: (id: string) => boolean;

    clear: () => void;

    /**
     * Load the Compendium index and cache it as the keys and values of the Collection.
     * @param options - Options which customize how the index is created
     */
    getIndex(options?: CompendiumCollection.GetIndexOptions<T>): Promise<this["index"]>;

    /**
     * Get a single Document from this Compendium by ID.
     * The document may already be locally cached, otherwise it is retrieved from the server.
     * @param id -  The requested Document id
     * @returns The retrieved Document instance
     */
    getDocument(id: string): Promise<Document.Stored<DocumentInstanceForCompendiumMetadata<T>> | undefined | null>;

    /**
     * Load multiple documents from the Compendium pack using a provided query object.
     * @param query - A database query used to retrieve documents from the underlying database
     *                default: `{}`
     * @returns The retrieved Document instances
     *
     * @example Get Documents that match the given value only.
     * ```js
     * await pack.getDocuments({ type: "weapon" });
     * ```
     *
     * @example Get several Documents by their IDs.
     * ```js
     * await pack.getDocuments({ _id__in: arrayOfIds });
     * ```
     *
     * @example Get Documents by their sub-types.
     * ```js
     * await pack.getDocuments({ type__in: ["weapon", "armor"] });
     * ```
     */
    getDocuments(query?: Record<string, unknown>): Promise<Document.Stored<DocumentInstanceForCompendiumMetadata<T>>[]>;

    /**
     * Get the ownership level that a User has for this Compendium pack.
     * @param user - The user being tested
     * @returns The ownership level in CONST.DOCUMENT_OWNERSHIP_LEVELS
     */
    getUserLevel(user?: User): foundry.CONST.DOCUMENT_OWNERSHIP_LEVELS;

    /**
     * Test whether a certain User has a requested permission level (or greater) over the Compendium pack
     * @param user       - The User being tested
     * @param permission - The permission level from DOCUMENT_OWNERSHIP_LEVELS to test
     * @param options    - Additional options involved in the permission test
     * @returns Does the user have this permission level over the Compendium pack?
     */
    testUserPermission(
      user: User,
      permission: string | number,
      options?: InexactPartial<{
        /**
         * Require the exact permission level requested?
         * @defaultValue `false`
         */
        exact: boolean;
      }>,
    ): boolean;

    /**
     * Import a Document into this Compendium Collection.
     * @param document - The existing Document you wish to import
     * @param options  - Additional options which modify how the data is imported. See {@link ClientDocument#toCompendium}
     *                   (default: `{}`)
     * @returns The imported Document instance
     */
    importDocument(
      document: DocumentInstanceForCompendiumMetadata<T>,
      options?: InexactPartial<ClientDocument.CompendiumExportOptions>,
    ): Promise<Document.Stored<DocumentInstanceForCompendiumMetadata<T>> | undefined>;

    /**
     * Import a Folder into this Compendium Collection.
     * @param folder  - The existing Folder you wish to import
     * @param options - Additional options which modify how the data is imported.
     */
    importFolder(
      folder: Folder,
      options?: InexactPartial<{
        /**
         * Import any parent folders which are not already present in the Compendium
         * @defaultValue `true`
         */
        importParents: boolean;
      }>,
    ): Promise<void>;

    /**
     * Import an array of Folders into this Compendium Collection.
     * @param folders - The existing Folders you wish to import
     * @param options - Additional options which modify how the data is imported.
     */
    importFolders(
      folders: Folder[],
      options?: InexactPartial<{
        /**
         * Import any parent folders which are not already present in the Compendium
         * @defaultValue `true`
         */
        importParents: boolean;
      }>,
    ): Promise<void>;

    /**
     * Fully import the contents of a Compendium pack into a World folder.
     * @param options    - Options which modify the import operation. Additional options are forwarded to
     *                     {@link WorldCollection#fromCompendium} and {@link Document.createDocuments}
     *                     (default: `{}`)
     * @returns The imported Documents, now existing within the World
     */
    importAll(
      options?: InexactPartial<
        {
          /**
           * An existing Folder _id to use.
           * @defaultValue `null`
           * */
          folderId: string | null;
          /**
           * A new Folder name to create.
           * @defaultValue `""`
           * */
          folderName: string;
        } & Document.OnCreateOptions<this["metadata"]["type"]> &
          WorldCollection.FromCompendiumOptions
      >,
    ): Promise<Document.Stored<DocumentInstanceForCompendiumMetadata<T>>[]>;

    /**
     * Provide a dialog form that prompts the user to import the full contents of a Compendium pack into the World.
     * @param options - Additional options passed to the Dialog.confirm method
     *                  (default: `{}`)
     * @returns A promise which resolves in the following ways: an array of imported
     *          Documents if the "yes" button was pressed, false if the "no" button was pressed, or
     *          null if the dialog was closed without making a choice.
     */
    importDialog(
      options?: DialogOptions,
    ): Promise<Document.Stored<DocumentInstanceForCompendiumMetadata<T>>[] | null | false>;

    /**
     * Add a Document to the index, capturing it's relevant index attributes
     * @param document -The document to index
     */
    indexDocument(document: Document.Stored<DocumentInstanceForCompendiumMetadata<T>>): void;

    /**
     * Prompt the gamemaster with a dialog to configure ownership of this Compendium pack.
     * @returns The configured ownership for the pack
     */
    configureOwnershipDialog(): Promise<foundry.packages.BasePackage.OwnershipRecord>;

    /**
     * Activate the Socket event listeners used to receive responses to compendium management events.
     * @param socket - The active game socket.
     * @internal
     */
    protected static _activateSocketListeners(socket: Game["socket"]): void;

    /**
     * Create a new Compendium Collection using provided metadata.
     * @param metadata - The compendium metadata used to create the new pack
     * @param options - Additional options which modify the Compendium creation request
     *                  default `{}`
     */
    static createCompendium<T extends CompendiumCollection.Metadata>(
      metadata: T,
      options?: Document.OnCreateOptions<T["type"]>,
    ): Promise<CompendiumCollection<T>>;

    /**
     * Generate a UUID for a given primary document ID within this Compendium pack
     * @param id - The document ID to generate a UUID for
     * @returns The generated UUID, in the form of "Compendium.<collection>.<documentName>.<id>"
     */
    getUuid(id: string): string;

    /**
     * Assign configuration metadata settings to the compendium pack
     * @param configuration - The object of compendium settings to define
     *                        (default: `{}`)
     * @returns A Promise which resolves once the setting is updated
     */
    configure(
      configuration?: InexactPartial<CompendiumCollection.Configuration>,
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
     * Migrate a compendium pack.
     * This operation re-saves all documents within the compendium pack to disk, applying the current data model.
     * If the document type has system data, the latest system data template will also be applied to all documents.
     */
    migrate(): Promise<this>;

    override updateAll(
      transformation:
        | DeepPartial<DocumentInstanceForCompendiumMetadata<T>["_source"]>
        | ((
            doc: Document.Stored<DocumentInstanceForCompendiumMetadata<T>>,
          ) => DeepPartial<DocumentInstanceForCompendiumMetadata<T>["_source"]>),
      condition?: ((obj: Document.Stored<DocumentInstanceForCompendiumMetadata<T>>) => boolean) | null,
      options?: Document.OnUpdateOptions<this["metadata"]["type"]>,
    ): ReturnType<this["documentClass"]["updateDocuments"]>;

    /**
     * Follow-up actions taken when Documents within this Compendium pack are modified
     * @internal
     */
    _onModifyContents(
      action: "create",
      documents: ClientDocument[],
      result: Record<string, unknown>[],
      operation: DatabaseCreateOperation<InstanceType<DocumentClassForCompendiumMetadata<T>>>,
      user: User,
    ): void;
    _onModifyContents(
      action: "update",
      documents: ClientDocument[],
      result: Record<string, unknown>[],
      operation: DatabaseUpdateOperation<InstanceType<DocumentClassForCompendiumMetadata<T>>>,
      user: User,
    ): void;
    _onModifyContents(
      action: "delete",
      documents: ClientDocument[],
      result: string[],
      operation: DatabaseDeleteOperation,
      user: User,
    ): void;

    /**
     * @deprecated since v11, will be removed in v13
     * @remarks `"CompendiumCollection#private is deprecated in favor of the new CompendiumCollection#ownership, CompendiumCollection#getUserLevel, CompendiumCollection#visible properties"`
     */
    get private(): boolean;

    /**
     * @deprecated since v11, will be removed in v13
     * @remarks `"CompendiumCollection#isOpen is deprecated and will be removed in V13"`
     */
    get isOpen(): boolean;
  }

  namespace CompendiumCollection {
    type Any = CompendiumCollection<any>;

    interface Configuration {
      ownership: foundry.packages.BasePackage.OwnershipRecord;
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
      /** Added by PackageCompendiumPacks#initialize */
      id: string;
      packageType: string;
      packageName: string;
    }

    interface GetIndexOptions<T extends CompendiumCollection.Metadata> {
      /**
       * An array of fields to return as part of the index
       * @defaultValue `[]`
       */
      fields?: (keyof DocumentInstanceForCompendiumMetadata<T>["_source"])[];
    }

    // TODO: Improve automatic index properties based on document type
    type IndexEntry<T extends CompendiumCollection.Metadata> = { _id: string; uuid: string } & DeepPartial<
      DocumentInstanceForCompendiumMetadata<T>["_source"]
    >;
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
  options?: (Document.ModificationContext<Document.Any | null> & WorldCollection.FromCompendiumOptions) | undefined;
}

type DocumentClassForCompendiumMetadata<T extends CompendiumCollection.Metadata> = Document.ConfiguredClassForName<
  T["type"]
>;

type DocumentInstanceForCompendiumMetadata<T extends CompendiumCollection.Metadata> =
  Document.ConfiguredInstanceForName<T["type"]>;

type IndexTypeForMetadata<T extends CompendiumCollection.Metadata> = foundry.utils.Collection<
  CompendiumCollection.IndexEntry<T>
>;
