import type { AnyMutableObject } from "#utils";
import type DataModel from "../abstract/data.d.mts";
import type Document from "../abstract/document.mts";
import type { DataField, SchemaField } from "../data/fields.d.mts";
import type { LogCompatibilityWarningOptions } from "../utils/logging.d.mts";

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
   * You should use {@link Scene.implementation | `new Scene.implementation(...)`} instead which will give you
   * a system specific implementation of `Scene`.
   */
  constructor(data: Scene.CreateData, context?: Scene.ConstructionContext);

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

  override updateSource(changes: Scene.UpdateData, options: DataModel.UpdateOptions): Scene.UpdateData;

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
  // options: not null (destructured)
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

  // Same as Document for now
  protected static override _initializationOrder(): Generator<[string, DataField.Any], void, undefined>;

  readonly parentCollection: Scene.ParentCollectionName | null;

  readonly pack: string | null;

  static override get implementation(): Scene.ImplementationClass;

  static get baseDocument(): typeof BaseScene;

  static get collectionName(): Scene.ParentCollectionName;

  static get documentName(): Scene.Name;

  static get TYPES(): CONST.BASE_DOCUMENT_TYPE[];

  static get hasTypeData(): undefined;

  static get hierarchy(): Scene.Hierarchy;

  override parent: Scene.Parent;

  static override createDocuments<Temporary extends boolean | undefined = undefined>(
    data: Array<Scene.Implementation | Scene.CreateData> | undefined,
    operation?: Document.Database.CreateOperation<Scene.Database.Create<Temporary>>,
  ): Promise<Array<Scene.TemporaryIf<Temporary>>>;

  static override updateDocuments(
    updates: Scene.UpdateData[] | undefined,
    operation?: Document.Database.UpdateDocumentsOperation<Scene.Database.Update>,
  ): Promise<Scene.Implementation[]>;

  static override deleteDocuments(
    ids: readonly string[] | undefined,
    operation?: Document.Database.DeleteDocumentsOperation<Scene.Database.Delete>,
  ): Promise<Scene.Implementation[]>;

  static override create<Temporary extends boolean | undefined = undefined>(
    data: Scene.CreateData | Scene.CreateData[],
    operation?: Scene.Database.CreateOperation<Temporary>,
  ): Promise<Scene.TemporaryIf<Temporary> | undefined>;

  override update(
    data: Scene.UpdateData | undefined,
    operation?: Scene.Database.UpdateOperation,
  ): Promise<this | undefined>;

  override delete(operation?: Scene.Database.DeleteOperation): Promise<this | undefined>;

  static override get(documentId: string, options?: Scene.Database.GetOptions): Scene.Implementation | null;

  static override getCollectionName<CollectionName extends Scene.Embedded.Name>(
    name: CollectionName,
  ): Scene.Embedded.CollectionNameOf<CollectionName> | null;

  override getEmbeddedCollection<EmbeddedName extends Scene.Embedded.CollectionName>(
    embeddedName: EmbeddedName,
  ): Scene.Embedded.CollectionFor<EmbeddedName>;

  override getEmbeddedDocument<EmbeddedName extends Scene.Embedded.CollectionName>(
    embeddedName: EmbeddedName,
    id: string,
    options: Document.GetEmbeddedDocumentOptions,
  ): Scene.Embedded.DocumentFor<EmbeddedName> | undefined;

  override createEmbeddedDocuments<EmbeddedName extends Scene.Embedded.Name>(
    embeddedName: EmbeddedName,
    data: Document.CreateDataForName<EmbeddedName>[] | undefined,
    operation?: Document.Database.CreateOperationForName<EmbeddedName>,
  ): Promise<Array<Document.StoredForName<EmbeddedName>>>;

  override updateEmbeddedDocuments<EmbeddedName extends Scene.Embedded.Name>(
    embeddedName: EmbeddedName,
    updates: Document.UpdateDataForName<EmbeddedName>[] | undefined,
    operation?: Document.Database.UpdateOperationForName<EmbeddedName>,
  ): Promise<Array<Document.StoredForName<EmbeddedName>>>;

  override deleteEmbeddedDocuments<EmbeddedName extends Scene.Embedded.Name>(
    embeddedName: EmbeddedName,
    ids: Array<string>,
    operation?: Document.Database.DeleteOperationForName<EmbeddedName>,
  ): Promise<Array<Document.StoredForName<EmbeddedName>>>;

  // Same as Document for now
  override traverseEmbeddedDocuments(
    _parentPath?: string,
  ): Generator<[string, Document.AnyChild<this>], void, undefined>;

  override getFlag<Scope extends Scene.Flags.Scope, Key extends Scene.Flags.Key<Scope>>(
    scope: Scope,
    key: Key,
  ): Scene.Flags.Get<Scope, Key>;

  override setFlag<
    Scope extends Scene.Flags.Scope,
    Key extends Scene.Flags.Key<Scope>,
    Value extends Scene.Flags.Get<Scope, Key>,
  >(scope: Scope, key: Key, value: Value): Promise<this>;

  override unsetFlag<Scope extends Scene.Flags.Scope, Key extends Scene.Flags.Key<Scope>>(
    scope: Scope,
    key: Key,
  ): Promise<this>;

  protected override _preCreate(
    data: Scene.CreateData,
    options: Scene.Database.PreCreateOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected override _onCreate(data: Scene.CreateData, options: Scene.Database.OnCreateOperation, userId: string): void;

  protected static override _preCreateOperation(
    documents: Scene.Implementation[],
    operation: Document.Database.PreCreateOperationStatic<Scene.Database.Create>,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static override _onCreateOperation(
    documents: Scene.Implementation[],
    operation: Scene.Database.Create,
    user: User.Implementation,
  ): Promise<void>;

  protected override _preUpdate(
    changed: Scene.UpdateData,
    options: Scene.Database.PreUpdateOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected override _onUpdate(
    changed: Scene.UpdateData,
    options: Scene.Database.OnUpdateOperation,
    userId: string,
  ): void;

  protected static override _preUpdateOperation(
    documents: Scene.Implementation[],
    operation: Scene.Database.Update,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static override _onUpdateOperation(
    documents: Scene.Implementation[],
    operation: Scene.Database.Update,
    user: User.Implementation,
  ): Promise<void>;

  protected override _preDelete(
    options: Scene.Database.PreDeleteOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected override _onDelete(options: Scene.Database.OnDeleteOperation, userId: string): void;

  protected static override _preDeleteOperation(
    documents: Scene.Implementation[],
    operation: Scene.Database.Delete,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static override _onDeleteOperation(
    documents: Scene.Implementation[],
    operation: Scene.Database.Delete,
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
  protected static override _onCreateDocuments(
    documents: Scene.Implementation[],
    context: Document.ModificationContext<Scene.Parent>,
  ): Promise<void>;

  /**
   * @deprecated since v12, will be removed in v14
   * @remarks "The `Document._onUpdateDocuments` static method is deprecated in favor of {@link Document._onUpdateOperation | `Document._onUpdateOperation`}"
   */
  protected static override _onUpdateDocuments(
    documents: Scene.Implementation[],
    context: Document.ModificationContext<Scene.Parent>,
  ): Promise<void>;

  /**
   * @deprecated since v12, will be removed in v14
   * @remarks "The `Document._onDeleteDocuments` static method is deprecated in favor of {@link Document._onDeleteOperation | `Document._onDeleteOperation`}"
   */
  protected static override _onDeleteDocuments(
    documents: Scene.Implementation[],
    context: Document.ModificationContext<Scene.Parent>,
  ): Promise<void>;

  /* DataModel overrides */

  protected static override _schema: SchemaField<Scene.Schema>;

  static override get schema(): SchemaField<Scene.Schema>;

  static override validateJoint(data: Scene.Source): void;

  // options: not null (parameter default only, destructured in super)
  static override fromSource(source: Scene.CreateData, context?: DataModel.FromSourceOptions): Scene.Implementation;

  static override fromJSON(json: string): Scene.Implementation;

  #BaseScene: true;
}

export default BaseScene;

declare namespace BaseScene {
  export import Name = Scene.Name;
  export import ConstructionContext = Scene.ConstructionContext;
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  export import ConstructorArgs = Scene.ConstructorArgs;
  export import Hierarchy = Scene.Hierarchy;
  export import Metadata = Scene.Metadata;
  export import Parent = Scene.Parent;
  export import Descendant = Scene.Descendant;
  export import DescendantClass = Scene.DescendantClass;
  export import Pack = Scene.Pack;
  export import Embedded = Scene.Embedded;
  export import ParentCollectionName = Scene.ParentCollectionName;
  export import CollectionClass = Scene.CollectionClass;
  export import Collection = Scene.Collection;
  export import Invalid = Scene.Invalid;
  export import Stored = Scene.Stored;
  export import Source = Scene.Source;
  export import CreateData = Scene.CreateData;
  export import InitializedData = Scene.InitializedData;
  export import UpdateData = Scene.UpdateData;
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
