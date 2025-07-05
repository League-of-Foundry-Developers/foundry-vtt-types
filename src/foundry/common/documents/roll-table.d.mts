import type { AnyMutableObject } from "#utils";
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
   * @remarks Constructing `BaseRollTable` directly is not advised. The base document classes exist in
   * order to use documents on both the client (i.e. where all your code runs) and behind the scenes
   * on the server to manage document validation and storage.
   *
   * You should use {@link RollTable.implementation | `new RollTable.implementation(...)`} instead which will give you
   * a system specific implementation of the `RollTable` document.
   */
  constructor(data: RollTable.CreateData, context?: RollTable.ConstructionContext);

  /**
   * @defaultValue
   * ```js
   * mergeObject(super.metadata, {
   *   name: "RollTable",
   *   collection: "tables",
   *   indexed: true,
   *   compendiumIndexFields: ["_id", "name", "description", "img", "sort", "folder"],
   *   embedded: {TableResult: "results"},
   *   label: "DOCUMENT.RollTable",
   *   labelPlural: "DOCUMENT.RollTables",
   *   schemaVersion: "13.341"
   * })
   * ```
   */
  static override metadata: BaseRollTable.Metadata;

  /** @defaultValue `["DOCUMENT", "TABLE"]` */
  static override LOCALIZATION_PREFIXES: string[];

  /**
   * The default icon used for newly created Macro documents
   * @defaultValue `"icons/svg/d20-grey.svg"`
   * @remarks "Macro" comes from foundry's comment
   */
  static DEFAULT_ICON: string;

  static override defineSchema(): BaseRollTable.Schema;

  protected override _initialize(options?: Document.InitializeOptions): void;

  /**
   * @remarks
   * Migrations:
   * - `flags.core.sourceId` to `_stats.compendiumSource` (since v12, no specified end)
   */
  static override migrateData(source: AnyMutableObject): AnyMutableObject;

  /** @remarks `source` instead of the parent's `data` here */
  static override shimData(source: AnyMutableObject, options?: DataModel.ShimDataOptions): AnyMutableObject;

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

  // Same as Document for now
  protected static override _initializationOrder(): Generator<[string, DataField.Any], void, undefined>;

  readonly parentCollection: RollTable.ParentCollectionName | null;

  readonly pack: string | null;

  static override get implementation(): RollTable.ImplementationClass;

  static get baseDocument(): typeof BaseRollTable;

  static get collectionName(): RollTable.ParentCollectionName;

  static get documentName(): RollTable.Name;

  static get TYPES(): CONST.BASE_DOCUMENT_TYPE[];

  static get hasTypeData(): undefined;

  static get hierarchy(): RollTable.Hierarchy;

  override parent: RollTable.Parent;

  static createDocuments<Temporary extends boolean | undefined = undefined>(
    data: Array<RollTable.Implementation | RollTable.CreateData> | undefined,
    operation?: Document.Database.CreateOperation<RollTable.Database.Create<Temporary>>,
  ): Promise<Array<RollTable.TemporaryIf<Temporary>>>;

  static updateDocuments(
    updates: RollTable.UpdateData[] | undefined,
    operation?: Document.Database.UpdateDocumentsOperation<RollTable.Database.Update>,
  ): Promise<RollTable.Implementation[]>;

  static deleteDocuments(
    ids: readonly string[] | undefined,
    operation?: Document.Database.DeleteDocumentsOperation<RollTable.Database.Delete>,
  ): Promise<RollTable.Implementation[]>;

  static override create<Temporary extends boolean | undefined = undefined>(
    data: RollTable.CreateData | RollTable.CreateData[],
    operation?: RollTable.Database.CreateOperation<Temporary>,
  ): Promise<RollTable.TemporaryIf<Temporary> | undefined>;

  override update(
    data: RollTable.UpdateData | undefined,
    operation?: RollTable.Database.UpdateOperation,
  ): Promise<this | undefined>;

  override delete(operation?: RollTable.Database.DeleteOperation): Promise<this | undefined>;

  static override get(documentId: string, options?: RollTable.Database.GetOptions): RollTable.Implementation | null;

  static override getCollectionName<CollectionName extends RollTable.Embedded.Name>(
    name: CollectionName,
  ): RollTable.Embedded.CollectionNameOf<CollectionName> | null;

  override getEmbeddedCollection<EmbeddedName extends RollTable.Embedded.CollectionName>(
    embeddedName: EmbeddedName,
  ): RollTable.Embedded.CollectionFor<EmbeddedName>;

  override getEmbeddedDocument<EmbeddedName extends RollTable.Embedded.CollectionName>(
    embeddedName: EmbeddedName,
    id: string,
    options: Document.GetEmbeddedDocumentOptions,
  ): RollTable.Embedded.DocumentFor<EmbeddedName> | undefined;

  override createEmbeddedDocuments<EmbeddedName extends RollTable.Embedded.Name>(
    embeddedName: EmbeddedName,
    data: Document.CreateDataForName<EmbeddedName>[] | undefined,
    // TODO(LukeAbby): The correct signature would be:
    // operation?: Document.Database.CreateOperation<Document.Database.CreateForName<EmbeddedName>>,
    // However this causes a number of errors.
    operation?: object,
  ): Promise<Array<Document.StoredForName<EmbeddedName>> | undefined>;

  override updateEmbeddedDocuments<EmbeddedName extends RollTable.Embedded.Name>(
    embeddedName: EmbeddedName,
    updates: Document.UpdateDataForName<EmbeddedName>[] | undefined,
    operation?: Document.Database.UpdateOperationForName<EmbeddedName>,
  ): Promise<Array<Document.StoredForName<EmbeddedName>> | undefined>;

  override deleteEmbeddedDocuments<EmbeddedName extends RollTable.Embedded.Name>(
    embeddedName: EmbeddedName,
    ids: Array<string>,
    operation?: Document.Database.DeleteOperationForName<EmbeddedName>,
  ): Promise<Array<Document.StoredForName<EmbeddedName>>>;

  // Same as Document for now
  override traverseEmbeddedDocuments(
    _parentPath?: string,
  ): Generator<[string, Document.AnyChild<this>], void, undefined>;

  override getFlag<Scope extends RollTable.Flags.Scope, Key extends RollTable.Flags.Key<Scope>>(
    scope: Scope,
    key: Key,
  ): RollTable.Flags.Get<Scope, Key>;

  override setFlag<
    Scope extends RollTable.Flags.Scope,
    Key extends RollTable.Flags.Key<Scope>,
    Value extends RollTable.Flags.Get<Scope, Key>,
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

  protected _onCreate(data: RollTable.CreateData, options: RollTable.Database.OnCreateOperation, userId: string): void;

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

  /**
   * @deprecated since v12, will be removed in v14
   * @remarks "The `Document._onCreateDocuments` static method is deprecated in favor of {@link Document._onCreateOperation | `Document._onCreateOperation`}"
   */
  protected static _onCreateDocuments(
    documents: RollTable.Implementation[],
    context: Document.ModificationContext<RollTable.Parent>,
  ): Promise<void>;

  /**
   * @deprecated since v12, will be removed in v14
   * @remarks "The `Document._onUpdateDocuments` static method is deprecated in favor of {@link Document._onUpdateOperation | `Document._onUpdateOperation`}"
   */
  protected static _onUpdateDocuments(
    documents: RollTable.Implementation[],
    context: Document.ModificationContext<RollTable.Parent>,
  ): Promise<void>;

  /**
   * @deprecated since v12, will be removed in v14
   * @remarks "The `Document._onDeleteDocuments` static method is deprecated in favor of {@link Document._onDeleteOperation | `Document._onDeleteOperation`}"
   */
  protected static _onDeleteDocuments(
    documents: RollTable.Implementation[],
    context: Document.ModificationContext<RollTable.Parent>,
  ): Promise<void>;

  /* DataModel overrides */

  protected static _schema: SchemaField<RollTable.Schema>;

  static get schema(): SchemaField<RollTable.Schema>;

  /** @remarks Not actually overridden, still a no-op, typed for ease of subclassing */
  static validateJoint(data: RollTable.Source): void;

  // options: not null (parameter default only, destructured in super)
  static override fromSource(
    source: RollTable.CreateData,
    context?: DataModel.FromSourceOptions,
  ): RollTable.Implementation;

  static override fromJSON(json: string): RollTable.Implementation;
}

