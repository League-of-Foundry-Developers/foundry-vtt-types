import type { AnyObject, AnyMutableObject } from "fvtt-types/utils";
import type DataModel from "../abstract/data.d.mts";
import type Document from "../abstract/document.mts";
import type { DataField, SchemaField } from "../data/fields.d.mts";
import type { LogCompatibilityWarningOptions } from "../utils/logging.d.mts";

/**
 * The Document definition for a Tile.
 * Defines the DataSchema and common behaviors for a Tile which are shared between both client and server.
 */
// Note(LukeAbby): You may wonder why documents don't simply pass the `Parent` generic parameter.
// This pattern evolved from trying to avoid circular loops and even internal tsc errors.
// See: https://gist.github.com/LukeAbby/0d01b6e20ef19ebc304d7d18cef9cc21
declare abstract class BaseTile extends Document<"Tile", BaseTile.Schema, any> {
  /**
   * @param data    - Initial data from which to construct the `BaseTile`
   * @param context - Construction context options
   *
   * @deprecated Constructing `BaseTile` directly is not advised. The base document classes exist in
   * order to use documents on both the client (i.e. where all your code runs) and behind the scenes
   * on the server to manage document validation and storage.
   *
   * You should use {@link TileDocument.implementation | `new TileDocument.implementation(...)`} instead which will give you
   * a system specific implementation of `TileDocument`.
   */
  constructor(...args: WallDocument.ConstructorArgs);

  static override metadata: BaseTile.Metadata;

  static override defineSchema(): BaseTile.Schema;

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
   * They are here because Foundry's documents are complex and have lots of edge cases.
   * There are DRY ways of representing this but this ends up being harder to understand
   * for end users extending these functions, especially for static methods. There are also a
   * number of methods that don't make sense to call directly on `Document` like `createDocuments`,
   * as there is no data that can safely construct every possible document. Finally keeping definitions
   * separate like this helps against circularities.
   */

  /* Document overrides */

  static " fvtt_types_internal_document_name_static": "Tile";

  // Same as Document for now
  protected static override _initializationOrder(): Generator<[string, DataField.Any]>;

  readonly parentCollection: TileDocument.ParentCollectionName | null;

  readonly pack: string | null;

  static override get implementation(): TileDocument.ImplementationClass;

  static get baseDocument(): typeof BaseTile;

  static get collectionName(): TileDocument.ParentCollectionName;

  static get documentName(): TileDocument.Name;

  static get TYPES(): CONST.BASE_DOCUMENT_TYPE[];

  static get hasTypeData(): false;

  static get hierarchy(): TileDocument.Hierarchy;

  override parent: TileDocument.Parent;

  static createDocuments<Temporary extends boolean | undefined = false>(
    data: Array<TileDocument.Implementation | TileDocument.CreateData> | undefined,
    operation?: Document.Database.CreateOperation<TileDocument.Database.Create<Temporary>>,
  ): Promise<Array<Document.TemporaryIf<TileDocument.Implementation, Temporary>>>;

  static updateDocuments(
    updates: TileDocument.UpdateData[] | undefined,
    operation?: Document.Database.UpdateDocumentsOperation<TileDocument.Database.Update>,
  ): Promise<TileDocument.Implementation[]>;

  static deleteDocuments(
    ids: readonly string[] | undefined,
    operation?: Document.Database.DeleteDocumentsOperation<TileDocument.Database.Delete>,
  ): Promise<TileDocument.Implementation[]>;

  static override create<Temporary extends boolean | undefined = false>(
    data: TileDocument.CreateData | TileDocument.CreateData[],
    operation?: TileDocument.Database.CreateOperation<Temporary>,
  ): Promise<Document.TemporaryIf<TileDocument.Implementation, Temporary> | undefined>;

  override update(
    data: TileDocument.UpdateData | undefined,
    operation?: TileDocument.Database.UpdateOperation,
  ): Promise<this | undefined>;

  override delete(operation?: TileDocument.Database.DeleteOperation): Promise<this | undefined>;

  static get(documentId: string, options?: TileDocument.Database.GetOptions): TileDocument.Implementation | null;

  static override getCollectionName<CollectionName extends TileDocument.EmbeddedName>(
    name: CollectionName,
  ): TileDocument.CollectionNameOf<CollectionName> | null;

  // Same as Document for now
  override traverseEmbeddedDocuments(_parentPath?: string): Generator<[string, Document.AnyChild<this>]>;

  override getFlag<Scope extends TileDocument.Flags.Scope, Key extends TileDocument.Flags.Key<Scope>>(
    scope: Scope,
    key: Key,
  ): Document.GetFlag<TileDocument.Name, Scope, Key>;

