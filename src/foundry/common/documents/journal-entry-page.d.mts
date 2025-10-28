import type DataModel from "../abstract/data.d.mts";
import type Document from "../abstract/document.mts";
import type { DataField, SchemaField } from "../data/fields.d.mts";

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
   * You should use {@link JournalEntryPage.implementation | `new JournalEntryPage.implementation(...)`} instead which will give you
   * a system specific implementation of `JournalEntryPage`.
   */
  constructor(data: JournalEntryPage.CreateData, context?: JournalEntryPage.ConstructionContext);

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

  // Same as Document for now
  protected static override _initializationOrder(): Generator<[string, DataField.Any], void, undefined>;

  override readonly parentCollection: JournalEntryPage.ParentCollectionName | null;

  override readonly pack: string | null;

  static override get implementation(): JournalEntryPage.ImplementationClass;

  static override get baseDocument(): typeof BaseJournalEntryPage;

  static override get collectionName(): JournalEntryPage.ParentCollectionName;

  static override get documentName(): JournalEntryPage.Name;

  static override get TYPES(): BaseJournalEntryPage.SubType[];

  static override get hasTypeData(): true;

  static override get hierarchy(): JournalEntryPage.Hierarchy;

  override system: JournalEntryPage.SystemOfType<SubType>;

  override parent: BaseJournalEntryPage.Parent;

  static override createDocuments<Temporary extends boolean | undefined = undefined>(
    data: Array<JournalEntryPage.Implementation | JournalEntryPage.CreateData> | undefined,
    operation?: Document.Database.CreateDocumentsOperation<JournalEntryPage.Database.Create<Temporary>>,
  ): Promise<Array<JournalEntryPage.TemporaryIf<Temporary>>>;

  static override updateDocuments(
    updates: JournalEntryPage.UpdateData[] | undefined,
    operation?: Document.Database.UpdateDocumentsOperation<JournalEntryPage.Database.Update>,
  ): Promise<JournalEntryPage.Implementation[]>;

  static override deleteDocuments(
    ids: readonly string[] | undefined,
    operation?: Document.Database.DeleteDocumentsOperation<JournalEntryPage.Database.Delete>,
  ): Promise<JournalEntryPage.Implementation[]>;

  static override create<Temporary extends boolean | undefined = undefined>(
    data: JournalEntryPage.CreateData | JournalEntryPage.CreateData[],
    operation?: JournalEntryPage.Database.CreateOperation<Temporary>,
  ): Promise<JournalEntryPage.TemporaryIf<Temporary> | undefined>;

  override update(
    data: JournalEntryPage.UpdateData | undefined,
    operation?: JournalEntryPage.Database.UpdateOperation,
  ): Promise<this | undefined>;

  override delete(operation?: JournalEntryPage.Database.DeleteOperation): Promise<this | undefined>;

  static override get(
    documentId: string,
    options?: JournalEntryPage.Database.GetOptions,
  ): JournalEntryPage.Implementation | null;

  static override getCollectionName(name: string): null;

  // Same as Document for now
  override traverseEmbeddedDocuments(
    _parentPath?: string,
  ): Generator<[string, Document.AnyChild<this>], void, undefined>;

  override getFlag<Scope extends JournalEntryPage.Flags.Scope, Key extends JournalEntryPage.Flags.Key<Scope>>(
    scope: Scope,
    key: Key,
  ): JournalEntryPage.Flags.Get<Scope, Key>;

  override setFlag<
    Scope extends JournalEntryPage.Flags.Scope,
    Key extends JournalEntryPage.Flags.Key<Scope>,
    Value extends JournalEntryPage.Flags.Get<Scope, Key>,
  >(scope: Scope, key: Key, value: Value): Promise<this>;

  override unsetFlag<Scope extends JournalEntryPage.Flags.Scope, Key extends JournalEntryPage.Flags.Key<Scope>>(
    scope: Scope,
    key: Key,
  ): Promise<this>;

  protected override _preCreate(
    data: JournalEntryPage.CreateData,
    options: JournalEntryPage.Database.PreCreateOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected override _onCreate(
    data: JournalEntryPage.CreateData,
    options: JournalEntryPage.Database.OnCreateOperation,
    userId: string,
  ): void;

  protected static override _preCreateOperation(
    documents: JournalEntryPage.Implementation[],
    operation: Document.Database.PreCreateOperationStatic<JournalEntryPage.Database.Create>,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static override _onCreateOperation(
    documents: JournalEntryPage.Implementation[],
    operation: JournalEntryPage.Database.Create,
    user: User.Implementation,
  ): Promise<void>;

  protected override _preUpdate(
    changed: JournalEntryPage.UpdateData,
    options: JournalEntryPage.Database.PreUpdateOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected override _onUpdate(
    changed: JournalEntryPage.UpdateData,
    options: JournalEntryPage.Database.OnUpdateOperation,
    userId: string,
  ): void;

  protected static override _preUpdateOperation(
    documents: JournalEntryPage.Implementation[],
    operation: JournalEntryPage.Database.Update,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static override _onUpdateOperation(
    documents: JournalEntryPage.Implementation[],
    operation: JournalEntryPage.Database.Update,
    user: User.Implementation,
  ): Promise<void>;

  protected override _preDelete(
    options: JournalEntryPage.Database.PreDeleteOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected override _onDelete(options: JournalEntryPage.Database.OnDeleteOperation, userId: string): void;

  protected static override _preDeleteOperation(
    documents: JournalEntryPage.Implementation[],
    operation: JournalEntryPage.Database.Delete,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static override _onDeleteOperation(
    documents: JournalEntryPage.Implementation[],
    operation: JournalEntryPage.Database.Delete,
    user: User.Implementation,
  ): Promise<void>;

  /**
   * @deprecated since v12, will be removed in v14
   * @remarks "The `Document._onCreateDocuments` static method is deprecated in favor of {@link Document._onCreateOperation | `Document._onCreateOperation`}"
   */
  protected static override _onCreateDocuments(
    documents: JournalEntryPage.Implementation[],
    context: Document.ModificationContext<JournalEntryPage.Parent>,
  ): Promise<void>;

  /**
   * @deprecated since v12, will be removed in v14
   * @remarks "The `Document._onUpdateDocuments` static method is deprecated in favor of {@link Document._onUpdateOperation | `Document._onUpdateOperation`}"
   */
  protected static override _onUpdateDocuments(
    documents: JournalEntryPage.Implementation[],
    context: Document.ModificationContext<JournalEntryPage.Parent>,
  ): Promise<void>;

  /**
   * @deprecated since v12, will be removed in v14
   * @remarks "The `Document._onDeleteDocuments` static method is deprecated in favor of {@link Document._onDeleteOperation | `Document._onDeleteOperation`}"
   */
  protected static override _onDeleteDocuments(
    documents: JournalEntryPage.Implementation[],
    context: Document.ModificationContext<JournalEntryPage.Parent>,
  ): Promise<void>;

  /* DataModel overrides */

  protected static override _schema: SchemaField<JournalEntryPage.Schema>;

  static override get schema(): SchemaField<JournalEntryPage.Schema>;

  static override validateJoint(data: JournalEntryPage.Source): void;

  // options: not null (parameter default only, destructured in super)
  static override fromSource(
    source: JournalEntryPage.CreateData,
    context?: DataModel.FromSourceOptions,
  ): JournalEntryPage.Implementation;

  static override fromJSON(json: string): JournalEntryPage.Implementation;
}

export default BaseJournalEntryPage;

declare namespace BaseJournalEntryPage {
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
  export import Pack = JournalEntryPage.Pack;
  export import Embedded = JournalEntryPage.Embedded;
  export import ParentCollectionName = JournalEntryPage.ParentCollectionName;
  export import CollectionClass = JournalEntryPage.CollectionClass;
  export import Collection = JournalEntryPage.Collection;
  export import Invalid = JournalEntryPage.Invalid;
  export import Stored = JournalEntryPage.Stored;
  export import Source = JournalEntryPage.Source;
  export import CreateData = JournalEntryPage.CreateData;
  export import InitializedData = JournalEntryPage.InitializedData;
  export import UpdateData = JournalEntryPage.UpdateData;
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
