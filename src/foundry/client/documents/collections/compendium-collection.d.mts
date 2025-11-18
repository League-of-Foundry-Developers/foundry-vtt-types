import type {
  Coalesce,
  DeepPartial,
  EmptyObject,
  GetKey,
  Identity,
  InexactPartial,
  IntentionalPartial,
  PrettifyType,
  SimpleMerge,
} from "#utils";
import type { fields } from "#client/data/_module.d.mts";
import type Document from "#common/abstract/document.d.mts";
import type { ApplicationV2, DialogV2 } from "#client/applications/api/_module.d.mts";
import type { Application } from "#client/appv1/api/_module.d.mts";
import type { Game } from "#client/_module.d.mts";
import type { SocketInterface } from "#client/helpers/_module.d.mts";
import type { BasePackage } from "#common/packages/_module.d.mts";
import type { DocumentCollection, DirectoryCollectionMixin } from "#client/documents/abstract/_module.d.mts";
import type { CompendiumFolderCollection } from "#client/documents/collections/_module.d.mts";

/** @privateRemarks `AllHooks` only used for links */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { AllHooks } from "#client/hooks.d.mts";

/** @privateRemarks `ClientDocumentMixin` only used for links */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type ClientDocumentMixin from "#client/documents/abstract/client-document.d.mts";

/**
 * A collection of Document objects contained within a specific compendium pack.
 * Each Compendium pack has its own associated instance of the CompendiumCollection class which contains its contents.
 *
 * @see {@linkcode Game.packs | Game#packs}
 */
declare class CompendiumCollection<
  DocumentName extends CompendiumCollection.DocumentName,
