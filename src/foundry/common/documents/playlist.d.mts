import type { AnyObject, AnyMutableObject } from "../../../utils/index.d.mts";
import type DataModel from "../abstract/data.d.mts";
import type Document from "../abstract/document.mts";
import type { SchemaField } from "../data/fields.d.mts";

/**
 * The Playlist Document.
 * Defines the DataSchema and common behaviors for a Playlist which are shared between both client and server.
 */
// Note(LukeAbby): You may wonder why documents don't simply pass the `Parent` generic parameter.
// This pattern evolved from trying to avoid circular loops and even internal tsc errors.
// See: https://gist.github.com/LukeAbby/0d01b6e20ef19ebc304d7d18cef9cc21
declare abstract class BasePlaylist extends Document<"Playlist", BasePlaylist.Schema, any> {
  /**
   * @param data    - Initial data from which to construct the Playlist
   * @param context - Construction context options
   */
  // TODO(LukeAbby): This constructor is a symptom of a circular error.
  // constructor(data: BasePlaylist.CreateData, context?: Document.ConstructionContext<BasePlaylist.Parent>);

  static override metadata: BasePlaylist.Metadata;

  static override defineSchema(): BasePlaylist.Schema;

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

  static " __fvtt_types_internal_document_name_static": "Playlist";

  static get implementation(): Playlist.ImplementationClass;

  override parent: Playlist.Parent;

  static createDocuments<Temporary extends boolean | undefined>(
    data: Array<Playlist.Implementation | Playlist.CreateData> | undefined,
    operation?: Document.Database.CreateOperation<Playlist.DatabaseOperation.Create<Temporary>>,
  ): Promise<Array<Document.StoredIf<Playlist.Implementation, Temporary>>>;

  static updateDocuments(
    updates: Playlist.UpdateData[] | undefined,
    operation?: Document.Database.UpdateOperation<Playlist.DatabaseOperation.Update>,
  ): Promise<Playlist.Implementation[]>;

  static deleteDocuments(
    ids: readonly string[] | undefined,
    operation?: Document.Database.DeleteOperation<Playlist.DatabaseOperation.Delete>,
  ): Promise<Playlist.Implementation[]>;

  static create<Temporary extends boolean | undefined>(
    data: Playlist.CreateData | Playlist.CreateData[],
    operation?: Document.Database.CreateOperation<Playlist.DatabaseOperation.Create<Temporary>>,
  ): Promise<Playlist.Implementation | undefined>;

  static get(documentId: string, options?: Document.Database.GetOperation): Playlist.Implementation | null;

  protected _preCreate(
    data: Playlist.CreateData,
    options: Playlist.DatabaseOperation.PreCreateOperationInstance,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected _onCreate(
    data: Playlist.CreateData,
    options: Playlist.DatabaseOperation.OnCreateOperation,
    userId: string,
  ): void;

  protected static _preCreateOperation(
    documents: Playlist.Implementation[],
    operation: Document.Database.PreCreateOperationStatic<Playlist.DatabaseOperation.Create>,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static _onCreateOperation(
    documents: Playlist.Implementation[],
    operation: Playlist.DatabaseOperation.Create,
    user: User.Implementation,
  ): Promise<void>;

  protected _preUpdate(
    changed: Playlist.UpdateData,
    options: Playlist.DatabaseOperation.PreUpdateOperationInstance,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected _onUpdate(
    changed: Playlist.UpdateData,
    options: Playlist.DatabaseOperation.OnUpdateOperation,
    userId: string,
  ): void;

  protected static _preUpdateOperation(
    documents: Playlist.Implementation[],
    operation: Playlist.DatabaseOperation.Update,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static _onUpdateOperation(
    documents: Playlist.Implementation[],
    operation: Playlist.DatabaseOperation.Update,
    user: User.Implementation,
  ): Promise<void>;

  protected _preDelete(
    options: Playlist.DatabaseOperation.PreDeleteOperationInstance,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected _onDelete(options: Playlist.DatabaseOperation.OnDeleteOperation, userId: string): void;

  protected static _preDeleteOperation(
    documents: Playlist.Implementation[],
    operation: Playlist.DatabaseOperation.Delete,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static _onDeleteOperation(
    documents: Playlist.Implementation[],
    operation: Playlist.DatabaseOperation.Delete,
    user: User.Implementation,
  ): Promise<void>;

  protected static _onCreateDocuments(
    documents: Playlist.Implementation[],
    context: Document.ModificationContext<Playlist.Parent>,
  ): Promise<void>;

  protected static _onUpdateDocuments(
    documents: Playlist.Implementation[],
    context: Document.ModificationContext<Playlist.Parent>,
  ): Promise<void>;

  protected static _onDeleteDocuments(
    documents: Playlist.Implementation[],
    context: Document.ModificationContext<Playlist.Parent>,
  ): Promise<void>;

  protected static _schema: SchemaField<Playlist.Schema>;

  static get schema(): SchemaField<Playlist.Schema>;

  static validateJoint(data: Playlist.Source): void;

  static override fromSource(
    source: Playlist.UpdateData,
    { strict, ...context }?: DataModel.FromSourceOptions,
  ): DataModel<Playlist.Schema, DataModel.Any | null>;

  static override fromJSON(json: string): DataModel<Playlist.Schema, DataModel.Any | null>;
}

export default BasePlaylist;

declare namespace BasePlaylist {
  export import Metadata = Playlist.Metadata;
  export import Parent = Playlist.Parent;
  export import Stored = Playlist.Stored;
  export import Source = Playlist.Source;
  export import PersistedData = Playlist.PersistedData;
  export import CreateData = Playlist.CreateData;
  export import InitializedData = Playlist.InitializedData;
  export import UpdateData = Playlist.UpdateData;
  export import Schema = Playlist.Schema;
  export import DatabaseOperation = Playlist.DatabaseOperation;

  /**
   * @deprecated This type is used by Foundry too vaguely.
   * In one context the most correct type is after initialization whereas in another one it should be
   * before but Foundry uses it interchangeably.
   */
  type Properties = SchemaField.InitializedData<Schema>;

  /**
   * @deprecated {@link foundry.data.fields.SchemaField | `SchemaField<BasePlaylist.Schema>`}
   */
  type SchemaField = foundry.data.fields.SchemaField<Schema>;

  /**
   * @deprecated {@link BasePlaylist.CreateData | `BasePlaylist.CreateData`}
   */
  type ConstructorData = BasePlaylist.CreateData;
}
