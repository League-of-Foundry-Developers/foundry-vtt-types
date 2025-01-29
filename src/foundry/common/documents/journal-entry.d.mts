import type { AnyMutableObject } from "../../../utils/index.d.mts";
import type DataModel from "../abstract/data.d.mts";
import type Document from "../abstract/document.mts";
import type { SchemaField } from "../data/fields.d.mts";

/**
 * The JournalEntry Document.
 * Defines the DataSchema and common behaviors for a JournalEntry which are shared between both client and server.
 */
// Note(LukeAbby): You may wonder why documents don't simply pass the `Parent` generic parameter.
// This pattern evolved from trying to avoid circular loops and even internal tsc errors.
// See: https://gist.github.com/LukeAbby/0d01b6e20ef19ebc304d7d18cef9cc21
declare abstract class BaseJournalEntry extends Document<"JournalEntry", BaseJournalEntry.Schema, any> {
  /**
   * @param data    - Initial data from which to construct the JournalEntry
   * @param context - Construction context options
   */
  // TODO(LukeAbby): This constructor is a symptom of a circular error.
  // constructor(data: BaseJournalEntry.CreateData, context?: Document.ConstructionContext<BaseJournalEntry.Parent>);

  static override metadata: BaseJournalEntry.Metadata;

  static override defineSchema(): BaseJournalEntry.Schema;

  static override migrateData(source: AnyMutableObject): AnyMutableObject;

  /*
   * After this point these are not really overridden methods.
   * They are here because they're static properties but depend on the instance and so can't be
   * defined DRY-ly while also being easily overridable.
   */

  static " fvtt_types_internal_document_name_static": "JournalEntry";

  static get implementation(): JournalEntry.ImplementationClass;

  override parent: JournalEntry.Parent;

  static createDocuments<Temporary extends boolean | undefined = false>(
    data: Array<JournalEntry.Implementation | JournalEntry.CreateData> | undefined,
    operation?: Document.Database.CreateOperation<JournalEntry.DatabaseOperation.Create<Temporary>>,
  ): Promise<Array<Document.StoredIf<JournalEntry.Implementation, Temporary>>>;

  static updateDocuments(
    updates: JournalEntry.UpdateData[] | undefined,
    operation?: Document.Database.UpdateOperation<JournalEntry.DatabaseOperation.Update>,
  ): Promise<JournalEntry.Implementation[]>;

  static deleteDocuments(
    ids: readonly string[] | undefined,
    operation?: Document.Database.DeleteOperation<JournalEntry.DatabaseOperation.Delete>,
  ): Promise<JournalEntry.Implementation[]>;

  static create<Temporary extends boolean | undefined = false>(
    data: JournalEntry.CreateData | JournalEntry.CreateData[],
    operation?: Document.Database.CreateOperation<JournalEntry.DatabaseOperation.Create<Temporary>>,
  ): Promise<JournalEntry.Implementation | undefined>;

  static get(documentId: string, options?: Document.Database.GetOperation): JournalEntry.Implementation | null;

  protected _preCreate(
    data: JournalEntry.CreateData,
    options: JournalEntry.DatabaseOperation.PreCreateOperationInstance,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected _onCreate(
    data: JournalEntry.CreateData,
    options: JournalEntry.DatabaseOperation.OnCreateOperation,
    userId: string,
  ): void;

  protected static _preCreateOperation(
    documents: JournalEntry.Implementation[],
    operation: Document.Database.PreCreateOperationStatic<JournalEntry.DatabaseOperation.Create>,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static _onCreateOperation(
    documents: JournalEntry.Implementation[],
    operation: JournalEntry.DatabaseOperation.Create,
    user: User.Implementation,
  ): Promise<void>;

  protected _preUpdate(
    changed: JournalEntry.UpdateData,
    options: JournalEntry.DatabaseOperation.PreUpdateOperationInstance,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected _onUpdate(
    changed: JournalEntry.UpdateData,
    options: JournalEntry.DatabaseOperation.OnUpdateOperation,
    userId: string,
  ): void;

  protected static _preUpdateOperation(
    documents: JournalEntry.Implementation[],
    operation: JournalEntry.DatabaseOperation.Update,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static _onUpdateOperation(
    documents: JournalEntry.Implementation[],
    operation: JournalEntry.DatabaseOperation.Update,
    user: User.Implementation,
  ): Promise<void>;

  protected _preDelete(
    options: JournalEntry.DatabaseOperation.PreDeleteOperationInstance,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected _onDelete(options: JournalEntry.DatabaseOperation.OnDeleteOperation, userId: string): void;

  protected static _preDeleteOperation(
    documents: JournalEntry.Implementation[],
    operation: JournalEntry.DatabaseOperation.Delete,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static _onDeleteOperation(
    documents: JournalEntry.Implementation[],
    operation: JournalEntry.DatabaseOperation.Delete,
    user: User.Implementation,
  ): Promise<void>;

  protected static _onCreateDocuments(
    documents: JournalEntry.Implementation[],
    context: Document.ModificationContext<JournalEntry.Parent>,
  ): Promise<void>;

  protected static _onUpdateDocuments(
    documents: JournalEntry.Implementation[],
    context: Document.ModificationContext<JournalEntry.Parent>,
  ): Promise<void>;

  protected static _onDeleteDocuments(
    documents: JournalEntry.Implementation[],
    context: Document.ModificationContext<JournalEntry.Parent>,
  ): Promise<void>;

  protected static _schema: SchemaField<JournalEntry.Schema>;

  static get schema(): SchemaField<JournalEntry.Schema>;

  static validateJoint(data: JournalEntry.Source): void;

  static override fromSource(
    source: JournalEntry.UpdateData,
    { strict, ...context }?: DataModel.FromSourceOptions,
  ): DataModel<JournalEntry.Schema, DataModel.Any | null>;

  static override fromJSON(json: string): DataModel<JournalEntry.Schema, DataModel.Any | null>;
}

export default BaseJournalEntry;

declare namespace BaseJournalEntry {
  export import Metadata = JournalEntry.Metadata;
  export import Parent = JournalEntry.Parent;
  export import Stored = JournalEntry.Stored;
  export import Source = JournalEntry.Source;
  export import PersistedData = JournalEntry.PersistedData;
  export import CreateData = JournalEntry.CreateData;
  export import InitializedData = JournalEntry.InitializedData;
  export import UpdateData = JournalEntry.UpdateData;
  export import Schema = JournalEntry.Schema;
  export import DatabaseOperation = JournalEntry.DatabaseOperation;
  export import CoreFlags = JournalEntry.CoreFlags;

  /**
   * @deprecated This type is used by Foundry too vaguely.
   * In one context the most correct type is after initialization whereas in another one it should be
   * before but Foundry uses it interchangeably.
   */
  type Properties = SchemaField.InitializedData<Schema>;

  /**
   * @deprecated {@link foundry.data.fields.SchemaField | `SchemaField<BaseJournalEntry.Schema>`}
   */
  type SchemaField = foundry.data.fields.SchemaField<Schema>;

  /**
   * @deprecated {@link BaseJournalEntry.CreateData | `BaseJournalEntry.CreateData`}
   */
  type ConstructorData = BaseJournalEntry.CreateData;
}