> extends DirectoryCollectionMixin(DocumentCollection)<DocumentName> {
  /** @param metadata - The compendium metadata, an object provided by {@linkcode Game.data | game.data} */
  constructor(metadata: CompendiumCollection.ConstructorMetadata<DocumentName>);

  /** The compendium metadata which defines the compendium content and location */
  metadata: CompendiumCollection.Metadata<DocumentName>;

  /** A subsidiary collection which contains the more minimal index of the pack */
  index: IndexTypeForMetadata<DocumentName>;

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

  /**
   * The banner image for this Compendium pack, or the default image for the pack type if no image is set.
   * @remarks `undefined` in the metadata gets converted to `CONFIG[this.metadata.type]?.compendiumBanner`, which might, itself, be `undefined`
   */
  get banner(): string | null | undefined;

  /**
   * A reference to the Application class which provides an interface to interact with this compendium content.
   * @defaultValue {@linkcode foundry.applications.sidebar.apps.Compendium}
   */
  applicationClass: Application.AnyConstructor | ApplicationV2.AnyConstructor;

  /**
   * A subsidiary collection which contains the folders within the pack
   */
  get folders(): CompendiumFolderCollection<DocumentName>;

  /**
   * @remarks One less than in-world, to allow importing a whole compendium under one root folder in the world collection.
   * @defaultValue {@linkcode CONST.FOLDER_MAX_DEPTH}`- 1`
   */
  get maxFolderDepth(): number;

  /**
   * Get the Folder that this Compendium is displayed within
   */
  get folder(): Folder.Stored<"Compendium"> | null;

  /**
   * Assign this CompendiumCollection to be organized within a specific Folder.
   * @param folder - The desired Folder within the World or `null` to clear the folder
   * @returns A promise which resolves once the transaction is complete
   * @remarks Can either pass a `Folder` instance or the ID of one in {@linkcode foundry.Game.folders | game.folders}
   */
  setFolder(folder: Folder.Stored<"Compendium"> | string | null): Promise<void>;

  /**
   * Get the sort order for this Compendium
   */
  get sort(): number;

  protected override _getVisibleTreeContents(): this["index"]["contents"];

  /** Access the compendium configuration data for this pack */
  get config(): CompendiumCollection.StoredConfiguration | EmptyObject;

  override get documentName(): DocumentName;

  /** Track whether the Compendium Collection is locked for editing */
  get locked(): boolean;

  /**
   * The visibility configuration of this compendium pack.
   * @remarks Foundry wants this to be {@linkcode CompendiumCollection.OwnershipData} (omitting the `NONE` key),
   * but due to {@link https://github.com/foundryvtt/foundryvtt/issues/13354}, it's not, currently.
   */
  get ownership(): BasePackage.OwnershipRecord;

  /** Is this Compendium pack visible to the current game User? */
  get visible(): boolean;

  /** A convenience reference to the label which should be used as the title for the Compendium pack. */
  get title(): string;

  /**
   * The index fields which should be loaded for this compendium pack
   * @remarks Contained elements are a concatenation of the document's `metadata.compendiumIndexFields` as well as
   * `CONFIG[documentName].compendiumIndexFields`. They will be in form of dotkeys, e.g `"flags.world.foo"` or `"system.bar"`
   */
  get indexFields(): Set<string>;

  /**
   * Has this Compendium pack been fully indexed?
   */
  get indexed(): boolean;

  override get: DocumentCollection.Methods<DocumentName>["get"];

  override set: DocumentCollection.Methods<DocumentName>["set"];

  override delete: DocumentCollection.Methods<DocumentName>["delete"];

  /**
   * @remarks Since all documents will get flushed at the end of the cache timer anyway, this doesn't clear documents with currently
   * rendered sheets in their {@linkcode ClientDocumentMixin.AnyMixed.apps | #apps}
   */
  override clear(): void;

  /**
   * Load the Compendium index and cache it as the keys and values of the Collection.
   * @param options - Options which customize how the index is created
   */
  getIndex(options?: CompendiumCollection.GetIndexOptions): Promise<this["index"]>;

  /**
   * Get a single Document from this Compendium by ID.
   * The document may already be locally cached, otherwise it is retrieved from the server.
   * @param id - The requested Document `id`
   * @returns The retrieved Document instance
   * @remarks A return of `undefined` is only possible if passing a falsey `id`. If the retrieval fails, returns `null`.
   */
  getDocument(id: string): Promise<Document.StoredForName<DocumentName> | undefined | null>;

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
  getDocuments(query?: CompendiumCollection.Query<DocumentName>): Promise<Document.StoredForName<DocumentName>[]>;

  /**
   * Get the ownership level that a User has for this Compendium pack.
   * @param user - The user being tested (default: {@linkcode Game.user | game.user})
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
    permission: Document.ActionPermission,
    options?: CompendiumCollection.TestUserPermissionOptions,
  ): boolean;

  /**
   * Import a Document into this Compendium Collection.
   * @param document - The existing Document you wish to import
   * @param options  - Additional options which modify how the data is imported.
   * See {@linkcode ClientDocumentMixin.AnyMixed.toCompendium | ClientDocument#toCompendium} (default: `{}`)
   * @returns The imported Document instance
   * @remarks Takes either the primary document type of this compendium or a `Folder` of the appropriate type.
   */
  importDocument<Doc extends CompendiumCollection.DocOrFolder<DocumentName>>(
    document: Doc,
    options?: ClientDocument.ToCompendiumOptions,
  ): Promise<CompendiumCollection.ImportDocumentReturn<Doc> | undefined>;

  /**
   * Import a Folder into this Compendium Collection.
   * @param folder  - The existing Folder you wish to import
   * @param options - Additional options which modify how the data is imported.
   */
  importFolder(folder: Folder.Stored<DocumentName>, options?: CompendiumCollection.ImportFolderOptions): Promise<void>;

  /**
   * Import an array of Folders into this Compendium Collection.
   * @param folders - The existing Folders you wish to import
   * @param options - Additional options which modify how the data is imported.
   */
  importFolders(
    folders: Folder.Stored<DocumentName>[],
    options?: CompendiumCollection.ImportFoldersOptions,
  ): Promise<void>;

  /**
   * Fully import the contents of a Compendium pack into a World folder.
   * @param options - Options which modify the import operation. Additional options are forwarded to {@linkcode WorldCollection.fromCompendium | WorldCollection#fromCompendium} and {@linkcode Document.createDocuments} (default: `{}`)
   * @returns The imported Documents, now existing within the World
   */
  importAll(
    options?: CompendiumCollection.ImportAllOptions<DocumentName>,
  ): Promise<Document.StoredForName<DocumentName>[]>;

  /**
   * Provide a dialog form that prompts the user to import the full contents of a Compendium pack into the World.
   * @param options - Additional options passed to the DialogV2.confirm method (default: `{}`)
   * @returns A promise which resolves in the following ways: an array of imported Documents if the "yes" button was pressed,
   * false if the "no" button was pressed, or null if the dialog was closed without making a choice.
   */
  importDialog<Options extends CompendiumCollection.ImportDialogOptions | undefined = undefined>(
    options?: Options,
  ): Promise<CompendiumCollection.ImportDialogReturn<DocumentName, Options>>;

  /**
   * Add a Document to the index, capturing it's relevant index attributes
   * @param document - The document to index
   */
  indexDocument(document: Document.StoredForName<DocumentName>): void;

  /**
   * Prompt the gamemaster with a dialog to configure ownership of this Compendium pack.
   * @returns The configured ownership for the pack
   * @privateRemarks Always returns `this.ownership`, not the dialog return
   */
  configureOwnershipDialog(): Promise<BasePackage.OwnershipRecord>;

  /**
   * Activate the Socket event listeners used to receive responses to compendium management events.
   * @param socket - The active game socket.
   * @internal
   */
  static _activateSocketListeners(socket: io.Socket): void;

  /**
   * Create a new Compendium Collection using provided metadata.
   * @param metadata - The compendium metadata used to create the new pack
   * @param options  - Additional options which modify the Compendium creation request (default: `{}`)
   */
  static createCompendium<Type extends CompendiumCollection.DocumentName>(
    this: abstract new (...args: never) => CompendiumCollection<NoInfer<Type>>,
    metadata: CompendiumCollection.CreateCompendiumMetadata<Type>,
    options?: CompendiumCollection.ManageCompendiumSocketOptions,
  ): Promise<CompendiumCollection<Type>>;

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
   * @remarks Passing explicit `undefined` for any key of `configuration` will remove it from the stored config, reverting to default
   * handling for that property.
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

  override updateAll(
    transformation: DocumentCollection.Transformation<DocumentName>,
    condition?: ((obj: Document.StoredForName<DocumentName>) => boolean) | null,
    options?: DocumentCollection.UpdateAllOperation<DocumentName>,
  ): Promise<Document.StoredForName<DocumentName>[]>;

  /** @privateRemarks Fake type override, see {@linkcode DocumentCollection.search | DocumentCollection#search} */
  override search(search: DocumentCollection.SearchOptions): CompendiumCollection.IndexEntry<DocumentName>[];

  override render(force?: boolean, options?: DocumentCollection.RenderOptions): void;

  /** @remarks Calls the {@linkcode AllHooks.updateCompendium | updateCompendium} hook via `callAll` */
  override _onModifyContents<Action extends Document.Database2.OperationAction>(
    action: Action,
    documents: Document.StoredForName<DocumentName>[],
    result: Collection.OnModifyContentsResult<DocumentName, Action>,
    operation: Collection.OnModifyContentsOperation<DocumentName, Action>,
    user: User.Stored,
  ): void;

  /**
   * Handle changes to the world compendium configuration setting.
   * @remarks As the setting's {@linkcode foundry.helpers.ClientSettings.SettingConfig.onChange | onChange} function,
   * this gets passed the new value after it's been cleaned and validated by the field in `ClientSettings##cleanJSON`
   */
  protected static _onConfigure(config: CompendiumCollection.SettingData): void;

  #CompendiumCollection: true;
}

