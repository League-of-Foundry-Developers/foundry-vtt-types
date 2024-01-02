import Document, { DocumentMetadata, DocumentModificationOptions } from '../abstract/document.mjs';
import * as CONST from '../constants.mjs';
import * as documents from './module.mjs';
import * as fields from '../data/fields.mjs';
import { DataModel, DataSchema } from '../abstract/data.mjs';
import type { DocumentStatsSchema } from '../data/data.mjs.js';
import type { FlagsField } from '../data/flagsField.js';

interface BaseMacroSchema extends DataSchema {
  /**
   * The _id which uniquely identifies this Macro document
   */
  _id: fields.DocumentIdField<{}>;

  /**
   * The name of this Macro
   */
  name: fields.StringField<{ required: true; blank: false; label: 'Name' }>;

  /**
   * A Macro subtype from CONST.MACRO_TYPES
   */
  type: fields.StringField<{
    required: true;
    choices: ValueOf<typeof CONST.MACRO_TYPES>[];
    initial: typeof CONST.MACRO_TYPES.CHAT;
    validationError: 'must be a value in CONST.MACRO_TYPES';
    label: 'Type';
  }>;

  /**
   * The _id of a User document which created this Macro *
   */
  author: fields.ForeignDocumentField<
    typeof documents.BaseUser,
    {
      initial: () => OptionalChaining<OptionalChaining<typeof game, 'user'>, 'id'>;
    }
  >;

  /**
   * An image file path which provides the thumbnail artwork for this Macro
   */
  img: fields.FilePathField<{ categories: ['IMAGE']; initial: () => typeof BaseMacro.DEFAULT_ICON; label: 'Image' }>;

  /**
   * The scope of this Macro application from CONST.MACRO_SCOPES
   * (default: `CONST.MACRO_SCOPES[0]`)
   */
  scope: fields.StringField<{
    required: true;
    choices: typeof CONST.MACRO_SCOPES;
    initial: typeof CONST.MACRO_SCOPES[0];
    validationError: 'must be a value in CONST.MACRO_SCOPES';
    label: 'Scope';
  }>;

  /**
   * The string content of the macro command
   */
  command: fields.StringField<{ required: true; blank: true; label: 'Command' }>;

  /**
   * The _id of a Folder which contains this Macro
   */
  folder: fields.ForeignDocumentField<typeof documents.BaseFolder, {}>;

  /**
   * The numeric sort value which orders this Macro relative to its siblings
   */
  sort: typeof documents.BaseFolder.SORT_FIELD;

  /**
   * An object which configures ownership of this Macro
   */
  ownership: fields.DocumentOwnershipField<{}>;

  /**
   * An object of optional key/value flags
   */
  flags: FlagsField<'Macro', {}>;

  /**
   * An object of creation and access information
   */
  _stats: typeof DocumentStatsSchema;
}

type BaseMacroMetadata = Merge<
  DocumentMetadata,
  {
    name: 'Macro';
    collection: 'macros';
    compendiumIndexFields: ['_id', 'name', 'sort'];
    label: 'DOCUMENT.Macro';
    labelPlural: 'DOCUMENT.Macros';
    coreTypes: ValueOf<typeof CONST.MACRO_TYPES>[];
    permissions: { create: 'PLAYER' };
  }
>;

type BaseMacroShims = {
  /**
   * Rename permission to ownership
   * @deprecated since v10
   */
  permission: BaseMacro['ownership'];
};

/**
 * The Document definition for a Macro.
 * Defines the DataSchema and common behaviors for a Macro which are shared between both client and server.
 */
declare class BaseMacro extends Document<BaseMacroSchema, null, BaseMacroMetadata, BaseMacroShims> {
  /* -------------------------------------------- */
  /*  Model Configuration                         */
  /* -------------------------------------------- */

  /** {@inheritdoc} */
  static override readonly metadata: BaseMacroMetadata;

  /** {@inheritdoc} */
  static override defineSchema(): BaseMacroSchema;

  /**
   * The default icon used for newly created Macro documents.
   *
   * (initialized: `'icons/svg/dice-target.svg'`)
   */
  static DEFAULT_ICON: string;

  /* -------------------------------------------- */
  /*  Model Methods                               */
  /* -------------------------------------------- */

  /** {@inheritdoc} */
  override testUserPermission(
    user: foundry.documents.BaseUser,
    permission: keyof typeof foundry.CONST.DOCUMENT_PERMISSION_LEVELS | foundry.CONST.DOCUMENT_PERMISSION_LEVELS,
    { exact }?: { exact?: boolean }
  ): boolean;

  /* -------------------------------------------- */
  /*  Database Event Handlers                     */
  /* -------------------------------------------- */

  /** {@inheritdoc} */
  protected override _preCreate(
    data: DataModel.SchemaToSourceInput<this['schema']>,
    options: DocumentModificationOptions,
    user: foundry.documents.BaseUser
  ): Promise<void>;

  /* -------------------------------------------- */
  /*  Deprecations and Compatibility              */
  /* -------------------------------------------- */

  /** {@inheritdoc} */
  static override migrateData(data: Record<string, unknown>): Record<string, unknown>;

  /* ---------------------------------------- */

  /** {@inheritdoc} */
  static override shimData(data: Record<string, unknown>, options: DataModel.ShimDataOptions): Record<string, unknown>;
}

export default BaseMacro;
