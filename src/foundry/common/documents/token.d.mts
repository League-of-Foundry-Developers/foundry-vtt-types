import type { AnyMutableObject, DeepReadonly, MaybeArray, OverlapsWith } from "#utils";
import type { DataModel, Document } from "#common/abstract/_module.d.mts";
import type { DataField, SchemaField } from "#common/data/fields.d.mts";
import type { fields } from "../data/_module.d.mts";
import type { Canvas } from "#client/canvas/_module.d.mts";
import type { BaseGrid } from "#common/grid/_module.d.mts";

/**
 * The base Token model definition which defines common behavior of an Token document between both client and server.
 */
// Note(LukeAbby): You may wonder why documents don't simply pass the `Parent` generic parameter.
// This pattern evolved from trying to avoid circular loops and even internal tsc errors.
// See: https://gist.github.com/LukeAbby/0d01b6e20ef19ebc304d7d18cef9cc21
declare abstract class BaseToken extends Document<"Token", BaseToken.Schema, any> {
  /**
   * @param data    - Initial data from which to construct the `BaseToken`
   * @param context - Construction context options
   *
   * @remarks Constructing `BaseToken` directly is not advised. The base document classes exist in
   * order to use documents on both the client (i.e. where all your code runs) and behind the scenes
   * on the server to manage document validation and storage.
   *
   * You should use {@linkcode TokenDocument.implementation | new TokenDocument.implementation(...)} instead which will give you
   * a system specific implementation of `TokenDocument`.
   */
  // Note(LukeAbby): Optional as there are currently no required properties on `CreateData`.
  constructor(data?: BaseToken.CreateData, context?: BaseToken.ConstructionContext);

  /**
   * @defaultValue
   * ```js
   * mergeObject(super.metadata, {
   *   name: "Token",
   *   collection: "tokens",
   *   label: "DOCUMENT.Token",
   *   labelPlural: "DOCUMENT.Tokens",
   *   isEmbedded: true,
   *   embedded: {
   *     ActorDelta: "delta"
   *   },
   *   permissions: {
   *     create: "TOKEN_CREATE",
   *     update: this.#canUpdate,
   *     delete: "TOKEN_DELETE"
   *   },
   *   schemaVersion: "13.341"
   * })
   * ```
   */
  static override metadata: BaseToken.Metadata;

  static override defineSchema(): BaseToken.Schema;

  /** @defaultValue `["DOCUMENT", "TOKEN"]` */
  static override LOCALIZATION_PREFIXES: string[];

  /** @defaultValue `["x", "y", "elevation", "width", "height", "shape"]` */
  static MOVEMENT_FIELDS: Readonly<string[]>;

  /**
   * Are the given positions equal?
   */
  static arePositionsEqual(position1: TokenDocument.Position, position2: TokenDocument.Position): boolean;

  /**
   * The default icon used for newly created Token documents
   * @defaultValue {@linkcode CONST.DEFAULT_TOKEN}
   */
  static DEFAULT_ICON: string;

  /**
   * Prepare changes to a descendent delta collection.
   * @param changes - Candidate source changes.
   * @param options - Options which determine how the new data is merged.
   */
  protected _prepareDeltaUpdate(changes?: BaseToken.UpdateData, options?: DataModel.UpdateOptions): void;

  override updateSource(changes?: BaseToken.UpdateData, options?: DataModel.UpdateOptions): BaseToken.UpdateData;

  override clone<Save extends boolean | undefined = false>(
    data?: BaseToken.CreateData,
    context?: Document.CloneContext<Save>,
  ): Document.Clone<this, Save>;

  /**
   * Get the snapped position of the Token.
   * @param data - The position and dimensions
   * @returns The snapped position
   */
  getSnappedPosition(data?: TokenDocument.Dimensions3D): Canvas.ElevatedPoint;

  /**
   * Get the top-left offset of the Token
   * @param data - The position and dimensions
   * @returns The top-left grid offset
   * @internal
   */
  _positionToGridOffset(data?: TokenDocument.Dimensions3D): BaseGrid.Offset3D;

