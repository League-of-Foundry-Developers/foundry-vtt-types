import type { AnyMutableObject } from "../../../utils/index.d.mts";
import type DataModel from "../abstract/data.d.mts";
import type Document from "../abstract/document.mts";
import type { SchemaField } from "../data/fields.d.mts";

/**
 * The Document definition for a Wall.
 * Defines the DataSchema and common behaviors for a Wall which are shared between both client and server.
 */
// Note(LukeAbby): You may wonder why documents don't simply pass the `Parent` generic parameter.
// This pattern evolved from trying to avoid circular loops and even internal tsc errors.
// See: https://gist.github.com/LukeAbby/0d01b6e20ef19ebc304d7d18cef9cc21
declare class BaseWall extends Document<"Wall", BaseWall.Schema, any> {
  /**
   * @param data    - Initial data from which to construct the `BaseWall`
   * @param context - Construction context options
   *
   * @deprecated Constructing `BaseWall` directly is not advised. The base document classes exist in
   * order to use documents on both the client (i.e. where all your code runs) and behind the scenes
   * on the server to manage document validation and storage.
   *
   * You should use {@link WallDocument.implementation | `new WallDocument.implementation(...)`} instead which will give you
   * a system specific implementation of `WallDocument`.
   */
  constructor(...args: Document.ConstructorParameters<BaseWall.CreateData, BaseWall.Parent>);

  static override metadata: BaseWall.Metadata;

  static override defineSchema(): BaseWall.Schema;

  static override migrateData(source: AnyMutableObject): AnyMutableObject;

  /*
   * After this point these are not really overridden methods.
   * They are here because they're static properties but depend on the instance and so can't be
   * defined DRY-ly while also being easily overridable.
   */

  static " fvtt_types_internal_document_name_static": "Wall";

  static get implementation(): WallDocument.ImplementationClass;

  override parent: WallDocument.Parent;

  static createDocuments<Temporary extends boolean | undefined = false>(
    data: Array<WallDocument.Implementation | WallDocument.CreateData> | undefined,
    operation?: Document.Database.CreateOperation<WallDocument.DatabaseOperation.Create<Temporary>>,
  ): Promise<Array<Document.StoredIf<WallDocument.Implementation, Temporary>>>;

  static updateDocuments(
    updates: WallDocument.UpdateData[] | undefined,
    operation?: Document.Database.UpdateOperation<WallDocument.DatabaseOperation.Update>,
  ): Promise<WallDocument.Implementation[]>;

  static deleteDocuments(
    ids: readonly string[] | undefined,
    operation?: Document.Database.DeleteOperation<WallDocument.DatabaseOperation.Delete>,
  ): Promise<WallDocument.Implementation[]>;

  static create<Temporary extends boolean | undefined = false>(
    data: WallDocument.CreateData | WallDocument.CreateData[],
    operation?: Document.Database.CreateOperation<WallDocument.DatabaseOperation.Create<Temporary>>,
  ): Promise<WallDocument.Implementation | undefined>;

  static get(documentId: string, options?: Document.Database.GetOperation): WallDocument.Implementation | null;

  protected _preCreate(
    data: WallDocument.CreateData,
    options: WallDocument.DatabaseOperation.PreCreateOperationInstance,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected _onCreate(
    data: WallDocument.CreateData,
    options: WallDocument.DatabaseOperation.OnCreateOperation,
    userId: string,
  ): void;

  protected static _preCreateOperation(
    documents: WallDocument.Implementation[],
    operation: Document.Database.PreCreateOperationStatic<WallDocument.DatabaseOperation.Create>,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static _onCreateOperation(
    documents: WallDocument.Implementation[],
    operation: WallDocument.DatabaseOperation.Create,
    user: User.Implementation,
  ): Promise<void>;

  protected _preUpdate(
    changed: WallDocument.UpdateData,
    options: WallDocument.DatabaseOperation.PreUpdateOperationInstance,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected _onUpdate(
    changed: WallDocument.UpdateData,
    options: WallDocument.DatabaseOperation.OnUpdateOperation,
    userId: string,
  ): void;

  protected static _preUpdateOperation(
    documents: WallDocument.Implementation[],
    operation: WallDocument.DatabaseOperation.Update,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static _onUpdateOperation(
    documents: WallDocument.Implementation[],
    operation: WallDocument.DatabaseOperation.Update,
    user: User.Implementation,
  ): Promise<void>;

  protected _preDelete(
    options: WallDocument.DatabaseOperation.PreDeleteOperationInstance,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected _onDelete(options: WallDocument.DatabaseOperation.OnDeleteOperation, userId: string): void;

  protected static _preDeleteOperation(
    documents: WallDocument.Implementation[],
    operation: WallDocument.DatabaseOperation.Delete,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static _onDeleteOperation(
    documents: WallDocument.Implementation[],
    operation: WallDocument.DatabaseOperation.Delete,
    user: User.Implementation,
  ): Promise<void>;

  protected static _onCreateDocuments(
    documents: WallDocument.Implementation[],
    context: Document.ModificationContext<WallDocument.Parent>,
  ): Promise<void>;

  protected static _onUpdateDocuments(
    documents: WallDocument.Implementation[],
    context: Document.ModificationContext<WallDocument.Parent>,
  ): Promise<void>;

  protected static _onDeleteDocuments(
    documents: WallDocument.Implementation[],
    context: Document.ModificationContext<WallDocument.Parent>,
  ): Promise<void>;

  protected static _schema: SchemaField<WallDocument.Schema>;

  static get schema(): SchemaField<WallDocument.Schema>;

  static validateJoint(data: WallDocument.Source): void;

  static override fromSource(
    source: WallDocument.UpdateData,
    { strict, ...context }?: DataModel.FromSourceOptions,
  ): DataModel<WallDocument.Schema, DataModel.Any | null>;

  static override fromJSON(json: string): DataModel<WallDocument.Schema, DataModel.Any | null>;
}

export default BaseWall;

declare namespace BaseWall {
  export import Metadata = WallDocument.Metadata;
  export import Parent = WallDocument.Parent;
  export import Stored = WallDocument.Stored;
  export import Source = WallDocument.Source;
  export import PersistedData = WallDocument.PersistedData;
  export import CreateData = WallDocument.CreateData;
  export import InitializedData = WallDocument.InitializedData;
  export import UpdateData = WallDocument.UpdateData;
  export import Schema = WallDocument.Schema;
  export import DatabaseOperation = WallDocument.DatabaseOperation;

  /**
   * @deprecated This type is used by Foundry too vaguely.
   * In one context the most correct type is after initialization whereas in another one it should be
   * before but Foundry uses it interchangeably.
   */
  type Properties = SchemaField.InitializedData<Schema>;

  /**
   * @deprecated {@link foundry.data.fields.SchemaField | `SchemaField<BaseWallDocument.Schema>`}
   */
  type SchemaField = foundry.data.fields.SchemaField<Schema>;

  /**
   * @deprecated {@link BaseWall.CreateData | `BaseWall.CreateData`}
   */
  type ConstructorData = BaseWall.CreateData;
}
