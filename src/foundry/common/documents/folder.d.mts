import type DataModel from "../abstract/data.d.mts";
import type Document from "../abstract/document.mts";
import type { SchemaField } from "../data/fields.d.mts";

/**
 * The Folder Document.
 * Defines the DataSchema and common behaviors for a Folder which are shared between both client and server.
 */
// Note(LukeAbby): You may wonder why documents don't simply pass the `Parent` generic parameter.
// This pattern evolved from trying to avoid circular loops and even internal tsc errors.
// See: https://gist.github.com/LukeAbby/0d01b6e20ef19ebc304d7d18cef9cc21
declare abstract class BaseFolder<out _SubType extends BaseFolder.SubType = BaseFolder.SubType> extends Document<
  "Folder",
  BaseFolder.Schema,
  any
> {
  /**
   * @param data    - Initial data from which to construct the Folder
   * @param context - Construction context options
   */
  // TODO(LukeAbby): This constructor is a symptom of a circular error.
  // constructor(data: BaseFolder.CreateData, context?: Document.ConstructionContext<BaseFolder.Parent>);

  static override metadata: BaseFolder.Metadata;

  static override defineSchema(): BaseFolder.Schema;

  // NOTE(LukeAbby): The `validateJoint` method override was left off because it didn't change the signature and it also seemed to cause a loop.
  // See: https://gist.github.com/LukeAbby/43ee5c2a39cd33f3fac693d1d4a5653f

  /**
   * Allow folder sorting modes
   * @defaultValue `["a", "m"]`
   */
  static SORTING_MODES: ("a" | "m")[];

  /*
   * After this point these are not really overridden methods.
   * They are here because they're static properties but depend on the instance and so can't be
   * defined DRY-ly while also being easily overridable.
   */

  static " fvtt_types_internal_document_name_static": "Folder";

  static get implementation(): Folder.ImplementationClass;

  override parent: BaseFolder.Parent;

  static get TYPES(): BaseFolder.SubType[];

  static createDocuments<Temporary extends boolean | undefined = false>(
    data: Array<Folder.Implementation | Folder.CreateData> | undefined,
    operation?: Document.Database.CreateOperation<Folder.DatabaseOperation.Create<Temporary>>,
  ): Promise<Array<Document.StoredIf<Folder.Implementation, Temporary>>>;

  static updateDocuments(
    updates: Folder.UpdateData[] | undefined,
    operation?: Document.Database.UpdateOperation<Folder.DatabaseOperation.Update>,
  ): Promise<Folder.Implementation[]>;

  static deleteDocuments(
    ids: readonly string[] | undefined,
    operation?: Document.Database.DeleteOperation<Folder.DatabaseOperation.Delete>,
  ): Promise<Folder.Implementation[]>;

  static create<Temporary extends boolean | undefined = false>(
    data: Folder.CreateData | Folder.CreateData[],
    operation?: Document.Database.CreateOperation<Folder.DatabaseOperation.Create<Temporary>>,
  ): Promise<Folder.Implementation | undefined>;

  static get(documentId: string, options?: Document.Database.GetOperation): Folder.Implementation | null;

  protected _preCreate(
    data: Folder.CreateData,
    options: Folder.DatabaseOperation.PreCreateOperationInstance,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected _onCreate(
    data: Folder.CreateData,
    options: Folder.DatabaseOperation.OnCreateOperation,
    userId: string,
  ): void;

  protected static _preCreateOperation(
    documents: Folder.Implementation[],
    operation: Document.Database.PreCreateOperationStatic<Folder.DatabaseOperation.Create>,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static _onCreateOperation(
    documents: Folder.Implementation[],
    operation: Folder.DatabaseOperation.Create,
    user: User.Implementation,
  ): Promise<void>;

  protected _preUpdate(
    changed: Folder.UpdateData,
    options: Folder.DatabaseOperation.PreUpdateOperationInstance,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected _onUpdate(
    changed: Folder.UpdateData,
    options: Folder.DatabaseOperation.OnUpdateOperation,
    userId: string,
  ): void;

  protected static _preUpdateOperation(
    documents: Folder.Implementation[],
    operation: Folder.DatabaseOperation.Update,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static _onUpdateOperation(
    documents: Folder.Implementation[],
    operation: Folder.DatabaseOperation.Update,
    user: User.Implementation,
  ): Promise<void>;

  protected _preDelete(
    options: Folder.DatabaseOperation.PreDeleteOperationInstance,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected _onDelete(options: Folder.DatabaseOperation.OnDeleteOperation, userId: string): void;

  protected static _preDeleteOperation(
    documents: Folder.Implementation[],
    operation: Folder.DatabaseOperation.Delete,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static _onDeleteOperation(
    documents: Folder.Implementation[],
    operation: Folder.DatabaseOperation.Delete,
    user: User.Implementation,
  ): Promise<void>;

  protected static _onCreateDocuments(
    documents: Folder.Implementation[],
    context: Document.ModificationContext<Folder.Parent>,
  ): Promise<void>;

  protected static _onUpdateDocuments(
    documents: Folder.Implementation[],
    context: Document.ModificationContext<Folder.Parent>,
  ): Promise<void>;

  protected static _onDeleteDocuments(
    documents: Folder.Implementation[],
    context: Document.ModificationContext<Folder.Parent>,
  ): Promise<void>;

  protected static _schema: SchemaField<Folder.Schema>;

  static get schema(): SchemaField<Folder.Schema>;

  static validateJoint(data: Folder.Source): void;

  static override fromSource(
    source: Folder.UpdateData,
    { strict, ...context }?: DataModel.FromSourceOptions,
  ): DataModel<Folder.Schema, DataModel.Any | null>;

  static override fromJSON(json: string): DataModel<Folder.Schema, DataModel.Any | null>;
}

export default BaseFolder;

declare namespace BaseFolder {
  export import Metadata = Folder.Metadata;
  export import SubType = Folder.SubType;
  export import Parent = Folder.Parent;
  export import Stored = Folder.Stored;
  export import Source = Folder.Source;
  export import PersistedData = Folder.PersistedData;
  export import CreateData = Folder.CreateData;
  export import InitializedData = Folder.InitializedData;
  export import UpdateData = Folder.UpdateData;
  export import Schema = Folder.Schema;
  export import DatabaseOperation = Folder.DatabaseOperation;

  /**
   * @deprecated This type is used by Foundry too vaguely.
   * In one context the most correct type is after initialization whereas in another one it should be
   * before but Foundry uses it interchangeably.
   */
  type Properties = SchemaField.InitializedData<Schema>;

  /** @deprecated {@link BaseFolder.SubType | `BaseFolder.SubType`} */
  type TypeNames = SubType;

  /**
   * @deprecated {@link foundry.data.fields.SchemaField | `SchemaField<BaseFolder.Schema>`}
   */
  type SchemaField = foundry.data.fields.SchemaField<Schema>;

  /**
   * @deprecated {@link BaseFolder.CreateData | `BaseFolder.CreateData`}
   */
  type ConstructorData = BaseFolder.CreateData;
}
