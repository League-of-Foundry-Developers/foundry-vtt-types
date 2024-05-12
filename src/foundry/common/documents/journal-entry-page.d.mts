import type Document from "../abstract/document.d.mts";

export default class BaseJournalEntryPage extends Document {
  // TODO: Figure out if there's a good way to derive/link this
  /**
   * The allowed set of JournalEntryPageData types which may exist.
   */
  static get TYPES(): Array<string>;
}
