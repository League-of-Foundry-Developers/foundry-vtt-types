import { DocumentData } from '../../abstract/module.mjs';
import * as fields from '../fields.mjs';
import * as documents from '../../documents.mjs';

type EntityPermissions = ValueOf<typeof CONST.ENTITY_PERMISSIONS>;

interface JournalEntryDataSchema extends DocumentSchema {
  _id: typeof fields.DOCUMENT_ID;
  name: typeof fields.REQUIRED_STRING;
  content: typeof fields.BLANK_STRING;
  img: typeof fields.IMAGE_FIELD;
  folder: fields.ForeignDocumentField<{ type: typeof documents.BaseFolder }>;
  sort: typeof fields.INTEGER_SORT_FIELD;
  permission: typeof fields.DOCUMENT_PERMISSIONS;
  flags: typeof fields.OBJECT_FIELD;
}

interface JournalEntryDataProperties {
  /**
   * The _id which uniquely identifies this JournalEntry document
   * @defaultValue `null`
   */
  _id: string | null;

  /**
   * The name of this JournalEntry
   */
  name: string;

  /**
   * The HTML content of the JournalEntry
   * @defaultValue `''`
   */
  content: string;

  /**
   * An image file path which provides the artwork for this JournalEntry
   */
  img?: string | null;

  /**
   * The _id of a Folder which contains this JournalEntry
   * @defaultValue `null`
   */
  folder: string | null;

  /**
   * The numeric sort value which orders this JournalEntry relative to its siblings
   * @defaultValue `0`
   */
  sort: number;

  /**
   * An object which configures user permissions to this JournalEntry
   * @defaultValue `{ default: CONST.ENTITY_PERMISSIONS.NONE }`
   */
  permission: Partial<Record<string, EntityPermissions>>;

  /**
   * An object of optional key/value flags
   * @defaultValue `{}`
   */
  flags: Record<string, unknown>;
}

interface JournalEntryUpdateArgs {
  _id?: string | null;
  name: string;
  content?: string | null;
  img?: string | null;
  folder?: string | null;
  sort?: number | null;
  permission?: Record<string, EntityPermissions> | null;
  flags?: Record<string, unknown> | null;
}

export declare class JournalEntryData extends DocumentData<
  JournalEntryDataSchema,
  JournalEntryDataProperties,
  documents.BaseJournalEntry,
  JournalEntryUpdateArgs
> {
  static defineSchema(): JournalEntryDataSchema;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface JournalEntryData extends JournalEntryDataProperties {}
