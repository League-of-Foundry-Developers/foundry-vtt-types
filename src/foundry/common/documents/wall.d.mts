import type { MaybeArray } from "#utils";
import type { DataModel, Document } from "#common/abstract/_module.d.mts";
import type { SchemaField } from "#common/data/fields.d.mts";

/**
 * The Document definition for a Wall.
 * Defines the DataSchema and common behaviors for a Wall which are shared between both client and server.
 */
// Note(LukeAbby): You may wonder why documents don't simply pass the `Parent` generic parameter.
// This pattern evolved from trying to avoid circular loops and even internal tsc errors.
// See: https://gist.github.com/LukeAbby/0d01b6e20ef19ebc304d7d18cef9cc21
declare abstract class BaseWall extends Document<"Wall", BaseWall.Schema, any> {
  /**
   * @param data    - Initial data from which to construct the `BaseWall`
   * @param context - Construction context options
   *
   * @remarks Constructing `BaseWall` directly is not advised. The base document classes exist in
   * order to use documents on both the client (i.e. where all your code runs) and behind the scenes
   * on the server to manage document validation and storage.
   *
   * You should use {@linkcode WallDocument.implementation | new WallDocument.implementation(...)} instead which will give you
   * a system specific implementation of `WallDocument`.
   */
  constructor(data: BaseWall.CreateData, context?: BaseWall.ConstructionContext);

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

  override readonly parentCollection: BaseWall.ParentCollectionName | null;

  static override get implementation(): WallDocument.ImplementationClass;

  static override get baseDocument(): typeof BaseWall;

  static override get collectionName(): BaseWall.ParentCollectionName;

  static override get documentName(): BaseWall.Name;

  static override get TYPES(): CONST.BASE_DOCUMENT_TYPE[];

  static override get hasTypeData(): false;

  static override readonly hierarchy: BaseWall.Hierarchy;

  override parent: BaseWall.Parent;

  override " fvtt_types_internal_document_parent": BaseWall.Parent;

  static override createDocuments<Temporary extends boolean | undefined = undefined>(
    data: BaseWall.CreateInput[],
    operation?: BaseWall.Database.CreateDocumentsOperation<Temporary>,
  ): Promise<Array<BaseWall.TemporaryIf<Temporary>>>;

  static override updateDocuments(
    updates: BaseWall.UpdateInput[],
    operation?: BaseWall.Database.UpdateDocumentsOperation,
  ): Promise<Array<WallDocument.Stored>>;

  static override deleteDocuments(
    ids: readonly string[],
    operation?: BaseWall.Database.DeleteDocumentsOperation,
  ): Promise<Array<WallDocument.Stored>>;

  static override create<
    Data extends MaybeArray<BaseWall.CreateInput>,
    Temporary extends boolean | undefined = undefined,
  >(
    data: Data,
    operation?: BaseWall.Database.CreateOperation<Temporary>,
  ): Promise<BaseWall.CreateReturn<Data, Temporary>>;

  override update(data: BaseWall.UpdateInput, operation?: BaseWall.Database.UpdateOperation): Promise<this | undefined>;

  override delete(operation?: BaseWall.Database.DeleteOperation): Promise<this | undefined>;

  // `WallDocument`s are neither world documents nor compendium documents, so this always returns `null`.
  static override get(documentId: string, operation?: BaseWall.Database.GetOptions): null;

  // `WallDocument`s have no embedded collections, so this always returns `null`.
  static override getCollectionName(name: string): null;

  override getFlag<Scope extends BaseWall.Flags.Scope, Key extends BaseWall.Flags.Key<Scope>>(
    scope: Scope,
    key: Key,
  ): BaseWall.Flags.Get<Scope, Key>;

  override setFlag<
    Scope extends BaseWall.Flags.Scope,
    Key extends BaseWall.Flags.Key<Scope>,
    Value extends BaseWall.Flags.Get<Scope, Key>,
  >(scope: Scope, key: Key, value: Value): Promise<this | undefined>;

  override unsetFlag<Scope extends BaseWall.Flags.Scope, Key extends BaseWall.Flags.Key<Scope>>(
    scope: Scope,
    key: Key,
  ): Promise<this | undefined>;