  /**
   * Get the position of the Token from the top-left grid offset.
   * @param offset - The top-left grid offset
   * @param data   - The dimensions that override the current dimensions
   * @returns The snapped position
   * @internal
   */
  _gridOffsetToPosition(offset: BaseGrid.Offset3D, data?: TokenDocument.PartialDimensions): Canvas.ElevatedPoint;

  /**
   * Get the width and height of the Token in pixels.
   * @param data - The width and/or height in grid units (must be positive)
   * @returns The width and height in pixels
   */
  getSize(data?: TokenDocument.PartialShapelessDimensions): TokenDocument.ShapelessDimensions;

  /**
   * Get the center point of the Token.
   * @param data - The position and dimensions
   * @returns The center point
   */
  getCenterPoint(data?: TokenDocument.Dimensions3D): Canvas.ElevatedPoint;

  /**
   * Get the grid space polygon of the Token.
   * Returns undefined in gridless grids because there are no grid spaces.
   * @param data - The dimensions
   * @returns The grid space polygon or undefined if gridless
   */
  getGridSpacePolygon(data?: TokenDocument.PartialDimensions): Canvas.Point[] | void;

  /**
   * Get the offsets of grid spaces that are occupied by this Token at the current or given position.
   * The grid spaces the Token occupies are those that are covered by the Token's shape in the snapped position.
   * Returns an empty array in gridless grids.
   * @param data - The position and dimensions
   * @returns The offsets of occupied grid spaces
   */
  getOccupiedGridSpaceOffsets(data?: TokenDocument.Dimensions2D): foundry.grid.BaseGrid.Offset2D[];

  /**
   * Get the hexagonal offsets given the type, width, and height.
   * @param width   - The width of the Token (positive)
   * @param height  - The height of the Token (positive)
   * @param shape   - The shape (one of {@link CONST.TOKEN_SHAPES})
   * @param columns - Column-based instead of row-based hexagonal grid?
   * @returns The hexagonal offsets
   */
  protected static _getHexagonalOffsets(
    width: number,
    height: number,
    shape: CONST.TOKEN_SHAPES,
    columns: boolean,
  ): DeepReadonly<TokenDocument.HexagonalOffsetsData>;

  override getUserLevel(user?: User.Implementation): CONST.DOCUMENT_OWNERSHIP_LEVELS;

  // TODO: Update with the Delta conditionality
  override toObject(source?: boolean): BaseToken.Source;

  /**
   * @remarks
   * Migrations:
   * - `hexagonalShape` to `shape` (since v13, no specified end)
   */
  static override migrateData(source: AnyMutableObject): AnyMutableObject;

  /**
   * @remarks
   * Shims:
   * - `effects` to nothing (since v12, until v14)
   *   - "`TokenDocument#effects` is deprecated in favor of using {@linkcode ActiveEffect} documents on the associated `Actor`")
   * - `overlayEffect` to nothing (since v12, until v14)
   *   - "`TokenDocument#overlayEffect` is deprecated in favor of using `ActiveEffect` documents on the associated `Actor`")
   * - `hexagonalShape` to `shape` (since v13, until v15)
   *   - "`TokenDocument#hexagonalShape` is deprecated in favor of `TokenDocument#shape`."
   */
  static override shimData(data: AnyMutableObject, options?: DataModel.ShimDataOptions): AnyMutableObject;

  /**
   * @deprecated "TokenDocument#overlayEffect is deprecated in favor of using {@linkcode ActiveEffect} documents on the associated Actor"
   * (since v12, until v14)
   */
  get effects(): [];

  /**
   * @deprecated "`TokenDocument#overlayEffect` is deprecated in favor of using {@linkcode ActiveEffect} documents on the associated Actor"
   * (since v12, until v14)
   */
  get overlayEffect(): "";

  /**
   * @deprecated "TokenDocument#hexagonalShape is deprecated in favor of {@linkcode TokenDocument#shape}" (since v13, until v15)
   */
  get hexagonalShape(): CONST.TOKEN_SHAPES;

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

