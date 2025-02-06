import type { InexactPartial, LazyUnknown } from "fvtt-types/utils";
import type Document from "../../../common/abstract/document.d.mts";
import type BaseJournalEntryPage from "../../../common/documents/journal-entry-page.d.mts";

declare global {
  namespace JournalEntryPage {
    type Metadata = Document.MetadataFor<JournalEntryPage>;

    type ConfiguredClass = Document.ConfiguredClassForName<"JournalEntryPage">;
    type ConfiguredInstance = Document.ConfiguredInstanceForName<"JournalEntryPage">;

    interface DatabaseOperations extends Document.Database.Operations<JournalEntryPage> {}

    // Helpful aliases
    type TypeNames = BaseJournalEntryPage.TypeNames;
    type ConstructorData = BaseJournalEntryPage.ConstructorData;
    type UpdateData = BaseJournalEntryPage.UpdateData;
    type Schema = BaseJournalEntryPage.Schema;
    type Source = BaseJournalEntryPage.Source;

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

      /** The linear ordering of the heading in the table of contents. */
      order: number;
    }
  }

  /**
   * The client-side JournalEntryPage document which extends the common BaseJournalEntryPage document model.
   *
   * @see {@link JournalEntry}  The JournalEntry document type which contains JournalEntryPage embedded documents.
   */
  class JournalEntryPage extends ClientDocumentMixin(foundry.documents.BaseJournalEntryPage) {
    static override metadata: JournalEntryPage.Metadata;

    static get implementation(): JournalEntryPage.ConfiguredClass;

    /**
     * The cached table of contents for this JournalEntryPage.
     */
    protected _toc: Record<string, JournalEntryPage.JournalEntryPageHeading>;

    /**
     * The table of contents for this JournalEntryPage.
     */
    get toc(): Record<string, JournalEntryPage.JournalEntryPageHeading>;

    override get permission(): foundry.CONST.DOCUMENT_OWNERSHIP_LEVELS;

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

    protected override _createDocumentLink(
      eventData: unknown,
      options?: InexactPartial<{
        /**
         * A document to generate a link relative to.
         */
        relativeTo: ClientDocument;
        /**
         * A custom label to use instead of the document's name.
         */
        label: string;
      }>,
    ): string;

    override _onClickDocumentLink(event: MouseEvent): this;

    /**
     * @privateRemarks _onUpdate is overridden but with no signature changes.
     * For type simplicity it is left off. These methods historically have been the source of a large amount of computation from tsc.
     */

    protected override _buildEmbedHTML(
      config: TextEditor.DocumentHTMLEmbedConfig,
    ): Promise<HTMLCollection | HTMLElement | null>;

    protected override _createFigureEmbed(
      content: HTMLElement | HTMLCollection,
      config: TextEditor.DocumentHTMLEmbedConfig,
      options?: TextEditor.EnrichmentOptions,
    ): Promise<HTMLElement | null>;

    /**
     * Embed text page content.
     * @param config        - Configuration for embedding behavior. This can include
     *                        enrichment options to override those passed as part of
     *                        the root enrichment process.
     * @param options       - The original enrichment options to propagate to the embedded text page's
     *                        enrichment.
     * @returns
     *
     * @example Embed the content of the Journal Entry Page as a figure.
     * ```
     * @Embed[.yDbDF1ThSfeinh3Y classes="small right"]{Special caption}
     * ```
     * becomes
     * ```html
     * <figure class="content-embed small right" data-content-embed
     *         data-uuid="JournalEntry.ekAeXsvXvNL8rKFZ.JournalEntryPage.yDbDF1ThSfeinh3Y">
     *   <p>The contents of the page</p>
     *   <figcaption>
     *     <strong class="embed-caption">Special caption</strong>
     *     <cite>
     *       <a class="content-link" draggable="true" data-link
     *          data-uuid="JournalEntry.ekAeXsvXvNL8rKFZ.JournalEntryPage.yDbDF1ThSfeinh3Y"
     *          data-id="yDbDF1ThSfeinh3Y" data-type="JournalEntryPage" data-tooltip="Text Page">
     *         <i class="fas fa-file-lines"></i> Text Page
     *       </a>
     *     </cite>
     *   <figcaption>
     * </figure>
     * ```
     *
     * @example Embed the content of the Journal Entry Page into the main content flow.
     * ```
     * @Embed[.yDbDF1ThSfeinh3Y inline]
     * ```
     * becomes
     * ```html
     * <section class="content-embed" data-content-embed
     *          data-uuid="JournalEntry.ekAeXsvXvNL8rKFZ.JournalEntryPage.yDbDF1ThSfeinh3Y">
     *   <p>The contents of the page</p>
     * </section>
     * ```
     */
    protected _embedTextPage(
      config: TextEditor.DocumentHTMLEmbedConfig & TextEditor.EnrichmentOptions,
      options?: TextEditor.EnrichmentOptions,
    ): Promise<HTMLCollection>;

    /**
     * Embed image page content.
     * @param config            - Configuration for embedding behavior.
     * @param options           - The original enrichment options for cases where the Document embed content
     *                            also contains text that must be enriched.
     * @returns
     *
     * @example Create an embedded image from a sibling journal entry page.
     * ```
     * @Embed[.QnH8yGIHy4pmFBHR classes="small right"]{Special caption}
     * ```
     * becomes
     * ```html
     * <figure class="content-embed small right" data-content-embed
     *         data-uuid="JournalEntry.xFNPjbSEDbWjILNj.JournalEntryPage.QnH8yGIHy4pmFBHR">
     *   <img src="path/to/image.webp" alt="Special caption">
     *   <figcaption>
     *     <strong class="embed-caption">Special caption</strong>
     *     <cite>
     *       <a class="content-link" draggable="true" data-link
     *          data-uuid="JournalEntry.xFNPjbSEDbWjILNj.JournalEntryPage.QnH8yGIHy4pmFBHR"
     *          data-id="QnH8yGIHy4pmFBHR" data-type="JournalEntryPage" data-tooltip="Image Page">
     *         <i class="fas fa-file-image"></i> Image Page
     *       </a>
     *     </cite>
     *   </figcaption>
     * </figure>
     * ```
     */
    protected _embedImagePage(
      config: TextEditor.DocumentHTMLEmbedConfig & {
        /** Alt text for the image, otherwise the caption will be used. **/
        alt?: string | LazyUnknown;
      },
      options?: InexactPartial<TextEditor.EnrichmentOptions>,
    ): Promise<HTMLElement | HTMLCollection | null>;
  }
}
