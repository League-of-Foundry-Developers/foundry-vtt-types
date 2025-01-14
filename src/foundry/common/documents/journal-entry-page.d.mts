import type Document from "../abstract/document.mts";
import type * as fields from "../data/fields.d.mts";

type DataSchema = foundry.data.fields.DataSchema;

/**
 * The JournalEntryPage Document.
 * Defines the DataSchema and common behaviors for a JournalEntryPage which are shared between both client and server.
 */
declare abstract class BaseJournalEntryPage extends Document<"JournalEntryPage", BaseJournalEntryPage.Schema, any> {
  /**
   * @privateRemarks Manual override of the return due to TS limitations with static `this`
   */
  static get TYPES(): BaseJournalEntryPage.TypeNames[];

  /**
   * @param data    - Initial data from which to construct the JournalEntryPage.
   * @param context - Construction context options.
   */
  // TODO(LukeAbby): This constructor is a symptom of a circular error.
  // constructor(
  //   data: BaseJournalEntryPage.ConstructorData,
  //   context?: Document.ConstructionContext<BaseJournalEntryPage.Parent>,
  // );

  static [Document.Internal.DocumentName]: "JournalEntryPage";

  override parent: BaseJournalEntryPage.Parent;

  _source: BaseJournalEntryPage.Source;

  static override metadata: BaseJournalEntryPage.Metadata;

  static override defineSchema(): BaseJournalEntryPage.Schema;

  override getUserLevel(user?: User.ConfiguredInstance): foundry.CONST.DOCUMENT_OWNERSHIP_LEVELS | null;
}

export default BaseJournalEntryPage;

declare namespace BaseJournalEntryPage {
  type Parent = Scene.ConfiguredInstance | null;

  type TypeNames = Game.Model.TypeNames<"JournalEntryPage">;

  type Metadata = Document.MetadataFor<BaseJournalEntryPage>;

  type SchemaField = fields.SchemaField<Schema>;
  type ConstructorData = fields.SchemaField.CreateData<Schema>;
  type UpdateData = fields.SchemaField.AssignmentData<Schema>;
  type Properties = fields.SchemaField.InitializedData<Schema>;
  type Source = fields.SchemaField.PersistedData<Schema>;

  interface Schema extends DataSchema {
    /**
     * The _id which uniquely identifies this JournalEntryPage embedded document.
     * @defaultValue `null`
     */
    _id: fields.DocumentIdField;

    /**
     * The text name of this page.
     */
    name: fields.StringField<{ required: true; blank: false; label: "JOURNALENTRYPAGE.PageTitle"; textSearch: true }>;

    /**
     * The type of this page, in {@link BaseJournalEntryPage.TYPES}.
     * @defaultValue `"text"`
     */
    type: fields.DocumentTypeField<
      typeof BaseJournalEntryPage,
      {
        initial: "text";
      }
    >;

    /**
     * System-specific data.
     * @defaultValue `{}`
     */
    system: fields.TypeDataField<typeof BaseJournalEntryPage>;

    /**
     * Data that control's the display of this page's title.
     */
    title: fields.SchemaField<{
      /**
       * Whether to render the page's title in the overall journal view.
       * @defaultValue `true`
       */
      show: fields.BooleanField<{ initial: true }>;

      /**
       * The heading level to render this page's title at in the overall journal view.
       * @defaultValue `1`
       */
      level: fields.NumberField<{ required: true; initial: 1; min: 1; max: 6; integer: true; nullable: false }>;
    }>;

    /**
     * Data particular to image journal entry pages.
     */
    image: fields.SchemaField<{
      /**
       * A caption for the image.
       * @defaultValue `undefined`
       */
      caption: fields.StringField<{ required: false; initial: undefined }>;
    }>;

    /**
     * Data particular to text journal entry pages.
     */
    text: fields.SchemaField<{
      /**
       * The content of the JournalEntryPage in a format appropriate for its type.
       * @defaultValue `undefined`
       */
      content: fields.HTMLField<{ required: false; initial: undefined; textSearch: true }>;

      /**
       * The original markdown source, if applicable.
       * @defaultValue `undefined`
       */
      markdown: fields.StringField<{ required: false; initial: undefined }>;

      /**
       * The format of the page's content, in {@link CONST.JOURNAL_ENTRY_PAGE_FORMATS}.
       * @defaultValue `CONST.JOURNAL_ENTRY_PAGE_FORMATS.HTML`
       */
      format: fields.NumberField<{
        label: "JOURNALENTRYPAGE.Format";
        initial: typeof CONST.JOURNAL_ENTRY_PAGE_FORMATS.HTML;
        choices: foundry.CONST.JOURNAL_ENTRY_PAGE_FORMATS[];
      }>;
    }>;

    /**
     * Data particular to video journal entry pages.
     */
    video: fields.SchemaField<{
      controls: fields.BooleanField<{ initial: true }>;

      /**
       * Automatically loop the video?
       * @defaultValue `undefined`
       */
      loop: fields.BooleanField<{ required: false; initial: undefined }>;

      /**
       * Should the video play automatically?
       * @defaultValue `undefined`
       */
      autoplay: fields.BooleanField<{ required: false; initial: undefined }>;

      /**
       * The volume level of any audio that the video file contains.
       * @defaultValue `0.5`
       */
      volume: fields.AlphaField<{ required: true; step: 0.01; initial: 0.5 }>;

      /**
       * The starting point of the video, in seconds.
       * @defaultValue `undefined`
       */
      timestamp: fields.NumberField<{ required: false; min: 0; initial: undefined }>;

      /**
       * The width of the video, otherwise it will fill the available container width.
       * @defaultValue `undefined`
       */
      width: fields.NumberField<{ required: false; positive: true; integer: true; initial: undefined }>;

      /**
       * The height of the video, otherwise it will use the aspect ratio of the source video, or 16:9 if that aspect
       * ratio is not available.
       * @defaultValue `undefined`
       */
      height: fields.NumberField<{ required: false; positive: true; integer: true; initial: undefined }>;
    }>;

    /**
     * The URI of the image or other external media to be used for this page.
     * @defaultValue `null`
     */
    src: fields.StringField<{
      required: false;
      blank: false;
      nullable: true;
      initial: null;
      label: "JOURNALENTRYPAGE.Source";
    }>;

    /**
     * The numeric sort value which orders this page relative to its siblings.
     * @defaultValue `0`
     */
    sort: fields.IntegerSortField;

    /**
     * An object which configures the ownership of this page.
     * @defaultValue `CONST.DOCUMENT_OWNERSHIP_LEVELS.INHERIT`
     */
    ownership: fields.DocumentOwnershipField<{ initial: { default: typeof CONST.DOCUMENT_OWNERSHIP_LEVELS.INHERIT } }>;

    /**
     * An object of optional key/value flags.
     * @defaultValue `{}`
     */
    flags: fields.ObjectField.FlagsField<"JournalEntryPage">;

    _stats: fields.DocumentStatsField;
  }
}
