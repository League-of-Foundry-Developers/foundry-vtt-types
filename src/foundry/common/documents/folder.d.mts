import type { MaybeArray } from "#utils";
import type { DataModel, Document } from "#common/abstract/_module.d.mts";
import type { SchemaField } from "#common/data/fields.d.mts";

/**
 * The Folder Document.
 * Defines the DataSchema and common behaviors for a Folder which are shared between both client and server.
 */
// Note(LukeAbby): You may wonder why documents don't simply pass the `Parent` generic parameter.
// This pattern evolved from trying to avoid circular loops and even internal tsc errors.
// See: https://gist.github.com/LukeAbby/0d01b6e20ef19ebc304d7d18cef9cc21
declare abstract class BaseFolder<out SubType extends BaseFolder.SubType = BaseFolder.SubType> extends Document<
  "Folder",
  BaseFolder.Schema,
  any
> {
  /**
   * @param data    - Initial data from which to construct the `BaseFolder`
   * @param context - Construction context options
   *
   * @remarks Constructing `BaseFolder` directly is not advised. The base document classes exist in
   * order to use documents on both the client (i.e. where all your code runs) and behind the scenes
   * on the server to manage document validation and storage.
   *
   * You should use {@linkcode Folder.implementation | new Folder.implementation(...)} instead which will give you
   * a system specific implementation of `Folder`.
   */
  constructor(data: BaseFolder.CreateData, context?: BaseFolder.ConstructionContext);

  /**
   * @defaultValue
   * ```js
   * mergeObject(super.metadata, {
   *   name: "Folder",
   *   collection: "folders",
   *   label: "DOCUMENT.Folder",
   *   labelPlural: "DOCUMENT.Folders",
   *   coreTypes: CONST.FOLDER_DOCUMENT_TYPES,
   *   schemaVersion: "13.341"
   * })
   * ```
   */
  static override metadata: BaseFolder.Metadata;

  static override defineSchema(): BaseFolder.Schema;

  /** @defaultValue `["DOCUMENT", "FOLDER"]` */
  static override LOCALIZATION_PREFIXES: string[];

  /**
   * @throws If `data.folder === data._id` (no putting folders inside themselves)
   */
  static validateJoint(data: BaseFolder.Source): void;

  /**
   * Allow folder sorting modes
   * @defaultValue `["a", "m"]`
   */
  static SORTING_MODES: ("a" | "m")[];

  // Never returns an index entry, only a persisted `Folder` or `null`, as the `folders` collection of
  // a compendium is always loaded and available synchronously.
  static override get(documentId: string, operation?: BaseFolder.Database.GetDocumentsOperation): Folder.Stored | null;

  /*
   * After this point these are not really overridden methods.
   * They are here because Foundry's documents are complex and have lots of edge cases.
   * There are DRY ways of representing this but this ends up being harder to understand
   * for end users extending these functions, especially for static methods. There are also a
   * number of methods that don't make sense to call directly on `Document` like `createDocuments`,
   * as there is no data that can safely construct every possible document. Finally keeping definitions
   * separate like this helps against circularities.
   */

  type: SubType;

  /* Document overrides */

  override readonly parentCollection: BaseFolder.ParentCollectionName | null;

  override get pack(): string | null;

  static override get implementation(): Folder.ImplementationClass;

  static override get baseDocument(): typeof BaseFolder;

  static override get collectionName(): BaseFolder.ParentCollectionName;

  static override get documentName(): BaseFolder.Name;

  static override get TYPES(): BaseFolder.SubType[];

  static override get hasTypeData(): false;

  static override readonly hierarchy: BaseFolder.Hierarchy;

  override parent: BaseFolder.Parent;

  override " fvtt_types_internal_document_parent": BaseFolder.Parent;

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
    data?: Document.CanUserModifyData<"Folder", Action>,
  ): boolean;

  static override createDocuments<Temporary extends boolean | undefined = undefined>(
    data: BaseFolder.CreateInput[],
    operation?: BaseFolder.Database.CreateDocumentsOperation<Temporary>,
  ): Promise<Array<BaseFolder.TemporaryIf<Temporary>>>;

  static override updateDocuments(
    updates: BaseFolder.UpdateInput[],
    operation?: BaseFolder.Database.UpdateManyDocumentsOperation,
  ): Promise<Array<Folder.Stored>>;

  static override deleteDocuments(
    ids: readonly string[],
    operation?: BaseFolder.Database.DeleteManyDocumentsOperation,
  ): Promise<Array<Folder.Stored>>;

  static override create<
    Data extends MaybeArray<BaseFolder.CreateInput>,
    Temporary extends boolean | undefined = undefined,
  >(
    data: Data,
    operation?: BaseFolder.Database.CreateDocumentsOperation<Temporary>,
  ): Promise<BaseFolder.CreateReturn<Data, Temporary>>;

  override update(
    data: BaseFolder.UpdateInput,
    operation?: BaseFolder.Database.UpdateOneDocumentOperation,
  ): Promise<this | undefined>;

  override delete(operation?: BaseFolder.Database.DeleteOneDocumentOperation): Promise<this | undefined>;

  // `Folder`s have no embedded collections, so this always returns `null`.
  static override getCollectionName(name: string): null;

  override getFlag<Scope extends BaseFolder.Flags.Scope, Key extends BaseFolder.Flags.Key<Scope>>(
    scope: Scope,
    key: Key,
  ): BaseFolder.Flags.Get<Scope, Key>;

  override setFlag<
    Scope extends BaseFolder.Flags.Scope,
    Key extends BaseFolder.Flags.Key<Scope>,
    Value extends BaseFolder.Flags.Get<Scope, Key>,
  >(scope: Scope, key: Key, value: Value): Promise<this | undefined>;

  override unsetFlag<Scope extends BaseFolder.Flags.Scope, Key extends BaseFolder.Flags.Key<Scope>>(
    scope: Scope,
    key: Key,
  ): Promise<this | undefined>;

  protected override _preCreate(
    data: BaseFolder.CreateData,
    options: BaseFolder.Database.PreCreateOptions,
    user: User.Stored,
  ): Promise<boolean | void>;

  protected override _onCreate(
    data: BaseFolder.CreateData,
    options: BaseFolder.Database.OnCreateOptions,
    userId: string,
  ): void;

  protected static override _preCreateOperation(
    documents: Folder.Implementation[],
    operation: BaseFolder.Database.PreCreateOperation,
    user: User.Stored,
  ): Promise<boolean | void>;

  protected static override _onCreateOperation(
    documents: Folder.Stored[],
    operation: BaseFolder.Database.OnCreateOperation,
    user: User.Stored,
  ): Promise<void>;

  protected override _preUpdate(
    changed: BaseFolder.UpdateData,
    options: BaseFolder.Database.PreUpdateOptions,
    user: User.Stored,
  ): Promise<boolean | void>;

  protected override _onUpdate(
    changed: BaseFolder.UpdateData,
    options: BaseFolder.Database.OnUpdateOptions,
    userId: string,
  ): void;

  protected static override _preUpdateOperation(
    documents: Folder.Stored[],
    operation: BaseFolder.Database.PreUpdateOperation,
    user: User.Stored,
  ): Promise<boolean | void>;

  protected static override _onUpdateOperation(
    documents: Folder.Stored[],
    operation: BaseFolder.Database.OnUpdateOperation,
    user: User.Stored,
  ): Promise<void>;

  protected override _preDelete(
    options: BaseFolder.Database.PreDeleteOptions,
    user: User.Stored,
  ): Promise<boolean | void>;

  protected override _onDelete(options: BaseFolder.Database.OnDeleteOptions, userId: string): void;

  protected static override _preDeleteOperation(
    documents: Folder.Stored[],
    operation: BaseFolder.Database.PreDeleteOperation,
    user: User.Stored,
  ): Promise<boolean | void>;

  protected static override _onDeleteOperation(
    documents: Folder.Stored[],
    operation: BaseFolder.Database.OnDeleteOperation,
    user: User.Stored,
  ): Promise<void>;

  /**
   * @deprecated "The `Folder._onCreateDocuments` static method is deprecated in favor of
   * {@linkcode Folder._onCreateOperation}" (since v12, until v14)
   */
  protected static override _onCreateDocuments(
    documents: Folder.Implementation[],
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    context: BaseFolder.Database.OnCreateDocumentsOperation,
  ): Promise<void>;

  /**
   * @deprecated "The `Folder._onUpdateDocuments` static method is deprecated in favor of
   * {@linkcode Folder._onUpdateOperation}" (since v12, until v14)
   */
  protected static override _onUpdateDocuments(
    documents: Folder.Stored[],
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    context: BaseFolder.Database.OnUpdateDocumentsOperation,
  ): Promise<void>;

  /**
   * @deprecated "The `Folder._onDeleteDocuments` static method is deprecated in favor of
   * {@linkcode Folder._onDeleteOperation}" (since v12, until v14)
   */
  protected static override _onDeleteDocuments(
    documents: Folder.Stored[],
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    context: BaseFolder.Database.OnDeleteDocumentsOperation,
  ): Promise<void>;

  /* DataModel overrides */

  protected static override _schema: SchemaField<BaseFolder.Schema>;

  static override get schema(): SchemaField<BaseFolder.Schema>;

  static override fromSource(
    source: BaseFolder.CreateData,
    context?: DataModel.FromSourceOptions,
  ): Folder.Implementation;

  static override fromJSON(json: string): Folder.Implementation;
}