  override readonly parentCollection: BaseToken.ParentCollectionName | null;

  static override get implementation(): TokenDocument.ImplementationClass;

  static override get baseDocument(): typeof BaseToken;

  static override get collectionName(): BaseToken.ParentCollectionName;

  static override get documentName(): BaseToken.Name;

  static override get TYPES(): CONST.BASE_DOCUMENT_TYPE[];

  static override get hasTypeData(): false;

  static override readonly hierarchy: BaseToken.Hierarchy;

  override parent: BaseToken.Parent;

  override " fvtt_types_internal_document_parent": BaseToken.Parent;

  static override canUserCreate(user: User.Implementation): boolean;

  // `getUserLevel` omitted from template due to actual override above.

  override testUserPermission(
    user: User.Implementation,
    permission: Document.ActionPermission,
    options?: Document.TestUserPermissionOptions,
  ): boolean;

  override canUserModify<Action extends Document.Database.OperationAction>(
    user: User.Implementation,
    action: Action,
    data?: Document.CanUserModifyData<"Token", Action>,
  ): boolean;

  static override createDocuments<Temporary extends boolean | undefined = undefined>(
    data: BaseToken.CreateInput[],
    operation?: BaseToken.Database.CreateDocumentsOperation<Temporary>,
  ): Promise<Array<BaseToken.TemporaryIf<Temporary>>>;

  static override updateDocuments(
    updates: BaseToken.UpdateInput[],
    operation?: BaseToken.Database.UpdateManyDocumentsOperation,
  ): Promise<Array<TokenDocument.Stored>>;

  static override deleteDocuments(
    ids: readonly string[],
    operation?: BaseToken.Database.DeleteManyDocumentsOperation,
  ): Promise<Array<TokenDocument.Stored>>;

  static override create<
    Data extends MaybeArray<BaseToken.CreateInput>,
    Temporary extends boolean | undefined = undefined,
  >(
    data: Data,
    operation?: BaseToken.Database.CreateDocumentsOperation<Temporary>,
  ): Promise<BaseToken.CreateReturn<Data, Temporary>>;

  override update(
    data: BaseToken.UpdateInput,
    operation?: BaseToken.Database.UpdateOneDocumentOperation,
  ): Promise<this | undefined>;

  override delete(operation?: BaseToken.Database.DeleteOneDocumentOperation): Promise<this | undefined>;

  // `TokenDocument`s are neither world documents nor compendium documents, so this always returns `null`.
  static override get(documentId: string, operation?: BaseToken.Database.GetDocumentsOperation): null;

  static override getCollectionName<Name extends string>(
    name: OverlapsWith<Name, BaseToken.Embedded.CollectionName>,
  ): BaseToken.Embedded.GetCollectionNameReturn<Name>;

  /**
   * @remarks Calling `BaseToken#getEmbeddedCollection` would result in entirely typical results at
   * runtime, namely returning a `EmbeddedCollection` corresponding to a field in `BaseToken`'s
   * schema. However {@linkcode TokenDocument.getEmbeddedCollection | TokenDocument#getEmbeddedCollection}
   * is overridden to add new cases and since `BaseToken` is a superclass it had to be widened to
   * accommodate that.
   */
  override getEmbeddedCollection(embeddedName: BaseToken.Embedded.CollectionName): Collection.Any;

  override getEmbeddedDocument<
    EmbeddedName extends BaseToken.Embedded.CollectionName,
    Options extends Document.GetEmbeddedDocumentOptions | undefined = undefined,
  >(embeddedName: EmbeddedName, id: string, options?: Options): BaseToken.Embedded.GetReturn<EmbeddedName, Options>;

  override createEmbeddedDocuments<EmbeddedName extends BaseToken.Embedded.Name>(
    embeddedName: EmbeddedName,
    data: Document.CreateDataForName<EmbeddedName>[],
    operation?: Document.Database.CreateDocumentsOperationForName<EmbeddedName>,
  ): Promise<Array<Document.StoredForName<EmbeddedName>>>;

