import type { AnyObject, Merge } from "../../../types/utils.mts";
import type Document from "../abstract/document.mts";
import type { DocumentMetadata } from "../abstract/document.mts";
import type * as fields from "../data/fields.d.mts";
import type * as documents from "./_module.mts";

declare global {
  type JournalEntryData = BaseJournalEntry.Properties;
}

/**
 * The Document definition for a JournalEntry.
 * Defines the DataSchema and common behaviors for a JournalEntry which are shared between both client and server.
 */
declare class BaseJournalEntry extends Document<BaseJournalEntry.Schema, BaseJournalEntry.Metadata> {
  /**
   * @param data    - Initial data from which to construct the JournalEntry
   * @param context - Construction context options
   */
  constructor(data: BaseJournalEntry.ConstructorData, context?: DocumentConstructionContext);

  static override metadata: Readonly<BaseJournalEntry.Metadata>;

  static override defineSchema(): BaseJournalEntry.Schema;

  static override migrateData(source: AnyObject): AnyObject;

  static override shimData(
    data: AnyObject,
    options?: {
      /**
       * Apply shims to embedded models?
       * @defaultValue `true`
       */
      embedded?: boolean;
    },
  ): AnyObject;

  protected override _initializeSource(
    data: this | BaseJournalEntry.UpdateData,
    options?: any,
  ): BaseJournalEntry.Source;

  /**
   * Migrate old content and img field to individual pages.
   * @param source - Old source data which will be mutated in-place
   * @returns Page data that should be added to the document
   * @deprecated since v10
   */
  static migrateContentToPages(source: {
    img?: string;
    content?: string;
  }): documents.BaseJournalEntryPage.ConstructorData[];
}
export default BaseJournalEntry;

declare namespace BaseJournalEntry {
  type Metadata = Merge<
    DocumentMetadata,
    {
      name: "JournalEntry";
      collection: "journal";
      indexed: true;
      compendiumIndexFields: ["_id", "name", "sort", "folder"];
      embedded: { JournalEntryPage: "pages" };
      label: "DOCUMENT.JournalEntry";
      labelPlural: "DOCUMENT.JournalEntries";
      permissions: {
        create: "JOURNAL_CREATE";
      };
    }
  >;

  type SchemaField = fields.SchemaField<Schema>;
  type ConstructorData = fields.SchemaField.InnerConstructorType<Schema>;
  type UpdateData = fields.SchemaField.InnerAssignmentType<Schema>;
  type Properties = fields.SchemaField.InnerInitializedType<Schema>;
  type Source = fields.SchemaField.InnerPersistedType<Schema>;

  interface Schema extends DataSchema {
    /**
     * The _id which uniquely identifies this JournalEntry document
     * @defaultValue `null`
     */
    _id: fields.DocumentIdField;

    /**
     * The name of this JournalEntry
     */
    name: fields.StringField<{ required: true; blank: false; textSearch: true }>;

    /**
     * The pages contained within this JournalEntry document
     * @defaultValue `[]`
     */
    pages: fields.EmbeddedCollectionField<typeof documents.BaseJournalEntryPage, JournalEntry.ConfiguredInstance>;

    /**
     * The _id of a Folder which contains this JournalEntry
     * @defaultValue `null`
     */
    folder: fields.ForeignDocumentField<documents.BaseFolder>;

    /**
     * The numeric sort value which orders this JournalEntry relative to its siblings
     * @defaultValue `0`
     */
    sort: fields.IntegerSortField;

    /**
     * An object which configures ownership of this JournalEntry
     * @defaultValue see {@link fields.DocumentOwnershipField}
     */
    ownership: fields.DocumentOwnershipField;

    /**
     * An object of optional key/value flags
     * @defaultValue `{}`
     */
    flags: fields.ObjectField.FlagsField<"JournalEntry">;

    /**
     * An object of creation and access information
     * @defaultValue see {@link fields.DocumentStatsField}
     */
    _stats: fields.DocumentStatsField;
  }
}
