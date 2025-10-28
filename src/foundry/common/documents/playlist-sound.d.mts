import type DataModel from "../abstract/data.d.mts";
import type Document from "../abstract/document.mts";
import type { DataField, SchemaField } from "../data/fields.d.mts";

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
   * You should use {@link PlaylistSound.implementation | `new PlaylistSound.implementation(...)`} instead which will give you
   * a system specific implementation of `PlaylistSound`.
   */
  constructor(data: PlaylistSound.CreateData, context?: PlaylistSound.ConstructionContext);

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

  // Same as Document for now
  protected static override _initializationOrder(): Generator<[string, DataField.Any], void, undefined>;

  override readonly parentCollection: PlaylistSound.ParentCollectionName | null;

  override readonly pack: string | null;

  static override get implementation(): PlaylistSound.ImplementationClass;

  static override get baseDocument(): typeof BasePlaylistSound;

  static override get collectionName(): PlaylistSound.ParentCollectionName;

  static override get documentName(): PlaylistSound.Name;

  static override get TYPES(): CONST.BASE_DOCUMENT_TYPE[];

  static override get hasTypeData(): undefined;

  static override get hierarchy(): PlaylistSound.Hierarchy;

  override parent: PlaylistSound.Parent;

  static override createDocuments<Temporary extends boolean | undefined = undefined>(
    data: Array<PlaylistSound.Implementation | PlaylistSound.CreateData> | undefined,
    operation?: Document.Database.CreateDocumentsOperation<PlaylistSound.Database.Create<Temporary>>,
  ): Promise<Array<PlaylistSound.TemporaryIf<Temporary>>>;

  static override updateDocuments(
    updates: PlaylistSound.UpdateData[] | undefined,
    operation?: Document.Database.UpdateDocumentsOperation<PlaylistSound.Database.Update>,
  ): Promise<PlaylistSound.Implementation[]>;

  static override deleteDocuments(
    ids: readonly string[] | undefined,
    operation?: Document.Database.DeleteDocumentsOperation<PlaylistSound.Database.Delete>,
  ): Promise<PlaylistSound.Implementation[]>;

  static override create<Temporary extends boolean | undefined = undefined>(
    data: PlaylistSound.CreateData | PlaylistSound.CreateData[],
    operation?: PlaylistSound.Database.CreateOperation<Temporary>,
  ): Promise<PlaylistSound.TemporaryIf<Temporary> | undefined>;

  override update(
    data: PlaylistSound.UpdateData | undefined,
    operation?: PlaylistSound.Database.UpdateOperation,
  ): Promise<this | undefined>;

  override delete(operation?: PlaylistSound.Database.DeleteOperation): Promise<this | undefined>;

  static override get(
    documentId: string,
    options?: PlaylistSound.Database.GetOptions,
  ): PlaylistSound.Implementation | null;

  static override getCollectionName(name: string): null;

  // Same as Document for now
  override traverseEmbeddedDocuments(
    _parentPath?: string,
  ): Generator<[string, Document.AnyChild<this>], void, undefined>;

  override getFlag<Scope extends PlaylistSound.Flags.Scope, Key extends PlaylistSound.Flags.Key<Scope>>(
    scope: Scope,
    key: Key,
  ): PlaylistSound.Flags.Get<Scope, Key>;

  override setFlag<
    Scope extends PlaylistSound.Flags.Scope,
    Key extends PlaylistSound.Flags.Key<Scope>,
    Value extends PlaylistSound.Flags.Get<Scope, Key>,
  >(scope: Scope, key: Key, value: Value): Promise<this>;

  override unsetFlag<Scope extends PlaylistSound.Flags.Scope, Key extends PlaylistSound.Flags.Key<Scope>>(
    scope: Scope,
    key: Key,
  ): Promise<this>;

  protected override _preCreate(
    data: PlaylistSound.CreateData,
    options: PlaylistSound.Database.PreCreateOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected override _onCreate(
    data: PlaylistSound.CreateData,
    options: PlaylistSound.Database.OnCreateOperation,
    userId: string,
  ): void;

  protected static override _preCreateOperation(
    documents: PlaylistSound.Implementation[],
    operation: Document.Database.PreCreateOperationStatic<PlaylistSound.Database.Create>,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static override _onCreateOperation(
    documents: PlaylistSound.Implementation[],
    operation: PlaylistSound.Database.Create,
    user: User.Implementation,
  ): Promise<void>;

  protected override _preUpdate(
    changed: PlaylistSound.UpdateData,
    options: PlaylistSound.Database.PreUpdateOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected override _onUpdate(
    changed: PlaylistSound.UpdateData,
    options: PlaylistSound.Database.OnUpdateOperation,
    userId: string,
  ): void;

  protected static override _preUpdateOperation(
    documents: PlaylistSound.Implementation[],
    operation: PlaylistSound.Database.Update,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static override _onUpdateOperation(
    documents: PlaylistSound.Implementation[],
    operation: PlaylistSound.Database.Update,
    user: User.Implementation,
  ): Promise<void>;

  protected override _preDelete(
    options: PlaylistSound.Database.PreDeleteOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected override _onDelete(options: PlaylistSound.Database.OnDeleteOperation, userId: string): void;

  protected static override _preDeleteOperation(
    documents: PlaylistSound.Implementation[],
    operation: PlaylistSound.Database.Delete,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static override _onDeleteOperation(
    documents: PlaylistSound.Implementation[],
    operation: PlaylistSound.Database.Delete,
    user: User.Implementation,
  ): Promise<void>;

  /**
   * @deprecated since v12, will be removed in v14
   * @remarks "The `Document._onCreateDocuments` static method is deprecated in favor of {@link Document._onCreateOperation | `Document._onCreateOperation`}"
   */
  protected static override _onCreateDocuments(
    documents: PlaylistSound.Implementation[],
    context: Document.ModificationContext<PlaylistSound.Parent>,
  ): Promise<void>;

  /**
   * @deprecated since v12, will be removed in v14
   * @remarks "The `Document._onUpdateDocuments` static method is deprecated in favor of {@link Document._onUpdateOperation | `Document._onUpdateOperation`}"
   */
  protected static override _onUpdateDocuments(
    documents: PlaylistSound.Implementation[],
    context: Document.ModificationContext<PlaylistSound.Parent>,
  ): Promise<void>;

  /**
   * @deprecated since v12, will be removed in v14
   * @remarks "The `Document._onDeleteDocuments` static method is deprecated in favor of {@link Document._onDeleteOperation | `Document._onDeleteOperation`}"
   */
  protected static override _onDeleteDocuments(
    documents: PlaylistSound.Implementation[],
    context: Document.ModificationContext<PlaylistSound.Parent>,
  ): Promise<void>;

  /* DataModel overrides */

  protected static override _schema: SchemaField<PlaylistSound.Schema>;

  static override get schema(): SchemaField<PlaylistSound.Schema>;

  static override validateJoint(data: PlaylistSound.Source): void;

  // options: not null (parameter default only, destructured in super)
  static override fromSource(
    source: PlaylistSound.CreateData,
    context?: DataModel.FromSourceOptions,
  ): PlaylistSound.Implementation;

  static override fromJSON(json: string): PlaylistSound.Implementation;
}

export default BasePlaylistSound;

declare namespace BasePlaylistSound {
  export import Name = PlaylistSound.Name;
  export import ConstructionContext = PlaylistSound.ConstructionContext;
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  export import ConstructorArgs = PlaylistSound.ConstructorArgs;
  export import Hierarchy = PlaylistSound.Hierarchy;
  export import Metadata = PlaylistSound.Metadata;
  export import Parent = PlaylistSound.Parent;
  export import Descendant = PlaylistSound.Descendant;
  export import DescendantClass = PlaylistSound.DescendantClass;
  export import Pack = PlaylistSound.Pack;
  export import Embedded = PlaylistSound.Embedded;
  export import ParentCollectionName = PlaylistSound.ParentCollectionName;
  export import CollectionClass = PlaylistSound.CollectionClass;
  export import Collection = PlaylistSound.Collection;
  export import Invalid = PlaylistSound.Invalid;
  export import Stored = PlaylistSound.Stored;
  export import Source = PlaylistSound.Source;
  export import CreateData = PlaylistSound.CreateData;
  export import InitializedData = PlaylistSound.InitializedData;
  export import UpdateData = PlaylistSound.UpdateData;
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
