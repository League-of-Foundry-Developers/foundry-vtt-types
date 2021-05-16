import { FieldReturnType, PropertiesToSource } from '../../abstract/helperTypes';
import { DocumentData } from '../../abstract/module';
import * as fields from '../fields';
import * as documents from '../../documents';

import * as CONST from '../../constants';

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
  author: fields.ForeignDocumentField<{ type: typeof documents.BaseUser; default: () => string }>;
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
  type: ValueOf<typeof CONST.MACRO_TYPES>;

  /**
   * The _id of a User document which created this Macro *
   */
  author: string;

  /**
   * An image file path which provides the thumbnail artwork for this Macro
   */
  img?: string;

  /**
   * The scope of this Macro application from CONST.MACRO_SCOPES
   * @defaultValue `'global'`
   */
  scope: ValueOf<typeof CONST.MACRO_SCOPES>;

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
   */
  permission: Partial<Record<string, ValueOf<typeof CONST.ENTITY_PERMISSIONS>>>;

  /**
   * An object of optional key/value flags
   */
  flags: Record<string, unknown>;
}

type MacroDataSource = PropertiesToSource<MacroDataProperties>;

/**
 * The data schema for a Macro document.
 * @see BaseMacro
 */
export declare class MacroData extends DocumentData<MacroDataSchema, MacroDataSource, documents.BaseMacro> {
  static defineSchema(): MacroDataSchema;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export declare interface MacroData extends MacroDataProperties {}
