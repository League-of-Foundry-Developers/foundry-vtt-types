import type DataModel from "../abstract/data.d.mts";
import type Document from "../abstract/document.mts";
import type { SchemaField } from "../data/fields.d.mts";

/**
 * The JournalEntryPage Document.
 * Defines the DataSchema and common behaviors for a JournalEntryPage which are shared between both client and server.
 */
declare abstract class BaseJournalEntryPage<
  out SubType extends BaseJournalEntryPage.SubType = BaseJournalEntryPage.SubType,
> extends Document<"JournalEntryPage", BaseJournalEntryPage._Schema, any> {
  /**
   * @param data    - Initial data from which to construct the JournalEntryPage.
   * @param context - Construction context options.
   */
  // TODO(LukeAbby): This constructor is a symptom of a circular error.
  // constructor(
  //   data: BaseJournalEntryPage.CreateData,
  //   context?: Document.ConstructionContext<BaseJournalEntryPage.Parent>,
  // );

  _source: BaseJournalEntryPage.Source;

  static override metadata: BaseJournalEntryPage.Metadata;

  static override defineSchema(): BaseJournalEntryPage.Schema;

  override getUserLevel(user?: User.Implementation): foundry.CONST.DOCUMENT_OWNERSHIP_LEVELS | null;

  /*
   * After this point these are not really overridden methods.
   * They are here because they're static properties but depend on the instance and so can't be
   * defined DRY-ly while also being easily overridable.
   */

  static "~ fvtt_types_internal_document_name_static": "JournalEntryPage";

  static get implementation(): JournalEntryPage.ImplementationClass;

  override system: Document.SystemFor<"JournalEntryPage", SubType>;

  override parent: BaseJournalEntryPage.Parent;

  static get TYPES(): BaseJournalEntryPage.SubType[];

  static createDocuments<Temporary extends boolean | undefined = false>(
    data: Array<JournalEntryPage.Implementation | JournalEntryPage.CreateData> | undefined,
    operation?: Document.Database.CreateOperation<JournalEntryPage.DatabaseOperation.Create<Temporary>>,
  ): Promise<Array<Document.StoredIf<JournalEntryPage.Implementation, Temporary>>>;

  static updateDocuments(
    updates: JournalEntryPage.UpdateData[] | undefined,
    operation?: Document.Database.UpdateOperation<JournalEntryPage.DatabaseOperation.Update>,
  ): Promise<JournalEntryPage.Implementation[]>;

  static deleteDocuments(
    ids: readonly string[] | undefined,
    operation?: Document.Database.DeleteOperation<JournalEntryPage.DatabaseOperation.Delete>,
  ): Promise<JournalEntryPage.Implementation[]>;

  static create<Temporary extends boolean | undefined = false>(
    data: JournalEntryPage.CreateData | JournalEntryPage.CreateData[],
    operation?: Document.Database.CreateOperation<JournalEntryPage.DatabaseOperation.Create<Temporary>>,
  ): Promise<JournalEntryPage.Implementation | undefined>;

  static get(documentId: string, options?: Document.Database.GetOperation): JournalEntryPage.Implementation | null;

  protected _preCreate(
    data: JournalEntryPage.CreateData,
    options: JournalEntryPage.DatabaseOperation.PreCreateOperationInstance,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected _onCreate(
    data: JournalEntryPage.CreateData,
    options: JournalEntryPage.DatabaseOperation.OnCreateOperation,
    userId: string,
  ): void;

  protected static _preCreateOperation(
    documents: JournalEntryPage.Implementation[],
    operation: Document.Database.PreCreateOperationStatic<JournalEntryPage.DatabaseOperation.Create>,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static _onCreateOperation(
    documents: JournalEntryPage.Implementation[],
    operation: JournalEntryPage.DatabaseOperation.Create,
    user: User.Implementation,
  ): Promise<void>;

  protected _preUpdate(
    changed: JournalEntryPage.UpdateData,
    options: JournalEntryPage.DatabaseOperation.PreUpdateOperationInstance,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected _onUpdate(
    changed: JournalEntryPage.UpdateData,
    options: JournalEntryPage.DatabaseOperation.OnUpdateOperation,
    userId: string,
  ): void;

  protected static _preUpdateOperation(
    documents: JournalEntryPage.Implementation[],
    operation: JournalEntryPage.DatabaseOperation.Update,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static _onUpdateOperation(
    documents: JournalEntryPage.Implementation[],
    operation: JournalEntryPage.DatabaseOperation.Update,
    user: User.Implementation,
  ): Promise<void>;

  protected _preDelete(
    options: JournalEntryPage.DatabaseOperation.PreDeleteOperationInstance,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected _onDelete(options: JournalEntryPage.DatabaseOperation.OnDeleteOperation, userId: string): void;

  protected static _preDeleteOperation(
    documents: JournalEntryPage.Implementation[],
    operation: JournalEntryPage.DatabaseOperation.Delete,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static _onDeleteOperation(
    documents: JournalEntryPage.Implementation[],
    operation: JournalEntryPage.DatabaseOperation.Delete,
    user: User.Implementation,
  ): Promise<void>;

  protected static _onCreateDocuments(
    documents: JournalEntryPage.Implementation[],
    context: Document.ModificationContext<JournalEntryPage.Parent>,
  ): Promise<void>;

  protected static _onUpdateDocuments(
    documents: JournalEntryPage.Implementation[],
    context: Document.ModificationContext<JournalEntryPage.Parent>,
  ): Promise<void>;

  protected static _onDeleteDocuments(
    documents: JournalEntryPage.Implementation[],
    context: Document.ModificationContext<JournalEntryPage.Parent>,
  ): Promise<void>;

  protected static _schema: SchemaField<JournalEntryPage.Schema>;

  static get schema(): SchemaField<JournalEntryPage.Schema>;

  static validateJoint(data: JournalEntryPage.Source): void;

  static override fromSource(
    source: JournalEntryPage.UpdateData,
    { strict, ...context }?: DataModel.FromSourceOptions,
  ): DataModel<JournalEntryPage.Schema, DataModel.Any | null>;

  static override fromJSON(json: string): DataModel<JournalEntryPage.Schema, DataModel.Any | null>;
}

export default BaseJournalEntryPage;

declare namespace BaseJournalEntryPage {
  export import Metadata = JournalEntryPage.Metadata;
  export import SubType = JournalEntryPage.SubType;
  export import Parent = JournalEntryPage.Parent;
  export import Stored = JournalEntryPage.Stored;
  export import Source = JournalEntryPage.Source;
  export import PersistedData = JournalEntryPage.PersistedData;
  export import CreateData = JournalEntryPage.CreateData;
  export import InitializedData = JournalEntryPage.InitializedData;
  export import UpdateData = JournalEntryPage.UpdateData;
  export import Schema = JournalEntryPage.Schema;
  export import DatabaseOperation = JournalEntryPage.DatabaseOperation;

  // The document subclasses override `system` anyways.
  // There's no point in doing expensive computation work comparing the base class system.
  /** @internal */
  interface _Schema extends JournalEntryPage.Schema {
    system: any;
  }

  /**
   * @deprecated This type is used by Foundry too vaguely.
   * In one context the most correct type is after initialization whereas in another one it should be
   * before but Foundry uses it interchangeably.
   */
  type Properties = SchemaField.InitializedData<Schema>;

  /** @deprecated {@link BaseJournalEntryPage.SubType | `BaseJournalEntryPage.SubType`} */
  type TypeNames = SubType;

  /**
   * @deprecated {@link foundry.data.fields.SchemaField | `SchemaField<BaseJournalEntryPage.Schema>`}
   */
  type SchemaField = foundry.data.fields.SchemaField<Schema>;

  /**
   * @deprecated {@link BaseJournalEntryPage.CreateData | `BaseJournalEntryPage.CreateData`}
   */
  type ConstructorData = BaseJournalEntryPage.CreateData;
}