export default BaseRollTable;

declare namespace BaseRollTable {
  export import Name = RollTable.Name;
  export import ConstructionContext = RollTable.ConstructionContext;
  export import ConstructorArgs = RollTable.ConstructorArgs;
  export import Hierarchy = RollTable.Hierarchy;
  export import Metadata = RollTable.Metadata;
  export import Parent = RollTable.Parent;
  export import Descendant = RollTable.Descendant;
  export import DescendantClass = RollTable.DescendantClass;
  export import Pack = RollTable.Pack;
  export import Embedded = RollTable.Embedded;
  export import ParentCollectionName = RollTable.ParentCollectionName;
  export import CollectionClass = RollTable.CollectionClass;
  export import Collection = RollTable.Collection;
  export import Invalid = RollTable.Invalid;
  export import Stored = RollTable.Stored;
  export import Source = RollTable.Source;
  export import CreateData = RollTable.CreateData;
  export import InitializedData = RollTable.InitializedData;
  export import UpdateData = RollTable.UpdateData;
  export import Schema = RollTable.Schema;
  export import Database = RollTable.Database;
  export import TemporaryIf = RollTable.TemporaryIf;
  export import Flags = RollTable.Flags;

  namespace Internal {
    // Note(LukeAbby): The point of this is to give the base class of `RollTable` a name.
    // The expression `ClientDocumentMixin(BaseRollTable)` is more intuitive but it has worse
    // caching, likely due to the majority of tsc's caching working off of names.
    // See https://gist.github.com/LukeAbby/18a928fdc35c5d54dc121ed5dbf412fd.
    interface ClientDocument extends foundry.documents.abstract.ClientDocumentMixin.Mix<typeof BaseRollTable> {}
    const ClientDocument: ClientDocument;
  }
}
