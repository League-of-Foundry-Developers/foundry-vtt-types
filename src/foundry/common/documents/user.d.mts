import type { DataModel, Document } from "#common/abstract/_module.d.mts";
import type { DataField, SchemaField } from "../data/fields.d.mts";

/**
 * The User Document.
 * Defines the DataSchema and common behaviors for a User which are shared between both client and server.
 */
// Note(LukeAbby): You may wonder why documents don't simply pass the `Parent` generic parameter.
// This pattern evolved from trying to avoid circular loops and even internal tsc errors.
// See: https://gist.github.com/LukeAbby/0d01b6e20ef19ebc304d7d18cef9cc21
declare abstract class BaseUser extends Document<"User", BaseUser.Schema, any> {
  /**
   * @param data    - Initial data from which to construct the `BaseUser`
   * @param context - Construction context options
   *
   * @remarks Constructing `BaseUser` directly is not advised. The base document classes exist in
   * order to use documents on both the client (i.e. where all your code runs) and behind the scenes
   * on the server to manage document validation and storage.
   *
   * You should use {@linkcode User.implementation | new User.implementation(...)} instead which will give you
   * a system specific implementation of `User`.
   */
  constructor(data: BaseUser.CreateData, context?: BaseUser.ConstructionContext);

  /**
   * @defaultValue
   * ```js
   * mergeObject(super.metadata, {
   *   name: "User",
   *   collection: "users",
   *   label: "DOCUMENT.User",
   *   labelPlural: "DOCUMENT.Users",
   *   permissions: {
   *     create: this.#canCreate,
   *     update: this.#canUpdate,
   *     delete: this.#canDelete
   *   },
   *   schemaVersion: "13.341",
   * });
   * ```
   */
  static override metadata: BaseUser.Metadata;

  /** @defaultValue `["DOCUMENT", "USER"]` */
  static override LOCALIZATION_PREFIXES: string[];

  static override defineSchema(): BaseUser.Schema;

  /**
   * A convenience test for whether this User has the NONE role.
   */
  get isBanned(): boolean;

  /**
   * Test whether the User has a GAMEMASTER or ASSISTANT role in this World?
   */
  get isGM(): boolean;

  /**
   * Test whether the User is able to perform a certain permission action.
   * The provided permission string may pertain to an explicit permission setting or a named user role.
   *
   * @param action - The action to test
   * @returns Does the user have the ability to perform this action?
   */
  can(action: BaseUser.ActionPermission): boolean;

  /** @remarks Returns `.OWNER` for the User in question, `.NONE` for everyone else */
  override getUserLevel(user: User.Internal.Implementation): CONST.DOCUMENT_OWNERSHIP_LEVELS;

  /**
   * Test whether the User has at least a specific permission
   * @param permission - The permission name from USER_PERMISSIONS to test
   * @returns Does the user have at least this permission
   */
  hasPermission(permission: keyof typeof CONST.USER_PERMISSIONS): boolean;

  /**
   * Test whether the User has at least the permission level of a certain role
   * @param role - The role name from USER_ROLES to test
   * @returns Does the user have at this role level (or greater)?
   */
  hasRole(role: CONST.USER_ROLE_NAMES | CONST.USER_ROLES, options?: BaseUser.HasRoleOptions): boolean;

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

  override readonly parentCollection: BaseUser.ParentCollectionName | null;

  override get pack(): null;

  static override get implementation(): User.ImplementationClass;

  static override get baseDocument(): typeof BaseUser;

  static override get collectionName(): BaseUser.ParentCollectionName;

  static override get documentName(): BaseUser.Name;

  static override get TYPES(): CONST.BASE_DOCUMENT_TYPE[];

  static override get hasTypeData(): false;

  static override get hierarchy(): BaseUser.Hierarchy;

  override parent: BaseUser.Parent;

  override " fvtt_types_internal_document_parent": BaseUser.Parent;

  static override createDocuments<Temporary extends boolean | undefined = undefined>(
    data: Array<User.Implementation | BaseUser.CreateData> | undefined,
    operation?: Document.Database.CreateOperation<BaseUser.Database.Create<Temporary>>,
  ): Promise<Array<BaseUser.TemporaryIf<Temporary>>>;

  static override updateDocuments(
    updates: BaseUser.UpdateData[] | undefined,
    operation?: Document.Database.UpdateDocumentsOperation<BaseUser.Database.Update>,
  ): Promise<User.Implementation[]>;

  static override deleteDocuments(
    ids: readonly string[] | undefined,
    operation?: Document.Database.DeleteDocumentsOperation<BaseUser.Database.Delete>,
  ): Promise<User.Implementation[]>;

  static override create<Temporary extends boolean | undefined = undefined>(
    data: BaseUser.CreateData | BaseUser.CreateData[],
    operation?: BaseUser.Database.CreateOperation<Temporary>,
  ): Promise<BaseUser.TemporaryIf<Temporary> | undefined>;

  override update(
    data: BaseUser.UpdateData | undefined,
    operation?: BaseUser.Database.UpdateOperation,
  ): Promise<this | undefined>;

  override delete(operation?: BaseUser.Database.DeleteOperation): Promise<this | undefined>;

  static override get(documentId: string, options?: BaseUser.Database.GetOptions): User.Implementation | null;

  static override getCollectionName(name: string): null;

  // Same as Document for now
  override traverseEmbeddedDocuments(
    _parentPath?: string,
  ): Generator<[string, Document.AnyChild<this>], void, undefined>;

  override getFlag<Scope extends BaseUser.Flags.Scope, Key extends BaseUser.Flags.Key<Scope>>(
    scope: Scope,
    key: Key,
  ): BaseUser.Flags.Get<Scope, Key>;

