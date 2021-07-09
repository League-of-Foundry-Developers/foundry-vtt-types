import { ConfiguredFlagsForName, FieldReturnType, PropertiesToSource } from '../../../../types/helperTypes';
import { DocumentData } from '../../abstract/module.mjs';
import * as fields from '../fields.mjs';
import * as documents from '../../documents.mjs';
import * as CONST from '../../constants.mjs';

interface MacroDataSchema extends DocumentSchema {
  _id: typeof fields.DOCUMENT_ID;
  name: typeof fields.REQUIRED_STRING;
  type: DocumentField<string> & {
    type: String;
    required: true;
    default: typeof CONST.MACRO_TYPES.CHAT;
    validate: (t: unknown) => boolean;
    validationError: 'The provided Macro type must be in CONST.MACRO_TYPES';
  };
  author: fields.ForeignDocumentField<{
    type: typeof documents.BaseUser;
    default: () => Game['user'];
  }>;
  img: FieldReturnType<typeof fields.IMAGE_FIELD, { required: true; default: typeof CONST.DEFAULT_MACRO_ICON }>;
  scope: DocumentField<string> & {
    type: String;
    required: true;
    default: typeof CONST.MACRO_SCOPES[0];
    validate: (t: unknown) => boolean;
    validationError: 'The provided Macro scope must be in CONST.MACRO_SCOPES';
  };
  command: typeof fields.BLANK_STRING;
  folder: fields.ForeignDocumentField<{ type: typeof documents.BaseFolder }>;
  sort: typeof fields.INTEGER_SORT_FIELD;
  permission: typeof fields.DOCUMENT_PERMISSIONS;
  flags: typeof fields.OBJECT_FIELD;
}

interface MacroDataProperties {
  /**
   * The _id which uniquely identifies this Macro document
   */
  _id: string | null;

  /**
   * The name of this Macro
   */
  name: string;

  /**
   * A Macro subtype from CONST.MACRO_TYPES
   */
  type: foundry.CONST.MacroTypes;

  /**
   * The _id of a User document which created this Macro *
   */
  author: string;

  /**
   * An image file path which provides the thumbnail artwork for this Macro
   * @defaultValue `CONST.DEFAULT_MACRO_ICON`
   */
  img: string | null;

  /**
   * The scope of this Macro application from CONST.MACRO_SCOPES
   * @defaultValue `'global'`
   */
  scope: foundry.CONST.MacroScopes;

  /**
   * The string content of the macro command
   * @defaultValue `''`
   */
  command: string;

  /**
   * The _id of a Folder which contains this Macro
   * @defaultValue `null`
   */
  folder: string | null;

  /**
   * The numeric sort value which orders this Macro relative to its siblings
   * @defaultValue `0`
   */
  sort: number;

  /**
   * An object which configures user permissions to this Macro
   * @defaultValue `{ default: CONST.ENTITY_PERMISSIONS.NONE }`
   */
  permission: Partial<Record<string, foundry.CONST.EntityPermission>>;

  /**
   * An object of optional key/value flags
   * @defaultValue `{}`
   */
  flags: ConfiguredFlagsForName<'Macro'>;
}

interface MacroDataConstructorData {
  /**
   * The _id which uniquely identifies this Macro document
   */
  _id?: string | null;

  /**
   * The name of this Macro
   */
  name: string;

  /**
   * A Macro subtype from CONST.MACRO_TYPES
   */
  type?: foundry.CONST.MacroTypes | null;

  /**
   * The _id of a User document which created this Macro *
   */
  author?: string | null;

  /**
   * An image file path which provides the thumbnail artwork for this Macro
   * @defaultValue `CONST.DEFAULT_MACRO_ICON`
   */
  img?: string | null;

  /**
   * The scope of this Macro application from CONST.MACRO_SCOPES
   * @defaultValue `'global'`
   */
  scope?: foundry.CONST.MacroScopes | null;

  /**
   * The string content of the macro command
   * @defaultValue `''`
   */
  command?: string | null;

  /**
   * The _id of a Folder which contains this Macro
   * @defaultValue `null`
   */
  folder?: string | null;

  /**
   * The numeric sort value which orders this Macro relative to its siblings
   * @defaultValue `0`
   */
  sort?: number | null;

  /**
   * An object which configures user permissions to this Macro
   * @defaultValue `{ default: CONST.ENTITY_PERMISSIONS.NONE }`
   */
  permission?: Partial<Record<string, foundry.CONST.EntityPermission>> | null;

  /**
   * An object of optional key/value flags
   * @defaultValue `{}`
   */
  flags?: ConfiguredFlagsForName<'Macro'> | null;
}

/**
 * The data schema for a Macro document.
 * @see BaseMacro
 */
export declare class MacroData extends DocumentData<
  MacroDataSchema,
  MacroDataProperties,
  PropertiesToSource<MacroDataProperties>,
  MacroDataConstructorData,
  documents.BaseMacro
> {
  constructor(data: MacroDataConstructorData, document?: documents.BaseMacro | null);

  static defineSchema(): MacroDataSchema;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export declare interface MacroData extends MacroDataProperties {}