  override setFlag<
    Scope extends TileDocument.Flags.Scope,
    Key extends TileDocument.Flags.Key<Scope>,
    Value extends Document.GetFlag<TileDocument.Name, Scope, Key>,
  >(scope: Scope, key: Key, value: Value): Promise<this>;

  override unsetFlag<Scope extends TileDocument.Flags.Scope, Key extends TileDocument.Flags.Key<Scope>>(
    scope: Scope,
    key: Key,
  ): Promise<this>;

  protected _preCreate(
    data: TileDocument.CreateData,
    options: TileDocument.Database.PreCreateOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected _onCreate(
    data: TileDocument.CreateData,
    options: TileDocument.Database.OnCreateOperation,
    userId: string,
  ): void;

  protected static _preCreateOperation(
    documents: TileDocument.Implementation[],
    operation: Document.Database.PreCreateOperationStatic<TileDocument.Database.Create>,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static _onCreateOperation(
    documents: TileDocument.Implementation[],
    operation: TileDocument.Database.Create,
    user: User.Implementation,
  ): Promise<void>;

  protected _preUpdate(
    changed: TileDocument.UpdateData,
    options: TileDocument.Database.PreUpdateOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected _onUpdate(
    changed: TileDocument.UpdateData,
    options: TileDocument.Database.OnUpdateOperation,
    userId: string,
  ): void;

  protected static _preUpdateOperation(
    documents: TileDocument.Implementation[],
    operation: TileDocument.Database.Update,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static _onUpdateOperation(
    documents: TileDocument.Implementation[],
    operation: TileDocument.Database.Update,
    user: User.Implementation,
  ): Promise<void>;

  protected _preDelete(
    options: TileDocument.Database.PreDeleteOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected _onDelete(options: TileDocument.Database.OnDeleteOperation, userId: string): void;

  protected static _preDeleteOperation(
    documents: TileDocument.Implementation[],
    operation: TileDocument.Database.Delete,
    user: User.Implementation,
  ): Promise<boolean | void>;

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

  protected static _onDeleteOperation(
    documents: TileDocument.Implementation[],
    operation: TileDocument.Database.Delete,
    user: User.Implementation,
  ): Promise<void>;

  protected static _onCreateDocuments(
    documents: TileDocument.Implementation[],
    context: Document.ModificationContext<TileDocument.Parent>,
  ): Promise<void>;

  protected static _onUpdateDocuments(
    documents: TileDocument.Implementation[],
    context: Document.ModificationContext<TileDocument.Parent>,
  ): Promise<void>;

  protected static _onDeleteDocuments(
    documents: TileDocument.Implementation[],
    context: Document.ModificationContext<TileDocument.Parent>,
  ): Promise<void>;

  /* DataModel overrides */

  protected static _schema: SchemaField<TileDocument.Schema>;

  static get schema(): SchemaField<TileDocument.Schema>;

  static validateJoint(data: TileDocument.Source): void;

  static override fromSource(
    source: TileDocument.UpdateData,
    { strict, ...context }?: DataModel.FromSourceOptions,
  ): DataModel<TileDocument.Schema, DataModel.Any | null>;

  static override fromJSON(json: string): DataModel<TileDocument.Schema, DataModel.Any | null>;
}

export default BaseTile;

declare namespace BaseTile {
  export import Name = TileDocument.Name;
  export import ConstructorArgs = TileDocument.ConstructorArgs;
  export import Hierarchy = TileDocument.Hierarchy;
  export import Metadata = TileDocument.Metadata;
  export import Parent = TileDocument.Parent;
  export import Pack = TileDocument.Pack;
  export import Embedded = TileDocument.Embedded;
  export import EmbeddedName = TileDocument.EmbeddedName;
  export import EmbeddedCollectionName = TileDocument.EmbeddedCollectionName;
  export import ParentCollectionName = TileDocument.ParentCollectionName;
  export import Stored = TileDocument.Stored;
  export import Source = TileDocument.Source;
  export import PersistedData = TileDocument.PersistedData;
  export import CreateData = TileDocument.CreateData;
  export import InitializedData = TileDocument.InitializedData;
  export import UpdateData = TileDocument.UpdateData;
  export import Schema = TileDocument.Schema;
  export import DatabaseOperation = TileDocument.Database;
  export import Flags = TileDocument.Flags;

  /**
   * @deprecated This type is used by Foundry too vaguely.
   * In one context the most correct type is after initialization whereas in another one it should be
   * before but Foundry uses it interchangeably.
   */
  type Properties = SchemaField.InitializedData<Schema>;

  /**
   * @deprecated {@link foundry.data.fields.SchemaField | `SchemaField<BaseTileDocument.Schema>`}
   */
  type SchemaField = foundry.data.fields.SchemaField<Schema>;

  /**
   * @deprecated {@link BaseTile.CreateData | `BaseTile.CreateData`}
   */
  type ConstructorData = BaseTile.CreateData;
}
