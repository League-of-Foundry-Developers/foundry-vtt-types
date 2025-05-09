import type { AnyObject, InexactPartial } from "fvtt-types/utils";
import type DataModel from "../abstract/data.d.mts";
import type Document from "../abstract/document.mts";
import type { DataField, SchemaField } from "../data/fields.d.mts";
import type { LogCompatibilityWarningOptions } from "../utils/logging.d.mts";

/**
 * The PlaylistSound Document.
 * Defines the DataSchema and common behaviors for a PlaylistSound which are shared between both client and server.
 */
// Note(LukeAbby): You may wonder why documents don't simply pass the `Parent` generic parameter.
// This pattern evolved from trying to avoid circular loops and even internal tsc errors.
// See: https://gist.github.com/LukeAbby/0d01b6e20ef19ebc304d7d18cef9cc21
declare abstract class BasePlaylistSound extends Document<"PlaylistSound", BasePlaylistSound.Schema, any> {
  /**
   * @param data    - Initial data from which to construct the `BasePlaylistSound`
   * @param context - Construction context options
   *
   * @deprecated Constructing `BasePlaylistSound` directly is not advised. The base document classes exist in
   * order to use documents on both the client (i.e. where all your code runs) and behind the scenes
   * on the server to manage document validation and storage.
   *
   * You should use {@link PlaylistSound.implementation | `new PlaylistSound.implementation(...)`} instead which will give you
   * a system specific implementation of `PlaylistSound`.
   */
  constructor(...args: PlaylistSound.ConstructorArgs);

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
   * They are here because Foundry's documents are complex and have lots of edge cases.
   * There are DRY ways of representing this but this ends up being harder to understand
   * for end users extending these functions, especially for static methods. There are also a
   * number of methods that don't make sense to call directly on `Document` like `createDocuments`,
   * as there is no data that can safely construct every possible document. Finally keeping definitions
   * separate like this helps against circularities.
   */

  /* Document overrides */

  static " fvtt_types_internal_document_name_static": "PlaylistSound";

  // Same as Document for now
  protected static override _initializationOrder(): Generator<[string, DataField.Any]>;

  readonly parentCollection: PlaylistSound.ParentCollectionName | null;

  readonly pack: string | null;

  static get implementation(): PlaylistSound.ImplementationClass;

  static get baseDocument(): typeof BasePlaylistSound;

  static get collectionName(): PlaylistSound.ParentCollectionName;

  static get documentName(): PlaylistSound.Name;

  static get TYPES(): CONST.BASE_DOCUMENT_TYPE[];

  static get hasTypeData(): undefined;

  static get hierarchy(): PlaylistSound.Hierarchy;

  override parent: PlaylistSound.Parent;

  static createDocuments<Temporary extends boolean | undefined = false>(
    data: Array<PlaylistSound.Implementation | PlaylistSound.CreateData> | undefined,
    operation?: Document.Database.CreateOperation<PlaylistSound.Database.Create<Temporary>>,
  ): Promise<Array<Document.TemporaryIf<PlaylistSound.Implementation, Temporary>>>;

  static updateDocuments(
    updates: PlaylistSound.UpdateData[] | undefined,
    operation?: Document.Database.UpdateDocumentsOperation<PlaylistSound.Database.Update>,
  ): Promise<PlaylistSound.Implementation[]>;

  static deleteDocuments(
    ids: readonly string[] | undefined,
    operation?: Document.Database.DeleteDocumentsOperation<PlaylistSound.Database.Delete>,
  ): Promise<PlaylistSound.Implementation[]>;

  static override create<Temporary extends boolean | undefined = false>(
    data: PlaylistSound.CreateData | PlaylistSound.CreateData[],
    operation?: PlaylistSound.Database.CreateOperation<Temporary>,
  ): Promise<Document.TemporaryIf<PlaylistSound.Implementation, Temporary> | undefined>;

  override update(
    data: PlaylistSound.UpdateData | undefined,
    operation?: PlaylistSound.Database.UpdateOperation,
  ): Promise<this | undefined>;

  override delete(operation?: PlaylistSound.Database.DeleteOperation): Promise<this | undefined>;

  static override get(
    documentId: string,
    options?: PlaylistSound.Database.GetOptions,
  ): PlaylistSound.Implementation | null;

  static override getCollectionName(name: string): null;

  // Same as Document for now
  override traverseEmbeddedDocuments(_parentPath?: string): Generator<[string, Document.AnyChild<this>]>;

  override getFlag<Scope extends PlaylistSound.Flags.Scope, Key extends PlaylistSound.Flags.Key<Scope>>(
    scope: Scope,
    key: Key,
  ): Document.GetFlag<PlaylistSound.Name, Scope, Key>;

