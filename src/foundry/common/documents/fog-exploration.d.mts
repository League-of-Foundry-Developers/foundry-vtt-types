import type { DataModel, Document } from "#common/abstract/_module.d.mts";
import type { SchemaField } from "#common/data/fields.d.mts";

/**
 * The FogExploration Document.
 * Defines the DataSchema and common behaviors for FogExploration which are shared between both client and server.
 */
// Note(LukeAbby): You may wonder why documents don't simply pass the `Parent` generic parameter.
// This pattern evolved from trying to avoid circular loops and even internal tsc errors.
// See: https://gist.github.com/LukeAbby/0d01b6e20ef19ebc304d7d18cef9cc21
declare abstract class BaseFogExploration extends Document<"FogExploration", BaseFogExploration.Schema, any> {
  /**
   * @param data    - Initial data from which to construct the `BaseFogExploration`
   * @param context - Construction context options
   *
   * @remarks Constructing `BaseFogExploration` directly is not advised. The base document classes exist in
   * order to use documents on both the client (i.e. where all your code runs) and behind the scenes
   * on the server to manage document validation and storage.
   *
   * You should use {@linkcode FogExploration.implementation | new FogExploration.implementation(...)} instead which will give you
   * a system specific implementation of `FogExploration`.
   */
  constructor(data?: BaseFogExploration.CreateData, context?: BaseFogExploration.ConstructionContext);

  /**
   * @defaultValue
   * ```js
   * mergeObject(super.metadata, {
   *   name: "FogExploration",
   *   collection: "fog",
   *   label: "DOCUMENT.FogExploration",
   *   labelPlural: "DOCUMENT.FogExplorations",
   *   isPrimary: true,
   *   permissions: {
   *     create: "PLAYER",
   *     update: this.#canModify,
   *     delete: this.#canModify
   *   },
   *   schemaVersion: "13.341"
   * })
   * ```
   */
  static override metadata: BaseFogExploration.Metadata;

  static override defineSchema(): BaseFogExploration.Schema;

