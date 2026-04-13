import type { MaybeArray } from "#utils";
import type { DataModel, Document } from "#common/abstract/_module.d.mts";
import type { SchemaField } from "#common/data/fields.d.mts";

/**
 * The PlaylistSound Document.
 * Defines the DataSchema and common behaviors for a PlaylistSound which are shared between both client and server.
 */
// Note(LukeAbby): You may wonder why documents don't simply pass the `Parent` generic parameter.
// This pattern evolved from trying to avoid circular loops and even internal tsc errors.
// See: https://gist.github.com/LukeAbby/0d01b6e20ef19ebc304d7d18cef9cc21
declare abstract class BasePlaylistSound extends Document<"PlaylistSound", BasePlaylistSound.Schema, any> {
  /**
   * @param data    - Initial data from which to construct the `BasePlaylistSound`
   * @param context - Construction context options
   *
   * @remarks Constructing `BasePlaylistSound` directly is not advised. The base document classes exist in
   * order to use documents on both the client (i.e. where all your code runs) and behind the scenes
   * on the server to manage document validation and storage.
   *
   * You should use {@linkcode PlaylistSound.implementation | new PlaylistSound.implementation(...)} instead which will give you
   * a system specific implementation of `PlaylistSound`.
   */
  constructor(data: BasePlaylistSound.CreateData, context?: BasePlaylistSound.ConstructionContext);

  /**
   * @defaultValue
   * ```js
   * mergeObject(super.metadata, {
   *   name: "PlaylistSound",
   *   collection: "sounds",
   *   indexed: true,
   *   label: "DOCUMENT.PlaylistSound",
   *   labelPlural: "DOCUMENT.PlaylistSounds",
   *   compendiumIndexFields: ["name", "sort"],
   *   schemaVersion: "13.341",
   *   permissions: {
   *     ...super.metadata.permissions,
   *     create: "OWNER",
   *     update: "OWNER",
   *     delete: "OWNER"
   *   }
   * })
   * ```
   */
  static override metadata: BasePlaylistSound.Metadata;

  static override defineSchema(): BasePlaylistSound.Schema;

  /** @defaultValue `["DOCUMENT", "PLAYLIST_SOUND"]` */
  static override LOCALIZATION_PREFIXES: string[];

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

  override readonly parentCollection: BasePlaylistSound.ParentCollectionName | null;

  override get pack(): string | null;

  static override get implementation(): PlaylistSound.ImplementationClass;

  static override get baseDocument(): typeof BasePlaylistSound;

  static override get collectionName(): BasePlaylistSound.ParentCollectionName;

  static override get documentName(): BasePlaylistSound.Name;

  static override get TYPES(): CONST.BASE_DOCUMENT_TYPE[];

  static override get hasTypeData(): false;

  static override readonly hierarchy: BasePlaylistSound.Hierarchy;

  override parent: BasePlaylistSound.Parent;

  override " fvtt_types_internal_document_parent": BasePlaylistSound.Parent;

  static override createDocuments<Temporary extends boolean | undefined = undefined>(
    data: BasePlaylistSound.CreateInput[],
    operation?: BasePlaylistSound.Database.CreateDocumentsOperation<Temporary>,
  ): Promise<Array<BasePlaylistSound.TemporaryIf<Temporary>>>;

  static override updateDocuments(
    updates: BasePlaylistSound.UpdateInput[],
    operation?: BasePlaylistSound.Database.UpdateManyDocumentsOperation,
  ): Promise<Array<PlaylistSound.Stored>>;

  static override deleteDocuments(
    ids: readonly string[],
    operation?: BasePlaylistSound.Database.DeleteManyDocumentsOperation,
  ): Promise<Array<PlaylistSound.Stored>>;

  static override create<
    Data extends MaybeArray<BasePlaylistSound.CreateInput>,
    Temporary extends boolean | undefined = undefined,
  >(
    data: Data,
    operation?: BasePlaylistSound.Database.CreateDocumentsOperation<Temporary>,
  ): Promise<BasePlaylistSound.CreateReturn<Data, Temporary>>;

