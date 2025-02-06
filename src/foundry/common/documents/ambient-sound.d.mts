import type { AnyMutableObject } from "fvtt-types/utils";
import type DataModel from "../abstract/data.d.mts";
import type Document from "../abstract/document.mts";
import type { SchemaField } from "../data/fields.d.mts";

/**
 * The Document definition for an AmbientSound.
 * Defines the DataSchema and common behaviors for an AmbientSound which are shared between both client and server.
 */
// Note(LukeAbby): You may wonder why documents don't simply pass the `Parent` generic parameter.
// This pattern evolved from trying to avoid circular loops and even internal tsc errors.
// See: https://gist.github.com/LukeAbby/0d01b6e20ef19ebc304d7d18cef9cc21
declare abstract class BaseAmbientSound extends Document<"AmbientSound", BaseAmbientSound.Schema, any> {
  /**
   * @param data    - Initial data from which to construct the `BaseAmbientSound`
   * @param context - Construction context options
   *
   * @deprecated Constructing `BaseAmbientSound` directly is not advised. The base document classes exist in
   * order to use documents on both the client (i.e. where all your code runs) and behind the scenes
   * on the server to manage document validation and storage.
   *
   * You should use {@link AmbientSoundDocument.implementation | `new AmbientSoundDocument.implementation(...)`} instead which will give you
   * a system specific implementation of `AmbientSoundDocument`.
   */
  constructor(...args: Document.ConstructorParameters<BaseAmbientSound.CreateData, BaseAmbientSound.Parent>);

  static override metadata: AmbientSoundDocument.Metadata;

  static override defineSchema(): BaseAmbientSound.Schema;

  static override migrateData(source: AnyMutableObject): AnyMutableObject;

  /*
   * After this point these are not really overridden methods.
   * They are here because they're static properties but depend on the instance and so can't be
   * defined DRY-ly while also being easily overrideable.
   */

  static " fvtt_types_internal_document_name_static": "AmbientLight";

  static get implementation(): AmbientSoundDocument.ImplementationClass;

  override parent: BaseAmbientSound.Parent;

  static createDocuments<Temporary extends boolean | undefined = false>(
    data: Array<AmbientSoundDocument.Implementation | AmbientSoundDocument.CreateData> | undefined,
    operation?: Document.Database.CreateOperation<AmbientSoundDocument.DatabaseOperation.Create<Temporary>>,
  ): Promise<Array<Document.StoredIf<AmbientSoundDocument.Implementation, Temporary>>>;

  static updateDocuments(
    updates: AmbientSoundDocument.UpdateData[] | undefined,
    operation?: Document.Database.UpdateOperation<AmbientSoundDocument.DatabaseOperation.Update>,
  ): Promise<AmbientSoundDocument.Implementation[]>;

  static deleteDocuments(
    ids: readonly string[] | undefined,
    operation?: Document.Database.DeleteOperation<AmbientSoundDocument.DatabaseOperation.Delete>,
  ): Promise<AmbientSoundDocument.Implementation[]>;

  static create<Temporary extends boolean | undefined = false>(
    data: AmbientSoundDocument.CreateData | AmbientSoundDocument.CreateData[],
    operation?: Document.Database.CreateOperation<AmbientSoundDocument.DatabaseOperation.Create<Temporary>>,
  ): Promise<AmbientSoundDocument.Implementation | undefined>;

  static get(documentId: string, options?: Document.Database.GetOperation): AmbientSoundDocument.Implementation | null;

