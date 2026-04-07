import type { AnyMutableObject } from "#utils";
import type { DataModel, Document } from "#common/abstract/_module.d.mts";
import type { SchemaField } from "#common/data/fields.d.mts";

/**
 * The JournalEntry Document.
 * Defines the DataSchema and common behaviors for a JournalEntry which are shared between both client and server.
 */
// Note(LukeAbby): You may wonder why documents don't simply pass the `Parent` generic parameter.
// This pattern evolved from trying to avoid circular loops and even internal tsc errors.
// See: https://gist.github.com/LukeAbby/0d01b6e20ef19ebc304d7d18cef9cc21
declare abstract class BaseJournalEntry extends Document<"JournalEntry", BaseJournalEntry.Schema, any> {
  /**
   * @param data    - Initial data from which to construct the `BaseJournalEntry`
   * @param context - Construction context options
   *
   * @remarks Constructing `BaseJournalEntry` directly is not advised. The base document classes exist in
   * order to use documents on both the client (i.e. where all your code runs) and behind the scenes
   * on the server to manage document validation and storage.
   *
   * You should use {@linkcode JournalEntry.implementation | new JournalEntry.implementation(...)} instead which will give you
   * a system specific implementation of `JournalEntry`.
   */
  constructor(data: BaseJournalEntry.CreateData, context?: BaseJournalEntry.ConstructionContext);

  /**
   * @defaultValue
   * ```js
   * mergeObject(super.metadata, {
   *   name: "JournalEntry",
   *   collection: "journal",
   *   indexed: true,
   *   compendiumIndexFields: ["_id", "name", "sort", "folder"],
   *   embedded: {
   *     JournalEntryCategory: "categories",
   *     JournalEntryPage: "pages"
   *   },
   *   label: "DOCUMENT.JournalEntry",
   *   labelPlural: "DOCUMENT.JournalEntries",
   *   permissions: {
   *     create: "JOURNAL_CREATE",
   *     delete: "OWNER"
   *   },
   *   schemaVersion: "13.341"
   * })
   * ```
   */
  static override metadata: BaseJournalEntry.Metadata;

  static override defineSchema(): BaseJournalEntry.Schema;

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

  override readonly parentCollection: BaseJournalEntry.ParentCollectionName | null;

  override get pack(): string | null;

  static override get implementation(): JournalEntry.ImplementationClass;

  static override get baseDocument(): typeof BaseJournalEntry;

  static override get collectionName(): BaseJournalEntry.ParentCollectionName;

  static override get documentName(): BaseJournalEntry.Name;

  static override get TYPES(): CONST.BASE_DOCUMENT_TYPE[];

  static override get hasTypeData(): false;

  static override readonly hierarchy: BaseJournalEntry.Hierarchy;

  override parent: BaseJournalEntry.Parent;

  override " fvtt_types_internal_document_parent": BaseJournalEntry.Parent;

  static override createDocuments<Temporary extends boolean | undefined = undefined>(
    data: Array<JournalEntry.Implementation | BaseJournalEntry.CreateData> | undefined,
    operation?: Document.Database.CreateOperation<BaseJournalEntry.Database.Create<Temporary>>,
  ): Promise<Array<BaseJournalEntry.TemporaryIf<Temporary>>>;

  static override updateDocuments(
    updates: BaseJournalEntry.UpdateData[] | undefined,
    operation?: Document.Database.UpdateDocumentsOperation<BaseJournalEntry.Database.Update>,
  ): Promise<JournalEntry.Implementation[]>;

  static override deleteDocuments(
    ids: readonly string[] | undefined,
    operation?: Document.Database.DeleteDocumentsOperation<BaseJournalEntry.Database.Delete>,
  ): Promise<JournalEntry.Implementation[]>;

  static override create<Temporary extends boolean | undefined = undefined>(
    data: BaseJournalEntry.CreateData | BaseJournalEntry.CreateData[],
    operation?: BaseJournalEntry.Database.CreateOperation<Temporary>,
  ): Promise<BaseJournalEntry.TemporaryIf<Temporary> | undefined>;

  override update(
    data: BaseJournalEntry.UpdateData | undefined,
    operation?: BaseJournalEntry.Database.UpdateOperation,
  ): Promise<this | undefined>;

