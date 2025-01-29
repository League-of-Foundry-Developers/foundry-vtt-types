import type { AnyMutableObject } from "../../../utils/index.d.mts";
import type DataModel from "../abstract/data.d.mts";
import type Document from "../abstract/document.mts";
import type { SchemaField } from "../data/fields.d.mts";

type DataSchema = foundry.data.fields.DataSchema;

/**
 * The RollTable Document.
 * Defines the DataSchema and common behaviors for a RollTable which are shared between both client and server.
 */
// Note(LukeAbby): You may wonder why documents don't simply pass the `Parent` generic parameter.
// This pattern evolved from trying to avoid circular loops and even internal tsc errors.
// See: https://gist.github.com/LukeAbby/0d01b6e20ef19ebc304d7d18cef9cc21
declare abstract class BaseRollTable extends Document<"RollTable", BaseRollTable.Schema, any> {
  /**
   * @param data    - Initial data from which to construct the Roll Table
   * @param context - Construction context options
   */
  // TODO(LukeAbby): This constructor is a symptom of a circular error.
  // constructor(data: BaseRollTable.CreateData, context?: Document.ConstructionContext<BaseRollTable.Parent>);

  static override metadata: BaseRollTable.Metadata;

  static override defineSchema(): BaseRollTable.Schema;

  /**
   * The default icon used for newly created Macro documents
   */
  static DEFAULT_ICON: "icons/svg/d20-grey.svg";

  static override migrateData(source: AnyMutableObject): AnyMutableObject;

  /*
   * After this point these are not really overridden methods.
   * They are here because they're static properties but depend on the instance and so can't be
   * defined DRY-ly while also being easily overridable.
   */

  static " __fvtt_types_internal_document_name_static": "RollTable";

  static get implementation(): RollTable.ImplementationClass;

  override parent: RollTable.Parent;

  static createDocuments<Temporary extends boolean | undefined = false>(
    data: Array<RollTable.Implementation | RollTable.CreateData> | undefined,
    operation?: Document.Database.CreateOperation<RollTable.DatabaseOperation.Create<Temporary>>,
  ): Promise<Array<Document.StoredIf<RollTable.Implementation, Temporary>>>;

  static updateDocuments(
    updates: RollTable.UpdateData[] | undefined,
    operation?: Document.Database.UpdateOperation<RollTable.DatabaseOperation.Update>,
  ): Promise<RollTable.Implementation[]>;

  static deleteDocuments(
    ids: readonly string[] | undefined,
    operation?: Document.Database.DeleteOperation<RollTable.DatabaseOperation.Delete>,
  ): Promise<RollTable.Implementation[]>;

  static create<Temporary extends boolean | undefined = false>(
    data: RollTable.CreateData | RollTable.CreateData[],
    operation?: Document.Database.CreateOperation<RollTable.DatabaseOperation.Create<Temporary>>,
  ): Promise<RollTable.Implementation | undefined>;

  static get(documentId: string, options?: Document.Database.GetOperation): RollTable.Implementation | null;

  protected _preCreate(
    data: RollTable.CreateData,
    options: RollTable.DatabaseOperation.PreCreateOperationInstance,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected _onCreate(
    data: RollTable.CreateData,
    options: RollTable.DatabaseOperation.OnCreateOperation,
    userId: string,
  ): void;

  protected static _preCreateOperation(
    documents: RollTable.Implementation[],
    operation: Document.Database.PreCreateOperationStatic<RollTable.DatabaseOperation.Create>,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static _onCreateOperation(
    documents: RollTable.Implementation[],
    operation: RollTable.DatabaseOperation.Create,
    user: User.Implementation,
  ): Promise<void>;

  protected _preUpdate(
    changed: RollTable.UpdateData,
    options: RollTable.DatabaseOperation.PreUpdateOperationInstance,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected _onUpdate(
    changed: RollTable.UpdateData,
    options: RollTable.DatabaseOperation.OnUpdateOperation,
    userId: string,
  ): void;

  protected static _preUpdateOperation(
    documents: RollTable.Implementation[],
    operation: RollTable.DatabaseOperation.Update,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static _onUpdateOperation(
    documents: RollTable.Implementation[],
    operation: RollTable.DatabaseOperation.Update,
    user: User.Implementation,
  ): Promise<void>;

  protected _preDelete(
    options: RollTable.DatabaseOperation.PreDeleteOperationInstance,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected _onDelete(options: RollTable.DatabaseOperation.OnDeleteOperation, userId: string): void;

  protected static _preDeleteOperation(
    documents: RollTable.Implementation[],
    operation: RollTable.DatabaseOperation.Delete,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static _onDeleteOperation(
    documents: RollTable.Implementation[],
    operation: RollTable.DatabaseOperation.Delete,
    user: User.Implementation,
  ): Promise<void>;

  protected static _onCreateDocuments(
    documents: RollTable.Implementation[],
    context: Document.ModificationContext<RollTable.Parent>,
  ): Promise<void>;

  protected static _onUpdateDocuments(
    documents: RollTable.Implementation[],
    context: Document.ModificationContext<RollTable.Parent>,
  ): Promise<void>;

  protected static _onDeleteDocuments(
    documents: RollTable.Implementation[],
    context: Document.ModificationContext<RollTable.Parent>,
  ): Promise<void>;

  protected static _schema: SchemaField<RollTable.Schema>;

  static get schema(): SchemaField<RollTable.Schema>;

  static validateJoint(data: RollTable.Source): void;

  static override fromSource(
    source: RollTable.UpdateData,
    { strict, ...context }?: DataModel.FromSourceOptions,
  ): DataModel<RollTable.Schema, DataModel.Any | null>;

  static override fromJSON(json: string): DataModel<RollTable.Schema, DataModel.Any | null>;
}

export default BaseRollTable;

declare namespace BaseRollTable {
  export import Metadata = RollTable.Metadata;
  export import Parent = RollTable.Parent;
  export import Stored = RollTable.Stored;
  export import Source = RollTable.Source;
  export import PersistedData = RollTable.PersistedData;
  export import CreateData = RollTable.CreateData;
  export import InitializedData = RollTable.InitializedData;
  export import UpdateData = RollTable.UpdateData;
  export import Schema = RollTable.Schema;
  export import DatabaseOperation = RollTable.DatabaseOperation;

  /**
   * @deprecated This type is used by Foundry too vaguely.
   * In one context the most correct type is after initialization whereas in another one it should be
   * before but Foundry uses it interchangeably.
   */
  type Properties = SchemaField.InitializedData<Schema>;

  /**
   * @deprecated {@link foundry.data.fields.SchemaField | `SchemaField<BaseRollTable.Schema>`}
   */
  type SchemaField = foundry.data.fields.SchemaField<Schema>;

  /**
   * @deprecated {@link BaseRollTable.CreateData | `BaseRollTable.CreateData`}
   */
  type ConstructorData = BaseRollTable.CreateData;
}
