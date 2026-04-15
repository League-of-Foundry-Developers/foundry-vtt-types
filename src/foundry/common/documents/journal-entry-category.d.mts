import type { MaybeArray } from "#utils";
import type { DataModel, Document } from "#common/abstract/_module.d.mts";
import type { SchemaField } from "#common/data/fields.d.mts";

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
   * You should use {@linkcode JournalEntryCategory.implementation | new JournalEntryCategory.implementation(...)} instead which will give you
   * a system specific implementation of `JournalEntryCategory`.
   */
  constructor(data: BaseJournalEntryCategory.CreateData, context?: BaseJournalEntryCategory.ConstructionContext);

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

  override readonly parentCollection: BaseJournalEntryCategory.ParentCollectionName | null;

  override get pack(): string | null;

  static override get implementation(): JournalEntryCategory.ImplementationClass;

  static override get baseDocument(): typeof BaseJournalEntryCategory;

  static override get collectionName(): BaseJournalEntryCategory.ParentCollectionName;

  static override get documentName(): BaseJournalEntryCategory.Name;

  static override get TYPES(): CONST.BASE_DOCUMENT_TYPE[];

  static override get hasTypeData(): false;

  static override readonly hierarchy: BaseJournalEntryCategory.Hierarchy;

  override parent: BaseJournalEntryCategory.Parent;

  override " fvtt_types_internal_document_parent": BaseJournalEntryCategory.Parent;

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
    data?: Document.CanUserModifyData<"JournalEntryCategory", Action>,
  ): boolean;

  static override createDocuments<Temporary extends boolean | undefined = undefined>(
    data: BaseJournalEntryCategory.CreateInput[],
    operation?: Document.Database.CreateOperation<BaseJournalEntryCategory.Database.Create<Temporary>>,
  ): Promise<Array<BaseJournalEntryCategory.TemporaryIf<Temporary>>>;

  static override updateDocuments(
    updates: BaseJournalEntryCategory.UpdateInput[],
    operation?: Document.Database.UpdateDocumentsOperation<BaseJournalEntryCategory.Database.Update>,
  ): Promise<Array<JournalEntryCategory.Stored>>;

  static override deleteDocuments(
    ids: readonly string[],
    operation?: Document.Database.DeleteDocumentsOperation<BaseJournalEntryCategory.Database.Delete>,
  ): Promise<Array<JournalEntryCategory.Stored>>;

  static override create<
    Data extends MaybeArray<BaseJournalEntryCategory.CreateInput>,
    Temporary extends boolean | undefined = undefined,
  >(
    data: Data,
    operation?: BaseJournalEntryCategory.Database.CreateOperation<Temporary>,
  ): Promise<BaseJournalEntryCategory.CreateReturn<Data, Temporary>>;

  override update(
    data: BaseJournalEntryCategory.UpdateInput,
    operation?: BaseJournalEntryCategory.Database.UpdateOperation,
  ): Promise<this | undefined>;

  override delete(operation?: BaseJournalEntryCategory.Database.DeleteOperation): Promise<this | undefined>;

  // `JournalEntryCategory`s are neither world documents nor compendium documents, so this always returns `null`.
  static override get(documentId: string, operation?: BaseJournalEntryCategory.Database.GetOptions): null;

  // `JournalEntryCategory`s have no embedded collections, so this always returns `null`.
  static override getCollectionName(name: string): null;

  override getFlag<
    Scope extends BaseJournalEntryCategory.Flags.Scope,
    Key extends BaseJournalEntryCategory.Flags.Key<Scope>,
  >(scope: Scope, key: Key): BaseJournalEntryCategory.Flags.Get<Scope, Key>;

  override setFlag<
    Scope extends BaseJournalEntryCategory.Flags.Scope,
    Key extends BaseJournalEntryCategory.Flags.Key<Scope>,
    Value extends BaseJournalEntryCategory.Flags.Get<Scope, Key>,
  >(scope: Scope, key: Key, value: Value): Promise<this | undefined>;

  override unsetFlag<
    Scope extends BaseJournalEntryCategory.Flags.Scope,
    Key extends BaseJournalEntryCategory.Flags.Key<Scope>,
  >(scope: Scope, key: Key): Promise<this | undefined>;

  protected override _preCreate(
    data: BaseJournalEntryCategory.CreateData,
    options: BaseJournalEntryCategory.Database.PreCreateOptions,
    user: User.Stored,
  ): Promise<boolean | void>;

  protected override _onCreate(
    data: BaseJournalEntryCategory.CreateData,
    options: BaseJournalEntryCategory.Database.OnCreateOperation,
    userId: string,
  ): void;

  protected static override _preCreateOperation(
    documents: JournalEntryCategory.Implementation[],
    operation: Document.Database.PreCreateOperationStatic<BaseJournalEntryCategory.Database.Create>,
    user: User.Stored,
  ): Promise<boolean | void>;

  protected static override _onCreateOperation(
    documents: JournalEntryCategory.Stored[],
    operation: BaseJournalEntryCategory.Database.Create,
    user: User.Stored,
  ): Promise<void>;

  protected override _preUpdate(
    changed: BaseJournalEntryCategory.UpdateData,
    options: BaseJournalEntryCategory.Database.PreUpdateOptions,
    user: User.Stored,
  ): Promise<boolean | void>;

  protected override _onUpdate(
    changed: BaseJournalEntryCategory.UpdateData,
    options: BaseJournalEntryCategory.Database.OnUpdateOperation,
    userId: string,
  ): void;

  protected static override _preUpdateOperation(
    documents: JournalEntryCategory.Stored[],
    operation: BaseJournalEntryCategory.Database.Update,
    user: User.Stored,
  ): Promise<boolean | void>;

  protected static override _onUpdateOperation(
    documents: JournalEntryCategory.Stored[],
    operation: BaseJournalEntryCategory.Database.Update,
    user: User.Stored,
  ): Promise<void>;

  protected override _preDelete(
    options: BaseJournalEntryCategory.Database.PreDeleteOptions,
    user: User.Stored,
  ): Promise<boolean | void>;

  protected override _onDelete(options: BaseJournalEntryCategory.Database.OnDeleteOperation, userId: string): void;

  protected static override _preDeleteOperation(
    documents: JournalEntryCategory.Stored[],
    operation: BaseJournalEntryCategory.Database.Delete,
    user: User.Stored,
  ): Promise<boolean | void>;

  protected static override _onDeleteOperation(
    documents: JournalEntryCategory.Stored[],
    operation: BaseJournalEntryCategory.Database.Delete,
    user: User.Stored,
  ): Promise<void>;

  /**
   * @deprecated "The `JournalEntryCategory._onCreateDocuments` static method is deprecated in favor of
   * {@linkcode JournalEntryCategory._onCreateOperation}" (since v12, until v14)
   */
  protected static override _onCreateDocuments(
    documents: JournalEntryCategory.Implementation[],
    context: BaseJournalEntryCategory.Database.OnCreateDocumentsContext,
  ): Promise<void>;

  /**
   * @deprecated "The `JournalEntryCategory._onUpdateDocuments` static method is deprecated in favor of
   * {@linkcode JournalEntryCategory._onUpdateOperation}" (since v12, until v14)
   */
  protected static override _onUpdateDocuments(
    documents: JournalEntryCategory.Stored[],
    context: BaseJournalEntryCategory.Database.OnUpdateDocumentsContext,
  ): Promise<void>;

  /**
   * @deprecated "The `JournalEntryCategory._onDeleteDocuments` static method is deprecated in favor of
   * {@linkcode JournalEntryCategory._onDeleteOperation}" (since v12, until v14)
   */
  protected static override _onDeleteDocuments(
    documents: JournalEntryCategory.Stored[],
    context: BaseJournalEntryCategory.Database.OnDeleteDocumentsContext,
  ): Promise<void>;

  /* DataModel overrides */

  protected static override _schema: SchemaField<BaseJournalEntryCategory.Schema>;

  static override get schema(): SchemaField<BaseJournalEntryCategory.Schema>;

  static override validateJoint(data: BaseJournalEntryCategory.Source): void;

  static override fromSource(
    source: BaseJournalEntryCategory.CreateData,
    context?: DataModel.FromSourceOptions,
  ): JournalEntryCategory.Implementation;

  static override fromJSON(json: string): JournalEntryCategory.Implementation;
}

