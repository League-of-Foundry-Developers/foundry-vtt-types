import type { AnyMutableObject, AnyObject } from "fvtt-types/utils";
import type DataModel from "../abstract/data.d.mts";
import type Document from "../abstract/document.mts";
import type { DataField, SchemaField } from "../data/fields.d.mts";
import type { LogCompatibilityWarningOptions } from "../utils/logging.d.mts";

/**
 * The RollTable Document.
 * Defines the DataSchema and common behaviors for a RollTable which are shared between both client and server.
 */
// Note(LukeAbby): You may wonder why documents don't simply pass the `Parent` generic parameter.
// This pattern evolved from trying to avoid circular loops and even internal tsc errors.
// See: https://gist.github.com/LukeAbby/0d01b6e20ef19ebc304d7d18cef9cc21
declare abstract class BaseRollTable extends Document<"RollTable", BaseRollTable.Schema, any> {
  /**
   * @param data    - Initial data from which to construct the `BaseRollTable`
   * @param context - Construction context options
   *
   * @deprecated Constructing `BaseRollTable` directly is not advised. The base document classes exist in
   * order to use documents on both the client (i.e. where all your code runs) and behind the scenes
   * on the server to manage document validation and storage.
   *
   * You should use {@link RollTable.implementation | `new RollTable.implementation(...)`} instead which will give you
   * a system specific implementation of the `RollTable` document.
   */
  constructor(...args: RollTable.ConstructorArgs);

  static override metadata: BaseRollTable.Metadata;

  static override defineSchema(): BaseRollTable.Schema;

  /**
   * The default icon used for newly created Macro documents
   */
  static DEFAULT_ICON: "icons/svg/d20-grey.svg";

  static override migrateData(source: AnyMutableObject): AnyMutableObject;

  /*
   * After this point these are not really overridden methods.
   * They are here because they're static properties but depend on the instance and so can't be
   * defined DRY-ly while also being easily overridable.
   */

  static " fvtt_types_internal_document_name_static": "RollTable";

  // Same as Document for now
  protected static override _initializationOrder(): Generator<[string, DataField.Any]>;

  readonly parentCollection: RollTable.ParentCollectionName | null;

  readonly pack: string | null;

  static override get implementation(): RollTable.ImplementationClass;

  static get baseDocument(): typeof BaseRollTable;

  static get collectionName(): RollTable.ParentCollectionName;

  static get documentName(): RollTable.Name;

  static get TYPES(): CONST.BASE_DOCUMENT_TYPE[];

  static get hasTypeData(): false;

  static get hierarchy(): RollTable.Hierarchy;

  override parent: RollTable.Parent;

  static createDocuments<Temporary extends boolean | undefined = false>(
    data: Array<RollTable.Implementation | RollTable.CreateData> | undefined,
    operation?: Document.Database.CreateOperation<RollTable.Database.Create<Temporary>>,
  ): Promise<Array<Document.TemporaryIf<RollTable.Implementation, Temporary>>>;

  static updateDocuments(
    updates: RollTable.UpdateData[] | undefined,
    operation?: Document.Database.UpdateDocumentsOperation<RollTable.Database.Update>,
  ): Promise<RollTable.Implementation[]>;

  static deleteDocuments(
    ids: readonly string[] | undefined,
    operation?: Document.Database.DeleteDocumentsOperation<RollTable.Database.Delete>,
  ): Promise<RollTable.Implementation[]>;

  static override create<Temporary extends boolean | undefined = false>(
    data: RollTable.CreateData | RollTable.CreateData[],
    operation?: RollTable.Database.CreateOperation<Temporary>,
  ): Promise<Document.TemporaryIf<RollTable.Implementation, Temporary> | undefined>;

  override update(
    data: RollTable.UpdateData | undefined,
    operation?: RollTable.Database.UpdateOperation,
  ): Promise<this | undefined>;

  override delete(operation?: RollTable.Database.DeleteOperation): Promise<this | undefined>;

  static get(documentId: string, options?: Document.Database.GetOptions): RollTable.Implementation | null;

  static override getCollectionName<CollectionName extends RollTable.EmbeddedName>(
    name: CollectionName,
  ): RollTable.CollectionNameOf<CollectionName> | null;

  // Same as Document for now
  override traverseEmbeddedDocuments(_parentPath?: string): Generator<[string, Document.AnyChild<this>]>;

  override getFlag<Scope extends RollTable.Flags.Scope, Key extends RollTable.Flags.Key<Scope>>(
    scope: Scope,
    key: Key,
  ): Document.GetFlag<RollTable.Name, Scope, Key>;

  override setFlag<
    Scope extends RollTable.Flags.Scope,
    Key extends RollTable.Flags.Key<Scope>,
    Value extends Document.GetFlag<RollTable.Name, Scope, Key>,
  >(scope: Scope, key: Key, value: Value): Promise<this>;

  override unsetFlag<Scope extends RollTable.Flags.Scope, Key extends RollTable.Flags.Key<Scope>>(
    scope: Scope,
    key: Key,
  ): Promise<this>;

