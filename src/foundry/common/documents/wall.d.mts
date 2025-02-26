import type { AnyMutableObject, AnyObject } from "../../../utils/index.d.mts";
import type DataModel from "../abstract/data.d.mts";
import type Document from "../abstract/document.mts";
import type { DataField, EmbeddedCollectionField, EmbeddedDocumentField, SchemaField } from "../data/fields.d.mts";
import type { LogCompatibilityWarningOptions } from "../utils/logging.d.mts";

/**
 * The Document definition for a Wall.
 * Defines the DataSchema and common behaviors for a Wall which are shared between both client and server.
 */
// Note(LukeAbby): You may wonder why documents don't simply pass the `Parent` generic parameter.
// This pattern evolved from trying to avoid circular loops and even internal tsc errors.
// See: https://gist.github.com/LukeAbby/0d01b6e20ef19ebc304d7d18cef9cc21
declare class BaseWall extends Document<WallDocument.Name, BaseWall.Schema, any> {
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
   * They are here because Foundry's documents are complex and have lots of edge cases.
   * There are DRY ways of representing this but this ends up being harder to understand
   * for end users extending these functions, especially for static methods. There are also a
   * number of methods that don't make sense to call directly on `Document` like `createDocuments`,
   * as there is no data that can safely construct any possible document. Finally it has also been
   * liable to cause circularities.
   */

  /* Document */

  static override " fvtt_types_internal_document_name_static": WallDocument.Name;

  protected static override _initializationOrder(): Generator<[string, DataField.Any]>;

  readonly parentCollection: null;
  readonly pack: null;

  static override get implementation(): WallDocument.ImplementationClass;

  static get baseDocument(): typeof BaseWall;

  static get collectionName(): WallDocument.ParentCollectionName;

  static get documentName(): WallDocument.Name;

  static get TYPES(): [];

  static get hasTypeData(): false;

  static get hierarchy(): Record<string, EmbeddedCollectionField.Any | EmbeddedDocumentField.Any>;

  override parent: WallDocument.Parent;

  static override createDocuments<Temporary extends boolean | undefined = false>(
    data: Array<WallDocument.Implementation | WallDocument.CreateData> | undefined,
    operation?: WallDocument.Database.CreateDocumentsOperation<Temporary>,
  ): Promise<Array<Document.TemporaryIf<WallDocument.Implementation, Temporary>>>;

  static override updateDocuments(
    updates: WallDocument.UpdateData[] | undefined,
    operation?: WallDocument.Database.UpdateDocumentsOperation,
  ): Promise<WallDocument.Implementation[]>;

  static override deleteDocuments(
    ids: readonly string[] | undefined,
    operation?: WallDocument.Database.DeleteDocumentsOperation,
  ): Promise<WallDocument.Implementation[]>;

  static override create<Temporary extends boolean | undefined = false>(
    data: WallDocument.CreateData | WallDocument.CreateData[],
    operation?: WallDocument.Database.CreateOperation<Temporary>,
  ): Promise<Document.TemporaryIf<WallDocument.Implementation, Temporary> | undefined>;

  override update(
    data: WallDocument.UpdateData | undefined,
    operation?: WallDocument.Database.UpdateOperation,
  ): Promise<this | undefined>;

  override delete(operation?: WallDocument.Database.DeleteOperation): Promise<this | undefined>;

  static override get(
    documentId: string,
    options?: WallDocument.Database.GetOptions,
  ): WallDocument.Implementation | null;

  static getCollectionName<CollectionName extends WallDocument.EmbeddedName>(
    name: CollectionName,
  ): WallDocument.CollectionNameOf<CollectionName> | null;

  getEmbeddedCollection<EmbeddedName extends WallDocument.EmbeddedName>(
    embeddedName: EmbeddedName,
  ): Document.EmbeddedCollectionFor<WallDocument.Name, EmbeddedName>;

  getEmbeddedDocument<EmbeddedName extends WallDocument.EmbeddedName>(
    embeddedName: EmbeddedName,
    id: string,
    options: Document.GetEmbeddedDocumentOptions,
    // TODO: Generic over the EmbeddedName
  ): WallDocument.Embedded | undefined;

  createEmbeddedDocuments<EmbeddedName extends WallDocument.EmbeddedName>(
    embeddedName: EmbeddedName,
    data: Document.CreateDataFor<EmbeddedName>[] | undefined,
    // TODO: Generic over the EmbeddedName
    operation?: never,
  ): Promise<Array<Document.Stored<Document.ImplementationInstanceFor<EmbeddedName>>> | undefined>;

  updateEmbeddedDocuments<EmbeddedName extends WallDocument.EmbeddedName>(
    embeddedName: EmbeddedName,
    updates: Document.UpdateDataFor<EmbeddedName>[] | undefined,
    // TODO: Generic over the EmbeddedName
    operation?: never,
  ): Promise<Array<Document.Stored<Document.ImplementationInstanceFor<EmbeddedName>>> | undefined>;

