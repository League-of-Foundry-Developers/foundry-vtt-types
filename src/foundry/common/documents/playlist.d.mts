import type { AnyMutableObject, MaybeArray, OverlapsWith } from "#utils";
import type DataModel from "../abstract/data.d.mts";
import type Document from "../abstract/document.mts";
import type { SchemaField } from "../data/fields.d.mts";
import type { CompendiumCollection } from "#client/documents/collections/_module.d.mts";

/**
 * The Playlist Document.
 * Defines the DataSchema and common behaviors for a Playlist which are shared between both client and server.
 */
// Note(LukeAbby): You may wonder why documents don't simply pass the `Parent` generic parameter.
// This pattern evolved from trying to avoid circular loops and even internal tsc errors.
// See: https://gist.github.com/LukeAbby/0d01b6e20ef19ebc304d7d18cef9cc21
declare abstract class BasePlaylist extends Document<"Playlist", BasePlaylist.Schema, any> {
  /**
   * @param data    - Initial data from which to construct the `BasePlaylist`
   * @param context - Construction context options
   *
   * @remarks Constructing `BasePlaylist` directly is not advised. The base document classes exist in
   * order to use documents on both the client (i.e. where all your code runs) and behind the scenes
   * on the server to manage document validation and storage.
   *
   * You should use {@link Playlist.implementation | `new Playlist.implementation(...)`} instead which will give you
   * a system specific implementation of `Playlist`.
   */
  constructor(data: Playlist.CreateData, context?: Playlist.ConstructionContext);

  /**
   * @defaultValue
   * ```js
   * mergeObject(super.metadata, {
   *   name: "Playlist",
   *   collection: "playlists",
   *   indexed: true,
   *   compendiumIndexFields: ["_id", "name", "description", "sort", "folder"],
   *   embedded: {PlaylistSound: "sounds"},
   *   label: "DOCUMENT.Playlist",
   *   labelPlural: "DOCUMENT.Playlists",
   *   permissions: {
   *     create: "PLAYLIST_CREATE",
   *     delete: "OWNER"
   *   },
   *   schemaVersion: "13.341"
   * }
   * ```
   */
  static override metadata: BasePlaylist.Metadata;

  static override defineSchema(): BasePlaylist.Schema;

  /** @defaultValue `["DOCUMENT", "PLAYLIST"]` */
  static override LOCALIZATION_PREFIXES: string[];

  /** @remarks Calls {@linkcode DocumentStatsField._shimDocument}`(this)` */
  protected override _initialize(options?: Document.InitializeOptions): void;

  /** @remarks Calls {@linkcode DocumentStatsField._migrateData}`(this, source)` */
  static override migrateData(source: AnyMutableObject): AnyMutableObject;

  /** @remarks Calls {@linkcode DocumentStatsField._shimData}`(this, source, options)` */
  static override shimData(source: AnyMutableObject, options?: DataModel.ShimDataOptions): AnyMutableObject;

  /*
   * After this point these are not really overridden methods.
   * They are here because Foundry's documents are complex and have lots of edge cases.
   * There are DRY ways of representing this but this ends up being harder to understand
   * for end users extending these functions, especially for static methods. There are also a
   * number of methods that don't make sense to call directly on `Document` like `createDocuments`,
   * as there is no data that can safely construct every possible document. Finally keeping definitions
   * separate like this helps against circularities.
   */

  /* Document overrides */

  override readonly parentCollection: BasePlaylist.ParentCollectionName | null;

  override get pack(): string | null;

  static override get implementation(): Playlist.ImplementationClass;

  static override get baseDocument(): typeof BasePlaylist;

  static override get collectionName(): BasePlaylist.ParentCollectionName;

  static override get documentName(): BasePlaylist.Name;

  static override get TYPES(): CONST.BASE_DOCUMENT_TYPE[];

  static override get hasTypeData(): false;

  static override get hierarchy(): BasePlaylist.Hierarchy;

  override parent: BasePlaylist.Parent;

  static override createDocuments<Temporary extends boolean | undefined = undefined>(
    data: BasePlaylist.CreateInput[],
    operation?: BasePlaylist.Database.CreateDocumentsOperation<Temporary>,
  ): Promise<Array<BasePlaylist.TemporaryIf<Temporary>>>;

  static override updateDocuments(
    updates: BasePlaylist.UpdateInput[],
    operation?: BasePlaylist.Database.UpdateManyDocumentsOperation,
  ): Promise<Array<Playlist.Stored>>;

  static override deleteDocuments(
    ids: readonly string[],
    operation?: BasePlaylist.Database.DeleteManyDocumentsOperation,
  ): Promise<Array<Playlist.Stored>>;

