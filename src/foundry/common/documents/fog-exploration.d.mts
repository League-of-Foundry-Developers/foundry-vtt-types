import type { AnyMutableObject } from "fvtt-types/utils";
import type DataModel from "../abstract/data.d.mts";
import type Document from "../abstract/document.mts";
import type { DataField, SchemaField } from "../data/fields.d.mts";
import type { LogCompatibilityWarningOptions } from "../utils/logging.d.mts";

/**
 * The FogExploration Document.
 * Defines the DataSchema and common behaviors for FogExploration which are shared between both client and server.
 */
// Note(LukeAbby): You may wonder why documents don't simply pass the `Parent` generic parameter.
// This pattern evolved from trying to avoid circular loops and even internal tsc errors.
// See: https://gist.github.com/LukeAbby/0d01b6e20ef19ebc304d7d18cef9cc21
declare abstract class BaseFogExploration extends Document<"FogExploration", BaseFogExploration.Schema, any> {
  /**
   * @param data    - Initial data from which to construct the `BaseFogExploration`
   * @param context - Construction context options
   *
   * @deprecated Constructing `BaseFogExploration` directly is not advised. The base document classes exist in
   * order to use documents on both the client (i.e. where all your code runs) and behind the scenes
   * on the server to manage document validation and storage.
   *
   * You should use {@link FogExploration.implementation | `new FogExploration.implementation(...)`} instead which will give you
   * a system specific implementation of `FogExploration`.
   */
  constructor(...args: FogExploration.ConstructorArgs);

  static override metadata: BaseFogExploration.Metadata;

  static override defineSchema(): BaseFogExploration.Schema;

  static #canModify(user: User.Implementation, doc: BaseFogExploration);

  /*
   * After this point these are not really overridden methods.
   * They are here because Foundry's documents are complex and have lots of edge cases.
   * There are DRY ways of representing this but this ends up being harder to understand
   * for end users extending these functions, especially for static methods. There are also a
   * number of methods that don't make sense to call directly on `Document` like `createDocuments`,
   * as there is no data that can safely construct every possible document. Finally keeping definitions
   * separate like this helps against circularities.
   */

  /* Document overrides */

  static " fvtt_types_internal_document_name_static": "FogExploration";

  // Same as Document for now
  protected static override _initializationOrder(): Generator<[string, DataField.Any]>;

  readonly parentCollection: FogExploration.ParentCollectionName | null;

  readonly pack: string | null;

  static override get implementation(): FogExploration.ImplementationClass;

  static get baseDocument(): typeof BaseFogExploration;

  static get collectionName(): FogExploration.ParentCollectionName;

  static get documentName(): FogExploration.Name;

  static get TYPES(): CONST.BASE_DOCUMENT_TYPE[];

  static get hasTypeData(): undefined;

  static get hierarchy(): FogExploration.Hierarchy;

  override parent: FogExploration.Parent;

  static createDocuments<Temporary extends boolean | undefined = false>(
    data: Array<FogExploration.Implementation | FogExploration.CreateData> | undefined,
    operation?: Document.Database.CreateOperation<FogExploration.Database.Create<Temporary>>,
  ): Promise<Array<Document.TemporaryIf<FogExploration.Implementation, Temporary>>>;

  static updateDocuments(
    updates: FogExploration.UpdateData[] | undefined,
    operation?: Document.Database.UpdateDocumentsOperation<FogExploration.Database.Update>,
  ): Promise<FogExploration.Implementation[]>;

  static deleteDocuments(
    ids: readonly string[] | undefined,
    operation?: Document.Database.DeleteDocumentsOperation<FogExploration.Database.Delete>,
  ): Promise<FogExploration.Implementation[]>;

  static override create<Temporary extends boolean | undefined = false>(
    data: FogExploration.CreateData | FogExploration.CreateData[],
    operation?: FogExploration.Database.CreateOperation<Temporary>,
  ): Promise<Document.TemporaryIf<FogExploration.Implementation, Temporary> | undefined>;

  override update(
    data: FogExploration.UpdateData | undefined,
    operation?: FogExploration.Database.UpdateOperation,
  ): Promise<this | undefined>;

  override delete(operation?: FogExploration.Database.DeleteOperation): Promise<this | undefined>;

  static override get(
    documentId: string,
    options?: FogExploration.Database.GetOptions,
  ): Promise<FogExploration.Implementation | null> | FogExploration.Implementation | null;

  static override getCollectionName(name: string): null;

  // Same as Document for now
  override traverseEmbeddedDocuments(_parentPath?: string): Generator<[string, Document.AnyChild<this>]>;

  override getFlag<Scope extends FogExploration.Flags.Scope, Key extends FogExploration.Flags.Key<Scope>>(
    scope: Scope,
    key: Key,
  ): Document.GetFlag<FogExploration.Name, Scope, Key>;

  override setFlag<
    Scope extends FogExploration.Flags.Scope,
    Key extends FogExploration.Flags.Key<Scope>,
    Value extends Document.GetFlag<FogExploration.Name, Scope, Key>,
  >(scope: Scope, key: Key, value: Value): Promise<this>;

