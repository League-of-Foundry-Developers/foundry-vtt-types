/**
 * A collection of helper functions and utility methods related to the rich text editor
 */
declare class TextEditor {
  /**
   * Create a Rich Text Editor. The current implementation uses TinyMCE
   * @param options - Configuration options provided to the Editor init
   * @param content - Initial HTML or text content to populate the editor with
   *                  (default: `''`)
   * @returns The editor instance.
   */
  static create(options: TextEditor.Options, content: string): Promise<tinyMCE.Editor>;

  /**
   * Safely decode an HTML string, removing invalid tags and converting entities back to unicode characters.
   * @param html - The original encoded HTML string
   * @returns The decoded unicode string
   */
  static decodeHTML(html: string): string;

  /**
   * Enrich HTML content by replacing or augmenting components of it
   * @param content  - The original HTML content (as a string)
   * @param secrets  - Remove secret tags?
   * @param entities - Replace dynamic entity links?
   * @param links    - Replace hyperlink content?
   * @param rolls    - Replace inline dice rolls?
   * @param rollData - The data object providing context for inline rolls
   * @returns The enriched HTML content
   */
  static enrichHTML(
    content: string,
    {
      secrets,
      entities,
      links,
      rolls,
      rollData // TODO: _createInlineRoll
    }?: { secrets: boolean; entities: boolean; links: boolean; rolls: boolean; rollData: object }
  ): string;

  /**
   * Preview an HTML fragment by constructing a substring of a given length from its inner text.
   * @param content - The raw HTML to preview
   * @param length  - The desired length
   *                  (default: `250`)
   * @returns The previewed HTML
   */
  static previewHTML(content: string, length: number): string;

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
   */
  protected static _getTextNodes(parent: HTMLElement): Text[];

  /**
   * Facilitate the replacement of text node content using a matching regex rule and a provided replacement function.
   */
  protected static _replaceTextContent(
    text: Text[],
    rgx: RegExp,
    func: (...match: RegExpMatchArray[]) => Node
  ): boolean;

  /**
   * Replace a matched portion of a Text node with a replacement Node
   */
  protected static _replaceTextNode(text: Text, match: RegExpMatchArray, replacement: Node): void;

  /**
   * Create a dynamic entity link from a regular expression match
   * @param match  - The full matched string
   * @param type   - The matched entity type or "Compendium"
   * @param target - The requested match target (_id or name)
   * @param name   - A customized or over-ridden display name for the link
   * @returns An HTML element for the entity link
   */
  protected static _createEntityLink(match: string, type: string, target: string, name: string): HTMLAnchorElement;

  /**
   * Replace a hyperlink-like string with an actual HTML <a> tag
   * @param match - The full matched string
   * @returns An HTML element for the entity link
   */
  protected static _createHyperlink(match: string): HTMLAnchorElement;

  /**
   * Replace an inline roll formula with a rollable <a> element or an eagerly evaluated roll result
   * @param match   - The matched string
   * @param command - An optional command
   * @param formula - The matched formula
   * @param closing - The closing brackets for the inline roll
   * @returns The replaced match
   */
  protected static _createInlineRoll(
    match: string,
    command: string,
    formula: string,
    closing: string,
    ...args: object[]
  ): string;

  static activateListeners(): void;

  /**
   * Handle click events on Entity Links
   */
  protected static _onClickEntityLink(event: Event): Promise<void>;

  /**
   * Handle left-mouse clicks on an inline roll, dispatching the formula or displaying the tooltip
   * @param event - The initiating click event
   */
  protected static _onClickInlineRoll(event: MouseEvent): Promise<void | Promise<void> | Promise<ChatMessage> | object>;

  /**
   * Begin a Drag+Drop workflow for a dynamic content link
   * @param event - The originating drag event
   */
  protected static _onDragEntityLink(event: Event): void;

  /**
   * Begin a a data transfer drag event with default handling
   */
  protected _onDragStart(event: Event): void;

  /**
   * Handle dropping of transferred data onto the active rich text editor
   * @param event  - The originating drop event which triggered the data transfer
   * @param editor - The TinyMCE editor instance being dropped on
   */
  protected static _onDropEditorData(event: Event, editor: tinyMCE.Editor): Promise<void>;

  protected static _decoder: HTMLTextAreaElement;
}

declare namespace TextEditor {
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
}
