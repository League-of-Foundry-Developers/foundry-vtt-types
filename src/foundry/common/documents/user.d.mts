import type { AnyObject, InexactPartial, Merge } from "../../../types/utils.mts";
import type Document from "../abstract/document.mts";
import type * as CONST from "../constants.mts";
import type * as fields from "../data/fields.d.mts";
import type BaseActor from "./actor.mts";

/**
 * The Document definition for a User.
 * Defines the DataSchema and common behaviors for a User which are shared between both client and server.
 */
// Note(LukeAbby): You may wonder why documents don't simply pass the `Parent` generic parameter.
// This pattern evolved from trying to avoid circular loops and even internal tsc errors.
// See: https://gist.github.com/LukeAbby/0d01b6e20ef19ebc304d7d18cef9cc21
declare class BaseUser extends Document<BaseUser.Schema, BaseUser.Metadata, any> {
  /**
   * @param data    - Initial data from which to construct the User
   * @param context - Construction context options
   */
  // TODO(LukeAbby): This constructor is a symptom of a circular error.
  // constructor(data: BaseUser.ConstructorData, context?: BaseUser.Parent);

  override parent: BaseUser.Parent;

  static override metadata: Readonly<BaseUser.Metadata>;

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

  override getUserLevel(user: BaseUser): CONST.DOCUMENT_OWNERSHIP_LEVELS | null;

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
  static #canCreate(user: BaseUser, doc: BaseUser, data?: BaseUser.ConstructorData): boolean;

  /**
   * Is a user able to update an existing User?
   * @param user    - The user attempting the update.
   * @param doc     - The User document being updated.
   * @param changes - Proposed changes.
   * @internal
   */
  static #canUpdate(user: BaseUser, doc: BaseUser, changes: BaseUser.ConstructorData): boolean;

  /**
   * Is a user able to delete an existing User?
   * Only Assistants and Gamemasters can delete users, and only if the target user has a lesser or equal role.
   * @param user - The user attempting the deletion.
   * @param doc  - The User document being deleted.
   * @internal
   */
  static #canDelete(user: BaseUser, doc: BaseUser): boolean;
}

export default BaseUser;

declare namespace BaseUser {
  type Parent = null;

  type Metadata = Merge<
    Document.Metadata.Default,
    {
      name: "User";
      collection: "users";
      label: string;
      labelPlural: string;
      permissions: {
        create: (user: BaseUser, doc: Document.Any, data?: UpdateData) => boolean;
        update: (user: BaseUser, doc: Document.Any, changes: UpdateData) => boolean;
        delete: (user: BaseUser, doc: Document.Any) => boolean;
      };
      schemaVersion: string;
    }
  >;

  type Hotbar = Record<number | `${number}`, string>;
  type Permissions = Record<keyof typeof CONST.USER_PERMISSIONS, boolean>;

  type SchemaField = fields.SchemaField<Schema>;
  type ConstructorData = fields.SchemaField.InnerConstructorType<Schema>;
  type UpdateData = fields.SchemaField.InnerAssignmentType<Schema>;
  type Properties = fields.SchemaField.InnerInitializedType<Schema>;
  type Source = fields.SchemaField.InnerPersistedType<Schema>;

  interface Schema extends DataSchema {
    /**
     * The _id which uniquely identifies this User document.
     * @defaultValue `null`
     */
    _id: fields.DocumentIdField;

    /**
     * The user's name.
     */
    name: fields.StringField<{ required: true; blank: false; textSearch: true }, string>;

    /**
     * The user's role, see CONST.USER_ROLES.
     * @defaultValue `CONST.USER_ROLES.PLAYER`
     */
    role: fields.NumberField<
      {
        required: true;
        choices: CONST.USER_ROLES[];
        initial: typeof CONST.USER_ROLES.PLAYER;
        readonly: true;
      },
      CONST.USER_ROLES | null | undefined,
      CONST.USER_ROLES,
      CONST.USER_ROLES
    >;

    /**
     * The user's password. Available only on the Server side for security.
     * @defaultValue `""`
     */
    password: fields.StringField<{ required: true; blank: true }>;

    /**
     * The user's password salt. Available only on the Server side for security.
     * @defaultValue `""`
     */
    passwordSalt: fields.StringField;

    /**
     * The user's avatar image.
     * @defaultValue `null`
     */
    avatar: fields.FilePathField<{ categories: "IMAGE"[] }>;

    /**
     * A linked Actor document that is this user's impersonated character.
     * @defaultValue `null`
     */
    character: fields.ForeignDocumentField<typeof BaseActor>;

    /**
     * A color to represent this user.
     * @defaultValue a randomly chosen color string
     */
    color: fields.ColorField<{ required: true; nullable: false; initial: () => string }>;

    /**
     *
     */
    pronouns: fields.StringField<{ required: true }>;

    /**
     * A mapping of hotbar slot number to Macro id for the user.
     * @defaultValue `{}`
     */
    hotbar: fields.ObjectField<
      {
        required: true;
        validate: (bar: AnyObject) => boolean;
        validationError: "must be a mapping of slots to macro identifiers";
      },
      Hotbar | null | undefined,
      Hotbar,
      Hotbar
    >;

    /**
     * The user's individual permission configuration, see CONST.USER_PERMISSIONS.
     * @defaultValue `{}`
     */
    permissions: fields.ObjectField<
      {
        required: true;
        validate: (perms: AnyObject) => boolean;
        validationError: "must be a mapping of permission names to booleans";
      },
      InexactPartial<Permissions> | null | undefined,
      InexactPartial<Permissions>,
      InexactPartial<Permissions>
    >;

    /**
     * An object of optional key/value flags.
     * @defaultValue `{}`
     */
    flags: fields.ObjectField.FlagsField<"User">;

    /**
     * An object of creation and access information
     * @defaultValue see {@link fields.DocumentStatsField}
     */
    _stats: fields.DocumentStatsField;
  }
}
