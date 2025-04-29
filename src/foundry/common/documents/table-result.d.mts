import type { AnyMutableObject, InexactPartial } from "fvtt-types/utils";
import type Document from "../abstract/document.mts";
import type * as CONST from "../constants.mts";
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
  out _SubType extends BaseTableResult.SubType = BaseTableResult.SubType,
> extends Document<"TableResult", BaseTableResult.Schema, any> {
  /**
   * @param data    - Initial data from which to construct the `BaseTableResult`
   * @param context - Construction context options
   *
   * @deprecated Constructing `BaseTableResult` directly is not advised. The base document classes exist in
   * order to use documents on both the client (i.e. where all your code runs) and behind the scenes
   * on the server to manage document validation and storage.
   *
   * You should use {@link TableResult.implementation | `new TableResult.implementation(...)`} instead which will give you
   * a system specific implementation of `TableResult`.
   */
  constructor(...args: TableResult.ConstructorArgs);

  static override metadata: BaseTableResult.Metadata;

  static override defineSchema(): BaseTableResult.Schema;

  override testUserPermission(
    user: User.Implementation,
    permission: keyof typeof CONST.DOCUMENT_OWNERSHIP_LEVELS | CONST.DOCUMENT_OWNERSHIP_LEVELS,
    options?: InexactPartial<{
      /**
       * Require the exact permission level requested?
       * @defaultValue `false`
       */
      exact: boolean;
    }>,
  ): boolean;

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

  static " fvtt_types_internal_document_name_static": "TableResult";

  // Same as Document for now
  protected static override _initializationOrder(): Generator<[string, DataField.Any]>;

  readonly parentCollection: TableResult.ParentCollectionName | null;

  readonly pack: string | null;

  static override get implementation(): TableResult.ImplementationClass;

  static get baseDocument(): typeof BaseTableResult;

  static get collectionName(): TableResult.ParentCollectionName;

  static get documentName(): TableResult.Name;

  static get TYPES(): BaseTableResult.SubType[];

  static get hasTypeData(): undefined;

  static get hierarchy(): TableResult.Hierarchy;

  override parent: BaseTableResult.Parent;

  static createDocuments<Temporary extends boolean | undefined = false>(
    data: Array<TableResult.Implementation | TableResult.CreateData> | undefined,
    operation?: Document.Database.CreateOperation<TableResult.Database.Create<Temporary>>,
  ): Promise<Array<Document.TemporaryIf<TableResult.Implementation, Temporary>>>;

  static updateDocuments(
    updates: TableResult.UpdateData[] | undefined,
    operation?: Document.Database.UpdateDocumentsOperation<TableResult.Database.Update>,
  ): Promise<TableResult.Implementation[]>;

  static deleteDocuments(
    ids: readonly string[] | undefined,
    operation?: Document.Database.DeleteDocumentsOperation<TableResult.Database.Delete>,
  ): Promise<TableResult.Implementation[]>;

  static override create<Temporary extends boolean | undefined = false>(
    data: TableResult.CreateData | TableResult.CreateData[],
    operation?: TableResult.Database.CreateOperation<Temporary>,
  ): Promise<Document.TemporaryIf<TableResult.Implementation, Temporary> | undefined>;

  override update(
    data: TableResult.UpdateData | undefined,
    operation?: TableResult.Database.UpdateOperation,
  ): Promise<this | undefined>;

  override delete(operation?: TableResult.Database.DeleteOperation): Promise<this | undefined>;

  static get(documentId: string, options?: TableResult.Database.GetOptions): TableResult.Implementation | null;

  static override getCollectionName(name: string): null;

  // Same as Document for now
  override traverseEmbeddedDocuments(_parentPath?: string): Generator<[string, Document.AnyChild<this>]>;

  override getFlag<Scope extends TableResult.Flags.Scope, Key extends TableResult.Flags.Key<Scope>>(
    scope: Scope,
    key: Key,
  ): Document.GetFlag<TableResult.Name, Scope, Key>;

  override setFlag<
    Scope extends TableResult.Flags.Scope,
    Key extends TableResult.Flags.Key<Scope>,
    Value extends Document.GetFlag<TableResult.Name, Scope, Key>,
  >(scope: Scope, key: Key, value: Value): Promise<this>;

  override unsetFlag<Scope extends TableResult.Flags.Scope, Key extends TableResult.Flags.Key<Scope>>(
    scope: Scope,
    key: Key,
  ): Promise<this>;

  protected _preCreate(
    data: TableResult.CreateData,
    options: TableResult.Database.PreCreateOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected _onCreate(
    data: TableResult.CreateData,
    options: TableResult.Database.OnCreateOperation,
    userId: string,
  ): void;

  protected static _preCreateOperation(
    documents: TableResult.Implementation[],
    operation: Document.Database.PreCreateOperationStatic<TableResult.Database.Create>,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static _onCreateOperation(
    documents: TableResult.Implementation[],
    operation: TableResult.Database.Create,
    user: User.Implementation,
  ): Promise<void>;

  protected _preUpdate(
    changed: TableResult.UpdateData,
    options: TableResult.Database.PreUpdateOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected _onUpdate(
    changed: TableResult.UpdateData,
    options: TableResult.Database.OnUpdateOperation,
    userId: string,
  ): void;

  protected static _preUpdateOperation(
    documents: TableResult.Implementation[],
    operation: TableResult.Database.Update,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static _onUpdateOperation(
    documents: TableResult.Implementation[],
    operation: TableResult.Database.Update,
    user: User.Implementation,
  ): Promise<void>;

  protected _preDelete(
    options: TableResult.Database.PreDeleteOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected _onDelete(options: TableResult.Database.OnDeleteOperation, userId: string): void;

  protected static _preDeleteOperation(
    documents: TableResult.Implementation[],
    operation: TableResult.Database.Delete,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static _onDeleteOperation(
    documents: TableResult.Implementation[],
    operation: TableResult.Database.Delete,
    user: User.Implementation,
  ): Promise<void>;

  static get hasSystemData(): undefined;

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

  protected static _onCreateDocuments(
    documents: TableResult.Implementation[],
    context: Document.ModificationContext<TableResult.Parent>,
  ): Promise<void>;

  protected static _onUpdateDocuments(
    documents: TableResult.Implementation[],
    context: Document.ModificationContext<TableResult.Parent>,
  ): Promise<void>;

  protected static _onDeleteDocuments(
    documents: TableResult.Implementation[],
    context: Document.ModificationContext<TableResult.Parent>,
  ): Promise<void>;

  /* DataModel overrides */

  protected static _schema: SchemaField<TableResult.Schema>;

  static get schema(): SchemaField<TableResult.Schema>;

  static validateJoint(data: TableResult.Source): void;

  // context: not null (destructured)
  static override fromSource(
    source: TableResult.CreateData,
    context?: Document.ConstructionContext<BaseTableResult.Parent>,
  ): TableResult.Implementation;

  static override fromJSON(json: string): TableResult.Implementation;
}

export default BaseTableResult;

declare namespace BaseTableResult {
  export import Name = TableResult.Name;
  export import ConstructorArgs = TableResult.ConstructorArgs;
  export import Hierarchy = TableResult.Hierarchy;
  export import Metadata = TableResult.Metadata;
  export import SubType = TableResult.SubType;
  export import ConfiguredSubTypes = TableResult.ConfiguredSubTypes;
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
  export import PersistedData = TableResult.PersistedData;
  export import CreateData = TableResult.CreateData;
  export import InitializedData = TableResult.InitializedData;
  export import UpdateData = TableResult.UpdateData;
  export import Schema = TableResult.Schema;
  export import DatabaseOperation = TableResult.Database;
  export import Flags = TableResult.Flags;

  /**
   * @deprecated This type is used by Foundry too vaguely.
   * In one context the most correct type is after initialization whereas in another one it should be
   * before but Foundry uses it interchangeably.
   */
  type Properties = SchemaField.InitializedData<Schema>;

  /** @deprecated {@link BaseTableResult.SubType | `BaseTableResult.SubType`} */
  type TypeNames = SubType;

  /**
   * @deprecated {@link foundry.data.fields.SchemaField | `SchemaField<BaseTableResult.Schema>`}
   */
  type SchemaField = foundry.data.fields.SchemaField<Schema>;

  /**
   * @deprecated {@link BaseTableResult.CreateData | `BaseTableResult.CreateData`}
   */
  type ConstructorData = BaseTableResult.CreateData;
}
