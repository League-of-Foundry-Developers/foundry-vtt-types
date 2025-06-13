import type { DeepPartial, EmptyObject, InexactPartial, PrettifyType, SimpleMerge, UnionToIntersection } from "#utils";
import type Document from "#common/abstract/document.d.mts";

import SocketInterface = foundry.helpers.SocketInterface;
import Game = foundry.Game;
import type ApplicationV2 from "#client/applications/api/application.mjs";

/**
 * A collection of Document objects contained within a specific compendium pack.
 * Each Compendium pack has its own associated instance of the CompendiumCollection class which contains its contents.
 *
 * @see {@link Game.packs | `Game#packs`}
 */
declare class CompendiumCollection<
  Type extends foundry.documents.collections.CompendiumCollection.DocumentName,
> extends foundry.documents.abstract.DirectoryCollectionMixin(foundry.documents.abstract.DocumentCollection)<Type> {
  /** @param metadata - The compendium metadata, an object provided by game.data */
  constructor(metadata: foundry.documents.collections.CompendiumCollection.ConstructorMetadata<Type>);

  /** The compendium metadata which defines the compendium content and location */
  metadata: foundry.documents.collections.CompendiumCollection.Metadata;

  /** A subsidiary collection which contains the more minimal index of the pack */
  index: IndexTypeForMetadata<Type>;

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
  applicationClass:
    | foundry.appv1.api.Application.AnyConstructor
    | foundry.applications.api.ApplicationV2.AnyConstructor;

  /**
   * A subsidiary collection which contains the folders within the pack
   */
  get folders(): foundry.documents.collections.CompendiumFolderCollection;

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
  setFolder(folder: Folder.Implementation | string | null): Promise<void>;

  /**
   * Get the sort order for this Compendium
   */
  get sort(): number;

  // Note(LukeAbby): The override for `_getVisibleTreeContents` become unreasonably long and don't add any changes and so has been omitted.

  /** Access the compendium configuration data for this pack */
  get config(): foundry.documents.collections.CompendiumCollection.Configuration | EmptyObject;

  get documentName(): Type;

  /** Track whether the Compendium Collection is locked for editing */
  get locked(): boolean;

  /**
   * The visibility configuration of this compendium pack.
   */
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

  // Note(LukeAbby): The overrides for `get` become unreasonably long and don't add any changes and so have been omitted.

  // NOTE(LukeAbby): This override was disabled for the time being because it's erroring.
  // Thankfully it doesn't actually change its parent class's signature.
  // set(id: string, document: Document.Stored<Document.ImplementationFor<T["type"]>>): this;

  delete: (id: string) => boolean;

  clear: () => void;

  /**
   * Load the Compendium index and cache it as the keys and values of the Collection.
   * @param options - Options which customize how the index is created
   */
  getIndex(options?: foundry.documents.collections.CompendiumCollection.GetIndexOptions<Type>): Promise<this["index"]>;

  /**
   * Get a single Document from this Compendium by ID.
   * The document may already be locally cached, otherwise it is retrieved from the server.
   * @param id -  The requested Document id
   * @returns The retrieved Document instance
   */
  getDocument(id: string): Promise<Document.StoredForName<Type> | undefined | null>;

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
  getDocuments(
    query?: foundry.documents.collections.CompendiumCollection.Query<Type>,
  ): Promise<Document.ImplementationFor<Type>[]>;

  /**
   * Get the ownership level that a User has for this Compendium pack.
   * @param user - The user being tested (default: `game.user`)
   * @returns The ownership level in {@link CONST.DOCUMENT_OWNERSHIP_LEVELS | `CONST.DOCUMENT_OWNERSHIP_LEVELS`}
   */
  // user: not null (parameter default only)
  getUserLevel(user?: User.Implementation): CONST.DOCUMENT_OWNERSHIP_LEVELS;

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
    options?: foundry.documents.collections.CompendiumCollection.TestUserPermissionOptions,
  ): boolean;

  /**
   * Import a Document into this Compendium Collection.
   * @param document - The existing Document you wish to import
   * @param options  - Additional options which modify how the data is imported. See {@link ClientDocument.toCompendium | `ClientDocument#toCompendium`}
   *                   (default: `{}`)
   * @returns The imported Document instance
   */
  importDocument(
    document: Document.ImplementationFor<Type>,
    options?: ClientDocument.ToCompendiumOptions,
  ): Promise<Document.StoredForName<Type> | undefined>;

  /**
   * Import a Folder into this Compendium Collection.
   * @param folder  - The existing Folder you wish to import
   * @param options - Additional options which modify how the data is imported.
   */
  importFolder(
    folder: Folder.Implementation,
    options?: foundry.documents.collections.CompendiumCollection.ImportFolderOptions,
  ): Promise<void>;

  /**
   * Import an array of Folders into this Compendium Collection.
   * @param folders - The existing Folders you wish to import
   * @param options - Additional options which modify how the data is imported.
   */
  importFolders(
    folders: Folder.Implementation[],
    options?: foundry.documents.collections.CompendiumCollection.ImportFoldersOptions,
  ): Promise<void>;

  /**
   * Fully import the contents of a Compendium pack into a World folder.
   * @param options - Options which modify the import operation. Additional options are forwarded to {@link WorldCollection.fromCompendium | `WorldCollection#fromCompendium`} and {@linkcode Document.createDocuments} (default: `{}`)
   * @returns The imported Documents, now existing within the World
   */
  importAll(
    options?: foundry.documents.collections.CompendiumCollection.ImportAllOptions<Type>,
  ): Promise<Document.StoredForName<Type>[]>;

  /**
   * Provide a dialog form that prompts the user to import the full contents of a Compendium pack into the World.
   * @param options - Additional options passed to the DialogV2.confirm method
   *                  (default: `{}`)
   * @returns A promise which resolves in the following ways: an array of imported
   *          Documents if the "yes" button was pressed, false if the "no" button was pressed, or
   *          null if the dialog was closed without making a choice.
   */
  importDialog(options?: foundry.applications.api.DialogV2.ConfirmConfig): Promise<Document.StoredForName<Type>[] | null | false>;

  /**
   * Add a Document to the index, capturing it's relevant index attributes
   * @param document -The document to index
   */
  indexDocument(document: Document.StoredForName<Type>): void;

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
   *                  (default: `{}`)
   */
  static createCompendium<T extends foundry.documents.collections.CompendiumCollection.DocumentName>(
    this: abstract new (...args: never) => CompendiumCollection<NoInfer<T>>,
    metadata: foundry.documents.collections.CompendiumCollection.CreateCompendiumMetadata<T>,
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
  duplicateCompendium({
    label,
  }?: foundry.documents.collections.CompendiumCollection.DuplicateCompendiumOptions): Promise<this>;

  /**
   * Migrate a compendium pack.
   * This operation re-saves all documents within the compendium pack to disk, applying the current data model.
   * If the document type has system data, the latest system data template will also be applied to all documents.
   */
  migrate(): Promise<this>;

  // Note(LukeAbby): The override for `updateAll` and `_onModifyContents` become unreasonably long and don't add any changes and so has been omitted.

  override render(force?: boolean, options?: Application.Options | ApplicationV2.RenderOptions): void;

  /**
   * Handle changes to the world compendium configuration setting.
   */
  // TODO: extract this type
  protected static _onConfigure(config: Record<string, { folder?: string | undefined; sort?: number | undefined; locked?: boolean | undefined }>): void;
}

