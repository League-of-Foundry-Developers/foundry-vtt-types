import DocumentData from '../../abstract/data.mjs';
import { _validatePermissions } from '../fields.mjs';
import * as fields from '../fields.mjs';
import * as documents from '../../documents.mjs';

interface UserDataSchema extends DocumentSchema {
  _id: typeof fields.DOCUMENT_ID;
  avatar: typeof fields.IMAGE_FIELD;
  character: fields.ForeignDocumentField<{ type: typeof documents.BaseActor; required: false }>;
  color: DocumentField<Omit<typeof fields.COLOR_FIELD, 'required'> & { required: true }>;
  hotbar: DocumentField<{
    type: Object;
    required: true;
    default: Record<never, never>;
    validate: typeof _validateHotbar;
    validationError: 'Invalid User hotbar data structure';
  }>;
  name: typeof fields.REQUIRED_STRING;
  password: typeof fields.BLANK_STRING;
  permissions: DocumentField<
    Omit<typeof fields.DOCUMENT_PERMISSIONS, 'default' | 'validate'> & {
      default: Record<never, never>;
      validate: typeof _validatePermissions;
    }
  >;
  role: DocumentField<{
    type: Number;
    required: true;
    nullable: false;
    default: typeof CONST.USER_ROLES.PLAYER;
  }>;
  flags: typeof fields.OBJECT_FIELD;
}

/**
 * Validate the structure of the User hotbar object
 * @param bar - The attempted hotbar data
 */
declare function _validateHotbar(bar: unknown): asserts bar is Record<number | string, string>;

interface UserDataProperties {
  _id: string | null;
  avatar: string | null;
  character: string | null;
  color: string;
  hotbar: Record<number | string, string>;
  name: string;
  password: string;
  permissions: Partial<Record<string, ValueOf<typeof CONST.ENTITY_PERMISSIONS>>>;
  role: ValueOf<typeof CONST.USER_ROLES>;
  flags: Record<string, unknown>;
}

/**
 * The data schema for a Folder document.
 */
export declare class UserData extends DocumentData<UserDataSchema, UserDataProperties, documents.BaseUser> {
  static defineSchema(): UserDataSchema;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export declare interface UserData extends UserDataProperties {}
