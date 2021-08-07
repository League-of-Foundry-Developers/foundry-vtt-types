import {
  ConfiguredDocumentClass,
  ConfiguredFlags,
  FieldReturnType,
  PropertiesToSource
} from '../../../../types/helperTypes';
import EmbeddedCollection from '../../abstract/embedded-collection.mjs';
import { DocumentData } from '../../abstract/module.mjs';
import * as documents from '../../documents.mjs';
import * as fields from '../fields.mjs';

interface RollTableDataSchema extends DocumentSchema {
  _id: typeof fields.DOCUMENT_ID;
  name: typeof fields.REQUIRED_STRING;
  img: FieldReturnType<typeof fields.IMAGE_FIELD, { default: () => string }>;
  description: typeof fields.STRING_FIELD;
  results: fields.EmbeddedCollectionField<typeof documents.BaseTableResult>;
  formula: typeof fields.STRING_FIELD;
  replacement: FieldReturnType<typeof fields.BOOLEAN_FIELD, { default: true }>;
  displayRoll: FieldReturnType<typeof fields.BOOLEAN_FIELD, { default: true }>;
  folder: fields.ForeignDocumentField<{ type: typeof documents.BaseFolder }>;
  sort: typeof fields.INTEGER_SORT_FIELD;
  permission: typeof fields.DOCUMENT_PERMISSIONS;
  flags: typeof fields.OBJECT_FIELD;
}

interface RollTableDataProperties {
  /**
   * The _id which uniquely identifies this RollTable document
   */
  _id: string | null;

  /**
   * The name of this RollTable
   */
  name: string;

  /**
   * An image file path which provides the thumbnail artwork for this RollTable
   */
  img: string;

  /**
   * The HTML text description for this RollTable document
   */
  description: string | undefined;

  /**
   * A Collection of TableResult embedded documents which belong to this RollTable
   */
  results: EmbeddedCollection<ConfiguredDocumentClass<typeof documents.BaseTableResult>, RollTableData>;

  /**
   * The Roll formula which determines the results chosen from the table
   */
  formula: string | undefined;

  /**
   * Are results from this table drawn with replacement?
   * @defaultValue `true`
   */
  replacement: boolean;

  /**
   * Is the Roll result used to draw from this RollTable displayed in chat?
   * @defaultValue `true`
   */
  displayRoll: boolean;

  /**
   * The _id of a Folder which contains this RollTable
   */
  folder: string | null;

  /**
   * The numeric sort value which orders this RollTable relative to its siblings
   * @defaultValue `0`
   */
  sort: number;

  /**
   * An object which configures user permissions to this RollTable
   * @defaultValue `{ default: CONST.ENTITY_PERMISSIONS.NONE }`
   */
  permission: Partial<Record<string, foundry.CONST.EntityPermission>>;

  /**
   * An object of optional key/value flags
   * @defaultValue `{}`
   */
  flags: ConfiguredFlags<'RollTable'>;
}

interface RollTableDataConstructorData {
  /**
   * The _id which uniquely identifies this RollTable document
   */
  _id?: string | null;

  /**
   * The name of this RollTable
   */
  name: string;

  /**
   * An image file path which provides the thumbnail artwork for this RollTable
   */
  img?: string | null;

  /**
   * The HTML text description for this RollTable document
   */
  description?: string | null;

  /**
   * A Collection of TableResult embedded documents which belong to this RollTable
   */
  results?: ConstructorParameters<ConfiguredDocumentClass<typeof documents.BaseTableResult>>[0][] | null;

  /**
   * The Roll formula which determines the results chosen from the table
   */
  formula?: string | null;

  /**
   * Are results from this table drawn with replacement?
   * @defaultValue `true`
   */
  replacement?: boolean | null;

  /**
   * Is the Roll result used to draw from this RollTable displayed in chat?
   * @defaultValue `true`
   */
  displayRoll?: boolean | null;

  /**
   * The _id of a Folder which contains this RollTable
   */
  folder?: string | null;

  /**
   * The numeric sort value which orders this RollTable relative to its siblings
   */
  sort?: number | null;

  /**
   * An object which configures user permissions to this RollTable
   * @defaultValue `{ default: CONST.ENTITY_PERMISSIONS.NONE }`
   */
  permission?: Partial<Record<string, foundry.CONST.EntityPermission>> | null;

  /**
   * An object of optional key/value flags
   * @defaultValue `{}`
   */
  flags?: ConfiguredFlags<'RollTable'> | null;
}

/**
 * The data schema for an RollTable document.
 * @see BaseRollTable
 */
export declare class RollTableData extends DocumentData<
  RollTableDataSchema,
  RollTableDataProperties,
  PropertiesToSource<RollTableDataProperties>,
  RollTableDataConstructorData,
  documents.BaseRollTable
> {
  static defineSchema(): RollTableDataSchema;

  /**
   * The default icon used for newly created Macro documents
   * @remarks Incorrect description, really for the RollTables.
   * @defaultValue `'icons/svg/d20-grey.svg'`
   */
  static DEFAULT_ICON: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export declare interface RollTableData extends RollTableDataProperties {}
