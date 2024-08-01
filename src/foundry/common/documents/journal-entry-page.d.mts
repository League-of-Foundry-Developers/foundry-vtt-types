import type { Merge } from "../../../types/utils.mts";
import type Document from "../abstract/document.mts";
import type { DocumentMetadata } from "../abstract/document.mts";
import type * as fields from "../data/fields.d.mts";
import type { CONST } from "../module.mts";
import type * as documents from "./module.mts";

declare global {
  type JournalEntryPageImageData = JournalEntryPageData["image"];

  type JournalEntryPageTextData = JournalEntryPageData["text"];

  type JournalEntryPageVideoData = JournalEntryPageData["video"];

  type JournalEntryPageTitleData = JournalEntryPageData["title"];

  type JournalEntryPageData = BaseJournalEntryPage.Properties;
}

/**
 * The Document definition for a JournalEntryPage.
 * Defines the data schema and common behaviours for a JournalEntryPage which are shared between both client and server.
 */
declare class BaseJournalEntryPage extends Document<
  BaseJournalEntryPage.Schema,
  BaseJournalEntryPage.Metadata,
  Scene.ConfiguredInstance | null
> {
  /**
   * @param data    - Initial data from which to construct the JournalEntryPage.
   * @param context - Construction context options.
   */
  constructor(data: BaseJournalEntryPage.ConstructorData, context?: DocumentConstructionContext);

  _source: BaseJournalEntryPage.Source;

  static override metadata: Readonly<BaseJournalEntryPage.Metadata>;

  static override defineSchema(): BaseJournalEntryPage.Schema;

  /**
   * The allowed set of JournalEntryPageData types which may exist.
   */
  static get TYPES(): BaseJournalEntryPage.TypeNames[];

  override getUserLevel(user: documents.BaseUser): CONST.DOCUMENT_OWNERSHIP_LEVELS | null;
}
export default BaseJournalEntryPage;

declare namespace BaseJournalEntryPage {
  type TypeNames = fields.TypeDataField.TypeNames<typeof BaseJournalEntryPage>;

  type Metadata = Merge<
    DocumentMetadata,
    {
      name: "JournalEntryPage";
      collection: "pages";
      indexed: true;
      label: "DOCUMENT.JournalEntryPage";
      labelPlural: "DOCUMENT.JournalEntryPages";
      coreTypes: ["image", "pdf", "text", "video"];
    }
  >;

  type SchemaField = fields.SchemaField<Schema>;
  type ConstructorData = fields.SchemaField.InnerConstructorType<Schema>;
  type UpdateData = fields.SchemaField.InnerAssignmentType<Schema>;
  type Properties = fields.SchemaField.InnerInitializedType<Schema>;
  type Source = fields.SchemaField.InnerPersistedType<Schema>;

  interface Schema<TypeName extends TypeNames = TypeNames> extends DataSchema {
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
    type: fields.StringField<
      {
        required: true;
        label: "JOURNALENTRYPAGE.Type";
        choices: () => typeof BaseJournalEntryPage.TYPES;
        initial: "text";
        validationError: "The JournalEntryPage type must be in the array of types supported by the game system.";
      },
      TypeName,
      TypeName,
      TypeName
    >;

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
        choices: CONST.JOURNAL_ENTRY_PAGE_FORMATS[];
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
     * System-specific data.
     * @defaultValue `{}`
     */
    system: fields.TypeDataField<typeof BaseJournalEntryPage>;

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
