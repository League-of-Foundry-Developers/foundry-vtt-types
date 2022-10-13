import type { PropertiesToSource } from "../../../../types/helperTypes.js";
import type { DocumentModificationOptions } from "../../../common/abstract/document.mjs.js";
import type { CONST } from "../../../common/module.mjs.js";
import "./utils/primitives.mjs";

declare global {
  /**
   * The client-side JournalEntryPage document which extends the common BaseJournalEntryPage document model.
   *
   * @see {@link JournalEntry} The JournalEntry document type which contains JournalEntryPage embedded documents.
   */
  class JournalEntryPage extends ClientDocumentMixin(foundry.documents.BaseJournalEntryPage) {
    /**
     * The cached table of contents for this JournalEntryPage.
     */
    protected _toc: Record<string, JournalEntryPage.Heading>;

    /**
     * The table of contents for this JournalEntryPage.
     */
    get toc(): Record<string, JournalEntryPage.Heading>;

    // FIXME This should be inherited from this class's ancestor, once it's updated to v10.
    get permission(): ValueOf<typeof CONST.DOCUMENT_OWNERSHIP_LEVELS>;

    /**
     * Return a reference to the Note instance for this Journal Entry Page in the current Scene, if any.
     * If multiple notes are placed for this Journal Entry, only the first will be returned.
     */
    get sceneNote(): Note | null;

    /**
     * Convert a heading into slug suitable for use as an identifier.
     * @param heading - The heading element or some text content.
     */
    static slugifyHeading(heading: HTMLHeadingElement | string): string;

    /**
     * Build a table of contents for the given HTML content.
     * @param html - The HTML content to generate a ToC outline for.
     * @param options - Additional options to configure ToC generation.
     */
    static buildTOC(
      html: HTMLElement[],
      options: JournalEntryPage.MakeHeadingNodeOptions | undefined
    ): Record<string, JournalEntryPage.Heading>;

    /**
     * Flatten the tree structure into a single object with each node's slug as the key.
     * @param nodes - The root ToC nodes.
     */
    static _flattenTOC(nodes: JournalEntryPage.Heading[]): Record<string, JournalEntryPage.Heading>;

    /**
     * Construct a table of contents node from a heading element.
     * @param heading - The heading element.
     * @param options - Additional options to configure the returned node.
     */
    static _makeHeadingNode(
      heading: HTMLHeadingElement,
      options: JournalEntryPage.MakeHeadingNodeOptions | undefined
    ): JournalEntryPage.Heading;

    /**
     * Create a content link for this document.
     * @param eventData - The parsed object of data provided by the drop transfer event.
     * @param options - Additional options to configure link generation.
     * @internal
     */
    // FIXME Adjust once this class can properly inherit this member.
    // @ts-expect-error This should be inherited from its ancestor class, which hasn't be updated for v10 yet.
    protected override _createDocumentLink(
      eventData: DragEvent,
      options?: JournalEntryPage.CreateDocumentLinkOptions | undefined
    ): string;

    /**
     * Handle clicking on a content link for this document.
     * @param event - The triggering click event.
     */
    // FIXME Adjust once this class can properly inherit this member.
    // @ts-expect-error This should be inherited from its ancestor class, which hasn't be updated for v10 yet.
    protected override _onClickDocumentLink(event: MouseEvent): ReturnType<NonNullable<typeof this.sheet>["render"]>;

    protected _onUpdate(
      changed: DeepPartial<PropertiesToSource<JournalEntryPageDataProperties>>,
      options: DocumentModificationOptions,
      userId: string
    ): void;
  }

  namespace JournalEntryPage {
    // FIXME The referenced type in TextEditor should live in the Document namespace as of v10, so it should be changed once TextEditor is updated.
    type CreateDocumentLinkOptions = TextEditor.GetContentLinkOptions;

    interface MakeHeadingNodeOptions {
      /**
       * Whether to include the DOM element in the returned ToC node.
       * @defaultValue `true`
       */
      includeElement?: boolean | undefined;
    }

    interface Heading {
      /**
       * The heading level, 1-6.
       */
      level: number;

      /**
       * The raw heading text with any internal tags omitted.
       */
      text: string;

      /**
       * The generated slug for this heading.
       */
      slug: string;

      /**
       * The currently rendered element for this heading, if it exists.
       */
      element?: HTMLHeadingElement | undefined;

      /**
       * Any child headings of this one.
       */
      children: string[];
    }
  }
}

export {};
