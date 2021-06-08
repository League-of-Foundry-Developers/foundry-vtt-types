import { DocumentMetadata } from '../abstract/document.mjs';
import { Document } from '../abstract/module.mjs';
import { EntityPermission } from '../constants.mjs';
import * as data from '../data/data.mjs';

/**
 * The base User Entity which is extended by both the server and client.
 * This base User provides shared functionality which is consistent for both sides of the application.
 * Each client who connects to a Foundry Virtual Tabletop session assumes the identity of one (and only one) User.
 */
export declare class BaseUser extends Document<data.UserData, null> {
  /**
   * Define an immutable property for the User's role
   */
  readonly role: number;

  static get schema(): typeof data.UserData;

  static get metadata(): Merge<
    DocumentMetadata,
    {
      name: 'User';
      collection: 'users';
      label: 'DOCUMENT.User';
      isPrimary: true;
    }
  >;

  /**
   * Test whether the User has a GAMEMASTER or ASSISTANT role in this World?
   */
  get isGm(): boolean;

  /**
   * Test whether the User is able to perform a certain permission action.
   * The provided permission string may pertain to an explicit permission setting or a named user role.
   * Alternatively, Gamemaster users are assumed to be allowed to take all actions.
   *
   * @param action -The action to test
   * @returns Does the user have the ability to perform this action?
   */
  can(action: ValueOf<typeof CONST.USER_ROLES> | keyof typeof CONST.USER_ROLES | ValueOf<EntityPermission>): boolean;

  /** @override */
  getUserLevel(user: BaseUser): typeof CONST.ENTITY_PERMISSIONS.OWNER | typeof CONST.ENTITY_PERMISSIONS.NONE;

  /**
   * Test whether the User has at least a specific permission
   * @param permission -    The permission name from USER_PERMISSIONS to test
   * @returns Does the user have at least this permission
   */
  hasPermission(permission: ValueOf<EntityPermission>): boolean;

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
