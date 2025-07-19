import type { AnyMutableObject } from "#utils";
import type DataModel from "../abstract/data.d.mts";
import type Document from "../abstract/document.mts";
import type { DataField, SchemaField } from "../data/fields.d.mts";
import type { LogCompatibilityWarningOptions } from "../utils/logging.d.mts";

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
   * You should use {@link TableResult.implementation | `new TableResult.implementation(...)`} instead which will give you
   * a system specific implementation of `TableResult`.
   */
  constructor(data: TableResult.CreateData, context?: TableResult.ConstructionContext);

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

  // Same as Document for now
  protected static override _initializationOrder(): Generator<[string, DataField.Any], void, undefined>;

  override readonly parentCollection: TableResult.ParentCollectionName | null;

  override readonly pack: string | null;

  static override get implementation(): TableResult.ImplementationClass;

  static override get baseDocument(): typeof BaseTableResult;

  static override get collectionName(): TableResult.ParentCollectionName;

  static override get documentName(): TableResult.Name;

  static override get TYPES(): BaseTableResult.SubType[];

  static override get hasTypeData(): undefined;

  static override get hierarchy(): TableResult.Hierarchy;

  override parent: BaseTableResult.Parent;

  static override createDocuments<Temporary extends boolean | undefined = undefined>(
    data: Array<TableResult.Implementation | TableResult.CreateData> | undefined,
    operation?: Document.Database.CreateOperation<TableResult.Database.Create<Temporary>>,
  ): Promise<Array<TableResult.TemporaryIf<Temporary>>>;

  static override updateDocuments(
    updates: TableResult.UpdateData[] | undefined,
    operation?: Document.Database.UpdateDocumentsOperation<TableResult.Database.Update>,
  ): Promise<TableResult.Implementation[]>;

  static override deleteDocuments(
    ids: readonly string[] | undefined,
    operation?: Document.Database.DeleteDocumentsOperation<TableResult.Database.Delete>,
  ): Promise<TableResult.Implementation[]>;

  static override create<Temporary extends boolean | undefined = undefined>(
    data: TableResult.CreateData | TableResult.CreateData[],
    operation?: TableResult.Database.CreateOperation<Temporary>,
  ): Promise<TableResult.TemporaryIf<Temporary> | undefined>;

  override update(
    data: TableResult.UpdateData | undefined,
    operation?: TableResult.Database.UpdateOperation,
  ): Promise<this | undefined>;

  override delete(operation?: TableResult.Database.DeleteOperation): Promise<this | undefined>;

  static override get(documentId: string, options?: TableResult.Database.GetOptions): TableResult.Implementation | null;

  static override getCollectionName(name: string): null;

  // Same as Document for now
  override traverseEmbeddedDocuments(
    _parentPath?: string,
  ): Generator<[string, Document.AnyChild<this>], void, undefined>;

  override getFlag<Scope extends TableResult.Flags.Scope, Key extends TableResult.Flags.Key<Scope>>(
    scope: Scope,
    key: Key,
  ): TableResult.Flags.Get<Scope, Key>;

  override setFlag<
    Scope extends TableResult.Flags.Scope,
    Key extends TableResult.Flags.Key<Scope>,
    Value extends TableResult.Flags.Get<Scope, Key>,
  >(scope: Scope, key: Key, value: Value): Promise<this>;

  override unsetFlag<Scope extends TableResult.Flags.Scope, Key extends TableResult.Flags.Key<Scope>>(
    scope: Scope,
    key: Key,
  ): Promise<this>;

  protected override _preCreate(
    data: TableResult.CreateData,
    options: TableResult.Database.PreCreateOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected override _onCreate(
    data: TableResult.CreateData,
    options: TableResult.Database.OnCreateOperation,
    userId: string,
  ): void;

  protected static override _preCreateOperation(
    documents: TableResult.Implementation[],
    operation: Document.Database.PreCreateOperationStatic<TableResult.Database.Create>,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static override _onCreateOperation(
    documents: TableResult.Implementation[],
    operation: TableResult.Database.Create,
    user: User.Implementation,
  ): Promise<void>;

  protected override _preUpdate(
    changed: TableResult.UpdateData,
    options: TableResult.Database.PreUpdateOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected override _onUpdate(
    changed: TableResult.UpdateData,
    options: TableResult.Database.OnUpdateOperation,
    userId: string,
  ): void;

  protected static override _preUpdateOperation(
    documents: TableResult.Implementation[],
    operation: TableResult.Database.Update,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static override _onUpdateOperation(
    documents: TableResult.Implementation[],
    operation: TableResult.Database.Update,
    user: User.Implementation,
  ): Promise<void>;

  protected override _preDelete(
    options: TableResult.Database.PreDeleteOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected override _onDelete(options: TableResult.Database.OnDeleteOperation, userId: string): void;

  protected static override _preDeleteOperation(
    documents: TableResult.Implementation[],
    operation: TableResult.Database.Delete,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static override _onDeleteOperation(
    documents: TableResult.Implementation[],
    operation: TableResult.Database.Delete,
    user: User.Implementation,
  ): Promise<void>;

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
    documents: TableResult.Implementation[],
    context: Document.ModificationContext<TableResult.Parent>,
  ): Promise<void>;

  /**
   * @deprecated since v12, will be removed in v14
   * @remarks "The `Document._onUpdateDocuments` static method is deprecated in favor of {@link Document._onUpdateOperation | `Document._onUpdateOperation`}"
   */
  protected static override _onUpdateDocuments(
    documents: TableResult.Implementation[],
    context: Document.ModificationContext<TableResult.Parent>,
  ): Promise<void>;

  /**
   * @deprecated since v12, will be removed in v14
   * @remarks "The `Document._onDeleteDocuments` static method is deprecated in favor of {@link Document._onDeleteOperation | `Document._onDeleteOperation`}"
   */
  protected static override _onDeleteDocuments(
    documents: TableResult.Implementation[],
    context: Document.ModificationContext<TableResult.Parent>,
  ): Promise<void>;

  /* DataModel overrides */

  protected static override _schema: SchemaField<TableResult.Schema>;

  static override get schema(): SchemaField<TableResult.Schema>;

  static override validateJoint(data: TableResult.Source): void;

  // options: not null (parameter default only, destructured in super)
  static override fromSource(
    source: TableResult.CreateData,
    context?: DataModel.FromSourceOptions,
  ): TableResult.Implementation;

  static override fromJSON(json: string): TableResult.Implementation;

  static #BaseTableResult: true;
}

export default BaseTableResult;

declare namespace BaseTableResult {
  export import Name = TableResult.Name;
  export import ConstructionContext = TableResult.ConstructionContext;
  export import ConstructorArgs = TableResult.ConstructorArgs;
  export import Hierarchy = TableResult.Hierarchy;
  export import Metadata = TableResult.Metadata;
  export import SubType = TableResult.SubType;
  export import ConfiguredSubType = TableResult.ConfiguredSubType;
  export import Known = TableResult.Known;
  export import OfType = TableResult.OfType;
  export import Parent = TableResult.Parent;
  export import Descendant = TableResult.Descendant;
  export import DescendantClass = TableResult.DescendantClass;
  export import Pack = TableResult.Pack;
  export import Embedded = TableResult.Embedded;
  export import ParentCollectionName = TableResult.ParentCollectionName;
  export import CollectionClass = TableResult.CollectionClass;
  export import Collection = TableResult.Collection;
  export import Invalid = TableResult.Invalid;
  export import Stored = TableResult.Stored;
  export import Source = TableResult.Source;
  export import CreateData = TableResult.CreateData;
  export import InitializedData = TableResult.InitializedData;
  export import UpdateData = TableResult.UpdateData;
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
