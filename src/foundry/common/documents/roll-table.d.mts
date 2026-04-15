import type { AnyMutableObject, MaybeArray, OverlapsWith } from "#utils";
import type { DataModel, Document } from "#common/abstract/_module.d.mts";
import type { SchemaField } from "#common/data/fields.d.mts";
import type { CompendiumCollection } from "#client/documents/collections/_module.d.mts";

/**
 * The RollTable Document.
 * Defines the DataSchema and common behaviors for a RollTable which are shared between both client and server.
 */
// Note(LukeAbby): You may wonder why documents don't simply pass the `Parent` generic parameter.
// This pattern evolved from trying to avoid circular loops and even internal tsc errors.
// See: https://gist.github.com/LukeAbby/0d01b6e20ef19ebc304d7d18cef9cc21
declare abstract class BaseRollTable extends Document<"RollTable", BaseRollTable.Schema, any> {
  /**
   * @param data    - Initial data from which to construct the `BaseRollTable`
   * @param context - Construction context options
   *
   * @remarks Constructing `BaseRollTable` directly is not advised. The base document classes exist in
   * order to use documents on both the client (i.e. where all your code runs) and behind the scenes
   * on the server to manage document validation and storage.
   *
   * You should use {@linkcode RollTable.implementation | new RollTable.implementation(...)} instead which will give you
   * a system specific implementation of the `RollTable` document.
   */
  constructor(data: BaseRollTable.CreateData, context?: BaseRollTable.ConstructionContext);

  /**
   * @defaultValue
   * ```js
   * mergeObject(super.metadata, {
   *   name: "RollTable",
   *   collection: "tables",
   *   indexed: true,
   *   compendiumIndexFields: ["_id", "name", "description", "img", "sort", "folder"],
   *   embedded: {TableResult: "results"},
   *   label: "DOCUMENT.RollTable",
   *   labelPlural: "DOCUMENT.RollTables",
   *   schemaVersion: "13.341"
   * })
   * ```
   */
  static override metadata: BaseRollTable.Metadata;

  /** @defaultValue `["DOCUMENT", "TABLE"]` */
  static override LOCALIZATION_PREFIXES: string[];

  /**
   * The default icon used for newly created Macro documents
   * @defaultValue `"icons/svg/d20-grey.svg"`
   * @remarks "Macro" comes from foundry's comment
   */
  static DEFAULT_ICON: string;

  static override defineSchema(): BaseRollTable.Schema;

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

  readonly parentCollection: BaseRollTable.ParentCollectionName | null;

  override get pack(): string | null;

  static override get implementation(): RollTable.ImplementationClass;

  static override get baseDocument(): typeof BaseRollTable;

  static override get collectionName(): BaseRollTable.ParentCollectionName;

  static override get documentName(): BaseRollTable.Name;

  static override get TYPES(): CONST.BASE_DOCUMENT_TYPE[];

  static override get hasTypeData(): false;

  static override readonly hierarchy: BaseRollTable.Hierarchy;

  override parent: BaseRollTable.Parent;

  override " fvtt_types_internal_document_parent": BaseRollTable.Parent;

  static override canUserCreate(user: User.Implementation): boolean;

  override getUserLevel(user?: User.Implementation): CONST.DOCUMENT_OWNERSHIP_LEVELS;

  override testUserPermission(
    user: User.Implementation,
    permission: Document.ActionPermission,
    options?: Document.TestUserPermissionOptions,
  ): boolean;

  override canUserModify<Action extends Document.Database.OperationAction>(
    user: User.Implementation,
    action: Action,
    data?: Document.CanUserModifyData<"RollTable", Action>,
  ): boolean;

  static override createDocuments<Temporary extends boolean | undefined = undefined>(
    data: BaseRollTable.CreateInput[],
    operation?: BaseRollTable.Database.CreateDocumentsOperation<Temporary>,
  ): Promise<Array<BaseRollTable.TemporaryIf<Temporary>>>;

  static override updateDocuments(
    updates: BaseRollTable.UpdateInput[],
    operation?: BaseRollTable.Database.UpdateManyDocumentsOperation,
  ): Promise<Array<RollTable.Stored>>;

  static override deleteDocuments(
    ids: readonly string[],
    operation?: BaseRollTable.Database.DeleteManyDocumentsOperation,
  ): Promise<Array<RollTable.Stored>>;

  static override create<
    Data extends MaybeArray<BaseRollTable.CreateInput>,
    Temporary extends boolean | undefined = undefined,
  >(
    data: Data,
    operation?: BaseRollTable.Database.CreateDocumentsOperation<Temporary>,
  ): Promise<BaseRollTable.CreateReturn<Data, Temporary>>;