  protected _preCreate(
    data: RollTable.CreateData,
    options: RollTable.Database.PreCreateOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected _onCreate(
    data: RollTable.CreateData,
    options: RollTable.Database.OnCreateOperation,
    userId: string,
  ): void;

  protected static _preCreateOperation(
    documents: RollTable.Implementation[],
    operation: Document.Database.PreCreateOperationStatic<RollTable.Database.Create>,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static _onCreateOperation(
    documents: RollTable.Implementation[],
    operation: RollTable.Database.Create,
    user: User.Implementation,
  ): Promise<void>;

  protected _preUpdate(
    changed: RollTable.UpdateData,
    options: RollTable.Database.PreUpdateOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected _onUpdate(
    changed: RollTable.UpdateData,
    options: RollTable.Database.OnUpdateOperation,
    userId: string,
  ): void;

  protected static _preUpdateOperation(
    documents: RollTable.Implementation[],
    operation: RollTable.Database.Update,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static _onUpdateOperation(
    documents: RollTable.Implementation[],
    operation: RollTable.Database.Update,
    user: User.Implementation,
  ): Promise<void>;

  protected _preDelete(
    options: RollTable.Database.PreDeleteOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected _onDelete(options: RollTable.Database.OnDeleteOperation, userId: string): void;

  protected static _preDeleteOperation(
    documents: RollTable.Implementation[],
    operation: RollTable.Database.Delete,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static _onDeleteOperation(
    documents: RollTable.Implementation[],
    operation: RollTable.Database.Delete,
    user: User.Implementation,
  ): Promise<void>;

  static get hasSystemData(): false;

  // These data field things have been ticketed but will probably go into backlog hell for a while.
  // We'll end up copy and pasting without modification for now I think. It makes it a tiny bit easier to update though.
  protected static _addDataFieldShims(data: AnyObject, shims: AnyObject, options?: Document.DataFieldShimOptions): void;

  protected static _addDataFieldMigration(
    data: AnyObject,
    oldKey: string,
    newKey: string,
    apply?: (data: AnyObject) => unknown,
  ): unknown;

  protected static _logDataFieldMigration(
    oldKey: string,
    newKey: string,
    options?: LogCompatibilityWarningOptions,
  ): void;

  protected static _onCreateDocuments(
    documents: RollTable.Implementation[],
    context: Document.ModificationContext<RollTable.Parent>,
  ): Promise<void>;

  protected static _onUpdateDocuments(
    documents: RollTable.Implementation[],
    context: Document.ModificationContext<RollTable.Parent>,
  ): Promise<void>;

  protected static _onDeleteDocuments(
    documents: RollTable.Implementation[],
    context: Document.ModificationContext<RollTable.Parent>,
  ): Promise<void>;

  /* DataModel overrides */

  protected static _schema: SchemaField<RollTable.Schema>;

  static get schema(): SchemaField<RollTable.Schema>;

  static validateJoint(data: RollTable.Source): void;

  static override fromSource(
    source: RollTable.UpdateData,
    { strict, ...context }?: DataModel.FromSourceOptions,
  ): DataModel<RollTable.Schema, DataModel.Any | null>;

  static override fromJSON(json: string): DataModel<RollTable.Schema, DataModel.Any | null>;
}

export default BaseRollTable;

declare namespace BaseRollTable {
  export import Name = RollTable.Name;
  export import ConstructorArgs = RollTable.ConstructorArgs;
  export import Hierarchy = RollTable.Hierarchy;
  export import Metadata = RollTable.Metadata;
  export import Parent = RollTable.Parent;
  export import Pack = RollTable.Pack;
  export import Embedded = RollTable.Embedded;
  export import EmbeddedName = RollTable.EmbeddedName;
  export import EmbeddedCollectionName = RollTable.EmbeddedCollectionName;
  export import ParentCollectionName = RollTable.ParentCollectionName;
  export import Stored = RollTable.Stored;
  export import Source = RollTable.Source;
  export import PersistedData = RollTable.PersistedData;
  export import CreateData = RollTable.CreateData;
  export import InitializedData = RollTable.InitializedData;
  export import UpdateData = RollTable.UpdateData;
  export import Schema = RollTable.Schema;
  export import DatabaseOperation = RollTable.Database;
  export import Flags = RollTable.Flags;

  /**
   * @deprecated This type is used by Foundry too vaguely.
   * In one context the most correct type is after initialization whereas in another one it should be
   * before but Foundry uses it interchangeably.
   */
  type Properties = SchemaField.InitializedData<Schema>;

  /**
   * @deprecated {@link foundry.data.fields.SchemaField | `SchemaField<BaseRollTable.Schema>`}
   */
  type SchemaField = foundry.data.fields.SchemaField<Schema>;

  /**
   * @deprecated {@link BaseRollTable.CreateData | `BaseRollTable.CreateData`}
   */
  type ConstructorData = BaseRollTable.CreateData;
}
