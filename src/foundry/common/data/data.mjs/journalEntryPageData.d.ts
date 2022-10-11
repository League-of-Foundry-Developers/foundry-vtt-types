import { ConfiguredFlags, FieldReturnType, PropertiesToSource } from "../../../../types/helperTypes";
import { DocumentData } from "../../abstract/module.mjs.js";
import * as documents from "../../documents.mjs/index.js";
import { CONST } from "../../module.mjs.js";
import type { SystemData } from "../../packages.mjs/systemData.js";
import * as fields from "../fields.mjs.js";

declare global {
  interface JournalEntryPageDataSchema extends DocumentSchema {
    /**
     * The _id which uniquely identifies this JournalEntryPage embedded document.
     */
    _id: fields.DocumentId;
    /**
     * The text name of this page.
     */
    name: fields.StringField;

    // FIXME this should probably pull from an array of page types that receives declaration merging, but there doesn't appear to be a constant for it.
    /**
     * The type of this page, in {@link BaseJournalEntryPage.TYPES}.
     */
    type: fields.StringField;
    /**
     * Data that control's the display of this page's title.
     */
    title: DocumentField<JournalEntryPageDataSchema.Title>;
    /**
     * Data particular to image journal entry pages.
     */
    image: DocumentField<JournalEntryPageDataSchema.Image>;
    /**
     * Data particular to text journal entry pages.
     */
    text: DocumentField<JournalEntryPageDataSchema.Text>;
    /**
     *  Data particular to video journal entry pages.
     */
    video: DocumentField<JournalEntryPageDataSchema.Video>;
    /**
     * The URI of the image or other external media to be used for this page.
     */
    src: fields.StringField;
    /**
     * System-specific data.
     */
    system: fields.SystemDataField;
    /**
     * The numeric sort value which orders this page relative to its siblings.
     */
    sort: fields.IntegerSortField;
    // FIXME: This should be a DocumentOwnershipField once the relevant update is in place
    /**
     * An object which configures the ownership of this page.
     */
    ownership: fields.DocumentPermissions;
    /**
     * An object of optional key/value flags.
     */
    flags: fields.ObjectField;
  }
  /**
   * The data schema for a JournalEntry document.
   * @see BaseJournalEntryPage
   */
  namespace JournalEntryPageDataSchema {
    interface Title extends DocumentSchema {
      /**
       * Whether to render the page's title in the overall journal view.
       */
      show: fields.BooleanField;
      /**
       * The heading level to render this page's title at in the overall journal view.
       */
      level: FieldReturnType<
        fields.NonnegativeIntegerField,
        {
          required: true;
          initial: 1;
          min: 1;
          max: 6;
          integer: true;
          nullable: false;
        }
      >;
    }

    interface Image extends DocumentSchema {
      /**
       * A caption for the image.
       */
      caption: fields.StringField;
    }
    interface Text extends DocumentSchema {
      /**
       * The content of the JournalEntryPage in a format appropriate for its type.
       */
      content: fields.StringField;
      /**
       * The original markdown source, if applicable.
       */
      markdown: fields.StringField;
      /**
       * The format of the page's content, in {@link CONST.JOURNAL_ENTRY_PAGE_FORMATS }.
       */
      format: DocumentField<CONST.JOURNAL_ENTRY_PAGE_FORMATS>;
    }

    interface Video extends DocumentSchema {
      /**
       * Automatically loop the video?
       */
      loop: fields.BooleanField;
      /**
       * Should the video play automatically?
       */
      autoplay: fields.BooleanField;
      /**
       * The volume level of any audio that the video file contains.
       */
      volume: fields.AlphaField;
      /**
       * The starting point of the video, in seconds.
       */
      timestamp: fields.TimestampField;
      /**
       * The width of the video, otherwise it will fill the available container width.
       */
      width: fields.PositiveIntegerField;
      /**
       * The height of the video, otherwise it will use the aspect ratio of the source video,
       * or 16:9 if that aspect ratio is not available.
       */
      height: fields.PositiveIntegerField;
    }
  }
  interface JournalEntryPageDataProperties {
    /**
     * The _id which uniquely identifies this JournalEntryPage embedded document.
     * @defaultValue `null`
     */
    _id: string | null;

    /**
     * The text name of this page.
     */
    name: string;

    /**
     * The type of this page, in {@link BaseJournalEntryPage.TYPES}.
     */
    content: ValueOf<typeof foundry.CONST.JOURNAL_ENTRY_PAGE_FORMATS>;

    /**
     * Data that control's the display of this page's title.
     */
    title: JournalEntryPageDataProperties.Title;

    /**
     * Data particular to image journal entry pages.
     */
    image: JournalEntryPageDataProperties.Image;

    /**
     * Data particular to text journal entry pages.
     */
    text: JournalEntryPageDataProperties.Text;

    /**
     * Data particular to video journal entry pages.
     */
    video: JournalEntryPageDataProperties.Video;

    /**
     * The URI of the image or other external media to be used for this page.
     */
    src?: string | undefined;

    /**
     * System-specific data.
     */
    system: SystemData;

    /**
     * The numeric sort value which orders this page relative to its siblings.
     * @defaultValue `0`
     */
    sort: number;

    /**
     * An object which configures the ownership of this page.
     * @defaultValue `{ default: CONST.DOCUMENT_OWNERSHIP_LEVELS.NONE }`
     */
    ownership: Partial<Record<string, foundry.CONST.DOCUMENT_OWNERSHIP_LEVELS>>;

    /**
     * An object of optional key/value flags
     * @defaultValue `{}`
     */
    flags: ConfiguredFlags<"JournalEntryPage">;
  }
  namespace JournalEntryPageDataProperties {
    interface Image {
      /**
       * A caption for the image.
       */
      caption?: string | undefined;
    }

    interface Text {
      /**
       * The content of the JournalEntryPage in a format appropriate for its type.
       */
      content?: string | undefined;
      /**
       * The original markdown source, if applicable.
       */
      markdown?: string | undefined;
      /**
       * The format of the page's content, in {@link CONST.JOURNAL_ENTRY_PAGE_FORMATS}.
       */
      format: ValueOf<typeof CONST.JOURNAL_ENTRY_PAGE_FORMATS>;
    }

    interface Video {
      /**
       * Automatically loop the video?
       */
      loop?: boolean | undefined;
      /**
       * Should the video play automatically?
       */
      autoplay?: boolean | undefined;
      /**
       * The volume level of any audio that the video file contains.
       */
      volume?: number | undefined;
      /**
       * The starting point of the video, in seconds.
       */
      timestamp?: number | undefined;
      /**
       * The width of the video, otherwise it will fill the available container width.
       */
      width?: number | undefined;
      /**
       * The height of the video, otherwise it will use the aspect ratio of the source video, or 16:9 if that aspect ratio is not available.
       */
      height?: number | undefined;
    }

    interface Title {
      /**
       * Whether to render the page's title in the overall journal view.
       */
      show: boolean;
      /**
       * The heading level to render this page's title at in the overall journal view.
       */
      level: number;
    }
  }
  namespace JournalEntryPageData {
    type ConstructorDataOf<T> = {
      [P in keyof T]?: T[P] | undefined | null;
    };
    interface ConstructorData extends ConstructorDataOf<JournalEntryPageDataProperties> {
      _id?: JournalEntryPageDataProperties["_id"] | undefined;
    }
    type Title = JournalEntryPageDataProperties.Title;
    type Image = JournalEntryPageDataProperties.Image;
    type Text = JournalEntryPageDataProperties.Text;
    type Video = JournalEntryPageDataProperties.Video;
  }
  type JournalEntryPageDataSource = PropertiesToSource<JournalEntryPageDataProperties>;
}

export class JournalEntryPageData extends DocumentData<
  JournalEntryPageDataSchema,
  JournalEntryPageDataProperties,
  JournalEntryPageDataSource,
  JournalEntryPageData.ConstructorData,
  documents.BaseJournalEntryPage
> {
  constructor(data: JournalEntryPageData.ConstructorData, document?: documents.BaseJournalEntryPage | null);
  static override defineSchema(): JournalEntryPageDataSchema;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface JournalEntryPageData extends JournalEntryPageDataProperties {}