  override update(
    data: BaseRollTable.UpdateInput,
    operation?: BaseRollTable.Database.UpdateOneDocumentOperation,
  ): Promise<this | undefined>;

  override delete(operation?: BaseRollTable.Database.DeleteOneDocumentOperation): Promise<this | undefined>;

  static override get(
    documentId: string,
    operation?: BaseRollTable.Database.GetDocumentsOperation,
  ): RollTable.Stored | CompendiumCollection.IndexEntry<"RollTable"> | null;

  static override getCollectionName<Name extends string>(
    name: OverlapsWith<Name, BaseRollTable.Embedded.CollectionName>,
  ): BaseRollTable.Embedded.GetCollectionNameReturn<Name>;

  override getEmbeddedCollection<EmbeddedName extends BaseRollTable.Embedded.CollectionName>(
    embeddedName: EmbeddedName,
  ): BaseRollTable.Embedded.CollectionFor<EmbeddedName>;

  override getEmbeddedDocument<
    EmbeddedName extends BaseRollTable.Embedded.CollectionName,
    Options extends Document.GetEmbeddedDocumentOptions | undefined = undefined,
  >(embeddedName: EmbeddedName, id: string, options?: Options): BaseRollTable.Embedded.GetReturn<EmbeddedName, Options>;

  override createEmbeddedDocuments<EmbeddedName extends BaseRollTable.Embedded.Name>(
    embeddedName: EmbeddedName,
    data: Document.CreateDataForName<EmbeddedName>[],
    operation?: Document.Database.CreateDocumentsOperationForName<EmbeddedName>,
  ): Promise<Array<Document.StoredForName<EmbeddedName>>>;

  override updateEmbeddedDocuments<EmbeddedName extends BaseRollTable.Embedded.Name>(
    embeddedName: EmbeddedName,
    updates: Document.UpdateDataForName<EmbeddedName>[],
    operation?: Document.Database.UpdateManyDocumentsOperationForName<EmbeddedName>,
  ): Promise<Array<Document.StoredForName<EmbeddedName>>>;

  override deleteEmbeddedDocuments<EmbeddedName extends BaseRollTable.Embedded.Name>(
    embeddedName: EmbeddedName,
    ids: string[],
    operation?: Document.Database.DeleteManyDocumentsOperationForName<EmbeddedName>,
  ): Promise<Array<Document.StoredForName<EmbeddedName>>>;

  override getFlag<Scope extends BaseRollTable.Flags.Scope, Key extends BaseRollTable.Flags.Key<Scope>>(
    scope: Scope,
    key: Key,
  ): BaseRollTable.Flags.Get<Scope, Key>;

  override setFlag<
    Scope extends BaseRollTable.Flags.Scope,
    Key extends BaseRollTable.Flags.Key<Scope>,
    Value extends BaseRollTable.Flags.Get<Scope, Key>,
  >(scope: Scope, key: Key, value: Value): Promise<this | undefined>;

  override unsetFlag<Scope extends BaseRollTable.Flags.Scope, Key extends BaseRollTable.Flags.Key<Scope>>(
    scope: Scope,
    key: Key,
  ): Promise<this | undefined>;

  protected override _preCreate(
    data: BaseRollTable.CreateData,
    options: BaseRollTable.Database.PreCreateOptions,
    user: User.Stored,
  ): Promise<boolean | void>;

  protected override _onCreate(
    data: BaseRollTable.CreateData,
    options: BaseRollTable.Database.OnCreateOptions,
    userId: string,
  ): void;

  protected static override _preCreateOperation(
    documents: RollTable.Implementation[],
    operation: BaseRollTable.Database.PreCreateOperation,
    user: User.Stored,
  ): Promise<boolean | void>;

  protected static override _onCreateOperation(
    documents: RollTable.Stored[],
    operation: BaseRollTable.Database.OnCreateOperation,
    user: User.Stored,
  ): Promise<void>;

  protected override _preUpdate(
    changed: BaseRollTable.UpdateData,
    options: BaseRollTable.Database.PreUpdateOptions,
    user: User.Stored,
  ): Promise<boolean | void>;

  protected override _onUpdate(
    changed: BaseRollTable.UpdateData,
    options: BaseRollTable.Database.OnUpdateOptions,
    userId: string,
  ): void;

