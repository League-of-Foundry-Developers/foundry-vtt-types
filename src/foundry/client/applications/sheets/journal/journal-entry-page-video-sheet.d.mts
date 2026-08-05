import type { DeepPartial, Identity, IntentionalPartial } from "#utils";
import type JournalEntryPageHandlebarsSheet from "./journal-entry-page-hbs-sheet.d.mts";
import type JournalEntryPageSheet from "./journal-entry-page-sheet.d.mts";
import type HandlebarsApplicationMixin from "../../api/handlebars-application.d.mts";
import type ApplicationV2 from "../../api/application.d.mts";
import type DocumentSheetV2 from "../../api/document-sheet.d.mts";
import type FormDataExtended from "../../ux/form-data-extended.d.mts";
import type HTMLFilePickerElement from "../../elements/file-picker.d.mts";
import type { FormInputConfig, TextInputConfig } from "../../forms/fields.d.mts";
import type { DataField, NumberField } from "#common/data/fields.d.mts";

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
  static override DEFAULT_OPTIONS: JournalEntryPageSheet.DefaultOptions;

  static override EDIT_PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  static override VIEW_PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  protected override _prepareContentContext(
    context: ApplicationV2.RenderContextOf<this>,
    options: DeepPartial<RenderOptions>,
  ): Promise<void>;

  /**
   * @remarks In view mode, applies the page's volume and starting timestamp to the rendered YouTube player or
   * `video` element.
   */
  protected override _onRender(context: DeepPartial<RenderContext>, options: DeepPartial<RenderOptions>): Promise<void>;

  /**
   * Get the YouTube player parameters depending on whether the sheet is being viewed or edited.
   */
  protected _getYouTubeVars(): YT.PlayerVars;

  /**
   * @remarks Folds the separate hours, minutes, and seconds inputs back into `video.timestamp`.
   */
  protected override _prepareSubmitData(
    event: SubmitEvent,
    form: HTMLFormElement,
    formData: FormDataExtended,
    updateData?: DocumentSheetV2.SubmitData<JournalEntryPage.Implementation>,
  ): DocumentSheetV2.SubmitData<JournalEntryPage.Implementation>;

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
   * @remarks Returns an empty object for a falsy `timestamp`, and omits any zeroed hours or minutes.
   */
  protected _timestampToTimeComponents(timestamp: number): JournalEntryPageVideoSheet.TimeComponents;
}

declare namespace JournalEntryPageVideoSheet {
  interface Any extends AnyJournalEntryPageVideoSheet {}
  interface AnyConstructor extends Identity<typeof AnyJournalEntryPageVideoSheet> {}

  /**
   * @remarks Members added by
   * {@linkcode JournalEntryPageVideoSheet._prepareContentContext | #_prepareContentContext} are `IntentionalPartial`ed
   * because they are only set for the `content` part.
   */
  interface RenderContext
    extends JournalEntryPageHandlebarsSheet.RenderContext, IntentionalPartial<PrepareContentContext> {}

  /** @remarks Added for the `content` part. */
  interface PrepareContentContext {
    /** @remarks The page's video source path. */
    src: JournalEntryPage.Implementation["src"];

    srcInput: SourceInput;

    /** @remarks Whether the video has neither an explicit width nor height. */
    flexRatio: boolean;

    isYouTube: boolean;

    timestamp: TimestampContext;

    yt: YouTubeContext;
  }

  /**
   * Create a FilePicker input for the video source field.
   * @remarks The `field` parameter exists so this can be called as a Handlebars field helper; it is ignored.
   */
  type SourceInput = (field: DataField.Any, inputConfig: FormInputConfig<string>) => HTMLFilePickerElement;

  /** @remarks The hours, minutes, and seconds inputs of the video's starting timestamp. */
  interface TimestampContext {
    h: TimestampPart;

    m: TimestampTextPart;

    s: TimestampTextPart;
  }

  interface TimestampPart {
    field: NumberField;

    /** @remarks `undefined` when the page has no starting timestamp, or when this component is zero. */
    value: number | undefined;
  }

  interface TimestampTextPart extends TimestampPart {
    /**
     * @remarks Renders this component as a text input rather than a number input. The `field` parameter exists so
     * this can be called as a Handlebars field helper; it is ignored.
     */
    input: (field: DataField.Any, config: TextInputConfig) => HTMLInputElement;
  }

  /** @remarks The embed data for a YouTube-hosted video. */
  interface YouTubeContext {
    /** @remarks A randomly generated `youtube-`-prefixed element ID. */
    id: string;

    url: string;
  }

  /** @remarks Every component is omitted when it would be zero. */
  interface TimeComponents {
    h?: number | undefined;

    m?: number | undefined;

    s?: number | undefined;
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
