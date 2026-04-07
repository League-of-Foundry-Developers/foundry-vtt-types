import type { AnyMutableObject } from "#utils";
import type { DataModel, Document } from "#common/abstract/_module.d.mts";
import type { DataField, SchemaField } from "../data/fields.d.mts";

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

  protected override _initialize(options?: Document.InitializeOptions): void;

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

  /* Document overrides */

  // Same as Document for now
  protected static override _initializationOrder(): Generator<[string, DataField.Any], void, undefined>;

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

  static createDocuments<Temporary extends boolean | undefined = undefined>(
    data: Array<RollTable.Implementation | BaseRollTable.CreateData> | undefined,
    operation?: Document.Database.CreateOperation<BaseRollTable.Database.Create<Temporary>>,
  ): Promise<Array<BaseRollTable.TemporaryIf<Temporary>>>;

  static updateDocuments(
    updates: BaseRollTable.UpdateData[] | undefined,
    operation?: Document.Database.UpdateDocumentsOperation<BaseRollTable.Database.Update>,
  ): Promise<RollTable.Implementation[]>;

  static deleteDocuments(
    ids: readonly string[] | undefined,
    operation?: Document.Database.DeleteDocumentsOperation<BaseRollTable.Database.Delete>,
  ): Promise<RollTable.Implementation[]>;

  static override create<Temporary extends boolean | undefined = undefined>(
    data: BaseRollTable.CreateData | BaseRollTable.CreateData[],
    operation?: BaseRollTable.Database.CreateOperation<Temporary>,
  ): Promise<BaseRollTable.TemporaryIf<Temporary> | undefined>;

  override update(
    data: BaseRollTable.UpdateData | undefined,
    operation?: BaseRollTable.Database.UpdateOperation,
  ): Promise<this | undefined>;

  override delete(operation?: BaseRollTable.Database.DeleteOperation): Promise<this | undefined>;

  static override get(documentId: string, options?: BaseRollTable.Database.GetOptions): RollTable.Implementation | null;

  static override getCollectionName<CollectionName extends BaseRollTable.Embedded.Name>(
    name: CollectionName,
  ): BaseRollTable.Embedded.CollectionNameOf<CollectionName> | null;

  override getEmbeddedCollection<EmbeddedName extends BaseRollTable.Embedded.CollectionName>(
    embeddedName: EmbeddedName,
  ): BaseRollTable.Embedded.CollectionFor<EmbeddedName>;

  override getEmbeddedDocument<EmbeddedName extends BaseRollTable.Embedded.CollectionName>(
    embeddedName: EmbeddedName,
    id: string,
    options: Document.GetEmbeddedDocumentOptions,
  ): BaseRollTable.Embedded.DocumentFor<EmbeddedName> | undefined;

  override createEmbeddedDocuments<EmbeddedName extends BaseRollTable.Embedded.Name>(
    embeddedName: EmbeddedName,
    data: Document.CreateDataForName<EmbeddedName>[] | undefined,
    operation?: Document.Database.CreateOperationForName<EmbeddedName>,
  ): Promise<Array<Document.StoredForName<EmbeddedName>>>;

  override updateEmbeddedDocuments<EmbeddedName extends BaseRollTable.Embedded.Name>(
    embeddedName: EmbeddedName,
    updates: Document.UpdateDataForName<EmbeddedName>[] | undefined,
    operation?: Document.Database.UpdateOperationForName<EmbeddedName>,
  ): Promise<Array<Document.StoredForName<EmbeddedName>>>;

  override deleteEmbeddedDocuments<EmbeddedName extends BaseRollTable.Embedded.Name>(
    embeddedName: EmbeddedName,
    ids: Array<string>,
    operation?: Document.Database.DeleteOperationForName<EmbeddedName>,
  ): Promise<Array<Document.StoredForName<EmbeddedName>>>;

  override getFlag<Scope extends BaseRollTable.Flags.Scope, Key extends BaseRollTable.Flags.Key<Scope>>(
    scope: Scope,
    key: Key,
  ): BaseRollTable.Flags.Get<Scope, Key>;

  override setFlag<
    Scope extends BaseRollTable.Flags.Scope,
    Key extends BaseRollTable.Flags.Key<Scope>,
    Value extends BaseRollTable.Flags.Get<Scope, Key>,
  >(scope: Scope, key: Key, value: Value): Promise<this>;

  override unsetFlag<Scope extends BaseRollTable.Flags.Scope, Key extends BaseRollTable.Flags.Key<Scope>>(
    scope: Scope,
    key: Key,
  ): Promise<this>;

  protected _preCreate(
    data: BaseRollTable.CreateData,
    options: BaseRollTable.Database.PreCreateOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected _onCreate(
    data: BaseRollTable.CreateData,
    options: BaseRollTable.Database.OnCreateOperation,
    userId: string,
  ): void;

  protected static _preCreateOperation(
    documents: RollTable.Implementation[],
    operation: Document.Database.PreCreateOperationStatic<BaseRollTable.Database.Create>,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static _onCreateOperation(
    documents: RollTable.Implementation[],
    operation: BaseRollTable.Database.Create,
    user: User.Implementation,
  ): Promise<void>;

  protected _preUpdate(
    changed: BaseRollTable.UpdateData,
    options: BaseRollTable.Database.PreUpdateOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected _onUpdate(
    changed: BaseRollTable.UpdateData,
    options: BaseRollTable.Database.OnUpdateOperation,
    userId: string,
  ): void;

  protected static _preUpdateOperation(
    documents: RollTable.Implementation[],
    operation: BaseRollTable.Database.Update,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static _onUpdateOperation(
    documents: RollTable.Implementation[],
    operation: BaseRollTable.Database.Update,
    user: User.Implementation,
  ): Promise<void>;

  protected _preDelete(
    options: BaseRollTable.Database.PreDeleteOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected _onDelete(options: BaseRollTable.Database.OnDeleteOperation, userId: string): void;

  protected static _preDeleteOperation(
    documents: RollTable.Implementation[],
    operation: BaseRollTable.Database.Delete,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static _onDeleteOperation(
    documents: RollTable.Implementation[],
    operation: BaseRollTable.Database.Delete,
    user: User.Implementation,
  ): Promise<void>;

  /**
   * @deprecated since v12, will be removed in v14
   * @remarks "The `Document._onCreateDocuments` static method is deprecated in favor of {@linkcode Document._onCreateOperation | Document._onCreateOperation}"
   */
  protected static _onCreateDocuments(
    documents: RollTable.Implementation[],
    context: Document.ModificationContext<BaseRollTable.Parent>,
  ): Promise<void>;

  /**
   * @deprecated since v12, will be removed in v14
   * @remarks "The `Document._onUpdateDocuments` static method is deprecated in favor of {@linkcode Document._onUpdateOperation | Document._onUpdateOperation}"
   */
  protected static _onUpdateDocuments(
    documents: RollTable.Implementation[],
    context: Document.ModificationContext<BaseRollTable.Parent>,
  ): Promise<void>;

  /**
   * @deprecated since v12, will be removed in v14
   * @remarks "The `Document._onDeleteDocuments` static method is deprecated in favor of {@linkcode Document._onDeleteOperation | Document._onDeleteOperation}"
   */
  protected static _onDeleteDocuments(
    documents: RollTable.Implementation[],
    context: Document.ModificationContext<BaseRollTable.Parent>,
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
  export import Stored = RollTable.Stored;
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
