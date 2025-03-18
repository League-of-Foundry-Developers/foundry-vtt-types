import type { DeepPartial, EmptyObject, InexactPartial } from "fvtt-types/utils";
import type Document from "../../../common/abstract/document.d.mts";
import type { DatabaseCreateOperation } from "../../../common/abstract/_types.d.mts";

declare global {
  /**
   * @deprecated {@link CompendiumCollection.ManageCompendiumRequest | `CompendiumCollection.ManageCompendiumRequest`}
   */
  type ManageCompendiumRequest = CompendiumCollection.ManageCompendiumRequest;

  /**
   * @deprecated {@link CompendiumCollection.ManageCompendiumResponse | `CompendiumCollection.ManageCompendiumResponse`}
   */
  type ManageCompendiumResponse = CompendiumCollection.ManageCompendiumResponse;

  /**
   * A collection of Document objects contained within a specific compendium pack.
   * Each Compendium pack has its own associated instance of the CompendiumCollection class which contains its contents.
   *
   * @see {@link Game.packs | `Game#packs`}
   */
  class CompendiumCollection<T extends CompendiumCollection.Metadata> extends DirectoryCollectionMixin(
    DocumentCollection,
  )<Document.ImplementationClassFor<T["type"]>, T["name"]> {
    /** @param metadata - The compendium metadata, an object provided by game.data */
    constructor(metadata: CompendiumCollection.ConstructorMetadata<T>);

    /** The compendium metadata which defines the compendium content and location */
    metadata: T;

    /** A subsidiary collection which contains the more minimal index of the pack */
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
    get folder(): (Folder.Implementation & { type: "Compendium" }) | null;

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

    // Note(LukeAbby): The override for `_getVisibleTreeContents` become unreasonably long and don't add any changes and so has been omitted.

    static _sortStandard(
      a: DirectoryCollectionMixin.StandardSortEntry,
      b: DirectoryCollectionMixin.StandardSortEntry,
    ): number;

    /** Access the compendium configuration data for this pack */
    get config(): CompendiumCollection.Configuration | EmptyObject;

    get documentName(): this["metadata"]["type"];

    /** Track whether the Compendium Collection is locked for editing */
    get locked(): boolean;

    /**
     * The visibility configuration of this compendium pack.
     * */
    get ownership(): InexactPartial<foundry.packages.BasePackage.OwnershipRecord>;

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

    // Note(LukeAbby): The overrides for `get` become unreasonably long and don't add any changes and so have been omitted.

    // NOTE(LukeAbby): This override was disabled for the time being because it's erroring.
    // Thankfully it doesn't actually change its parent class's signature.
    // set(id: string, document: Document.Stored<Document.ImplementationInstanceFor<T["type"]>>): this;

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
    getDocument(id: string): Promise<Document.Stored<Document.ImplementationFor<T["type"]>> | undefined | null>;

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
    getDocuments(query?: Record<string, unknown>): Promise<Document.Stored<Document.ImplementationFor<T["type"]>>[]>;

    /**
     * Get the ownership level that a User has for this Compendium pack.
     * @param user - The user being tested
     * @returns The ownership level in CONST.DOCUMENT_OWNERSHIP_LEVELS
     */
    getUserLevel(user?: User.Implementation): foundry.CONST.DOCUMENT_OWNERSHIP_LEVELS;

    /**
     * Test whether a certain User has a requested permission level (or greater) over the Compendium pack
     * @param user       - The User being tested
     * @param permission - The permission level from DOCUMENT_OWNERSHIP_LEVELS to test
     * @param options    - Additional options involved in the permission test
     * @returns Does the user have this permission level over the Compendium pack?
     */
    testUserPermission(
      user: User.Implementation,
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
     * @param options  - Additional options which modify how the data is imported. See {@link ClientDocument.toCompendium | `ClientDocument#toCompendium`}
     *                   (default: `{}`)
     * @returns The imported Document instance
     */
    importDocument(
      document: Document.ImplementationFor<T["type"]>,
      options?: InexactPartial<ClientDocument.ToCompendiumOptions>,
    ): Promise<Document.Stored<Document.ImplementationFor<T["type"]>> | undefined>;

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
     *                     {@link WorldCollection.fromCompendium | `WorldCollection#fromCompendium`} and {@link Document.createDocuments | `Document.createDocuments`}
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
        } & Document.Database.CreateOperation<DatabaseCreateOperation> &
          WorldCollection.FromCompendiumOptions
      >,
    ): Promise<Document.Stored<Document.ImplementationFor<T["type"]>>[]>;

    /**
     * Provide a dialog form that prompts the user to import the full contents of a Compendium pack into the World.
     * @param options - Additional options passed to the Dialog.confirm method
     *                  (default: `{}`)
     * @returns A promise which resolves in the following ways: an array of imported
     *          Documents if the "yes" button was pressed, false if the "no" button was pressed, or
     *          null if the dialog was closed without making a choice.
     */
    importDialog(
      options?: Dialog.Options,
    ): Promise<Document.Stored<Document.ImplementationFor<T["type"]>>[] | null | false>;

    /**
     * Add a Document to the index, capturing it's relevant index attributes
     * @param document -The document to index
     */
    indexDocument(document: Document.Stored<Document.ImplementationFor<T["type"]>>): void;

    /**
     * Prompt the gamemaster with a dialog to configure ownership of this Compendium pack.
     * @returns The configured ownership for the pack
     */
    configureOwnershipDialog(): Promise<InexactPartial<foundry.packages.BasePackage.OwnershipRecord>>;

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
     *                  (default: `{}`)
     */
    static createCompendium<T extends CompendiumCollection.Metadata>(
      this: abstract new (arg0: never, ...args: never[]) => CompendiumCollection<T>,
      metadata: CompendiumCollection.CreateCompendiumMetadata<NoInfer<T>>,
      options?: unknown,
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

    // Note(LukeAbby): The override for `updateAll` and `_onModifyContents` become unreasonably long and don't add any changes and so has been omitted.

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
    interface Any extends CompendiumCollection<any> {}

    interface Configuration {
      ownership: InexactPartial<foundry.packages.BasePackage.OwnershipRecord>;
      locked: boolean;
    }

    // The type that's passed to `createCompendium`.
    interface CreateCompendiumMetadata<T extends CompendiumCollection.Metadata> {
      type: T["type"];
      label: string;
      name?: string | null | undefined;
    }

    // The type that's passed to `new CompendiumCollection(...)`
    type ConstructorMetadata<T extends CompendiumCollection.Metadata> = T & {
      index: IndexTypeForMetadata<T>;
      folders: Folder[];
    };

    // The type that appears in `compendium.metadata` after initialization.
    interface Metadata {
      type: foundry.CONST.COMPENDIUM_DOCUMENT_TYPES;
      label: string;
      name: string;

      flags: Record<string, never>; // created by the server, but always empty and no way to change it in a way that is s
      ownership: InexactPartial<foundry.packages.BasePackage.OwnershipRecord>;
      path: string;
      package: string;
      system: string;

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
      fields?: (keyof Document.ImplementationFor<T["type"]>["_source"])[];
    }

    // TODO: Improve automatic index properties based on document type
    type IndexEntry<T extends CompendiumCollection.Metadata> = { _id: string; uuid: string } & DeepPartial<
      Document.ImplementationFor<T["type"]>["_source"]
    >;

    type ForDocument<Name extends Document.Type> = Name extends unknown
      ? CompendiumCollection<Metadata & { type: Name }>
      : never;

    interface ManageCompendiumRequest extends SocketInterface.SocketRequest {
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
    interface ManageCompendiumResponse extends SocketInterface.SocketResponse {
      /**
       * The original request.
       */
      request: ManageCompendiumRequest;

      /**
       * The compendium creation data, or the collection name of the deleted compendium.
       */
      result: PackageCompendiumData | string;
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
   * Additional options forwarded to {@link WorldCollection.fromCompendium | `WorldCollection#fromCompendium`} and {@link Document.createDocuments | `Document.createDocuments`}
   * @defaultValue `{}`
   */
  options?: (Document.ModificationContext<Document.Any | null> & WorldCollection.FromCompendiumOptions) | undefined;
}

type IndexTypeForMetadata<T extends CompendiumCollection.Metadata> = foundry.utils.Collection<
  CompendiumCollection.IndexEntry<T>
>;
