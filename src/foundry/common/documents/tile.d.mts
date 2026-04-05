import type { AnyMutableObject, MaybeArray } from "#utils";
import type { DataModel, Document } from "#common/abstract/_module.d.mts";
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
  constructor(data: BaseTile.CreateData, context?: BaseTile.ConstructionContext);

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
  static override shimData(data: AnyMutableObject, options?: DataModel.ShimDataOptions): AnyMutableObject;

  /**
   * @deprecated "You are accessing `roof` which has been migrated to `restrictions.{`
   * {@linkcode TileDocument.RestrictionsData.light | light}`|`{@linkcode TileDocument.RestrictionsData.weather | weather}`}`"
   * (since v12, until v14)
   * @remarks Getter returns `this.restrictions.light && this.restrictions.weather`, setter sets both
   */
  set roof(value: boolean);

  get roof();

  /**
   * @deprecated "You are accessing `z` which has been migrated to `sort`" (since v12, until v14)
   */
  get z(): this["sort"];

  /**
   * @deprecated "`BaseTile#overhead` is deprecated." (since v12, until v14)
   * @remarks Returns `this.elevation >= this.parent?.foregroundElevation`
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

  override readonly parentCollection: BaseTile.ParentCollectionName | null;

  override get pack(): string | null;

  static override get implementation(): TileDocument.ImplementationClass;

  static override get baseDocument(): typeof BaseTile;

  static override get collectionName(): BaseTile.ParentCollectionName;

  static override get documentName(): BaseTile.Name;

  static override get TYPES(): CONST.BASE_DOCUMENT_TYPE[];

  static override get hasTypeData(): false;

  static override readonly hierarchy: BaseTile.Hierarchy;

  override parent: BaseTile.Parent;

  override " fvtt_types_internal_document_parent": BaseTile.Parent;

  static override createDocuments<Temporary extends boolean | undefined = undefined>(
    data: BaseTile.CreateInput[],
    operation?: BaseTile.Database.CreateDocumentsOperation<Temporary>,
  ): Promise<Array<BaseTile.TemporaryIf<Temporary>>>;

  static override updateDocuments(
    updates: BaseTile.UpdateInput[],
    operation?: BaseTile.Database.UpdateManyDocumentsOperation,
  ): Promise<Array<TileDocument.Stored>>;

  static override deleteDocuments(
    ids: readonly string[],
    operation?: BaseTile.Database.DeleteManyDocumentsOperation,
  ): Promise<Array<TileDocument.Stored>>;

  static override create<
    Data extends MaybeArray<BaseTile.CreateInput>,
    Temporary extends boolean | undefined = undefined,
  >(
    data: Data,
    operation?: BaseTile.Database.CreateDocumentsOperation<Temporary>,
  ): Promise<BaseTile.CreateReturn<Data, Temporary>>;

  override update(
    data: BaseTile.UpdateInput,
    operation?: BaseTile.Database.UpdateOneDocumentOperation,
  ): Promise<this | undefined>;

  override delete(operation?: BaseTile.Database.DeleteOneDocumentOperation): Promise<this | undefined>;

  /**
   * @privateRemarks `TileDocument`s are neither {@link CONST.WORLD_DOCUMENT_TYPES | world documents} (and so have no
   * {@link foundry.Game.collections | world collection}) nor {@link CONST.COMPENDIUM_DOCUMENT_TYPES | compendium documents} (so there's no
   * chance of index entry return), so this always returns `null`
   */
  static override get(documentId: string, operation?: BaseTile.Database.GetDocumentsOperation): null;

  /** @privateRemarks `TileDocument`s have no embedded collections, so this always returns `null` */
  static override getCollectionName(name: string): null;

  override getFlag<Scope extends BaseTile.Flags.Scope, Key extends BaseTile.Flags.Key<Scope>>(
    scope: Scope,
    key: Key,
  ): BaseTile.Flags.Get<Scope, Key>;

  override setFlag<
    Scope extends BaseTile.Flags.Scope,
    Key extends BaseTile.Flags.Key<Scope>,
    Value extends BaseTile.Flags.Get<Scope, Key>,
  >(scope: Scope, key: Key, value: Value): Promise<this | undefined>;

  override unsetFlag<Scope extends BaseTile.Flags.Scope, Key extends BaseTile.Flags.Key<Scope>>(
    scope: Scope,
    key: Key,
  ): Promise<this | undefined>;

  protected override _preCreate(
    data: BaseTile.CreateData,
    options: BaseTile.Database.PreCreateOptions,
    user: User.Stored,
  ): Promise<boolean | void>;

  protected override _onCreate(
    data: BaseTile.CreateData,
    options: BaseTile.Database.OnCreateOptions,
    userId: string,
  ): void;

  protected static override _preCreateOperation(
    documents: TileDocument.Implementation[],
    operation: BaseTile.Database.PreCreateOperation,
    user: User.Stored,
  ): Promise<boolean | void>;

  protected static override _onCreateOperation(
    documents: TileDocument.Stored[],
    operation: BaseTile.Database.OnCreateOperation,
    user: User.Stored,
  ): Promise<void>;

  protected override _preUpdate(
    changed: BaseTile.UpdateData,
    options: BaseTile.Database.PreUpdateOptions,
    user: User.Stored,
  ): Promise<boolean | void>;

  protected override _onUpdate(
    changed: BaseTile.UpdateData,
    options: BaseTile.Database.OnUpdateOptions,
    userId: string,
  ): void;

  protected static override _preUpdateOperation(
    documents: TileDocument.Stored[],
    operation: BaseTile.Database.PreUpdateOperation,
    user: User.Stored,
  ): Promise<boolean | void>;

  protected static override _onUpdateOperation(
    documents: TileDocument.Stored[],
    operation: BaseTile.Database.OnUpdateOperation,
    user: User.Stored,
  ): Promise<void>;

  protected override _preDelete(
    options: BaseTile.Database.PreDeleteOptions,
    user: User.Stored,
  ): Promise<boolean | void>;

  protected override _onDelete(options: BaseTile.Database.OnDeleteOptions, userId: string): void;

  protected static override _preDeleteOperation(
    documents: TileDocument.Stored[],
    operation: BaseTile.Database.PreDeleteOperation,
    user: User.Stored,
  ): Promise<boolean | void>;

  protected static override _onDeleteOperation(
    documents: TileDocument.Stored[],
    operation: BaseTile.Database.OnDeleteOperation,
    user: User.Stored,
  ): Promise<void>;

  /**
   * @deprecated "The `Document._onCreateDocuments` static method is deprecated in favor of {@linkcode Document._onCreateOperation}"
   * (since v12, until v14)
   */
  protected static override _onCreateDocuments(
    documents: TileDocument.Implementation[],
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    context: BaseTile.Database.OnCreateDocumentsOperation,
  ): Promise<void>;

  /**
   * @deprecated "The `Document._onUpdateDocuments` static method is deprecated in favor of {@linkcode Document._onUpdateOperation}"
   * (since v12, until v14)
   */
  protected static override _onUpdateDocuments(
    documents: TileDocument.Stored[],
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    context: BaseTile.Database.OnUpdateDocumentsOperation,
  ): Promise<void>;

  /**
   * @deprecated "The `Document._onDeleteDocuments` static method is deprecated in favor of {@linkcode Document._onDeleteOperation}"
   * (since v12, until v14)
   */
  protected static override _onDeleteDocuments(
    documents: TileDocument.Stored[],
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    context: BaseTile.Database.OnDeleteDocumentsOperation,
  ): Promise<void>;

  /* DataModel overrides */

  protected static override _schema: SchemaField<BaseTile.Schema>;

  static override get schema(): SchemaField<BaseTile.Schema>;

  static override validateJoint(data: BaseTile.Source): void;

  static override fromSource(
    source: BaseTile.CreateData,
    context?: DataModel.FromSourceOptions,
  ): TileDocument.Implementation;

  static override fromJSON(json: string): TileDocument.Implementation;
}

export default BaseTile;

declare namespace BaseTile {
  // All types really live in the full document and are mirrored here for convenience
  export import Name = TileDocument.Name;
  export import ConstructionContext = TileDocument.ConstructionContext;
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  export import ConstructorArgs = TileDocument.ConstructorArgs;
  export import Hierarchy = TileDocument.Hierarchy;
  export import Metadata = TileDocument.Metadata;
  export import Parent = TileDocument.Parent;
  export import Descendant = TileDocument.Descendant;
  export import DescendantClass = TileDocument.DescendantClass;
  export import Embedded = TileDocument.Embedded;
  export import ParentCollectionName = TileDocument.ParentCollectionName;
  export import CollectionClass = TileDocument.CollectionClass;
  export import Collection = TileDocument.Collection;
  export import Invalid = TileDocument.Invalid;
  export import Source = TileDocument.Source;
  export import CreateData = TileDocument.CreateData;
  export import CreateInput = TileDocument.CreateInput;
  export import CreateReturn = TileDocument.CreateReturn;
  export import InitializedData = TileDocument.InitializedData;
  export import UpdateData = TileDocument.UpdateData;
  export import UpdateInput = TileDocument.UpdateInput;
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
