import type { AnyMutableObject } from "fvtt-types/utils";
import type { SchemaField } from "../data/fields.d.mts";
import type DataModel from "../abstract/data.d.mts";
import type Document from "../abstract/document.mts";

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
  constructor(...args: Document.ConstructorParameters<BaseTile.CreateData, BaseTile.Parent>);

  /**
   * @defaultValue
   * ```js
   * mergeObject(super.metadata, {
   *   name: "Tile",
   *   collection: "tiles",
   *   label: "DOCUMENT.Tile",
   *   labelPlural: "DOCUMENT.Tiles",
   *   schemaVersion: "12.324"
   * })
   * ```
   */
  static override metadata: BaseTile.Metadata;

  static override defineSchema(): BaseTile.Schema;

  /**
   * @remarks Migrates:
   * - `z` to `sort`
   * - `roof` to `restrictions.light` and `restrictions.weather`
   */
  static override migrateData(source: AnyMutableObject): AnyMutableObject;

  /**
   * @remarks Shims:
   * - `z` to `sort` since v12, until v14
   */
  static override shimData(data: AnyMutableObject, options?: DataModel.ShimDataOptions): AnyMutableObject;

  /**
   * @deprecated since v12, until v14
   * @remarks "You are accessing `roof` which has been migrated to `restrictions.{light|weather}`"
   *
   * Getter returns `this.restrictions.light && this.restrictions.weather`, setter sets both
   */
  set roof(value: boolean);

  get roof();

  /**
   * @deprecated since v12, until v14
   * @remarks "You are accessing `z` which has been migrated to `sort`"
   */
  get z(): this["sort"];

  /**
   * @deprecated since v12, until v14
   * @remarks "`BaseTile#overhead` is deprecated."
   *
   * Returns `this.elevation >= this.parent?.foregroundElevation`
   */
  get overhead(): boolean;

  /*
   * After this point these are not really overridden methods.
   * They are here because they're static properties but depend on the instance and so can't be
   * defined DRY-ly while also being easily overridable.
   */

  static " fvtt_types_internal_document_name_static": "Tile";

  static get implementation(): TileDocument.ImplementationClass;

  override parent: TileDocument.Parent;

  static createDocuments<Temporary extends boolean | undefined = false>(
    data: Array<TileDocument.Implementation | TileDocument.CreateData> | undefined,
    operation?: Document.Database.CreateOperation<TileDocument.DatabaseOperation.Create<Temporary>>,
  ): Promise<Array<Document.TemporaryIf<TileDocument.Implementation, Temporary>>>;

  static updateDocuments(
    updates: TileDocument.UpdateData[] | undefined,
    operation?: Document.Database.UpdateDocumentsOperation<TileDocument.DatabaseOperation.Update>,
  ): Promise<TileDocument.Implementation[]>;

  static deleteDocuments(
    ids: readonly string[] | undefined,
    operation?: Document.Database.DeleteDocumentsOperation<TileDocument.DatabaseOperation.Delete>,
  ): Promise<TileDocument.Implementation[]>;

  static create<Temporary extends boolean | undefined = false>(
    data: TileDocument.CreateData | TileDocument.CreateData[],
    operation?: Document.Database.CreateOperation<TileDocument.DatabaseOperation.Create<Temporary>>,
  ): Promise<TileDocument.Implementation | undefined>;

  static get(documentId: string, options?: Document.Database.GetOptions): TileDocument.Implementation | null;

  protected _preCreate(
    data: TileDocument.CreateData,
    options: TileDocument.DatabaseOperation.PreCreateOperationInstance,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected _onCreate(
    data: TileDocument.CreateData,
    options: TileDocument.DatabaseOperation.OnCreateOperation,
    userId: string,
  ): void;

  protected static _preCreateOperation(
    documents: TileDocument.Implementation[],
    operation: Document.Database.PreCreateOperationStatic<TileDocument.DatabaseOperation.Create>,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static _onCreateOperation(
    documents: TileDocument.Implementation[],
    operation: TileDocument.DatabaseOperation.Create,
    user: User.Implementation,
  ): Promise<void>;

  protected _preUpdate(
    changed: TileDocument.UpdateData,
    options: TileDocument.DatabaseOperation.PreUpdateOperationInstance,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected _onUpdate(
    changed: TileDocument.UpdateData,
    options: TileDocument.DatabaseOperation.OnUpdateOperation,
    userId: string,
  ): void;

  protected static _preUpdateOperation(
    documents: TileDocument.Implementation[],
    operation: TileDocument.DatabaseOperation.Update,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static _onUpdateOperation(
    documents: TileDocument.Implementation[],
    operation: TileDocument.DatabaseOperation.Update,
    user: User.Implementation,
  ): Promise<void>;

  protected _preDelete(
    options: TileDocument.DatabaseOperation.PreDeleteOperationInstance,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected _onDelete(options: TileDocument.DatabaseOperation.OnDeleteOperation, userId: string): void;

  protected static _preDeleteOperation(
    documents: TileDocument.Implementation[],
    operation: TileDocument.DatabaseOperation.Delete,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static _onDeleteOperation(
    documents: TileDocument.Implementation[],
    operation: TileDocument.DatabaseOperation.Delete,
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
  export import Metadata = TileDocument.Metadata;
  export import Parent = TileDocument.Parent;
  export import Stored = TileDocument.Stored;
  export import Source = TileDocument.Source;
  export import PersistedData = TileDocument.PersistedData;
  export import CreateData = TileDocument.CreateData;
  export import InitializedData = TileDocument.InitializedData;
  export import UpdateData = TileDocument.UpdateData;
  export import Schema = TileDocument.Schema;
  export import DatabaseOperation = TileDocument.DatabaseOperation;
  export import CoreFlags = TileDocument.CoreFlags;

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
