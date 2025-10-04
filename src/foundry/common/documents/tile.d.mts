import type { AnyMutableObject } from "#utils";
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
   * @remarks Constructing `BaseTile` directly is not advised. The base document classes exist in
   * order to use documents on both the client (i.e. where all your code runs) and behind the scenes
   * on the server to manage document validation and storage.
   *
   * You should use {@link TileDocument.implementation | `new TileDocument.implementation(...)`} instead which will give you
   * a system specific implementation of `TileDocument`.
   */
  constructor(data: TileDocument.CreateData, context?: TileDocument.ConstructionContext);

  /**
   * @defaultValue
   * ```js
   * mergeObject(super.metadata, {
   *   name: "Tile",
   *   collection: "tiles",
   *   label: "DOCUMENT.Tile",
   *   labelPlural: "DOCUMENT.Tiles",
   *   schemaVersion: "13.341"
   * })
   * ```
   */
  static override metadata: BaseTile.Metadata;

  static override defineSchema(): BaseTile.Schema;

  /** @defaultValue `["DOCUMENT", "TILE"]` */
  static override LOCALIZATION_PREFIXES: string[];

  /**
   * @remarks
   * Migrations:
   * - `z` to `sort` (since v12, no specified end)
   * - `roof` to `restrictions.light` and `restrictions.weather` (since v12, no specified end)
   */
  static override migrateData(source: AnyMutableObject): AnyMutableObject;

  /**
   * @remarks
   * Shims:
   * - `z` to `sort` (since v12, until v14)
   */
  // options: not null (destructured)
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

  override readonly parentCollection: TileDocument.ParentCollectionName | null;

  override readonly pack: string | null;

  static override get implementation(): TileDocument.ImplementationClass;

  static override get baseDocument(): typeof BaseTile;

  static override get collectionName(): TileDocument.ParentCollectionName;

  static override get documentName(): TileDocument.Name;

  static override get TYPES(): CONST.BASE_DOCUMENT_TYPE[];

  static override get hasTypeData(): undefined;

  static override get hierarchy(): TileDocument.Hierarchy;

  override parent: TileDocument.Parent;

  static override createDocuments<Temporary extends boolean | undefined = undefined>(
    data: Array<TileDocument.Implementation | TileDocument.CreateData> | undefined,
    operation?: Document.Database.CreateOperation<TileDocument.Database.Create<Temporary>>,
  ): Promise<Array<TileDocument.TemporaryIf<Temporary>>>;

  static override updateDocuments(
    updates: TileDocument.UpdateData[] | undefined,
    operation?: Document.Database.UpdateDocumentsOperation<TileDocument.Database.Update>,
  ): Promise<TileDocument.Implementation[]>;

  static override deleteDocuments(
    ids: readonly string[] | undefined,
    operation?: Document.Database.DeleteDocumentsOperation<TileDocument.Database.Delete>,
  ): Promise<TileDocument.Implementation[]>;

  static override create<Temporary extends boolean | undefined = undefined>(
    data: TileDocument.CreateData | TileDocument.CreateData[],
    operation?: TileDocument.Database.CreateOperation<Temporary>,
  ): Promise<TileDocument.TemporaryIf<Temporary> | undefined>;

  override update(
    data: TileDocument.UpdateData | undefined,
    operation?: TileDocument.Database.UpdateOperation,
  ): Promise<this | undefined>;

  override delete(operation?: TileDocument.Database.DeleteOperation): Promise<this | undefined>;

  static override get(
    documentId: string,
    options?: TileDocument.Database.GetOptions,
  ): TileDocument.Implementation | null;

  static override getCollectionName(name: string): null;

  // Same as Document for now
  override traverseEmbeddedDocuments(
    _parentPath?: string,
  ): Generator<[string, Document.AnyChild<this>], void, undefined>;

  override getFlag<Scope extends TileDocument.Flags.Scope, Key extends TileDocument.Flags.Key<Scope>>(
    scope: Scope,
    key: Key,
  ): TileDocument.Flags.Get<Scope, Key>;

  override setFlag<
    Scope extends TileDocument.Flags.Scope,
    Key extends TileDocument.Flags.Key<Scope>,
    Value extends TileDocument.Flags.Get<Scope, Key>,
  >(scope: Scope, key: Key, value: Value): Promise<this>;

  override unsetFlag<Scope extends TileDocument.Flags.Scope, Key extends TileDocument.Flags.Key<Scope>>(
    scope: Scope,
    key: Key,
  ): Promise<this>;

  protected override _preCreate(
    data: TileDocument.CreateData,
    options: TileDocument.Database.PreCreateOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected override _onCreate(
    data: TileDocument.CreateData,
    options: TileDocument.Database.OnCreateOperation,
    userId: string,
  ): void;

  protected static override _preCreateOperation(
    documents: TileDocument.Implementation[],
    operation: Document.Database.PreCreateOperationStatic<TileDocument.Database.Create>,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static override _onCreateOperation(
    documents: TileDocument.Implementation[],
    operation: TileDocument.Database.Create,
    user: User.Implementation,
  ): Promise<void>;

  protected override _preUpdate(
    changed: TileDocument.UpdateData,
    options: TileDocument.Database.PreUpdateOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected override _onUpdate(
    changed: TileDocument.UpdateData,
    options: TileDocument.Database.OnUpdateOperation,
    userId: string,
  ): void;

  protected static override _preUpdateOperation(
    documents: TileDocument.Implementation[],
    operation: TileDocument.Database.Update,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static override _onUpdateOperation(
    documents: TileDocument.Implementation[],
    operation: TileDocument.Database.Update,
    user: User.Implementation,
  ): Promise<void>;

  protected override _preDelete(
    options: TileDocument.Database.PreDeleteOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected override _onDelete(options: TileDocument.Database.OnDeleteOperation, userId: string): void;

  protected static override _preDeleteOperation(
    documents: TileDocument.Implementation[],
    operation: TileDocument.Database.Delete,
    user: User.Implementation,
  ): Promise<boolean | void>;

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

  protected static override _onDeleteOperation(
    documents: TileDocument.Implementation[],
    operation: TileDocument.Database.Delete,
    user: User.Implementation,
  ): Promise<void>;

  /**
   * @deprecated since v12, will be removed in v14
   * @remarks "The `Document._onCreateDocuments` static method is deprecated in favor of {@link Document._onCreateOperation | `Document._onCreateOperation`}"
   */
  protected static override _onCreateDocuments(
    documents: TileDocument.Implementation[],
    context: Document.ModificationContext<TileDocument.Parent>,
  ): Promise<void>;

  /**
   * @deprecated since v12, will be removed in v14
   * @remarks "The `Document._onUpdateDocuments` static method is deprecated in favor of {@link Document._onUpdateOperation | `Document._onUpdateOperation`}"
   */
  protected static override _onUpdateDocuments(
    documents: TileDocument.Implementation[],
    context: Document.ModificationContext<TileDocument.Parent>,
  ): Promise<void>;

  /**
   * @deprecated since v12, will be removed in v14
   * @remarks "The `Document._onDeleteDocuments` static method is deprecated in favor of {@link Document._onDeleteOperation | `Document._onDeleteOperation`}"
   */
  protected static override _onDeleteDocuments(
    documents: TileDocument.Implementation[],
    context: Document.ModificationContext<TileDocument.Parent>,
  ): Promise<void>;

  /* DataModel overrides */

  protected static override _schema: SchemaField<TileDocument.Schema>;

  static override get schema(): SchemaField<TileDocument.Schema>;

  static override validateJoint(data: TileDocument.Source): void;

  // options: not null (parameter default only, destructured in super)
  static override fromSource(
    source: TileDocument.CreateData,
    context?: DataModel.FromSourceOptions,
  ): TileDocument.Implementation;

  static override fromJSON(json: string): TileDocument.Implementation;
}

export default BaseTile;

declare namespace BaseTile {
  export import Name = TileDocument.Name;
  export import ConstructionContext = TileDocument.ConstructionContext;
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  export import ConstructorArgs = TileDocument.ConstructorArgs;
  export import Hierarchy = TileDocument.Hierarchy;
  export import Metadata = TileDocument.Metadata;
  export import Parent = TileDocument.Parent;
  export import Descendant = TileDocument.Descendant;
  export import DescendantClass = TileDocument.DescendantClass;
  export import Pack = TileDocument.Pack;
  export import Embedded = TileDocument.Embedded;
  export import ParentCollectionName = TileDocument.ParentCollectionName;
  export import CollectionClass = TileDocument.CollectionClass;
  export import Collection = TileDocument.Collection;
  export import Invalid = TileDocument.Invalid;
  export import Stored = TileDocument.Stored;
  export import Source = TileDocument.Source;
  export import CreateData = TileDocument.CreateData;
  export import InitializedData = TileDocument.InitializedData;
  export import UpdateData = TileDocument.UpdateData;
  export import Schema = TileDocument.Schema;
  export import Database = TileDocument.Database;
  export import TemporaryIf = TileDocument.TemporaryIf;
  export import Flags = TileDocument.Flags;
  export import CoreFlags = TileDocument.CoreFlags;

  namespace Internal {
    // Note(LukeAbby): The point of this is to give the base class of `TileDocument` a name.
    // The expression `CanvasDocumentMixin(BaseTile)` is more intuitive but it has worse
    // caching, likely due to the majority of tsc's caching working off of names.
    // See https://gist.github.com/LukeAbby/18a928fdc35c5d54dc121ed5dbf412fd.
    interface CanvasDocument extends foundry.documents.abstract.CanvasDocumentMixin.Mix<typeof BaseTile> {}
    const CanvasDocument: CanvasDocument;
  }
}
