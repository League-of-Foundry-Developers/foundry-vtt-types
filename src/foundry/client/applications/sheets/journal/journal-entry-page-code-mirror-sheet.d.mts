import type { AnyObject, DeepPartial, Identity, MaybePromise } from "#utils";
import type JournalEntryPageTextSheet from "./journal-entry-page-text-sheet.d.mts";
import type JournalEntryPageSheet from "./journal-entry-page-sheet.d.mts";
import type HandlebarsApplicationMixin from "../../api/handlebars-application.d.mts";
import type ApplicationV2 from "../../api/application.d.mts";

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
  static override DEFAULT_OPTIONS: JournalEntryPageSheet.DefaultOptions;

  static override VIEW_PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  /**
   * @remarks Enriches the page's content into `context.text.enriched` while in view mode.
   */
  protected override _prepareContentContext(
    context: ApplicationV2.RenderContextOf<this>,
    options: DeepPartial<RenderOptions>,
  ): Promise<void>;

  /**
   * @remarks Stores the editor's cursor position in `state` when re-rendering the `content` part in edit mode.
   */
  protected override _preSyncPartState(
    partId: string,
    newElement: HTMLElement,
    priorElement: HTMLElement,
    state: JournalEntryPageCodeMirrorSheet.PartState,
  ): void;

  /**
   * @remarks Restores the editor's cursor position from `state` when re-rendering the `content` part in edit mode.
   */
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
   * @remarks Returns without doing anything if the drop did not land on a `code-mirror` element.
   */
  protected _onDrop(event: DragEvent): MaybePromise<void>;

  /**
   * Handle dropping a content link onto the code-mirror editor.
   * @param event     - The originating drop event.
   * @param eventData - The parsed event data.
   */
  protected _onDropContentLink(event: DragEvent, eventData: AnyObject): Promise<void>;

  protected override _isEditorDirty(): boolean;

  #JournalEntryPageCodeMirrorSheet: true;
}

declare namespace JournalEntryPageCodeMirrorSheet {
  interface Any extends AnyJournalEntryPageCodeMirrorSheet {}
  interface AnyConstructor extends Identity<typeof AnyJournalEntryPageCodeMirrorSheet> {}

  interface RenderContext extends JournalEntryPageTextSheet.RenderContext {
    text: TextContext;
  }

  interface TextContext extends JournalEntryPageTextSheet.TextContext {
    /**
     * @remarks The enriched page content. Only added in view mode.
     */
    enriched?: string | undefined;
  }

  /** @remarks The part state, extended with the `code-mirror` editor's cursor position. */
  interface PartState extends HandlebarsApplicationMixin.PartState {
    /**
     * @remarks Only added for the `content` part in edit mode; `null` when the part had no `code-mirror` element.
     */
    cursor?: number | null | undefined;
  }

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