  protected override _preUpdate(
    changed: BaseFogExploration.UpdateData,
    options: BaseFogExploration.Database.PreUpdateOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

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

  override readonly parentCollection: BaseFogExploration.ParentCollectionName | null;

  override get pack(): string | null;

  static override get implementation(): FogExploration.ImplementationClass;

  static override get baseDocument(): typeof BaseFogExploration;

  static override get collectionName(): BaseFogExploration.ParentCollectionName;

  static override get documentName(): BaseFogExploration.Name;

  static override get TYPES(): CONST.BASE_DOCUMENT_TYPE[];

  static override get hasTypeData(): false;

  static override readonly hierarchy: BaseFogExploration.Hierarchy;

  override parent: BaseFogExploration.Parent;

  override " fvtt_types_internal_document_parent": BaseFogExploration.Parent;

  static override createDocuments<Temporary extends boolean | undefined = undefined>(
    data: Array<FogExploration.Implementation | BaseFogExploration.CreateData> | undefined,
    operation?: Document.Database.CreateOperation<BaseFogExploration.Database.Create<Temporary>>,
  ): Promise<Array<BaseFogExploration.TemporaryIf<Temporary>>>;

  static override updateDocuments(
    updates: BaseFogExploration.UpdateData[] | undefined,
    operation?: Document.Database.UpdateDocumentsOperation<BaseFogExploration.Database.Update>,
  ): Promise<FogExploration.Implementation[]>;

  static override deleteDocuments(
    ids: readonly string[] | undefined,
    operation?: Document.Database.DeleteDocumentsOperation<BaseFogExploration.Database.Delete>,
  ): Promise<FogExploration.Implementation[]>;

  static override create<Temporary extends boolean | undefined = undefined>(
    data: BaseFogExploration.CreateData | BaseFogExploration.CreateData[],
    operation?: BaseFogExploration.Database.CreateOperation<Temporary>,
  ): Promise<BaseFogExploration.TemporaryIf<Temporary> | undefined>;

  override update(
    data: BaseFogExploration.UpdateData | undefined,
    operation?: BaseFogExploration.Database.UpdateOperation,
  ): Promise<this | undefined>;

  override delete(operation?: BaseFogExploration.Database.DeleteOperation): Promise<this | undefined>;

  static override get(
    documentId: string,
    options?: BaseFogExploration.Database.GetOptions,
  ): Promise<FogExploration.Implementation | null> | FogExploration.Implementation | null;

  static override getCollectionName(name: string): null;

  override getFlag<Scope extends BaseFogExploration.Flags.Scope, Key extends BaseFogExploration.Flags.Key<Scope>>(
    scope: Scope,
    key: Key,
  ): BaseFogExploration.Flags.Get<Scope, Key>;

  override setFlag<
    Scope extends BaseFogExploration.Flags.Scope,
    Key extends BaseFogExploration.Flags.Key<Scope>,
    Value extends BaseFogExploration.Flags.Get<Scope, Key>,
  >(scope: Scope, key: Key, value: Value): Promise<this>;

  override unsetFlag<Scope extends BaseFogExploration.Flags.Scope, Key extends BaseFogExploration.Flags.Key<Scope>>(
    scope: Scope,
    key: Key,
  ): Promise<this>;

  protected override _preCreate(
    data: BaseFogExploration.CreateData,
    options: BaseFogExploration.Database.PreCreateOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected override _onCreate(
    data: BaseFogExploration.CreateData,
    options: BaseFogExploration.Database.OnCreateOperation,
    userId: string,
  ): void;

  protected static override _preCreateOperation(
    documents: FogExploration.Implementation[],
    operation: Document.Database.PreCreateOperationStatic<BaseFogExploration.Database.Create>,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static override _onCreateOperation(
    documents: FogExploration.Implementation[],
    operation: BaseFogExploration.Database.Create,
    user: User.Implementation,
  ): Promise<void>;

  protected override _onUpdate(
    changed: BaseFogExploration.UpdateData,
    options: BaseFogExploration.Database.OnUpdateOperation,
    userId: string,
  ): void;

  protected static override _preUpdateOperation(
    documents: FogExploration.Implementation[],
    operation: BaseFogExploration.Database.Update,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static override _onUpdateOperation(
    documents: FogExploration.Implementation[],
    operation: BaseFogExploration.Database.Update,
    user: User.Implementation,
  ): Promise<void>;

  protected override _preDelete(
    options: BaseFogExploration.Database.PreDeleteOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected override _onDelete(options: BaseFogExploration.Database.OnDeleteOperation, userId: string): void;

  protected static override _preDeleteOperation(
    documents: FogExploration.Implementation[],
    operation: BaseFogExploration.Database.Delete,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static override _onDeleteOperation(
    documents: FogExploration.Implementation[],
    operation: BaseFogExploration.Database.Delete,
    user: User.Implementation,
  ): Promise<void>;

  /**
   * @deprecated since v12, will be removed in v14
   * @remarks "The `Document._onCreateDocuments` static method is deprecated in favor of {@linkcode Document._onCreateOperation | Document._onCreateOperation}"
   */
  protected static override _onCreateDocuments(
    documents: FogExploration.Implementation[],
    context: Document.ModificationContext<BaseFogExploration.Parent>,
  ): Promise<void>;

  /**
   * @deprecated since v12, will be removed in v14
   * @remarks "The `Document._onUpdateDocuments` static method is deprecated in favor of {@linkcode Document._onUpdateOperation | Document._onUpdateOperation}"
   */
  protected static override _onUpdateDocuments(
    documents: FogExploration.Implementation[],
    context: Document.ModificationContext<BaseFogExploration.Parent>,
  ): Promise<void>;

  /**
   * @deprecated since v12, will be removed in v14
   * @remarks "The `Document._onDeleteDocuments` static method is deprecated in favor of {@linkcode Document._onDeleteOperation | Document._onDeleteOperation}"
   */
  protected static override _onDeleteDocuments(
    documents: FogExploration.Implementation[],
    context: Document.ModificationContext<BaseFogExploration.Parent>,
  ): Promise<void>;

  /* DataModel overrides */

  protected static override _schema: SchemaField<BaseFogExploration.Schema>;

  static override get schema(): SchemaField<BaseFogExploration.Schema>;

  static override validateJoint(data: BaseFogExploration.Source): void;

  static override fromSource(
    source: BaseFogExploration.CreateData,
    context?: DataModel.FromSourceOptions,
  ): FogExploration.Implementation;

  static override fromJSON(json: string): FogExploration.Implementation;

  static #BaseFogExploration: true;
}

export default BaseFogExploration;

declare namespace BaseFogExploration {
  // All types really live in the full document and are mirrored here for convenience
  export import Name = FogExploration.Name;
  export import ConstructionContext = FogExploration.ConstructionContext;
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  export import ConstructorArgs = FogExploration.ConstructorArgs;
  export import Hierarchy = FogExploration.Hierarchy;
  export import Metadata = FogExploration.Metadata;
  export import Parent = FogExploration.Parent;
  export import Descendant = FogExploration.Descendant;
  export import DescendantClass = FogExploration.DescendantClass;
  export import Embedded = FogExploration.Embedded;
  export import ParentCollectionName = FogExploration.ParentCollectionName;
  export import CollectionClass = FogExploration.CollectionClass;
  export import Collection = FogExploration.Collection;
  export import Invalid = FogExploration.Invalid;
  export import Stored = FogExploration.Stored;
  export import Source = FogExploration.Source;
  export import CreateData = FogExploration.CreateData;
  export import CreateInput = FogExploration.CreateInput;
  export import CreateReturn = FogExploration.CreateReturn;
  export import InitializedData = FogExploration.InitializedData;
  export import UpdateData = FogExploration.UpdateData;
  export import UpdateInput = FogExploration.UpdateInput;
  export import Schema = FogExploration.Schema;
  export import Database = FogExploration.Database;
  export import TemporaryIf = FogExploration.TemporaryIf;
  export import Flags = FogExploration.Flags;

  namespace Internal {
    // Note(LukeAbby): The point of this is to give the base class of `FogExploration` a name.
    // The expression `ClientDocumentMixin(BaseFogExploration)` is more intuitive but it has worse
    // caching, likely due to the majority of tsc's caching working off of names.
    // See https://gist.github.com/LukeAbby/18a928fdc35c5d54dc121ed5dbf412fd.
    interface ClientDocument extends foundry.documents.abstract.ClientDocumentMixin.Mix<typeof BaseFogExploration> {}
    const ClientDocument: ClientDocument;
  }
}