declare namespace CompendiumCollection {
  interface Any extends AnyCompendiumCollection {}
  interface AnyConstructor extends Identity<typeof AnyCompendiumCollection> {}

  // No `Implementation`, packs are always created by direct calls to `new CompendiumCollection`

  type DocumentName = CONST.COMPENDIUM_DOCUMENT_TYPES;

  type DocOrFolder<DocumentName extends CompendiumCollection.DocumentName> =
    | Document.ImplementationFor<DocumentName>
    | Folder.OfType<DocumentName>;

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
     * @defaultValue `null`
     *  @remarks The `id` of the folder this is in in the
     * {@linkcode foundry.applications.sidebar.tabs.CompendiumDirectory | Compendium directory}. `undefined` and `null` should behave
     * identically.
     */
    folder: fields.StringField<{
      required: true;
      blank: false;
      nullable: true;
      validate: typeof foundry.data.validators.isValidId;
    }>;

    /** @remarks Integer sort value, for if this pack is either not in a folder, or is in one set to manual sort */
    sort: fields.NumberField<{
      required: false;
      nullable: false;
      integer: true;
      min: 0;
      initial: undefined;
    }>;

    /**
     * @defaultValue `undefined`
     * @remarks Is the compendium edit lock engaged?
     */
    locked: fields.BooleanField<{ required: false; initial: undefined }>;

