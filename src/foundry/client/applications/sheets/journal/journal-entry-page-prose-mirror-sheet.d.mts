import type { DeepPartial, Identity } from "#utils";
import type JournalEntryPageTextSheet from "./journal-entry-page-text-sheet.d.mts";
import type HandlebarsApplicationMixin from "../../api/handlebars-application.d.mts";
import type ApplicationV2 from "../../api/application.d.mts";
import type DocumentSheetV2 from "../../api/document-sheet.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      JournalEntryPageProseMirrorSheet: JournalEntryPageProseMirrorSheet.Any;
    }
  }
}

/**
 * An Application responsible for displaying a single text-type JournalEntryPage Document, and editing it with a
 * ProseMirror editor.
 */
declare class JournalEntryPageProseMirrorSheet<
  RenderContext extends JournalEntryPageProseMirrorSheet.RenderContext = JournalEntryPageProseMirrorSheet.RenderContext,
  Configuration extends JournalEntryPageProseMirrorSheet.Configuration = JournalEntryPageProseMirrorSheet.Configuration,
  RenderOptions extends JournalEntryPageProseMirrorSheet.RenderOptions = JournalEntryPageProseMirrorSheet.RenderOptions,
> extends JournalEntryPageTextSheet<RenderContext, Configuration, RenderOptions> {
  /**
   * @defaultValue
   * ```js
   * {
   *   window: {
   *     icon: "fa-solid fa-feather"
   *   }
   * }
   * ```
   */
  static override DEFAULT_OPTIONS: DocumentSheetV2.DefaultOptions;

  /**
   * @defaultValue
   * ```js
   * {
   *   header: super.EDIT_PARTS.header,
   *   content: {
   *     template: "templates/journal/pages/text/edit.hbs"
   *   },
   *   footer: super.EDIT_PARTS.footer
   * }
   * ```
   */
  static override EDIT_PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  /**
   * @defaultValue
   * ```js
   * {
   *   content: {
   *     template: "templates/journal/pages/text/view.hbs",
   *     root: true
   *   }
   * }
   * ```
   */
  static override VIEW_PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  protected override _canRender(options: DeepPartial<RenderOptions>): false | void;

  protected override _prepareContentContext(
    context: ApplicationV2.RenderContextOf<this>,
    options: DeepPartial<RenderOptions>,
  ): Promise<void>;

  protected override _isEditorDirty(): boolean | undefined;

  protected override _attachFrameListeners(): void;

  /**
   * Update the parent sheet if it is open when the server autosaves the contents of this editor.
   * @param content - The updated editor contents.
   * @internal
   */
  _onAutosave(content: string): void;

  /**
   * Configure plugins for the ProseMirror instance.
   */
  protected _onConfigurePlugins(event: Event): void;

  /**
   * Update the UI appropriately when receiving new steps from another client.
   * @internal
   */
  _onNewSteps(): void;
}

declare namespace JournalEntryPageProseMirrorSheet {
  interface Any extends AnyJournalEntryPageProseMirrorSheet {}
  interface AnyConstructor extends Identity<typeof AnyJournalEntryPageProseMirrorSheet> {}

  interface RenderContext extends JournalEntryPageTextSheet.RenderContext {}
  interface Configuration extends JournalEntryPageTextSheet.Configuration {}
  interface RenderOptions extends JournalEntryPageTextSheet.RenderOptions {}
}

declare abstract class AnyJournalEntryPageProseMirrorSheet extends JournalEntryPageProseMirrorSheet<
  JournalEntryPageProseMirrorSheet.RenderContext,
  JournalEntryPageProseMirrorSheet.Configuration,
  JournalEntryPageProseMirrorSheet.RenderOptions
> {
  constructor(...args: never);
}

export default JournalEntryPageProseMirrorSheet;
