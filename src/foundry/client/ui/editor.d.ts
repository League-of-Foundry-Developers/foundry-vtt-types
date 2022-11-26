import type { EditorView } from "prosemirror-view";
import type { ClientDocumentMixin } from "../data/abstract/client-document";
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
    static create(options?: TextEditor.Options, content?: string): Promise<tinyMCE.Editor | EditorView>;

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
    static enrichHTML(content: string, options?: Partial<TextEditor.EnrichOptions>): MaybePromise<string>;

    /**
     * Convert text of the form `@UUID[uuid]{name}` to anchor elements.
     * @param text    - The existing text content
     * @param options - Options provided to customize text enrichment
     * @returns Whether any content links were replaced and the text nodes need to be updated.
     */
    protected static _enrichContentLinks(
      text: Text[],
      options?: Partial<TextEditor.EnrichOptions>
    ): MaybePromise<boolean>;

    /**
     * Convert URLs into anchor elements.
     * @param text    - The existing text content
     * @param options - Options provided to customize text enrichment
     * @returns Whether any hyperlinks were replaced and the text nodes need to be updated
     */
    protected static _enrichHyperlinks(text: Text[], options?: Partial<TextEditor.EnrichOptions>): boolean;

    /**
     * Convert text of the form [[roll]] to anchor elements.
     * @param rollData - The data object providing context for inline rolls.
     * @param text     - The existing text content.
     * @param options  - Options provided to customize text enrichment
     * @returns Whether any inline rolls were replaced and the text nodes need to be updated.
     */
    protected static _enrichInlineRolls(
      rollData: TextEditor.EnrichOptions["rollData"],
      text: Text[],
      options?: Partial<TextEditor.EnrichOptions>
    ): MaybePromise<boolean>;

    /**
     * Match any custom registered regex patterns and apply their replacements.
     * @param pattern - The pattern to match against.
     * @param enricher - The function that will be run for each match.
     * @param text - The existing text content.
     * @param options - Options provided to customize text enrichment
     * @returns Whether any replacements were made, requiring the text nodes to be updated.
     */
    static _applyCustomEnrichers(
      pattern: RegExp,
      enricher: CONFIG.TextEditor.Enricher,
      text: Text[],
      options?: Partial<TextEditor.EnrichOptions>
    ): Promise<boolean>;

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
     *                     (default: `"…"`)
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
      func: (...match: RegExpMatchArray) => MaybePromise<HTMLElement>
    ): MaybePromise<boolean>;

    /**
     * Replace a matched portion of a Text node with a replacement Node
     * @internal
     */
    protected static _replaceTextNode(text: Text, match: RegExpMatchArray, replacement: Node): void;

    /**
     * Create a dynamic document link from a regular expression match
     * @param match   - The regular expression match
     * @param options - Additional options to configure enrichment behaviour
     * @returns An HTML element for the document link, returned as a Promise if async was true
     *          and the message contained a UUID link.
     */
    protected static _createContentLink(
      match: RegExpMatchArray,
      options?: Partial<TextEditor.CreateContentLinkOptions>
    ): MaybePromise<HTMLAnchorElement>;

    /**
     * Create a dynamic document link from an old-form document link expression
     * @param type   - The matched document type or "Compendium".
     * @param target - The requested match target (_id or name).
     * @param name   - A customized or overridden display name for the link.
     * @param data   - Data containing the properties of the resulting link element.
     * @returns Whether the resulting link is broken or not.
     * @internal
     */
    protected static _createLegacyContentLink(type: string, target: string, name: string, data: object): boolean;

    /**
     * Replace a hyperlink-like string with an actual HTML &lt;a&gt; tag
     * @param match   - The regular expression match
     * @param options - Additional options to configure enrichment behavior
     * @returns An HTML element for the document link
     * @internal
     */
    protected static _createHyperlink(match: RegExpMatchArray, options?: object): HTMLAnchorElement;

    /**
     * Replace an inline roll formula with a rollable &lt;a&gt; element or an eagerly evaluated roll result
     * @param match    - The regular expression match array
     * @param rollData - Provided roll data for use in roll evaluation
     * @param options  - Additional options to configure enrichment behavior
     * @returns The replaced match, returned as a Promise if async was true and the message contained an
     *          immediate inline roll.
     * @internal
     */
    protected static _createInlineRoll(
      match: RegExpMatchArray,
      rollData: object,
      options: TextEditor.CreateInlineRollOptions
    ): MaybePromise<HTMLAnchorElement | null>;

    /**
     * Activate listeners for the interior content of the editor frame.
     */
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
     * @param options   - Additional options to configure link creation.
     */
    // TODO: improve as part of https://github.com/League-of-Foundry-Developers/foundry-vtt-types/issues/928
    static getContentLink(eventData: object, options?: TextEditor.GetContentLinkOptions): Promise<string | null>;

    /**
     * Upload an image to a document's asset path.
     * @param uuid - The document's UUID.
     * @param file - The image file to upload.
     * @returns The path to the uploaded image.
     * @internal
     */
    static _uploadImage(uuid: string, file: File): Promise<string>;
  }

  namespace TextEditor {
    interface Options {
      /**
       * Which rich text editor engine to use, "tinymce" or "prosemirror". TinyMCE
       * is deprecated and will be removed in a later version.
       * @defaultValue "tinymce"
       */
      engine?: "tinymce" | "prosemirror";

      /**
       * @defaultValue `false`
       */
      branding?: boolean;

      /**
       * @defaultValue `["/css/mce.css"]`
       */
      content_css?: string[];

      /**
       * @defaultValue `false`
       */
      menubar?: boolean;

      /**
       * @defaultValue `"lists image table hr code save link"`
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
               * @defaultValue `"section"`
               */
              block?: string;

              /**
               * @defaultValue `"secrect"`
               */
              classes?: string;

              /**
               * @defaultValue `"Secret"`
               */
              title?: string;

              /**
               * @defaultValue `true`
               */
              wrapper?: boolean;
            }
          ];

          /**
           * @defaultValue `"Custom"`
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
       * @defaultValue `"styleselect bullist numlist image table hr link removeformat code save"`
       */
      toolbar?: string;

      fitToSize?: boolean;

      height?: number;
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
       * The data object providing context for inline rolls, or a function that produces it.
       */
      rollData: object | (() => object);

      /**
       * Perform the operation asynchronously, receiving a Promise as the returned
       * value. This will become the default behaviour in v11.
       * @defaultValue `false`
       */
      async: boolean;

      /**
       * A document to resolve relative UUIDs against.
       */
      relativeTo: ClientDocumentMixin<foundry.abstract.Document<any, any>>;
    }

    interface GetContentLinkOptions {
      /** A document to generate the link relative to. */
      relativeTo?: ClientDocumentMixin<foundry.abstract.Document<any, any>>;

      /** A custom label to use instead of the document's name. */
      label?: string;
    }

    interface CreateContentLinkOptions {
      /**
       * If asynchronous evaluation is enabled, fromUuid will be called, allowing comprehensive UUID lookup,
       * otherwise fromUuidSync will be used. (default: `false`)
       */
      async?: boolean;

      /** A document to resolve relative UUIDs against.*/
      relativeTo?: ClientDocumentMixin<foundry.abstract.Document<any, any>>;
    }

    interface CreateInlineRollOptions {
      async: boolean;
    }
  }
}