  protected _preCreate(
    data: AmbientSoundDocument.CreateData,
    options: AmbientSoundDocument.DatabaseOperation.PreCreateOperationInstance,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected _onCreate(
    data: AmbientSoundDocument.CreateData,
    options: AmbientSoundDocument.DatabaseOperation.OnCreateOperation,
    userId: string,
  ): void;

  protected static _preCreateOperation(
    documents: AmbientSoundDocument.Implementation[],
    operation: Document.Database.PreCreateOperationStatic<AmbientSoundDocument.DatabaseOperation.Create>,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static _onCreateOperation(
    documents: AmbientSoundDocument.Implementation[],
    operation: AmbientSoundDocument.DatabaseOperation.Create,
    user: User.Implementation,
  ): Promise<void>;

  protected _preUpdate(
    changed: AmbientSoundDocument.UpdateData,
    options: AmbientSoundDocument.DatabaseOperation.PreUpdateOperationInstance,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected _onUpdate(
    changed: AmbientSoundDocument.UpdateData,
    options: AmbientSoundDocument.DatabaseOperation.OnUpdateOperation,
    userId: string,
  ): void;

  protected static _preUpdateOperation(
    documents: AmbientSoundDocument.Implementation[],
    operation: AmbientSoundDocument.DatabaseOperation.Update,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static _onUpdateOperation(
    documents: AmbientSoundDocument.Implementation[],
    operation: AmbientSoundDocument.DatabaseOperation.Update,
    user: User.Implementation,
  ): Promise<void>;

  protected _preDelete(
    options: AmbientSoundDocument.DatabaseOperation.PreDeleteOperationInstance,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected _onDelete(options: AmbientSoundDocument.DatabaseOperation.OnDeleteOperation, userId: string): void;

  protected static _preDeleteOperation(
    documents: AmbientSoundDocument.Implementation[],
    operation: AmbientSoundDocument.DatabaseOperation.Delete,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static _onDeleteOperation(
    documents: AmbientSoundDocument.Implementation[],
    operation: AmbientSoundDocument.DatabaseOperation.Delete,
    user: User.Implementation,
  ): Promise<void>;

  protected static _onCreateDocuments(
    documents: AmbientSoundDocument.Implementation[],
    context: Document.ModificationContext<AmbientSoundDocument.Parent>,
  ): Promise<void>;

  protected static _onUpdateDocuments(
    documents: AmbientSoundDocument.Implementation[],
    context: Document.ModificationContext<AmbientSoundDocument.Parent>,
  ): Promise<void>;

  protected static _onDeleteDocuments(
    documents: AmbientSoundDocument.Implementation[],
    context: Document.ModificationContext<AmbientSoundDocument.Parent>,
  ): Promise<void>;

  protected static _schema: SchemaField<AmbientSoundDocument.Schema>;

  static get schema(): SchemaField<AmbientSoundDocument.Schema>;

  static validateJoint(data: AmbientSoundDocument.Source): void;

  static override fromSource(
    source: AmbientSoundDocument.UpdateData,
    { strict, ...context }?: DataModel.FromSourceOptions,
  ): DataModel<AmbientSoundDocument.Schema, DataModel.Any | null>;

  static override fromJSON(json: string): DataModel<AmbientSoundDocument.Schema, DataModel.Any | null>;
}

export default BaseAmbientSound;

declare namespace BaseAmbientSound {
  export import Metadata = AmbientSoundDocument.Metadata;
  export import Parent = AmbientSoundDocument.Parent;
  export import Stored = AmbientSoundDocument.Stored;
  export import Source = AmbientSoundDocument.Source;
  export import PersistedData = AmbientSoundDocument.PersistedData;
  export import CreateData = AmbientSoundDocument.CreateData;
  export import InitializedData = AmbientSoundDocument.InitializedData;
  export import UpdateData = AmbientSoundDocument.UpdateData;
  export import Schema = AmbientSoundDocument.Schema;
  export import DatabaseOperation = AmbientSoundDocument.DatabaseOperation;

  /**
   * @deprecated This type is used by Foundry too vaguely.
   * In one context the most correct type is after initialization whereas in another one it should be
   * before but Foundry uses it interchangeably.
   */
  type Properties = SchemaField.InitializedData<Schema>;

  /**
   * @deprecated {@link foundry.data.fields.SchemaField | `SchemaField<BaseAmbientSound.Schema>`}
   */
  type SchemaField = foundry.data.fields.SchemaField<Schema>;

  /**
   * @deprecated {@link BaseAmbientSound.CreateData | `BaseAmbientSound.CreateData`}
   */
  type ConstructorData = BaseAmbientSound.CreateData;
}
