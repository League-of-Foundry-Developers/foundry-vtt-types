import { ConfiguredDocumentClass, ConfiguredFlags, PropertiesToSource } from "../../../../types/helperTypes";
import { DocumentData } from "../../abstract/module.mjs.js";
import * as documents from "../../documents.mjs/index.js";
import { CONST } from "../../module.mjs.js";
import type { SystemData } from "../../packages.mjs/systemData.js";
import * as fields from "../fields.mjs.js";

interface JournalEntryPageDataSchema extends DocumentSchema {
  _id: fields.DocumentId;
  name: fields.RequiredString;
  required: fields.RequiredString;
  title: DocumentField<{
    show: fields.BooleanField;
    level: fields.PositiveIntegerField;
  }>;
  image: DocumentField<{
    caption: fields.StringField;
  }>;
  text: DocumentField<{
    content: fields.BlankString;
    markdown: fields.StringField;
    format: DocumentField<ValueOf<typeof CONST.JOURNAL_ENTRY_PAGE_FORMATS>>;
  }>;
  video: DocumentField<{
    controls: fields.BooleanField;
    loop: fields.BooleanField;
    autoplay: fields.BooleanField;
    volume: fields.AlphaField;
    timestamp: fields.NonnegativeNumberField;
    width: fields.PositiveIntegerField;
    height: fields.PositiveIntegerField;
  }>;
  src: fields.StringField;
  system: fields.SystemDataField;
  sort: fields.IntegerSortField;
  ownership: fields.DocumentPermissions;
  flags: fields.ObjectField;
}

interface JournalEntryPageImageDataProperties {
  /**
   * A caption for the image.
   */
  caption?: string | undefined;
}

interface JournalEntryPageTextDataProperties {
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

interface JournalEntryPageVideoDataProperties {
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

interface JournalEntryPageTitleDataProperties {
  /**
   * Whether to render the page's title in the overall journal view.
   */
  show: boolean;
  /**
   * The heading level to render this page's title at in the overall journal view.
   */
  level: number;
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
  title: JournalEntryPageTitleDataProperties;

  /**
   * Data particular to image journal entry pages.
   */
  image: JournalEntryPageImageDataProperties;

  /**
   * Data particular to text journal entry pages.
   */
  text: JournalEntryPageTextDataProperties;

  /**
   * Data particular to video journal entry pages.
   */
  video: JournalEntryPageVideoDataProperties;

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
type ConstructorDataOf<T> = {
  [P in keyof T]?: T[P] | undefined | null;
};

interface JournalEntryPageDataConstructorData extends ConstructorDataOf<JournalEntryPageDataProperties> {
  _id?: JournalEntryPageDataProperties["_id"] | undefined;
}

type JournalEntryPageDataSource = PropertiesToSource<JournalEntryPageDataProperties>;

/**
 * The data schema for a JournalEntry document.
 * @see BaseJournalEntryPage
 */
export class JournalEntryPageData extends DocumentData<
  JournalEntryPageDataSchema,
  JournalEntryPageDataProperties,
  JournalEntryPageDataSource,
  JournalEntryPageDataConstructorData,
  documents.BaseJournalEntryPage
> {
  constructor(data: JournalEntryPageDataConstructorData, document?: documents.BaseJournalEntryPage | null);

  static override defineSchema(): JournalEntryPageDataSchema;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface

export type JournalEntryPageTitleData = JournalEntryPageTitleDataProperties;
export type JournalEntryPageImageData = JournalEntryPageImageDataProperties;
export type JournalEntryPageTextData = JournalEntryPageTextDataProperties;
export type JournalEntryPageVideoData = JournalEntryPageVideoDataProperties;
