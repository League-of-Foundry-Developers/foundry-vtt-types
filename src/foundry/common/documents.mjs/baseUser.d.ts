import { DocumentMetadata } from "../abstract/document.mjs";
import { Document } from "../abstract/module.mjs";
import * as data from "../data/data.mjs";
import type { UserDataConstructorData, UserDataSource } from "../data/data.mjs/userData";

type UserMetadata = Merge<
  DocumentMetadata,
  {
    name: "User";
    collection: "users";
    label: "DOCUMENT.User";
    labelPlural: "DOCUMENT.Users";
    isPrimary: true;
    permissions: {
      create: (user: BaseUser, doc: BaseUser, data: UserDataSource) => boolean;
      update: (user: BaseUser, doc: BaseUser, data: DeepPartial<UserDataConstructorData>) => boolean;
      delete: (user: BaseUser, doc: BaseUser) => boolean;
    };
  }
>;

/**
 * The base User model definition which defines common behavior of an User document between both client and server.
 */
export declare class BaseUser extends Document<data.UserData, null, UserMetadata> {
  constructor(...args: ConstructorParameters<ConstructorOf<Document<data.UserData, null>>>);

  /**
   * Define an immutable property for the User's role
   */
  readonly role: ValueOf<typeof CONST.USER_ROLES>;

  static override get schema(): typeof data.UserData;

  static override get metadata(): UserMetadata;

  /**
   * Is a user able to create an existing User?
   * @param user - The user attempting the creation.
   * @param doc  - The User document being created.
   * @param data - The supplied creation data.
   * @internal
   */
  protected static _canCreate(user: BaseUser, doc: BaseUser, data: UserDataSource): boolean;

  /**
   * Is a user able to update an existing User?
   * @param user - The user attempting the update.
   * @param doc  - The User document being updated.
   * @param data - The update delta.
   * @internal
   */
  protected static _canUpdate(user: BaseUser, doc: BaseUser, data: DeepPartial<UserDataConstructorData>): boolean;

  /**
   * Is a user able to delete an existing User?
   * @param user - The user attempting the deletion.
   * @param doc  - The User document being deleted.
   * @internal
   */
  protected static _canDelete(user: BaseUser, doc: BaseUser): boolean;

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
  can(
    action: ValueOf<typeof CONST.USER_ROLES> | keyof typeof CONST.USER_ROLES | keyof typeof CONST.USER_PERMISSIONS
  ): boolean;

  override getUserLevel(
    user: BaseUser
  ): typeof CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER | typeof CONST.DOCUMENT_OWNERSHIP_LEVELS.NONE;

  /**
   * Test whether the User has at least a specific permission
   * @param permission - The permission name from USER_PERMISSIONS to test
   * @returns Does the user have at least this permission
   */
  hasPermission(permission: keyof typeof CONST.USER_PERMISSIONS): boolean;

  /**
   * Test whether the User has at least the permission level of a certain role
   * @param role  - The role name from USER_ROLES to test
   * @param exact - Require the role match to be exact
   *                (default: `false`)
   * @returns Does the user have at this role level (or greater)?
   */
  hasRole(
    role: ValueOf<typeof CONST.USER_ROLES> | keyof typeof CONST.USER_ROLES,
    { exact }?: { exact?: boolean }
  ): boolean;
}