  override delete(operation?: BaseJournalEntry.Database.DeleteOperation): Promise<this | undefined>;

  static override get(
    documentId: string,
    options?: BaseJournalEntry.Database.GetOptions,
  ): JournalEntry.Implementation | null;

  static override getCollectionName<CollectionName extends BaseJournalEntry.Embedded.Name>(
    name: CollectionName,
  ): BaseJournalEntry.Embedded.CollectionNameOf<CollectionName> | null;

  override getEmbeddedCollection<EmbeddedName extends BaseJournalEntry.Embedded.CollectionName>(
    embeddedName: EmbeddedName,
  ): BaseJournalEntry.Embedded.CollectionFor<EmbeddedName>;

  override getEmbeddedDocument<EmbeddedName extends BaseJournalEntry.Embedded.CollectionName>(
    embeddedName: EmbeddedName,
    id: string,
    options: Document.GetEmbeddedDocumentOptions,
  ): BaseJournalEntry.Embedded.DocumentFor<EmbeddedName> | undefined;

  override createEmbeddedDocuments<EmbeddedName extends BaseJournalEntry.Embedded.Name>(
    embeddedName: EmbeddedName,
    data: Document.CreateDataForName<EmbeddedName>[] | undefined,
    operation?: Document.Database.CreateOperationForName<EmbeddedName>,
  ): Promise<Array<Document.StoredForName<EmbeddedName>>>;

  override updateEmbeddedDocuments<EmbeddedName extends BaseJournalEntry.Embedded.Name>(
    embeddedName: EmbeddedName,
    updates: Document.UpdateDataForName<EmbeddedName>[] | undefined,
    operation?: Document.Database.UpdateOperationForName<EmbeddedName>,
  ): Promise<Array<Document.StoredForName<EmbeddedName>>>;

  override deleteEmbeddedDocuments<EmbeddedName extends BaseJournalEntry.Embedded.Name>(
    embeddedName: EmbeddedName,
    ids: Array<string>,
    operation?: Document.Database.DeleteOperationForName<EmbeddedName>,
  ): Promise<Array<Document.StoredForName<EmbeddedName>>>;

  override getFlag<Scope extends BaseJournalEntry.Flags.Scope, Key extends BaseJournalEntry.Flags.Key<Scope>>(
    scope: Scope,
    key: Key,
  ): BaseJournalEntry.Flags.Get<Scope, Key>;

  override setFlag<
    Scope extends BaseJournalEntry.Flags.Scope,
    Key extends BaseJournalEntry.Flags.Key<Scope>,
    Value extends BaseJournalEntry.Flags.Get<Scope, Key>,
  >(scope: Scope, key: Key, value: Value): Promise<this>;

  override unsetFlag<Scope extends BaseJournalEntry.Flags.Scope, Key extends BaseJournalEntry.Flags.Key<Scope>>(
    scope: Scope,
    key: Key,
  ): Promise<this>;

