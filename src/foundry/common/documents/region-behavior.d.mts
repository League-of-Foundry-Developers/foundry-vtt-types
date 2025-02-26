import type DataModel from "../abstract/data.d.mts";
import type Document from "../abstract/document.mts";
import type { SchemaField } from "../data/fields.d.mts";

/**
 * The RegionBehavior Document.
 * Defines the DataSchema and common behaviors for a RegionBehavior which are shared between both client and server.
 */
declare abstract class BaseRegionBehavior<
  out SubType extends BaseRegionBehavior.SubType = BaseRegionBehavior.SubType,
> extends Document<"RegionBehavior", BaseRegionBehavior._Schema, any> {
  #baseRegionBehavior: true;

  /**
   * @param data    - Initial data from which to construct the `BaseRegionBehavior`
   * @param context - Construction context options
   *
   * @deprecated Constructing `BaseRegionBehavior` directly is not advised. The base document classes exist in
   * order to use documents on both the client (i.e. where all your code runs) and behind the scenes
   * on the server to manage document validation and storage.
   *
   * You should use {@link RegionBehavior.implementation | `new RegionBehavior.implementation(...)`} instead which will give you
   * a system specific implementation of `RegionBehavior`.
   */
  constructor(...args: Document.ConstructorParameters<BaseRegionBehavior.CreateData, BaseRegionBehavior.Parent>);

  static override metadata: BaseRegionBehavior.Metadata;

  static override defineSchema(): BaseRegionBehavior.Schema;

  static override canUserCreate(user: User.Implementation): boolean;

  /*
   * After this point these are not really overridden methods.
   * They are here because they're static properties but depend on the instance and so can't be
   * defined DRY-ly while also being easily overridable.
   */

  static " fvtt_types_internal_document_name_static": "RegionBehavior";

  static get implementation(): RegionBehavior.ImplementationClass;

  override system: Document.SystemFor<"RegionBehavior", SubType>;

  override parent: BaseRegionBehavior.Parent;

  static get TYPES(): BaseRegionBehavior.SubType[];

  static createDocuments<Temporary extends boolean | undefined = false>(
    data: Array<RegionBehavior.Implementation | RegionBehavior.CreateData> | undefined,
    operation?: Document.Database.CreateOperation<RegionBehavior.DatabaseOperation.Create<Temporary>>,
  ): Promise<Array<Document.TemporaryIf<RegionBehavior.Implementation, Temporary>>>;

  static updateDocuments(
    updates: RegionBehavior.UpdateData[] | undefined,
    operation?: Document.Database.UpdateDocumentsOperation<RegionBehavior.DatabaseOperation.Update>,
  ): Promise<RegionBehavior.Implementation[]>;

  static deleteDocuments(
    ids: readonly string[] | undefined,
    operation?: Document.Database.DeleteDocumentsOperation<RegionBehavior.DatabaseOperation.Delete>,
  ): Promise<RegionBehavior.Implementation[]>;

  static create<Temporary extends boolean | undefined = false>(
    data: RegionBehavior.CreateData | RegionBehavior.CreateData[],
    operation?: Document.Database.CreateOperation<RegionBehavior.DatabaseOperation.Create<Temporary>>,
  ): Promise<RegionBehavior.Implementation | undefined>;

  static get(documentId: string, options?: Document.Database.GetOptions): RegionBehavior.Implementation | null;

  protected _preCreate(
    data: RegionBehavior.CreateData,
    options: RegionBehavior.DatabaseOperation.PreCreateOperationInstance,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected _onCreate(
    data: RegionBehavior.CreateData,
    options: RegionBehavior.DatabaseOperation.OnCreateOperation,
    userId: string,
  ): void;

  protected static _preCreateOperation(
    documents: RegionBehavior.Implementation[],
    operation: Document.Database.PreCreateOperationStatic<RegionBehavior.DatabaseOperation.Create>,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static _onCreateOperation(
    documents: RegionBehavior.Implementation[],
    operation: RegionBehavior.DatabaseOperation.Create,
    user: User.Implementation,
  ): Promise<void>;

  protected _preUpdate(
    changed: RegionBehavior.UpdateData,
    options: RegionBehavior.DatabaseOperation.PreUpdateOperationInstance,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected _onUpdate(
    changed: RegionBehavior.UpdateData,
    options: RegionBehavior.DatabaseOperation.OnUpdateOperation,
    userId: string,
  ): void;

  protected static _preUpdateOperation(
    documents: RegionBehavior.Implementation[],
    operation: RegionBehavior.DatabaseOperation.Update,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static _onUpdateOperation(
    documents: RegionBehavior.Implementation[],
    operation: RegionBehavior.DatabaseOperation.Update,
    user: User.Implementation,
  ): Promise<void>;

  protected _preDelete(
    options: RegionBehavior.DatabaseOperation.PreDeleteOperationInstance,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected _onDelete(options: RegionBehavior.DatabaseOperation.OnDeleteOperation, userId: string): void;

  protected static _preDeleteOperation(
    documents: RegionBehavior.Implementation[],
    operation: RegionBehavior.DatabaseOperation.Delete,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static _onDeleteOperation(
    documents: RegionBehavior.Implementation[],
    operation: RegionBehavior.DatabaseOperation.Delete,
    user: User.Implementation,
  ): Promise<void>;

  protected static _onCreateDocuments(
    documents: RegionBehavior.Implementation[],
    context: Document.ModificationContext<RegionBehavior.Parent>,
  ): Promise<void>;

  protected static _onUpdateDocuments(
    documents: RegionBehavior.Implementation[],
    context: Document.ModificationContext<RegionBehavior.Parent>,
  ): Promise<void>;

  protected static _onDeleteDocuments(
    documents: RegionBehavior.Implementation[],
    context: Document.ModificationContext<RegionBehavior.Parent>,
  ): Promise<void>;

  protected static _schema: SchemaField<RegionBehavior.Schema>;

  static get schema(): SchemaField<RegionBehavior.Schema>;

  static validateJoint(data: RegionBehavior.Source): void;

  static override fromSource(
    source: RegionBehavior.UpdateData,
    { strict, ...context }?: DataModel.FromSourceOptions,
  ): DataModel<RegionBehavior.Schema, DataModel.Any | null>;

  static override fromJSON(json: string): DataModel<RegionBehavior.Schema, DataModel.Any | null>;
}

export default BaseRegionBehavior;

declare namespace BaseRegionBehavior {
  export import Metadata = RegionBehavior.Metadata;
  export import SubType = RegionBehavior.SubType;
  export import Parent = RegionBehavior.Parent;
  export import Stored = RegionBehavior.Stored;
  export import Source = RegionBehavior.Source;
  export import PersistedData = RegionBehavior.PersistedData;
  export import CreateData = RegionBehavior.CreateData;
  export import InitializedData = RegionBehavior.InitializedData;
  export import UpdateData = RegionBehavior.UpdateData;
  export import Schema = RegionBehavior.Schema;
  export import DatabaseOperation = RegionBehavior.DatabaseOperation;

  // The document subclasses override `system` anyways.
  // There's no point in doing expensive computation work comparing the base class system.
  /** @internal */
  interface _Schema extends RegionBehavior.Schema {
    system: any;
  }

  /**
   * @deprecated This type is used by Foundry too vaguely.
   * In one context the most correct type is after initialization whereas in another one it should be
   * before but Foundry uses it interchangeably.
   */
  type Properties = SchemaField.InitializedData<Schema>;

  /** @deprecated {@link BaseRegionBehavior.SubType | `BaseRegionBehavior.SubType`} */
  type TypeNames = SubType;

  /**
   * @deprecated {@link foundry.data.fields.SchemaField | `SchemaField<BaseRegionBehavior.Schema>`}
   */
  type SchemaField = foundry.data.fields.SchemaField<Schema>;

  /**
   * @deprecated {@link BaseRegionBehavior.CreateData | `BaseRegionBehavior.CreateData`}
   */
  type ConstructorData = BaseRegionBehavior.CreateData;
}
