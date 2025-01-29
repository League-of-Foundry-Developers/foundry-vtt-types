import type { AnyMutableObject } from "../../../utils/index.d.mts";
import type DataModel from "../abstract/data.d.mts";
import type Document from "../abstract/document.mts";
import type { SchemaField } from "../data/fields.d.mts";

/**
 * The Document definition for an AmbientLight.
 * Defines the DataSchema and common behaviors for an AmbientLight which are shared between both client and server.
 */
// Note(LukeAbby): You may wonder why documents don't simply pass the `Parent` generic parameter.
// This pattern evolved from trying to avoid circular loops and even internal tsc errors.
// See: https://gist.github.com/LukeAbby/0d01b6e20ef19ebc304d7d18cef9cc21
declare abstract class BaseAmbientLight extends Document<"AmbientLight", BaseAmbientLight.Schema, any> {
  /**
   * @param data    - Initial data from which to construct the AmbientLight
   * @param context - Construction context options
   */
  // TODO(LukeAbby): This constructor is a symptom of a circular error.
  // constructor(data?: BaseAmbientLight.ConstructorData, context?: Document.ConstructionContext<BaseAmbientLight.Parent>);

  static override metadata: BaseAmbientLight.Metadata;

  static override defineSchema(): BaseAmbientLight.Schema;

  static override migrateData(source: AnyMutableObject): AnyMutableObject;

  /*
   * After this point these are not really overridden methods.
   * They are here because they're static properties but depend on the instance and so can't be
   * defined DRY-ly while also being easily overrideable.
   */

  static " fvtt_types_internal_document_name_static": "AmbientLight";

  static get implementation(): AmbientLightDocument.ImplementationClass;

  override parent: BaseAmbientLight.Parent;

  static createDocuments<Temporary extends boolean | undefined = false>(
    data: Array<AmbientLightDocument.Implementation | AmbientLightDocument.CreateData> | undefined,
    operation?: Document.Database.CreateOperation<AmbientLightDocument.DatabaseOperation.Create<Temporary>>,
  ): Promise<Array<Document.StoredIf<AmbientLightDocument.Implementation, Temporary>>>;

  static updateDocuments(
    updates: AmbientLightDocument.UpdateData[] | undefined,
    operation?: Document.Database.UpdateOperation<AmbientLightDocument.DatabaseOperation.Update>,
  ): Promise<AmbientLightDocument.Implementation[]>;

  static deleteDocuments(
    ids: readonly string[] | undefined,
    operation?: Document.Database.DeleteOperation<AmbientLightDocument.DatabaseOperation.Delete>,
  ): Promise<AmbientLightDocument.Implementation[]>;

  static create<Temporary extends boolean | undefined = false>(
    data: AmbientLightDocument.CreateData | AmbientLightDocument.CreateData[],
    operation?: Document.Database.CreateOperation<AmbientLightDocument.DatabaseOperation.Create<Temporary>>,
  ): Promise<AmbientLightDocument.Implementation | undefined>;

  static get(documentId: string, options?: Document.Database.GetOperation): AmbientLightDocument.Implementation | null;

  protected _preCreate(
    data: AmbientLightDocument.CreateData,
    options: AmbientLightDocument.DatabaseOperation.PreCreateOperationInstance,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected _onCreate(
    data: AmbientLightDocument.CreateData,
    options: AmbientLightDocument.DatabaseOperation.OnCreateOperation,
    userId: string,
  ): void;

  protected static _preCreateOperation(
    documents: AmbientLightDocument.Implementation[],
    operation: Document.Database.PreCreateOperationStatic<AmbientLightDocument.DatabaseOperation.Create>,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static _onCreateOperation(
    documents: AmbientLightDocument.Implementation[],
    operation: AmbientLightDocument.DatabaseOperation.Create,
    user: User.Implementation,
  ): Promise<void>;

  protected _preUpdate(
    changed: AmbientLightDocument.UpdateData,
    options: AmbientLightDocument.DatabaseOperation.PreUpdateOperationInstance,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected _onUpdate(
    changed: AmbientLightDocument.UpdateData,
    options: AmbientLightDocument.DatabaseOperation.OnUpdateOperation,
    userId: string,
  ): void;

  protected static _preUpdateOperation(
    documents: AmbientLightDocument.Implementation[],
    operation: AmbientLightDocument.DatabaseOperation.Update,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static _onUpdateOperation(
    documents: AmbientLightDocument.Implementation[],
    operation: AmbientLightDocument.DatabaseOperation.Update,
    user: User.Implementation,
  ): Promise<void>;

  protected _preDelete(
    options: AmbientLightDocument.DatabaseOperation.PreDeleteOperationInstance,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected _onDelete(options: AmbientLightDocument.DatabaseOperation.OnDeleteOperation, userId: string): void;

  protected static _preDeleteOperation(
    documents: AmbientLightDocument.Implementation[],
    operation: AmbientLightDocument.DatabaseOperation.Delete,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static _onDeleteOperation(
    documents: AmbientLightDocument.Implementation[],
    operation: AmbientLightDocument.DatabaseOperation.Delete,
    user: User.Implementation,
  ): Promise<void>;

  protected static _onCreateDocuments(
    documents: AmbientLightDocument.Implementation[],
    context: Document.ModificationContext<AmbientLightDocument.Parent>,
  ): Promise<void>;

  protected static _onUpdateDocuments(
    documents: AmbientLightDocument.Implementation[],
    context: Document.ModificationContext<AmbientLightDocument.Parent>,
  ): Promise<void>;

  protected static _onDeleteDocuments(
    documents: AmbientLightDocument.Implementation[],
    context: Document.ModificationContext<AmbientLightDocument.Parent>,
  ): Promise<void>;

  protected static _schema: SchemaField<AmbientLightDocument.Schema>;

  static get schema(): SchemaField<AmbientLightDocument.Schema>;

  static validateJoint(data: AmbientLightDocument.Source): void;

  static override fromSource(
    source: AmbientLightDocument.UpdateData,
    { strict, ...context }?: DataModel.FromSourceOptions,
  ): DataModel<AmbientLightDocument.Schema, DataModel.Any | null>;

  static override fromJSON(json: string): DataModel<AmbientLightDocument.Schema, DataModel.Any | null>;
}

export default BaseAmbientLight;

declare namespace BaseAmbientLight {
  export import Metadata = AmbientLightDocument.Metadata;
  export import Parent = AmbientLightDocument.Parent;
  export import Stored = AmbientLightDocument.Stored;
  export import Source = AmbientLightDocument.Source;
  export import PersistedData = AmbientLightDocument.PersistedData;
  export import CreateData = AmbientLightDocument.CreateData;
  export import InitializedData = AmbientLightDocument.InitializedData;
  export import UpdateData = AmbientLightDocument.UpdateData;
  export import Schema = AmbientLightDocument.Schema;
  export import DatabaseOperation = AmbientLightDocument.DatabaseOperation;
  export import CoreFlags = AmbientLightDocument.CoreFlags;

  /**
   * @deprecated This type is used by Foundry too vaguely.
   * In one context the most correct type is after initialization whereas in another one it should be
   * before but Foundry uses it interchangeably.
   */
  type Properties = SchemaField.InitializedData<Schema>;

  /**
   * @deprecated {@link foundry.data.fields.SchemaField | `SchemaField<BaseAmbientLight.Schema>`}
   */
  type SchemaField = foundry.data.fields.SchemaField<Schema>;

  /**
   * @deprecated {@link BaseAmbientLight.CreateData | `BaseAmbientLight.CreateData`}
   */
  type ConstructorData = BaseAmbientLight.CreateData;
}
