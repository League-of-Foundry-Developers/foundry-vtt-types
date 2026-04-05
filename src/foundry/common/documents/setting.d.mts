import type { DataModel, Document } from "#common/abstract/_module.d.mts";
import type { DataField, SchemaField } from "../data/fields.d.mts";

/**
 * The Setting Document.
 * Defines the DataSchema and common behaviors for a Setting which are shared between both client and server.
 */
// Note(LukeAbby): You may wonder why documents don't simply pass the `Parent` generic parameter.
// This pattern evolved from trying to avoid circular loops and even internal tsc errors.
// See: https://gist.github.com/LukeAbby/0d01b6e20ef19ebc304d7d18cef9cc21
declare abstract class BaseSetting extends Document<"Setting", BaseSetting.Schema, any> {
  /**
   * @param data    - Initial data from which to construct the `BaseSetting`
   * @param context - Construction context options
   *
   * @remarks Constructing `BaseSetting` directly is not advised. The base document classes exist in
   * order to use documents on both the client (i.e. where all your code runs) and behind the scenes
   * on the server to manage document validation and storage.
   *
   * You should use {@link Setting.implementation | `new Setting.implementation(...)`} instead which will give you
   * a system specific implementation of `Setting`.
   */
  constructor(data: BaseSetting.CreateData, context?: BaseSetting.ConstructionContext);

  /**
   * @defaultValue
   * ```js
   * mergeObject(super.metadata, {
   *   name: "Setting",
   *   collection: "settings",
   *   label: "DOCUMENT.Setting",
   *   labelPlural: "DOCUMENT.Settings",
   *   permissions: {
   *     create: this.#canModify,
   *     update: this.#canModify,
   *     delete: this.#canModify
   *   },
   *   schemaVersion: "13.341"
   * });
   * ```
   */
  static override metadata: BaseSetting.Metadata;

  static override defineSchema(): BaseSetting.Schema;

  /** @remarks Returns `user.hasPermission("SETTINGS_MODIFY")` */
  static canUserCreate(user: User.Implementation): boolean;

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

  override readonly parentCollection: BaseSetting.ParentCollectionName | null;

  override readonly pack: string | null;

  static override get baseDocument(): typeof BaseSetting;

  static override get implementation(): Setting.ImplementationClass;

  static override get collectionName(): BaseSetting.ParentCollectionName;

  static override get documentName(): BaseSetting.Name;

  static override get TYPES(): CONST.BASE_DOCUMENT_TYPE[];

  static override get hasTypeData(): undefined;

  static override get hierarchy(): BaseSetting.Hierarchy;

  override parent: BaseSetting.Parent;

  override " fvtt_types_internal_document_parent": BaseSetting.Parent;

  static override createDocuments<Temporary extends boolean | undefined = undefined>(
    data: Array<Setting.Implementation | BaseSetting.CreateData> | undefined,
    operation?: Document.Database.CreateOperation<BaseSetting.Database.Create<Temporary>>,
  ): Promise<Array<BaseSetting.TemporaryIf<Temporary>>>;

  static override updateDocuments(
    updates: BaseSetting.UpdateData[] | undefined,
    operation?: Document.Database.UpdateDocumentsOperation<BaseSetting.Database.Update>,
  ): Promise<Setting.Implementation[]>;

  static override deleteDocuments(
    ids: readonly string[] | undefined,
    operation?: Document.Database.DeleteDocumentsOperation<BaseSetting.Database.Delete>,
  ): Promise<Setting.Implementation[]>;

  static override create<Temporary extends boolean | undefined = undefined>(
    data: BaseSetting.CreateData | BaseSetting.CreateData[],
    operation?: BaseSetting.Database.CreateOperation<Temporary>,
  ): Promise<BaseSetting.TemporaryIf<Temporary> | undefined>;

  override update(
    data: BaseSetting.UpdateData | undefined,
    operation?: BaseSetting.Database.UpdateOperation,
  ): Promise<this | undefined>;

  override delete(operation?: BaseSetting.Database.DeleteOperation): Promise<this | undefined>;

  static override get(documentId: string, options?: BaseSetting.Database.GetOptions): Setting.Implementation | null;

  static override getCollectionName(name: string): null;

  // Same as Document for now
  override traverseEmbeddedDocuments(
    _parentPath?: string,
  ): Generator<[string, Document.AnyChild<this>], void, undefined>;