    /** @defaultValue `undefined` */
    ownership: fields.SchemaField<OwnershipFieldSchema, { required: false; initial: undefined }>;
  }

  interface StoredConfiguration extends fields.SchemaField.InitializedData<ConfigSettingElementSchema> {}

  /**
   * @remarks The partialed interface for passing to {@linkcode CompendiumCollection.configure | CompendiumCollection#configure},
   * if you want the stored interface see {@linkcode CompendiumCollection.StoredConfiguration}
   */
  interface Configuration extends DeepPartial<StoredConfiguration> {}

  type SettingFieldElement = fields.SchemaField<ConfigSettingElementSchema>;

  type SettingField = fields.TypedObjectField<SettingFieldElement>;

  interface SettingData
    extends fields.TypedObjectField.InitializedType<SettingFieldElement, fields.TypedObjectField.DefaultOptions> {}

  /** @remarks Currently (13.351) unused due to {@link https://github.com/foundryvtt/foundryvtt/issues/13354} */
  type OwnershipData = NonNullable<SettingData["ownership"]>;

  /**
   * Minimal metadata required for {@linkcode CompendiumCollection.createCompendium} calls.
   *
   * @remarks `IntentionalPartial` instead of `Inexact` because it's going over the socket, so `undefined`-value keys get dropped.
   * Only `type` and `label` are required, with `name` being a slugified `label` if not passed. Other than those keys, only `flags`
   * and `ownership` are respected and not replaced by the server.
   *
   */
  interface CreateCompendiumMetadata<Type extends CompendiumCollection.DocumentName = CompendiumCollection.DocumentName>
    extends Pick<Metadata<Type>, "type" | "label">,
      Pick<IntentionalPartial<Metadata<Type>>, "name" | "flags" | "ownership"> {}

  /**
   * The type that's passed to `new CompendiumCollection(...)`
   *
   * @privateRemarks Construction technically doesn't error with only `type`, `index`, and `folders`, but that doesn't produce an actually
   * valid pack. This type represents the data the server will be providing when construction happens, which users will never do directly.
   */
  interface ConstructorMetadata<Type extends CompendiumCollection.DocumentName = CompendiumCollection.DocumentName>
    extends Metadata<Type> {
    /**
     * @remarks The precomputed index sent from the server.
     *
     * @privateRemarks Omitted in {@linkcode Metadata} and re-added here with more specificity.
     * See {@linkcode Game.Data.Pack.index}.
     */
    index: CompendiumCollection.IndexEntry<Type>[];

    /**
     * Source data for any folders inside the `CompendiumCollection`
     *
     * @privateRemarks Removed in {@linkcode Metadata} and re-added here in lieu of larger refactor.
     * See {@linkcode Game.Data.Pack.folders}.
     */
    // TODO: Should eventually be `Folder.StoredSource<Type>[]`
    folders: Folder.Source[];
  }

  /**
   * The type that appears in `compendium.metadata` after initialization.
   * @privateRemarks Note that the `Omit` is because `delete metadata.index` and `delete metadata.folders` are called during construction.
   * This also deletes in `game.data` since its passed uncloned.
   */
  interface Metadata<Type extends CompendiumCollection.DocumentName = CompendiumCollection.DocumentName>
    extends Omit<Game.Data.Pack, "index" | "folders"> {
    type: Type;
  }

  interface GetIndexOptions {
    /**
     * An array of fields to return as part of the index
     * @defaultValue `[]`
     */
    // TODO: Should really be `DotKeys<keyof Document.SourceForName<Type>>[]` here but that explodes the class with errors about union size,
    // TODO: so for now we just allow anything.
    fields?: string[] | undefined;
  }

  // TODO: Improve automatic index properties based on document type
  // TODO(LukeAbby): Switch to `Document.StoredSourceForName`.
  // Investigate why the `DeepPartial` too
  type IndexEntry<Type extends DocumentName> = { _id: string; uuid: string } & DeepPartial<
    Document.SourceForName<Type>
  >;

  type ImportDocumentReturn<Doc extends DocOrFolder<CompendiumCollection.DocumentName>> =
    Doc extends Folder.Implementation
      ? Folder.Stored<Doc["type"]>
      : Doc extends Document.Any
        ? Document.StoredForName<Doc["documentName"]>
        : never;

  type ForDocument<Name extends DocumentName> = Name extends unknown ? CompendiumCollection<Name> : never;

  type ManageCompendiumAction = "create" | "delete" | "migrate";

  type ManageCompendiumData<
    Action extends ManageCompendiumAction,
    Type extends CompendiumCollection.DocumentName = CompendiumCollection.DocumentName,
  > =
    | (Action extends "create" ? CreateCompendiumMetadata<Type> : never)
    | (Action extends "delete" | "migrate" ? string : never);

  interface ManageCompendiumRequest<
    Action extends ManageCompendiumAction = ManageCompendiumAction,
    Type extends CompendiumCollection.DocumentName = CompendiumCollection.DocumentName,
  > extends SocketInterface.SocketRequest {
    /** The request action. */
    action: ManageCompendiumAction;

    /**
     * The compendium creation data, or the ID of the compendium to delete.
     * @remarks Also the ID for `migrate` actions, not just `delete`.
     */
    data: ManageCompendiumData<Action, Type>;

    /** Additional options. */
    options?: ManageCompendiumSocketOptions;
  }

  type ManageCompendiumResult<Action extends ManageCompendiumAction, Type extends CompendiumCollection.DocumentName> =
    | (Action extends "create" ? ConstructorMetadata<Type> : never)
    | (Action extends "delete" | "migrate" ? string : never);

  interface ManageCompendiumResponse<
    Action extends ManageCompendiumAction = ManageCompendiumAction,
    Type extends CompendiumCollection.DocumentName = CompendiumCollection.DocumentName,
  > extends SocketInterface.SocketResponse {
    /** @remarks "manageCompendium" socket returns always include this key */
    userId: string;

    /** The original request. */
    request: ManageCompendiumRequest<Action, Type>;

    /**
     * The compendium creation data, or the collection name of the deleted compendium.
     * @remarks `migrate` calls do not return a socket response, so the above is accurate.
     */
    result: ManageCompendiumResult<Action, Type>;
  }

  /**
   * `IntentionalPartial` because this goes over the socket, where `undefined`-value keys get dropped. This type can't be folded into
   * {@linkcode ManageCompendiumSocketOptions}; doing so causes errors about lack of index signature where
   * {@linkcode ManageCompendiumRequest} extends {@linkcode SocketInterface.Request}.
   * @internal
   */
  type _ManageCompendiumSocketOptions = IntentionalPartial<{
    /**
     * @remarks {@linkcode CompendiumCollection.duplicateCompendium | CompendiumCollection#duplicateCompendium} passes
     * {@linkcode CompendiumCollection.collection | this.collection} when calling {@linkcode CompendiumCollection.createCompendium}.
     */
    source: string;
  }>;

  /**
   * The interface for {@linkcode ManageCompendiumRequest.options}.
   *
   * @remarks If this were more complicated on the server side, we'd split this up into `CreateOptions`, `DeleteOptions`, and
   * `MigrateOptions` (one for each {@linkcode ManageCompendiumAction}), but as of 13.351 the only valid `options` key for any operation is
   * {@linkcode ManageCompendiumSocketOptions.source | source} for `create`, with `delete` using no options and `migrate` only taking an
   * `onProgress` function that wouldn't survive the socket and {@linkcode MigrateOptions.notify | notify} which, since `migrate` operations
   * don't return a response (inferred by reading the {@linkcode CompendiumCollection._activateSocketListeners} body), and it has no effect
   * server-side, is pointless to allow.
   */
  interface ManageCompendiumSocketOptions extends _ManageCompendiumSocketOptions {}

  interface TestUserPermissionOptions extends Document._TestUserPermissionsOptions {}

  /**
   * Used in {@linkcode ImportFolderOptions} and {@linkcode ImportFoldersOptions}.
   * @internal
   */
  type _ImportParents = InexactPartial<{
    /**
     * Import any parent folders which are not already present in the Compendium
     * @defaultValue `true`
     */
    importParents: boolean;
  }>;

  interface ImportFolderOptions extends _ImportParents {}

  interface ImportFoldersOptions extends _ImportParents {}

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
   * @remarks The same options object is passed to {@linkcode WorldCollection.fromCompendium | WorldCompendium#fromCompendium} and
   * {@linkcode Document.createDocuments | documentClass.createDocuments}, after having `folderId` and `folderName` pulled out.
   *
   * @privateRemarks Needs to be a type here because `CreateDocumentsOperationForName` doesn't have statically known keys
   */
  type ImportAllOptions<Type extends CompendiumCollection.DocumentName> =
    foundry.documents.abstract.WorldCollection.FromCompendiumOptions &
      Document.Database2.CreateDocumentsOperationForName<Type> &
      InexactPartial<_ImportAllOptions>;

  /** @internal */
  type _ImportDialogOptions = InexactPartial<{
    /**
     * @remarks Should the `Keep ID` checkbox start checked or not ?
     * @defaultValue `false`
     */
    keepId: boolean;
  }>;

  interface ImportDialogOptions extends DialogV2.ConfirmConfig, _ImportDialogOptions {}

  type ImportDialogReturn<
    DocumentName extends CompendiumCollection.DocumentName,
    PassedConfig extends DialogV2.ConfirmConfig | undefined,
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  > = _ImportDialogReturn<DocumentName, Coalesce<PassedConfig, {}>>;

  type _ImportDialogReturn<
    DocumentName extends CompendiumCollection.DocumentName,
    PassedConfig extends DialogV2.ConfirmConfig,
  > = DialogV2.ConfirmReturn<
    SimpleMerge<
      PassedConfig,
      {
        yes: SimpleMerge<
          { callback: (event: Event) => Promise<Document.StoredForName<DocumentName>[]> },
          // eslint-disable-next-line @typescript-eslint/no-empty-object-type
          GetKey<PassedConfig, "yes", {}>
        >;
      }
    >
  >;

  interface DuplicateCompendiumOptions {
    /** A new Compendium label */
    label?: string | undefined;
  }

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

  /** @deprecated Use {@linkcode CompendiumCollection.StoredConfiguration} instead. This type will be removed in v14. */
  type WorldCompendiumPackConfiguration = CompendiumCollection.StoredConfiguration;

  /** @deprecated Use {@linkcode CompendiumCollection.SettingData} instead. This type will be removed in v14. */
  type WorldCompendiumConfiguration = CompendiumCollection.SettingData;
}

export default CompendiumCollection;

type IsComparable<T> = T extends boolean | string | number | bigint | symbol | null | undefined ? true : false;

type IndexTypeForMetadata<Type extends CompendiumCollection.DocumentName> = Collection<
  CompendiumCollection.IndexEntry<Type>
>;

declare abstract class AnyCompendiumCollection extends CompendiumCollection<CompendiumCollection.DocumentName> {
  constructor(...args: never);
}
