import type { AnyObject } from "../../../utils/index.d.mts";
import type DataModel from "../abstract/data.d.mts";
import type Document from "../abstract/document.mts";
import type * as CONST from "../constants.mts";
import type { SchemaField } from "../data/fields.d.mts";

/**
 * The User Document.
 * Defines the DataSchema and common behaviors for a User which are shared between both client and server.
 */
// Note(LukeAbby): You may wonder why documents don't simply pass the `Parent` generic parameter.
// This pattern evolved from trying to avoid circular loops and even internal tsc errors.
// See: https://gist.github.com/LukeAbby/0d01b6e20ef19ebc304d7d18cef9cc21
declare abstract class BaseUser extends Document<"User", BaseUser.Schema, any> {
  /**
   * @param data    - Initial data from which to construct the User
   * @param context - Construction context options
   */
  // TODO(LukeAbby): This constructor is a symptom of a circular error.
  // constructor(data: BaseUser.CreateData, context?: BaseUser.Parent);

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
   * They are here because they're static properties but depend on the instance and so can't be
   * defined DRY-ly while also being easily overridable.
   */

  static " __fvtt_types_internal_document_name_static": "User";

  static get implementation(): User.ImplementationClass;

  override parent: User.Parent;

  static createDocuments<Temporary extends boolean | undefined>(
    data: Array<User.Implementation | User.CreateData> | undefined,
    operation?: Document.Database.CreateOperation<User.DatabaseOperation.Create<Temporary>>,
  ): Promise<Array<Document.StoredIf<User.Implementation, Temporary>>>;

  static updateDocuments(
    updates: User.UpdateData[] | undefined,
    operation?: Document.Database.UpdateOperation<User.DatabaseOperation.Update>,
  ): Promise<User.Implementation[]>;

  static deleteDocuments(
    ids: readonly string[] | undefined,
    operation?: Document.Database.DeleteOperation<User.DatabaseOperation.Delete>,
  ): Promise<User.Implementation[]>;

  static create<Temporary extends boolean | undefined>(
    data: User.CreateData | User.CreateData[],
    operation?: Document.Database.CreateOperation<User.DatabaseOperation.Create<Temporary>>,
  ): Promise<User.Implementation | undefined>;

  static get(documentId: string, options?: Document.Database.GetOperation): User.Implementation | null;

  protected _preCreate(
    data: User.CreateData,
    options: User.DatabaseOperation.PreCreateOperationInstance,
    user: User.Internal.Implementation,
  ): Promise<boolean | void>;

  protected _onCreate(data: User.CreateData, options: User.DatabaseOperation.OnCreateOperation, userId: string): void;

  protected static _preCreateOperation(
    documents: User.Implementation[],
    operation: Document.Database.PreCreateOperationStatic<User.DatabaseOperation.Create>,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static _onCreateOperation(
    documents: User.Implementation[],
    operation: User.DatabaseOperation.Create,
    user: User.Implementation,
  ): Promise<void>;

  protected _preUpdate(
    changed: User.UpdateData,
    options: User.DatabaseOperation.PreUpdateOperationInstance,
    user: User.Internal.Implementation,
  ): Promise<boolean | void>;

  protected _onUpdate(
    changed: User.UpdateData,
    options: User.DatabaseOperation.OnUpdateOperation,
    userId: string,
  ): void;

  protected static _preUpdateOperation(
    documents: User.Implementation[],
    operation: User.DatabaseOperation.Update,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static _onUpdateOperation(
    documents: User.Implementation[],
    operation: User.DatabaseOperation.Update,
    user: User.Implementation,
  ): Promise<void>;

  protected _preDelete(
    options: User.DatabaseOperation.PreDeleteOperationInstance,
    user: User.Internal.Implementation,
  ): Promise<boolean | void>;

  protected _onDelete(options: User.DatabaseOperation.OnDeleteOperation, userId: string): void;

  protected static _preDeleteOperation(
    documents: User.Implementation[],
    operation: User.DatabaseOperation.Delete,
    user: User.Implementation,
  ): Promise<boolean | void>;

  protected static _onDeleteOperation(
    documents: User.Implementation[],
    operation: User.DatabaseOperation.Delete,
    user: User.Implementation,
  ): Promise<void>;

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
  export import Metadata = User.Metadata;
  export import Parent = User.Parent;
  export import Stored = User.Stored;
  export import Source = User.Source;
  export import PersistedData = User.PersistedData;
  export import CreateData = User.CreateData;
  export import InitializedData = User.InitializedData;
  export import UpdateData = User.UpdateData;
  export import Schema = User.Schema;
  export import DatabaseOperation = User.DatabaseOperation;

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