  override update(
    data: BasePlaylistSound.UpdateInput,
    operation?: BasePlaylistSound.Database.UpdateOneDocumentOperation,
  ): Promise<this | undefined>;

  override delete(operation?: BasePlaylistSound.Database.DeleteOneDocumentOperation): Promise<this | undefined>;

  /**
   * @privateRemarks `PlaylistSound`s are neither {@link CONST.WORLD_DOCUMENT_TYPES | world documents} (and so have no
   * {@link foundry.Game.collections | world collection}) nor {@link CONST.COMPENDIUM_DOCUMENT_TYPES | compendium documents} (so there's no
   * chance of index entry return), so this always returns `null`
   */
  static override get(documentId: string, operation?: BasePlaylistSound.Database.GetDocumentsOperation): null;

  // `PlaylistSound`s have no embedded collections, so this always returns `null`.
  static override getCollectionName(name: string): null;

  override getFlag<Scope extends BasePlaylistSound.Flags.Scope, Key extends BasePlaylistSound.Flags.Key<Scope>>(
    scope: Scope,
    key: Key,
  ): BasePlaylistSound.Flags.Get<Scope, Key>;

  override setFlag<
    Scope extends BasePlaylistSound.Flags.Scope,
    Key extends BasePlaylistSound.Flags.Key<Scope>,
    Value extends BasePlaylistSound.Flags.Get<Scope, Key>,
  >(scope: Scope, key: Key, value: Value): Promise<this | undefined>;

  override unsetFlag<Scope extends BasePlaylistSound.Flags.Scope, Key extends BasePlaylistSound.Flags.Key<Scope>>(
    scope: Scope,
    key: Key,
  ): Promise<this | undefined>;

  protected override _preCreate(
    data: BasePlaylistSound.CreateData,
    options: BasePlaylistSound.Database.PreCreateOptions,
    user: User.Stored,
  ): Promise<boolean | void>;

  protected override _onCreate(
    data: BasePlaylistSound.CreateData,
    options: BasePlaylistSound.Database.OnCreateOptions,
    userId: string,
  ): void;

  protected static override _preCreateOperation(
    documents: PlaylistSound.Implementation[],
    operation: BasePlaylistSound.Database.PreCreateOperation,
    user: User.Stored,
  ): Promise<boolean | void>;

  protected static override _onCreateOperation(
    documents: PlaylistSound.Stored[],
    operation: BasePlaylistSound.Database.OnCreateOperation,
    user: User.Stored,
  ): Promise<void>;

  protected override _preUpdate(
    changed: BasePlaylistSound.UpdateData,
    options: BasePlaylistSound.Database.PreUpdateOptions,
    user: User.Stored,
  ): Promise<boolean | void>;

  protected override _onUpdate(
    changed: BasePlaylistSound.UpdateData,
    options: BasePlaylistSound.Database.OnUpdateOptions,
    userId: string,
  ): void;

  protected static override _preUpdateOperation(
    documents: PlaylistSound.Stored[],
    operation: BasePlaylistSound.Database.PreUpdateOperation,
    user: User.Stored,
  ): Promise<boolean | void>;

  protected static override _onUpdateOperation(
    documents: PlaylistSound.Stored[],
    operation: BasePlaylistSound.Database.OnUpdateOperation,
    user: User.Stored,
  ): Promise<void>;

  protected override _preDelete(
    options: BasePlaylistSound.Database.PreDeleteOptions,
    user: User.Stored,
  ): Promise<boolean | void>;

  protected override _onDelete(options: BasePlaylistSound.Database.OnDeleteOptions, userId: string): void;

  protected static override _preDeleteOperation(
    documents: PlaylistSound.Stored[],
    operation: BasePlaylistSound.Database.PreDeleteOperation,
    user: User.Stored,
  ): Promise<boolean | void>;

