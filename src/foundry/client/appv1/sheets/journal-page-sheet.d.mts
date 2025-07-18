import type { Editor } from "tinymce";
import type { EditorView } from "prosemirror-view";
import type { GetDataReturnType, Identity, MaybePromise } from "#utils";
import type Showdown from "showdown";
import type { Application, DocumentSheet, FormApplication } from "../api/_module.d.mts";
import type TextEditor from "#client/applications/ux/text-editor.mjs";

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationConfig {
      JournalPageSheet: JournalPageSheet.Any;
      JournalTextTinyMCESheet: JournalTextTinyMCESheet.Any;
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

  override get template(): string;

  override get title(): string;

  toc: Record<string, JournalEntryPage.JournalEntryPageHeading>;

  override getData(options?: Partial<Options>): MaybePromise<GetDataReturnType<JournalPageSheet.Data>>;

  protected override _renderInner(data: ReturnType<this["getData"]>): Promise<JQuery<HTMLElement>>;

  protected override _getSecretContent(secret: HTMLElement): string;

  protected override _updateSecret(
    secret: HTMLElement,
    content: string,
  ): Promise<void | JournalEntryPage.Implementation>;

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

declare namespace JournalPageSheet {
  interface Any extends AnyJournalPageSheet {}
  interface AnyConstructor extends Identity<typeof AnyJournalPageSheet> {}

  interface Options extends DocumentSheet.Options<JournalEntryPage.Implementation> {}

  interface Data extends DocumentSheet.Data<Options, JournalEntryPage.Implementation> {
    headingLevels: Record<number, string>;
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

declare namespace JournalTextPageSheet {
  interface TextData extends JournalPageSheet.Data {
    editor: {
      engine: string;
      collaborate: boolean;
      content: string;
    };
  }
}

/**
 * A subclass of {@linkcode JournalTextPageSheet} that implements a TinyMCE editor.
 */
declare class JournalTextTinyMCESheet extends JournalTextPageSheet {
  override getData(
    options?: Partial<JournalPageSheet.Options>,
  ): Promise<GetDataReturnType<JournalTextTinyMCESheet.Data>>;

  override close(options?: FormApplication.CloseOptions): Promise<void>;

  protected override _render(
    force?: boolean,
    options?: Application.RenderOptions<JournalPageSheet.Options>,
  ): Promise<void>;
}

declare namespace JournalTextTinyMCESheet {
  interface Any extends AnyJournalTextTinyMCESheet {}
  interface AnyConstructor extends Identity<typeof AnyJournalTextTinyMCESheet> {}

  interface Data extends JournalTextPageSheet.TextData {}

  /**
   * @deprecated Replaced with {@linkcode JournalTextTinyMCESheet.Data}.
   */
  type MCEData = Data;
}

declare abstract class AnyJournalPageSheet extends JournalPageSheet<JournalPageSheet.Options> {
  constructor(...args: never);
}

declare abstract class AnyJournalTextTinyMCESheet extends JournalTextTinyMCESheet {
  constructor(...args: never);
}

export { JournalPageSheet, JournalTextPageSheet, JournalTextTinyMCESheet };
