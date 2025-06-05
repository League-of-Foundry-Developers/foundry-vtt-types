import type { AnyObject, JSONValue, MaybePromise } from "../../../../utils/index.d.mts";
import type { HTMLEnrichedContentElement } from "../elements/_module.d.mts";
import type ProseMirrorEditor from "./prosemirror-editor.mjs";

/**
 * A collection of helper functions and utility methods related to the rich text editor.
 */
declare class TextEditor {
  /**
   * Create a Rich Text Editor. The current implementation uses TinyMCE
   * @param options - Configuration options provided to the Editor init
   * @param content - Initial HTML or text content to populate the editor with (default: `""`)
   * @returns The editor instance.
   */
  static create(options: TextEditor.ProseMirrorOptions, content?: string): Promise<ProseMirrorEditor>;

  /**
   * @deprecated "The editor engine option of "tinymce" is deprecated and will be removed in V14. Please use "prosemirror" instead."
   */
  static create(options: TextEditor.TinyMCEOptions, content?: string): Promise<tinyMCE.Editor>;

  /**
   * Create a TinyMCE editor instance.
   * @param options - Configuration options passed to the editor.
   * @param content - Initial HTML or text content to populate the editor with.
   * @returns The TinyMCE editor instance.
   */
  protected static _createTinyMCE(options: TextEditor.TinyMCEOptions, content?: string): Promise<tinyMCE.Editor>;

  /**
   * Safely decode an HTML string, removing invalid tags and converting entities back to unicode characters.
   * @param html - The original encoded HTML string
   * @returns The decoded unicode string
   */
  static decodeHTML(html: string): string;

  /**
   * Enrich HTML content by replacing or augmenting components of it
   * @param content  - The original HTML content (as a string)
   * @param options  - Additional options which configure how HTML is enriched (default: `{}`)
   * @returns The enriched HTML content
   */
  static enrichHTML(content: string, options?: TextEditor.EnrichmentOptions): Promise<string>;

  /**
   * Scan for compendium UUIDs and retrieve Documents in batches so that they are in cache when enrichment proceeds.
   * @param text    - The text nodes to scan.
   * @param options - Options provided to customize text enrichment
   */
  protected static _primeCompendiums(text: Text[], options?: TextEditor.EnrichmentOptions): Promise<void>;

  /**
   * Convert text of the form `@UUID[uuid]{name}` to anchor elements.
   * @param text    - The existing text content
   * @param options - Options provided to customize text enrichment
   * @returns Whether any content links were replaced and the text nodes need to be updated.
   */
  protected static _enrichContentLinks(text: Text[], options?: TextEditor.EnrichmentOptions): Promise<boolean>;

  /**
   * Handle embedding Document content with \@Embed[uuid]\{label\} text.
   * @param text    - The existing text content
   * @param options - Options provided to customize text enrichment
   * @returns Whether any embeds were replaced and the text nodes need to be updated.
   */
  protected static _enrichEmbeds(text: Text[], options?: TextEditor.EnrichmentOptions): Promise<boolean>;

  /**
   * Convert URLs into anchor elements.
   * @param text    - The existing text content
   * @param options - Options provided to customize text enrichment
   * @returns Whether any hyperlinks were replaced and the text nodes need to be updated
   */
  protected static _enrichHyperlinks(text: Text[], options?: TextEditor.EnrichmentOptions): boolean;

  /**
   * Convert text of the form [[roll]] to anchor elements.
   * @param rollData - The data object providing context for inline rolls.
   * @param text     - The existing text content.
   * @param options  - Options provided to customize text enrichment
   * @returns Whether any inline rolls were replaced and the text nodes need to be updated.
   */
  protected static _enrichInlineRolls(
    rollData: TextEditor.EnrichmentOptions["rollData"],
    text: Text[],
    options?: TextEditor.EnrichmentOptions,
  ): Promise<boolean>;

  /**
   * Match any custom registered regex patterns and apply their replacements.
   * @param config  - The custom enricher configuration.
   * @param text    - The existing text content.
   * @param options - Options provided to customize text enrichment
   * @returns Whether any replacements were made, requiring the text nodes to be updated.
   */
  static _applyCustomEnrichers(
    config: TextEditor.EnricherConfig,
    text: Text[],
    options?: TextEditor.EnrichmentOptions,
  ): Promise<boolean>;

  /**
   * Preview an HTML fragment by constructing a substring of a given length from its inner text.
   * @param content - The raw HTML to preview
   * @param length  - The desired length (default: `250`)
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
   * @param options    - Options which affect the behavior of text truncation
   */
  static truncateText(text: string, options?: TextEditor.TruncateTextOptions): string;

  /**
   * Facilitate the replacement of text node content using a matching regex rule and a provided replacement function.
   * @param text - The text nodes to match and replace.
   * @param rgx  - The provided regular expression for matching and replacement
   * @param func - The replacement function
   * @param options - Options to configure text replacement behavior.
   * @returns Whether a replacement was made.
   */
  protected static _replaceTextContent(
    text: Text[],
    rgx: RegExp,
    func: TextEditor.TextContentReplacer,
    options?: TextEditor.TextReplacementOptions,
  ): Promise<boolean>;

