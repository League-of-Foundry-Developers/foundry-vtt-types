import type { AnyObject, AnyMutableObject } from "../../../utils/index.d.mts";
import type DataModel from "../abstract/data.d.mts";
import type Document from "../abstract/document.mts";
import type { SchemaField } from "../data/fields.d.mts";

/**
 * The Document definition for a Scene.
 * Defines the DataSchema and common behaviors for a Scene which are shared between both client and server.
 */
// Note(LukeAbby): You may wonder why documents don't simply pass the `Parent` generic parameter.
// This pattern evolved from trying to avoid circular loops and even internal tsc errors.
// See: https://gist.github.com/LukeAbby/0d01b6e20ef19ebc304d7d18cef9cc21
declare abstract class BaseScene extends Document<"Scene", BaseScene.Schema, any> {
  /**
   * @param data    - Initial data from which to construct the Scene
   * @param context - Construction context options
   */
  // TODO(LukeAbby): This constructor is a symptom of a circular error.
  // constructor(data: BaseScene.CreateData, context?: Document.ConstructionContext<BaseScene.Parent>);

  static override metadata: BaseScene.Metadata;

  static override defineSchema(): BaseScene.Schema;

  static override migrateData(source: AnyMutableObject): AnyMutableObject;

  static override shimData(
    data: AnyObject,
    options?: {
      /**
       * Apply shims to embedded models?
       * @defaultValue `true`
       */
      embedded?: boolean;
    },
  ): AnyObject;

  /*
   * After this point these are not really overridden methods.
   * They are here because they're static properties but depend on the instance and so can't be
   * defined DRY-ly while also being easily overridable.
   */

  static "~ fvtt_types_internal_document_name_static": "Scene";

  static get implementation(): Scene.ImplementationClass;

  override parent: Scene.Parent;

  static createDocuments<Temporary extends boolean | undefined = false>(
    data: Array<Scene.Implementation | Scene.CreateData> | undefined,
    operation?: Document.Database.CreateOperation<Scene.DatabaseOperation.Create<Temporary>>,
  ): Promise<Array<Document.StoredIf<Scene.Implementation, Temporary>>>;

  static updateDocuments(
    updates: Scene.UpdateData[] | undefined,
    operation?: Document.Database.UpdateOperation<Scene.DatabaseOperation.Update>,
  ): Promise<Scene.Implementation[]>;

  static deleteDocuments(
    ids: readonly string[] | undefined,
    operation?: Document.Database.DeleteOperation<Scene.DatabaseOperation.Delete>,
  ): Promise<Scene.Implementation[]>;

  static create<Temporary extends boolean | undefined = false>(
    data: Scene.CreateData | Scene.CreateData[],
    operation?: Document.Database.CreateOperation<Scene.DatabaseOperation.Create<Temporary>>,
  ): Promise<Scene.Implementation | undefined>;

  static get(documentId: string, options?: Document.Database.GetOperation): Scene.Implementation | null;

  protected _preCreate(
    data: Scene.CreateData,
    options: Scene.DatabaseOperation.PreCreateOperationInstance,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected _onCreate(data: Scene.CreateData, options: Scene.DatabaseOperation.OnCreateOperation, userId: string): void;

  protected static _preCreateOperation(
    documents: Scene.Implementation[],
    operation: Document.Database.PreCreateOperationStatic<Scene.DatabaseOperation.Create>,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static _onCreateOperation(
    documents: Scene.Implementation[],
    operation: Scene.DatabaseOperation.Create,
    user: User.Implementation,
  ): Promise<void>;

  protected _preUpdate(
    changed: Scene.UpdateData,
    options: Scene.DatabaseOperation.PreUpdateOperationInstance,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected _onUpdate(
    changed: Scene.UpdateData,
    options: Scene.DatabaseOperation.OnUpdateOperation,
    userId: string,
  ): void;

  protected static _preUpdateOperation(
    documents: Scene.Implementation[],
    operation: Scene.DatabaseOperation.Update,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static _onUpdateOperation(
    documents: Scene.Implementation[],
    operation: Scene.DatabaseOperation.Update,
    user: User.Implementation,
  ): Promise<void>;

  protected _preDelete(
    options: Scene.DatabaseOperation.PreDeleteOperationInstance,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected _onDelete(options: Scene.DatabaseOperation.OnDeleteOperation, userId: string): void;

  protected static _preDeleteOperation(
    documents: Scene.Implementation[],
    operation: Scene.DatabaseOperation.Delete,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static _onDeleteOperation(
    documents: Scene.Implementation[],
    operation: Scene.DatabaseOperation.Delete,
    user: User.Implementation,
  ): Promise<void>;

  protected static _onCreateDocuments(
    documents: Scene.Implementation[],
    context: Document.ModificationContext<Scene.Parent>,
  ): Promise<void>;

  protected static _onUpdateDocuments(
    documents: Scene.Implementation[],
    context: Document.ModificationContext<Scene.Parent>,
  ): Promise<void>;

  protected static _onDeleteDocuments(
    documents: Scene.Implementation[],
    context: Document.ModificationContext<Scene.Parent>,
  ): Promise<void>;

  protected static _schema: SchemaField<Scene.Schema>;

  static get schema(): SchemaField<Scene.Schema>;

  static validateJoint(data: Scene.Source): void;

  static override fromSource(
    source: Scene.UpdateData,
    { strict, ...context }?: DataModel.FromSourceOptions,
  ): DataModel<Scene.Schema, DataModel.Any | null>;

  static override fromJSON(json: string): DataModel<Scene.Schema, DataModel.Any | null>;
}

export default BaseScene;

declare namespace BaseScene {
  export import Metadata = Scene.Metadata;
  export import Parent = Scene.Parent;
  export import Stored = Scene.Stored;
  export import Source = Scene.Source;
  export import PersistedData = Scene.PersistedData;
  export import CreateData = Scene.CreateData;
  export import InitializedData = Scene.InitializedData;
  export import UpdateData = Scene.UpdateData;
  export import Schema = Scene.Schema;
  export import DatabaseOperation = Scene.DatabaseOperation;

  /**
   * @deprecated This type is used by Foundry too vaguely.
   * In one context the most correct type is after initialization whereas in another one it should be
   * before but Foundry uses it interchangeably.
   */
  type Properties = SchemaField.InitializedData<Schema>;

  /**
   * @deprecated {@link foundry.data.fields.SchemaField | `SchemaField<BaseScene.Schema>`}
   */
  type SchemaField = foundry.data.fields.SchemaField<Schema>;

  /**
   * @deprecated {@link BaseScene.CreateData | `BaseScene.CreateData`}
   */
  type ConstructorData = BaseScene.CreateData;
}
