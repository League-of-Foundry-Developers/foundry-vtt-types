import type { AnyMutableObject } from "#utils";
import type { DataModel, Document } from "#common/abstract/_module.d.mts";
import type { SchemaField } from "#common/data/fields.d.mts";

/**
 * The TableResult Document.
 * Defines the DataSchema and common behaviors for a TableResult which are shared between both client and server.
 */
// Note(LukeAbby): You may wonder why documents don't simply pass the `Parent` generic parameter.
// This pattern evolved from trying to avoid circular loops and even internal tsc errors.
// See: https://gist.github.com/LukeAbby/0d01b6e20ef19ebc304d7d18cef9cc21
declare abstract class BaseTableResult<
  out SubType extends BaseTableResult.SubType = BaseTableResult.SubType,
> extends Document<"TableResult", BaseTableResult.Schema, any> {
  /**
   * @param data    - Initial data from which to construct the `BaseTableResult`
   * @param context - Construction context options
   *
   * @remarks Constructing `BaseTableResult` directly is not advised. The base document classes exist in
   * order to use documents on both the client (i.e. where all your code runs) and behind the scenes
   * on the server to manage document validation and storage.
   *
   * You should use {@linkcode TableResult.implementation | new TableResult.implementation(...)} instead which will give you
   * a system specific implementation of `TableResult`.
   */
  constructor(data: BaseTableResult.CreateData, context?: BaseTableResult.ConstructionContext);

  /**
   * @defaultValue
   * ```js
   * mergeObject(super.metadata, {
   *   name: "TableResult",
   *   collection: "results",
   *   label: "DOCUMENT.TableResult",
   *   labelPlural: "DOCUMENT.TableResults",
   *   coreTypes: Object.values(CONST.TABLE_RESULT_TYPES),
   *   permissions: {
   *     create: "OWNER",
   *     update: this.#canUpdate,
   *     delete: "OWNER"
   *   },
   *   compendiumIndexFields: ["type"],
   *   schemaVersion: "13.341"
   * });
   * ```
   */
  static override metadata: BaseTableResult.Metadata;

  /** @defaultValue `["TABLE_RESULT"]` */
  static override LOCALIZATION_PREFIXES: string[];

  static override defineSchema(): BaseTableResult.Schema;

  /**
   * @deprecated since V13 until V15
   */
  get text(): string;

  /**
   * @deprecated since V13 until V15
   */
  get documentId(): string | null;

  /**
   * @deprecated since v13 until V15
   */
  get documentCollection(): string;

  /**
   * @remarks
   * Migrations:
   * - Numeric `type`s to their new — since v12 — string values
   */
  static override migrateData(source: AnyMutableObject): AnyMutableObject;

  static override shimData(data: AnyMutableObject, options?: DataModel.ShimDataOptions): AnyMutableObject;

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

  override readonly parentCollection: BaseTableResult.ParentCollectionName | null;

  override get pack(): string | null;

  static override get implementation(): TableResult.ImplementationClass;

  static override get baseDocument(): typeof BaseTableResult;

  static override get collectionName(): BaseTableResult.ParentCollectionName;

  static override get documentName(): BaseTableResult.Name;

  static override get TYPES(): BaseTableResult.SubType[];

  static override get hasTypeData(): false;

  static override readonly hierarchy: BaseTableResult.Hierarchy;

  override parent: BaseTableResult.Parent;

  override " fvtt_types_internal_document_parent": BaseTableResult.Parent;

  static override createDocuments<Temporary extends boolean | undefined = undefined>(
    data: BaseTableResult.CreateInput[],
    operation?: Document.Database.CreateOperation<BaseTableResult.Database.Create<Temporary>>,
  ): Promise<Array<BaseTableResult.TemporaryIf<Temporary>>>;

  static override updateDocuments(
    updates: BaseTableResult.UpdateInput[],
    operation?: Document.Database.UpdateDocumentsOperation<BaseTableResult.Database.Update>,
  ): Promise<Array<TableResult.Stored>>;

  static override deleteDocuments(
    ids: readonly string[],
    operation?: Document.Database.DeleteDocumentsOperation<BaseTableResult.Database.Delete>,
  ): Promise<Array<TableResult.Stored>>;

  static override create<Temporary extends boolean | undefined = undefined>(
    data: BaseTableResult.CreateData | BaseTableResult.CreateData[],
    operation?: BaseTableResult.Database.CreateOperation<Temporary>,
  ): Promise<BaseTableResult.TemporaryIf<Temporary> | undefined>;

  override update(
    data: BaseTableResult.UpdateInput,
    operation?: BaseTableResult.Database.UpdateOperation,
  ): Promise<this | undefined>;

  override delete(operation?: BaseTableResult.Database.DeleteOperation): Promise<this | undefined>;

  static override get(
    documentId: string,
    options?: BaseTableResult.Database.GetOptions,
  ): TableResult.Implementation | null;

  static override getCollectionName(name: string): null;

  override getFlag<Scope extends BaseTableResult.Flags.Scope, Key extends BaseTableResult.Flags.Key<Scope>>(
    scope: Scope,
    key: Key,
  ): BaseTableResult.Flags.Get<Scope, Key>;

  override setFlag<
    Scope extends BaseTableResult.Flags.Scope,
    Key extends BaseTableResult.Flags.Key<Scope>,
    Value extends BaseTableResult.Flags.Get<Scope, Key>,
  >(scope: Scope, key: Key, value: Value): Promise<this | undefined>;

  override unsetFlag<Scope extends BaseTableResult.Flags.Scope, Key extends BaseTableResult.Flags.Key<Scope>>(
    scope: Scope,
    key: Key,
  ): Promise<this | undefined>;

  protected override _preCreate(
    data: BaseTableResult.CreateData,
    options: BaseTableResult.Database.PreCreateOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected override _onCreate(
    data: BaseTableResult.CreateData,
    options: BaseTableResult.Database.OnCreateOperation,
    userId: string,
  ): void;

  protected static override _preCreateOperation(
    documents: TableResult.Implementation[],
    operation: Document.Database.PreCreateOperationStatic<BaseTableResult.Database.Create>,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static override _onCreateOperation(
    documents: TableResult.Implementation[],
    operation: BaseTableResult.Database.Create,
    user: User.Implementation,
  ): Promise<void>;

  protected override _preUpdate(
    changed: BaseTableResult.UpdateData,
    options: BaseTableResult.Database.PreUpdateOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected override _onUpdate(
    changed: BaseTableResult.UpdateData,
    options: BaseTableResult.Database.OnUpdateOperation,
    userId: string,
  ): void;

  protected static override _preUpdateOperation(
    documents: TableResult.Implementation[],
    operation: BaseTableResult.Database.Update,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static override _onUpdateOperation(
    documents: TableResult.Implementation[],
    operation: BaseTableResult.Database.Update,
    user: User.Implementation,
  ): Promise<void>;

  protected override _preDelete(
    options: BaseTableResult.Database.PreDeleteOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected override _onDelete(options: BaseTableResult.Database.OnDeleteOperation, userId: string): void;

  protected static override _preDeleteOperation(
    documents: TableResult.Implementation[],
    operation: BaseTableResult.Database.Delete,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static override _onDeleteOperation(
    documents: TableResult.Implementation[],
    operation: BaseTableResult.Database.Delete,
    user: User.Implementation,
  ): Promise<void>;

  /**
   * @deprecated "The `TableResult._onCreateDocuments` static method is deprecated in favor of
   * {@linkcode TableResult._onCreateOperation}" (since v12, until v14)
   */
  protected static override _onCreateDocuments(
    documents: TableResult.Implementation[],
    context: BaseTableResult.Database.OnCreateDocumentsContext,
  ): Promise<void>;

  /**
   * @deprecated "The `TableResult._onUpdateDocuments` static method is deprecated in favor of
   * {@linkcode TableResult._onUpdateOperation}" (since v12, until v14)
   */
  protected static override _onUpdateDocuments(
    documents: TableResult.Stored[],
    context: BaseTableResult.Database.OnUpdateDocumentsContext,
  ): Promise<void>;

  /**
   * @deprecated "The `TableResult._onDeleteDocuments` static method is deprecated in favor of
   * {@linkcode TableResult._onDeleteOperation}" (since v12, until v14)
   */
  protected static override _onDeleteDocuments(
    documents: TableResult.Stored[],
    context: BaseTableResult.Database.OnDeleteDocumentsContext,
  ): Promise<void>;

  /* DataModel overrides */

  protected static override _schema: SchemaField<BaseTableResult.Schema>;

  static override get schema(): SchemaField<BaseTableResult.Schema>;

  static override validateJoint(data: BaseTableResult.Source): void;

  static override fromSource(
    source: BaseTableResult.CreateData,
    context?: DataModel.FromSourceOptions,
  ): TableResult.Implementation;

  static override fromJSON(json: string): TableResult.Implementation;

  static #BaseTableResult: true;
}

export default BaseTableResult;

declare namespace BaseTableResult {
  // All types really live in the full document and are mirrored here for convenience
  export import Name = TableResult.Name;
  export import ConstructionContext = TableResult.ConstructionContext;
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  export import ConstructorArgs = TableResult.ConstructorArgs;
  export import Hierarchy = TableResult.Hierarchy;
  export import Metadata = TableResult.Metadata;
  export import SubType = TableResult.SubType;
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  export import ConfiguredSubType = TableResult.ConfiguredSubType;
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  export import Known = TableResult.Known;
  export import OfType = TableResult.OfType;
  export import Parent = TableResult.Parent;
  export import Descendant = TableResult.Descendant;
  export import DescendantClass = TableResult.DescendantClass;
  export import Embedded = TableResult.Embedded;
  export import ParentCollectionName = TableResult.ParentCollectionName;
  export import CollectionClass = TableResult.CollectionClass;
  export import Collection = TableResult.Collection;
  export import Invalid = TableResult.Invalid;
  export import Stored = TableResult.Stored;
  export import Source = TableResult.Source;
  export import CreateData = TableResult.CreateData;
  export import CreateInput = TableResult.CreateInput;
  export import CreateReturn = TableResult.CreateReturn;
  export import InitializedData = TableResult.InitializedData;
  export import UpdateData = TableResult.UpdateData;
  export import UpdateInput = TableResult.UpdateInput;
  export import Schema = TableResult.Schema;
  export import Database = TableResult.Database;
  export import TemporaryIf = TableResult.TemporaryIf;
  export import Flags = TableResult.Flags;

  namespace Internal {
    // Note(LukeAbby): The point of this is to give the base class of `TableResult` a name.
    // The expression `ClientDocumentMixin(BaseTableResult)` is more intuitive but it has worse
    // caching, likely due to the majority of tsc's caching working off of names.
    // See https://gist.github.com/LukeAbby/18a928fdc35c5d54dc121ed5dbf412fd.
    interface ClientDocument extends foundry.documents.abstract.ClientDocumentMixin.Mix<typeof BaseTableResult> {}
    const ClientDocument: ClientDocument;
  }
}
