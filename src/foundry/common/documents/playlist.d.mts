import type { AnyObject, AnyMutableObject } from "fvtt-types/utils";
import type DataModel from "../abstract/data.d.mts";
import type Document from "../abstract/document.mts";
import type { DataField, SchemaField } from "../data/fields.d.mts";
import type { LogCompatibilityWarningOptions } from "../utils/logging.d.mts";

/**
 * The Playlist Document.
 * Defines the DataSchema and common behaviors for a Playlist which are shared between both client and server.
 */
// Note(LukeAbby): You may wonder why documents don't simply pass the `Parent` generic parameter.
// This pattern evolved from trying to avoid circular loops and even internal tsc errors.
// See: https://gist.github.com/LukeAbby/0d01b6e20ef19ebc304d7d18cef9cc21
declare abstract class BasePlaylist extends Document<"Playlist", BasePlaylist.Schema, any> {
  /**
   * @param data    - Initial data from which to construct the `BasePlaylist`
   * @param context - Construction context options
   *
   * @deprecated Constructing `BasePlaylist` directly is not advised. The base document classes exist in
   * order to use documents on both the client (i.e. where all your code runs) and behind the scenes
   * on the server to manage document validation and storage.
   *
   * You should use {@link Playlist.implementation | `new Playlist.implementation(...)`} instead which will give you
   * a system specific implementation of `Playlist`.
   */
  constructor(...args: Playlist.ConstructorArgs);

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
   * They are here because Foundry's documents are complex and have lots of edge cases.
   * There are DRY ways of representing this but this ends up being harder to understand
   * for end users extending these functions, especially for static methods. There are also a
   * number of methods that don't make sense to call directly on `Document` like `createDocuments`,
   * as there is no data that can safely construct every possible document. Finally keeping definitions
   * separate like this helps against circularities.
   */

  /* Document overrides */

  static " fvtt_types_internal_document_name_static": "Playlist";

  // Same as Document for now
  protected static override _initializationOrder(): Generator<[string, DataField.Any]>;

  readonly parentCollection: Playlist.ParentCollectionName | null;

  readonly pack: string | null;

  static get implementation(): Playlist.ImplementationClass;

  static get baseDocument(): typeof BasePlaylist;

  static get collectionName(): Playlist.ParentCollectionName;

  static get documentName(): Playlist.Name;

  static get TYPES(): CONST.BASE_DOCUMENT_TYPE[];

  static get hasTypeData(): undefined;

  static get hierarchy(): Playlist.Hierarchy;

  override parent: Playlist.Parent;

  static createDocuments<Temporary extends boolean | undefined = false>(
    data: Array<Playlist.Implementation | Playlist.CreateData> | undefined,
    operation?: Document.Database.CreateOperation<Playlist.Database.Create<Temporary>>,
  ): Promise<Array<Document.TemporaryIf<Playlist.Implementation, Temporary>>>;

  static updateDocuments(
    updates: Playlist.UpdateData[] | undefined,
    operation?: Document.Database.UpdateDocumentsOperation<Playlist.Database.Update>,
  ): Promise<Playlist.Implementation[]>;

  static deleteDocuments(
    ids: readonly string[] | undefined,
    operation?: Document.Database.DeleteDocumentsOperation<Playlist.Database.Delete>,
  ): Promise<Playlist.Implementation[]>;

  static override create<Temporary extends boolean | undefined = false>(
    data: Playlist.CreateData | Playlist.CreateData[],
    operation?: Playlist.Database.CreateOperation<Temporary>,
  ): Promise<Document.TemporaryIf<Playlist.Implementation, Temporary> | undefined>;

  override update(
    data: Playlist.UpdateData | undefined,
    operation?: Playlist.Database.UpdateOperation,
  ): Promise<this | undefined>;

  override delete(operation?: Playlist.Database.DeleteOperation): Promise<this | undefined>;

  static override get(documentId: string, options?: Playlist.Database.GetOptions): Playlist.Implementation | null;

  static override getCollectionName<CollectionName extends Playlist.Embedded.Name>(
    name: CollectionName,
  ): Playlist.Embedded.CollectionNameOf<CollectionName> | null;

  override getEmbeddedCollection<EmbeddedName extends Playlist.Embedded.CollectionName>(
    embeddedName: EmbeddedName,
  ): Playlist.Embedded.CollectionFor<EmbeddedName>;

  override getEmbeddedDocument<EmbeddedName extends Playlist.Embedded.CollectionName>(
    embeddedName: EmbeddedName,
    id: string,
    options: Document.GetEmbeddedDocumentOptions,
  ): Playlist.Embedded.DocumentFor<EmbeddedName> | undefined;