  override updateEmbeddedDocuments<EmbeddedName extends BaseToken.Embedded.Name>(
    embeddedName: EmbeddedName,
    updates: Document.UpdateDataForName<EmbeddedName>[],
    operation?: Document.Database.UpdateManyDocumentsOperationForName<EmbeddedName>,
  ): Promise<Array<Document.StoredForName<EmbeddedName>>>;

  override deleteEmbeddedDocuments<EmbeddedName extends BaseToken.Embedded.Name>(
    embeddedName: EmbeddedName,
    ids: string[],
    operation?: Document.Database.DeleteManyDocumentsOperationForName<EmbeddedName>,
  ): Promise<Array<Document.StoredForName<EmbeddedName>>>;

  override getFlag<Scope extends BaseToken.Flags.Scope, Key extends BaseToken.Flags.Key<Scope>>(
    scope: Scope,
    key: Key,
  ): BaseToken.Flags.Get<Scope, Key>;

  override setFlag<
    Scope extends BaseToken.Flags.Scope,
    Key extends BaseToken.Flags.Key<Scope>,
    Value extends BaseToken.Flags.Get<Scope, Key>,
  >(scope: Scope, key: Key, value: Value): Promise<this | undefined>;

  override unsetFlag<Scope extends BaseToken.Flags.Scope, Key extends BaseToken.Flags.Key<Scope>>(
    scope: Scope,
    key: Key,
  ): Promise<this | undefined>;

  protected override _preCreate(
    data: BaseToken.CreateData,
    options: BaseToken.Database.PreCreateOptions,
    user: User.Stored,
  ): Promise<boolean | void>;

  protected override _onCreate(
    data: BaseToken.CreateData,
    options: BaseToken.Database.OnCreateOptions,
    userId: string,
  ): void;

  protected static override _preCreateOperation(
    documents: TokenDocument.Implementation[],
    operation: BaseToken.Database.PreCreateOperation,
    user: User.Stored,
  ): Promise<boolean | void>;

  protected static override _onCreateOperation(
    documents: TokenDocument.Stored[],
    operation: BaseToken.Database.OnCreateOperation,
    user: User.Stored,
  ): Promise<void>;

  protected override _preUpdate(
    changed: BaseToken.UpdateData,
    options: BaseToken.Database.PreUpdateOptions,
    user: User.Stored,
  ): Promise<boolean | void>;

  protected override _onUpdate(
    changed: BaseToken.UpdateData,
    options: BaseToken.Database.OnUpdateOptions,
    userId: string,
  ): void;

  protected static override _preUpdateOperation(
    documents: TokenDocument.Stored[],
    operation: BaseToken.Database.PreUpdateOperation,
    user: User.Stored,
  ): Promise<boolean | void>;

  protected static override _onUpdateOperation(
    documents: TokenDocument.Stored[],
    operation: BaseToken.Database.OnUpdateOperation,
    user: User.Stored,
  ): Promise<void>;

  protected override _preDelete(
    options: BaseToken.Database.PreDeleteOptions,
    user: User.Stored,
  ): Promise<boolean | void>;

  protected override _onDelete(options: BaseToken.Database.OnDeleteOptions, userId: string): void;

  protected static override _preDeleteOperation(
    documents: TokenDocument.Stored[],
    operation: BaseToken.Database.PreDeleteOperation,
    user: User.Stored,
  ): Promise<boolean | void>;

  protected static override _onDeleteOperation(
    documents: TokenDocument.Stored[],
    operation: BaseToken.Database.OnDeleteOperation,
    user: User.Stored,
  ): Promise<void>;

  /**
   * @deprecated "The `TokenDocument._onCreateDocuments` static method is deprecated in favor of
   * {@linkcode TokenDocument._onCreateOperation}" (since v12, until v14)
   */
  protected static override _onCreateDocuments(
    documents: TokenDocument.Implementation[],
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    context: BaseToken.Database.OnCreateDocumentsOperation,
  ): Promise<void>;

