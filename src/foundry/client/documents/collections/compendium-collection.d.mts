import type { DeepPartial, EmptyObject, InexactPartial, PrettifyType } from "#utils";
import type { fields } from "#client/data/_module.d.mts";
import type Document from "#common/abstract/document.d.mts";
import type { ApplicationV2, DialogV2 } from "#client/applications/api/_module.d.mts";
import type { Application } from "#client/appv1/api/_module.d.mts";
import type { Game } from "#client/_module.d.mts";
import type { SocketInterface } from "#client/helpers/_module.d.mts";
import type { BasePackage } from "#common/packages/_module.d.mts";

/**
 * A collection of Document objects contained within a specific compendium pack.
 * Each Compendium pack has its own associated instance of the CompendiumCollection class which contains its contents.
 *
 * @see {@linkcode Game.packs | Game#packs}
 */
declare class CompendiumCollection<
  Type extends CompendiumCollection.DocumentName,
> extends foundry.documents.abstract.DirectoryCollectionMixin(foundry.documents.abstract.DocumentCollection)<Type> {
  /** @param metadata - The compendium metadata, an object provided by game.data */
  constructor(metadata: CompendiumCollection.ConstructorMetadata<Type>);

  /** The compendium metadata which defines the compendium content and location */
  metadata: CompendiumCollection.Metadata<Type>;

  /** A subsidiary collection which contains the more minimal index of the pack */
  index: IndexTypeForMetadata<Type>;

  /** @deprecated Foundry made this property truly private in v13 (this warning will be removed in v14) */
  _flush: never;

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
   * The DataField definition for the configuration Setting
   */
  static CONFIG_FIELD: CompendiumCollection.SettingField;

  /** The canonical Compendium name - comprised of the originating package and the pack name */
  get collection(): this["metadata"]["id"];

  /** The banner image for this Compendium pack, or the default image for the pack type if no image is set. */
  get banner(): string | null | void;

  /**
   * A reference to the Application class which provides an interface to interact with this compendium content.
   * @defaultValue {@linkcode foundry.applications.sidebar.apps.Compendium}
   */
  applicationClass: Application.AnyConstructor | ApplicationV2.AnyConstructor;

  /**
   * A subsidiary collection which contains the folders within the pack
   */
  get folders(): foundry.documents.collections.CompendiumFolderCollection;

  /**
   * @remarks 1 less than in-world
   * @defaultValue {@linkcode CONST.FOLDER_MAX_DEPTH}`- 1`
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
  get config(): CompendiumCollection.StoredConfiguration | EmptyObject;

  get documentName(): Type;

  /** Track whether the Compendium Collection is locked for editing */
  get locked(): boolean;

  /**
   * The visibility configuration of this compendium pack.
   * @remarks Foundry wants this to be {@linkcode CompendiumCollection.OwnershipData} (omitting the `NONE` key), but due to {@link https://github.com/foundryvtt/foundryvtt/issues/13354} it's not
   */
  get ownership(): BasePackage.OwnershipRecord;

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
  getIndex(options?: CompendiumCollection.GetIndexOptions<Type>): Promise<this["index"]>;

  /**
   * Get a single Document from this Compendium by ID.
   * The document may already be locally cached, otherwise it is retrieved from the server.
   * @param id -  The requested Document id
   * @returns The retrieved Document instance
   */
  getDocument(id: string): Promise<Document.StoredForName<Type> | undefined | null>;

  /**
   * Load multiple documents from the Compendium pack using a provided query object.
   * @param query - A database query used to retrieve documents from the underlying database (default: `{}`)
   * @returns The retrieved Document instances
   *
   * @example
   * Get Documents that match the given value only.
   * ```js
   * await pack.getDocuments({ type: "weapon" });
   * ```
   *
   * @example
   * Get several Documents by their IDs.
   * ```js
   * await pack.getDocuments({ _id__in: arrayOfIds });
   * ```
   *
   * @example
   * Get Documents by their sub-types.
   * ```js
   * await pack.getDocuments({ type__in: ["weapon", "armor"] });
   * ```
   */
  getDocuments(query?: CompendiumCollection.Query<Type>): Promise<Document.ImplementationFor<Type>[]>;

  /**
   * Get the ownership level that a User has for this Compendium pack.
   * @param user - The user being tested (default: `game.user`)
   * @returns The ownership level in {@linkcode CONST.DOCUMENT_OWNERSHIP_LEVELS}
   */
  getUserLevel(user?: User.Implementation): CONST.DOCUMENT_OWNERSHIP_LEVELS;

  /**
   * Test whether a certain User has a requested permission level (or greater) over the Compendium pack
   * @param user       - The User being tested
   * @param permission - The permission level from {@linkcode CONST.DOCUMENT_OWNERSHIP_LEVELS} to test
   * @param options    - Additional options involved in the permission test
   * @returns Does the user have this permission level over the Compendium pack?
   */
  testUserPermission(
    user: User.Implementation,
    permission: string | number,
    options?: CompendiumCollection.TestUserPermissionOptions,
  ): boolean;

  /**
   * Import a Document into this Compendium Collection.
   * @param document - The existing Document you wish to import
   * @param options  - Additional options which modify how the data is imported. See {@linkcode foundry.documents.abstract.ClientDocumentMixin.AnyMixed.toCompendium | ClientDocument#toCompendium} (default: `{}`)
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
  importFolder(folder: Folder.Implementation, options?: CompendiumCollection.ImportFolderOptions): Promise<void>;

  /**
   * Import an array of Folders into this Compendium Collection.
   * @param folders - The existing Folders you wish to import
   * @param options - Additional options which modify how the data is imported.
   */
  importFolders(folders: Folder.Implementation[], options?: CompendiumCollection.ImportFoldersOptions): Promise<void>;

  /**
   * Fully import the contents of a Compendium pack into a World folder.
   * @param options - Options which modify the import operation. Additional options are forwarded to {@linkcode WorldCollection.fromCompendium | WorldCollection#fromCompendium} and {@linkcode Document.createDocuments} (default: `{}`)
   * @returns The imported Documents, now existing within the World
   */
  importAll(options?: CompendiumCollection.ImportAllOptions<Type>): Promise<Document.StoredForName<Type>[]>;

  /**
   * Provide a dialog form that prompts the user to import the full contents of a Compendium pack into the World.
   * @param options - Additional options passed to the DialogV2.confirm method (default: `{}`)
   * @returns A promise which resolves in the following ways: an array of imported Documents if the "yes" button was pressed,
   * false if the "no" button was pressed, or null if the dialog was closed without making a choice.
   */
  importDialog(options?: DialogV2.ConfirmConfig): Promise<Document.StoredForName<Type>[] | null | false>;

  /**
   * Add a Document to the index, capturing it's relevant index attributes
   * @param document - The document to index
   */
  indexDocument(document: Document.StoredForName<Type>): void;

  /**
   * Prompt the gamemaster with a dialog to configure ownership of this Compendium pack.
   * @returns The configured ownership for the pack
   * @remarks As of 13.347, any choices made here will not be saved (see {@link https://github.com/foundryvtt/foundryvtt/issues/13283}).
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
   * @param options  - Additional options which modify the Compendium creation request (default: `{}`)
   */
  static createCompendium<T extends CompendiumCollection.DocumentName>(
    this: abstract new (...args: never) => CompendiumCollection<NoInfer<T>>,
    metadata: CompendiumCollection.CreateCompendiumMetadata<T>,
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
   * @param configuration - The object of compendium settings to define (default: `{}`)
   * @returns A Promise which resolves once the setting is updated
   */
  configure(configuration?: CompendiumCollection.Configuration): Promise<void>;

  /**
   * Delete an existing world-level Compendium Collection.
   * This action may only be performed for world-level packs by a Gamemaster User.
   */
  deleteCompendium(): Promise<this>;

  /**
   * Duplicate a compendium pack to the current World.
   * @param label - A new Compendium label
   */
  duplicateCompendium({ label }?: CompendiumCollection.DuplicateCompendiumOptions): Promise<this>;

  /**
   * Migrate a compendium pack.
   * This operation re-saves all documents within the compendium pack to disk, applying the current data model.
   * If the document type has system data, the latest system data template will also be applied to all documents.
   */
  migrate(options?: CompendiumCollection.MigrateOptions): Promise<this>;

  // Note(LukeAbby): The override for `updateAll` and `_onModifyContents` become unreasonably long and don't add any changes and so has been omitted.

  override render(force?: boolean, options?: foundry.appv1.api.Application.Options | ApplicationV2.RenderOptions): void;

  /**
   * Handle changes to the world compendium configuration setting.
   * @remarks As the setting's {@linkcode foundry.helpers.ClientSettings.SettingConfig.onChange | onChange} function, this gets passed the new value after
   * it's been cleaned and validated by the field in `ClientSettings##cleanJSON`
   */
  protected static _onConfigure(config: CompendiumCollection.StoredConfiguration): void;

  #CompendiumCollection: true;
}

declare namespace CompendiumCollection {
  interface Any extends CompendiumCollection<DocumentName> {}

  type DocumentName = CONST.COMPENDIUM_DOCUMENT_TYPES;

  /** @internal */
  type _OwnershipChoices = (keyof typeof CONST.DOCUMENT_OWNERSHIP_LEVELS)[];

  interface OwnershipFieldSchema extends fields.DataSchema {
    GAMEMASTER: fields.StringField<{ required: true; choices: ["OWNER"]; initial: "OWNER" }>;
    ASSISTANT: fields.StringField<{ required: true; choices: _OwnershipChoices; initial: "OWNER" }>;
    TRUSTED: fields.StringField<{ required: true; choices: _OwnershipChoices; initial: "INHERIT" }>;
    PLAYER: fields.StringField<{ required: true; choices: _OwnershipChoices; initial: "INHERIT" }>;
  }

  interface ConfigSettingElementSchema extends fields.DataSchema {
    /**
     * @defaultValue `undefined`
     * @remarks The `id` of the folder this is in in the {@linkcode foundry.applications.sidebar.apps.Compendium | Compendium directory}.
     * `undefined` and `null` should behave
     */
    folder: fields.StringField<{
      required: false;
      blank: false;
      nullable: true;
      validate: (value: unknown) => boolean;
    }>;

    /** @remarks Integer sort value, for if this pack is either not in a folder, or is in one set to manual sort */
    sort: fields.NumberField<{
      required: false;
      nullable: false;
      integer: true;
      min: 0;
      initial: undefined;
    }>;

    /** @remarks Is the compendium edit lock engaged? */
    locked: fields.BooleanField<{ required: false; initial: undefined }>;

    ownership: fields.SchemaField<OwnershipFieldSchema, { required: false; initial: undefined }>;
  }

  interface StoredConfiguration extends fields.SchemaField.InitializedData<ConfigSettingElementSchema> {}

  /** @remarks The partial'd interface for passing to {@linkcode CompendiumCollection.configure}, if you want the stored interface see {@linkcode CompendiumCollection.StoredConfiguration} */
  interface Configuration extends InexactPartial<StoredConfiguration> {}

  type SettingFieldElement = fields.SchemaField<ConfigSettingElementSchema>;

  type SettingField = fields.TypedObjectField<SettingFieldElement>;

  interface SettingData
    extends fields.TypedObjectField.InitializedType<SettingFieldElement, fields.TypedObjectField.DefaultOptions> {}

  /** @remarks Currently unused due to {@link https://github.com/foundryvtt/foundryvtt/issues/13354} */
  type OwnershipData = NonNullable<SettingData["ownership"]>;

  // The type that's passed to `createCompendium`.
  interface CreateCompendiumMetadata<Type extends DocumentName> {
    type: Type;
    label: string;
    name?: string | undefined;
  }

  // The type that's passed to `new CompendiumCollection(...)`
  interface ConstructorMetadata<Type extends CompendiumCollection.DocumentName> extends Metadata<Type> {
    index: IndexTypeForMetadata<Type>;
  }

  /** The type that appears in `compendium.metadata` after initialization. */
  // Note that the `Omit` is because `delete metadata.index` and `delete metadata.folder` is called.
  // This also deletes in `game.data` since its passed uncloned.
  interface Metadata<Type extends CompendiumCollection.DocumentName = CompendiumCollection.DocumentName>
    extends Omit<Game.Data.Pack, "index" | "folder"> {
    type: Type;
    label: string;

    /**
     * @remarks `undefined` is replaced with the default `CONFIG[this.metadata.type]?.compendiumBanner`
     * but `null` passes through unchanged.
     */
    banner?: string | null | undefined;
    name: string;

    flags: Record<string, never>; // created by the server, but always empty and no way to change it in a way that is s
    ownership: foundry.packages.BasePackage.OwnershipRecord;
    path: string;
  }

  interface GetIndexOptions<Type extends DocumentName> {
    /**
     * An array of fields to return as part of the index
     * @defaultValue `[]`
     */
    fields?: (keyof Document.SourceForName<Type>)[];
  }

  // TODO: Improve automatic index properties based on document type
  // TODO(LukeAbby): Switch to `Document.StoredSourceForName`.
  // Investigate why the `DeepPartial` too
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

  /** @internal */
  interface _ImportAllOptions {
    /**
     * An existing Folder _id to use.
     * @defaultValue `null`
     */
    folderId: string | null;

    /**
     * A new Folder name to create.
     * @defaultValue `""`
     */
    folderName: string;
  }

  /**
   * The interface for passing to {@linkcode CompendiumCollection.importAll | CompendiumCollection#importAll}.
   *
   * @remarks Needs to be a type here because `CreateDocumentsOperationForName` doesn't have statically known keys
   */
  type ImportAllOptions<Type extends CompendiumCollection.DocumentName> =
    foundry.documents.abstract.WorldCollection.FromCompendiumOptions &
      Document.Database2.CreateDocumentsOperationForName<Type> &
      InexactPartial<_ImportAllOptions>;

  interface DuplicateCompendiumOptions {
    label?: string | undefined;
  }

  /** @deprecated Use {@linkcode CompendiumCollection.StoredConfiguration} instead. */
  type WorldCompendiumPackConfiguration = CompendiumCollection.StoredConfiguration;

  /** @deprecated Use {@linkcode CompendiumCollection.SettingData} instead. */
  type WorldCompendiumConfiguration = CompendiumCollection.SettingData;

  /** @internal */
  type _MigrateOptions = InexactPartial<{
    /**
     * Display notifications
     * @defaultValue `true`
     */
    notify: boolean;
  }>;

  interface MigrateOptions extends _MigrateOptions {}

  // Note(LukeAbby): One neat possibility for this type would be making something like `type: "foo"`,
  // `type__ne: "foo"`, and `type__in: ["foo", "bar"]` all narrow `system`.
  type Query<Type extends CompendiumCollection.DocumentName> = _Queryify<Document.SourceForName<Type>>;

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

type IndexTypeForMetadata<Type extends CompendiumCollection.DocumentName> = foundry.utils.Collection<
  CompendiumCollection.IndexEntry<Type>
>;

export default CompendiumCollection;
