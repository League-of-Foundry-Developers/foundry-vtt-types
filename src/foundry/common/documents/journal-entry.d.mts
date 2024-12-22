import type { AnyObject } from "../../../utils/index.d.mts";
import type Document from "../abstract/document.mts";
import type * as fields from "../data/fields.d.mts";
import type * as documents from "./_module.mts";

/**
 * The JournalEntry Document.
 * Defines the DataSchema and common behaviors for a JournalEntry which are shared between both client and server.
 */
// Note(LukeAbby): You may wonder why documents don't simply pass the `Parent` generic parameter.
// This pattern evolved from trying to avoid circular loops and even internal tsc errors.
// See: https://gist.github.com/LukeAbby/0d01b6e20ef19ebc304d7d18cef9cc21
declare class BaseJournalEntry extends Document<"JournalEntry", BaseJournalEntry.Schema, any> {
  /**
   * @param data    - Initial data from which to construct the JournalEntry
   * @param context - Construction context options
   */
  // TODO(LukeAbby): This constructor is a symptom of a circular error.
  // constructor(data: BaseJournalEntry.ConstructorData, context?: Document.ConstructionContext<BaseJournalEntry.Parent>);

  override parent: BaseJournalEntry.Parent;

  static override metadata: BaseJournalEntry.Metadata;

  static override defineSchema(): BaseJournalEntry.Schema;

  static override migrateData(source: AnyObject): AnyObject;
}

export default BaseJournalEntry;

declare namespace BaseJournalEntry {
  type Parent = null;

  type Metadata = Document.MetadataFor<BaseJournalEntry>;

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
    folder: fields.ForeignDocumentField<typeof documents.BaseFolder>;

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