  /**
   * Create a dynamic document link from a regular expression match
   * @param match   - The regular expression match
   * @param options - Additional options to configure enrichment behaviour
   * @returns An HTML element for the document link.
   */
  protected static _createContentLink(
    match: RegExpMatchArray,
    options?: TextEditor.CreateContentLinkOptions,
  ): Promise<HTMLAnchorElement>;

  /**
   * Helper method to create an anchor element.
   * @param options - Options to configure the anchor's construction.
   */
  static createAnchor(options?: TextEditor.EnrichmentAnchorOptions): HTMLAnchorElement;

  /**
   * Embed content from another Document.
   * @param match   - The regular expression match.
   * @param options - Options provided to customize text enrichment.
   * @returns A representation of the Document as HTML content, or null if the Document could not be embedded.
   */
  protected static _embedContent(
    match: RegExpMatchArray,
    options?: TextEditor.EnrichmentOptions,
  ): Promise<HTMLElement | null>;

  /**
   * Parse the embed configuration to be passed to ClientDocument#toEmbed.
   * The return value will be an object of any key=value pairs included with the configuration, as well as a separate
   * values property that contains all the options supplied that were not in key=value format.
   * If a uuid key is supplied it is used as the Document's UUID, otherwise the first supplied UUID is used.
   * @param raw     - The raw matched config string.
   * @param options - Options forwarded to parseUuid.
   *
   * @example Example configurations.
   * ```js
   * TextEditor._parseEmbedConfig('uuid=Actor.xyz caption="Example Caption" cite=false');
   * // Returns: { uuid: "Actor.xyz", caption: "Example Caption", cite: false, values: [] }
   *
   * TextEditor._parseEmbedConfig('Actor.xyz caption="Example Caption" inline');
   * // Returns: { uuid: "Actor.xyz", caption: "Example Caption", values: ["inline"] }
   * ```
   */
  protected static _parseEmbedConfig(
    raw: string,
    options?: foundry.utils.ParseUUIDOptions,
  ): TextEditor.DocumentHTMLEmbedConfig;

  /**
   * Replace a hyperlink-like string with an actual HTML &lt;a&gt; tag
   * @param match   - The regular expression match
   * @param options - Options provided to customize text enrichment
   * @returns An HTML element for the document link
   */
  protected static _createHyperlink(
    match: RegExpMatchArray,
    options?: TextEditor.EnrichmentOptions,
  ): Promise<HTMLAnchorElement>;

  /**
   * Replace an inline roll formula with a rollable &lt;a&gt; element or an eagerly evaluated roll result
   * @param match    - The regular expression match array
   * @param rollData - Provided roll data for use in roll evaluation
   * @param options  - Options provided to customize text enrichment (default: `{}`)
   * @returns The replaced match. Returns null if the contained command is not a valid roll expression.
   * @internal
   */
  protected static _createInlineRoll(
    match: RegExpMatchArray,
    rollData: AnyObject,
    options?: TextEditor.EnrichmentOptions,
  ): Promise<HTMLAnchorElement | null>;

  /**
   * Activate listeners for the interior content of the editor frame.
   */
  static activateListeners(): void;

  /**
   * Handle left-mouse clicks on an inline roll, dispatching the formula or displaying the tooltip
   * @param event - The initiating click event
   */
  protected static _onClickInlineRoll(event: MouseEvent): void;

  /**
   * Extract JSON data from a drag/drop event.
   * @param event - The drag event which contains JSON data.
   * @returns The extracted JSON data. The object will be empty if the DragEvent did not contain JSON-parseable data.
   * @remarks `TokensLayer#_onDropActorData` returns a number - a notification ID - the  if the user lacks permissions
   * @remarks `User#assignHotbarMacro` returns a promise to a user document
   */
  static getDragEventData(event: DragEvent): JSONValue;

  /**
   * Given a Drop event, returns a Content link if possible such as `"@Actor[ABC123]"`, else `null`
   * @param eventData - The parsed object of data provided by the transfer event
   * @param options   - Additional options to configure link creation.
   */
  static getContentLink(
    eventData: JSONValue,
    options?: ClientDocument.CreateDocumentLinkOptions,
  ): Promise<string | null>;

  /**
   * Upload an image to a document's asset path.
   * @param uuid - The document's UUID.
   * @param file - The image file to upload.
   * @returns The path to the uploaded image.
   * @internal
   */
  protected static _uploadImage(uuid: string, file: File): Promise<string | void>;

  /**
   * Retrieve the configured TextEditor implementation.
   * @remarks TODO: Link up with CONFIG
   */
  static get implementation(): typeof TextEditor;

  #private: true;
}

declare namespace TextEditor {
  type Options = ProseMirrorOptions | TinyMCEOptions;

