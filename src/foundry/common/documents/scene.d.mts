import type { AnyMutableObject } from "#utils";
import type { DataModel, Document } from "#common/abstract/_module.d.mts";
import type { SchemaField } from "#common/data/fields.d.mts";

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
   *     MeasuredTemplate: "templates",
   *     Note: "notes",
   *     Region: "regions",
   *     Tile: "tiles",
   *     Token: "tokens",
   *     Wall: "walls"
   *   },
   *   label: "DOCUMENT.Scene",
   *   labelPlural: "DOCUMENT.Scenes",
   *   preserveOnImport: [...super.metadata.preserveOnImport, "active"],
   *   schemaVersion: "13.341"
   * });
   * ```
   */
  static override metadata: BaseScene.Metadata;

  static override defineSchema(): BaseScene.Schema;

  /** @defaultValue `["DOCUMENT", "SCENE"]` */
  static override LOCALIZATION_PREFIXES: string[];

  /**
   * The default grid defined by the system.
   */
  static get defaultGrid(): foundry.grid.BaseGrid;

  protected override _initialize(options?: Document.InitializeOptions): void;

  override updateSource(changes: BaseScene.UpdateData, options: DataModel.UpdateOptions): BaseScene.UpdateData;

  /**
   * @remarks
   * Migrations:
   * - `fogExploration` to `fog.exploration` (since v12, until 14 (probably))
   * - `fogReset` to `fog.reset` (since v12, until 14 (probably))
   * - `fogOverlay` to `fog.overlay` (since v12, until 14 (probably))
   * - `fogExploredColor` to `fog.colors.explored` (since v12, until 14 (probably))
   * - `fogUnexploredColor` to `fog.colors.unexplored` (since v12, until 14 (probably))
   * - `globalLight` to `environment.globalLight.enabled` (since v12, until 14 (probably))
   * - `globalLightThreshold` to `environment.globalLight.darkness.max` (since v12, until 14 (probably))
   * - `darkness` to `environment.darknessLevel` (since v12, until 14 (probably))
   * - `flags.core.sourceId` to `_stats.compendiumSource` (since v12, no specified end)
   */
  static override migrateData(source: AnyMutableObject): AnyMutableObject;

  /**
   * @remarks
   * Shims:
   * - `fogExploration` to `fog.exploration` (since v12, until 14)
   * - `fogReset` to `fog.reset` (since v12, until 14)
   * - `fogOverlay` to `fog.overlay` (since v12, until 14)
   * - `fogExploredColor` to `fog.colors.explored` (since v12, until 14)
   * - `fogUnexploredColor` to `fog.colors.unexplored` (since v12, until 14)
   * - `globalLight` to `environment.globalLight.enabled` (since v12, until 14)
   * - `globalLightThreshold` to `environment.globalLight.darkness.max` (since v12, until 14)
   * - `darkness` to `environment.darknessLevel` (since v12, until 14)
   */
  static override shimData(source: AnyMutableObject, options?: DataModel.ShimDataOptions): AnyMutableObject;

  /**
   * @deprecated since v12, until v14
   * @remarks Replaced with `fog.exploration`
   * @privateRemarks Defined via `Object.defineProperties` operating on `this.prototype` in a static initialization block with options: `{configurable: true}`
   */
  get fogExploration(): this["fog"]["exploration"];

  set fogExploration(value);

  /**
   * @deprecated since v12, until v14
   * @remarks Replaced with `fog.reset`
   * @privateRemarks Defined via `Object.defineProperties` operating on `this.prototype` in a static initialization block with options: `{configurable: true}`
   */
  get fogReset(): this["fog"]["reset"];

  set fogReset(value);

  /**
   * @deprecated since v12, until v14
   * @remarks Replaced with `fog.overlay`
   * @privateRemarks Defined via `Object.defineProperties` operating on `this.prototype` in a static initialization block with options: `{configurable: true}`
   */
  get fogOverlay(): this["fog"]["overlay"];

  set fogOverlay(value);

  /**
   * @deprecated since v12, until v14
   * @remarks Replaced with `fog.colors.explored`
   * @privateRemarks Defined via `Object.defineProperties` operating on `this.prototype` in a static initialization block with options: `{configurable: true}`
   */
  get fogExploredColor(): this["fog"]["colors"]["explored"];

  set fogExploredColor(value);

  /**
   * @deprecated since v12, until v14
   * @remarks Replaced with `fog.colors.unexplored`
   * @privateRemarks Defined via `Object.defineProperties` operating on `this.prototype` in a static initialization block with options: `{configurable: true}`
   */
  get fogUnexploredColor(): this["fog"]["colors"]["unexplored"];

  set fogUnexploredColor(value);

  /**
   * @deprecated since v12, until v14
   * @remarks Replaced with `environment.globalLight.enabled`
   * @privateRemarks Defined via `Object.defineProperties` operating on `this.prototype` in a static initialization block with options: `{configurable: true}`
   */
  get globalLight(): this["environment"]["globalLight"]["enabled"];

  set globalLight(value);

  /**
   * @deprecated since v12, until v14
   * @remarks Replaced with `environment.globalLight.darkness.max`
   * @privateRemarks Defined via `Object.defineProperties` operating on `this.prototype` in a static initialization block with options: `{configurable: true}`
   */
  get globalLightThreshold(): this["environment"]["globalLight"]["darkness"]["max"];

  set globalLightThreshold(value);

  /**
   * @deprecated since v12, until v14
   * @remarks Replaced with `environment.darknessLevel`
   * @privateRemarks Defined via `Object.defineProperties` operating on `this.prototype` in a static initialization block with options: `{configurable: true}`
   */
  get darkness(): this["environment"]["darknessLevel"];

  set darkness(value);

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

  readonly parentCollection: BaseScene.ParentCollectionName | null;

  override get pack(): string | null;

  static override get implementation(): Scene.ImplementationClass;

  static override get baseDocument(): typeof BaseScene;

  static override get collectionName(): BaseScene.ParentCollectionName;

  static override get documentName(): BaseScene.Name;

  static override get TYPES(): CONST.BASE_DOCUMENT_TYPE[];

  static override get hasTypeData(): false;

  static override readonly hierarchy: BaseScene.Hierarchy;

  override parent: BaseScene.Parent;

  override " fvtt_types_internal_document_parent": BaseScene.Parent;

  static override createDocuments<Temporary extends boolean | undefined = undefined>(
    data: Array<Scene.Implementation | BaseScene.CreateData> | undefined,
    operation?: Document.Database.CreateOperation<BaseScene.Database.Create<Temporary>>,
  ): Promise<Array<BaseScene.TemporaryIf<Temporary>>>;

  static override updateDocuments(
    updates: BaseScene.UpdateData[] | undefined,
    operation?: Document.Database.UpdateDocumentsOperation<BaseScene.Database.Update>,
  ): Promise<Scene.Implementation[]>;

  static override deleteDocuments(
    ids: readonly string[] | undefined,
    operation?: Document.Database.DeleteDocumentsOperation<BaseScene.Database.Delete>,
  ): Promise<Scene.Implementation[]>;

  static override create<Temporary extends boolean | undefined = undefined>(
    data: BaseScene.CreateData | BaseScene.CreateData[],
    operation?: BaseScene.Database.CreateOperation<Temporary>,
  ): Promise<BaseScene.TemporaryIf<Temporary> | undefined>;

  override update(
    data: BaseScene.UpdateData | undefined,
    operation?: BaseScene.Database.UpdateOperation,
  ): Promise<this | undefined>;

  override delete(operation?: BaseScene.Database.DeleteOperation): Promise<this | undefined>;

  static override get(documentId: string, options?: BaseScene.Database.GetOptions): Scene.Implementation | null;

  static override getCollectionName<CollectionName extends BaseScene.Embedded.Name>(
    name: CollectionName,
  ): BaseScene.Embedded.CollectionNameOf<CollectionName> | null;

  override getEmbeddedCollection<EmbeddedName extends BaseScene.Embedded.CollectionName>(
    embeddedName: EmbeddedName,
  ): BaseScene.Embedded.CollectionFor<EmbeddedName>;

  override getEmbeddedDocument<EmbeddedName extends BaseScene.Embedded.CollectionName>(
    embeddedName: EmbeddedName,
    id: string,
    options: Document.GetEmbeddedDocumentOptions,
  ): BaseScene.Embedded.DocumentFor<EmbeddedName> | undefined;

  override createEmbeddedDocuments<EmbeddedName extends BaseScene.Embedded.Name>(
    embeddedName: EmbeddedName,
    data: Document.CreateDataForName<EmbeddedName>[] | undefined,
    operation?: Document.Database.CreateOperationForName<EmbeddedName>,
  ): Promise<Array<Document.StoredForName<EmbeddedName>>>;

  override updateEmbeddedDocuments<EmbeddedName extends BaseScene.Embedded.Name>(
    embeddedName: EmbeddedName,
    updates: Document.UpdateDataForName<EmbeddedName>[] | undefined,
    operation?: Document.Database.UpdateOperationForName<EmbeddedName>,
  ): Promise<Array<Document.StoredForName<EmbeddedName>>>;

  override deleteEmbeddedDocuments<EmbeddedName extends BaseScene.Embedded.Name>(
    embeddedName: EmbeddedName,
    ids: Array<string>,
    operation?: Document.Database.DeleteOperationForName<EmbeddedName>,
  ): Promise<Array<Document.StoredForName<EmbeddedName>>>;

  override getFlag<Scope extends BaseScene.Flags.Scope, Key extends BaseScene.Flags.Key<Scope>>(
    scope: Scope,
    key: Key,
  ): BaseScene.Flags.Get<Scope, Key>;

  override setFlag<
    Scope extends BaseScene.Flags.Scope,
    Key extends BaseScene.Flags.Key<Scope>,
    Value extends BaseScene.Flags.Get<Scope, Key>,
  >(scope: Scope, key: Key, value: Value): Promise<this>;

  override unsetFlag<Scope extends BaseScene.Flags.Scope, Key extends BaseScene.Flags.Key<Scope>>(
    scope: Scope,
    key: Key,
  ): Promise<this>;

  protected override _preCreate(
    data: BaseScene.CreateData,
    options: BaseScene.Database.PreCreateOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected override _onCreate(
    data: BaseScene.CreateData,
    options: BaseScene.Database.OnCreateOperation,
    userId: string,
  ): void;

  protected static override _preCreateOperation(
    documents: Scene.Implementation[],
    operation: Document.Database.PreCreateOperationStatic<BaseScene.Database.Create>,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static override _onCreateOperation(
    documents: Scene.Implementation[],
    operation: BaseScene.Database.Create,
    user: User.Implementation,
  ): Promise<void>;

  protected override _preUpdate(
    changed: BaseScene.UpdateData,
    options: BaseScene.Database.PreUpdateOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected override _onUpdate(
    changed: BaseScene.UpdateData,
    options: BaseScene.Database.OnUpdateOperation,
    userId: string,
  ): void;

  protected static override _preUpdateOperation(
    documents: Scene.Implementation[],
    operation: BaseScene.Database.Update,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static override _onUpdateOperation(
    documents: Scene.Implementation[],
    operation: BaseScene.Database.Update,
    user: User.Implementation,
  ): Promise<void>;

  protected override _preDelete(
    options: BaseScene.Database.PreDeleteOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected override _onDelete(options: BaseScene.Database.OnDeleteOperation, userId: string): void;

  protected static override _preDeleteOperation(
    documents: Scene.Implementation[],
    operation: BaseScene.Database.Delete,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static override _onDeleteOperation(
    documents: Scene.Implementation[],
    operation: BaseScene.Database.Delete,
    user: User.Implementation,
  ): Promise<void>;

  /**
   * @deprecated "The `Scene._onCreateDocuments` static method is deprecated in favor of
   * {@linkcode Scene._onCreateOperation}" (since v12, until v14)
   */
  protected static override _onCreateDocuments(
    documents: Scene.Implementation[],
    context: BaseScene.Database.OnCreateDocumentsContext,
  ): Promise<void>;

  /**
   * @deprecated "The `Scene._onUpdateDocuments` static method is deprecated in favor of
   * {@linkcode Scene._onUpdateOperation}" (since v12, until v14)
   */
  protected static override _onUpdateDocuments(
    documents: Scene.Stored[],
    context: BaseScene.Database.OnUpdateDocumentsContext,
  ): Promise<void>;

  /**
   * @deprecated "The `Scene._onDeleteDocuments` static method is deprecated in favor of
   * {@linkcode Scene._onDeleteOperation}" (since v12, until v14)
   */
  protected static override _onDeleteDocuments(
    documents: Scene.Stored[],
    context: BaseScene.Database.OnDeleteDocumentsContext,
  ): Promise<void>;

  /* DataModel overrides */

  protected static override _schema: SchemaField<BaseScene.Schema>;

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
  export import Stored = Scene.Stored;
  export import Source = Scene.Source;
  export import CreateData = Scene.CreateData;
  export import CreateInput = Scene.CreateInput;
  export import CreateReturn = Scene.CreateReturn;
  export import InitializedData = Scene.InitializedData;
  export import UpdateData = Scene.UpdateData;
  export import UpdateInput = Scene.UpdateInput;
  export import Schema = Scene.Schema;
  export import Database = Scene.Database;
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
