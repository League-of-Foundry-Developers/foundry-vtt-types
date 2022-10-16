import * as data from "../data/data.mjs";
import { Document } from "../abstract/module.mjs";
import { DocumentMetadata } from "../abstract/document.mjs";
import type { BaseJournalEntry } from "./baseJournalEntry.js";
import type { ConfiguredDocumentClass } from "../../../types/helperTypes.js";
import type { BaseUser } from "./baseUser.js";
import type { CONST } from "../module.mjs.js";

type JournalEntryPageMetadata = Merge<
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

/**
 * The Document definition for a JournalEntryPage.
 * Defines the data schema and common behaviours for a JournalEntryPage which are shared between both client and server.
 */
export declare class BaseJournalEntryPage extends Document<
  data.JournalEntryPageData,
  InstanceType<ConfiguredDocumentClass<typeof BaseJournalEntry>>,
  JournalEntryPageMetadata
> {
  /**
   * @param data    - Initial data from which to construct the JournalEntryPage.
   * @param context - Construction context options
   */
  constructor(data: data.JournalEntryPageData, context: DocumentConstructionContext);

  static override get schema(): typeof data.JournalEntryPageData;

  static override get metadata(): JournalEntryPageMetadata;

  // FIXME when DataModel is updated for v10
  // @ts-expect-error inherit from DataModel once complete
  static defineSchema();

  /**
   * The allowed set of JournalEntryPageData types which may exist.
   */
  // FIXME: this should be typed as Game['documentTypes']['JournalEntryPage'], but this doesn't exist yet.
  static get TYPES(): string[];

  getUserLevel(user: BaseUser): ValueOf<typeof CONST.DOCUMENT_OWNERSHIP_LEVELS> | null;
}
