import type { AnyMutableObject, MaybeArray, OverlapsWith } from "#utils";
import type { DataModel, Document } from "#common/abstract/_module.d.mts";
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- `DocumentStatsField` is only used for links.
import type { DataField, DocumentStatsField, SchemaField } from "#common/data/fields.d.mts";
import type { CompendiumCollection } from "#client/documents/collections/_module.d.mts";

/**
 * The Document definition for a Scene.
 * Defines the DataSchema and common behaviors for a Scene which are shared between both client and server.
 */
// Note(LukeAbby): You may wonder why documents don't simply pass the `Parent` generic parameter.
// This pattern evolved from trying to avoid circular loops and even internal tsc errors.
// See: https://gist.github.com/LukeAbby/0d01b6e20ef19ebc304d7d18cef9cc21
declare abstract class BaseScene extends Document<"Scene", BaseScene.Schema, any> {
  /**
   * @param data    - Initial data from which to construct the `BaseScene`
   * @param context - Construction context options
   *
   * @remarks Constructing `BaseScene` directly is not advised. The base document classes exist in
   * order to use documents on both the client (i.e. where all your code runs) and behind the scenes
   * on the server to manage document validation and storage.
   *
   * You should use {@linkcode Scene.implementation | new BaseScene.implementation(...)} instead which will give you
   * a system specific implementation of `Scene`.
   */
  constructor(data: BaseScene.CreateData, context?: BaseScene.ConstructionContext);

  /**
   * @defaultValue
   * ```js
   * mergeObject(super.metadata, {
   *   name: "Scene",
   *   collection: "scenes",
   *   indexed: true,
   *   compendiumIndexFields: ["_id", "name", "thumb", "sort", "folder"],
   *   embedded: {
   *     AmbientLight: "lights",
   *     AmbientSound: "sounds",
   *     Drawing: "drawings",
   *     Note: "notes",
   *     Region: "regions",
   *     Level: "levels",
   *     Tile: "tiles",
   *     Token: "tokens",
   *     Wall: "walls"
   *   },
   *   label: "DOCUMENT.Scene",
   *   labelPlural: "DOCUMENT.Scenes",
   *   preserveOnImport: [...super.metadata.preserveOnImport, "active"],
   *   defaultLevelId: "defaultLevel0000",
   *   schemaVersion: "14.354"
   * });
   * ```
   */
  static override metadata: BaseScene.Metadata;

  static override defineSchema(): BaseScene.Schema;

  /** @defaultValue `["DOCUMENT", "SCENE"]` */
  static override LOCALIZATION_PREFIXES: string[];

  /**
   * A mapping of top-level scene properties to their corresponding properties on the child level.
   * @defaultValue
   * ```js
   * Object.freeze([
   *   ["background.src", "background.src"],
   *   ["background.tint", "background.tint"],
   *   ["background.alphaThreshold", "background.alphaThreshold"],
   *   ["background.anchorX", "textures.anchorX"],
   *   ["background.anchorY", "textures.anchorY"],
   *   ["background.fit", "textures.fit"],
   *   ["background.scaleX", "textures.scaleX"],
   *   ["background.scaleY", "textures.scaleY"],
   *   ["background.rotation", "textures.rotation"],
   *   ["fog.overlay", "fog.src"],
   *   ["foreground", "foreground.src"],
   *   ["foregroundElevation", "elevation.top"],
   *   ["backgroundColor", "background.color"]
   * ])
   * ```
   * @internal
   */
  protected static _LEVELS_PROPERTY_MAP: readonly [sceneProperty: string, levelProperty: string][];

  /**
   * The default grid defined by the system.
   */
  static get defaultGrid(): foundry.grid.BaseGrid;

  /**
   * The gridless version of the default grid defined by the system.
   */
  static get defaultGridlessGrid(): foundry.grid.GridlessGrid;

  /**
   * The initial Level of the Scene. By default the first Level.
   */
  get initialLevel(): Level.Implementation;

  /**
   * A convenience getter for the Scene's first created Level. This should not be relied on in multi-level scenes to
   * mean the first level by sort order.
   */
  get firstLevel(): Level.Implementation;

  /**
   * @remarks Calls {@linkcode DocumentStatsField._shimDocument}`(this)`, then defines a deprecated
   * `fog.exploration` accessor over `fog.mode` (since v14, until v16).
   */
  protected override _initialize(options?: Document.InitializeOptions): void;

  override updateSource(changes?: Scene.UpdateData, options?: DataModel.UpdateOptions): Scene.UpdateData;

  /** @remarks Calls {@linkcode DocumentStatsField._migrateData}`(this, source)` */
  static override migrateData(source: object, options?: DataField.CleanOptions): object;

