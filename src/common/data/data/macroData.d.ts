import { FieldReturnType, PropertiesToSource } from '../../abstract/helperTypes';
import { DocumentData } from '../../abstract/module';
import * as fields from '../fields';
import * as documents from '../../documents';

import * as CONST from '../../constants';

interface MacroDataSchema extends DocumentSchema {
  _id: typeof fields.DOCUMENT_ID;
  author: fields.ForeignDocumentField<{ default: () => string; type: typeof documents.BaseUser }>;
  command: typeof fields.BLANK_STRING;
  flags: typeof fields.OBJECT_FIELD;
  folder: fields.ForeignDocumentField<{ type: typeof documents.BaseFolder }>;
  img: FieldReturnType<typeof fields.IMAGE_FIELD, { default: typeof CONST.DEFAULT_MACRO_ICON; required: true }>;
  name: typeof fields.REQUIRED_STRING;
  permission: typeof fields.DOCUMENT_PERMISSIONS;
  scope: DocumentField<string> & {
    default: typeof CONST.MACRO_SCOPES[0];
    required: true;
    type: String;
    validate: (t: unknown) => boolean;
    validationError: 'The provided Macro scope must be in CONST.MACRO_SCOPES';
  };
  sort: typeof fields.INTEGER_SORT_FIELD;
  type: DocumentField<string> & {
    default: typeof CONST.MACRO_TYPES.CHAT;
    required: true;
    type: String;
    validate: (t: unknown) => boolean;
    validationError: 'The provided Macro type must be in CONST.MACRO_TYPES';
  };
}

interface MacroDataProperties {
  /**
   * The _id which uniquely identifies this Macro document
   */
  _id: string | null;

  /**
   * The _id of a User document which created this Macro *
   */
  author: string;

  /**
   * The string content of the macro command
   * @defaultValue `''`
   */
  command: string;

  /**
   * An object of optional key/value flags
   */
  flags: Record<string, unknown>;

  /**
   * The _id of a Folder which contains this Macro
   * @defaultValue `null`
   */
  folder: string | null;

  /**
   * An image file path which provides the thumbnail artwork for this Macro
   */
  img?: string;

  /**
   * The name of this Macro
   */
  name: string;

  /**
   * An object which configures user permissions to this Macro
   */
  permission: Partial<Record<string, ValueOf<typeof CONST.ENTITY_PERMISSIONS>>>;

  /**
   * The scope of this Macro application from CONST.MACRO_SCOPES
   * @defaultValue `'global'`
   */
  scope: ValueOf<typeof CONST.MACRO_SCOPES>;

  /**
   * The numeric sort value which orders this Macro relative to its siblings
   * @defaultValue `0`
   */
  sort: number;

  /**
   * A Macro subtype from CONST.MACRO_TYPES
   */
  type: ValueOf<typeof CONST.MACRO_TYPES>;
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