  static override create<
    Data extends MaybeArray<BasePlaylist.CreateInput>,
    Temporary extends boolean | undefined = undefined,
  >(
    data: Data,
    operation?: BasePlaylist.Database.CreateDocumentsOperation<Temporary>,
  ): Promise<BasePlaylist.CreateReturn<Data, Temporary>>;

  override update(
    data: BasePlaylist.UpdateInput,
    operation?: BasePlaylist.Database.UpdateOneDocumentOperation,
  ): Promise<this | undefined>;

  override delete(operation?: BasePlaylist.Database.DeleteOneDocumentOperation): Promise<this | undefined>;

  static override get(
    documentId: string,
    operation?: BasePlaylist.Database.GetDocumentsOperation,
  ): Playlist.Stored | CompendiumCollection.IndexEntry<"Playlist"> | null;

  static override getCollectionName<Name extends string>(
    name: OverlapsWith<Name, BasePlaylist.Embedded.CollectionName>,
  ): BasePlaylist.Embedded.GetCollectionNameReturn<Name>;

  override getEmbeddedCollection<EmbeddedName extends BasePlaylist.Embedded.CollectionName>(
    embeddedName: EmbeddedName,
  ): BasePlaylist.Embedded.CollectionFor<EmbeddedName>;

  override getEmbeddedDocument<
    EmbeddedName extends BasePlaylist.Embedded.CollectionName,
    Options extends Document.GetEmbeddedDocumentOptions | undefined = undefined,
  >(embeddedName: EmbeddedName, id: string, options?: Options): BasePlaylist.Embedded.GetReturn<EmbeddedName, Options>;

  override createEmbeddedDocuments<EmbeddedName extends BasePlaylist.Embedded.Name>(
    embeddedName: EmbeddedName,
    data: Document.CreateDataForName<EmbeddedName>[],
    operation?: Document.Database.CreateDocumentsOperationForName<EmbeddedName>,
  ): Promise<Array<Document.StoredForName<EmbeddedName>>>;

  override updateEmbeddedDocuments<EmbeddedName extends BasePlaylist.Embedded.Name>(
    embeddedName: EmbeddedName,
    updates: Document.UpdateDataForName<EmbeddedName>[],
    operation?: Document.Database.UpdateManyDocumentsOperationForName<EmbeddedName>,
  ): Promise<Array<Document.StoredForName<EmbeddedName>>>;

  override deleteEmbeddedDocuments<EmbeddedName extends BasePlaylist.Embedded.Name>(
    embeddedName: EmbeddedName,
    ids: string[],
    operation?: Document.Database.DeleteManyDocumentsOperationForName<EmbeddedName>,
  ): Promise<Array<Document.StoredForName<EmbeddedName>>>;

  override getFlag<Scope extends BasePlaylist.Flags.Scope, Key extends BasePlaylist.Flags.Key<Scope>>(
    scope: Scope,
    key: Key,
  ): BasePlaylist.Flags.Get<Scope, Key>;

  override setFlag<
    Scope extends BasePlaylist.Flags.Scope,
    Key extends BasePlaylist.Flags.Key<Scope>,
    Value extends BasePlaylist.Flags.Get<Scope, Key>,
  >(scope: Scope, key: Key, value: Value): Promise<this | undefined>;

  override unsetFlag<Scope extends BasePlaylist.Flags.Scope, Key extends BasePlaylist.Flags.Key<Scope>>(
    scope: Scope,
    key: Key,
  ): Promise<this | undefined>;

  protected override _preCreate(
    data: BasePlaylist.CreateData,
    options: BasePlaylist.Database.PreCreateOptions,
    user: User.Stored,
  ): Promise<boolean | void>;

  protected override _onCreate(
    data: BasePlaylist.CreateData,
    options: BasePlaylist.Database.OnCreateOptions,
    userId: string,
  ): void;

  protected static override _preCreateOperation(
    documents: Playlist.Implementation[],
    operation: BasePlaylist.Database.PreCreateOperation,
    user: User.Stored,
  ): Promise<boolean | void>;

  protected static override _onCreateOperation(
    documents: Playlist.Stored[],
    operation: BasePlaylist.Database.OnCreateOperation,
    user: User.Stored,
  ): Promise<void>;

  protected override _preUpdate(
    changed: BasePlaylist.UpdateData,
    options: BasePlaylist.Database.PreUpdateOptions,
    user: User.Stored,
  ): Promise<boolean | void>;

  protected override _onUpdate(
    changed: BasePlaylist.UpdateData,
    options: BasePlaylist.Database.OnUpdateOptions,
    userId: string,
  ): void;