  /**
   * @remarks
   * Shims, all reading from the Scene's first {@linkcode Level}:
   * - `foreground` from `levels[0].foreground.src`
   * - `foregroundElevation` from `levels[0].elevation.top`
   * - `fog.overlay` from `levels[0].fog.src`
   * - `background` from the level's `background` and `textures` properties, plus `offsetX`/`offsetY`
   *   from the Scene's `shiftX`/`shiftY`
   * - `backgroundColor` from `levels[0].background.color`
   * - `fog.exploration` to `fog.mode` (since v14, until v16)
   * - {@linkcode DocumentStatsField._shimData}`(this, source, options)`
   */
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

  static override get implementation(): Scene.ImplementationClass;

  static override get baseDocument(): typeof BaseScene;

  static override get collectionName(): BaseScene.ParentCollectionName;

  static override get documentName(): BaseScene.Name;

  static override get TYPES(): CONST.BASE_DOCUMENT_TYPE[];

  static override get hasTypeData(): false;

  static override readonly hierarchy: BaseScene.Hierarchy;

  override parent: BaseScene.Parent;

  override " fvtt_types_internal_document_parent": BaseScene.Parent;

  static override canUserCreate(user: User.Implementation): boolean;

  override getUserLevel(user?: User.Implementation): CONST.DOCUMENT_OWNERSHIP_LEVELS;

  override testUserPermission(
    user: User.Implementation,
    permission: Document.ActionPermission,
    options?: Document.TestUserPermissionOptions,
  ): boolean;

  override canUserModify<Action extends Document.Database.OperationAction>(
    user: User.Implementation,
    action: Action,
    data?: Document.CanUserModifyData<"Scene", Action>,
  ): boolean;

  static override createDocuments(
    data: BaseScene.CreateInput[],
    operation?: BaseScene.Database.CreateDocumentsOperation,
  ): Promise<Scene.Stored[]>;

  static override updateDocuments(
    updates: BaseScene.UpdateInput[],
    operation?: BaseScene.Database.UpdateManyDocumentsOperation,
  ): Promise<Scene.Stored[]>;

  static override deleteDocuments(
    ids: readonly string[],
    operation?: BaseScene.Database.DeleteManyDocumentsOperation,
  ): Promise<Scene.Stored[]>;

  static override create<Data extends MaybeArray<BaseScene.CreateInput>>(
    data: Data,
    operation?: BaseScene.Database.CreateDocumentsOperation,
  ): Promise<BaseScene.CreateReturn<Data>>;

  override update(
    data: BaseScene.UpdateInput,
    operation?: BaseScene.Database.UpdateOneDocumentOperation,
  ): Promise<this | undefined>;

  override delete(operation?: BaseScene.Database.DeleteOneDocumentOperation): Promise<this | undefined>;

  static override get(
    documentId: string,
    operation?: BaseScene.Database.GetDocumentsOperation,
  ): Scene.Stored | CompendiumCollection.IndexEntry<"Scene"> | null;

  static override getCollectionName<Name extends string>(
    name: OverlapsWith<Name, BaseScene.Embedded.CollectionName>,
  ): BaseScene.Embedded.GetCollectionNameReturn<Name>;

  override getEmbeddedCollection<EmbeddedName extends BaseScene.Embedded.CollectionName>(
    embeddedName: EmbeddedName,
  ): BaseScene.Embedded.CollectionFor<EmbeddedName>;

  override getEmbeddedDocument<
    EmbeddedName extends BaseScene.Embedded.CollectionName,
    Options extends Document.GetEmbeddedDocumentOptions | undefined = undefined,
  >(embeddedName: EmbeddedName, id: string, options?: Options): BaseScene.Embedded.GetReturn<EmbeddedName, Options>;

  override createEmbeddedDocuments<EmbeddedName extends BaseScene.Embedded.Name>(
    embeddedName: EmbeddedName,
    data: Document.CreateDataForName<EmbeddedName>[],
    operation?: Document.Database.CreateDocumentsOperationForName<EmbeddedName>,
  ): Promise<Array<Document.StoredForName<EmbeddedName>>>;

  override updateEmbeddedDocuments<EmbeddedName extends BaseScene.Embedded.Name>(
    embeddedName: EmbeddedName,
    updates: Document.UpdateDataForName<EmbeddedName>[],
    operation?: Document.Database.UpdateManyDocumentsOperationForName<EmbeddedName>,
  ): Promise<Array<Document.StoredForName<EmbeddedName>>>;

  override deleteEmbeddedDocuments<EmbeddedName extends BaseScene.Embedded.Name>(
    embeddedName: EmbeddedName,
    ids: string[],
    operation?: Document.Database.DeleteManyDocumentsOperationForName<EmbeddedName>,
  ): Promise<Array<Document.StoredForName<EmbeddedName>>>;

  override getFlag<Scope extends BaseScene.Flags.Scope, Key extends BaseScene.Flags.Key<Scope>>(
    scope: Scope,
    key: Key,
  ): BaseScene.Flags.Get<Scope, Key>;

