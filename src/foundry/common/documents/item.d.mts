import type { AnyMutableObject, MaybeArray, OverlapsWith } from "#utils";
import type { DataModel, Document } from "#common/abstract/_module.d.mts";
import type { SchemaField } from "#common/data/fields.d.mts";
import type { CompendiumCollection } from "#client/documents/collections/_module.d.mts";

/**
 * The Document definition for an Item.
 * Defines the DataSchema and common behaviors for an Item which are shared between both client and server.
 */
// Note(LukeAbby): You may wonder why documents don't simply pass the `Parent` generic parameter.
// This pattern evolved from trying to avoid circular loops and even internal tsc errors.
// See: https://gist.github.com/LukeAbby/0d01b6e20ef19ebc304d7d18cef9cc21
declare abstract class BaseItem<out SubType extends Item.SubType = Item.SubType> extends Document<
  "Item",
  BaseItem._Schema,
  any
> {
  /**
   * @param data    - Initial data from which to construct the `BaseItem`
   * @param context - Construction context options
   *
   * @remarks Constructing `BaseItem` directly is not advised. The base document classes exist in
   * order to use documents on both the client (i.e. where all your code runs) and behind the scenes
   * on the server to manage document validation and storage.
   *
   * You should use {@linkcode Item.implementation | new Item.implementation(...)} instead which will give you
   * a system specific implementation of `Item`.
   */
  constructor(data: BaseItem.CreateData, context?: BaseItem.ConstructionContext);

  /**
   * @defaultValue
   * ```js
   * mergeObject(super.metadata, {
   *   name: "Item",
   *   collection: "items",
   *   hasTypeData: true,
   *   indexed: true,
   *   compendiumIndexFields: ["_id", "name", "img", "type", "sort", "folder"],
   *   embedded: {ActiveEffect: "effects"},
   *   label: "DOCUMENT.Item",
   *   labelPlural: "DOCUMENT.Items",
   *   permissions: {
   *     create: BaseItem.#canCreate,
   *     delete: "OWNER"
   *   },
   *   schemaVersion: "13.341"
   * })
   * ```
   */
  static override metadata: BaseItem.Metadata;

  static override defineSchema(): BaseItem.Schema;

  /**
   * The default icon used for newly created Item documents
   * @defaultValue `"icons/svg/item-bag.svg"`
   */
  static DEFAULT_ICON: string;

  /**
   * Determine default artwork based on the provided item data.
   * @param itemData - The source item data
   * @returns Candidate item image
   * @remarks Core's implementation does not use `itemData`
   */
  static getDefaultArtwork(itemData?: BaseItem.CreateData): BaseItem.GetDefaultArtworkReturn;

  /** @remarks Calls {@linkcode DocumentStatsField._shimDocument}`(this)` */
  protected override _initialize(options?: Document.InitializeOptions): void;

  override getUserLevel(user?: User.Implementation): CONST.DOCUMENT_OWNERSHIP_LEVELS;

  static override canUserCreate(user: User.Implementation): boolean;

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

  type: SubType;

  /* Document overrides */

  override readonly parentCollection: BaseItem.ParentCollectionName | null;

  static override get implementation(): Item.ImplementationClass;

  static override get baseDocument(): typeof BaseItem;

  static override get collectionName(): BaseItem.ParentCollectionName;

  static override get documentName(): BaseItem.Name;

  static override get TYPES(): BaseItem.SubType[];

  static override get hasTypeData(): true;

  static override readonly hierarchy: BaseItem.Hierarchy;

  override system: BaseItem.SystemOfType<SubType>;

  override parent: BaseItem.Parent;

  override " fvtt_types_internal_document_parent": BaseItem.Parent;

  // `canUserCreate` omitted from template due to actual override above.

  // `getUserLevel` omitted from template due to actual override above.

  override testUserPermission(
    user: User.Implementation,
    permission: Document.ActionPermission,
    options?: Document.TestUserPermissionOptions,
  ): boolean;

  override canUserModify<Action extends Document.Database.OperationAction>(
    user: User.Implementation,
    action: Action,
    data?: Document.CanUserModifyData<"Item", Action>,
  ): boolean;

  static override createDocuments<Temporary extends boolean | undefined = undefined>(
    data: BaseItem.CreateInput[],
    operation?: BaseItem.Database.CreateDocumentsOperation<Temporary>,
  ): Promise<Array<BaseItem.TemporaryIf<Temporary>>>;

  static override updateDocuments(
    updates: BaseItem.UpdateInput[],
    operation?: BaseItem.Database.UpdateManyDocumentsOperation,
  ): Promise<Array<Item.Stored>>;

  static override deleteDocuments(
    ids: readonly string[],
    operation?: BaseItem.Database.DeleteManyDocumentsOperation,
  ): Promise<Array<Item.Stored>>;

  static override create<
    Data extends MaybeArray<BaseItem.CreateInput>,
    Temporary extends boolean | undefined = undefined,
  >(
    data: Data,
    operation?: BaseItem.Database.CreateDocumentsOperation<Temporary>,
  ): Promise<BaseItem.CreateReturn<Data, Temporary>>;

  override update(
    data: BaseItem.UpdateInput,
    operation?: BaseItem.Database.UpdateOneDocumentOperation,
  ): Promise<this | undefined>;

  override delete(operation?: BaseItem.Database.DeleteOneDocumentOperation): Promise<this | undefined>;

  static override get(
    documentId: string,
    operation?: BaseItem.Database.GetDocumentsOperation,
  ): Item.Stored | CompendiumCollection.IndexEntry<"Item"> | null;

  static override getCollectionName<Name extends string>(
    name: OverlapsWith<Name, BaseItem.Embedded.CollectionName>,
  ): BaseItem.Embedded.GetCollectionNameReturn<Name>;

  override getEmbeddedCollection<EmbeddedName extends BaseItem.Embedded.CollectionName>(
    embeddedName: EmbeddedName,
  ): BaseItem.Embedded.CollectionFor<EmbeddedName>;

  override getEmbeddedDocument<
    EmbeddedName extends BaseItem.Embedded.CollectionName,
    Options extends Document.GetEmbeddedDocumentOptions | undefined = undefined,
  >(embeddedName: EmbeddedName, id: string, options?: Options): BaseItem.Embedded.GetReturn<EmbeddedName, Options>;

  override createEmbeddedDocuments<EmbeddedName extends BaseItem.Embedded.Name>(
    embeddedName: EmbeddedName,
    data: Document.CreateDataForName<EmbeddedName>[],
    operation?: Document.Database.CreateDocumentsOperationForName<EmbeddedName>,
  ): Promise<Array<Document.StoredForName<EmbeddedName>>>;

  override updateEmbeddedDocuments<EmbeddedName extends BaseItem.Embedded.Name>(
    embeddedName: EmbeddedName,
    updates: Document.UpdateDataForName<EmbeddedName>[],
    operation?: Document.Database.UpdateManyDocumentsOperationForName<EmbeddedName>,
  ): Promise<Array<Document.StoredForName<EmbeddedName>>>;

  override deleteEmbeddedDocuments<EmbeddedName extends BaseItem.Embedded.Name>(
    embeddedName: EmbeddedName,
    ids: string[],
    operation?: Document.Database.DeleteManyDocumentsOperationForName<EmbeddedName>,
  ): Promise<Array<Document.StoredForName<EmbeddedName>>>;

  override getFlag<Scope extends BaseItem.Flags.Scope, Key extends BaseItem.Flags.Key<Scope>>(
    scope: Scope,
    key: Key,
  ): BaseItem.Flags.Get<Scope, Key>;

  override setFlag<
    Scope extends BaseItem.Flags.Scope,
    Key extends BaseItem.Flags.Key<Scope>,
    Value extends BaseItem.Flags.Get<Scope, Key>,
  >(scope: Scope, key: Key, value: Value): Promise<this | undefined>;

  override unsetFlag<Scope extends BaseItem.Flags.Scope, Key extends BaseItem.Flags.Key<Scope>>(
    scope: Scope,
    key: Key,
  ): Promise<this | undefined>;

  protected override _preCreate(
    data: BaseItem.CreateData,
    options: BaseItem.Database.PreCreateOptions,
    user: User.Stored,
  ): Promise<boolean | void>;

  protected override _onCreate(
    data: BaseItem.CreateData,
    options: BaseItem.Database.OnCreateOptions,
    userId: string,
  ): void;

  protected static override _preCreateOperation(
    documents: Item.Implementation[],
    operation: BaseItem.Database.PreCreateOperation,
    user: User.Stored,
  ): Promise<boolean | void>;

  protected static override _onCreateOperation(
    documents: Item.Stored[],
    operation: BaseItem.Database.OnCreateOperation,
    user: User.Stored,
  ): Promise<void>;

  protected override _preUpdate(
    changed: BaseItem.UpdateData,
    options: BaseItem.Database.PreUpdateOptions,
    user: User.Stored,
  ): Promise<boolean | void>;

  protected override _onUpdate(
    changed: BaseItem.UpdateData,
    options: BaseItem.Database.OnUpdateOptions,
    userId: string,
  ): void;

  protected static override _preUpdateOperation(
    documents: Item.Stored[],
    operation: BaseItem.Database.PreUpdateOperation,
    user: User.Stored,
  ): Promise<boolean | void>;

  protected static override _onUpdateOperation(
    documents: Item.Stored[],
    operation: BaseItem.Database.OnUpdateOperation,
    user: User.Stored,
  ): Promise<void>;

  protected override _preDelete(
    options: BaseItem.Database.PreDeleteOptions,
    user: User.Stored,
  ): Promise<boolean | void>;

  protected override _onDelete(options: BaseItem.Database.OnDeleteOptions, userId: string): void;

  protected static override _preDeleteOperation(
    documents: Item.Stored[],
    operation: BaseItem.Database.PreDeleteOperation,
    user: User.Stored,
  ): Promise<boolean | void>;

  protected static override _onDeleteOperation(
    documents: Item.Stored[],
    operation: BaseItem.Database.OnDeleteOperation,
    user: User.Stored,
  ): Promise<void>;

  /**
   * @deprecated "The `Item._onCreateDocuments` static method is deprecated in favor of
   * {@linkcode Item._onCreateOperation}" (since v12, until v14)
   */
  protected static override _onCreateDocuments(
    documents: Item.Implementation[],
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    context: BaseItem.Database.OnCreateDocumentsOperation,
  ): Promise<void>;

  /**
   * @deprecated "The `Item._onUpdateDocuments` static method is deprecated in favor of
   * {@linkcode Item._onUpdateOperation}" (since v12, until v14)
   */
  protected static override _onUpdateDocuments(
    documents: Item.Stored[],
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    context: BaseItem.Database.OnUpdateDocumentsOperation,
  ): Promise<void>;

  /**
   * @deprecated "The `Item._onDeleteDocuments` static method is deprecated in favor of
   * {@linkcode Item._onDeleteOperation}" (since v12, until v14)
   */
  protected static override _onDeleteDocuments(
    documents: Item.Stored[],
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    context: BaseItem.Database.OnDeleteDocumentsOperation,
  ): Promise<void>;

  /* DataModel overrides */

  protected static override _schema: SchemaField<BaseItem.Schema>;

  static override get schema(): SchemaField<BaseItem.Schema>;

  static override validateJoint(data: BaseItem.Source): void;

  static override fromSource(source: BaseItem.CreateData, context?: DataModel.FromSourceOptions): Item.Implementation;

  static override fromJSON(json: string): Item.Implementation;
}

