import type { AnyMutableObject } from "#utils";
import type DataModel from "../abstract/data.d.mts";
import type Document from "../abstract/document.mts";
import type { DataField, SchemaField } from "../data/fields.d.mts";
import type { LogCompatibilityWarningOptions } from "../utils/logging.d.mts";

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
   * @deprecated Constructing `BaseJournalEntry` directly is not advised. The base document classes exist in
   * order to use documents on both the client (i.e. where all your code runs) and behind the scenes
   * on the server to manage document validation and storage.
   *
   * You should use {@link JournalEntry.implementation | `new JournalEntry.implementation(...)`} instead which will give you
   * a system specific implementation of `JournalEntry`.
   */
  constructor(...args: JournalEntry.ConstructorArgs);

  /**
   * @defaultValue
   * ```js
   * mergeObject(super.metadata, {
   *   name: "JournalEntry",
   *   collection: "journal",
   *   indexed: true,
   *   compendiumIndexFields: ["_id", "name", "sort", "folder"],
   *   embedded: {JournalEntryPage: "pages"},
   *   label: "DOCUMENT.JournalEntry",
   *   labelPlural: "DOCUMENT.JournalEntries",
   *   permissions: {
   *     create: "JOURNAL_CREATE"
   *   },
   *   schemaVersion: "12.324"
   * })
   * ```
   */
  static override metadata: BaseJournalEntry.Metadata;

  static override defineSchema(): BaseJournalEntry.Schema;

  /**
   * @remarks
   * Migrations:
   * - `flags.core.sourceId` to `_stats.compendiumSource` (since v12, no specified end)
   */
  static override migrateData(source: AnyMutableObject): AnyMutableObject;

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

  static " fvtt_types_internal_document_name_static": "JournalEntry";

  // Same as Document for now
  protected static override _initializationOrder(): Generator<[string, DataField.Any]>;

  override readonly parentCollection: JournalEntry.ParentCollectionName | null;

  override readonly pack: string | null;

  static override get implementation(): JournalEntry.ImplementationClass;

  static override get baseDocument(): typeof BaseJournalEntry;

  static override get collectionName(): JournalEntry.ParentCollectionName;

  static override get documentName(): JournalEntry.Name;

  static override get TYPES(): CONST.BASE_DOCUMENT_TYPE[];

  static override get hasTypeData(): undefined;

  static override get hierarchy(): JournalEntry.Hierarchy;

  override parent: JournalEntry.Parent;

  static override createDocuments<Temporary extends boolean | undefined = false>(
    data: Array<JournalEntry.Implementation | JournalEntry.CreateData> | undefined,
    operation?: Document.Database.CreateOperation<JournalEntry.Database.Create<Temporary>>,
  ): Promise<Array<Document.TemporaryIf<JournalEntry.Implementation, Temporary>>>;

  static override updateDocuments(
    updates: JournalEntry.UpdateData[] | undefined,
    operation?: Document.Database.UpdateDocumentsOperation<JournalEntry.Database.Update>,
  ): Promise<JournalEntry.Implementation[]>;

  static override deleteDocuments(
    ids: readonly string[] | undefined,
    operation?: Document.Database.DeleteDocumentsOperation<JournalEntry.Database.Delete>,
  ): Promise<JournalEntry.Implementation[]>;

  static override create<Temporary extends boolean | undefined = false>(
    data: JournalEntry.CreateData | JournalEntry.CreateData[],
    operation?: JournalEntry.Database.CreateOperation<Temporary>,
  ): Promise<Document.TemporaryIf<JournalEntry.Implementation, Temporary> | undefined>;

  override update(
    data: JournalEntry.UpdateData | undefined,
    operation?: JournalEntry.Database.UpdateOperation,
  ): Promise<this | undefined>;

  override delete(operation?: JournalEntry.Database.DeleteOperation): Promise<this | undefined>;

  static override get(
    documentId: string,
    options?: JournalEntry.Database.GetOptions,
  ): JournalEntry.Implementation | null;

  static override getCollectionName<CollectionName extends JournalEntry.Embedded.Name>(
    name: CollectionName,
  ): JournalEntry.Embedded.CollectionNameOf<CollectionName> | null;

  override getEmbeddedCollection<EmbeddedName extends JournalEntry.Embedded.CollectionName>(
    embeddedName: EmbeddedName,
  ): JournalEntry.Embedded.CollectionFor<EmbeddedName>;

  override getEmbeddedDocument<EmbeddedName extends JournalEntry.Embedded.CollectionName>(
    embeddedName: EmbeddedName,
    id: string,
    options: Document.GetEmbeddedDocumentOptions,
  ): JournalEntry.Embedded.DocumentFor<EmbeddedName> | undefined;

  override createEmbeddedDocuments<EmbeddedName extends JournalEntry.Embedded.Name>(
    embeddedName: EmbeddedName,
    data: Document.CreateDataForName<EmbeddedName>[] | undefined,
    // TODO(LukeAbby): The correct signature would be:
    // operation?: Document.Database.CreateOperation<Document.Database.CreateForName<EmbeddedName>>,
    // However this causes a number of errors.
    operation?: object,
  ): Promise<Array<Document.Stored<Document.ImplementationFor<EmbeddedName>>> | undefined>;

  override updateEmbeddedDocuments<EmbeddedName extends JournalEntry.Embedded.Name>(
    embeddedName: EmbeddedName,
    updates: Document.UpdateDataForName<EmbeddedName>[] | undefined,
    operation?: Document.Database.UpdateOperationForName<EmbeddedName>,
  ): Promise<Array<Document.Stored<Document.ImplementationFor<EmbeddedName>>> | undefined>;

  override deleteEmbeddedDocuments<EmbeddedName extends JournalEntry.Embedded.Name>(
    embeddedName: EmbeddedName,
    ids: Array<string>,
    operation?: Document.Database.DeleteOperationForName<EmbeddedName>,
  ): Promise<Array<Document.Stored<Document.ImplementationFor<EmbeddedName>>>>;

  // Same as Document for now
  override traverseEmbeddedDocuments(_parentPath?: string): Generator<[string, Document.AnyChild<this>]>;

  override getFlag<Scope extends JournalEntry.Flags.Scope, Key extends JournalEntry.Flags.Key<Scope>>(
    scope: Scope,
    key: Key,
  ): Document.GetFlag<JournalEntry.Name, Scope, Key>;

  override setFlag<
    Scope extends JournalEntry.Flags.Scope,
    Key extends JournalEntry.Flags.Key<Scope>,
    Value extends Document.GetFlag<JournalEntry.Name, Scope, Key>,
  >(scope: Scope, key: Key, value: Value): Promise<this>;

  override unsetFlag<Scope extends JournalEntry.Flags.Scope, Key extends JournalEntry.Flags.Key<Scope>>(
    scope: Scope,
    key: Key,
  ): Promise<this>;

  protected override _preCreate(
    data: JournalEntry.CreateData,
    options: JournalEntry.Database.PreCreateOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected override _onCreate(
    data: JournalEntry.CreateData,
    options: JournalEntry.Database.OnCreateOperation,
    userId: string,
  ): void;

  protected static override _preCreateOperation(
    documents: JournalEntry.Implementation[],
    operation: Document.Database.PreCreateOperationStatic<JournalEntry.Database.Create>,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static override _onCreateOperation(
    documents: JournalEntry.Implementation[],
    operation: JournalEntry.Database.Create,
    user: User.Implementation,
  ): Promise<void>;

  protected override _preUpdate(
    changed: JournalEntry.UpdateData,
    options: JournalEntry.Database.PreUpdateOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected override _onUpdate(
    changed: JournalEntry.UpdateData,
    options: JournalEntry.Database.OnUpdateOperation,
    userId: string,
  ): void;

  protected static override _preUpdateOperation(
    documents: JournalEntry.Implementation[],
    operation: JournalEntry.Database.Update,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static override _onUpdateOperation(
    documents: JournalEntry.Implementation[],
    operation: JournalEntry.Database.Update,
    user: User.Implementation,
  ): Promise<void>;

  protected override _preDelete(
    options: JournalEntry.Database.PreDeleteOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected override _onDelete(options: JournalEntry.Database.OnDeleteOperation, userId: string): void;

  protected static override _preDeleteOperation(
    documents: JournalEntry.Implementation[],
    operation: JournalEntry.Database.Delete,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static override _onDeleteOperation(
    documents: JournalEntry.Implementation[],
    operation: JournalEntry.Database.Delete,
    user: User.Implementation,
  ): Promise<void>;

  static override get hasSystemData(): undefined;

  // These data field things have been ticketed but will probably go into backlog hell for a while.
  // We'll end up copy and pasting without modification for now I think. It makes it a tiny bit easier to update though.

  // options: not null (parameter default only in _addDataFieldShim)
  protected static override _addDataFieldShims(
    data: AnyMutableObject,
    shims: Record<string, string>,
    options?: Document.DataFieldShimOptions,
  ): void;

  // options: not null (parameter default only)
  protected static override _addDataFieldShim(
    data: AnyMutableObject,
    oldKey: string,
    newKey: string,
    options?: Document.DataFieldShimOptions,
  ): void;

  protected static override _addDataFieldMigration(
    data: AnyMutableObject,
    oldKey: string,
    newKey: string,
    apply?: ((data: AnyMutableObject) => unknown) | null,
  ): boolean;

  // options: not null (destructured where forwarded)
  protected static override _logDataFieldMigration(
    oldKey: string,
    newKey: string,
    options?: LogCompatibilityWarningOptions,
  ): void;

  /**
   * @deprecated since v12, will be removed in v14
   * @remarks "The `Document._onCreateDocuments` static method is deprecated in favor of {@link Document._onCreateOperation | `Document._onCreateOperation`}"
   */
  protected static override _onCreateDocuments(
    documents: JournalEntry.Implementation[],
    context: Document.ModificationContext<JournalEntry.Parent>,
  ): Promise<void>;

  /**
   * @deprecated since v12, will be removed in v14
   * @remarks "The `Document._onUpdateDocuments` static method is deprecated in favor of {@link Document._onUpdateOperation | `Document._onUpdateOperation`}"
   */
  protected static override _onUpdateDocuments(
    documents: JournalEntry.Implementation[],
    context: Document.ModificationContext<JournalEntry.Parent>,
  ): Promise<void>;

  /**
   * @deprecated since v12, will be removed in v14
   * @remarks "The `Document._onDeleteDocuments` static method is deprecated in favor of {@link Document._onDeleteOperation | `Document._onDeleteOperation`}"
   */
  protected static override _onDeleteDocuments(
    documents: JournalEntry.Implementation[],
    context: Document.ModificationContext<JournalEntry.Parent>,
  ): Promise<void>;

  /* DataModel overrides */

  protected static override _schema: SchemaField<JournalEntry.Schema>;

  static override get schema(): SchemaField<JournalEntry.Schema>;

  static override validateJoint(data: JournalEntry.Source): void;

  // options: not null (parameter default only, destructured in super)
  static override fromSource(
    source: JournalEntry.CreateData,
    context?: DataModel.FromSourceOptions,
  ): JournalEntry.Implementation;

  static override fromJSON(json: string): JournalEntry.Implementation;
}

export default BaseJournalEntry;

declare namespace BaseJournalEntry {
  export import Name = JournalEntry.Name;
  export import ConstructorArgs = JournalEntry.ConstructorArgs;
  export import Hierarchy = JournalEntry.Hierarchy;
  export import Metadata = JournalEntry.Metadata;
  export import Parent = JournalEntry.Parent;
  export import Descendant = JournalEntry.Descendant;
  export import DescendantClass = JournalEntry.DescendantClass;
  export import Pack = JournalEntry.Pack;
  export import Embedded = JournalEntry.Embedded;
  export import ParentCollectionName = JournalEntry.ParentCollectionName;
  export import CollectionClass = JournalEntry.CollectionClass;
  export import Collection = JournalEntry.Collection;
  export import Invalid = JournalEntry.Invalid;
  export import Stored = JournalEntry.Stored;
  export import Source = JournalEntry.Source;
  export import CreateData = JournalEntry.CreateData;
  export import InitializedData = JournalEntry.InitializedData;
  export import UpdateData = JournalEntry.UpdateData;
  export import Schema = JournalEntry.Schema;
  export import DatabaseOperation = JournalEntry.Database;
  export import Flags = JournalEntry.Flags;
  export import CoreFlags = JournalEntry.CoreFlags;

  namespace Internal {
    // Note(LukeAbby): The point of this is to give the base class of `JournalEntry` a name.
    // The expression `ClientDocumentMixin(BaseJournalEntry)` is more intuitive but it has worse
    // caching, likely due to the majority of tsc's caching working off of names.
    // See https://gist.github.com/LukeAbby/18a928fdc35c5d54dc121ed5dbf412fd.
    interface ClientDocument extends ClientDocumentMixin.Mix<typeof BaseJournalEntry> {}
    const ClientDocument: ClientDocument;
  }
}
