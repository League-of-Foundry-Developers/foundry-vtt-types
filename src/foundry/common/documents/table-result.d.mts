import type { AnyMutableObject, InexactPartial } from "fvtt-types/utils";
import type DataModel from "../abstract/data.d.mts";
import type Document from "../abstract/document.mts";
import type * as CONST from "../constants.mts";
import type { SchemaField } from "../data/fields.d.mts";

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
  constructor(...args: Document.ConstructorParameters<BaseTableResult.CreateData, BaseTableResult.Parent>);

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
   * They are here because they're static properties but depend on the instance and so can't be
   * defined DRY-ly while also being easily overridable.
   */

  static " fvtt_types_internal_document_name_static": "TableResult";

  static get implementation(): TableResult.ImplementationClass;

  override parent: BaseTableResult.Parent;

  static get TYPES(): BaseTableResult.SubType[];

  static createDocuments<Temporary extends boolean | undefined = false>(
    data: Array<TableResult.Implementation | TableResult.CreateData> | undefined,
    operation?: Document.Database.CreateOperation<TableResult.DatabaseOperation.Create<Temporary>>,
  ): Promise<Array<Document.TemporaryIf<TableResult.Implementation, Temporary>>>;

  static updateDocuments(
    updates: TableResult.UpdateData[] | undefined,
    operation?: Document.Database.UpdateDocumentsOperation<TableResult.DatabaseOperation.Update>,
  ): Promise<TableResult.Implementation[]>;

  static deleteDocuments(
    ids: readonly string[] | undefined,
    operation?: Document.Database.DeleteDocumentsOperation<TableResult.DatabaseOperation.Delete>,
  ): Promise<TableResult.Implementation[]>;

  static create<Temporary extends boolean | undefined = false>(
    data: TableResult.CreateData | TableResult.CreateData[],
    operation?: Document.Database.CreateOperation<TableResult.DatabaseOperation.Create<Temporary>>,
  ): Promise<TableResult.Implementation | undefined>;

  static get(documentId: string, options?: Document.Database.GetOptions): TableResult.Implementation | null;

  protected _preCreate(
    data: TableResult.CreateData,
    options: TableResult.DatabaseOperation.PreCreateOperationInstance,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected _onCreate(
    data: TableResult.CreateData,
    options: TableResult.DatabaseOperation.OnCreateOperation,
    userId: string,
  ): void;

  protected static _preCreateOperation(
    documents: TableResult.Implementation[],
    operation: Document.Database.PreCreateOperationStatic<TableResult.DatabaseOperation.Create>,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static _onCreateOperation(
    documents: TableResult.Implementation[],
    operation: TableResult.DatabaseOperation.Create,
    user: User.Implementation,
  ): Promise<void>;

  protected _preUpdate(
    changed: TableResult.UpdateData,
    options: TableResult.DatabaseOperation.PreUpdateOperationInstance,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected _onUpdate(
    changed: TableResult.UpdateData,
    options: TableResult.DatabaseOperation.OnUpdateOperation,
    userId: string,
  ): void;

  protected static _preUpdateOperation(
    documents: TableResult.Implementation[],
    operation: TableResult.DatabaseOperation.Update,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static _onUpdateOperation(
    documents: TableResult.Implementation[],
    operation: TableResult.DatabaseOperation.Update,
    user: User.Implementation,
  ): Promise<void>;

  protected _preDelete(
    options: TableResult.DatabaseOperation.PreDeleteOperationInstance,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected _onDelete(options: TableResult.DatabaseOperation.OnDeleteOperation, userId: string): void;

  protected static _preDeleteOperation(
    documents: TableResult.Implementation[],
    operation: TableResult.DatabaseOperation.Delete,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static _onDeleteOperation(
    documents: TableResult.Implementation[],
    operation: TableResult.DatabaseOperation.Delete,
    user: User.Implementation,
  ): Promise<void>;

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

  protected static _schema: SchemaField<TableResult.Schema>;

  static get schema(): SchemaField<TableResult.Schema>;

  static validateJoint(data: TableResult.Source): void;

  static override fromSource(
    source: TableResult.UpdateData,
    { strict, ...context }?: DataModel.FromSourceOptions,
  ): DataModel<TableResult.Schema, DataModel.Any | null>;

  static override fromJSON(json: string): DataModel<TableResult.Schema, DataModel.Any | null>;
}

export default BaseTableResult;

declare namespace BaseTableResult {
  export import Metadata = TableResult.Metadata;
  export import SubType = TableResult.SubType;
  export import Parent = TableResult.Parent;
  export import Stored = TableResult.Stored;
  export import Source = TableResult.Source;
  export import PersistedData = TableResult.PersistedData;
  export import CreateData = TableResult.CreateData;
  export import InitializedData = TableResult.InitializedData;
  export import UpdateData = TableResult.UpdateData;
  export import Schema = TableResult.Schema;
  export import DatabaseOperation = TableResult.DatabaseOperation;
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