  protected static override _preUpdateOperation(
    documents: RollTable.Stored[],
    operation: BaseRollTable.Database.PreUpdateOperation,
    user: User.Stored,
  ): Promise<boolean | void>;

  protected static override _onUpdateOperation(
    documents: RollTable.Stored[],
    operation: BaseRollTable.Database.OnUpdateOperation,
    user: User.Stored,
  ): Promise<void>;

  protected override _preDelete(
    options: BaseRollTable.Database.PreDeleteOptions,
    user: User.Stored,
  ): Promise<boolean | void>;

  protected override _onDelete(options: BaseRollTable.Database.OnDeleteOptions, userId: string): void;

  protected static override _preDeleteOperation(
    documents: RollTable.Stored[],
    operation: BaseRollTable.Database.PreDeleteOperation,
    user: User.Stored,
  ): Promise<boolean | void>;

  protected static override _onDeleteOperation(
    documents: RollTable.Stored[],
    operation: BaseRollTable.Database.OnDeleteOperation,
    user: User.Stored,
  ): Promise<void>;

  /**
   * @deprecated "The `RollTable._onCreateDocuments` static method is deprecated in favor of
   * {@linkcode RollTable._onCreateOperation}" (since v12, until v14)
   */
  protected static override _onCreateDocuments(
    documents: RollTable.Implementation[],
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    context: BaseRollTable.Database.OnCreateDocumentsOperation,
  ): Promise<void>;

  /**
   * @deprecated "The `RollTable._onUpdateDocuments` static method is deprecated in favor of
   * {@linkcode RollTable._onUpdateOperation}" (since v12, until v14)
   */
  protected static override _onUpdateDocuments(
    documents: RollTable.Stored[],
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    context: BaseRollTable.Database.OnUpdateDocumentsOperation,
  ): Promise<void>;

  /**
   * @deprecated "The `RollTable._onDeleteDocuments` static method is deprecated in favor of
   * {@linkcode RollTable._onDeleteOperation}" (since v12, until v14)
   */
  protected static override _onDeleteDocuments(
    documents: RollTable.Stored[],
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    context: BaseRollTable.Database.OnDeleteDocumentsOperation,
  ): Promise<void>;

  /* DataModel overrides */

  protected static _schema: SchemaField<BaseRollTable.Schema>;

  static get schema(): SchemaField<BaseRollTable.Schema>;

  /** @remarks Not actually overridden, still a no-op, typed for ease of subclassing */
  static validateJoint(data: BaseRollTable.Source): void;

  static override fromSource(
    source: BaseRollTable.CreateData,
    context?: DataModel.FromSourceOptions,
  ): RollTable.Implementation;

  static override fromJSON(json: string): RollTable.Implementation;
}

export default BaseRollTable;

declare namespace BaseRollTable {
  // All types really live in the full document and are mirrored here for convenience
  export import Name = RollTable.Name;
  export import ConstructionContext = RollTable.ConstructionContext;
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  export import ConstructorArgs = RollTable.ConstructorArgs;
  export import Hierarchy = RollTable.Hierarchy;
  export import Metadata = RollTable.Metadata;
  export import Parent = RollTable.Parent;
  export import Descendant = RollTable.Descendant;
  export import DescendantClass = RollTable.DescendantClass;
  export import Embedded = RollTable.Embedded;
  export import ParentCollectionName = RollTable.ParentCollectionName;
  export import CollectionClass = RollTable.CollectionClass;
  export import Collection = RollTable.Collection;
  export import Invalid = RollTable.Invalid;
  export import Source = RollTable.Source;
  export import CreateData = RollTable.CreateData;
  export import CreateInput = RollTable.CreateInput;
  export import CreateReturn = RollTable.CreateReturn;
  export import InitializedData = RollTable.InitializedData;
  export import UpdateData = RollTable.UpdateData;
  export import UpdateInput = RollTable.UpdateInput;
  export import Schema = RollTable.Schema;
  export import Database = RollTable.Database;
  export import TemporaryIf = RollTable.TemporaryIf;
  export import Flags = RollTable.Flags;

  namespace Internal {
    // Note(LukeAbby): The point of this is to give the base class of `RollTable` a name.
    // The expression `ClientDocumentMixin(BaseRollTable)` is more intuitive but it has worse
    // caching, likely due to the majority of tsc's caching working off of names.
    // See https://gist.github.com/LukeAbby/18a928fdc35c5d54dc121ed5dbf412fd.
    interface ClientDocument extends foundry.documents.abstract.ClientDocumentMixin.Mix<typeof BaseRollTable> {}
    const ClientDocument: ClientDocument;
  }
}