  override createEmbeddedDocuments<EmbeddedName extends Playlist.Embedded.Name>(
    embeddedName: EmbeddedName,
    data: Document.CreateDataForName<EmbeddedName>[] | undefined,
    // TODO(LukeAbby): The correct signature would be:
    // operation?: Document.Database.CreateOperation<Document.Database.CreateForName<EmbeddedName>>,
    // However this causes a number of errors.
    operation?: object,
  ): Promise<Array<Document.Stored<Document.ImplementationFor<EmbeddedName>>> | undefined>;

  override updateEmbeddedDocuments<EmbeddedName extends Playlist.Embedded.Name>(
    embeddedName: EmbeddedName,
    updates: Document.UpdateDataForName<EmbeddedName>[] | undefined,
    operation?: Document.Database.UpdateOperationForName<EmbeddedName>,
  ): Promise<Array<Document.Stored<Document.ImplementationFor<EmbeddedName>>> | undefined>;

  override deleteEmbeddedDocuments<EmbeddedName extends Playlist.Embedded.Name>(
    embeddedName: EmbeddedName,
    ids: Array<string>,
    operation?: Document.Database.DeleteOperationForName<EmbeddedName>,
  ): Promise<Array<Document.Stored<Document.ImplementationFor<EmbeddedName>>>>;

  // Same as Document for now
  override traverseEmbeddedDocuments(_parentPath?: string): Generator<[string, Document.AnyChild<this>]>;

  override getFlag<Scope extends Playlist.Flags.Scope, Key extends Playlist.Flags.Key<Scope>>(
    scope: Scope,
    key: Key,
  ): Document.GetFlag<Playlist.Name, Scope, Key>;

  override setFlag<
    Scope extends Playlist.Flags.Scope,
    Key extends Playlist.Flags.Key<Scope>,
    Value extends Document.GetFlag<Playlist.Name, Scope, Key>,
  >(scope: Scope, key: Key, value: Value): Promise<this>;

  override unsetFlag<Scope extends Playlist.Flags.Scope, Key extends Playlist.Flags.Key<Scope>>(
    scope: Scope,
    key: Key,
  ): Promise<this>;

  protected _preCreate(
    data: Playlist.CreateData,
    options: Playlist.Database.PreCreateOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected _onCreate(data: Playlist.CreateData, options: Playlist.Database.OnCreateOperation, userId: string): void;

  protected static _preCreateOperation(
    documents: Playlist.Implementation[],
    operation: Document.Database.PreCreateOperationStatic<Playlist.Database.Create>,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static _onCreateOperation(
    documents: Playlist.Implementation[],
    operation: Playlist.Database.Create,
    user: User.Implementation,
  ): Promise<void>;

  protected _preUpdate(
    changed: Playlist.UpdateData,
    options: Playlist.Database.PreUpdateOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected _onUpdate(changed: Playlist.UpdateData, options: Playlist.Database.OnUpdateOperation, userId: string): void;

  protected static _preUpdateOperation(
    documents: Playlist.Implementation[],
    operation: Playlist.Database.Update,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static _onUpdateOperation(
    documents: Playlist.Implementation[],
    operation: Playlist.Database.Update,
    user: User.Implementation,
  ): Promise<void>;

  protected _preDelete(options: Playlist.Database.PreDeleteOptions, user: User.Implementation): Promise<boolean | void>;

  protected _onDelete(options: Playlist.Database.OnDeleteOperation, userId: string): void;

  protected static _preDeleteOperation(
    documents: Playlist.Implementation[],
    operation: Playlist.Database.Delete,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static _onDeleteOperation(
    documents: Playlist.Implementation[],
    operation: Playlist.Database.Delete,
    user: User.Implementation,
  ): Promise<void>;

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

  /* DataModel overrides */

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
  export import Name = Playlist.Name;
  export import ConstructorArgs = Playlist.ConstructorArgs;
  export import Hierarchy = Playlist.Hierarchy;
  export import Metadata = Playlist.Metadata;
  export import Parent = Playlist.Parent;
  export import Descendant = Playlist.Descendant;
  export import DescendantClass = Playlist.DescendantClass;
  export import Pack = Playlist.Pack;
  export import Embedded = Playlist.Embedded;
  export import ParentCollectionName = Playlist.ParentCollectionName;
  export import CollectionClass = Playlist.CollectionClass;
  export import Collection = Playlist.Collection;
  export import Invalid = Playlist.Invalid;
  export import Stored = Playlist.Stored;
  export import Source = Playlist.Source;
  export import PersistedData = Playlist.Source;
  export import CreateData = Playlist.CreateData;
  export import InitializedData = Playlist.InitializedData;
  export import UpdateData = Playlist.UpdateData;
  export import Schema = Playlist.Schema;
  export import DatabaseOperation = Playlist.Database;
  export import Flags = Playlist.Flags;

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