  deleteEmbeddedDocuments<EmbeddedName extends WallDocument.EmbeddedName>(
    embeddedName: EmbeddedName,
    ids: Array<string>,
    // TODO: Generic over the EmbeddedName
    operation?: never,
  ): Promise<Array<Document.Stored<Document.ImplementationInstanceFor<EmbeddedName>>>>;

  traverseEmbeddedDocuments(_parentPath?: string): Generator<[string, Document.AnyChild<this>]>;

  getFlag<Scope extends WallDocument.Flags.Scope, Key extends WallDocument.Flags.Key<Scope>>(
    scope: Scope,
    key: Key,
  ): Document.GetFlag<WallDocument.Name, Scope, Key>;

  setFlag<
    Scope extends WallDocument.Flags.Scope,
    Key extends WallDocument.Flags.Key<Scope>,
    Value extends Document.GetFlag<WallDocument.Name, Scope, Key>,
  >(scope: Scope, key: Key, value: Value): Promise<this>;

  unsetFlag<Scope extends WallDocument.Flags.Scope, Key extends WallDocument.Flags.Key<Scope>>(
    scope: Scope,
    key: Key,
  ): Promise<this>;

  protected override _preCreate(
    data: WallDocument.CreateData,
    options: WallDocument.Database.PreCreateOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected override _onCreate(
    data: WallDocument.CreateData,
    options: WallDocument.Database.OnCreateOptions,
    userId: string,
  ): void;

  protected static override _preCreateOperation(
    documents: WallDocument.Implementation[],
    operation: WallDocument.Database.PreCreateOperation,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static override _onCreateOperation(
    documents: WallDocument.Implementation[],
    operation: WallDocument.Database.OnCreateOperation,
    user: User.Implementation,
  ): Promise<void>;

  protected override _preUpdate(
    changed: WallDocument.UpdateData,
    options: WallDocument.Database.PreUpdateOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected override _onUpdate(
    changed: WallDocument.UpdateData,
    options: WallDocument.Database.OnUpdateOptions,
    userId: string,
  ): void;

  protected static override _preUpdateOperation(
    documents: WallDocument.Implementation[],
    operation: WallDocument.Database.PreUpdateOperation,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static override _onUpdateOperation(
    documents: WallDocument.Implementation[],
    operation: WallDocument.Database.OnUpdateOperation,
    user: User.Implementation,
  ): Promise<void>;

  protected override _preDelete(
    options: WallDocument.Database.PreDeleteOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected override _onDelete(options: WallDocument.Database.OnDeleteOptions, userId: string): void;

  protected static override _preDeleteOperation(
    documents: WallDocument.Implementation[],
    operation: WallDocument.Database.PreDeleteOperation,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static override _onDeleteOperation(
    documents: WallDocument.Implementation[],
    operation: WallDocument.Database.OnDeleteOperation,
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

  protected static override _onCreateDocuments(
    documents: WallDocument.Implementation[],
    context: WallDocument.Database.OnCreateDocumentsContext,
  ): Promise<void>;

  protected static override _onUpdateDocuments(
    documents: WallDocument.Implementation[],
    context: WallDocument.Database.OnUpdateDocumentsContext,
  ): Promise<void>;

  protected static override _onDeleteDocuments(
    documents: WallDocument.Implementation[],
    context: WallDocument.Database.OnDeleteDocumentsContext,
  ): Promise<void>;

  /* DataModel */

  protected static override _schema: SchemaField<WallDocument.Schema>;

  static override get schema(): SchemaField<WallDocument.Schema>;

  static LOCALIZATION_PREFIXES: string[];

  static override validateJoint(data: WallDocument.Source): void;

  static override fromSource(
    source: WallDocument.UpdateData,
    { strict, ...context }?: DataModel.FromSourceOptions,
  ): DataModel<WallDocument.Schema, DataModel.Any | null>;

  static override fromJSON(json: string): DataModel<WallDocument.Schema, DataModel.Any | null>;
}

export default BaseWall;

declare namespace BaseWall {
  export import Name = WallDocument.Name;
  export import Metadata = WallDocument.Metadata;
  export import Parent = WallDocument.Parent;
  export import ParentCollection = WallDocument.ParentCollection;
  export import Pack = WallDocument.Pack;
  export import Embedded = WallDocument.Embedded;
  export import EmbeddedName = WallDocument.EmbeddedName;
  export import EmbeddedCollectionName = WallDocument.EmbeddedCollectionName;
  export import ParentCollectionName = WallDocument.ParentCollectionName;
  export import Stored = WallDocument.Stored;
  export import Source = WallDocument.Source;
  export import PersistedData = WallDocument.PersistedData;
  export import CreateData = WallDocument.CreateData;
  export import InitializedData = WallDocument.InitializedData;
  export import UpdateData = WallDocument.UpdateData;
  export import Schema = WallDocument.Schema;
  export import DatabaseOperation = WallDocument.Database;
  export import Flags = WallDocument.Flags;

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