declare namespace BaseJournalEntryCategory {
  // All types really live in the full document and are mirrored here for convenience
  export import Name = JournalEntryCategory.Name;
  export import ConstructionContext = JournalEntryCategory.ConstructionContext;
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  export import ConstructorArgs = JournalEntryCategory.ConstructorArgs;
  export import Hierarchy = JournalEntryCategory.Hierarchy;
  export import Metadata = JournalEntryCategory.Metadata;
  export import Parent = JournalEntryCategory.Parent;
  export import Descendant = JournalEntryCategory.Descendant;
  export import DescendantClass = JournalEntryCategory.DescendantClass;
  export import Embedded = JournalEntryCategory.Embedded;
  export import ParentCollectionName = JournalEntryCategory.ParentCollectionName;
  export import CollectionClass = JournalEntryCategory.CollectionClass;
  export import Collection = JournalEntryCategory.Collection;
  export import Invalid = JournalEntryCategory.Invalid;
  export import Source = JournalEntryCategory.Source;
  export import CreateData = JournalEntryCategory.CreateData;
  export import CreateInput = JournalEntryCategory.CreateInput;
  export import CreateReturn = JournalEntryCategory.CreateReturn;
  export import InitializedData = JournalEntryCategory.InitializedData;
  export import UpdateData = JournalEntryCategory.UpdateData;
  export import UpdateInput = JournalEntryCategory.UpdateInput;
  export import Schema = JournalEntryCategory.Schema;
  export import Database = JournalEntryCategory.Database;
  export import TemporaryIf = JournalEntryCategory.TemporaryIf;
  export import Flags = JournalEntryCategory.Flags;

  namespace Internal {
    // Note(LukeAbby): The point of this is to give the base class of `JournalEntryCategory` a name.
    // The expression `ClientDocumentMixin(BaseJournalEntryCategory)` is more intuitive but it has worse
    // caching, likely due to the majority of tsc's caching working off of names.
    // See https://gist.github.com/LukeAbby/18a928fdc35c5d54dc121ed5dbf412fd.
    interface ClientDocument extends foundry.documents.abstract.ClientDocumentMixin.Mix<
      typeof BaseJournalEntryCategory
    > {}
    const ClientDocument: ClientDocument;
  }
}

export default BaseJournalEntryCategory;
