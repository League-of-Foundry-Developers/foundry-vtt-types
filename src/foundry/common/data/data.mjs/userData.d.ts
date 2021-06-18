import { FieldReturnType, PropertiesToSource } from '../../../../types/helperTypes';
import DocumentData from '../../abstract/data.mjs';
import * as fields from '../fields.mjs';
import * as documents from '../../documents.mjs';

interface UserDataSchema extends DocumentSchema {
  _id: typeof fields.DOCUMENT_ID;
  avatar: typeof fields.IMAGE_FIELD;
  character: fields.ForeignDocumentField<{ type: typeof documents.BaseActor; required: false }>;
  color: FieldReturnType<typeof fields.COLOR_FIELD, { required: true }>;
  hotbar: DocumentField<Record<number | string, string>> & {
    required: true;
    default: Record<never, never>;
    validate: typeof _validateHotbar;
    validationError: 'Invalid User hotbar data structure';
  };
  name: typeof fields.REQUIRED_STRING;
  password: typeof fields.BLANK_STRING;
  passwordSalt: typeof fields.STRING_FIELD;
  permissions: FieldReturnType<
    typeof fields.DOCUMENT_PERMISSIONS,
    {
      default: Record<never, never>;
      validate: typeof _validatePermissions;
    }
  >;
  role: DocumentField<number> & {
    required: true;
    nullable: false;
    default: typeof CONST.USER_ROLES.PLAYER;
  };
  flags: typeof fields.OBJECT_FIELD;
}

interface UserDataProperties {
  _id: string | null;
  avatar?: string;
  character: string | null;
  color: string;
  hotbar: Record<number | string, string>;
  name: string;
  password: string;
  passwordSalt?: string;
  permissions: Partial<Record<keyof typeof CONST.USER_PERMISSIONS, boolean>>;
  role: ValueOf<typeof CONST.USER_ROLES>;
  flags: Record<string, unknown>;
}

/**
 * The data schema for a User document
 */
export declare class UserData extends DocumentData<
  UserDataSchema,
  UserDataProperties,
  PropertiesToSource<UserDataProperties>,
  documents.BaseUser
> {
  static defineSchema(): UserDataSchema;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export declare interface UserData extends UserDataProperties {}

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