  protected override _preCreate(
    data: BaseSetting.CreateData,
    options: BaseSetting.Database.PreCreateOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected override _onCreate(
    data: BaseSetting.CreateData,
    options: BaseSetting.Database.OnCreateOperation,
    userId: string,
  ): void;

  protected static override _preCreateOperation(
    documents: Setting.Implementation[],
    operation: Document.Database.PreCreateOperationStatic<BaseSetting.Database.Create>,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static override _onCreateOperation(
    documents: Setting.Implementation[],
    operation: BaseSetting.Database.Create,
    user: User.Implementation,
  ): Promise<void>;

  protected override _preUpdate(
    changed: BaseSetting.UpdateData,
    options: BaseSetting.Database.PreUpdateOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected override _onUpdate(
    changed: BaseSetting.UpdateData,
    options: BaseSetting.Database.OnUpdateOperation,
    userId: string,
  ): void;

  protected static override _preUpdateOperation(
    documents: Setting.Implementation[],
    operation: BaseSetting.Database.Update,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static override _onUpdateOperation(
    documents: Setting.Implementation[],
    operation: BaseSetting.Database.Update,
    user: User.Implementation,
  ): Promise<void>;

  protected override _preDelete(
    options: BaseSetting.Database.PreDeleteOptions,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected override _onDelete(options: BaseSetting.Database.OnDeleteOperation, userId: string): void;

  protected static override _preDeleteOperation(
    documents: Setting.Implementation[],
    operation: BaseSetting.Database.Delete,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static override _onDeleteOperation(
    documents: Setting.Implementation[],
    operation: BaseSetting.Database.Delete,
    user: User.Implementation,
  ): Promise<void>;

  /**
   * @deprecated since v12, will be removed in v14
   * @remarks "The `Document._onCreateDocuments` static method is deprecated in favor of {@link Document._onCreateOperation | `Document._onCreateOperation`}"
   */
  protected static override _onCreateDocuments(
    documents: Setting.Implementation[],
    context: Document.ModificationContext<BaseSetting.Parent>,
  ): Promise<void>;

  /**
   * @deprecated since v12, will be removed in v14
   * @remarks "The `Document._onUpdateDocuments` static method is deprecated in favor of {@link Document._onUpdateOperation | `Document._onUpdateOperation`}"
   */
  protected static override _onUpdateDocuments(
    documents: Setting.Implementation[],
    context: Document.ModificationContext<BaseSetting.Parent>,
  ): Promise<void>;

  /**
   * @deprecated since v12, will be removed in v14
   * @remarks "The `Document._onDeleteDocuments` static method is deprecated in favor of {@link Document._onDeleteOperation | `Document._onDeleteOperation`}"
   */
  protected static override _onDeleteDocuments(
    documents: Setting.Implementation[],
    context: Document.ModificationContext<BaseSetting.Parent>,
  ): Promise<void>;

  /* DataModel overrides */

  protected static override _schema: SchemaField<BaseSetting.Schema>;

  static override get schema(): SchemaField<BaseSetting.Schema>;

  static override validateJoint(data: BaseSetting.Source): void;

  static override fromSource(
    source: BaseSetting.CreateData,
    context?: DataModel.FromSourceOptions,
  ): Setting.Implementation;

  static override fromJSON(json: string): Setting.Implementation;

  static #BaseSetting: true;
}

export default BaseSetting;

declare namespace BaseSetting {
  // All types really live in the full document and are mirrored here for convenience
  export import Name = Setting.Name;
  export import ConstructionContext = Setting.ConstructionContext;
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  export import ConstructorArgs = Setting.ConstructorArgs;
  export import Hierarchy = Setting.Hierarchy;
  export import Metadata = Setting.Metadata;
  export import Parent = Setting.Parent;
  export import Descendant = Setting.Descendant;
  export import DescendantClass = Setting.DescendantClass;
  export import Embedded = Setting.Embedded;
  export import ParentCollectionName = Setting.ParentCollectionName;
  export import CollectionClass = Setting.CollectionClass;
  export import Collection = Setting.Collection;
  export import Invalid = Setting.Invalid;
  export import Stored = Setting.Stored;
  export import Source = Setting.Source;
  export import CreateData = Setting.CreateData;
  export import CreateInput = Setting.CreateInput;
  export import CreateReturn = Setting.CreateReturn;
  export import InitializedData = Setting.InitializedData;
  export import UpdateData = Setting.UpdateData;
  export import UpdateInput = Setting.UpdateInput;
  export import Schema = Setting.Schema;
  export import Database = Setting.Database;
  export import TemporaryIf = Setting.TemporaryIf;
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  export import Flags = Setting.Flags;

  namespace Internal {
    // Note(LukeAbby): The point of this is to give the base class of `Setting` a name.
    // The expression `ClientDocumentMixin(BaseSetting)` is more intuitive but it has worse
    // caching, likely due to the majority of tsc's caching working off of names.
    // See https://gist.github.com/LukeAbby/18a928fdc35c5d54dc121ed5dbf412fd.
    interface ClientDocument extends foundry.documents.abstract.ClientDocumentMixin.Mix<typeof BaseSetting> {}
    const ClientDocument: ClientDocument;
  }
}
