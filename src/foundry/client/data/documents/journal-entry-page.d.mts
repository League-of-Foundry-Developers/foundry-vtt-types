import type {
  ConfiguredDocumentClassForName,
  ConfiguredDocumentInstanceForName,
} from "../../../../types/helperTypes.d.mts";
import type { InexactPartial } from "../../../../types/utils.d.mts";
import type { CONST } from "../../../common/module.d.mts";

declare global {
  namespace JournalEntryPage {
    type ConfiguredClass = ConfiguredDocumentClassForName<"JournalEntryPage">;
    type ConfiguredInstance = ConfiguredDocumentInstanceForName<"JournalEntryPage">;

    interface JournalEntryPageHeading {
      /** The heading level, 1-6. */
      level: number;

      /** The raw heading text with any internal tags omitted. */
      text: string;

      /** The generated slug for this heading. */
      slug: string;

      /** The currently rendered element for this heading, if it exists. */
      element?: HTMLHeadingElement;

      /** Any child headings of this one. */
      children: string[];
    }
  }

  /**
   * The client-side JournalEntryPage document which extends the common BaseJournalEntryPage document model.
   *
   * @see {@link JournalEntry}  The JournalEntry document type which contains JournalEntryPage embedded documents.
   */
  class JournalEntryPage extends ClientDocumentMixin(foundry.documents.BaseJournalEntryPage) {
    /**
     * The cached table of contents for this JournalEntryPage.
     */
    _toc: Record<string, JournalEntryPage.JournalEntryPageHeading>;

    /**
     * The table of contents for this JournalEntryPage.
     */
    get toc(): Record<string, JournalEntryPage.JournalEntryPageHeading>;

    get permission(): CONST.DOCUMENT_OWNERSHIP_LEVELS;

    /**
     * Return a reference to the Note instance for this Journal Entry Page in the current Scene, if any.
     * If multiple notes are placed for this Journal Entry, only the first will be returned.
     */
    get sceneNote(): Note | null;

    /* -------------------------------------------- */
    /*  Table of Contents                           */
    /* -------------------------------------------- */

    /**
     * Convert a heading into slug suitable for use as an identifier.
     * @param heading - The heading element or some text content.
     */
    static slugifyHeading(heading: HTMLHeadingElement | string): string;

    /**
     * Build a table of contents for the given HTML content.
     * @param html    - The HTML content to generate a ToC outline for.
     * @param options - Additional options to configure ToC generation.
     */
    static buildTOC(
      html: HTMLElement[],
      options: InexactPartial<{
        /**
         * Include references to the heading DOM elements in the returned ToC.
         * @defaultValue `true`
         */
        includeElement: boolean;
      }>,
    ): Record<string, JournalEntryPage.JournalEntryPageHeading>;

    /**
     * Flatten the tree structure into a single object with each node's slug as the key.
     * @param nodes - The root ToC nodes.
     */
    protected static _flattenTOC(
      nodes: JournalEntryPage.JournalEntryPageHeading[],
    ): Record<string, JournalEntryPage.JournalEntryPageHeading>;

    /**
     * Construct a table of contents node from a heading element.
     * @param heading - The heading element.
     * @param options - Additional options to configure the returned node.
     */
    protected static _makeHeadingNode(
      heading: HTMLHeadingElement,
      options: InexactPartial<{
        /**
         * Whether to include the DOM element in the returned ToC node.
         * @defaultValue `true`
         */
        includeElement: boolean;
      }>,
    ): JournalEntryPage.JournalEntryPageHeading;

    // TODO: More method overrides
  }
}
