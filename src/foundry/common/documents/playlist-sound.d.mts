import type { InexactPartial } from "../../../utils/index.d.mts";
import type DataModel from "../abstract/data.d.mts";
import type Document from "../abstract/document.mts";
import type { SchemaField } from "../data/fields.d.mts";

/**
 * The PlaylistSound Document.
 * Defines the DataSchema and common behaviors for a PlaylistSound which are shared between both client and server.
 */
// Note(LukeAbby): You may wonder why documents don't simply pass the `Parent` generic parameter.
// This pattern evolved from trying to avoid circular loops and even internal tsc errors.
// See: https://gist.github.com/LukeAbby/0d01b6e20ef19ebc304d7d18cef9cc21
declare abstract class BasePlaylistSound extends Document<"PlaylistSound", BasePlaylistSound.Schema, any> {
  /**
   * @param data    - Initial data from which to construct the PlaylistSound
   * @param context - Construction context options
   */
  // TODO(LukeAbby): This constructor is a symptom of a circular error.
  // constructor(
  //   data: BasePlaylistSound.CreateData,
  //   context?: Document.ConstructionContext<BasePlaylistSound.Parent>,
  // );

  static override metadata: BasePlaylistSound.Metadata;

  static override defineSchema(): BasePlaylistSound.Schema;

  override testUserPermission(
    user: User.Implementation,
    permission: keyof typeof CONST.DOCUMENT_OWNERSHIP_LEVELS | foundry.CONST.DOCUMENT_OWNERSHIP_LEVELS,
    options?: InexactPartial<{
      /**
       * Require the exact permission level requested?
       * @defaultValue `false`
       */
      exact: boolean;
    }>,
  ): boolean;

  /*
   * After this point these are not really overridden methods.
   * They are here because they're static properties but depend on the instance and so can't be
   * defined DRY-ly while also being easily overridable.
   */

  static " fvtt_types_internal_document_name_static": "PlaylistSound";

  static get implementation(): PlaylistSound.ImplementationClass;

  override parent: PlaylistSound.Parent;

  static createDocuments<Temporary extends boolean | undefined = false>(
    data: Array<PlaylistSound.Implementation | PlaylistSound.CreateData> | undefined,
    operation?: Document.Database.CreateOperation<PlaylistSound.DatabaseOperation.Create<Temporary>>,
  ): Promise<Array<Document.StoredIf<PlaylistSound.Implementation, Temporary>>>;

  static updateDocuments(
    updates: PlaylistSound.UpdateData[] | undefined,
    operation?: Document.Database.UpdateOperation<PlaylistSound.DatabaseOperation.Update>,
  ): Promise<PlaylistSound.Implementation[]>;

  static deleteDocuments(
    ids: readonly string[] | undefined,
    operation?: Document.Database.DeleteOperation<PlaylistSound.DatabaseOperation.Delete>,
  ): Promise<PlaylistSound.Implementation[]>;

  static create<Temporary extends boolean | undefined = false>(
    data: PlaylistSound.CreateData | PlaylistSound.CreateData[],
    operation?: Document.Database.CreateOperation<PlaylistSound.DatabaseOperation.Create<Temporary>>,
  ): Promise<PlaylistSound.Implementation | undefined>;

  static get(documentId: string, options?: Document.Database.GetOperation): PlaylistSound.Implementation | null;

  protected _preCreate(
    data: PlaylistSound.CreateData,
    options: PlaylistSound.DatabaseOperation.PreCreateOperationInstance,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected _onCreate(
    data: PlaylistSound.CreateData,
    options: PlaylistSound.DatabaseOperation.OnCreateOperation,
    userId: string,
  ): void;

  protected static _preCreateOperation(
    documents: PlaylistSound.Implementation[],
    operation: Document.Database.PreCreateOperationStatic<PlaylistSound.DatabaseOperation.Create>,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static _onCreateOperation(
    documents: PlaylistSound.Implementation[],
    operation: PlaylistSound.DatabaseOperation.Create,
    user: User.Implementation,
  ): Promise<void>;

  protected _preUpdate(
    changed: PlaylistSound.UpdateData,
    options: PlaylistSound.DatabaseOperation.PreUpdateOperationInstance,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected _onUpdate(
    changed: PlaylistSound.UpdateData,
    options: PlaylistSound.DatabaseOperation.OnUpdateOperation,
    userId: string,
  ): void;

  protected static _preUpdateOperation(
    documents: PlaylistSound.Implementation[],
    operation: PlaylistSound.DatabaseOperation.Update,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static _onUpdateOperation(
    documents: PlaylistSound.Implementation[],
    operation: PlaylistSound.DatabaseOperation.Update,
    user: User.Implementation,
  ): Promise<void>;

  protected _preDelete(
    options: PlaylistSound.DatabaseOperation.PreDeleteOperationInstance,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected _onDelete(options: PlaylistSound.DatabaseOperation.OnDeleteOperation, userId: string): void;

  protected static _preDeleteOperation(
    documents: PlaylistSound.Implementation[],
    operation: PlaylistSound.DatabaseOperation.Delete,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static _onDeleteOperation(
    documents: PlaylistSound.Implementation[],
    operation: PlaylistSound.DatabaseOperation.Delete,
    user: User.Implementation,
  ): Promise<void>;

  protected static _onCreateDocuments(
    documents: PlaylistSound.Implementation[],
    context: Document.ModificationContext<PlaylistSound.Parent>,
  ): Promise<void>;

  protected static _onUpdateDocuments(
    documents: PlaylistSound.Implementation[],
    context: Document.ModificationContext<PlaylistSound.Parent>,
  ): Promise<void>;

  protected static _onDeleteDocuments(
    documents: PlaylistSound.Implementation[],
    context: Document.ModificationContext<PlaylistSound.Parent>,
  ): Promise<void>;

  protected static _schema: SchemaField<PlaylistSound.Schema>;

  static get schema(): SchemaField<PlaylistSound.Schema>;

  static validateJoint(data: PlaylistSound.Source): void;

  static override fromSource(
    source: PlaylistSound.UpdateData,
    { strict, ...context }?: DataModel.FromSourceOptions,
  ): DataModel<PlaylistSound.Schema, DataModel.Any | null>;

  static override fromJSON(json: string): DataModel<PlaylistSound.Schema, DataModel.Any | null>;
}

export default BasePlaylistSound;

declare namespace BasePlaylistSound {
  export import Metadata = PlaylistSound.Metadata;
  export import Parent = PlaylistSound.Parent;
  export import Stored = PlaylistSound.Stored;
  export import Source = PlaylistSound.Source;
  export import PersistedData = PlaylistSound.PersistedData;
  export import CreateData = PlaylistSound.CreateData;
  export import InitializedData = PlaylistSound.InitializedData;
  export import UpdateData = PlaylistSound.UpdateData;
  export import Schema = PlaylistSound.Schema;
  export import DatabaseOperation = PlaylistSound.DatabaseOperation;

  /**
   * @deprecated This type is used by Foundry too vaguely.
   * In one context the most correct type is after initialization whereas in another one it should be
   * before but Foundry uses it interchangeably.
   */
  type Properties = SchemaField.InitializedData<Schema>;

  /**
   * @deprecated {@link foundry.data.fields.SchemaField | `SchemaField<BasePlaylistSound.Schema>`}
   */
  type SchemaField = foundry.data.fields.SchemaField<Schema>;

  /**
   * @deprecated {@link BasePlaylistSound.CreateData | `BasePlaylistSound.CreateData`}
   */
  type ConstructorData = BasePlaylistSound.CreateData;
}
