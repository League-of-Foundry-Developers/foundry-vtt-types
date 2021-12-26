import {
  ConfiguredDocumentClass,
  ConfiguredFlags,
  FieldReturnType,
  PropertiesToSource
} from '../../../../types/helperTypes';
import DocumentData from '../../abstract/data.mjs';
import * as documents from '../../documents.mjs';
import * as fields from '../fields.mjs';

interface UserDataSchema extends DocumentSchema {
  _id: fields.DocumentId;
  avatar: fields.ImageField;
  character: fields.ForeignDocumentField<{ type: typeof documents.BaseActor; required: false }>;
  color: FieldReturnType<fields.ColorField, { required: true }>;
  hotbar: DocumentField<Record<number | `${number}`, string>> & {
    required: true;
    default: Record<number | `${number}`, never>;
    validate: typeof _validateHotbar;
    validationError: 'Invalid User hotbar data structure';
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
  /** @defaultValue `null` */
  _id: string | null;

  avatar: string | null | undefined;

  character: string | null;

  color: string | null | undefined;

  /** @defaultValue `{}` */
  hotbar: Record<number | `${number}`, string>;

  name: string;

  /** @defaultValue `""` */
  password: string;

  passwordSalt: string | undefined;

  /** @defaultValue `{}` */
  permissions: Partial<Record<keyof typeof foundry.CONST.USER_PERMISSIONS, boolean>>;

  /** @defaultValue `foundry.CONST.USER_ROLES.PLAYER` */
  role: foundry.CONST.USER_ROLES;

  /** @defaultValue `{}` */
  flags: ConfiguredFlags<'User'>;
}

interface UserDataConstructorData {
  /** @defaultValue `null` */
  _id?: string | null | undefined;

  avatar?: string | null | undefined;

  character?: InstanceType<ConfiguredDocumentClass<typeof documents.BaseActor>> | string | null | undefined;

  color?: string | null | undefined;

  /** @defaultValue `{}` */
  hotbar?: Record<number | `${number}`, string> | null | undefined;

  name: string;

  /** @defaultValue `""` */
  password?: string | null | undefined;

  passwordSalt?: string | null | undefined;

  /** @defaultValue `{}` */
  permissions?: Partial<Record<keyof typeof foundry.CONST.USER_PERMISSIONS, boolean>> | null | undefined;

  /** @defaultValue `foundry.CONST.USER_ROLES.PLAYER` */
  role?: foundry.CONST.USER_ROLES | null | undefined;

  /** @defaultValue `{}` */
  flags?: ConfiguredFlags<'User'> | null | undefined;
}

/**
 * The data schema for a User document
 */
export class UserData extends DocumentData<
  UserDataSchema,
  UserDataProperties,
  PropertiesToSource<UserDataProperties>,
  UserDataConstructorData,
  documents.BaseUser
> {
  constructor(data: UserDataConstructorData, document?: documents.BaseUser | null);

  /** @override */
  static defineSchema(): UserDataSchema;
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
