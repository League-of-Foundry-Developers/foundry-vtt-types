import type { DeepPartial, Identity } from "#utils";
import type JournalEntryPageTextSheet from "./journal-entry-page-text-sheet.d.mts";
import type JournalEntryPageSheet from "./journal-entry-page-sheet.d.mts";
import type HandlebarsApplicationMixin from "../../api/handlebars-application.d.mts";
import type ApplicationV2 from "../../api/application.d.mts";
import type HTMLProseMirrorElement from "../../elements/prosemirror-editor.d.mts";

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
  static override DEFAULT_OPTIONS: JournalEntryPageSheet.DefaultOptions;

  static override EDIT_PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  static override VIEW_PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  /**
   * @remarks Prevents re-rendering a framed, already-rendered sheet whose editor has unsaved changes, unless the
   * render is a resync or the window is being detached.
   */
  protected override _canRender(options: DeepPartial<RenderOptions>): boolean;

  /**
   * @remarks Enriches the page's content into `context.text.enriched` while in view mode.
   */
  protected override _prepareContentContext(
    context: ApplicationV2.RenderContextOf<this>,
    options: DeepPartial<RenderOptions>,
  ): Promise<void>;

  /**
   * @remarks `undefined` if the sheet has no `prose-mirror` element, which is the case in view mode.
   */
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
  protected _onConfigurePlugins(event: HTMLProseMirrorElement.PluginsEvent): void;

  /**
   * Update the UI appropriately when receiving new steps from another client.
   * @internal
   */
  _onNewSteps(): void;
}

declare namespace JournalEntryPageProseMirrorSheet {
  interface Any extends AnyJournalEntryPageProseMirrorSheet {}
  interface AnyConstructor extends Identity<typeof AnyJournalEntryPageProseMirrorSheet> {}

  interface RenderContext extends JournalEntryPageTextSheet.RenderContext {
    text: TextContext;
  }

  interface TextContext extends JournalEntryPageTextSheet.TextContext {
    /**
     * @remarks The enriched page content. Only added in view mode.
     */
    enriched?: string | undefined;
  }

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