  protected static override _onDeleteOperation(
    documents: PlaylistSound.Stored[],
    operation: BasePlaylistSound.Database.OnDeleteOperation,
    user: User.Stored,
  ): Promise<void>;

  /**
   * @deprecated "The `PlaylistSound._onCreateDocuments` static method is deprecated in favor of
   * {@linkcode PlaylistSound._onCreateOperation}" (since v12, until v14)
   */
  protected static override _onCreateDocuments(
    documents: PlaylistSound.Implementation[],
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    context: BasePlaylistSound.Database.OnCreateDocumentsOperation,
  ): Promise<void>;

  /**
   * @deprecated "The `PlaylistSound._onUpdateDocuments` static method is deprecated in favor of
   * {@linkcode PlaylistSound._onUpdateOperation}" (since v12, until v14)
   */
  protected static override _onUpdateDocuments(
    documents: PlaylistSound.Stored[],
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    context: BasePlaylistSound.Database.OnUpdateDocumentsOperation,
  ): Promise<void>;

  /**
   * @deprecated "The `PlaylistSound._onDeleteDocuments` static method is deprecated in favor of
   * {@linkcode PlaylistSound._onDeleteOperation}" (since v12, until v14)
   */
  protected static override _onDeleteDocuments(
    documents: PlaylistSound.Stored[],
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    context: BasePlaylistSound.Database.OnDeleteDocumentsOperation,
  ): Promise<void>;

  /* DataModel overrides */

  protected static override _schema: SchemaField<BasePlaylistSound.Schema>;

  static override get schema(): SchemaField<BasePlaylistSound.Schema>;

  static override validateJoint(data: BasePlaylistSound.Source): void;

  static override fromSource(
    source: BasePlaylistSound.CreateData,
    context?: DataModel.FromSourceOptions,
  ): PlaylistSound.Implementation;

  static override fromJSON(json: string): PlaylistSound.Implementation;
}

export default BasePlaylistSound;

declare namespace BasePlaylistSound {
  // All types really live in the full document and are mirrored here for convenience
  export import Name = PlaylistSound.Name;
  export import ConstructionContext = PlaylistSound.ConstructionContext;
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  export import ConstructorArgs = PlaylistSound.ConstructorArgs;
  export import Hierarchy = PlaylistSound.Hierarchy;
  export import Metadata = PlaylistSound.Metadata;
  export import Parent = PlaylistSound.Parent;
  export import Descendant = PlaylistSound.Descendant;
  export import DescendantClass = PlaylistSound.DescendantClass;
  export import Embedded = PlaylistSound.Embedded;
  export import ParentCollectionName = PlaylistSound.ParentCollectionName;
  export import CollectionClass = PlaylistSound.CollectionClass;
  export import Collection = PlaylistSound.Collection;
  export import Invalid = PlaylistSound.Invalid;
  export import Source = PlaylistSound.Source;
  export import CreateData = PlaylistSound.CreateData;
  export import CreateInput = PlaylistSound.CreateInput;
  export import CreateReturn = PlaylistSound.CreateReturn;
  export import InitializedData = PlaylistSound.InitializedData;
  export import UpdateData = PlaylistSound.UpdateData;
  export import UpdateInput = PlaylistSound.UpdateInput;
  export import Schema = PlaylistSound.Schema;
  export import Database = PlaylistSound.Database;
  export import TemporaryIf = PlaylistSound.TemporaryIf;
  export import Flags = PlaylistSound.Flags;

  namespace Internal {
    // Note(LukeAbby): The point of this is to give the base class of `PlaylistSound` a name.
    // The expression `CanvasDocumentMixin(BasePlaylistSound)` is more intuitive but it has worse
    // caching, likely due to the majority of tsc's caching working off of names.
    // See https://gist.github.com/LukeAbby/18a928fdc35c5d54dc121ed5dbf412fd.
    interface CanvasDocument extends foundry.documents.abstract.CanvasDocumentMixin.Mix<typeof BasePlaylistSound> {}
    const CanvasDocument: CanvasDocument;
  }
}
