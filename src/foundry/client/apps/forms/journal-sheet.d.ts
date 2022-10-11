import type { ConfiguredDocumentClass } from "../../../../types/helperTypes";

declare global {
  /**
   * The Application responsible for displaying and editing a single JournalEntry document.
   * @typeParam ConcreteOptions - the type of the options object
   */
  class JournalSheet<ConcreteOptions extends JournalSheet.Options = JournalSheet.Options> extends DocumentSheet<
    ConcreteOptions,
    ConcreteJournalEntry
  > {
    /**
     * @param object  - The JournalEntry instance which is being edited
     * @param options - Application options
     */
    constructor(object: ConcreteJournalEntry, options?: Partial<ConcreteOptions>);

    /**
     * The current display mode of the journal. Either "text" or "image".
     * @internal
     */
    protected _sheetMode: JournalSheet.SheetMode | null;

    /**
     * The size of the application when it was in text mode, so we can go back
     * to it when we switch modes.
     * @defaultValue `null`
     * @internal
     */
    protected _textPos: Application.Position | null;

    /**
     * @defaultValue
     * ```ts
     * foundry.utils.mergeObject(super.defaultOptions, {
     *   classes: ["sheet", "journal-sheet", "journal-entry"],
     *   template: "templates/journal/sheet.html",
     *   width: 960,
     *   height: 800,
     *   resizable: true,
     *   submitOnChange: true,
     *   submitOnClose: true,
     *   closeOnSubmit: false,
     *   viewPermission: CONST.DOCUMENT_OWNERSHIP_LEVELS.NONE,
     *   scrollY: [".scrollable"],
     *   filters: [{inputSelector: 'input[name="search"]', contentSelector: ".directory-list"}],
     *   dragDrop: [{dragSelector: ".directory-item, .heading-link", dropSelector: ".directory-list"}]
     * });
     * ```
     */
    static override get defaultOptions(): JournalSheet.Options;

    override get template(): string;

    override get title(): string;

    /**
     * Guess the default view mode for the sheet based on the player's permissions to the Entry
     * @internal
     */
    protected _inferDefaultMode(): JournalSheet.SheetMode | null;

    protected override _render(force?: boolean, options?: Application.RenderOptions<ConcreteOptions>): Promise<void>;

    protected override _getHeaderButtons(): Application.HeaderButton[];

    override getData(options?: Partial<ConcreteOptions>): MaybePromise<object>;

    protected override _updateObject(event: Event, formData: JournalSheet.FormData): Promise<unknown>;

    /**
     * Handle requests to switch the rendered mode of the Journal Entry sheet
     * Save the form before triggering the show request, in case content has changed
     * @param event - The triggering click event
     * @param mode  - The journal mode to display
     * @internal
     */
    protected _onSwapMode(event: Event, mode: JournalSheet.SheetMode): Promise<void>;

    /**
     * Handle requests to show the referenced Journal Entry to other Users
     * Save the form before triggering the show request, in case content has changed
     * @param event - The triggering click event
     * @internal
     */
    protected _onShowPlayers(event: Event): Promise<void>;
  }

  namespace JournalSheet {
    interface Options extends DocumentSheetOptions {
      /** The current display mode of the journal. Either "text" or "image". */
      sheetMode?: JournalSheet.SheetMode | null;
    }
    type SheetMode = "text" | "image";

    interface FormData {
      content: string;
      folder: string;
      name: string;
    }
  }
}

type ConcreteJournalEntry = InstanceType<ConfiguredDocumentClass<typeof JournalEntry>>;
