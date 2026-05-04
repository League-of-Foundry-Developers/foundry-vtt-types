import type { MaybeArray } from "#utils";
import type { DataModel, Document } from "#common/abstract/_module.d.mts";
import type { SchemaField } from "#common/data/fields.d.mts";

/**
 * The JournalEntryPage Document.
 * Defines the DataSchema and common behaviors for a JournalEntryPage which are shared between both client and server.
 */
declare abstract class BaseJournalEntryPage<
  out SubType extends BaseJournalEntryPage.SubType = BaseJournalEntryPage.SubType,
> extends Document<"JournalEntryPage", BaseJournalEntryPage._Schema, any> {
  /**
   * @param data    - Initial data from which to construct the `BaseJournalEntryPage`
   * @param context - Construction context options
   *
   * @remarks Constructing `BaseJournalEntryPage` directly is not advised. The base document classes exist in
   * order to use documents on both the client (i.e. where all your code runs) and behind the scenes
   * on the server to manage document validation and storage.
   *
   * You should use {@linkcode JournalEntryPage.implementation | new JournalEntryPage.implementation(...)} instead which will give you
   * a system specific implementation of `JournalEntryPage`.
   */
  constructor(data: BaseJournalEntryPage.CreateData, context?: BaseJournalEntryPage.ConstructionContext);

  /**
   * @defaultValue
   * ```js
   * mergeObject(super.metadata, {
   *   name: "JournalEntryPage",
   *   collection: "pages",
   *   hasTypeData: true,
   *   indexed: true,
   *   label: "DOCUMENT.JournalEntryPage",
   *   labelPlural: "DOCUMENT.JournalEntryPages",
   *   coreTypes: ["text", "image", "pdf", "video"],
   *   compendiumIndexFields: ["name", "type", "sort"],
   *   permissions: {
   *     create: "OWNER",
   *     delete: "OWNER"
   *   },
   *   schemaVersion: "13.341"
   * })
   * ```
   */
  static override metadata: BaseJournalEntryPage.Metadata;

  static override defineSchema(): BaseJournalEntryPage.Schema;

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

  override readonly parentCollection: BaseJournalEntryPage.ParentCollectionName | null;

  static override get implementation(): JournalEntryPage.ImplementationClass;

  static override get baseDocument(): typeof BaseJournalEntryPage;

  static override get collectionName(): BaseJournalEntryPage.ParentCollectionName;

  static override get documentName(): BaseJournalEntryPage.Name;

  static override get TYPES(): BaseJournalEntryPage.SubType[];

  static override get hasTypeData(): true;

  static override readonly hierarchy: BaseJournalEntryPage.Hierarchy;

  override system: BaseJournalEntryPage.SystemOfType<SubType>;

  override parent: BaseJournalEntryPage.Parent;

  override " fvtt_types_internal_document_parent": BaseJournalEntryPage.Parent;

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
    data?: Document.CanUserModifyData<"JournalEntryPage", Action>,
  ): boolean;

  static override createDocuments<Temporary extends boolean | undefined = undefined>(
    data: BaseJournalEntryPage.CreateInput[],
    operation?: BaseJournalEntryPage.Database.CreateDocumentsOperation<Temporary>,
  ): Promise<Array<BaseJournalEntryPage.TemporaryIf<Temporary>>>;

  static override updateDocuments(
    updates: BaseJournalEntryPage.UpdateInput[],
    operation?: BaseJournalEntryPage.Database.UpdateManyDocumentsOperation,
  ): Promise<Array<JournalEntryPage.Stored>>;

  static override deleteDocuments(
    ids: readonly string[],
    operation?: BaseJournalEntryPage.Database.DeleteManyDocumentsOperation,
  ): Promise<Array<JournalEntryPage.Stored>>;

  static override create<
    Data extends MaybeArray<BaseJournalEntryPage.CreateInput>,
    Temporary extends boolean | undefined = undefined,
  >(
    data: Data,
    operation?: BaseJournalEntryPage.Database.CreateDocumentsOperation<Temporary>,
  ): Promise<BaseJournalEntryPage.CreateReturn<Data, Temporary>>;

  override update(
    data: BaseJournalEntryPage.UpdateInput,
    operation?: BaseJournalEntryPage.Database.UpdateOneDocumentOperation,
  ): Promise<this | undefined>;

  override delete(operation?: BaseJournalEntryPage.Database.DeleteOneDocumentOperation): Promise<this | undefined>;

  // `JournalEntryPage`s are neither world documents nor compendium documents, so this always returns `null`.
  static override get(documentId: string, operation?: BaseJournalEntryPage.Database.GetDocumentsOperation): null;

  // `JournalEntryPage`s have no embedded collections, so this always returns `null`
  static override getCollectionName(name: string): null;

  override getFlag<Scope extends BaseJournalEntryPage.Flags.Scope, Key extends BaseJournalEntryPage.Flags.Key<Scope>>(
    scope: Scope,
    key: Key,
  ): BaseJournalEntryPage.Flags.Get<Scope, Key>;

  override setFlag<
    Scope extends BaseJournalEntryPage.Flags.Scope,
    Key extends BaseJournalEntryPage.Flags.Key<Scope>,
    Value extends BaseJournalEntryPage.Flags.Get<Scope, Key>,
  >(scope: Scope, key: Key, value: Value): Promise<this | undefined>;

  override unsetFlag<Scope extends BaseJournalEntryPage.Flags.Scope, Key extends BaseJournalEntryPage.Flags.Key<Scope>>(
    scope: Scope,
    key: Key,
  ): Promise<this | undefined>;

  protected override _preCreate(
    data: BaseJournalEntryPage.CreateData,
    options: BaseJournalEntryPage.Database.PreCreateOptions,
    user: User.Stored,
  ): Promise<boolean | void>;

  protected override _onCreate(
    data: BaseJournalEntryPage.CreateData,
    options: BaseJournalEntryPage.Database.OnCreateOptions,
    userId: string,
  ): void;

  protected static override _preCreateOperation(
    documents: JournalEntryPage.Implementation[],
    operation: BaseJournalEntryPage.Database.PreCreateOperation,
    user: User.Stored,
  ): Promise<boolean | void>;

  protected static override _onCreateOperation(
    documents: JournalEntryPage.Stored[],
    operation: BaseJournalEntryPage.Database.OnCreateOperation,
    user: User.Stored,
  ): Promise<void>;

  protected override _preUpdate(
    changed: BaseJournalEntryPage.UpdateData,
    options: BaseJournalEntryPage.Database.PreUpdateOptions,
    user: User.Stored,
  ): Promise<boolean | void>;

  protected override _onUpdate(
    changed: BaseJournalEntryPage.UpdateData,
    options: BaseJournalEntryPage.Database.OnUpdateOptions,
    userId: string,
  ): void;

  protected static override _preUpdateOperation(
    documents: JournalEntryPage.Stored[],
    operation: BaseJournalEntryPage.Database.PreUpdateOperation,
    user: User.Stored,
  ): Promise<boolean | void>;

  protected static override _onUpdateOperation(
    documents: JournalEntryPage.Stored[],
    operation: BaseJournalEntryPage.Database.OnUpdateOperation,
    user: User.Stored,
  ): Promise<void>;

  protected override _preDelete(
    options: BaseJournalEntryPage.Database.PreDeleteOptions,
    user: User.Stored,
  ): Promise<boolean | void>;

  protected override _onDelete(options: BaseJournalEntryPage.Database.OnDeleteOptions, userId: string): void;

  protected static override _preDeleteOperation(
    documents: JournalEntryPage.Stored[],
    operation: BaseJournalEntryPage.Database.PreDeleteOperation,
    user: User.Stored,
  ): Promise<boolean | void>;

  protected static override _onDeleteOperation(
    documents: JournalEntryPage.Stored[],
    operation: BaseJournalEntryPage.Database.OnDeleteOperation,
    user: User.Stored,
  ): Promise<void>;

  /**
   * @deprecated "The `JournalEntryPage._onCreateDocuments` static method is deprecated in favor of
   * {@linkcode JournalEntryPage._onCreateOperation}" (since v12, until v14)
   */
  protected static override _onCreateDocuments(
    documents: JournalEntryPage.Implementation[],
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    context: BaseJournalEntryPage.Database.OnCreateDocumentsOperation,
  ): Promise<void>;

  /**
   * @deprecated "The `JournalEntryPage._onUpdateDocuments` static method is deprecated in favor of
   * {@linkcode JournalEntryPage._onUpdateOperation}" (since v12, until v14)
   */
  protected static override _onUpdateDocuments(
    documents: JournalEntryPage.Stored[],
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    context: BaseJournalEntryPage.Database.OnUpdateDocumentsOperation,
  ): Promise<void>;

  /**
   * @deprecated "The `JournalEntryPage._onDeleteDocuments` static method is deprecated in favor of
   * {@linkcode JournalEntryPage._onDeleteOperation}" (since v12, until v14)
   */
  protected static override _onDeleteDocuments(
    documents: JournalEntryPage.Stored[],
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    context: BaseJournalEntryPage.Database.OnDeleteDocumentsOperation,
  ): Promise<void>;

  /* DataModel overrides */

  protected static override _schema: SchemaField<BaseJournalEntryPage.Schema>;

  static override get schema(): SchemaField<BaseJournalEntryPage.Schema>;

  static override validateJoint(data: BaseJournalEntryPage.Source): void;

  static override fromSource(
    source: BaseJournalEntryPage.CreateData,
    context?: DataModel.FromSourceOptions,
  ): JournalEntryPage.Implementation;

  static override fromJSON(json: string): JournalEntryPage.Implementation;
}

