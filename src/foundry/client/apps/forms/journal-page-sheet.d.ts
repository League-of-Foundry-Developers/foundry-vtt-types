import type { EditorView } from "prosemirror-view";
import type Showdown from "showdown";
import type { Editor } from "tinymce";
import type { ConfiguredDocumentClass } from "../../../../types/helperTypes";
import type { JOURNAL_ENTRY_PAGE_FORMATS } from "../../../common/constants.mjs.js";

declare global {
  /**
   * The Application responsible for displaying and editing a single {@link JournalEntryPage} document.
   */
  class JournalPageSheet<TOptions extends JournalPageSheet.Options = JournalPageSheet.Options> extends DocumentSheet<
    TOptions,
    ConcreteJournalPage
  > {
    /**
     * @param object - The JournalEntryPage instance which is being edited.
     * @param options - Application options
     */
    constructor(object: ConcreteJournalPage, options?: Partial<TOptions>);

    /**
     * {@inheritdoc}
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
    // FIXME: this should be async, but the parent classes would need to be updated first
    activateEditor(
      name: string,
      options?: TextEditor.Options | undefined,
      initialContent?: string | undefined
    ): Promise<Editor | EditorView>;
    // FIXME: this should be async, but the parent classes would need to be updated first
    override getData(options?: Partial<TOptions> | undefined): JournalPageSheet.SheetData<TOptions>;
    // FIXME: this should be private async, but the parent classes would need to be updated first
    protected _renderInner(data: object): Promise<JQuery<HTMLElement>>;
  }
  namespace JournalPageSheet {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface Options extends DocumentSheetOptions {}
    interface SheetData<T extends JournalPageSheet.Options | undefined = JournalPageSheet.Options | undefined> {
      cssClass: string;
      editable: boolean;
      document: ConcreteJournalPage;
      data: ReturnType<ConcreteJournalPage["toObject"]>;
      limited: ConcreteJournalPage["limited"];
      options?: Partial<T>;
      owner: ConcreteJournalPage["isOwner"];
      title: string;
    }
  }
  /**
   * The Application responsible for displaying and editing a single {@link JournalEntryPage} text document.
   */
  class JournalTextPageSheet<
    TOptions extends JournalTextPageSheet.Options = JournalTextPageSheet.Options
  > extends JournalPageSheet<TOptions> {
    /**
     * Bi-directional HTML <-> Markdown converter.
     */
    static get _converter(): Showdown.Converter;
    /**
     * Declare the format that we edit text content in for this sheet so we can perform conversions as necessary.
     */
    static get format(): typeof JOURNAL_ENTRY_PAGE_FORMATS.HTML;
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
     */
    toc: JournalEntryPage.Heading;

    // FIXME: this should be async once the parent classes are updated
    override getData(options?: Partial<TOptions> | undefined): JournalPageSheet.SheetData<TOptions>;

    // FIXME: this should be async once the parent classes are updated
    close(options?: FormApplication.CloseOptions | undefined): Promise<void>;

    // FIXME: this should be async once the parent classes are updated
    protected _render(
      force?: boolean | undefined,
      options?: Application.RenderOptions<TOptions> | undefined
    ): Promise<void>;

    /**
     * Determine if any editors are dirty.
     */
    isEditorDirty(): boolean;

    // FIXME: this should be async once the parent classes are updated
    activateEditor(
      name: string,
      options?: TextEditor.Options | undefined,
      initialContent?: string | undefined
    ): Promise<Editor | EditorView>;
    // FIXME: this should be async once the parent classes are updated
    protected _renderInner(data: object): Promise<JQuery<HTMLElement>>;
    _getSecretContent(secret: HTMLElement): string;
    // FIXME: revisit this when it's added to its ancestor classes
    _updateSecret(secret: HTMLElement, content: string): Promise<typeof this>;
    // FIXME: this should be async once the parent classes are updated
    protected _updateObject(event: Event, formData: object): Promise<unknown>;
    /**
     * Lazily convert text formats if we detect the document being saved in a different format.
     * @param renderData - Render data.
     */
    protected _convertFormats(renderData: ReturnType<typeof this["getData"]>): void;

    /* -------------------------------------------- */
    /*  HTML Editing                                */
    /* -------------------------------------------- */

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
  class JournalImagePageSheet extends JournalPageSheet {
    // TODO: type declarations for this class
  }
  namespace JournalImagePageSheet {
    type Options = JournalPageSheet.Options;
  }
  /**
   * The Application responsible for displaying and editing a single {@link JournalEntryPage} video document.
   */
  class JournalVideoPageSheet extends JournalPageSheet<JournalVideoPageSheet.Options> {
    // TODO: type declarations for this class
  }
  namespace JournalVideoPageSheet {
    type Options = JournalPageSheet.Options;
  }
  /**
   * The Application responsible for displaying and editing a single {@link JournalEntryPage} PDF document.
   */
  class JournalPDFPageSheet extends JournalPageSheet<JournalPDFPageSheet.Options> {
    // TODO: type declarations for this class
  }
  namespace JournalPDFPageSheet {
    type Options = JournalPageSheet.Options;
  }
  /**
   * A subclass of {@link JournalTextPageSheet} that implements a TinyMCE editor.
   */
  class JournalTextTinyMCESheet extends JournalTextPageSheet<JournalTextTinyMCESheet.Options> {
    // TODO: type declarations for this class
  }

  namespace JournalTextTinyMCESheet {
    interface Options extends JournalTextPageSheet.Options {
      editor: JournalTextPageSheet.Options["editor"] & {
        engine: "tinymce";
      };
    }
  }
  /**
   * A subclass of {@link JournalTextPageSheet} that implements a markdown editor for editing the text content.
   */
  class MarkdownJournalPageSheet extends JournalTextPageSheet<MarkdownJournalPageSheet.Options> {
    // TODO: type declarations for this class
  }
  namespace MarkdownJournalPageSheet {
    interface Options extends JournalTextPageSheet.Options {
      editor: JournalTextPageSheet.Options["editor"] & {
        engine: "prosemirror";
      };
    }
  }
}

type ConcreteJournalPage = InstanceType<ConfiguredDocumentClass<typeof JournalEntryPage>>;