  /**
   * @deprecated "The `TokenDocument._onUpdateDocuments` static method is deprecated in favor of
   * {@linkcode TokenDocument._onUpdateOperation}" (since v12, until v14)
   */
  protected static override _onUpdateDocuments(
    documents: TokenDocument.Stored[],
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    context: BaseToken.Database.OnUpdateDocumentsOperation,
  ): Promise<void>;

  /**
   * @deprecated "The `TokenDocument._onDeleteDocuments` static method is deprecated in favor of
   * {@linkcode TokenDocument._onDeleteOperation}" (since v12, until v14)
   */
  protected static override _onDeleteDocuments(
    documents: TokenDocument.Stored[],
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    context: BaseToken.Database.OnDeleteDocumentsOperation,
  ): Promise<void>;

  /* DataModel overrides */

  protected static override _schema: SchemaField<BaseToken.Schema>;

  static override get schema(): SchemaField<BaseToken.Schema>;

  static override validateJoint(data: BaseToken.Source): void;

  static override fromSource(
    source: BaseToken.CreateData,
    context?: DataModel.FromSourceOptions,
  ): TokenDocument.Implementation;

  static override fromJSON(json: string): TokenDocument.Implementation;

  static #BaseToken: true;
}

/**
 * A special subclass of EmbeddedDocumentField which allows construction of the ActorDelta to be lazily evaluated.
 */
export class ActorDeltaField<
  DocumentType extends foundry.documents.BaseActorDelta.AnyConstructor,
  Options extends fields.EmbeddedDocumentField.Options<DocumentType> = fields.EmbeddedDocumentField.DefaultOptions,
> extends fields.EmbeddedDocumentField<DocumentType, Options> {
  override initialize(
    value: fields.EmbeddedDocumentField.PersistedType<DocumentType, Options>,
    model: DataModel.Any,
    options?: DataField.InitializeOptions,
  ):
    | fields.EmbeddedDocumentField.InitializedType<DocumentType, Options>
    | (() => fields.EmbeddedDocumentField.InitializedType<DocumentType, Options> | null);
}

export default BaseToken;

declare namespace BaseToken {
  // All types really live in the full document and are mirrored here for convenience
  export import Name = TokenDocument.Name;
  export import ConstructionContext = TokenDocument.ConstructionContext;
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  export import ConstructorArgs = TokenDocument.ConstructorArgs;
  export import Hierarchy = TokenDocument.Hierarchy;
  export import Metadata = TokenDocument.Metadata;
  export import Parent = TokenDocument.Parent;
  export import Descendant = TokenDocument.Descendant;
  export import DescendantClass = TokenDocument.DescendantClass;
  export import Embedded = TokenDocument.Embedded;
  export import ParentCollectionName = TokenDocument.ParentCollectionName;
  export import CollectionClass = TokenDocument.CollectionClass;
  export import Collection = TokenDocument.Collection;
  export import Invalid = TokenDocument.Invalid;
  export import Source = TokenDocument.Source;
  export import CreateData = TokenDocument.CreateData;
  export import CreateInput = TokenDocument.CreateInput;
  export import CreateReturn = TokenDocument.CreateReturn;
  export import InitializedData = TokenDocument.InitializedData;
  export import UpdateData = TokenDocument.UpdateData;
  export import UpdateInput = TokenDocument.UpdateInput;
  export import Schema = TokenDocument.Schema;
  export import Database = TokenDocument.Database;
  export import TemporaryIf = TokenDocument.TemporaryIf;
  export import Flags = TokenDocument.Flags;
  export import CoreFlags = TokenDocument.CoreFlags;

  namespace Internal {
    // Note(LukeAbby): The point of this is to give the base class of `TokenDocument` a name.
    // The expression `CanvasDocumentMixin(BaseToken)` is more intuitive but it has worse
    // caching, likely due to the majority of tsc's caching working off of names.
    // See https://gist.github.com/LukeAbby/18a928fdc35c5d54dc121ed5dbf412fd.
    interface CanvasDocument extends foundry.documents.abstract.CanvasDocumentMixin.Mix<typeof BaseToken> {}
    const CanvasDocument: CanvasDocument;
  }
}