export default BaseItem;

declare namespace BaseItem {
  // All types really live in the full document and are mirrored here for convenience
  export import Name = Item.Name;
  export import ConstructionContext = Item.ConstructionContext;
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  export import ConstructorArgs = Item.ConstructorArgs;
  export import Hierarchy = Item.Hierarchy;
  export import Metadata = Item.Metadata;
  export import SubType = Item.SubType;
  export import ConfiguredSubType = Item.ConfiguredSubType;
  export import Known = Item.Known;
  export import OfType = Item.OfType;
  export import SystemOfType = Item.SystemOfType;
  export import Parent = Item.Parent;
  export import Descendant = Item.Descendant;
  export import DescendantClass = Item.DescendantClass;
  export import Embedded = Item.Embedded;
  export import ParentCollectionName = Item.ParentCollectionName;
  export import CollectionClass = Item.CollectionClass;
  export import Collection = Item.Collection;
  export import Invalid = Item.Invalid;
  export import Source = Item.Source;
  export import CreateData = Item.CreateData;
  export import CreateInput = Item.CreateInput;
  export import CreateReturn = Item.CreateReturn;
  export import InitializedData = Item.InitializedData;
  export import UpdateData = Item.UpdateData;
  export import UpdateInput = Item.UpdateInput;
  export import Schema = Item.Schema;
  export import Database = Item.Database;
  export import TemporaryIf = Item.TemporaryIf;
  export import Flags = Item.Flags;
  export import GetDefaultArtworkReturn = Item.GetDefaultArtworkReturn;

  namespace Internal {
    // Note(LukeAbby): The point of this is to give the base class of `Item` a name.
    // The expression `ClientDocumentMixin(BaseItem)` is more intuitive but it has worse
    // caching, likely due to the majority of tsc's caching working off of names.
    // See https://gist.github.com/LukeAbby/18a928fdc35c5d54dc121ed5dbf412fd.
    interface ClientDocument extends foundry.documents.abstract.ClientDocumentMixin.Mix<typeof BaseItem> {}
    const ClientDocument: ClientDocument;
  }

  // The document subclasses override `system` anyways.
  // There's no point in doing expensive computation work comparing the base class system.

  /** @internal */
  interface _Schema extends Item.Schema {
    // For performance reasons don't bother calculating the `system` field.
    // This is overridden anyways.
    system: any;
  }
}