  protected static override _preUpdateOperation(
    documents: Playlist.Stored[],
    operation: BasePlaylist.Database.PreUpdateOperation,
    user: User.Stored,
  ): Promise<boolean | void>;

  protected static override _onUpdateOperation(
    documents: Playlist.Stored[],
    operation: BasePlaylist.Database.OnUpdateOperation,
    user: User.Stored,
  ): Promise<void>;

  protected override _preDelete(
    options: BasePlaylist.Database.PreDeleteOptions,
    user: User.Stored,
  ): Promise<boolean | void>;

  protected override _onDelete(options: BasePlaylist.Database.OnDeleteOptions, userId: string): void;

  protected static override _preDeleteOperation(
    documents: Playlist.Stored[],
    operation: BasePlaylist.Database.PreDeleteOperation,
    user: User.Stored,
  ): Promise<boolean | void>;

  protected static override _onDeleteOperation(
    documents: Playlist.Stored[],
    operation: BasePlaylist.Database.OnDeleteOperation,
    user: User.Stored,
  ): Promise<void>;

  /**
   * @deprecated "The `Document._onCreateDocuments` static method is deprecated in favor of {@linkcode Document._onCreateOperation}"
   * (since v12, until v14)
   */
  protected static override _onCreateDocuments(
    documents: Playlist.Implementation[],
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    context: BasePlaylist.Database.OnCreateDocumentsOperation,
  ): Promise<void>;

  /**
   * @deprecated "The `Document._onUpdateDocuments` static method is deprecated in favor of {@linkcode Document._onUpdateOperation}"
   * (since v12, until v14)
   */
  protected static override _onUpdateDocuments(
    documents: Playlist.Stored[],
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    context: BasePlaylist.Database.OnUpdateDocumentsOperation,
  ): Promise<void>;

  /**
   * @deprecated "The `Document._onDeleteDocuments` static method is deprecated in favor of {@linkcode Document._onDeleteOperation}"
   * (since v12, until v14)
   */
  protected static override _onDeleteDocuments(
    documents: Playlist.Stored[],
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    context: BasePlaylist.Database.OnDeleteDocumentsOperation,
  ): Promise<void>;

  /* DataModel overrides */

  protected static override _schema: SchemaField<BasePlaylist.Schema>;

  static override get schema(): SchemaField<BasePlaylist.Schema>;

  static override validateJoint(data: BasePlaylist.Source): void;

  static override fromSource(
    source: BasePlaylist.CreateData,
    context?: DataModel.FromSourceOptions,
  ): Playlist.Implementation;

  static override fromJSON(json: string): Playlist.Implementation;
}

export default BasePlaylist;

declare namespace BasePlaylist {
  // All types really live in the full document and are mirrored here for convenience
  export import Name = Playlist.Name;
  export import ConstructionContext = Playlist.ConstructionContext;
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  export import ConstructorArgs = Playlist.ConstructorArgs;
  export import Hierarchy = Playlist.Hierarchy;
  export import Metadata = Playlist.Metadata;
  export import Parent = Playlist.Parent;
  export import Descendant = Playlist.Descendant;
  export import DescendantClass = Playlist.DescendantClass;
  export import Pack = Playlist.Pack;
  export import Embedded = Playlist.Embedded;
  export import ParentCollectionName = Playlist.ParentCollectionName;
  export import CollectionClass = Playlist.CollectionClass;
  export import Collection = Playlist.Collection;
  export import Invalid = Playlist.Invalid;
  export import Source = Playlist.Source;
  export import CreateData = Playlist.CreateData;
  export import CreateInput = Playlist.CreateInput;
  export import CreateReturn = Playlist.CreateReturn;
  export import InitializedData = Playlist.InitializedData;
  export import UpdateData = Playlist.UpdateData;
  export import UpdateInput = Playlist.UpdateInput;
  export import Schema = Playlist.Schema;
  export import Database = Playlist.Database;
  export import TemporaryIf = Playlist.TemporaryIf;
  export import Flags = Playlist.Flags;

  namespace Internal {
    // Note(LukeAbby): The point of this is to give the base class of `Playlist` a name.
    // The expression `ClientDocumentMixin(BasePlaylist)` is more intuitive but it has worse
    // caching, likely due to the majority of tsc's caching working off of names.
    // See https://gist.github.com/LukeAbby/18a928fdc35c5d54dc121ed5dbf412fd.
    interface ClientDocument extends foundry.documents.abstract.ClientDocumentMixin.Mix<typeof BasePlaylist> {}
    const ClientDocument: ClientDocument;
  }
}
