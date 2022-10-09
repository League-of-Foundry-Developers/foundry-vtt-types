import {
  ConfiguredDocumentClass,
  ConfiguredFlags,
  FieldReturnType,
  PropertiesToSource
} from "../../../../types/helperTypes";
import DocumentData from "../../abstract/data.mjs";
import * as documents from "../../documents.mjs";
import * as fields from "../fields.mjs";

interface UserDataSchema extends DocumentSchema {
  _id: fields.DocumentId;
  avatar: fields.ImageField;
  character: fields.ForeignDocumentField<{ type: typeof documents.BaseActor; required: false }>;
  color: FieldReturnType<fields.ColorField, { required: true }>;
  hotbar: DocumentField<Record<number | `${number}`, string>> & {
    required: true;
    default: Record<number | `${number}`, never>;
    validate: typeof _validateHotbar;
    validationError: "Invalid User hotbar data structure";
  };
  name: fields.RequiredString;
  password: fields.BlankString;
  passwordSalt: fields.StringField;
  permissions: FieldReturnType<
    fields.DocumentPermissions,
    {
      default: Record<string, never>;
      validate: typeof _validatePermissions;
    }
  >;
  role: DocumentField<foundry.CONST.USER_ROLES> & {
    required: true;
    nullable: false;
    default: typeof foundry.CONST.USER_ROLES.PLAYER;
  };
  flags: fields.ObjectField;
}

interface UserDataProperties {
  /**
   * The _id which uniquely identifies this User document.
   * @defaultValue `null`
   */
  _id: string | null;

  /** The user's avatar image. */
  avatar: string | null | undefined;

  /** A linked Actor document that is this user's impersonated character. */
  character: string | null;

  /** A color to represent this user. */
  color: string | null | undefined;

  /**
   * A mapping of hotbar slot number to Macro id that represents this user's hotbar
   * configuration.
   * @defaultValue `{}`
   */
  hotbar: Record<number | `${number}`, string>;

  /** The user's name. */
  name: string;

  /**
   * The user's password. Available only on the Server side for security.
   * @defaultValue `""`
   */
  password: string;

  /** The user's password salt. Available only on the Server side for security. */
  passwordSalt: string | undefined;

  /**
   * The user's individual permission configuration, see CONST.USER_PERMISSIONS.
   * @defaultValue `{}`
   */
  permissions: Partial<Record<keyof typeof foundry.CONST.USER_PERMISSIONS, boolean>>;

  /**
   * The user's role, see CONST.USER_ROLES.
   * @defaultValue `foundry.CONST.USER_ROLES.PLAYER`
   */
  role: foundry.CONST.USER_ROLES;

  /**
   * An object of optional key/value flags.
   * @defaultValue `{}`
   */
  flags: ConfiguredFlags<"User">;
}

interface UserDataConstructorData {
  /**
   * The _id which uniquely identifies this User document.
   * @defaultValue `null`
   */
  _id?: string | null | undefined;

  /** The user's avatar image. */
  avatar?: string | null | undefined;

  /** A linked Actor document that is this user's impersonated character. */
  character?: InstanceType<ConfiguredDocumentClass<typeof documents.BaseActor>> | string | null | undefined;

  /** A color to represent this user. */
  color?: string | null | undefined;

  /**
   * A mapping of hotbar slot number to Macro id that represents this user's hotbar
   * configuration.
   * @defaultValue `{}`
   */
  hotbar?: Record<number | `${number}`, string> | null | undefined;

  /** The user's name. */
  name: string;

  /**
   * The user's password. Available only on the Server side for security.
   * @defaultValue `""`
   */ password?: string | null | undefined;

  /** The user's password salt. Available only on the Server side for security. */
  passwordSalt?: string | null | undefined;

  /**
   * The user's individual permission configuration, see CONST.USER_PERMISSIONS.
   * @defaultValue `{}`
   */
  permissions?: Partial<Record<keyof typeof foundry.CONST.USER_PERMISSIONS, boolean>> | null | undefined;

  /**
   * The user's role, see CONST.USER_ROLES.
   * @defaultValue `foundry.CONST.USER_ROLES.PLAYER`
   */
  role?: foundry.CONST.USER_ROLES | null | undefined;

  /**
   * An object of optional key/value flags.
   * @defaultValue `{}`
   */
  flags?: ConfiguredFlags<"User"> | null | undefined;
}

type UserDataSource = PropertiesToSource<UserDataProperties>;

/**
 * The data schema for a User document
 */
export class UserData extends DocumentData<
  UserDataSchema,
  UserDataProperties,
  UserDataSource,
  UserDataConstructorData,
  documents.BaseUser
> {
  constructor(data: UserDataConstructorData, document?: documents.BaseUser | null);

  static override defineSchema(): UserDataSchema;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface UserData extends UserDataProperties {}

/**
 * Validate the structure of the User hotbar object
 * @param bar - The attempted hotbar data
 */
declare function _validateHotbar(bar: unknown): boolean;

/**
 * Validate the structure of the User permissions object
 * @param perms - The attempted permissions data
 */
declare function _validatePermissions(perms: unknown): boolean;