  interface ProseMirrorOptions extends ProseMirrorEditor.CreateOptions {
    /**
     * Which rich text editor engine to use, "tinymce" or "prosemirror". TinyMCE
     * is deprecated and will be removed in a later version.
     * @defaultValue `"tinymce"`
     */
    engine: "prosemirror";

    target: HTMLElement;
  }

  interface TinyMCEOptions extends tinyMCE.RawEditorOptions {
    /**
     * Which rich text editor engine to use, "tinymce" or "prosemirror". TinyMCE
     * is deprecated and will be removed in a later version.
     * @defaultValue `"tinymce"`
     */
    engine: "tinymce";
  }

  interface EnrichmentOptions {
    /**
     * Include secret tags in the final HTML? If false secret blocks will be removed.
     * @defaultValue `false`
     */
    secrets?: boolean | undefined;

    /**
     * Replace dynamic document links?
     * @defaultValue `true`
     */
    documents?: boolean | undefined;

    /**
     * Replace hyperlink content?
     * @defaultValue `true`
     */
    links?: boolean | undefined;

    /**
     * Replace inline dice rolls?
     * @defaultValue `true`
     */
    rolls?: boolean | undefined;

    /**
     * Replace embedded content?
     * @defaultValue `true`
     */
    embeds?: boolean | undefined;

    _embedDepth?: number | null | undefined;

    /**
     * Apply custom enrichers?
     * @defaultValue `true`
     */
    custom?: boolean | undefined;

    /**
     * The data object providing context for inline rolls, or a function that produces it.
     */
    rollData?: AnyObject | (() => AnyObject) | undefined;

    /**
     * A document to resolve relative UUIDs against.
     */
    relativeTo?: foundry.abstract.Document.Any | undefined;
  }

  interface TextReplacementOptions {
    /** Hoist the replacement element out of its containing element if it would be the only child of that element. */
    replaceParent?: boolean | undefined;
  }

  /**
   * @param match - The regular expression match.
   * @returns The HTML to replace the matched content with.
   */
  type TextContentReplacer = (match: RegExpMatchArray) => Promise<HTMLElement>;

  interface DocumentHTMLEmbedConfig {
    /**
     * Any strings that did not have a key name associated with them.
     */
    values: string[];

    /**
     * Classes to attach to the outermost element.
     */
    classes?: string | undefined;

    /**
     * By default Documents are embedded inside a figure element. If this option is
     * passed, the embed content will instead be included as part of the rest of the
     * content flow, but still wrapped in a section tag for styling purposes.
     * @defaultValue `false`
     */
    inline: boolean;

    /**
     * Whether to include a content link to the original Document as a citation. This
     * options is ignored if the Document is inlined.
     * @defaultValue `true`
     */
    cite: boolean;

    /**
     * Whether to include a caption. The caption will depend on the Document being
     * embedded, but if an explicit label is provided, that will always be used as the
     * caption. This option is ignored if the Document is inlined.
     * @defaultValue `true`
     */
    caption: boolean;

    /**
     * Controls whether the caption is rendered above or below the embedded
     * content.
     * @defaultValue `"bottom"`
     */
    captionPosition: string;

    /** The label. */
    label: string;
  }

  interface EnrichmentAnchorOptions {
    /** Attributes to set on the anchor. */
    attrs?: Record<string, string> | undefined;

    /** Data- attributes to set on the anchor. */
    dataset?: Record<string, string> | undefined;

    /** Classes to add to the anchor. */
    classes?: string[] | undefined;

    /** The anchor's content. */
    name?: string | undefined;

    /** A font-awesome icon class to use as the icon. */
    icon?: string | undefined;
  }

  /**
   * @param match   - The regular expression match result
   * @param options - Options provided to customize text enrichment
   * @returns An HTML element to insert in place of the matched text or null to indicate that
   *          no replacement should be made.
   */
  // Defined in `client/config.mjs`
  type Enricher = (match: RegExpMatchArray, options?: EnrichmentOptions) => MaybePromise<HTMLElement | null>;

  // Defined in `client/config.mjs`
  interface EnricherConfig {
    /** The string pattern to match. Must be flagged as global. */
    pattern: RegExp;

    /**
     * Hoist the replacement element out of its containing element if it replaces the entire contents of the element.
     * @defaultValue `false`
     */
    replaceParent?: boolean | undefined;

    /**
     * The function that will be called on each match. It is expected that this returns an HTML element
     * to be inserted into the final enriched content.
     */
    enricher: Enricher;

    onRender?: ((el: HTMLEnrichedContentElement) => void) | undefined | null;
  }

  interface TruncateTextOptions {
    /**
     * The maximum allowed length of the truncated string.
     * @defaultValue `50`
     */
    maxLength?: number | undefined;

    /**
     * Whether to truncate by splitting on white space (if true) or breaking words.
     * @defaultValue `true`
     */
    splitWords?: boolean | undefined;

    /**
     * A suffix string to append to denote that the text was truncated.
     * @defaultValue `"…"`
     */
    suffix?: string | undefined;
  }

  type CreateContentLinkOptions = Omit<ClientDocument.CreateDocumentLinkOptions, "label">;
}

export default TextEditor;
