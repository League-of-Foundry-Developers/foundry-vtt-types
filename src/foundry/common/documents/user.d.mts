import type { MaybeArray } from "#utils";
import type { DataModel, Document } from "#common/abstract/_module.d.mts";
import type { SchemaField } from "#common/data/fields.d.mts";

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

  override getUserLevel(user?: User.Implementation): CONST.DOCUMENT_OWNERSHIP_LEVELS;

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

  override readonly parentCollection: BaseUser.ParentCollectionName | null;

  static override get implementation(): User.ImplementationClass;

  static override get baseDocument(): typeof BaseUser;

  static override get collectionName(): BaseUser.ParentCollectionName;

  static override get documentName(): BaseUser.Name;

  static override get TYPES(): CONST.BASE_DOCUMENT_TYPE[];

  static override get hasTypeData(): false;

  static override readonly hierarchy: BaseUser.Hierarchy;

  override parent: BaseUser.Parent;

  override " fvtt_types_internal_document_parent": BaseUser.Parent;

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
    data?: Document.CanUserModifyData<"User", Action>,
  ): boolean;

  static override createDocuments<Temporary extends boolean | undefined = undefined>(
    data: BaseUser.CreateInput[],
    operation?: BaseUser.Database.CreateDocumentsOperation<Temporary>,
  ): Promise<Array<BaseUser.TemporaryIf<Temporary>>>;

  static override updateDocuments(
    updates: BaseUser.UpdateInput[],
    operation?: BaseUser.Database.UpdateManyDocumentsOperation,
  ): Promise<Array<User.Stored>>;

  static override deleteDocuments(
    ids: readonly string[],
    operation?: BaseUser.Database.DeleteManyDocumentsOperation,
  ): Promise<Array<User.Stored>>;

  static override create<
    Data extends MaybeArray<BaseUser.CreateInput>,
    Temporary extends boolean | undefined = undefined,
  >(
    data: Data,
    operation?: BaseUser.Database.CreateDocumentsOperation<Temporary>,
  ): Promise<BaseUser.CreateReturn<Data, Temporary>>;

  override update(
    data: BaseUser.UpdateInput,
    operation?: BaseUser.Database.UpdateOneDocumentOperation,
  ): Promise<this | undefined>;

  override delete(operation?: BaseUser.Database.DeleteOneDocumentOperation): Promise<this | undefined>;

  // `User`s cannot exist in compendia, so this never returns an index entry.
  static override get(documentId: string, operation?: BaseUser.Database.GetDocumentsOperation): User.Stored | null;

  // `User`s have no embedded collections, so this always returns `null`.
  static override getCollectionName(name: string): null;

  override getFlag<Scope extends BaseUser.Flags.Scope, Key extends BaseUser.Flags.Key<Scope>>(
    scope: Scope,
    key: Key,
  ): BaseUser.Flags.Get<Scope, Key>;

  override setFlag<
    Scope extends BaseUser.Flags.Scope,
    Key extends BaseUser.Flags.Key<Scope>,
    Value extends BaseUser.Flags.Get<Scope, Key>,
  >(scope: Scope, key: Key, value: Value): Promise<this | undefined>;

  override unsetFlag<Scope extends BaseUser.Flags.Scope, Key extends BaseUser.Flags.Key<Scope>>(
    scope: Scope,
    key: Key,
  ): Promise<this | undefined>;

  protected override _preCreate(
    data: BaseUser.CreateData,
    options: BaseUser.Database.PreCreateOptions,
    user: User.Stored,
  ): Promise<boolean | void>;

  protected override _onCreate(
    data: BaseUser.CreateData,
    options: BaseUser.Database.OnCreateOptions,
    userId: string,
  ): void;

  protected static override _preCreateOperation(
    documents: User.Implementation[],
    operation: BaseUser.Database.PreCreateOperation,
    user: User.Stored,
  ): Promise<boolean | void>;

  protected static override _onCreateOperation(
    documents: User.Stored[],
    operation: BaseUser.Database.OnCreateOperation,
    user: User.Stored,
  ): Promise<void>;

  protected override _preUpdate(
    changed: BaseUser.UpdateData,
    options: BaseUser.Database.PreUpdateOptions,
    user: User.Stored,
  ): Promise<boolean | void>;

  protected override _onUpdate(
    changed: BaseUser.UpdateData,
    options: BaseUser.Database.OnUpdateOptions,
    userId: string,
  ): void;

  protected static override _preUpdateOperation(
    documents: User.Stored[],
    operation: BaseUser.Database.PreUpdateOperation,
    user: User.Stored,
  ): Promise<boolean | void>;

  protected static override _onUpdateOperation(
    documents: User.Stored[],
    operation: BaseUser.Database.OnUpdateOperation,
    user: User.Stored,
  ): Promise<void>;

  protected override _preDelete(
    options: BaseUser.Database.PreDeleteOptions,
    user: User.Stored,
  ): Promise<boolean | void>;

  protected override _onDelete(options: BaseUser.Database.OnDeleteOptions, userId: string): void;

  protected static override _preDeleteOperation(
    documents: User.Stored[],
    operation: BaseUser.Database.PreDeleteOperation,
    user: User.Stored,
  ): Promise<boolean | void>;

  protected static override _onDeleteOperation(
    documents: User.Stored[],
    operation: BaseUser.Database.OnDeleteOperation,
    user: User.Stored,
  ): Promise<void>;

  /**
   * @deprecated "The `User._onCreateDocuments` static method is deprecated in favor of
   * {@linkcode User._onCreateOperation}" (since v12, until v14)
   */
  protected static override _onCreateDocuments(
    documents: User.Implementation[],
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    context: BaseUser.Database.OnCreateDocumentsOperation,
  ): Promise<void>;

  /**
   * @deprecated "The `User._onUpdateDocuments` static method is deprecated in favor of
   * {@linkcode User._onUpdateOperation}" (since v12, until v14)
   */
  protected static override _onUpdateDocuments(
    documents: User.Stored[],
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    context: BaseUser.Database.OnUpdateDocumentsOperation,
  ): Promise<void>;

  /**
   * @deprecated "The `User._onDeleteDocuments` static method is deprecated in favor of
   * {@linkcode User._onDeleteOperation}" (since v12, until v14)
   */
  protected static override _onDeleteDocuments(
    documents: User.Stored[],
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    context: BaseUser.Database.OnDeleteDocumentsOperation,
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
