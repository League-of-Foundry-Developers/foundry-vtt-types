import type DataModel from "../abstract/data.d.mts";
import type Document from "../abstract/document.mts";
import type { SchemaField } from "../data/fields.d.mts";

/**
 * The Region Document.
 * Defines the DataSchema and common behaviors for a Region which are shared between both client and server.
 */
declare abstract class BaseRegion extends Document<"Region", BaseRegion.Schema, any> {
  /**
   * Construct a Region document using provided data and context.
   * @param data        - Initial data from which to construct the Region
   * @param context     - Construction context options
   */
  // TODO(LukeAbby): This constructor is causing a circular error.
  // constructor(data: Partial<BaseRegion.ConstructorData>, context?: Document.ConstructionContext<BaseRegion.Parent>);

  static override metadata: BaseRegion.Metadata;

  static override defineSchema(): BaseRegion.Schema;

  /*
   * After this point these are not really overridden methods.
   * They are here because they're static properties but depend on the instance and so can't be
   * defined DRY-ly while also being easily overridable.
   */

  static "~ fvtt_types_internal_document_name_static": "Region";

  static get implementation(): RegionDocument.ImplementationClass;

  override parent: BaseRegion.Parent;

  static createDocuments<Temporary extends boolean | undefined = false>(
    data: Array<RegionDocument.Implementation | RegionDocument.CreateData> | undefined,
    operation?: Document.Database.CreateOperation<RegionDocument.DatabaseOperation.Create<Temporary>>,
  ): Promise<Array<Document.StoredIf<RegionDocument.Implementation, Temporary>>>;

  static updateDocuments(
    updates: RegionDocument.UpdateData[] | undefined,
    operation?: Document.Database.UpdateOperation<RegionDocument.DatabaseOperation.Update>,
  ): Promise<RegionDocument.Implementation[]>;

  static deleteDocuments(
    ids: readonly string[] | undefined,
    operation?: Document.Database.DeleteOperation<RegionDocument.DatabaseOperation.Delete>,
  ): Promise<RegionDocument.Implementation[]>;

  static create<Temporary extends boolean | undefined = false>(
    data: RegionDocument.CreateData | RegionDocument.CreateData[],
    operation?: Document.Database.CreateOperation<RegionDocument.DatabaseOperation.Create<Temporary>>,
  ): Promise<RegionDocument.Implementation | undefined>;

  static get(documentId: string, options?: Document.Database.GetOperation): RegionDocument.Implementation | null;

  protected _preCreate(
    data: RegionDocument.CreateData,
    options: RegionDocument.DatabaseOperation.PreCreateOperationInstance,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected _onCreate(
    data: RegionDocument.CreateData,
    options: RegionDocument.DatabaseOperation.OnCreateOperation,
    userId: string,
  ): void;

  protected static _preCreateOperation(
    documents: RegionDocument.Implementation[],
    operation: Document.Database.PreCreateOperationStatic<RegionDocument.DatabaseOperation.Create>,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static _onCreateOperation(
    documents: RegionDocument.Implementation[],
    operation: RegionDocument.DatabaseOperation.Create,
    user: User.Implementation,
  ): Promise<void>;

  protected _preUpdate(
    changed: RegionDocument.UpdateData,
    options: RegionDocument.DatabaseOperation.PreUpdateOperationInstance,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected _onUpdate(
    changed: RegionDocument.UpdateData,
    options: RegionDocument.DatabaseOperation.OnUpdateOperation,
    userId: string,
  ): void;

  protected static _preUpdateOperation(
    documents: RegionDocument.Implementation[],
    operation: RegionDocument.DatabaseOperation.Update,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static _onUpdateOperation(
    documents: RegionDocument.Implementation[],
    operation: RegionDocument.DatabaseOperation.Update,
    user: User.Implementation,
  ): Promise<void>;

  protected _preDelete(
    options: RegionDocument.DatabaseOperation.PreDeleteOperationInstance,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected _onDelete(options: RegionDocument.DatabaseOperation.OnDeleteOperation, userId: string): void;

  protected static _preDeleteOperation(
    documents: RegionDocument.Implementation[],
    operation: RegionDocument.DatabaseOperation.Delete,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static _onDeleteOperation(
    documents: RegionDocument.Implementation[],
    operation: RegionDocument.DatabaseOperation.Delete,
    user: User.Implementation,
  ): Promise<void>;

  protected static _onCreateDocuments(
    documents: RegionDocument.Implementation[],
    context: Document.ModificationContext<RegionDocument.Parent>,
  ): Promise<void>;

  protected static _onUpdateDocuments(
    documents: RegionDocument.Implementation[],
    context: Document.ModificationContext<RegionDocument.Parent>,
  ): Promise<void>;

  protected static _onDeleteDocuments(
    documents: RegionDocument.Implementation[],
    context: Document.ModificationContext<RegionDocument.Parent>,
  ): Promise<void>;

  protected static _schema: SchemaField<RegionDocument.Schema>;

  static get schema(): SchemaField<RegionDocument.Schema>;

  static validateJoint(data: RegionDocument.Source): void;

  static override fromSource(
    source: RegionDocument.UpdateData,
    { strict, ...context }?: DataModel.FromSourceOptions,
  ): DataModel<RegionDocument.Schema, DataModel.Any | null>;

  static override fromJSON(json: string): DataModel<RegionDocument.Schema, DataModel.Any | null>;
}

export default BaseRegion;

declare namespace BaseRegion {
  export import Metadata = RegionDocument.Metadata;
  export import Parent = RegionDocument.Parent;
  export import Stored = RegionDocument.Stored;
  export import Source = RegionDocument.Source;
  export import PersistedData = RegionDocument.PersistedData;
  export import CreateData = RegionDocument.CreateData;
  export import InitializedData = RegionDocument.InitializedData;
  export import UpdateData = RegionDocument.UpdateData;
  export import Schema = RegionDocument.Schema;
  export import DatabaseOperation = RegionDocument.DatabaseOperation;

  /**
   * @deprecated This type is used by Foundry too vaguely.
   * In one context the most correct type is after initialization whereas in another one it should be
   * before but Foundry uses it interchangeably.
   */
  type Properties = SchemaField.InitializedData<Schema>;

  /**
   * @deprecated {@link foundry.data.fields.SchemaField | `SchemaField<BaseRegionDocument.Schema>`}
   */
  type SchemaField = foundry.data.fields.SchemaField<Schema>;

  /**
   * @deprecated {@link BaseRegion.CreateData | `BaseRegionDocument.CreateData`}
   */
  type ConstructorData = BaseRegion.CreateData;
}