  protected override _preCreate(
    data: BaseWall.CreateData,
    options: BaseWall.Database.PreCreateOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected override _onCreate(
    data: BaseWall.CreateData,
    options: BaseWall.Database.OnCreateOptions,
    userId: string,
  ): void;

  protected static override _preCreateOperation(
    documents: WallDocument.Implementation[],
    operation: BaseWall.Database.PreCreateOperation,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static override _onCreateOperation(
    documents: WallDocument.Implementation[],
    operation: BaseWall.Database.OnCreateOperation,
    user: User.Implementation,
  ): Promise<void>;

  protected override _preUpdate(
    changed: BaseWall.UpdateData,
    options: BaseWall.Database.PreUpdateOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected override _onUpdate(
    changed: BaseWall.UpdateData,
    options: BaseWall.Database.OnUpdateOptions,
    userId: string,
  ): void;

  protected static override _preUpdateOperation(
    documents: WallDocument.Implementation[],
    operation: BaseWall.Database.PreUpdateOperation,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static override _onUpdateOperation(
    documents: WallDocument.Implementation[],
    operation: BaseWall.Database.OnUpdateOperation,
    user: User.Implementation,
  ): Promise<void>;

  protected override _preDelete(
    options: BaseWall.Database.PreDeleteOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected override _onDelete(options: BaseWall.Database.OnDeleteOptions, userId: string): void;

  protected static override _preDeleteOperation(
    documents: WallDocument.Implementation[],
    operation: BaseWall.Database.PreDeleteOperation,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static override _onDeleteOperation(
    documents: WallDocument.Implementation[],
    operation: BaseWall.Database.OnDeleteOperation,
    user: User.Implementation,
  ): Promise<void>;

  /**
   * @deprecated "The `WallDocument._onCreateDocuments` static method is deprecated in favor of
   * {@linkcode WallDocument._onCreateOperation}" (since v12, until v14)
   */
  protected static override _onCreateDocuments(
    documents: WallDocument.Implementation[],
    context: BaseWall.Database.OnCreateDocumentsContext,
  ): Promise<void>;

  /**
   * @deprecated "The `WallDocument._onUpdateDocuments` static method is deprecated in favor of
   * {@linkcode WallDocument._onUpdateOperation}" (since v12, until v14)
   */
  protected static override _onUpdateDocuments(
    documents: WallDocument.Stored[],
    context: BaseWall.Database.OnUpdateDocumentsContext,
  ): Promise<void>;

  /**
   * @deprecated "The `WallDocument._onDeleteDocuments` static method is deprecated in favor of
   * {@linkcode WallDocument._onDeleteOperation}" (since v12, until v14)
   */
  protected static override _onDeleteDocuments(
    documents: WallDocument.Stored[],
    context: BaseWall.Database.OnDeleteDocumentsContext,
  ): Promise<void>;

  /* DataModel overrides */

  protected static override _schema: SchemaField<BaseWall.Schema>;

  static override get schema(): SchemaField<BaseWall.Schema>;

  static override validateJoint(data: BaseWall.Source): void;

  static override fromSource(
    source: BaseWall.CreateData,
    context?: DataModel.FromSourceOptions,
  ): WallDocument.Implementation;

  static override fromJSON(json: string): WallDocument.Implementation;

  static #BaseWall: true;
}

export default BaseWall;

declare namespace BaseWall {
  // All types really live in the full document and are mirrored here for convenience
  export import Name = WallDocument.Name;
  export import ConstructionContext = WallDocument.ConstructionContext;
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  export import ConstructorArgs = WallDocument.ConstructorArgs;
  export import Hierarchy = WallDocument.Hierarchy;
  export import Metadata = WallDocument.Metadata;
  export import Parent = WallDocument.Parent;
  export import Descendant = WallDocument.Descendant;
  export import DescendantClass = WallDocument.DescendantClass;
  export import Embedded = WallDocument.Embedded;
  export import ParentCollectionName = WallDocument.ParentCollectionName;
  export import CollectionClass = WallDocument.CollectionClass;
  export import Collection = WallDocument.Collection;
  export import Invalid = WallDocument.Invalid;
  export import Source = WallDocument.Source;
  export import CreateData = WallDocument.CreateData;
  export import CreateInput = WallDocument.CreateInput;
  export import CreateReturn = WallDocument.CreateReturn;
  export import InitializedData = WallDocument.InitializedData;
  export import UpdateData = WallDocument.UpdateData;
  export import UpdateInput = WallDocument.UpdateInput;
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