  override setFlag<
    Scope extends BaseUser.Flags.Scope,
    Key extends BaseUser.Flags.Key<Scope>,
    Value extends BaseUser.Flags.Get<Scope, Key>,
  >(scope: Scope, key: Key, value: Value): Promise<this>;

  override unsetFlag<Scope extends BaseUser.Flags.Scope, Key extends BaseUser.Flags.Key<Scope>>(
    scope: Scope,
    key: Key,
  ): Promise<this>;

  protected override _preCreate(
    data: BaseUser.CreateData,
    options: BaseUser.Database.PreCreateOptions,
    user: User.Internal.Implementation,
  ): Promise<boolean | void>;

  protected override _onCreate(
    data: BaseUser.CreateData,
    options: BaseUser.Database.OnCreateOperation,
    userId: string,
  ): void;

  protected static override _preCreateOperation(
    documents: User.Implementation[],
    operation: Document.Database.PreCreateOperationStatic<BaseUser.Database.Create>,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static override _onCreateOperation(
    documents: User.Implementation[],
    operation: BaseUser.Database.Create,
    user: User.Implementation,
  ): Promise<void>;

  protected override _preUpdate(
    changed: BaseUser.UpdateData,
    options: BaseUser.Database.PreUpdateOptions,
    user: User.Internal.Implementation,
  ): Promise<boolean | void>;

  protected override _onUpdate(
    changed: BaseUser.UpdateData,
    options: BaseUser.Database.OnUpdateOperation,
    userId: string,
  ): void;

  protected static override _preUpdateOperation(
    documents: User.Implementation[],
    operation: BaseUser.Database.Update,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static override _onUpdateOperation(
    documents: User.Implementation[],
    operation: BaseUser.Database.Update,
    user: User.Implementation,
  ): Promise<void>;

  protected override _preDelete(
    options: BaseUser.Database.PreDeleteOptions,
    user: User.Internal.Implementation,
  ): Promise<boolean | void>;

  protected override _onDelete(options: BaseUser.Database.OnDeleteOperation, userId: string): void;

  protected static override _preDeleteOperation(
    documents: User.Implementation[],
    operation: BaseUser.Database.Delete,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static override _onDeleteOperation(
    documents: User.Implementation[],
    operation: BaseUser.Database.Delete,
    user: User.Implementation,
  ): Promise<void>;

  /**
   * @deprecated since v12, will be removed in v14
   * @remarks "The `Document._onCreateDocuments` static method is deprecated in favor of {@linkcode Document._onCreateOperation | Document._onCreateOperation}"
   */
  protected static override _onCreateDocuments(
    documents: User.Implementation[],
    context: Document.ModificationContext<BaseUser.Parent>,
  ): Promise<void>;

  /**
   * @deprecated since v12, will be removed in v14
   * @remarks "The `Document._onUpdateDocuments` static method is deprecated in favor of {@linkcode Document._onUpdateOperation | Document._onUpdateOperation}"
   */
  protected static override _onUpdateDocuments(
    documents: User.Implementation[],
    context: Document.ModificationContext<BaseUser.Parent>,
  ): Promise<void>;

  /**
   * @deprecated since v12, will be removed in v14
   * @remarks "The `Document._onDeleteDocuments` static method is deprecated in favor of {@linkcode Document._onDeleteOperation | Document._onDeleteOperation}"
   */
  protected static override _onDeleteDocuments(
    documents: User.Implementation[],
    context: Document.ModificationContext<BaseUser.Parent>,
  ): Promise<void>;

  /* DataModel overrides */

  protected static override _schema: SchemaField<BaseUser.Schema>;

  static override get schema(): SchemaField<BaseUser.Schema>;

  static override validateJoint(data: BaseUser.Source): void;

  static override fromSource(source: BaseUser.CreateData, context?: DataModel.FromSourceOptions): User.Implementation;

  static override fromJSON(json: string): User.Implementation;

  static #BaseUser: true;
}

export default BaseUser;

declare namespace BaseUser {
  // All types really live in the full document and are mirrored here for convenience
  export import Name = User.Name;
  export import ConstructionContext = User.ConstructionContext;
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  export import ConstructorArgs = User.ConstructorArgs;
  export import Hierarchy = User.Hierarchy;
  export import Metadata = User.Metadata;
  export import Parent = User.Parent;
  export import Descendant = User.Descendant;
  export import DescendantClass = User.DescendantClass;
  export import Embedded = User.Embedded;
  export import ParentCollectionName = User.ParentCollectionName;
  export import CollectionClass = User.CollectionClass;
  export import Collection = User.Collection;
  export import Invalid = User.Invalid;
  export import Stored = User.Stored;
  export import Source = User.Source;
  export import CreateData = User.CreateData;
  export import CreateInput = User.CreateInput;
  export import CreateReturn = User.CreateReturn;
  export import InitializedData = User.InitializedData;
  export import UpdateData = User.UpdateData;
  export import UpdateInput = User.UpdateInput;
  export import Schema = User.Schema;
  export import Database = User.Database;
  export import TemporaryIf = User.TemporaryIf;
  export import Flags = User.Flags;
  export import PingData = User.PingData;
  export import ActivityData = User.ActivityData;
  export import HasRoleOptions = User.HasRoleOptions;
  export import ActionPermission = User.ActionPermission;

  namespace Internal {
    // Note(LukeAbby): The point of this is to give the base class of `User` a name.
    // The expression `ClientDocumentMixin(BaseUser)` is more intuitive but it has worse
    // caching, likely due to the majority of tsc's caching working off of names.
    // See https://gist.github.com/LukeAbby/18a928fdc35c5d54dc121ed5dbf412fd.
    interface ClientDocument extends foundry.documents.abstract.ClientDocumentMixin.Mix<typeof BaseUser> {}
    const ClientDocument: ClientDocument;
  }
}
