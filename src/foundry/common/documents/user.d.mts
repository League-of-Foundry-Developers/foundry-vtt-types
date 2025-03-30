import type { AnyMutableObject, AnyObject } from "fvtt-types/utils";
import type DataModel from "../abstract/data.d.mts";
import type Document from "../abstract/document.mts";
import type * as CONST from "../constants.mts";
import type { DataField, SchemaField } from "../data/fields.d.mts";
import type { LogCompatibilityWarningOptions } from "../utils/logging.d.mts";

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
   * @deprecated Constructing `BaseUser` directly is not advised. The base document classes exist in
   * order to use documents on both the client (i.e. where all your code runs) and behind the scenes
   * on the server to manage document validation and storage.
   *
   * You should use {@link User.implementation | `new User.implementation(...)`} instead which will give you
   * a system specific implementation of `User`.
   */
  constructor(...args: User.ConstructorArgs);

  static override metadata: User.Metadata;

  static override defineSchema(): BaseUser.Schema;

  /**
   * Validate the structure of the User hotbar object
   * @param bar - The attempted hotbar data
   * @internal
   */
  static #validateHotbar(bar: AnyObject): boolean;

  /**
   * Validate the structure of the User permissions object
   * @param perms - The attempted permissions data
   * @internal
   */
  static #validatePermissions(perms: AnyObject): boolean;

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
   * Alternatively, Gamemaster users are assumed to be allowed to take all actions.
   *
   * @param action - The action to test
   * @returns Does the user have the ability to perform this action?
   */
  can(action: keyof typeof CONST.USER_PERMISSIONS | CONST.USER_ROLE_NAMES | CONST.USER_ROLES): boolean;

  override getUserLevel(user?: User.Internal.Implementation): CONST.DOCUMENT_OWNERSHIP_LEVELS | null;

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
  hasRole(
    role: CONST.USER_ROLE_NAMES | CONST.USER_ROLES,
    {
      exact,
    }?: {
      /**
       * Require the role match to be exact
       * @defaultValue `false`
       */
      exact?: boolean;
    },
  ): boolean;

  /**
   * Is a user able to create an existing User?
   * @param user - The user attempting the creation.
   * @param doc  - The User document being created.
   * @param data - The supplied creation data.
   * @internal
   */
  static #canCreate(user: User.Implementation, doc: BaseUser, data?: BaseUser.CreateData): boolean;

  /**
   * Is a user able to update an existing User?
   * @param user    - The user attempting the update.
   * @param doc     - The User document being updated.
   * @param changes - Proposed changes.
   * @internal
   */
  static #canUpdate(user: User.Implementation, doc: BaseUser, changes: BaseUser.CreateData): boolean;

  /**
   * Is a user able to delete an existing User?
   * Only Assistants and Gamemasters can delete users, and only if the target user has a lesser or equal role.
   * @param user - The user attempting the deletion.
   * @param doc  - The User document being deleted.
   * @internal
   */
  static #canDelete(user: User.Implementation, doc: BaseUser): boolean;

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

  static " fvtt_types_internal_document_name_static": "User";

  // Same as Document for now
  protected static override _initializationOrder(): Generator<[string, DataField.Any]>;

  readonly parentCollection: User.ParentCollectionName | null;

  readonly pack: null;

  static get implementation(): User.ImplementationClass;

  static get baseDocument(): typeof BaseUser;

  static get collectionName(): User.ParentCollectionName;

  static get documentName(): User.Name;

  static get TYPES(): CONST.BASE_DOCUMENT_TYPE[];

  static get hasTypeData(): undefined;

  static get hierarchy(): User.Hierarchy;

  override parent: User.Parent;

  static createDocuments<Temporary extends boolean | undefined = false>(
    data: Array<User.Implementation | User.CreateData> | undefined,
    operation?: Document.Database.CreateOperation<User.Database.Create<Temporary>>,
  ): Promise<Array<Document.TemporaryIf<User.Implementation, Temporary>>>;

  static updateDocuments(
    updates: User.UpdateData[] | undefined,
    operation?: Document.Database.UpdateDocumentsOperation<User.Database.Update>,
  ): Promise<User.Implementation[]>;

  static deleteDocuments(
    ids: readonly string[] | undefined,
    operation?: Document.Database.DeleteDocumentsOperation<User.Database.Delete>,
  ): Promise<User.Implementation[]>;

  static override create<Temporary extends boolean | undefined = false>(
    data: User.CreateData | User.CreateData[],
    operation?: User.Database.CreateOperation<Temporary>,
  ): Promise<Document.TemporaryIf<User.Implementation, Temporary> | undefined>;

  override update(
    data: User.UpdateData | undefined,
    operation?: User.Database.UpdateOperation,
  ): Promise<this | undefined>;

  override delete(operation?: User.Database.DeleteOperation): Promise<this | undefined>;

  static get(documentId: string, options?: User.Database.GetOptions): User.Implementation | null;

  static override getCollectionName<CollectionName extends User.EmbeddedName>(
    name: CollectionName,
  ): User.CollectionNameOf<CollectionName> | null;

  // Same as Document for now
  override traverseEmbeddedDocuments(_parentPath?: string): Generator<[string, Document.AnyChild<this>]>;

  override getFlag<Scope extends User.Flags.Scope, Key extends User.Flags.Key<Scope>>(
    scope: Scope,
    key: Key,
  ): Document.GetFlag<User.Name, Scope, Key>;

  override setFlag<
    Scope extends User.Flags.Scope,
    Key extends User.Flags.Key<Scope>,
    Value extends Document.GetFlag<User.Name, Scope, Key>,
  >(scope: Scope, key: Key, value: Value): Promise<this>;

  override unsetFlag<Scope extends User.Flags.Scope, Key extends User.Flags.Key<Scope>>(
    scope: Scope,
    key: Key,
  ): Promise<this>;

  protected _preCreate(
    data: User.CreateData,
    options: User.Database.PreCreateOptions,
    user: User.Internal.Implementation,
  ): Promise<boolean | void>;

  protected _onCreate(data: User.CreateData, options: User.Database.OnCreateOperation, userId: string): void;

  protected static _preCreateOperation(
    documents: User.Implementation[],
    operation: Document.Database.PreCreateOperationStatic<User.Database.Create>,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static _onCreateOperation(
    documents: User.Implementation[],
    operation: User.Database.Create,
    user: User.Implementation,
  ): Promise<void>;

  protected _preUpdate(
    changed: User.UpdateData,
    options: User.Database.PreUpdateOptions,
    user: User.Internal.Implementation,
  ): Promise<boolean | void>;

  protected _onUpdate(changed: User.UpdateData, options: User.Database.OnUpdateOperation, userId: string): void;

  protected static _preUpdateOperation(
    documents: User.Implementation[],
    operation: User.Database.Update,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static _onUpdateOperation(
    documents: User.Implementation[],
    operation: User.Database.Update,
    user: User.Implementation,
  ): Promise<void>;

  protected _preDelete(
    options: User.Database.PreDeleteOptions,
    user: User.Internal.Implementation,
  ): Promise<boolean | void>;

  protected _onDelete(options: User.Database.OnDeleteOperation, userId: string): void;

  protected static _preDeleteOperation(
    documents: User.Implementation[],
    operation: User.Database.Delete,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static _onDeleteOperation(
    documents: User.Implementation[],
    operation: User.Database.Delete,
    user: User.Implementation,
  ): Promise<void>;

  static get hasSystemData(): undefined;

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

  protected static _addDataFieldMigration(
    data: AnyMutableObject,
    oldKey: string,
    newKey: string,
    apply?: ((data: AnyMutableObject) => unknown) | null,
  ): boolean;

  // options: not null (destructured where forwarded)
  protected static _logDataFieldMigration(
    oldKey: string,
    newKey: string,
    options?: LogCompatibilityWarningOptions,
  ): void;

  protected static _onCreateDocuments(
    documents: User.Implementation[],
    context: Document.ModificationContext<User.Parent>,
  ): Promise<void>;

  protected static _onUpdateDocuments(
    documents: User.Implementation[],
    context: Document.ModificationContext<User.Parent>,
  ): Promise<void>;

  protected static _onDeleteDocuments(
    documents: User.Implementation[],
    context: Document.ModificationContext<User.Parent>,
  ): Promise<void>;

  /* DataModel overrides */

  protected static _schema: SchemaField<User.Schema>;

  static get schema(): SchemaField<User.Schema>;

  static validateJoint(data: User.Source): void;

  static override fromSource(
    source: User.UpdateData,
    { strict, ...context }?: DataModel.FromSourceOptions,
  ): DataModel<User.Schema, DataModel.Any | null>;

  static override fromJSON(json: string): DataModel<User.Schema, DataModel.Any | null>;
}

export default BaseUser;

declare namespace BaseUser {
  export import Name = User.Name;
  export import ConstructorArgs = User.ConstructorArgs;
  export import Hierarchy = User.Hierarchy;
  export import Metadata = User.Metadata;
  export import Parent = User.Parent;
  export import Pack = User.Pack;
  export import Embedded = User.Embedded;
  export import EmbeddedName = User.EmbeddedName;
  export import EmbeddedCollectionName = User.EmbeddedCollectionName;
  export import ParentCollectionName = User.ParentCollectionName;
  export import Stored = User.Stored;
  export import Source = User.Source;
  export import PersistedData = User.PersistedData;
  export import CreateData = User.CreateData;
  export import InitializedData = User.InitializedData;
  export import UpdateData = User.UpdateData;
  export import Schema = User.Schema;
  export import DatabaseOperation = User.Database;
  export import Flags = User.Flags;

  /**
   * @deprecated This type is used by Foundry too vaguely.
   * In one context the most correct type is after initialization whereas in another one it should be
   * before but Foundry uses it interchangeably.
   */
  type Properties = SchemaField.InitializedData<Schema>;

  /**
   * @deprecated {@link foundry.data.fields.SchemaField | `SchemaField<BaseUser.Schema>`}
   */
  type SchemaField = foundry.data.fields.SchemaField<Schema>;

  /**
   * @deprecated {@link BaseUser.CreateData | `BaseUser.CreateData`}
   */
  type ConstructorData = BaseUser.CreateData;
}