export default BaseFolder;

declare namespace BaseFolder {
  // All types really live in the full document and are mirrored here for convenience
  export import Name = Folder.Name;
  export import ConstructionContext = Folder.ConstructionContext;
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  export import ConstructorArgs = Folder.ConstructorArgs;
  export import Hierarchy = Folder.Hierarchy;
  export import Metadata = Folder.Metadata;
  export import SubType = Folder.SubType;
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  export import ConfiguredSubType = Folder.ConfiguredSubType;
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  export import Known = Folder.Known;
  export import OfType = Folder.OfType;
  export import Parent = Folder.Parent;
  export import Descendant = Folder.Descendant;
  export import DescendantClass = Folder.DescendantClass;
  export import Embedded = Folder.Embedded;
  export import ParentCollectionName = Folder.ParentCollectionName;
  export import CollectionClass = Folder.CollectionClass;
  export import Collection = Folder.Collection;
  export import Invalid = Folder.Invalid;
  export import Source = Folder.Source;
  export import CreateData = Folder.CreateData;
  export import CreateInput = Folder.CreateInput;
  export import CreateReturn = Folder.CreateReturn;
  export import InitializedData = Folder.InitializedData;
  export import UpdateData = Folder.UpdateData;
  export import UpdateInput = Folder.UpdateInput;
  export import Schema = Folder.Schema;
  export import Database = Folder.Database;
  export import TemporaryIf = Folder.TemporaryIf;
  export import Flags = Folder.Flags;

  namespace Internal {
    // Note(LukeAbby): The point of this is to give the base class of `Folder` a name.
    // The expression `ClientDocumentMixin(BaseFolder)` is more intuitive but it has worse
    // caching, likely due to the majority of tsc's caching working off of names.
    // See https://gist.github.com/LukeAbby/18a928fdc35c5d54dc121ed5dbf412fd.
    interface ClientDocument extends foundry.documents.abstract.ClientDocumentMixin.Mix<typeof BaseFolder> {}
    const ClientDocument: ClientDocument;
  }
}