export default BaseJournalEntryPage;

declare namespace BaseJournalEntryPage {
  // All types really live in the full document and are mirrored here for convenience
  export import Name = JournalEntryPage.Name;
  export import ConstructionContext = JournalEntryPage.ConstructionContext;
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  export import ConstructorArgs = JournalEntryPage.ConstructorArgs;
  export import Hierarchy = JournalEntryPage.Hierarchy;
  export import Metadata = JournalEntryPage.Metadata;
  export import SubType = JournalEntryPage.SubType;
  export import ConfiguredSubType = JournalEntryPage.ConfiguredSubType;
  export import Known = JournalEntryPage.Known;
  export import OfType = JournalEntryPage.OfType;
  export import SystemOfType = JournalEntryPage.SystemOfType;
  export import Parent = JournalEntryPage.Parent;
  export import Descendant = JournalEntryPage.Descendant;
  export import DescendantClass = JournalEntryPage.DescendantClass;
  export import Embedded = JournalEntryPage.Embedded;
  export import ParentCollectionName = JournalEntryPage.ParentCollectionName;
  export import CollectionClass = JournalEntryPage.CollectionClass;
  export import Collection = JournalEntryPage.Collection;
  export import Invalid = JournalEntryPage.Invalid;
  export import Source = JournalEntryPage.Source;
  export import CreateData = JournalEntryPage.CreateData;
  export import CreateInput = JournalEntryPage.CreateInput;
  export import CreateReturn = JournalEntryPage.CreateReturn;
  export import InitializedData = JournalEntryPage.InitializedData;
  export import UpdateData = JournalEntryPage.UpdateData;
  export import UpdateInput = JournalEntryPage.UpdateInput;
  export import Schema = JournalEntryPage.Schema;
  export import Database = JournalEntryPage.Database;
  export import TemporaryIf = JournalEntryPage.TemporaryIf;
  export import Flags = JournalEntryPage.Flags;

  namespace Internal {
    // Note(LukeAbby): The point of this is to give the base class of `JournalEntryPage` a name.
    // The expression `ClientDocumentMixin(BaseJournalEntryPage)` is more intuitive but it has worse
    // caching, likely due to the majority of tsc's caching working off of names.
    // See https://gist.github.com/LukeAbby/18a928fdc35c5d54dc121ed5dbf412fd.
    interface ClientDocument extends foundry.documents.abstract.ClientDocumentMixin.Mix<typeof BaseJournalEntryPage> {}
    const ClientDocument: ClientDocument;
  }

  // The document subclasses override `system` anyways.
  // There's no point in doing expensive computation work comparing the base class system.

  /** @internal */
  interface _Schema extends JournalEntryPage.Schema {
    system: any;
  }
}
