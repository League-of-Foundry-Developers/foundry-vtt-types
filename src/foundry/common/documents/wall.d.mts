import type DataModel from "../abstract/data.d.mts";
import type Document from "../abstract/document.mts";
import type { DataField, SchemaField } from "../data/fields.d.mts";

/**
 * The Document definition for a Wall.
 * Defines the DataSchema and common behaviors for a Wall which are shared between both client and server.
 */
// Note(LukeAbby): You may wonder why documents don't simply pass the `Parent` generic parameter.
// This pattern evolved from trying to avoid circular loops and even internal tsc errors.
// See: https://gist.github.com/LukeAbby/0d01b6e20ef19ebc304d7d18cef9cc21
declare class BaseWall extends Document<WallDocument.Name, BaseWall.Schema, any> {
  /**
   * @param data    - Initial data from which to construct the `BaseWall`
   * @param context - Construction context options
   *
   * @remarks Constructing `BaseWall` directly is not advised. The base document classes exist in
   * order to use documents on both the client (i.e. where all your code runs) and behind the scenes
   * on the server to manage document validation and storage.
   *
   * You should use {@link WallDocument.implementation | `new WallDocument.implementation(...)`} instead which will give you
   * a system specific implementation of `WallDocument`.
   */
  constructor(data: WallDocument.CreateData, context?: WallDocument.ConstructionContext);

  /**
   * @defaultValue
   * ```js
   * mergeObject(super.metadata, {
   *   name: "Wall",
   *   collection: "walls",
   *   label: "DOCUMENT.Wall",
   *   labelPlural: "DOCUMENT.Walls",
   *   permissions: {
   *     update: this.#canUpdate
   *   },
   *   schemaVersion: "13.341"
   * })
   * ```
   */
  static override metadata: BaseWall.Metadata;

  static override defineSchema(): BaseWall.Schema;

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

  override readonly parentCollection: WallDocument.ParentCollectionName | null;

  override readonly pack: string | null;

  static override get implementation(): WallDocument.ImplementationClass;

  static override get baseDocument(): typeof BaseWall;

  static override get collectionName(): WallDocument.ParentCollectionName;

  static override get documentName(): WallDocument.Name;

  static override get TYPES(): CONST.BASE_DOCUMENT_TYPE[];

  static override get hasTypeData(): undefined;

  static override get hierarchy(): WallDocument.Hierarchy;

  override parent: WallDocument.Parent;

  static override createDocuments<Temporary extends boolean | undefined = undefined>(
    data: Array<WallDocument.Implementation | WallDocument.CreateData> | undefined,
    operation?: WallDocument.Database.CreateDocumentsOperation<Temporary>,
  ): Promise<Array<WallDocument.TemporaryIf<Temporary>>>;

  static override updateDocuments(
    updates: WallDocument.UpdateData[] | undefined,
    operation?: WallDocument.Database.UpdateDocumentsOperation,
  ): Promise<WallDocument.Implementation[]>;

  static override deleteDocuments(
    ids: readonly string[] | undefined,
    operation?: WallDocument.Database.DeleteDocumentsOperation,
  ): Promise<WallDocument.Implementation[]>;

  static override create<Temporary extends boolean | undefined = undefined>(
    data: WallDocument.CreateData | WallDocument.CreateData[],
    operation?: WallDocument.Database.CreateOperation<Temporary>,
  ): Promise<WallDocument.TemporaryIf<Temporary> | undefined>;

  override update(
    data: WallDocument.UpdateData | undefined,
    operation?: WallDocument.Database.UpdateOperation,
  ): Promise<this | undefined>;

  override delete(operation?: WallDocument.Database.DeleteOperation): Promise<this | undefined>;

  static override get(
    documentId: string,
    options?: WallDocument.Database.GetOptions,
  ): WallDocument.Implementation | null;

  static override getCollectionName(name: string): null;

  // Same as Document for now
  override traverseEmbeddedDocuments(
    _parentPath?: string,
  ): Generator<[string, Document.AnyChild<this>], void, undefined>;

  override getFlag<Scope extends WallDocument.Flags.Scope, Key extends WallDocument.Flags.Key<Scope>>(
    scope: Scope,
    key: Key,
  ): WallDocument.Flags.Get<Scope, Key>;

  override setFlag<
    Scope extends WallDocument.Flags.Scope,
    Key extends WallDocument.Flags.Key<Scope>,
    Value extends WallDocument.Flags.Get<Scope, Key>,
  >(scope: Scope, key: Key, value: Value): Promise<this>;

  override unsetFlag<Scope extends WallDocument.Flags.Scope, Key extends WallDocument.Flags.Key<Scope>>(
    scope: Scope,
    key: Key,
  ): Promise<this>;