  override setFlag<
    Scope extends BaseScene.Flags.Scope,
    Key extends BaseScene.Flags.Key<Scope>,
    Value extends BaseScene.Flags.Get<Scope, Key>,
  >(scope: Scope, key: Key, value: Value): Promise<this | undefined>;

  override unsetFlag<Scope extends BaseScene.Flags.Scope, Key extends BaseScene.Flags.Key<Scope>>(
    scope: Scope,
    key: Key,
  ): Promise<this | undefined>;

  protected override _preCreate(
    data: BaseScene.CreateData,
    options: BaseScene.Database.PreCreateOptions,
    user: User.Stored,
  ): Promise<boolean | void>;

  protected override _onCreate(
    data: BaseScene.CreateData,
    options: BaseScene.Database.OnCreateOptions,
    userId: string,
  ): void;

  protected static override _preCreateOperation(
    documents: Scene.Implementation[],
    operation: BaseScene.Database.PreCreateOperation,
    user: User.Stored,
  ): Promise<boolean | void>;

  protected static override _onCreateOperation(
    documents: Scene.Stored[],
    operation: BaseScene.Database.OnCreateOperation,
    user: User.Stored,
  ): Promise<void>;

  protected override _preUpdate(
    changed: BaseScene.UpdateData,
    options: BaseScene.Database.PreUpdateOptions,
    user: User.Stored,
  ): Promise<boolean | void>;

  protected override _onUpdate(
    changed: BaseScene.UpdateData,
    options: BaseScene.Database.OnUpdateOptions,
    userId: string,
  ): void;

  protected static override _preUpdateOperation(
    documents: Scene.Stored[],
    operation: BaseScene.Database.PreUpdateOperation,
    user: User.Stored,
  ): Promise<boolean | void>;

  protected static override _onUpdateOperation(
    documents: Scene.Stored[],
    operation: BaseScene.Database.OnUpdateOperation,
    user: User.Stored,
  ): Promise<void>;

  protected override _preDelete(
    options: BaseScene.Database.PreDeleteOptions,
    user: User.Stored,
  ): Promise<boolean | void>;

  protected override _onDelete(options: BaseScene.Database.OnDeleteOptions, userId: string): void;

  protected static override _preDeleteOperation(
    documents: Scene.Stored[],
    operation: BaseScene.Database.PreDeleteOperation,
    user: User.Stored,
  ): Promise<boolean | void>;

  protected static override _onDeleteOperation(
    documents: Scene.Stored[],
    operation: BaseScene.Database.OnDeleteOperation,
    user: User.Stored,
  ): Promise<void>;

  /* DataModel overrides */

  static override _schema: SchemaField<BaseScene.Schema>;

  static override get schema(): SchemaField<BaseScene.Schema>;

  static override validateJoint(data: BaseScene.Source): void;

  static override fromSource(source: BaseScene.CreateData, context?: DataModel.FromSourceOptions): Scene.Implementation;

  static override fromJSON(json: string): Scene.Implementation;

  #BaseScene: true;
}

export default BaseScene;

declare namespace BaseScene {
  // All types really live in the full document and are mirrored here for convenience
  export import Name = Scene.Name;
  export import ConstructionContext = Scene.ConstructionContext;
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  export import ConstructorArgs = Scene.ConstructorArgs;
  export import Hierarchy = Scene.Hierarchy;
  export import Metadata = Scene.Metadata;
  export import Parent = Scene.Parent;
  export import Descendant = Scene.Descendant;
  export import DescendantClass = Scene.DescendantClass;
  export import Embedded = Scene.Embedded;
  export import ParentCollectionName = Scene.ParentCollectionName;
  export import CollectionClass = Scene.CollectionClass;
  export import Collection = Scene.Collection;
  export import Invalid = Scene.Invalid;
  export import Source = Scene.Source;
  export import CreateData = Scene.CreateData;
  export import CreateInput = Scene.CreateInput;
  export import CreateReturn = Scene.CreateReturn;
  export import InitializedData = Scene.InitializedData;
  export import UpdateData = Scene.UpdateData;
  export import UpdateInput = Scene.UpdateInput;
  export import Schema = Scene.Schema;
  export import Database = Scene.Database;
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  export import TemporaryIf = Scene.TemporaryIf;
  export import Flags = Scene.Flags;

  namespace Internal {
    // Note(LukeAbby): The point of this is to give the base class of `Scene` a name.
    // The expression `ClientDocumentMixin(BaseScene)` is more intuitive but it has worse
    // caching, likely due to the majority of tsc's caching working off of names.
    // See https://gist.github.com/LukeAbby/18a928fdc35c5d54dc121ed5dbf412fd.
    interface ClientDocument extends foundry.documents.abstract.ClientDocumentMixin.Mix<typeof BaseScene> {}
    const ClientDocument: ClientDocument;
  }
}
