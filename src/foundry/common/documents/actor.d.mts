import type { AnyMutableObject, MaybeArray } from "#utils";
import type { DataModel, Document } from "#common/abstract/_module.d.mts";
import type { SchemaField } from "#common/data/fields.d.mts";
import type { CompendiumCollection } from "#client/documents/collections/_module.d.mts";

/**
 * The Actor Document.
 * Defines the DataSchema and common behaviors for an Actor which are shared between both client and server.
 */
// Note(LukeAbby): You may wonder why documents don't simply pass the `Parent` generic parameter.
// This pattern evolved from trying to avoid circular loops and even internal tsc errors.
// See: https://gist.github.com/LukeAbby/0d01b6e20ef19ebc304d7d18cef9cc21
declare abstract class BaseActor<out SubType extends BaseActor.SubType = BaseActor.SubType> extends Document<
  "Actor",
  BaseActor._Schema,
  any
> {
  /**
   * @param data    - Initial data from which to construct the `BaseActor`
   * @param context - Construction context options
   *
   * @remarks Constructing `BaseActor` directly is not advised. The base document classes exist in
   * order to use documents on both the client (i.e. where all your code runs) and behind the scenes
   * on the server to manage document validation and storage.
   *
   * You should use {@linkcode Actor.implementation | new Actor.implementation(...)} instead which will give you
   * a system specific implementation of `Actor`.
   */
  constructor(data: BaseActor.CreateData, context?: BaseActor.ConstructionContext);

  /**
   * @defaultValue
   * ```js
   * mergeObject(super.metadata, {
   *   name: "Actor",
   *   collection: "actors",
   *   indexed: true,
   *   compendiumIndexFields: ["_id", "name", "img", "type", "sort", "folder"],
   *   embedded: {ActiveEffect: "effects", Item: "items"},
   *   hasTypeData: true,
   *   label: "DOCUMENT.Actor",
   *   labelPlural: "DOCUMENT.Actors",
   *   permissions: {
   *     create: this.#canCreate,
   *     update: this.#canUpdate
   *   },
   *   schemaVersion: "13.341"
   * })
   * ```
   */
  static override metadata: BaseActor.Metadata;

  static override defineSchema(): BaseActor.Schema;

  /**
   * The default icon used for newly created Actor documents.
   * @defaultValue `CONST.DEFAULT_TOKEN`
   */
  static DEFAULT_ICON: string;

  /**
   * Determine default artwork based on the provided actor data
   * @param actorData - The source actor data
   * @remarks Core's implementation does not use `actorData`
   */
  static getDefaultArtwork(actorData?: BaseActor.CreateData): BaseActor.GetDefaultArtworkReturn;

  protected override _initializeSource(
    data: BaseActor.CreateData | this,
    options?: Document.InitializeSourceOptions,
  ): BaseActor.Source;

  protected override _initialize(options?: Document.InitializeOptions): void;

  static override canUserCreate(user: User.Implementation): boolean;

  protected override _preCreate(
    data: BaseActor.CreateData,
    options: BaseActor.Database.PreCreateOptions,
    user: User.Stored,
  ): Promise<boolean | void>;

  protected override _preUpdate(
    changed: BaseActor.UpdateData,
    options: BaseActor.Database.PreUpdateOptions,
    user: User.Stored,
  ): Promise<boolean | void>;

  /**
   * @remarks
   * Migrations:
   * - `flags.core.sourceId` to `_stats.compendiumSource` (since v12, no specified end)
   */
  static override migrateData(source: AnyMutableObject): AnyMutableObject;

  /** @remarks `source` instead of the parent's `data` here */
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

  type: SubType;

  /* Document overrides */

  override readonly parentCollection: BaseActor.ParentCollectionName | null;

  override get pack(): string | null;

  static override get implementation(): Actor.ImplementationClass;

  static override get baseDocument(): typeof BaseActor;

  static override get collectionName(): BaseActor.ParentCollectionName;

  static override get documentName(): BaseActor.Name;

  static override get TYPES(): BaseActor.SubType[];

  static override get hasTypeData(): true;

  static override readonly hierarchy: BaseActor.Hierarchy;

  override system: BaseActor.SystemOfType<SubType>;

  override parent: BaseActor.Parent;

  override " fvtt_types_internal_document_parent": BaseActor.Parent;

  // `canUserCreate` omitted from template due to actual override above.

  override getUserLevel(user?: User.Implementation): CONST.DOCUMENT_OWNERSHIP_LEVELS;

  override testUserPermission(
    user: User.Implementation,
    permission: Document.ActionPermission,
    options?: Document.TestUserPermissionOptions,
  ): boolean;

  static override createDocuments<Temporary extends boolean | undefined = undefined>(
    data: BaseActor.CreateInput[],
    operation?: Document.Database.CreateOperation<BaseActor.Database.Create<Temporary>>,
  ): Promise<Array<BaseActor.TemporaryIf<Temporary>>>;

  static override updateDocuments(
    updates: BaseActor.UpdateInput[],
    operation?: Document.Database.UpdateDocumentsOperation<BaseActor.Database.Update>,
  ): Promise<Array<Actor.Stored>>;

  static override deleteDocuments(
    ids: readonly string[],
    operation?: Document.Database.DeleteDocumentsOperation<BaseActor.Database.Delete>,
  ): Promise<Array<Actor.Stored>>;

  static override create<
    Data extends MaybeArray<BaseActor.CreateInput>,
    Temporary extends boolean | undefined = undefined,
  >(
    data: Data,
    operation?: BaseActor.Database.CreateOperation<Temporary>,
  ): Promise<BaseActor.CreateReturn<Data, Temporary>>;

  override update(
    data: BaseActor.UpdateInput,
    operation?: BaseActor.Database.UpdateOperation,
  ): Promise<this | undefined>;

  override delete(operation?: BaseActor.Database.DeleteOperation): Promise<this | undefined>;

  static override get(
    documentId: string,
    operation?: BaseActor.Database.GetOptions,
  ): Actor.Stored | CompendiumCollection.IndexEntry<"Actor"> | null;

  static override getCollectionName<CollectionName extends BaseActor.Embedded.Name>(
    name: CollectionName,
  ): BaseActor.Embedded.CollectionNameOf<CollectionName> | null;

  override getEmbeddedCollection<EmbeddedName extends BaseActor.Embedded.CollectionName>(
    embeddedName: EmbeddedName,
  ): BaseActor.Embedded.CollectionFor<EmbeddedName>;

  override getEmbeddedDocument<EmbeddedName extends BaseActor.Embedded.CollectionName>(
    embeddedName: EmbeddedName,
    id: string,
    options: Document.GetEmbeddedDocumentOptions,
  ): BaseActor.Embedded.DocumentFor<EmbeddedName> | undefined;

  override createEmbeddedDocuments<EmbeddedName extends BaseActor.Embedded.Name>(
    embeddedName: EmbeddedName,
    data: Document.CreateDataForName<EmbeddedName>[] | undefined,
    operation?: Document.Database.CreateOperationForName<EmbeddedName>,
  ): Promise<Array<Document.StoredForName<EmbeddedName>>>;

  override updateEmbeddedDocuments<EmbeddedName extends BaseActor.Embedded.Name>(
    embeddedName: EmbeddedName,
    updates: Document.UpdateDataForName<EmbeddedName>[] | undefined,
    operation?: Document.Database.UpdateOperationForName<EmbeddedName>,
  ): Promise<Array<Document.StoredForName<EmbeddedName>>>;

  override deleteEmbeddedDocuments<EmbeddedName extends BaseActor.Embedded.Name>(
    embeddedName: EmbeddedName,
    ids: Array<string>,
    operation?: Document.Database.DeleteOperationForName<EmbeddedName>,
  ): Promise<Array<Document.StoredForName<EmbeddedName>>>;

  override getFlag<Scope extends BaseActor.Flags.Scope, Key extends BaseActor.Flags.Key<Scope>>(
    scope: Scope,
    key: Key,
  ): BaseActor.Flags.Get<Scope, Key>;

  override setFlag<
    Scope extends BaseActor.Flags.Scope,
    Key extends BaseActor.Flags.Key<Scope>,
    Value extends BaseActor.Flags.Get<Scope, Key>,
  >(scope: Scope, key: Key, value: Value): Promise<this | undefined>;

  override unsetFlag<Scope extends BaseActor.Flags.Scope, Key extends BaseActor.Flags.Key<Scope>>(
    scope: Scope,
    key: Key,
  ): Promise<this | undefined>;

  protected override _onCreate(
    data: BaseActor.CreateData,
    options: BaseActor.Database.OnCreateOperation,
    userId: string,
  ): void;

  protected static override _preCreateOperation(
    documents: Actor.Implementation[],
    operation: Document.Database.PreCreateOperationStatic<BaseActor.Database.Create>,
    user: User.Stored,
  ): Promise<boolean | void>;

  protected static override _onCreateOperation(
    documents: Actor.Stored[],
    operation: BaseActor.Database.Create,
    user: User.Stored,
  ): Promise<void>;

  protected override _onUpdate(
    changed: BaseActor.UpdateData,
    options: BaseActor.Database.OnUpdateOperation,
    userId: string,
  ): void;

  protected static override _preUpdateOperation(
    documents: Actor.Stored[],
    operation: BaseActor.Database.Update,
    user: User.Stored,
  ): Promise<boolean | void>;

  protected static override _onUpdateOperation(
    documents: Actor.Stored[],
    operation: BaseActor.Database.Update,
    user: User.Stored,
  ): Promise<void>;

  protected override _preDelete(
    options: BaseActor.Database.PreDeleteOptions,
    user: User.Stored,
  ): Promise<boolean | void>;

  protected override _onDelete(options: BaseActor.Database.OnDeleteOperation, userId: string): void;

  protected static override _preDeleteOperation(
    documents: Actor.Stored[],
    operation: BaseActor.Database.Delete,
    user: User.Stored,
  ): Promise<boolean | void>;

  protected static override _onDeleteOperation(
    documents: Actor.Stored[],
    operation: BaseActor.Database.Delete,
    user: User.Stored,
  ): Promise<void>;

  /**
   * @deprecated "The `Actor._onCreateDocuments` static method is deprecated in favor of
   * {@linkcode Actor._onCreateOperation}" (since v12, until v14)
   */
  protected static override _onCreateDocuments(
    documents: Actor.Implementation[],
    context: BaseActor.Database.OnCreateDocumentsContext,
  ): Promise<void>;

  /**
   * @deprecated "The `Actor._onUpdateDocuments` static method is deprecated in favor of
   * {@linkcode Actor._onUpdateOperation}" (since v12, until v14)
   */
  protected static override _onUpdateDocuments(
    documents: Actor.Stored[],
    context: BaseActor.Database.OnUpdateDocumentsContext,
  ): Promise<void>;

  /**
   * @deprecated "The `Actor._onDeleteDocuments` static method is deprecated in favor of
   * {@linkcode Actor._onDeleteOperation}" (since v12, until v14)
   */
  protected static override _onDeleteDocuments(
    documents: Actor.Stored[],
    context: BaseActor.Database.OnDeleteDocumentsContext,
  ): Promise<void>;

  /* DataModel overrides */

  protected static override _schema: SchemaField<BaseActor.Schema>;

  static override get schema(): SchemaField<BaseActor.Schema>;

  static override validateJoint(data: BaseActor.Source): void;

  static override fromSource(source: BaseActor.CreateData, context?: DataModel.FromSourceOptions): Actor.Implementation;

  static override fromJSON(json: string): Actor.Implementation;

  static #BaseActor: true;
}

