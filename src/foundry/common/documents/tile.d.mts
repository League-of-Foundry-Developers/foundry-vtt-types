import type { AnyObject, AnyMutableObject } from "../../../utils/index.d.mts";
import type DataModel from "../abstract/data.d.mts";
import type Document from "../abstract/document.mts";
import type { SchemaField } from "../data/fields.d.mts";

/**
 * The Document definition for a Tile.
 * Defines the DataSchema and common behaviors for a Tile which are shared between both client and server.
 */
// Note(LukeAbby): You may wonder why documents don't simply pass the `Parent` generic parameter.
// This pattern evolved from trying to avoid circular loops and even internal tsc errors.
// See: https://gist.github.com/LukeAbby/0d01b6e20ef19ebc304d7d18cef9cc21
declare abstract class BaseTile extends Document<"Tile", BaseTile.Schema, any> {
  /**
   * @param data    - Initial data from which to construct the Tile
   * @param context - Construction context options
   */
  // TODO(LukeAbby): This constructor is a symptom of a circular error.
  // constructor(data: BaseTile.ConstructorData, context?: Document.ConstructionContext<BaseTile.Parent>);

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
   * They are here because they're static properties but depend on the instance and so can't be
   * defined DRY-ly while also being easily overridable.
   */

  static " fvtt_types_internal_document_name_static": "Tile";

  static get implementation(): TileDocument.ImplementationClass;

  override parent: TileDocument.Parent;

  static createDocuments<Temporary extends boolean | undefined = false>(
    data: Array<TileDocument.Implementation | TileDocument.CreateData> | undefined,
    operation?: Document.Database.CreateOperation<TileDocument.DatabaseOperation.Create<Temporary>>,
  ): Promise<Array<Document.StoredIf<TileDocument.Implementation, Temporary>>>;

  static updateDocuments(
    updates: TileDocument.UpdateData[] | undefined,
    operation?: Document.Database.UpdateOperation<TileDocument.DatabaseOperation.Update>,
  ): Promise<TileDocument.Implementation[]>;

  static deleteDocuments(
    ids: readonly string[] | undefined,
    operation?: Document.Database.DeleteOperation<TileDocument.DatabaseOperation.Delete>,
  ): Promise<TileDocument.Implementation[]>;

  static create<Temporary extends boolean | undefined = false>(
    data: TileDocument.CreateData | TileDocument.CreateData[],
    operation?: Document.Database.CreateOperation<TileDocument.DatabaseOperation.Create<Temporary>>,
  ): Promise<TileDocument.Implementation | undefined>;

  static get(documentId: string, options?: Document.Database.GetOperation): TileDocument.Implementation | null;

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
