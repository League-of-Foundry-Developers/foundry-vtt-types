import type DataModel from "../abstract/data.d.mts";
import type Document from "../abstract/document.mts";
import type { SchemaField } from "../data/fields.d.mts";

type DataSchema = foundry.data.fields.DataSchema;

/**
 * The FogExploration Document.
 * Defines the DataSchema and common behaviors for FogExploration which are shared between both client and server.
 */
// Note(LukeAbby): You may wonder why documents don't simply pass the `Parent` generic parameter.
// This pattern evolved from trying to avoid circular loops and even internal tsc errors.
// See: https://gist.github.com/LukeAbby/0d01b6e20ef19ebc304d7d18cef9cc21
declare abstract class BaseFogExploration extends Document<"FogExploration", BaseFogExploration.Schema, any> {
  /**
   * @param data    - Initial data from which to construct the FogExploration
   * @param context - Construction context options
   */
  // TODO(LukeAbby): This constructor is a symptom of a circular error.
  // constructor(
  //   data?: BaseFogExploration.CreateData,
  //   context?: Document.ConstructionContext<BaseFogExploration.Parent>,
  // );

  static override metadata: BaseFogExploration.Metadata;

  static override defineSchema(): BaseFogExploration.Schema;

  static #canModify(user: User.Implementation, doc: BaseFogExploration);

  /*
   * After this point these are not really overridden methods.
   * They are here because they're static properties but depend on the instance and so can't be
   * defined DRY-ly while also being easily overridable.
   */

  static " fvtt_types_internal_document_name_static": "FogExploration";

  static get implementation(): FogExploration.ImplementationClass;

  override parent: FogExploration.Parent;

  static createDocuments<Temporary extends boolean | undefined = false>(
    data: Array<FogExploration.Implementation | FogExploration.CreateData> | undefined,
    operation?: Document.Database.CreateOperation<FogExploration.DatabaseOperation.Create<Temporary>>,
  ): Promise<Array<Document.StoredIf<FogExploration.Implementation, Temporary>>>;

  static updateDocuments(
    updates: FogExploration.UpdateData[] | undefined,
    operation?: Document.Database.UpdateOperation<FogExploration.DatabaseOperation.Update>,
  ): Promise<FogExploration.Implementation[]>;

  static deleteDocuments(
    ids: readonly string[] | undefined,
    operation?: Document.Database.DeleteOperation<FogExploration.DatabaseOperation.Delete>,
  ): Promise<FogExploration.Implementation[]>;

  static create<Temporary extends boolean | undefined = false>(
    data: FogExploration.CreateData | FogExploration.CreateData[],
    operation?: Document.Database.CreateOperation<FogExploration.DatabaseOperation.Create<Temporary>>,
  ): Promise<FogExploration.Implementation | undefined>;

  static get(documentId: string, options?: Document.Database.GetOperation): FogExploration.Implementation | null;

  protected _preCreate(
    data: FogExploration.CreateData,
    options: FogExploration.DatabaseOperation.PreCreateOperationInstance,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected _onCreate(
    data: FogExploration.CreateData,
    options: FogExploration.DatabaseOperation.OnCreateOperation,
    userId: string,
  ): void;

  protected static _preCreateOperation(
    documents: FogExploration.Implementation[],
    operation: Document.Database.PreCreateOperationStatic<FogExploration.DatabaseOperation.Create>,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static _onCreateOperation(
    documents: FogExploration.Implementation[],
    operation: FogExploration.DatabaseOperation.Create,
    user: User.Implementation,
  ): Promise<void>;

  protected _preUpdate(
    changed: FogExploration.UpdateData,
    options: FogExploration.DatabaseOperation.PreUpdateOperationInstance,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected _onUpdate(
    changed: FogExploration.UpdateData,
    options: FogExploration.DatabaseOperation.OnUpdateOperation,
    userId: string,
  ): void;

  protected static _preUpdateOperation(
    documents: FogExploration.Implementation[],
    operation: FogExploration.DatabaseOperation.Update,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static _onUpdateOperation(
    documents: FogExploration.Implementation[],
    operation: FogExploration.DatabaseOperation.Update,
    user: User.Implementation,
  ): Promise<void>;

  protected _preDelete(
    options: FogExploration.DatabaseOperation.PreDeleteOperationInstance,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected _onDelete(options: FogExploration.DatabaseOperation.OnDeleteOperation, userId: string): void;

  protected static _preDeleteOperation(
    documents: FogExploration.Implementation[],
    operation: FogExploration.DatabaseOperation.Delete,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static _onDeleteOperation(
    documents: FogExploration.Implementation[],
    operation: FogExploration.DatabaseOperation.Delete,
    user: User.Implementation,
  ): Promise<void>;

  protected static _onCreateDocuments(
    documents: FogExploration.Implementation[],
    context: Document.ModificationContext<FogExploration.Parent>,
  ): Promise<void>;

  protected static _onUpdateDocuments(
    documents: FogExploration.Implementation[],
    context: Document.ModificationContext<FogExploration.Parent>,
  ): Promise<void>;

  protected static _onDeleteDocuments(
    documents: FogExploration.Implementation[],
    context: Document.ModificationContext<FogExploration.Parent>,
  ): Promise<void>;

  protected static _schema: SchemaField<FogExploration.Schema>;

  static get schema(): SchemaField<FogExploration.Schema>;

  static validateJoint(data: FogExploration.Source): void;

  static override fromSource(
    source: FogExploration.UpdateData,
    { strict, ...context }?: DataModel.FromSourceOptions,
  ): DataModel<FogExploration.Schema, DataModel.Any | null>;

  static override fromJSON(json: string): DataModel<FogExploration.Schema, DataModel.Any | null>;
}

export default BaseFogExploration;

declare namespace BaseFogExploration {
  export import Metadata = FogExploration.Metadata;
  export import Parent = FogExploration.Parent;
  export import Stored = FogExploration.Stored;
  export import Source = FogExploration.Source;
  export import PersistedData = FogExploration.PersistedData;
  export import CreateData = FogExploration.CreateData;
  export import InitializedData = FogExploration.InitializedData;
  export import UpdateData = FogExploration.UpdateData;
  export import Schema = FogExploration.Schema;
  export import DatabaseOperation = FogExploration.DatabaseOperation;

  /**
   * @deprecated This type is used by Foundry too vaguely.
   * In one context the most correct type is after initialization whereas in another one it should be
   * before but Foundry uses it interchangeably.
   */
  type Properties = SchemaField.InitializedData<Schema>;

  /**
   * @deprecated {@link foundry.data.fields.SchemaField | `SchemaField<BaseFogExploration.Schema>`}
   */
  type SchemaField = foundry.data.fields.SchemaField<Schema>;

  /**
   * @deprecated {@link BaseFogExploration.CreateData | `BaseFogExploration.CreateData`}
   */
  type ConstructorData = BaseFogExploration.CreateData;
}
