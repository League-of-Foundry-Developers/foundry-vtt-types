import type { DeepPartial, Identity, JSONValue, MaybePromise } from "#utils";
import type JournalEntryPageTextSheet from "./journal-entry-page-text-sheet.d.mts";
import type HandlebarsApplicationMixin from "../../api/handlebars-application.d.mts";
import type ApplicationV2 from "../../api/application.d.mts";
import type DocumentSheetV2 from "../../api/document-sheet.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      JournalEntryPageCodeMirrorSheet: JournalEntryPageCodeMirrorSheet.Any;
    }
  }
}

/**
 * An abstract class that provides code-mirror-specific methods for editing journal page content.
 */
declare class JournalEntryPageCodeMirrorSheet<
  RenderContext extends JournalEntryPageCodeMirrorSheet.RenderContext = JournalEntryPageCodeMirrorSheet.RenderContext,
  Configuration extends JournalEntryPageCodeMirrorSheet.Configuration = JournalEntryPageCodeMirrorSheet.Configuration,
  RenderOptions extends JournalEntryPageCodeMirrorSheet.RenderOptions = JournalEntryPageCodeMirrorSheet.RenderOptions,
> extends JournalEntryPageTextSheet<RenderContext, Configuration, RenderOptions> {
  /**
   * @defaultValue
   * ```js
   * {
   *   window: {
   *     contentClasses: ["codemirror", "flexcol"]
   *   }
   * }
   * ```
   */
  static override DEFAULT_OPTIONS: DocumentSheetV2.DefaultOptions;

  /**
   * @defaultValue
   * ```js
   * {
   *   content: {
   *     root: true,
   *     template: "templates/journal/pages/text/view.hbs"
   *   }
   * }
   * ```
   */
  static override VIEW_PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  protected override _prepareContentContext(
    context: ApplicationV2.RenderContextOf<this>,
    options: DeepPartial<RenderOptions>,
  ): Promise<void>;

  protected override _preSyncPartState(
    partId: string,
    newElement: HTMLElement,
    priorElement: HTMLElement,
    state: JournalEntryPageCodeMirrorSheet.PartState,
  ): void;

  protected override _syncPartState(
    partId: string,
    newElement: HTMLElement,
    priorElement: HTMLElement,
    state: JournalEntryPageCodeMirrorSheet.PartState,
  ): void;

  protected override _attachFrameListeners(): void;

  /**
   * Handle dropping something onto the code-mirror editor.
   * @param event - The triggering event.
   */
  protected _onDrop(event: DragEvent): MaybePromise<void>;

  /**
   * Handle dropping a content link onto the code-mirror editor.
   * @param event     - The originating drop event.
   * @param eventData - The parsed event data.
   */
  protected _onDropContentLink(event: DragEvent, eventData: JSONValue): Promise<void>;

  protected override _isEditorDirty(): boolean;

  #JournalEntryPageCodeMirrorSheet: true;
}

declare namespace JournalEntryPageCodeMirrorSheet {
  interface Any extends AnyJournalEntryPageCodeMirrorSheet {}
  interface AnyConstructor extends Identity<typeof AnyJournalEntryPageCodeMirrorSheet> {}

  interface PartState extends HandlebarsApplicationMixin.PartState {
    /** @remarks The scroll cursor position of the `<code-mirror>` editor, preserved across re-renders. */
    cursor?: number | null | undefined;
  }

  interface RenderContext extends JournalEntryPageTextSheet.RenderContext {}
  interface Configuration extends JournalEntryPageTextSheet.Configuration {}
  interface RenderOptions extends JournalEntryPageTextSheet.RenderOptions {}
}

declare abstract class AnyJournalEntryPageCodeMirrorSheet extends JournalEntryPageCodeMirrorSheet<
  JournalEntryPageCodeMirrorSheet.RenderContext,
  JournalEntryPageCodeMirrorSheet.Configuration,
  JournalEntryPageCodeMirrorSheet.RenderOptions
> {
  constructor(...args: never);
}

export default JournalEntryPageCodeMirrorSheet;