declare namespace CompendiumCollection {
  interface Any extends CompendiumCollection<DocumentName> {}

  type DocumentName = foundry.CONST.COMPENDIUM_DOCUMENT_TYPES;

  interface Configuration {
    ownership: foundry.packages.BasePackage.OwnershipRecord;
    locked: boolean;
  }

  // The type that's passed to `createCompendium`.
  interface CreateCompendiumMetadata<Type extends DocumentName> {
    type: Type;
    label: string;
    name?: string | undefined;
  }

  // The type that's passed to `new CompendiumCollection(...)`
  type ConstructorMetadata<Type extends foundry.documents.collections.CompendiumCollection.DocumentName> =
    Metadata<Type> & {
      index: IndexTypeForMetadata<Type>;
      folders: Folder.Implementation[];
    };

  // The type that appears in `compendium.metadata` after initialization.
  interface Metadata<
    Type extends
      foundry.documents.collections.CompendiumCollection.DocumentName = foundry.documents.collections.CompendiumCollection.DocumentName,
  > {
    type: Type;
    label: string;
    name: string;

    flags: Record<string, never>; // created by the server, but always empty and no way to change it in a way that is s
    ownership: foundry.packages.BasePackage.OwnershipRecord;
    path: string;
    package: string;
    system: string;

    /** Added by PackageCompendiumPacks#initialize */
    id: string;
    packageType: string;
    packageName: string;
  }