  override setFlag<
    Scope extends PlaylistSound.Flags.Scope,
    Key extends PlaylistSound.Flags.Key<Scope>,
    Value extends Document.GetFlag<PlaylistSound.Name, Scope, Key>,
  >(scope: Scope, key: Key, value: Value): Promise<this>;

  override unsetFlag<Scope extends PlaylistSound.Flags.Scope, Key extends PlaylistSound.Flags.Key<Scope>>(
    scope: Scope,
    key: Key,
  ): Promise<this>;

  protected _preCreate(
    data: PlaylistSound.CreateData,
    options: PlaylistSound.Database.PreCreateOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected _onCreate(
    data: PlaylistSound.CreateData,
    options: PlaylistSound.Database.OnCreateOperation,
    userId: string,
  ): void;

  protected static _preCreateOperation(
    documents: PlaylistSound.Implementation[],
    operation: Document.Database.PreCreateOperationStatic<PlaylistSound.Database.Create>,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static _onCreateOperation(
    documents: PlaylistSound.Implementation[],
    operation: PlaylistSound.Database.Create,
    user: User.Implementation,
  ): Promise<void>;

  protected _preUpdate(
    changed: PlaylistSound.UpdateData,
    options: PlaylistSound.Database.PreUpdateOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected _onUpdate(
    changed: PlaylistSound.UpdateData,
    options: PlaylistSound.Database.OnUpdateOperation,
    userId: string,
  ): void;

  protected static _preUpdateOperation(
    documents: PlaylistSound.Implementation[],
    operation: PlaylistSound.Database.Update,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static _onUpdateOperation(
    documents: PlaylistSound.Implementation[],
    operation: PlaylistSound.Database.Update,
    user: User.Implementation,
  ): Promise<void>;

  protected _preDelete(
    options: PlaylistSound.Database.PreDeleteOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected _onDelete(options: PlaylistSound.Database.OnDeleteOperation, userId: string): void;

  protected static _preDeleteOperation(
    documents: PlaylistSound.Implementation[],
    operation: PlaylistSound.Database.Delete,
    user: User.Implementation,
  ): Promise<boolean | void>;

  static get hasSystemData(): undefined;

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
    documents: PlaylistSound.Implementation[],
    operation: PlaylistSound.Database.Delete,
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

  /* DataModel overrides */

  protected static _schema: SchemaField<PlaylistSound.Schema>;

  static get schema(): SchemaField<PlaylistSound.Schema>;

  static validateJoint(data: PlaylistSound.Source): void;

  static override fromSource(
    source: PlaylistSound.CreateData,
    { strict, ...context }?: DataModel.FromSourceOptions,
  ): PlaylistSound.Implementation;

  static override fromJSON(json: string): PlaylistSound.Implementation;
}

export default BasePlaylistSound;

declare namespace BasePlaylistSound {
  export import Name = PlaylistSound.Name;
  export import ConstructorArgs = PlaylistSound.ConstructorArgs;
  export import Hierarchy = PlaylistSound.Hierarchy;
  export import Metadata = PlaylistSound.Metadata;
  export import Parent = PlaylistSound.Parent;
  export import Descendant = PlaylistSound.Descendant;
  export import DescendantClass = PlaylistSound.DescendantClass;
  export import Pack = PlaylistSound.Pack;
  export import Embedded = PlaylistSound.Embedded;
  export import ParentCollectionName = PlaylistSound.ParentCollectionName;
  export import CollectionClass = PlaylistSound.CollectionClass;
  export import Collection = PlaylistSound.Collection;
  export import Invalid = PlaylistSound.Invalid;
  export import Stored = PlaylistSound.Stored;
  export import Source = PlaylistSound.Source;
  export import PersistedData = PlaylistSound.Source;
  export import CreateData = PlaylistSound.CreateData;
  export import InitializedData = PlaylistSound.InitializedData;
  export import UpdateData = PlaylistSound.UpdateData;
  export import Schema = PlaylistSound.Schema;
  export import DatabaseOperation = PlaylistSound.Database;
  export import Flags = PlaylistSound.Flags;

  /**
   * @deprecated This type is used by Foundry too vaguely.
   * In one context the most correct type is after initialization whereas in another one it should be
   * before but Foundry uses it interchangeably.
   */
  type Properties = SchemaField.InitializedData<Schema>;

  /**
   * @deprecated Replaced with {@link foundry.data.fields.SchemaField | `SchemaField<BasePlaylistSound.Schema>`}
   */
  type SchemaField = foundry.data.fields.SchemaField<Schema>;

  /**
   * @deprecated Replaced with {@linkcode BasePlaylistSound.CreateData}
   */
  type ConstructorData = BasePlaylistSound.CreateData;
}
