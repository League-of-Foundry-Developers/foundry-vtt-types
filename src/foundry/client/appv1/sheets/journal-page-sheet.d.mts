import type { AnyMutableObject, GetDataReturnType, Identity, MaybePromise } from "#utils";
import type Showdown from "showdown";
import type { Application, DocumentSheet, FormApplication } from "../api/_module.d.mts";
import type TextEditor from "#client/applications/ux/text-editor.mjs";

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationConfig {
      JournalPageSheet: JournalPageSheet.Any;
    }
  }
}

/**
 * The Application responsible for displaying and editing a single JournalEntryPage document.
 */
declare class JournalPageSheet<
  Options extends JournalPageSheet.Options = JournalPageSheet.Options,
> extends DocumentSheet<JournalEntryPage.Implementation, Options> {
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

  /**
   * Indicates that the sheet renders with App V2 rather than V1.
   * @defaultValue `false`
   */
  static isV2: boolean;

  /**
   * Indicates that the sheet renders with App V2 rather than V1.
   * @defaultValue `this.constructor.isV2`
   */
  isV2: boolean;

  override get template(): string;

  override get title(): string;

  /**
   * The table of contents for this JournalTextPageSheet.
   * @defaultValue `{}`
   */
  toc: JournalEntryPage.TOC;

  override getData(options?: Partial<Options>): MaybePromise<GetDataReturnType<JournalPageSheet.Data>>;

  protected override _renderInner(data: ReturnType<this["getData"]>): Promise<JQuery<HTMLElement>>;

  /**
   * A method called by the journal sheet when the view mode of the page sheet is closed.
   * @internal
   */
  protected _closeView(): void;

  protected override _getSecretContent(secret: HTMLElement): string;

  protected override _updateSecret(
    secret: HTMLElement,
    content: string,
  ): Promise<JournalEntryPage.Implementation | undefined>;

  override activateEditor(
    name: string,
    options?: TextEditor.Options,
    initialContent?: string,
  ): Promise<TextEditor.EditorInstance>;

  /**
   * Update the parent sheet if it is open when the server autosaves the contents of this editor.
   * @param html - The updated editor contents.
   * @internal
   */
  protected _onAutosave(html: string): void;

  /**
   * Update the UI appropriately when receiving new steps from another client.
   * @internal
   */
  protected _onNewSteps(): void;
}

declare namespace JournalPageSheet {
  interface Any extends AnyJournalPageSheet {}
  interface AnyConstructor extends Identity<typeof AnyJournalPageSheet> {}

  interface Options extends DocumentSheet.Options<JournalEntryPage.Implementation> {
    /**
     * Additional CSS classes applied to the page when it is rendered in view mode.
     * @defaultValue `[]`
     */
    viewClasses: string[];

    /**
     * Whether a table of contents is built for this page when its inner content renders.
     * @defaultValue `true`
     */
    includeTOC: boolean;
  }

  /** A category choice offered by the page's category selector. */
  interface CategoryChoice {
    value: string;
    label: string;
  }

  interface Data extends DocumentSheet.Data<Options, JournalEntryPage.Implementation> {
    headingLevels: Record<number, string>;

    /**
     * @remarks Only present when the parent {@linkcode JournalEntry} defines at least one category.
     */
    categories?: CategoryChoice[] | undefined;
  }

  /**
   * @deprecated Replaced with {@linkcode JournalPageSheet.Data}.
   */
  type JournalPageSheetData = Data;
}

/**
 * The Application responsible for displaying and editing a single JournalEntryPage text document.
 */
declare class JournalTextPageSheet extends JournalPageSheet {
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
   * options.secrets.push({parentSelector: "section.journal-page-content"});
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

  protected override _updateObject(event: Event, formData: AnyMutableObject): Promise<unknown>;

  override saveEditor(name: string, options?: FormApplication.SaveEditorOptions): Promise<void>;

  /**
   * Lazily convert text formats if we detect the document being saved in a different format.
   * @param renderData - Render data.
   */
  protected _convertFormats(renderData: AnyMutableObject): void;

  #JournalTextPageSheet: true;
}

declare namespace JournalTextPageSheet {
  interface Any extends AnyJournalTextPageSheet {}
  interface AnyConstructor extends Identity<typeof AnyJournalTextPageSheet> {}

  interface EditorData {
    engine: string;
    collaborate: boolean;
    content: string;
  }

  interface TextData extends JournalPageSheet.Data {
    editor: EditorData;
  }
}

declare abstract class AnyJournalPageSheet extends JournalPageSheet<JournalPageSheet.Options> {
  constructor(...args: never);
}

declare abstract class AnyJournalTextPageSheet extends JournalTextPageSheet {
  constructor(...args: never);
}

export { JournalPageSheet, JournalTextPageSheet };
