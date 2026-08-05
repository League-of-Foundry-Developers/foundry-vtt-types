import type { DeepPartial, Identity } from "#utils";
import type JournalEntryPageHandlebarsSheet from "./journal-entry-page-hbs-sheet.d.mts";
import type JournalEntryPageSheet from "./journal-entry-page-sheet.d.mts";
import type HandlebarsApplicationMixin from "../../api/handlebars-application.d.mts";
import type HTMLFilePickerElement from "../../elements/file-picker.d.mts";
import type { FormInputConfig } from "../../forms/fields.d.mts";
import type { DataField } from "#common/data/fields.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      JournalEntryPageImageSheet: JournalEntryPageImageSheet.Any;
    }
  }
}

/**
 * An Application responsible for displaying and editing a single image-type JournalEntryPage Document.
 */
declare class JournalEntryPageImageSheet<
  RenderContext extends JournalEntryPageImageSheet.RenderContext = JournalEntryPageImageSheet.RenderContext,
  Configuration extends JournalEntryPageImageSheet.Configuration = JournalEntryPageImageSheet.Configuration,
  RenderOptions extends JournalEntryPageImageSheet.RenderOptions = JournalEntryPageImageSheet.RenderOptions,
> extends JournalEntryPageHandlebarsSheet<RenderContext, Configuration, RenderOptions> {
  static override DEFAULT_OPTIONS: JournalEntryPageSheet.DefaultOptions;

  static override EDIT_PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  static override VIEW_PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  protected override _prepareContext(
    options: DeepPartial<RenderOptions> & { isFirstRender: boolean },
  ): Promise<RenderContext>;
}

declare namespace JournalEntryPageImageSheet {
  interface Any extends AnyJournalEntryPageImageSheet {}
  interface AnyConstructor extends Identity<typeof AnyJournalEntryPageImageSheet> {}

  interface RenderContext extends JournalEntryPageHandlebarsSheet.RenderContext {
    /** @remarks The page's image source path. */
    src: JournalEntryPage.Implementation["src"];

    /** @remarks The page's image caption. */
    caption: JournalEntryPage.Implementation["image"]["caption"];

    srcInput: SourceInput;
  }

  /**
   * Create a FilePicker input for the image source field.
   * @remarks The `field` parameter exists so this can be called as a Handlebars field helper; it is ignored.
   */
  type SourceInput = (field: DataField.Any, inputConfig: FormInputConfig<string>) => HTMLFilePickerElement;

  interface Configuration extends JournalEntryPageHandlebarsSheet.Configuration {}

  interface RenderOptions extends JournalEntryPageHandlebarsSheet.RenderOptions {}
}

declare abstract class AnyJournalEntryPageImageSheet extends JournalEntryPageImageSheet<
  JournalEntryPageImageSheet.RenderContext,
  JournalEntryPageImageSheet.Configuration,
  JournalEntryPageImageSheet.RenderOptions
> {
  constructor(...args: never);
}

export default JournalEntryPageImageSheet;
