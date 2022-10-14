import { ConfiguredDocumentClass, ConfiguredFlags, PropertiesToSource } from "../../../../types/helperTypes";
import { DocumentData } from "../../abstract/module.mjs";
import * as documents from "../../documents.mjs";
import * as fields from "../fields.mjs";

interface JournalEntryDataSchema extends DocumentSchema {
  _id: fields.DocumentId;
  name: fields.RequiredString;
  content: fields.BlankString;
  img: fields.ImageField;
  folder: fields.ForeignDocumentField<{ type: typeof documents.BaseFolder }>;
  sort: fields.IntegerSortField;
  permission: fields.DocumentPermissions;
  flags: fields.ObjectField;
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
   * @defaultValue `""`
   */
  content: string;

  /**
   * An image file path which provides the artwork for this JournalEntry
   */
  img: string | null | undefined;

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
   * @defaultValue `{ default: CONST.DOCUMENT_OWNERSHIP_LEVELS.NONE }`
   */
  permission: Partial<Record<string, foundry.CONST.DOCUMENT_OWNERSHIP_LEVELS>>;

  /**
   * An object of optional key/value flags
   * @defaultValue `{}`
   */
  flags: ConfiguredFlags<"JournalEntry">;
}

interface JournalEntryDataConstructorData {
  /**
   * The _id which uniquely identifies this JournalEntry document
   * @defaultValue `null`
   */
  _id?: string | null | undefined;

  /**
   * The name of this JournalEntry
   */
  name: string;

  /**
   * The HTML content of the JournalEntry
   * @defaultValue `""`
   */
  content?: string | null | undefined;

  /**
   * An image file path which provides the artwork for this JournalEntry
   */
  img?: string | null | undefined;

  /**
   * The _id of a Folder which contains this JournalEntry
   * @defaultValue `null`
   */
  folder?: InstanceType<ConfiguredDocumentClass<typeof documents.BaseFolder>> | string | null | undefined;

  /**
   * The numeric sort value which orders this JournalEntry relative to its siblings
   * @defaultValue `0`
   */
  sort?: number | null | undefined;

  /**
   * An object which configures user permissions to this JournalEntry
   * @defaultValue `{ default: CONST.DOCUMENT_OWNERSHIP_LEVELS.NONE }`
   */
  permission?: Partial<Record<string, foundry.CONST.DOCUMENT_OWNERSHIP_LEVELS>> | null | undefined;

  /**
   * An object of optional key/value flags
   * @defaultValue `{}`
   */
  flags?: ConfiguredFlags<"JournalEntry"> | null | undefined;
}

type JournalEntryDataSource = PropertiesToSource<JournalEntryDataProperties>;

/**
 * The data schema for a JournalEntry document.
 * @see BaseJournalEntry
 */
export class JournalEntryData extends DocumentData<
  JournalEntryDataSchema,
  JournalEntryDataProperties,
  JournalEntryDataSource,
  JournalEntryDataConstructorData,
  documents.BaseJournalEntry
> {
  constructor(data: JournalEntryDataConstructorData, document?: documents.BaseJournalEntry | null);

  static override defineSchema(): JournalEntryDataSchema;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface JournalEntryData extends JournalEntryDataProperties {}
