import type DataModel from "../abstract/data.d.mts";
import type Document from "../abstract/document.mts";
import type { SchemaField } from "../data/fields.d.mts";

/**
 * The Setting Document.
 * Defines the DataSchema and common behaviors for a Setting which are shared between both client and server.
 */
// Note(LukeAbby): You may wonder why documents don't simply pass the `Parent` generic parameter.
// This pattern evolved from trying to avoid circular loops and even internal tsc errors.
// See: https://gist.github.com/LukeAbby/0d01b6e20ef19ebc304d7d18cef9cc21
declare abstract class BaseSetting extends Document<"Setting", BaseSetting.Schema, any> {
  /**
   * @param data    - Initial data from which to construct the Setting
   * @param context - Construction context options
   */
  // TODO(LukeAbby): This constructor is a symptom of a circular error.
  // constructor(data: BaseSetting.ConstructorData, context?: Document.ConstructionContext<BaseSetting.Parent>);

  static override metadata: BaseSetting.Metadata;

  static override defineSchema(): BaseSetting.Schema;

  static canUserCreate(user: User.ConfiguredInstance): boolean;

  /*
   * After this point these are not really overridden methods.
   * They are here because they're static properties but depend on the instance and so can't be
   * defined DRY-ly while also being easily overridable.
   */

  static " __fvtt_types_internal_document_name_static": "Setting";

  static get implementation(): Setting.ImplementationClass;

  override parent: Setting.Parent;

  static createDocuments<Temporary extends boolean | undefined>(
    data: Array<Setting.Implementation | Setting.CreateData> | undefined,
    operation?: Document.Database.CreateOperation<Setting.DatabaseOperation.Create<Temporary>>,
  ): Promise<Array<Document.StoredIf<Setting.Implementation, Temporary>>>;

  static updateDocuments(
    updates: Setting.UpdateData[] | undefined,
    operation?: Document.Database.UpdateOperation<Setting.DatabaseOperation.Update>,
  ): Promise<Setting.Implementation[]>;

  static deleteDocuments(
    ids: readonly string[] | undefined,
    operation?: Document.Database.DeleteOperation<Setting.DatabaseOperation.Delete>,
  ): Promise<Setting.Implementation[]>;

  static create<Temporary extends boolean | undefined>(
    data: Setting.CreateData | Setting.CreateData[],
    operation?: Document.Database.CreateOperation<Setting.DatabaseOperation.Create<Temporary>>,
  ): Promise<Setting.Implementation | undefined>;

  static get(documentId: string, options?: Document.Database.GetOperation): Setting.Implementation | null;

  protected _preCreate(
    data: Setting.CreateData,
    options: Setting.DatabaseOperation.PreCreateOperationInstance,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected _onCreate(
    data: Setting.CreateData,
    options: Setting.DatabaseOperation.OnCreateOperation,
    userId: string,
  ): void;

  protected static _preCreateOperation(
    documents: Setting.Implementation[],
    operation: Document.Database.PreCreateOperationStatic<Setting.DatabaseOperation.Create>,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static _onCreateOperation(
    documents: Setting.Implementation[],
    operation: Setting.DatabaseOperation.Create,
    user: User.Implementation,
  ): Promise<void>;

  protected _preUpdate(
    changed: Setting.UpdateData,
    options: Setting.DatabaseOperation.PreUpdateOperationInstance,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected _onUpdate(
    changed: Setting.UpdateData,
    options: Setting.DatabaseOperation.OnUpdateOperation,
    userId: string,
  ): void;

  protected static _preUpdateOperation(
    documents: Setting.Implementation[],
    operation: Setting.DatabaseOperation.Update,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static _onUpdateOperation(
    documents: Setting.Implementation[],
    operation: Setting.DatabaseOperation.Update,
    user: User.Implementation,
  ): Promise<void>;

  protected _preDelete(
    options: Setting.DatabaseOperation.PreDeleteOperationInstance,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected _onDelete(options: Setting.DatabaseOperation.OnDeleteOperation, userId: string): void;

  protected static _preDeleteOperation(
    documents: Setting.Implementation[],
    operation: Setting.DatabaseOperation.Delete,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static _onDeleteOperation(
    documents: Setting.Implementation[],
    operation: Setting.DatabaseOperation.Delete,
    user: User.Implementation,
  ): Promise<void>;

  protected static _onCreateDocuments(
    documents: Setting.Implementation[],
    context: Document.ModificationContext<Setting.Parent>,
  ): Promise<void>;

  protected static _onUpdateDocuments(
    documents: Setting.Implementation[],
    context: Document.ModificationContext<Setting.Parent>,
  ): Promise<void>;

  protected static _onDeleteDocuments(
    documents: Setting.Implementation[],
    context: Document.ModificationContext<Setting.Parent>,
  ): Promise<void>;

  protected static _schema: SchemaField<Setting.Schema>;

  static get schema(): SchemaField<Setting.Schema>;

  static validateJoint(data: Setting.Source): void;

  static override fromSource(
    source: Setting.UpdateData,
    { strict, ...context }?: DataModel.FromSourceOptions,
  ): DataModel<Setting.Schema, DataModel.Any | null>;

  static override fromJSON(json: string): DataModel<Setting.Schema, DataModel.Any | null>;
}

export default BaseSetting;

declare namespace BaseSetting {
  export import Metadata = Setting.Metadata;
  export import Parent = Setting.Parent;
  export import Stored = Setting.Stored;
  export import Source = Setting.Source;
  export import PersistedData = Setting.PersistedData;
  export import CreateData = Setting.CreateData;
  export import InitializedData = Setting.InitializedData;
  export import UpdateData = Setting.UpdateData;
  export import Schema = Setting.Schema;
  export import DatabaseOperation = Setting.DatabaseOperation;

  /**
   * @deprecated This type is used by Foundry too vaguely.
   * In one context the most correct type is after initialization whereas in another one it should be
   * before but Foundry uses it interchangeably.
   */
  type Properties = SchemaField.InitializedData<Schema>;

  /**
   * @deprecated {@link foundry.data.fields.SchemaField | `SchemaField<BaseSetting.Schema>`}
   */
  type SchemaField = foundry.data.fields.SchemaField<Schema>;

  /**
   * @deprecated {@link BaseSetting.CreateData | `BaseSetting.CreateData`}
   */
  type ConstructorData = BaseSetting.CreateData;
}
