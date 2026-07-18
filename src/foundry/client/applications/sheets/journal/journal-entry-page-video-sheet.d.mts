import type { DeepPartial, Identity } from "#utils";
import type JournalEntryPageHandlebarsSheet from "./journal-entry-page-hbs-sheet.d.mts";
import type HandlebarsApplicationMixin from "../../api/handlebars-application.d.mts";
import type ApplicationV2 from "../../api/application.d.mts";
import type DocumentSheetV2 from "../../api/document-sheet.d.mts";
import type FormDataExtended from "../../ux/form-data-extended.d.mts";
import type { FormInputConfig } from "../../forms/fields.d.mts";
import type HTMLFilePickerElement from "../../elements/file-picker.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      JournalEntryPageVideoSheet: JournalEntryPageVideoSheet.Any;
    }
  }
}

/**
 * An Application responsible for displaying and editing a single video-type JournalEntryPage Document.
 */
declare class JournalEntryPageVideoSheet<
  RenderContext extends JournalEntryPageVideoSheet.RenderContext = JournalEntryPageVideoSheet.RenderContext,
  Configuration extends JournalEntryPageVideoSheet.Configuration = JournalEntryPageVideoSheet.Configuration,
  RenderOptions extends JournalEntryPageVideoSheet.RenderOptions = JournalEntryPageVideoSheet.RenderOptions,
> extends JournalEntryPageHandlebarsSheet<RenderContext, Configuration, RenderOptions> {
  /**
   * @defaultValue
   * ```js
   * {
   *   classes: ["video"],
   *   window: {
   *     icon: "fa-solid fa-video"
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
   *     template: "templates/journal/pages/video/edit.hbs",
   *     classes: ["standard-form"]
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
   *     template: "templates/journal/pages/video/view.hbs",
   *     root: true
   *   }
   * }
   * ```
   */
  static override VIEW_PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  protected override _prepareContentContext(
    context: ApplicationV2.RenderContextOf<this>,
    options: DeepPartial<RenderOptions>,
  ): Promise<void>;

  protected override _onRender(context: DeepPartial<RenderContext>, options: DeepPartial<RenderOptions>): Promise<void>;

  /**
   * Get the YouTube player parameters depending on whether the sheet is being viewed or edited.
   */
  protected _getYouTubeVars(): YT.PlayerVars;

  protected override _prepareSubmitData(
    event: SubmitEvent,
    form: HTMLFormElement,
    formData: FormDataExtended,
    updateData?: unknown,
  ): object;

  /**
   * Convert time components to a timestamp in seconds.
   * @param components - The time components.
   * @returns The timestamp, in seconds.
   */
  protected _timeComponentsToTimestamp(components: JournalEntryPageVideoSheet.TimeComponents): number;

  /**
   * Convert a timestamp in seconds into separate time components.
   * @param timestamp - The timestamp, in seconds.
   * @returns The individual time components.
   */
  protected _timestampToTimeComponents(timestamp: number | undefined): JournalEntryPageVideoSheet.TimeComponents;

  #JournalEntryPageVideoSheet: true;
}

declare namespace JournalEntryPageVideoSheet {
  interface Any extends AnyJournalEntryPageVideoSheet {}
  interface AnyConstructor extends Identity<typeof AnyJournalEntryPageVideoSheet> {}

  interface TimeComponents {
    h?: number;
    m?: number;
    s?: number;
  }

  interface TimeComponentInput {
    field: foundry.data.fields.NumberField;
    input?: ((field: foundry.data.fields.DataField.Any, config: FormInputConfig<string>) => HTMLElement) | undefined;
    value: number | undefined;
  }

  interface RenderContext extends JournalEntryPageHandlebarsSheet.RenderContext {
    src?: string | null | undefined;
    srcInput?:
      | ((field: foundry.data.fields.DataField.Any, inputConfig: FormInputConfig<string>) => HTMLFilePickerElement)
      | undefined;
    flexRatio?: boolean | undefined;
    isYouTube?: boolean | undefined;
    timestamp?: { h: TimeComponentInput; m: TimeComponentInput; s: TimeComponentInput } | undefined;
    yt?: { id: string; url: string } | undefined;
  }
  interface Configuration extends JournalEntryPageHandlebarsSheet.Configuration {}
  interface RenderOptions extends JournalEntryPageHandlebarsSheet.RenderOptions {}
}

declare abstract class AnyJournalEntryPageVideoSheet extends JournalEntryPageVideoSheet<
  JournalEntryPageVideoSheet.RenderContext,
  JournalEntryPageVideoSheet.Configuration,
  JournalEntryPageVideoSheet.RenderOptions
> {
  constructor(...args: never);
}

export default JournalEntryPageVideoSheet;
