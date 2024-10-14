import type { Editor } from "tinymce";
import type { EditorView } from "prosemirror-view";
import type { GetDataReturnType, InexactPartial, MaybePromise } from "../../../../types/utils.d.mts";
import type Showdown from "showdown";

declare global {
  /**
   * The Application responsible for displaying and editing a single JournalEntryPage document.
   */
  class JournalPageSheet<Options extends JournalPageSheet.Options = JournalPageSheet.Options> extends DocumentSheet<
    Options,
    JournalEntryPage.ConfiguredInstance
  > {
    /**
     * @defaultValue
     * ```typescript
     * foundry.utils.mergeObject(super.defaultOptions, {
     *   classes: ["sheet", "journal-sheet", "journal-entry-page"],
     *   viewClasses: [],
     *   width: 600,
     *   height: 680,
     *   resizable: true,
     *   closeOnSubmit: false,
     *   submitOnClose: true,
     *   viewPermission: CONST.DOCUMENT_OWNERSHIP_LEVELS.OBSERVER,
     *   includeTOC: true
     * });
     * ```
     */
    static override get defaultOptions(): JournalPageSheet.Options;

    override get template(): string;

    override get title(): string;

    toc: Record<string, JournalEntryPage.JournalEntryPageHeading>;

    override getData(
      options?: Partial<Options>,
    ): MaybePromise<GetDataReturnType<JournalPageSheet.JournalPageSheetData>>;

    protected override _renderInner(data: ReturnType<this["getData"]>): Promise<JQuery<HTMLElement>>;

    protected override _getSecretContent(secret: HTMLElement): string;

    protected override _updateSecret(secret: HTMLElement, content: string): Promise<void | JournalEntryPage>;

    override activateEditor(
      name: string,
      options?: TextEditor.Options,
      initialContent?: string,
    ): Promise<Editor | EditorView>;

    /**
     * Update the parent sheet if it is open when the server autosaves the contents of this editor.
     * @param html - The updated editor contents.
     */
    onAutosave(html: string): void;

    /**
     * Update the UI appropriately when receiving new steps from another client.
     */
    onNewSteps(): void;
  }

  namespace JournalPageSheet {
    type Any = JournalPageSheet<any>;

    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface Options extends DocumentSheetOptions<JournalEntryPage.ConfiguredInstance> {}

    interface JournalPageSheetData
      extends DocumentSheet.DocumentSheetData<Options, JournalEntryPage.ConfiguredInstance> {
      headingLevels: Record<number, string>;
    }
  }

  /**
   * The Application responsible for displaying and editing a single JournalEntryPage text document.
   */
  class JournalTextPageSheet extends JournalPageSheet {
    /**
     * Bi-directional HTML \<-\> Markdown converter.
     */
    protected static _converter: Showdown.Converter;

    /**
     * Declare the format that we edit text content in for this sheet so we can perform conversions as necessary.
     * @defaultValue `CONST.JOURNAL_ENTRY_PAGE_FORMATS.HTML`
     */
    static get format(): foundry.CONST.JOURNAL_ENTRY_PAGE_FORMATS;

    /**
     * @defaultValue
     * ```typescript
     * const options = super.defaultOptions;
     * options.classes.push("text");
     * options.secrets.push({parentSelector: "section"});
     * return options;
     * ```
     */
    static override get defaultOptions(): JournalPageSheet.Options;

    override getData(
      options?: Partial<JournalPageSheet.Options>,
    ): Promise<GetDataReturnType<JournalTextPageSheet.TextData>>;

    override close(options?: FormApplication.CloseOptions): Promise<void>;

    protected override _render(
      force?: boolean,
      options?: Application.RenderOptions<JournalPageSheet.Options>,
    ): Promise<void>;

    /**
     * Determine if any editors are dirty.
     */
    isEditorDirty(): boolean;

    protected _updateObject(event: Event, formData: object): Promise<unknown>;

    /**
     * Lazily convert text formats if we detect the document being saved in a different format.
     * @param renderData - Render data.
     */
    protected _convertFormats(renderData: object): void;
  }

  namespace JournalTextPageSheet {
    interface TextData extends JournalPageSheet.JournalPageSheetData {
      editor: {
        engine: string;
        collaborate: boolean;
        content: string;
      };
    }
  }

  /**
   * The Application responsible for displaying and editing a single JournalEntryPage image document.
   */
  class JournalImagePageSheet extends JournalPageSheet {
    /**
     * @defaultValue
     * ```typescript
     * const options = super.defaultOptions;
     * options.classes.push("image");
     * options.height = "auto";
     * return options;
     * ```
     */
    static override get defaultOptions(): JournalPageSheet.Options;
  }

  /**
   * The Application responsible for displaying and editing a single JournalEntryPage video document.
   */
  class JournalVideoPageSheet extends JournalPageSheet {
    /**
     * const options = super.defaultOptions;
     * options.classes.push("video");
     * options.height = "auto";
     * return options;
     */
    static override get defaultOptions(): JournalPageSheet.Options;

    override getData(
      options?: Partial<JournalPageSheet.Options>,
    ): MaybePromise<GetDataReturnType<JournalVideoPageSheet.VideoData>>;

    override activateListeners(html: JQuery<HTMLElement>): void;

    /**
     * Get the YouTube player parameters depending on whether the sheet is being viewed or edited.
     */
    _getYouTubeVars(): {
      playsinline: number;
      modestbranding: number;
      controls?: number;
      autoplay?: number;
      loop?: number;
      start?: number;
    };

    protected override _getSubmitData(updateData?: object | null): Record<string, unknown>;

    /**
     * Convert time components to a timestamp in seconds.
     * @param components - The time components
     * @returns The timestamp, in second
     */
    _timeComponentsToTimestamp(components?: InexactPartial<JournalVideoPageSheet.TimeComponents>): number;

    _timestampToTimeComponents(timestamp: number): Partial<JournalVideoPageSheet.TimeComponents>;
  }

  namespace JournalVideoPageSheet {
    interface VideoData extends JournalPageSheet.JournalPageSheetData {
      flexRatio: number;
      isYouTube: boolean;
      timestamp: number;
      yt: {
        id: string;
        url: string;
      };
    }

    interface TimeComponents {
      h: number;
      m: number;
      s: number;
    }
  }

  /**
   * The Application responsible for displaying and editing a single JournalEntryPage PDF document.
   */
  class JournalPDFPageSheet extends JournalPageSheet {
    static override get defaultOptions(): JournalPageSheet.Options;

    /**
     * Maintain a cache of PDF sizes to avoid making HEAD requests every render.
     */
    static _sizes: Record<string, number>;

    override activateListeners(html: JQuery<HTMLElement>): void;

    override getData(
      options?: Partial<JournalPageSheet.Options>,
    ): MaybePromise<GetDataReturnType<JournalPDFPageSheet.PDFData>>;

    protected override _renderInner(data: ReturnType<this["getData"]>): Promise<JQuery<HTMLElement>>;

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
    interface PDFData extends JournalPageSheet.JournalPageSheetData {
      params: URLSearchParams;
    }
  }

  /**
   * A subclass of {@link JournalTextPageSheet} that implements a markdown editor for editing the text content.
   */
  class MarkdownJournalPageSheet extends JournalTextPageSheet {
    /**
     * Store the dirty flag for this editor.
     */
    _isDirty: boolean;

    /**
     * @defaultValue `CONST.JOURNAL_ENTRY_PAGE_FORMATS.MARKDOWN`
     */
    static override get format(): foundry.CONST.JOURNAL_ENTRY_PAGE_FORMATS;

    static override get defaultOptions(): JournalPageSheet.Options;

    override get template(): string;

    override getData(
      options?: Partial<JournalPageSheet.Options>,
    ): Promise<GetDataReturnType<MarkdownJournalPageSheet.MarkdownData>>;

    override activateListeners(html: JQuery<HTMLElement>): void;

    override isEditorDirty(): boolean;

    protected override _updateObject(event: Event, formData: object): Promise<unknown>;

    protected override _onDrop(event: DragEvent): void;

    /**
     * Handle dropping a content link onto the editor.
     * @param eventData - The parsed event Data
     */
    _onDropContentLink(eventData: ReturnType<(typeof TextEditor)["getDragEventData"]>): Promise<void>;
  }

  namespace MarkdownJournalPageSheet {
    interface MarkdownData extends JournalTextPageSheet.TextData {
      markdownFormat: foundry.CONST.JOURNAL_ENTRY_PAGE_FORMATS;
    }
  }

  /**
   * A subclass of {@link JournalTextPageSheet} that implements a TinyMCE editor.
   */
  class JournalTextTinyMCESheet extends JournalTextPageSheet {
    override getData(
      options?: Partial<JournalPageSheet.Options>,
    ): Promise<GetDataReturnType<JournalTextTinyMCESheet.MCEData>>;

    override close(options?: FormApplication.CloseOptions): Promise<void>;

    protected override _render(
      force?: boolean,
      options?: Application.RenderOptions<JournalPageSheet.Options>,
    ): Promise<void>;
  }

  namespace JournalTextTinyMCESheet {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface MCEData extends JournalTextPageSheet.TextData {}
  }
}
