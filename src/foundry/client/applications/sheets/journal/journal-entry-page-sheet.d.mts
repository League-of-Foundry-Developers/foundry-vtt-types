import type { DeepPartial, Identity } from "#utils";
import type DocumentSheetV2 from "../../api/document-sheet.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      JournalEntryPageSheet: JournalEntryPageSheet.Any;
    }
  }
}

/**
 * An abstract Application responsible for displaying and editing a single JournalEntryPage Document.
 */
declare class JournalEntryPageSheet<
  RenderContext extends JournalEntryPageSheet.RenderContext = JournalEntryPageSheet.RenderContext,
  Configuration extends JournalEntryPageSheet.Configuration = JournalEntryPageSheet.Configuration,
  RenderOptions extends JournalEntryPageSheet.RenderOptions = JournalEntryPageSheet.RenderOptions,
> extends DocumentSheetV2<JournalEntryPage.Implementation, RenderContext, Configuration, RenderOptions> {
  /**
   * @defaultValue
   * ```js
   * {
   *   classes: ["journal-sheet", "journal-entry-page"],
   *   includeTOC: false,
   *   mode: "edit",
   *   viewPermission: CONST.DOCUMENT_OWNERSHIP_LEVELS.OBSERVER,
   *   viewClasses: [],
   *   window: {
   *     resizable: true
   *   },
   *   position: {
   *     width: 600,
   *     height: 680
   *   },
   *   form: {
   *     submitOnChange: true
   *   }
   * }
   * ```
   */
  static override DEFAULT_OPTIONS: JournalEntryPageSheet.DefaultOptions;

  /**
   * @defaultValue `["prerender", "render", "close", "position", "closeView"]`
   * @remarks Frozen
   */
  static override readonly emittedEvents: string[];

  /**
   * The table of contents for this text page.
   * @remarks Only `undefined` prior to the first time {@linkcode JournalEntryPageSheet._onRender | #_onRender} is
   * called with {@linkcode JournalEntryPageSheet.Configuration.includeTOC | options.includeTOC} enabled.
   */
  toc: JournalEntryPage.TOC | undefined;

  /**
   * Indicates that the sheet renders with App V2 rather than V1.
   * @defaultValue `true`
   */
  static isV2: boolean;

  /**
   * Indicates that the sheet renders with App V2 rather than V1.
   * @defaultValue `this.constructor.isV2`
   */
  isV2: boolean;

  /**
   * Whether the sheet is in view mode.
   */
  get isView(): boolean;

  /**
   * The JournalEntryPage for this sheet.
   */
  get page(): JournalEntryPage.Implementation;

  /**
   * @remarks Returns without inserting anything unless
   * {@linkcode foundry.applications.api.ApplicationV2.Configuration.window | options.window.frame} is enabled.
   */
  protected override _insertElement(element: HTMLElement, options?: DeepPartial<RenderOptions>): Promise<void>;

  protected override _prepareContext(
    options: DeepPartial<RenderOptions> & { isFirstRender: boolean },
  ): Promise<RenderContext>;

  /**
   * Prepare heading level choices.
   */
  protected _prepareHeadingLevels(): Record<string, string>;

  /**
   * Actions performed when this sheet is closed in some parent view.
   */
  protected _onCloseView(): void;

  protected override _onRender(context: DeepPartial<RenderContext>, options: DeepPartial<RenderOptions>): Promise<void>;
}

declare namespace JournalEntryPageSheet {
  interface Any extends AnyJournalEntryPageSheet {}
  interface AnyConstructor extends Identity<typeof AnyJournalEntryPageSheet> {}

  interface RenderContext extends DocumentSheetV2.RenderContext<JournalEntryPage.Implementation> {
    /** @remarks The page's name. */
    name: string;

    /** @remarks The page's title display data. */
    title: JournalEntryPage.Implementation["title"];

    /** @remarks The page's UUID. */
    uuid: string;
  }

  interface Configuration extends DocumentSheetV2.Configuration<JournalEntryPage.Implementation> {
    /**
     * Whether the sheet includes additional table of contents elements besides its title.
     * @defaultValue `false`
     */
    includeTOC: boolean;

    /**
     * Whether the sheet is in edit or view mode.
     * @defaultValue `"edit"`
     */
    mode: "edit" | "view";

    /**
     * Classes appended to the page's root element when embedded in another sheet in view mode.
     * @defaultValue `[]`
     */
    viewClasses: string[];
  }

  // Note(LukeAbby): This `& object` is so that the `DEFAULT_OPTIONS` can be overridden more easily
  // Without it then `static override DEFAULT_OPTIONS = { unrelatedProp: 123 }` would error.
  type DefaultOptions = DeepPartial<Omit<Configuration, "document">> & object;

  interface RenderOptions extends DocumentSheetV2.RenderOptions {}
}

declare abstract class AnyJournalEntryPageSheet extends JournalEntryPageSheet<
  JournalEntryPageSheet.RenderContext,
  JournalEntryPageSheet.Configuration,
  JournalEntryPageSheet.RenderOptions
> {
  constructor(...args: never);
}

export default JournalEntryPageSheet;