  interface GetIndexOptions<Type extends DocumentName> {
    /**
     * An array of fields to return as part of the index
     * @defaultValue `[]`
     */
    fields?: (keyof Document.SourceForName<Type>)[];
  }

  // TODO: Improve automatic index properties based on document type
  type IndexEntry<Type extends DocumentName> = { _id: string; uuid: string } & DeepPartial<
    Document.SourceForName<Type>
  >;

  type ForDocument<Name extends DocumentName> = Name extends unknown ? CompendiumCollection<Name> : never;

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

  interface TestUserPermissionOptions {
    /**
     * Require the exact permission level requested?
     * @defaultValue `false`
     */
    exact?: boolean | undefined;
  }

  interface ImportFolderOptions {
    /**
     * Import any parent folders which are not already present in the Compendium
     * @defaultValue `true`
     */
    importParents?: boolean | undefined;
  }

  interface ImportFoldersOptions {
    /**
     * Import any parent folders which are not already present in the Compendium
     * @defaultValue `true`
     */
    importParents?: boolean | undefined;
  }

  type ImportAllOptions<Type extends foundry.documents.collections.CompendiumCollection.DocumentName> = SimpleMerge<
    UnionToIntersection<Document.Database.CreateOperationForName<Type>>,
    foundry.documents.abstract.WorldCollection.FromCompendiumOptions
  > & {
    /**
     * An existing Folder _id to use.
     * @defaultValue `null`
     */
    folderId?: string | null | undefined;

    /**
     * A new Folder name to create.
     * @defaultValue `""`
     */
    folderName?: string | undefined;
  };

  interface DuplicateCompendiumOptions {
    label?: string | undefined;
  }

  // Note(LukeAbby): One neat possibility for this type would be making something like `type: "foo"`,
  // `type__ne: "foo"`, and `type__in: ["foo", "bar"]` all narrow `system`.
  type Query<Type extends foundry.documents.collections.CompendiumCollection.DocumentName> = _Queryify<
    Document.SourceForName<Type>
  >;

  /** @internal */
  type _Queryify<T> = T extends object ? _QueryifyObject<T> : T;

  /** @internal */
  type _QueryifyObject<T extends object> = PrettifyType<
    {
      [K in keyof T]?: _Queryify<T[K]>;
    } & {
      [K in keyof T as K extends string
        ? IsComparable<T[K]> extends true
          ? `${K}__in`
          : never
        : never]?: ReadonlyArray<T[K]>;
    } & {
      [K in keyof T as K extends string ? (IsComparable<T[K]> extends true ? `${K}__ne` : never) : never]?: T[K];
    }
  >;
}

type IsComparable<T> = T extends boolean | string | number | bigint | symbol | null | undefined ? true : false;

type IndexTypeForMetadata<Type extends foundry.documents.collections.CompendiumCollection.DocumentName> =
  foundry.utils.Collection<foundry.documents.collections.CompendiumCollection.IndexEntry<Type>>;

export default CompendiumCollection;