  protected override _preCreate(
    data: WallDocument.CreateData,
    options: WallDocument.Database.PreCreateOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected override _onCreate(
    data: WallDocument.CreateData,
    options: WallDocument.Database.OnCreateOptions,
    userId: string,
  ): void;

  protected static override _preCreateOperation(
    documents: WallDocument.Implementation[],
    operation: WallDocument.Database.PreCreateOperation,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static override _onCreateOperation(
    documents: WallDocument.Implementation[],
    operation: WallDocument.Database.OnCreateOperation,
    user: User.Implementation,
  ): Promise<void>;

  protected override _preUpdate(
    changed: WallDocument.UpdateData,
    options: WallDocument.Database.PreUpdateOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected override _onUpdate(
    changed: WallDocument.UpdateData,
    options: WallDocument.Database.OnUpdateOptions,
    userId: string,
  ): void;

  protected static override _preUpdateOperation(
    documents: WallDocument.Implementation[],
    operation: WallDocument.Database.PreUpdateOperation,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static override _onUpdateOperation(
    documents: WallDocument.Implementation[],
    operation: WallDocument.Database.OnUpdateOperation,
    user: User.Implementation,
  ): Promise<void>;

  protected override _preDelete(
    options: WallDocument.Database.PreDeleteOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected override _onDelete(options: WallDocument.Database.OnDeleteOptions, userId: string): void;

  protected static override _preDeleteOperation(
    documents: WallDocument.Implementation[],
    operation: WallDocument.Database.PreDeleteOperation,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static override _onDeleteOperation(
    documents: WallDocument.Implementation[],
    operation: WallDocument.Database.OnDeleteOperation,
    user: User.Implementation,
  ): Promise<void>;

  /**
   * @deprecated since v12, will be removed in v14
   * @remarks "The `Document._onCreateDocuments` static method is deprecated in favor of {@link Document._onCreateOperation | `Document._onCreateOperation`}"
   */
  protected static override _onCreateDocuments(
    documents: WallDocument.Implementation[],
    context: WallDocument.Database.OnCreateDocumentsContext,
  ): Promise<void>;

  /**
   * @deprecated since v12, will be removed in v14
   * @remarks "The `Document._onUpdateDocuments` static method is deprecated in favor of {@link Document._onUpdateOperation | `Document._onUpdateOperation`}"
   */
  protected static override _onUpdateDocuments(
    documents: WallDocument.Implementation[],
    context: WallDocument.Database.OnUpdateDocumentsContext,
  ): Promise<void>;

  /**
   * @deprecated since v12, will be removed in v14
   * @remarks "The `Document._onDeleteDocuments` static method is deprecated in favor of {@link Document._onDeleteOperation | `Document._onDeleteOperation`}"
   */
  protected static override _onDeleteDocuments(
    documents: WallDocument.Implementation[],
    context: WallDocument.Database.OnDeleteDocumentsContext,
  ): Promise<void>;

  /* DataModel overrides */

  protected static override _schema: SchemaField<WallDocument.Schema>;

  static override get schema(): SchemaField<WallDocument.Schema>;

  static override validateJoint(data: WallDocument.Source): void;

  // options: not null (parameter default only, destructured in super)
  static override fromSource(
    source: WallDocument.CreateData,
    context?: DataModel.FromSourceOptions,
  ): WallDocument.Implementation;

  static override fromJSON(json: string): WallDocument.Implementation;

  static #BaseWall: true;
}

export default BaseWall;

declare namespace BaseWall {
  export import Name = WallDocument.Name;
  export import ConstructionContext = WallDocument.ConstructionContext;
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  export import ConstructorArgs = WallDocument.ConstructorArgs;
  export import Hierarchy = WallDocument.Hierarchy;
  export import Metadata = WallDocument.Metadata;
  export import Parent = WallDocument.Parent;
  export import Descendant = WallDocument.Descendant;
  export import DescendantClass = WallDocument.DescendantClass;
  export import Pack = WallDocument.Pack;
  export import Embedded = WallDocument.Embedded;
  export import ParentCollectionName = WallDocument.ParentCollectionName;
  export import CollectionClass = WallDocument.CollectionClass;
  export import Collection = WallDocument.Collection;
  export import Invalid = WallDocument.Invalid;
  export import Stored = WallDocument.Stored;
  export import Source = WallDocument.Source;
  export import CreateData = WallDocument.CreateData;
  export import InitializedData = WallDocument.InitializedData;
  export import UpdateData = WallDocument.UpdateData;
  export import Schema = WallDocument.Schema;
  export import Database = WallDocument.Database;
  export import TemporaryIf = WallDocument.TemporaryIf;
  export import Flags = WallDocument.Flags;

  namespace Internal {
    // Note(LukeAbby): The point of this is to give the base class of `WallDocument` a name.
    // The expression `CanvasDocumentMixin(BaseWall)` is more intuitive but it has worse
    // caching, likely due to the majority of tsc's caching working off of names.
    // See https://gist.github.com/LukeAbby/18a928fdc35c5d54dc121ed5dbf412fd.
    interface CanvasDocument extends foundry.documents.abstract.CanvasDocumentMixin.Mix<typeof BaseWall> {}
    const CanvasDocument: CanvasDocument;
  }
}
