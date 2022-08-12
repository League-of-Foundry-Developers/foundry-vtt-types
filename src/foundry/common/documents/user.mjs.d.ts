import { DocumentMetadata } from '../abstract/document.mjs';
import { DataModel, Document } from '../abstract/module.mjs';
import type { DocumentStatsSchema } from '../data/data.mjs';
import type * as fields from '../data/fields.mjs';
import type { FlagsField } from '../data/flagsField.js';
import BaseActor from './actor.mjs';

// prettier-ignore
type HexadecimalCharacter =
  | '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8'
  | 'A' | 'B' | 'C' | 'D' | 'E' | 'F'
  | 'a' | 'b' | 'c' | 'd' | 'e' | 'f';

type RGB = `#${HexadecimalCharacter}${HexadecimalCharacter}${HexadecimalCharacter}`;

type ValidateHotbar = (bar: Record<string, string>) => boolean;
type ValidatePermissions = (perms: Record<string, boolean>) => boolean;

type BaseUserSchema = {
  /**
   * The _id which uniquely identifies this User document.
   */
  _id: fields.DocumentIdField<{}>;

  /**
   * The user's name.
   */
  name: fields.StringField<{ required: true; blank: false }>;

  /**
   * The user's role, see CONST.USER_ROLES.
   */
  role: fields.NumberField<{
    required: true;
    choices: Array<typeof CONST.USER_ROLES[keyof typeof CONST.USER_ROLES]>;
    initial: typeof CONST.USER_ROLES.PLAYER;
    readonly: true;
  }>;

  /**
   * The user's password. Available only on the Server side for security.
   */
  password: fields.StringField<{}>;

  /**
   * The user's password salt. Available only on the Server side for security.
   */
  passwordSalt: fields.StringField<{}>;

  /**
   * The user's avatar image.
   */
  avatar: fields.FilePathField<{ categories: ['IMAGE'] }>;

  // TODO, circularly references on Scene
  /**
   * A linked Actor document that is this user's impersonated character.
   */
  //   character: fields.ForeignDocumentField<typeof BaseActor, {}>;

  /**
   * A color to represent this user.
   */
  color: fields.ColorField<{ required: true; nullable: false; initial: () => RGB }>;

  /**
   * A mapping of hotbar slot number to Macro id for the user.
   */
  hotbar: fields.ObjectField<{
    required: true;
    validate: ValidateHotbar;
    validationError: 'must be a mapping of slots to macro identifiers';
  }>;

  /**
   * The user's individual permission configuration, see CONST.USER_PERMISSIONS.
   */
  permissions: fields.ObjectField<
    {
      required: true;
      validate: ValidatePermissions;
      validationError: 'must be a mapping of permission names to booleans';
    },
    SimpleMerge<
      fields.ObjectField.ExtendsOptions,
      { SourceType: Record<string, boolean>; InitializedType: Record<string, boolean> }
    >
  >;

  /**
   * An object of optional key/value flags.
   */
  flags: FlagsField<'User', {}>;

  /**
   * An object of creation and access information
   */
  _stats: typeof DocumentStatsSchema;
};

type CanCreate = (user: BaseUser, doc: BaseUser, data: DataModel.SchemaToSource<BaseUser['schema']>) => boolean;
type CanUpdate = (
  user: BaseUser,
  doc: BaseUser,
  data: DeepPartial<DataModel.SchemaToSource<BaseUser['schema']>>
) => boolean;
type CanDelete = (user: BaseUser, doc: BaseUser) => boolean;

type BaseUserMetadata = Merge<
  DocumentMetadata,
  {
    name: 'User';
    collection: 'users';
    label: 'DOCUMENT.User';
    labelPlural: 'DOCUMENT.Users';
    permissions: {
      create: CanCreate;
      update: CanUpdate;
      delete: CanDelete;
    };
  }
>;

/**
 * The base User model definition which defines common behavior of an User document between both client and server.
 */
declare class BaseUser extends Document<BaseUserSchema, null, BaseUserMetadata> {
  /* -------------------------------------------- */
  /*  Model Configuration                         */
  /* -------------------------------------------- */

  /** {@inheritdoc} */
  static override get metadata(): BaseUserMetadata;

  /* -------------------------------------------- */

  /** {@inheritdoc} */
  static override defineSchema(): BaseUserSchema;

  /* -------------------------------------------- */

  /**
   * Validate the structure of the User hotbar object
   * @param bar - The attempted hotbar data
   */
  static #validateHotbar: ValidateHotbar;

  /* -------------------------------------------- */

  /**
   * Validate the structure of the User permissions object
   * @param perms - The attempted permissions data
   */
  static #validatePermissions: ValidatePermissions;

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

  /** {@inheritdoc} */
  override getUserLevel(user: BaseUser): typeof CONST.DOCUMENT_OWNERSHIP_LEVELS['OWNER' | 'NONE'];

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

  static override get schema(): BaseUserSchema;

  /**
   * Is a user able to create an existing User?
   * @param user - The user attempting the creation.
   * @param doc  - The User document being created.
   * @param data - The supplied creation data.
   * @internal
   */
  static #canCreate: CanCreate;

  /**
   * Is a user able to update an existing User?
   * @param user - The user attempting the update.
   * @param doc  - The User document being updated.
   * @param data - The update delta.
   * @internal
   */
  static #canUpdate: CanUpdate;

  /**
   * Is a user able to delete an existing User?
   * @param user - The user attempting the deletion.
   * @param doc  - The User document being deleted.
   * @internal
   */
  static #canDelete: CanDelete;
}

export default BaseUser;
