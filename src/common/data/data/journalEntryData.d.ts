import { DocumentData } from '../../abstract/module';
import * as fields from '../fields';
import * as documents from '../../documents';

interface JournalEntryDataSchema extends DocumentSchema {
  _id: typeof fields.DOCUMENT_ID;
  content: typeof fields.BLANK_STRING;
  flags: typeof fields.OBJECT_FIELD;
  folder: fields.ForeignDocumentField<{ type: typeof documents.BaseFolder }>;
  img: typeof fields.IMAGE_FIELD;
  name: typeof fields.REQUIRED_STRING;
  permission: typeof fields.DOCUMENT_PERMISSIONS;
  sort: typeof fields.INTEGER_SORT_FIELD;
}

interface JournalEntryDataProperties {
  /**
   * The _id which uniquely identifies this JournalEntry document
   * @defaultValue `null`
   */
  _id: string | null;

  /**
   * The HTML content of the JournalEntry
   * @defaultValue `''`
   */
  content: string;

  /**
   * An object of optional key/value flags
   * @defaultValue `{}`
   */
  flags: Record<string, unknown>;

  /**
   * The _id of a Folder which contains this JournalEntry
   * @defaultValue `null`
   */
  folder: string | null;

  /**
   * An image file path which provides the artwork for this JournalEntry
   */
  img?: string;

  /**
   * The name of this JournalEntry
   */
  name: string;

  /**
   * An object which configures user permissions to this JournalEntry
   * @defaultValue `{ default: CONST.ENTITY_PERMISSIONS.NONE }`
   */
  permission: Partial<Record<string, ValueOf<typeof CONST.ENTITY_PERMISSIONS>>>;

  /**
   * The numeric sort value which orders this JournalEntry relative to its siblings
   * @defaultValue `0`
   */
  sort: number;
}

export declare class JournalEntryData extends DocumentData<
  JournalEntryDataSchema,
  JournalEntryDataProperties,
  documents.BaseJournalEntry
> {
  static defineSchema(): JournalEntryDataSchema;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface JournalEntryData extends JournalEntryDataProperties {}