  protected override _preCreate(
    data: BaseJournalEntry.CreateData,
    options: BaseJournalEntry.Database.PreCreateOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected override _onCreate(
    data: BaseJournalEntry.CreateData,
    options: BaseJournalEntry.Database.OnCreateOperation,
    userId: string,
  ): void;

  protected static override _preCreateOperation(
    documents: JournalEntry.Implementation[],
    operation: Document.Database.PreCreateOperationStatic<BaseJournalEntry.Database.Create>,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static override _onCreateOperation(
    documents: JournalEntry.Implementation[],
    operation: BaseJournalEntry.Database.Create,
    user: User.Implementation,
  ): Promise<void>;

  protected override _preUpdate(
    changed: BaseJournalEntry.UpdateData,
    options: BaseJournalEntry.Database.PreUpdateOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected override _onUpdate(
    changed: BaseJournalEntry.UpdateData,
    options: BaseJournalEntry.Database.OnUpdateOperation,
    userId: string,
  ): void;

  protected static override _preUpdateOperation(
    documents: JournalEntry.Implementation[],
    operation: BaseJournalEntry.Database.Update,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static override _onUpdateOperation(
    documents: JournalEntry.Implementation[],
    operation: BaseJournalEntry.Database.Update,
    user: User.Implementation,
  ): Promise<void>;

  protected override _preDelete(
    options: BaseJournalEntry.Database.PreDeleteOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected override _onDelete(options: BaseJournalEntry.Database.OnDeleteOperation, userId: string): void;

  protected static override _preDeleteOperation(
    documents: JournalEntry.Implementation[],
    operation: BaseJournalEntry.Database.Delete,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static override _onDeleteOperation(
    documents: JournalEntry.Implementation[],
    operation: BaseJournalEntry.Database.Delete,
    user: User.Implementation,
  ): Promise<void>;

  /**
   * @deprecated since v12, will be removed in v14
   * @remarks "The `Document._onCreateDocuments` static method is deprecated in favor of {@linkcode Document._onCreateOperation | Document._onCreateOperation}"
   */
  protected static override _onCreateDocuments(
    documents: JournalEntry.Implementation[],
    context: Document.ModificationContext<BaseJournalEntry.Parent>,
  ): Promise<void>;

  /**
   * @deprecated since v12, will be removed in v14
   * @remarks "The `Document._onUpdateDocuments` static method is deprecated in favor of {@linkcode Document._onUpdateOperation | Document._onUpdateOperation}"
   */
  protected static override _onUpdateDocuments(
    documents: JournalEntry.Implementation[],
    context: Document.ModificationContext<BaseJournalEntry.Parent>,
  ): Promise<void>;

  /**
   * @deprecated since v12, will be removed in v14
   * @remarks "The `Document._onDeleteDocuments` static method is deprecated in favor of {@linkcode Document._onDeleteOperation | Document._onDeleteOperation}"
   */
  protected static override _onDeleteDocuments(
    documents: JournalEntry.Implementation[],
    context: Document.ModificationContext<BaseJournalEntry.Parent>,
  ): Promise<void>;

  /* DataModel overrides */

  protected static override _schema: SchemaField<BaseJournalEntry.Schema>;

  static override get schema(): SchemaField<BaseJournalEntry.Schema>;

  static override validateJoint(data: BaseJournalEntry.Source): void;

  static override fromSource(
    source: BaseJournalEntry.CreateData,
    context?: DataModel.FromSourceOptions,
  ): JournalEntry.Implementation;

  static override fromJSON(json: string): JournalEntry.Implementation;
}

export default BaseJournalEntry;

declare namespace BaseJournalEntry {
  // All types really live in the full document and are mirrored here for convenience
  export import Name = JournalEntry.Name;
  export import ConstructionContext = JournalEntry.ConstructionContext;
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  export import ConstructorArgs = JournalEntry.ConstructorArgs;
  export import Hierarchy = JournalEntry.Hierarchy;
  export import Metadata = JournalEntry.Metadata;
  export import Parent = JournalEntry.Parent;
  export import Descendant = JournalEntry.Descendant;
  export import DescendantClass = JournalEntry.DescendantClass;
  export import Embedded = JournalEntry.Embedded;
  export import ParentCollectionName = JournalEntry.ParentCollectionName;
  export import CollectionClass = JournalEntry.CollectionClass;
  export import Collection = JournalEntry.Collection;
  export import Invalid = JournalEntry.Invalid;
  export import Stored = JournalEntry.Stored;
  export import Source = JournalEntry.Source;
  export import CreateData = JournalEntry.CreateData;
  export import CreateInput = JournalEntry.CreateInput;
  export import CreateReturn = JournalEntry.CreateReturn;
  export import InitializedData = JournalEntry.InitializedData;
  export import UpdateData = JournalEntry.UpdateData;
  export import UpdateInput = JournalEntry.UpdateInput;
  export import Schema = JournalEntry.Schema;
  export import Database = JournalEntry.Database;
  export import TemporaryIf = JournalEntry.TemporaryIf;
  export import Flags = JournalEntry.Flags;
  export import CoreFlags = JournalEntry.CoreFlags;

  namespace Internal {
    // Note(LukeAbby): The point of this is to give the base class of `JournalEntry` a name.
    // The expression `ClientDocumentMixin(BaseJournalEntry)` is more intuitive but it has worse
    // caching, likely due to the majority of tsc's caching working off of names.
    // See https://gist.github.com/LukeAbby/18a928fdc35c5d54dc121ed5dbf412fd.
    interface ClientDocument extends foundry.documents.abstract.ClientDocumentMixin.Mix<typeof BaseJournalEntry> {}
    const ClientDocument: ClientDocument;
  }
}
