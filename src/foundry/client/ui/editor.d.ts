import type { ConfiguredDocumentClassForName } from '../../../types/helperTypes';

declare global {
  /**
   * A collection of helper functions and utility methods related to the rich text editor
   */
  class TextEditor {
    /**
     * Create a Rich Text Editor. The current implementation uses TinyMCE
     * @param options - Configuration options provided to the Editor init
     * @param content - Initial HTML or text content to populate the editor with
     *                  (default: `""`)
     * @returns The editor instance.
     */
    static create(options: TextEditor.Options, content: string): Promise<tinyMCE.Editor>;

    /**
     * A list of elements that are retained when truncating HTML.
     * @internal
     */
    protected static _PARAGRAPH_ELEMENTS: Set<string>;

    /**
     * Safely decode an HTML string, removing invalid tags and converting entities back to unicode characters.
     * @param html - The original encoded HTML string
     * @returns The decoded unicode string
     */
    static decodeHTML(html: string): string;

    /**
     * Enrich HTML content by replacing or augmenting components of it
     * @param content  - The original HTML content (as a string)
     * @param options  - Additional options which configure how HTML is enriched
     *                   (default: `{}`)
     * @returns The enriched HTML content
     */
    static enrichHTML(content: string, options?: Partial<TextEditor.EnrichOptions>): string;

    /**
     * Preview an HTML fragment by constructing a substring of a given length from its inner text.
     * @param content - The raw HTML to preview
     * @param length  - The desired length
     *                  (default: `250`)
     * @returns The previewed HTML
     */
    static previewHTML(content: string, length?: number): string;

    /**
     * Sanitises an HTML fragment and removes any non-paragraph-style text.
     * @param html       - The root HTML element.
     */
    static truncateHTML(html: HTMLElement): HTMLElement;

    /**
     * Truncate a fragment of text to a maximum number of characters.
     * @param text       - The original text fragment that should be truncated to a maximum length
     * @param maxLength  - The maximum allowed length of the truncated string.
     *                     (default: `50`)
     * @param splitWords - Whether to truncate by splitting on white space (if true) or breaking words.
     *                     (default: `true`)
     * @param suffix     - A suffix string to append to denote that the text was truncated.
     *                     (default: `'…'`)
     */
    static truncateText(
      text: string,
      { maxLength, splitWords, suffix }?: { maxLength?: number; splitWords?: boolean; suffix?: string }
    ): string;

    /**
     * Recursively identify the text nodes within a parent HTML node for potential content replacement.
     * @param parent - The parent HTML Element
     * @returns An array of contained Text nodes
     * @internal
     */
    protected static _getTextNodes(parent: HTMLElement): Text[];

    /**
     * Facilitate the replacement of text node content using a matching regex rule and a provided replacement function.
     * @internal
     */
    protected static _replaceTextContent(
      text: Text[],
      rgx: RegExp,
      func: (...match: RegExpMatchArray) => Node
    ): boolean;

    /**
     * Replace a matched portion of a Text node with a replacement Node
     * @internal
     */
    protected static _replaceTextNode(text: Text, match: RegExpMatchArray, replacement: Node): void;

    /**
     * Create a dynamic document link from a regular expression match
     * @param match  - The full matched string
     * @param type   - The matched document type or "Compendium"
     * @param target - The requested match target (_id or name)
     * @param name   - A customized or over-ridden display name for the link
     * @returns An HTML element for the document link
     * @internal
     */
    protected static _createContentLink(match: string, type: string, target: string, name: string): HTMLAnchorElement;

    /**
     * Replace a hyperlink-like string with an actual HTML &lt;a&gt; tag
     * @param match - The full matched string
     * @returns An HTML element for the document link
     * @internal
     */
    protected static _createHyperlink(match: string): HTMLAnchorElement;

    /**
     * Replace an inline roll formula with a rollable &lt;a&gt; element or an eagerly evaluated roll result
     * @param match   - The matched string
     * @param command - An optional command
     * @param formula - The matched formula
     * @param closing - The closing brackets for the inline roll
     * @param label   - An optional label which configures the button text
     * @returns The replaced match
     * @internal
     */
    protected static _createInlineRoll(
      match: string,
      command: string,
      formula: string,
      closing: string,
      label?: string,
      ...args: object[]
    ): HTMLAnchorElement | null;

    static activateListeners(): void;

    /**
     * Handle click events on Document Links
     * @internal
     */
    protected static _onClickContentLink(event: MouseEvent): void;

    /**
     * Handle left-mouse clicks on an inline roll, dispatching the formula or displaying the tooltip
     * @param event - The initiating click event
     * @internal
     */
    protected static _onClickInlineRoll(event: MouseEvent): void;

    /**
     * Toggle playing or stopping an embedded {@link PlaylistSound} link.
     * @param doc - The PlaylistSound document to play/stop.
     * @internal
     */
    protected static _onPlaySound(doc: InstanceType<ConfiguredDocumentClassForName<'PlaylistSound'>>): void;

    /**
     * Find all content links belonging to a given {@link PlaylistSound}.
     * @param doc - The PlaylistSound.
     * @internal
     */
    protected static _getSoundContentLinks(
      doc: InstanceType<ConfiguredDocumentClassForName<'PlaylistSound'>>
    ): NodeListOf<Element>;

    /**
     * Begin a Drag+Drop workflow for a dynamic content link
     * @param event - The originating drag event
     * @internal
     */
    protected static _onDragContentLink(event: DragEvent): void;

    /**
     * Handle dropping of transferred data onto the active rich text editor
     * @param event  - The originating drop event which triggered the data transfer
     * @param editor - The TinyMCE editor instance being dropped on
     * @internal
     */
    protected static _onDropEditorData(event: DragEvent, editor: tinyMCE.Editor): void;

    /**
     * Extract JSON data from a drag/drop event.
     * @param event - The drag event which contains JSON data.
     * @returns The extracted JSON data. The object will be empty if the DragEvent did not contain
     *          JSON-parseable data.
     */
    protected static getDragEventData(event: DragEvent): object;

    /**
     * Given a Drop event, returns a Content link if possible such as `@Actor[ABC123]`, else null
     * @param eventData - The parsed object of data provided by the transfer event
     */
    // TODO: improve as part of https://github.com/League-of-Foundry-Developers/foundry-vtt-types/issues/928
    static getContentLink(eventData: object): Promise<string | null>;

    /**
     * @deprecated since v9 - Use _onDragContentLink instead.
     * @internal
     */
    protected static _onDragEntityLink(
      ...args: Parameters<typeof TextEditor['_onDragContentLink']>
    ): ReturnType<typeof TextEditor['_onDragContentLink']>;

    /**
     * Singleton decoder area
     * @internal
     */
    protected static _decoder: HTMLTextAreaElement;
  }

  namespace TextEditor {
    interface Options {
      /**
       * @defaultValue `false`
       */
      branding?: boolean;

      /**
       * @defaultValue `['/css/mce.css']`
       */
      content_css?: string[];

      /**
       * @defaultValue `false`
       */
      menubar?: boolean;

      /**
       * @defaultValue `'lists image table hr code save link'`
       */
      plugins?: string;

      /**
       * @defaultValue `true`
       */
      save_enablewhendirty?: boolean;

      /**
       * @defaultValue `false`
       */
      statusbar?: boolean;

      style_formats?: [
        {
          items?: [
            {
              /**
               * @defaultValue `'section'`
               */
              block?: string;

              /**
               * @defaultValue `'secrect'`
               */
              classes?: string;

              /**
               * @defaultValue `'Secret'`
               */
              title?: string;

              /**
               * @defaultValue `true`
               */
              wrapper?: boolean;
            }
          ];

          /**
           * @defaultValue `'Custom'`
           */
          title?: string;
        }
      ];

      /**
       * @defaultValue `true`
       */
      style_formats_merge?: boolean;

      /**
       * @defaultValue `{}`
       */
      table_default_styles?: object;

      target: HTMLElement;

      /**
       * @defaultValue `'styleselect bullist numlist image table hr link removeformat code save'`
       */
      toolbar?: string;
    }

    interface EnrichOptions {
      /**
       * Include secret tags in the final HTML? If false secret blocks will be removed.
       * @defaultValue `false`
       */
      secrets: boolean;

      /**
       * Replace dynamic document links?
       * @defaultValue `true`
       */
      documents: boolean;

      /**
       * Replace hyperlink content?
       * @defaultValue `true`
       */
      links: boolean;

      /**
       * Replace inline dice rolls?
       * @defaultValue `true`
       */
      rolls: boolean;

      /**
       * The data object providing context for inline rolls
       */
      rollData: object | (() => object);
    }
  }
}
