import type DataModel from "../abstract/data.d.mts";
import type Document from "../abstract/document.mts";
import type { DataField, SchemaField } from "../data/fields.d.mts";

/**
 * An embedded Document that represents a category in a JournalEntry.
 * Defines the DataSchema and common behaviors for a JournalEntryCategory which are shared between both client and
 * server.
 */
// Note(LukeAbby): You may wonder why documents don't simply pass the `Parent` generic parameter.
// This pattern evolved from trying to avoid circular loops and even internal tsc errors.
// See: https://gist.github.com/LukeAbby/0d01b6e20ef19ebc304d7d18cef9cc21
declare abstract class BaseJournalEntryCategory extends Document<
  "JournalEntryCategory",
  BaseJournalEntryCategory.Schema,
  any
> {
  /**
   * @param data    - Initial data from which to construct the `BaseJournalEntryCategory`
   * @param context - Construction context options
   *
   * @deprecated Constructing `BaseJournalEntryCategory` directly is not advised. The base document classes exist in
   * order to use documents on both the client (i.e. where all your code runs) and behind the scenes
   * on the server to manage document validation and storage.
   *
   * You should use {@link JournalEntryCategory.implementation | `new JournalEntryCategory.implementation(...)`} instead which will give you
   * a system specific implementation of `JournalEntryCategory`.
   */
  constructor(data: JournalEntryCategory.CreateData, context?: JournalEntryCategory.ConstructionContext);

  /**
   * @defaultValue
   * ```js
   * mergeObject(super.metadata, {
   *   name: "JournalEntryCategory",
   *   collection: "categories",
   *   label: "DOCUMENT.JournalEntryCategory",
   *   labelPlural: "DOCUMENT.JournalEntryCategories",
   *   isEmbedded: true,
   *   schemaVersion: "13.341"
   * })
   * ```
   */
  static override metadata: BaseJournalEntryCategory.Metadata;

  static override defineSchema(): BaseJournalEntryCategory.Schema;

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
  protected static override _initializationOrder(): Generator<[string, DataField.Any]>;

  override readonly parentCollection: JournalEntryCategory.ParentCollectionName | null;

  override readonly pack: string | null;

  static override get implementation(): JournalEntryCategory.ImplementationClass;

  static override get baseDocument(): typeof BaseJournalEntryCategory;

  static override get collectionName(): JournalEntryCategory.ParentCollectionName;

  static override get documentName(): JournalEntryCategory.Name;

  static override get TYPES(): CONST.BASE_DOCUMENT_TYPE[];

  static override get hasTypeData(): undefined;

  static override get hierarchy(): JournalEntryCategory.Hierarchy;

  override parent: JournalEntryCategory.Parent;

  static override createDocuments<Temporary extends boolean | undefined = undefined>(
    data: Array<JournalEntryCategory.Implementation | JournalEntryCategory.CreateData> | undefined,
    operation?: Document.Database.CreateDocumentsOperation<JournalEntryCategory.Database.Create<Temporary>>,
  ): Promise<Array<JournalEntryCategory.TemporaryIf<Temporary>>>;

  static override updateDocuments(
    updates: JournalEntryCategory.UpdateData[] | undefined,
    operation?: Document.Database.UpdateDocumentsOperation<JournalEntryCategory.Database.Update>,
  ): Promise<JournalEntryCategory.Implementation[]>;

  static override deleteDocuments(
    ids: readonly string[] | undefined,
    operation?: Document.Database.DeleteDocumentsOperation<JournalEntryCategory.Database.Delete>,
  ): Promise<JournalEntryCategory.Implementation[]>;

  static override create<Temporary extends boolean | undefined = undefined>(
    data: JournalEntryCategory.CreateData | JournalEntryCategory.CreateData[],
    operation?: JournalEntryCategory.Database.CreateOperation<Temporary>,
  ): Promise<JournalEntryCategory.TemporaryIf<Temporary> | undefined>;

  override update(
    data: JournalEntryCategory.UpdateData | undefined,
    operation?: JournalEntryCategory.Database.UpdateOperation,
  ): Promise<this | undefined>;

  override delete(operation?: JournalEntryCategory.Database.DeleteOperation): Promise<this | undefined>;

  static override get(
    documentId: string,
    options?: JournalEntryCategory.Database.GetOptions,
  ): JournalEntryCategory.Implementation | null;

  static override getCollectionName(name: string): null;

  // Same as Document for now
  override traverseEmbeddedDocuments(_parentPath?: string): Generator<[string, Document.AnyChild<this>]>;

  override getFlag<Scope extends JournalEntryCategory.Flags.Scope, Key extends JournalEntryCategory.Flags.Key<Scope>>(
    scope: Scope,
    key: Key,
  ): JournalEntryCategory.Flags.Get<Scope, Key>;

  override setFlag<
    Scope extends JournalEntryCategory.Flags.Scope,
    Key extends JournalEntryCategory.Flags.Key<Scope>,
    Value extends JournalEntryCategory.Flags.Get<Scope, Key>,
  >(scope: Scope, key: Key, value: Value): Promise<this>;

  override unsetFlag<Scope extends JournalEntryCategory.Flags.Scope, Key extends JournalEntryCategory.Flags.Key<Scope>>(
    scope: Scope,
    key: Key,
  ): Promise<this>;

  protected override _preCreate(
    data: JournalEntryCategory.CreateData,
    options: JournalEntryCategory.Database.PreCreateOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected override _onCreate(
    data: JournalEntryCategory.CreateData,
    options: JournalEntryCategory.Database.OnCreateOperation,
    userId: string,
  ): void;

  protected static override _preCreateOperation(
    documents: JournalEntryCategory.Implementation[],
    operation: Document.Database.PreCreateOperationStatic<JournalEntryCategory.Database.Create>,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static override _onCreateOperation(
    documents: JournalEntryCategory.Implementation[],
    operation: JournalEntryCategory.Database.Create,
    user: User.Implementation,
  ): Promise<void>;

  protected override _preUpdate(
    changed: JournalEntryCategory.UpdateData,
    options: JournalEntryCategory.Database.PreUpdateOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected override _onUpdate(
    changed: JournalEntryCategory.UpdateData,
    options: JournalEntryCategory.Database.OnUpdateOperation,
    userId: string,
  ): void;

  protected static override _preUpdateOperation(
    documents: JournalEntryCategory.Implementation[],
    operation: JournalEntryCategory.Database.Update,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static override _onUpdateOperation(
    documents: JournalEntryCategory.Implementation[],
    operation: JournalEntryCategory.Database.Update,
    user: User.Implementation,
  ): Promise<void>;

  protected override _preDelete(
    options: JournalEntryCategory.Database.PreDeleteOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected override _onDelete(options: JournalEntryCategory.Database.OnDeleteOperation, userId: string): void;

  protected static override _preDeleteOperation(
    documents: JournalEntryCategory.Implementation[],
    operation: JournalEntryCategory.Database.Delete,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static override _onDeleteOperation(
    documents: JournalEntryCategory.Implementation[],
    operation: JournalEntryCategory.Database.Delete,
    user: User.Implementation,
  ): Promise<void>;

  /**
   * @deprecated since v12, will be removed in v14
   * @remarks "The `Document._onCreateDocuments` static method is deprecated in favor of {@link Document._onCreateOperation | `Document._onCreateOperation`}"
   */
  protected static override _onCreateDocuments(
    documents: JournalEntryCategory.Implementation[],
    context: Document.ModificationContext<JournalEntryCategory.Parent>,
  ): Promise<void>;

  /**
   * @deprecated since v12, will be removed in v14
   * @remarks "The `Document._onUpdateDocuments` static method is deprecated in favor of {@link Document._onUpdateOperation | `Document._onUpdateOperation`}"
   */
  protected static override _onUpdateDocuments(
    documents: JournalEntryCategory.Implementation[],
    context: Document.ModificationContext<JournalEntryCategory.Parent>,
  ): Promise<void>;

  /**
   * @deprecated since v12, will be removed in v14
   * @remarks "The `Document._onDeleteDocuments` static method is deprecated in favor of {@link Document._onDeleteOperation | `Document._onDeleteOperation`}"
   */
  protected static override _onDeleteDocuments(
    documents: JournalEntryCategory.Implementation[],
    context: Document.ModificationContext<JournalEntryCategory.Parent>,
  ): Promise<void>;

  /* DataModel overrides */

  protected static override _schema: SchemaField<JournalEntryCategory.Schema>;

  static override get schema(): SchemaField<JournalEntryCategory.Schema>;

  static override validateJoint(data: JournalEntryCategory.Source): void;

  // options: not null (parameter default only, destructured in super)
  static override fromSource(
    source: JournalEntryCategory.CreateData,
    context?: DataModel.FromSourceOptions,
  ): JournalEntryCategory.Implementation;

  static override fromJSON(json: string): JournalEntryCategory.Implementation;
}

declare namespace BaseJournalEntryCategory {
  export import Name = JournalEntry.Name;
  export import ConstructionContext = Item.ConstructionContext;
  // eslint-disable-next-line @typescript-eslint/no-deprecated
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
  export import Database = JournalEntry.Database;
  export import TemporaryIf = JournalEntry.TemporaryIf;
  export import Flags = JournalEntry.Flags;

  namespace Internal {
    // Note(LukeAbby): The point of this is to give the base class of `JournalEntryCategory` a name.
    // The expression `ClientDocumentMixin(BaseJournalEntryCategory)` is more intuitive but it has worse
    // caching, likely due to the majority of tsc's caching working off of names.
    // See https://gist.github.com/LukeAbby/18a928fdc35c5d54dc121ed5dbf412fd.
    interface ClientDocument
      extends foundry.documents.abstract.ClientDocumentMixin.Mix<typeof BaseJournalEntryCategory> {}
    const ClientDocument: ClientDocument;
  }
}

export default BaseJournalEntryCategory;
