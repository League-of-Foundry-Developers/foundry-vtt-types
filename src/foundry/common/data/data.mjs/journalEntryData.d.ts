import { ConfiguredDocumentClass, ConfiguredFlags, PropertiesToSource } from "../../../../types/helperTypes";
import type EmbeddedCollection from "../../abstract/embedded-collection.mjs";
import { DocumentData } from "../../abstract/module.mjs";
import * as documents from "../../documents.mjs";
import * as fields from "../fields.mjs";

interface JournalEntryDataSchema extends DocumentSchema {
  _id: fields.DocumentId;
  name: fields.RequiredString;
  pages: fields.EmbeddedCollectionField<typeof documents.BaseJournalEntryPage>;
  folder: fields.ForeignDocumentField<{ type: typeof documents.BaseFolder }>;
  sort: fields.IntegerSortField;
  ownership: fields.DocumentPermissions;
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
   * The pages contained within this JournalEntry document
   */
  pages: EmbeddedCollection<ConfiguredDocumentClass<typeof documents.BaseJournalEntryPage>, JournalEntryData>;

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
  ownership: Partial<Record<string, foundry.CONST.DOCUMENT_OWNERSHIP_LEVELS>>;

  /**
   * An object of optional key/value flags
   * @defaultValue `{}`
   */
  flags: ConfiguredFlags<"JournalEntry">;
}

type ConstructorDataOf<T> = {
  [P in keyof T]?: T[P] | undefined | null;
};

interface JournalEntryDataConstructorData
  extends Omit<ConstructorDataOf<JournalEntryDataProperties>, "pages" | "folder"> {
  _id?: JournalEntryDataProperties["_id"] | undefined;

  name: JournalEntryDataProperties["name"];

  /**
   * The pages contained within this JournalEntry document
   */
  pages?: ConstructorParameters<ConfiguredDocumentClass<typeof documents.BaseJournalEntryPage>>[] | null | undefined;

  /**
   * The _id of a Folder which contains this JournalEntry
   * @defaultValue `null`
   */
  folder?: InstanceType<ConfiguredDocumentClass<typeof documents.BaseFolder>> | string | null | undefined;

  sort?: JournalEntryDataProperties["sort"] | null | undefined;

  ownership?: JournalEntryDataProperties["ownership"] | null | undefined;

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