  override unsetFlag<Scope extends FogExploration.Flags.Scope, Key extends FogExploration.Flags.Key<Scope>>(
    scope: Scope,
    key: Key,
  ): Promise<this>;

  protected _preCreate(
    data: FogExploration.CreateData,
    options: FogExploration.Database.PreCreateOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected _onCreate(
    data: FogExploration.CreateData,
    options: FogExploration.Database.OnCreateOperation,
    userId: string,
  ): void;

  protected static _preCreateOperation(
    documents: FogExploration.Implementation[],
    operation: Document.Database.PreCreateOperationStatic<FogExploration.Database.Create>,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static _onCreateOperation(
    documents: FogExploration.Implementation[],
    operation: FogExploration.Database.Create,
    user: User.Implementation,
  ): Promise<void>;

  protected _preUpdate(
    changed: FogExploration.UpdateData,
    options: FogExploration.Database.PreUpdateOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected _onUpdate(
    changed: FogExploration.UpdateData,
    options: FogExploration.Database.OnUpdateOperation,
    userId: string,
  ): void;

  protected static _preUpdateOperation(
    documents: FogExploration.Implementation[],
    operation: FogExploration.Database.Update,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static _onUpdateOperation(
    documents: FogExploration.Implementation[],
    operation: FogExploration.Database.Update,
    user: User.Implementation,
  ): Promise<void>;

  protected _preDelete(
    options: FogExploration.Database.PreDeleteOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected _onDelete(options: FogExploration.Database.OnDeleteOperation, userId: string): void;

  protected static _preDeleteOperation(
    documents: FogExploration.Implementation[],
    operation: FogExploration.Database.Delete,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static _onDeleteOperation(
    documents: FogExploration.Implementation[],
    operation: FogExploration.Database.Delete,
    user: User.Implementation,
  ): Promise<void>;

  static get hasSystemData(): undefined;

  // These data field things have been ticketed but will probably go into backlog hell for a while.
  // We'll end up copy and pasting without modification for now I think. It makes it a tiny bit easier to update though.

  // options: not null (parameter default only in _addDataFieldShim)
  protected static override _addDataFieldShims(
    data: AnyMutableObject,
    shims: Record<string, string>,
    options?: Document.DataFieldShimOptions,
  ): void;

  // options: not null (parameter default only)
  protected static override _addDataFieldShim(
    data: AnyMutableObject,
    oldKey: string,
    newKey: string,
    options?: Document.DataFieldShimOptions,
  ): void;

  protected static override _addDataFieldMigration(
    data: AnyMutableObject,
    oldKey: string,
    newKey: string,
    apply?: ((data: AnyMutableObject) => unknown) | null,
  ): boolean;

  // options: not null (destructured where forwarded)
  protected static override _logDataFieldMigration(
    oldKey: string,
    newKey: string,
    options?: LogCompatibilityWarningOptions,
  ): void;

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

  /* DataModel overrides */

  protected static _schema: SchemaField<FogExploration.Schema>;

  static get schema(): SchemaField<FogExploration.Schema>;

  /** @remarks Not actually overridden, still a no-op, typed for ease of subclassing */
  static validateJoint(data: FogExploration.Source): void;

  // options: not null (parameter default only, destructured in super)
  static override fromSource(
    source: FogExploration.CreateData,
    context?: DataModel.FromSourceOptions,
  ): FogExploration.Implementation;

  static override fromJSON(json: string): FogExploration.Implementation;
}

export default BaseFogExploration;

declare namespace BaseFogExploration {
  export import Name = FogExploration.Name;
  export import ConstructorArgs = FogExploration.ConstructorArgs;
  export import Hierarchy = FogExploration.Hierarchy;
  export import Metadata = FogExploration.Metadata;
  export import Parent = FogExploration.Parent;
  export import Descendant = FogExploration.Descendant;
  export import DescendantClass = FogExploration.DescendantClass;
  export import Pack = FogExploration.Pack;
  export import Embedded = FogExploration.Embedded;
  export import ParentCollectionName = FogExploration.ParentCollectionName;
  export import CollectionClass = FogExploration.CollectionClass;
  export import Collection = FogExploration.Collection;
  export import Invalid = FogExploration.Invalid;
  export import Stored = FogExploration.Stored;
  export import Source = FogExploration.Source;
  export import PersistedData = FogExploration.PersistedData;
  export import CreateData = FogExploration.CreateData;
  export import InitializedData = FogExploration.InitializedData;
  export import UpdateData = FogExploration.UpdateData;
  export import Schema = FogExploration.Schema;
  export import DatabaseOperation = FogExploration.Database;
  export import Flags = FogExploration.Flags;

  /**
   * @deprecated This type is used by Foundry too vaguely.
   * In one context the most correct type is after initialization whereas in another one it should be
   * before but Foundry uses it interchangeably.
   */
  type Properties = SchemaField.InitializedData<Schema>;

  /**
   * @deprecated Replaced with {@link foundry.data.fields.SchemaField | `SchemaField<BaseFogExploration.Schema>`}
   */
  type SchemaField = foundry.data.fields.SchemaField<Schema>;

  /**
   * @deprecated Replaced with {@linkcode BaseFogExploration.CreateData}
   */
  type ConstructorData = BaseFogExploration.CreateData;
}
