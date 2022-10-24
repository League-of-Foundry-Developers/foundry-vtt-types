import type { EditorView } from "prosemirror-view";
import type Showdown from "showdown";
import type { Editor } from "tinymce";
import type { CONST } from "../../../common/module.mjs.js";

declare global {
  /**
   * The Application responsible for displaying and editing a single {@link JournalEntryPage} document.
   *
   * @typeParam ConcreteOptions - The type of the options object
   */
  class JournalPageSheet<
    ConcreteOptions extends JournalPageSheet.Options = JournalPageSheet.Options
  > extends DocumentSheet<ConcreteOptions, JournalEntryPage> {
    /**
     * @defaultValue
     * ```typescript
     * foundry.utils.mergeObject(super.defaultOptions, {
     *   classes: ["sheet", "journal-sheet", "journal-entry-page"],
     *   width: 600,
     *   height: 680,
     *   resizable: true,
     *   closeOnSubmit: false,
     *   submitOnClose: true,
     *   viewPermission: CONST.DOCUMENT_OWNERSHIP_LEVELS.OBSERVER
     * });
     * ```
     */
    static get defaultOptions(): JournalPageSheet.Options;

    get template(): string;

    get title(): string;

    activateEditor(
      name: string,
      options?: TextEditor.Options | undefined,
      initialContent?: string | undefined
    ): Promise<Editor | EditorView>;

    override getData(options?: Partial<ConcreteOptions> | undefined): Promise<JournalPageSheet.Data<ConcreteOptions>>;

    protected _renderInner(data: object): Promise<JQuery<HTMLElement>>;
  }

  namespace JournalPageSheet {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface Options extends DocumentSheetOptions {}
    interface Data<T extends JournalPageSheet.Options | undefined = JournalPageSheet.Options | undefined> {
      cssClass: string;
      editable: boolean;
      document: JournalEntryPage;
      data: ReturnType<JournalEntryPage["toObject"]>;
      limited: JournalEntryPage["limited"];
      options?: Partial<T>;
      owner: JournalEntryPage["isOwner"];
      title: string;
    }
  }

  /**
   * The Application responsible for displaying and editing a single {@link JournalEntryPage} text document.
   */
  class JournalTextPageSheet<
    ConcreteOptions extends JournalTextPageSheet.Options = JournalTextPageSheet.Options
  > extends JournalPageSheet<ConcreteOptions> {
    /**
     * Bi-directional HTML \<-\> Markdown converter.
     */
    static _converter: Showdown.Converter;

    /**
     * Declare the format that we edit text content in for this sheet so we can perform conversions as necessary.
     * @defaultValue {@link CONST.JOURNAL_ENTRY_PAGE_FORMATS.HTML}
     */
    static get format(): ValueOf<typeof CONST.JOURNAL_ENTRY_PAGE_FORMATS>;

    /**
     * @defaultValue
     * ```typescript
     * const options = super.defaultOptions;
     * options.classes.push("text");
     * options.secrets.push({parentSelector: "section"});
     * ```
     */
    static get defaultOptions(): JournalTextPageSheet.Options;

    /**
     * The table of contents for this JournalTextPageSheet.
     * @defaultValue `{}`
     */
    toc: ReturnType<typeof JournalEntryPage["buildTOC"]>;

    override getData(options?: Partial<ConcreteOptions> | undefined): Promise<JournalPageSheet.Data<ConcreteOptions>>;

    close(options?: FormApplication.CloseOptions | undefined): Promise<void>;

    protected _render(
      force?: boolean | undefined,
      options?: Application.RenderOptions<ConcreteOptions> | undefined
    ): Promise<void>;

    /**
     * Determine if any editors are dirty.
     */
    isEditorDirty(): boolean;

    activateEditor(
      name: string,
      options?: TextEditor.Options | undefined,
      initialContent?: string | undefined
    ): Promise<Editor | EditorView>;

    protected _renderInner(data: object): Promise<JQuery<HTMLElement>>;

    protected _getSecretContent(secret: HTMLElement): string;

    // FIXME: revisit this when it's added to its ancestor classes
    protected _updateSecret(secret: HTMLElement, content: string): Promise<this>;

    protected _updateObject(event: Event, formData: object): Promise<unknown>;

    /**
     * Lazily convert text formats if we detect the document being saved in a different format.
     * @param renderData - Render data.
     */
    protected _convertFormats(renderData: ReturnType<typeof this["getData"]>): void;

    /**
     * Update the UI appropriately when receiving new steps from another client.
     */
    onNewSteps(): void;
  }

  namespace JournalTextPageSheet {
    interface Options extends JournalPageSheet.Options {
      editor: {
        engine: Required<TextEditor.Options>["engine"];
        collaborate: boolean;
        content: ReturnType<typeof TextEditor.enrichHTML>;
      };
    }
  }

  /**
   * The Application responsible for displaying and editing a single {@link JournalEntryPage} image document.
   */
  class JournalImagePageSheet extends JournalPageSheet<JournalImagePageSheet.Options> {
    /**
     * @defaultValue
     * ```typescript
     * const options = super.defaultOptions;
     * options.classes.push("image");
     * options.height = "auto";
     * ```
     */
    static override get defaultOptions(): JournalImagePageSheet.Options;
  }

  namespace JournalImagePageSheet {
    type Options = JournalPageSheet.Options;
  }

  /**
   * The Application responsible for displaying and editing a single {@link JournalEntryPage} video document.
   */
  class JournalVideoPageSheet extends JournalPageSheet<JournalVideoPageSheet.Options> {
    static get defaultOptions(): JournalVideoPageSheet.Options;

    getData(
      options?: Partial<JournalVideoPageSheet.Options> | undefined
    ): Promise<JournalPageSheet.Data<JournalVideoPageSheet.Options>>;

    activateListeners(html: JQuery<HTMLElement>): void;

    /**
     * Get the YouTube player parameters depending on whether the sheet is being viewed or edited.
     */
    protected _getYouTubeVars(): JournalVideoPageSheet.YouTubeVars;

    protected _getSubmitData(updateData?: object | null | undefined): Record<string, unknown>;

    /**
     * Convert time components to a timestamp in seconds.
     * @param param0 - The time components.
     * @returns The timestamp, in seconds.
     */
    protected _timeComponentsToTimestamp({ h, m, s }: Partial<JournalVideoPageSheet.TimeComponents>): number;

    /**
     * Convert a timestamp in seconds into separate time components.
     * @param timestamp - The timestamp, in seconds.
     * @returns The individual time components
     */
    protected _timestampToTimeComponents(timestamp: number): JournalVideoPageSheet.TimeComponents;
  }

  namespace JournalVideoPageSheet {
    type Options = JournalPageSheet.Options;

    interface Data extends JournalPageSheet.Data {
      flexRatio: boolean;
      isYouTube: boolean;
      timestamp: TimeComponents;
      yt: YouTube;
    }

    /**
     * Variables to be passed to YouTube's API.
     * @see https://developers.google.com/youtube/player_parameters#Parameters
     * @remarks Note that the `start` parameter diverges from its API description linked above. It isn't a number to be passed to the API directly, but a {@link TimeComponents} object (that FVTT converts into a number).
     */
    // Adapted from @types/youtube-player
    interface YouTubeVars {
      autoplay?: 0 | 1 | undefined;
      cc_lang_pref?: string | undefined;
      cc_load_policy?: 1 | undefined;
      color?: "red" | "white" | undefined;
      controls?: 0 | 1 | undefined;
      disablekb?: 0 | 1 | undefined;
      enablejsapi?: 0 | 1 | undefined;
      end?: number | undefined;
      fs?: 0 | 1 | undefined;
      hl?: string | undefined;
      iv_load_policy?: 1 | 3 | undefined;
      list?: string | undefined;
      listType?: "playlist" | "search" | "user_uploads" | undefined;
      loop?: 0 | 1 | undefined;
      modestbranding?: 0 | 1 | undefined;
      origin?: string | undefined;
      playlist?: string | undefined;
      playsinline?: 0 | 1 | undefined;
      rel?: 0 | 1 | undefined;
      start?: TimeComponents | undefined;
      widget_referrer?: string | undefined;
    }

    interface TimeComponents {
      h: number;
      m: number;
      s: number;
    }

    interface YouTube {
      id: string;
      url: string;
    }
  }

  /**
   * The Application responsible for displaying and editing a single {@link JournalEntryPage} PDF document.
   */
  class JournalPDFPageSheet extends JournalPageSheet<JournalPDFPageSheet.Options> {
    /**
     * @defaultValue
     * ```typescript
     * const options = super.defaultOptions;
     * options.classes.push("pdf");
     * options.height = "auto";
     * ```
     */
    static get defaultOptions(): JournalPDFPageSheet.Options;

    /**
     * Maintain a cache of PDF sizes to avoid making HEAD requests every render.
     */
    protected static _sizes: Record<string, number>;

    activateListeners(html: JQuery<HTMLElement>): void;

    getData(options?: Partial<JournalPDFPageSheet.Options> | undefined): Promise<JournalPDFPageSheet.Data>;

    protected _renderInner(data: object): Promise<JQuery<HTMLElement>>;

    /**
     * Handle a request to load a PDF.
     * @param event - The triggering event.
     */
    protected _onLoadPDF(event: MouseEvent): void;

    /**
     * Retrieve parameters to pass to the PDF viewer.
     */
    protected _getViewerParams(): URLSearchParams;
  }

  namespace JournalPDFPageSheet {
    type Options = JournalPageSheet.Options;
    type Data = JournalPageSheet.Data<JournalPDFPageSheet.Options> & {
      params: ReturnType<JournalPDFPageSheet["_getViewerParams"]>;
    };
  }

  /**
   * A subclass of {@link JournalTextPageSheet} that implements a markdown editor for editing the text content.
   */
  class MarkdownJournalPageSheet extends JournalTextPageSheet<MarkdownJournalPageSheet.Options> {
    /**
     * Store the dirty flag for this editor.
     * @defaultValue `false`
     */
    protected _isDirty: boolean;

    static override get format(): typeof CONST.JOURNAL_ENTRY_PAGE_FORMATS.MARKDOWN;

    /**
     * @defaultValue
     * ```typescript
     * const options = super.defaultOptions;
     * options.dragDrop = [{dropSelector: "textarea"}];
     * options.classes.push("markdown");
     * ```
     */
    static get defaultOptions(): MarkdownJournalPageSheet.Options;

    get template(): string;

    getData(
      options?: Partial<MarkdownJournalPageSheet.Options> | undefined
    ): Promise<JournalPageSheet.Data<MarkdownJournalPageSheet.Options>>;

    activateListeners(html: JQuery<HTMLElement>): void;

    isEditorDirty(): boolean;

    protected _updateObject(event: Event, formData: object): Promise<unknown>;

    protected _onDrop(event: DragEvent): void;

    /**
     * Handle dropping a content link onto the editor.
     * @param eventData - The parsed event data.
     */
    protected _onDropContentLink(eventData: DragEvent): void;
  }

  namespace MarkdownJournalPageSheet {
    interface Options extends JournalTextPageSheet.Options {
      editor: JournalTextPageSheet.Options["editor"] & {
        engine: "prosemirror";
      };
    }
  }

  /**
   * A subclass of {@link JournalTextPageSheet} that implements a TinyMCE editor.
   */
  class JournalTextTinyMCESheet extends JournalTextPageSheet<JournalTextTinyMCESheet.Options> {
    getData(
      options?: Partial<JournalTextTinyMCESheet.Options> | undefined
    ): Promise<JournalPageSheet.Data<JournalTextTinyMCESheet.Options>>;

    close(options?: FormApplication.CloseOptions | undefined): Promise<void>;
    protected override _render(
      force?: boolean | undefined,
      options?: Application.RenderOptions<JournalTextTinyMCESheet.Options> | undefined
    ): Promise<void>;

    /**
     * @remarks This isn't explicitly present in FVTT's source, but is present to provide a more accurate representation of the typing.
     * @see {@link JournalTextPageSheet.format}
     */
    static get format(): typeof CONST.JOURNAL_ENTRY_PAGE_FORMATS.HTML;
  }

  namespace JournalTextTinyMCESheet {
    interface Options extends JournalTextPageSheet.Options {
      editor: JournalTextPageSheet.Options["editor"] & {
        engine: "tinymce";
      };
    }
  }
}
