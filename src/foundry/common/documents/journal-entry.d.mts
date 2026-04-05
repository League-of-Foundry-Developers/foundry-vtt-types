import type { AnyMutableObject, MaybeArray, OverlapsWith } from "#utils";
import type { DataModel, Document } from "#common/abstract/_module.d.mts";
import type { SchemaField } from "../data/fields.d.mts";
import type { CompendiumCollection } from "#client/documents/collections/_module.d.mts";

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
   * You should use {@link JournalEntry.implementation | `new JournalEntry.implementation(...)`} instead which will give you
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
    data: BaseJournalEntry.CreateInput[],
    operation?: BaseJournalEntry.Database.CreateDocumentsOperation<Temporary>,
  ): Promise<Array<BaseJournalEntry.TemporaryIf<Temporary>>>;

  static override updateDocuments(
    updates: BaseJournalEntry.UpdateInput[],
    operation?: BaseJournalEntry.Database.UpdateManyDocumentsOperation,
  ): Promise<Array<JournalEntry.Stored>>;

  static override deleteDocuments(
    ids: readonly string[],
    operation?: BaseJournalEntry.Database.DeleteManyDocumentsOperation,
  ): Promise<Array<JournalEntry.Stored>>;

  static override create<
    Data extends MaybeArray<BaseJournalEntry.CreateInput>,
    Temporary extends boolean | undefined = undefined,
  >(
    data: Data,
    operation?: BaseJournalEntry.Database.CreateDocumentsOperation<Temporary>,
  ): Promise<BaseJournalEntry.CreateReturn<Data, Temporary>>;

  override update(
    data: BaseJournalEntry.UpdateInput,
    operation?: BaseJournalEntry.Database.UpdateOneDocumentOperation,
  ): Promise<this | undefined>;

  override delete(operation?: BaseJournalEntry.Database.DeleteOneDocumentOperation): Promise<this | undefined>;

  static override get(
    documentId: string,
    operation?: BaseJournalEntry.Database.GetDocumentsOperation,
  ): JournalEntry.Stored | CompendiumCollection.IndexEntry<"JournalEntry"> | null;

  static override getCollectionName<Name extends string>(
    name: OverlapsWith<Name, BaseJournalEntry.Embedded.CollectionName>,
  ): BaseJournalEntry.Embedded.GetCollectionNameReturn<Name>;

  override getEmbeddedCollection<EmbeddedName extends BaseJournalEntry.Embedded.CollectionName>(
    embeddedName: EmbeddedName,
  ): BaseJournalEntry.Embedded.CollectionFor<EmbeddedName>;

  override getEmbeddedDocument<
    EmbeddedName extends BaseJournalEntry.Embedded.CollectionName,
    Options extends Document.GetEmbeddedDocumentOptions | undefined = undefined,
  >(
    embeddedName: EmbeddedName,
    id: string,
    options?: Options,
  ): BaseJournalEntry.Embedded.GetReturn<EmbeddedName, Options>;

  override createEmbeddedDocuments<EmbeddedName extends BaseJournalEntry.Embedded.Name>(
    embeddedName: EmbeddedName,
    data: Document.CreateDataForName<EmbeddedName>[],
    operation?: Document.Database.CreateDocumentsOperationForName<EmbeddedName>,
  ): Promise<Array<Document.StoredForName<EmbeddedName>>>;

  override updateEmbeddedDocuments<EmbeddedName extends BaseJournalEntry.Embedded.Name>(
    embeddedName: EmbeddedName,
    updates: Document.UpdateDataForName<EmbeddedName>[],
    operation?: Document.Database.UpdateManyDocumentsOperationForName<EmbeddedName>,
  ): Promise<Array<Document.StoredForName<EmbeddedName>>>;

  override deleteEmbeddedDocuments<EmbeddedName extends BaseJournalEntry.Embedded.Name>(
    embeddedName: EmbeddedName,
    ids: string[],
    operation?: Document.Database.DeleteManyDocumentsOperationForName<EmbeddedName>,
  ): Promise<Array<Document.StoredForName<EmbeddedName>>>;

  override getFlag<Scope extends BaseJournalEntry.Flags.Scope, Key extends BaseJournalEntry.Flags.Key<Scope>>(
    scope: Scope,
    key: Key,
  ): BaseJournalEntry.Flags.Get<Scope, Key>;

  override setFlag<
    Scope extends BaseJournalEntry.Flags.Scope,
    Key extends BaseJournalEntry.Flags.Key<Scope>,
    Value extends BaseJournalEntry.Flags.Get<Scope, Key>,
  >(scope: Scope, key: Key, value: Value): Promise<this | undefined>;

  override unsetFlag<Scope extends BaseJournalEntry.Flags.Scope, Key extends BaseJournalEntry.Flags.Key<Scope>>(
    scope: Scope,
    key: Key,
  ): Promise<this | undefined>;

  protected override _preCreate(
    data: BaseJournalEntry.CreateData,
    options: BaseJournalEntry.Database.PreCreateOptions,
    user: User.Stored,
  ): Promise<boolean | void>;

  protected override _onCreate(
    data: BaseJournalEntry.CreateData,
    options: BaseJournalEntry.Database.OnCreateOptions,
    userId: string,
  ): void;

  protected static override _preCreateOperation(
    documents: JournalEntry.Implementation[],
    operation: BaseJournalEntry.Database.PreCreateOperation,
    user: User.Stored,
  ): Promise<boolean | void>;

  protected static override _onCreateOperation(
    documents: JournalEntry.Stored[],
    operation: BaseJournalEntry.Database.OnCreateOperation,
    user: User.Stored,
  ): Promise<void>;

  protected override _preUpdate(
    changed: BaseJournalEntry.UpdateData,
    options: BaseJournalEntry.Database.PreUpdateOptions,
    user: User.Stored,
  ): Promise<boolean | void>;

  protected override _onUpdate(
    changed: BaseJournalEntry.UpdateData,
    options: BaseJournalEntry.Database.OnUpdateOptions,
    userId: string,
  ): void;

  protected static override _preUpdateOperation(
    documents: JournalEntry.Stored[],
    operation: BaseJournalEntry.Database.PreUpdateOperation,
    user: User.Stored,
  ): Promise<boolean | void>;

  protected static override _onUpdateOperation(
    documents: JournalEntry.Stored[],
    operation: BaseJournalEntry.Database.OnUpdateOperation,
    user: User.Stored,
  ): Promise<void>;

  protected override _preDelete(
    options: BaseJournalEntry.Database.PreDeleteOptions,
    user: User.Stored,
  ): Promise<boolean | void>;

  protected override _onDelete(options: BaseJournalEntry.Database.OnDeleteOptions, userId: string): void;

  protected static override _preDeleteOperation(
    documents: JournalEntry.Stored[],
    operation: BaseJournalEntry.Database.PreDeleteOperation,
    user: User.Stored,
  ): Promise<boolean | void>;

  protected static override _onDeleteOperation(
    documents: JournalEntry.Stored[],
    operation: BaseJournalEntry.Database.OnDeleteOperation,
    user: User.Stored,
  ): Promise<void>;

  /**
   * @deprecated "The `Document._onCreateDocuments` static method is deprecated in favor of {@linkcode Document._onCreateOperation}"
   * (since v12, until v14)
   */
  protected static override _onCreateDocuments(
    documents: JournalEntry.Implementation[],
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    context: BaseJournalEntry.Database.OnCreateDocumentsOperation,
  ): Promise<void>;

  /**
   * @deprecated "The `Document._onUpdateDocuments` static method is deprecated in favor of {@linkcode Document._onUpdateOperation}"
   * (since v12, until v14)
   */
  protected static override _onUpdateDocuments(
    documents: JournalEntry.Stored[],
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    context: BaseJournalEntry.Database.OnUpdateDocumentsOperation,
  ): Promise<void>;

  /**
   * @deprecated "The `Document._onDeleteDocuments` static method is deprecated in favor of {@linkcode Document._onDeleteOperation}"
   * (since v12, until v14)
   */
  protected static override _onDeleteDocuments(
    documents: JournalEntry.Stored[],
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    context: BaseJournalEntry.Database.OnDeleteDocumentsOperation,
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