declare namespace BaseActor {
  // All types really live in the full document and are mirrored here for convenience
  export import Name = Actor.Name;
  export import ConstructionContext = Actor.ConstructionContext;
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  export import ConstructorArgs = Actor.ConstructorArgs;
  export import Hierarchy = Actor.Hierarchy;
  export import Metadata = Actor.Metadata;
  export import SubType = Actor.SubType;
  export import ConfiguredSubType = Actor.ConfiguredSubType;
  export import Known = Actor.Known;
  export import OfType = Actor.OfType;
  export import SystemOfType = Actor.SystemOfType;
  export import Parent = Actor.Parent;
  export import Descendant = Actor.Descendant;
  export import DescendantClass = Actor.DescendantClass;
  export import Embedded = Actor.Embedded;
  export import ParentCollectionName = Actor.ParentCollectionName;
  export import CollectionClass = Actor.CollectionClass;
  export import Collection = Actor.Collection;
  export import Invalid = Actor.Invalid;
  export import Source = Actor.Source;
  export import CreateData = Actor.CreateData;
  export import CreateInput = Actor.CreateInput;
  export import CreateReturn = Actor.CreateReturn;
  export import InitializedData = Actor.InitializedData;
  export import UpdateData = Actor.UpdateData;
  export import UpdateInput = Actor.UpdateInput;
  export import Schema = Actor.Schema;
  export import Database = Actor.Database;
  export import TemporaryIf = Actor.TemporaryIf;
  export import Flags = Actor.Flags;
  export import GetDefaultArtworkReturn = Actor.GetDefaultArtworkReturn;
  export import GetDefaultArtworkTextureReturn = Actor.GetDefaultArtworkTextureReturn;

  namespace Internal {
    // Note(LukeAbby): The point of this is to give the base class of `Actor` a name.
    // The expression `ClientDocumentMixin(BaseActor)` is more intuitive but it has worse
    // caching, likely due to the majority of tsc's caching working off of names.
    // See https://gist.github.com/LukeAbby/18a928fdc35c5d54dc121ed5dbf412fd.
    interface ClientDocument extends foundry.documents.abstract.ClientDocumentMixin.Mix<typeof BaseActor> {}
    const ClientDocument: ClientDocument;
  }

  // The document subclasses override `system` anyways.
  // There's no point in doing expensive computation work comparing the base class system.

  /** @internal */
  interface _Schema extends Actor.Schema {
    // For performance reasons don't bother calculating the `system` field.
    // This is overridden anyways.
    system: any;
  }
}

export default BaseActor;
