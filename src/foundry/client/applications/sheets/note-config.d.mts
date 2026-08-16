import type { DeepPartial, Identity } from "#utils";
import type ApplicationV2 from "../api/application.d.mts";
import type DocumentSheetV2 from "../api/document-sheet.d.mts";
import type HandlebarsApplicationMixin from "../api/handlebars-application.d.mts";
import type PlaceableConfig from "./placeable-config.d.mts";
import type FormDataExtended from "../ux/form-data-extended.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      NoteConfig: NoteConfig.Any;
    }
  }
}

/**
 * The Application responsible for configuring a single Note document within a parent Scene.
 */
declare class NoteConfig<
  RenderContext extends NoteConfig.RenderContext = NoteConfig.RenderContext,
  Configuration extends NoteConfig.Configuration = NoteConfig.Configuration,
  RenderOptions extends NoteConfig.RenderOptions = NoteConfig.RenderOptions,
> extends PlaceableConfig<NoteDocument.Implementation, RenderContext, Configuration, RenderOptions> {
  /**
   * @defaultValue
   * ```js
   * {
   *   classes: ["note-config"],
   *   canCreate: true,
   *   position: {width: 480},
   *   window: {
   *     contentClasses: ["standard-form"],
   *     icon: "fa-solid fa-bookmark"
   *   },
   *   form: {
   *     closeOnSubmit: true
   *   }
   * }
   * ```
   */
  static override DEFAULT_OPTIONS: PlaceableConfig.DefaultOptions;

  /**
   * @defaultValue
   * ```js
   * {
   *   body: {template: "templates/scene/note/config.hbs"},
   *   footer: {template: "templates/generic/form-footer.hbs"}
   * }
   * ```
   */
  static override PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  override get title(): string;

  protected override _prepareContext(
    options: DeepPartial<RenderOptions> & { isFirstRender: boolean },
  ): Promise<RenderContext>;

  protected override _onChangeForm(formConfig: ApplicationV2.FormConfiguration, event: Event): void;

  protected override _processFormData(
    event: SubmitEvent | null,
    form: HTMLFormElement,
    formData: FormDataExtended,
  ): DocumentSheetV2.SubmitData<NoteDocument.Implementation>;

  protected override _previewChanges(changes: DocumentSheetV2.SubmitData<NoteDocument.Implementation>): void;
}

declare namespace NoteConfig {
  interface Any extends AnyNoteConfig {}
  interface AnyConstructor extends Identity<typeof AnyNoteConfig> {}

  interface RenderContext extends PlaceableConfig.RenderContext<NoteDocument.Implementation> {
    /** @remarks The name of the Note's author, or `""` if the author is unknown. */
    author: string;

    /** @remarks The visible JournalEntries, sorted by label. */
    entries: JournalEntryChoice[];

    /** @remarks The JournalEntry this Note points at, or `null` if it points at none. */
    entry: JournalEntry.Implementation | null;

    /** @remarks The visible pages of {@linkcode RenderContext.entry | entry}, keyed by page ID. */
    pages: Record<string, string>;

    /**
     * @remarks For a persisted Note this is the source `global` value; for a Note being created it defaults to
     * the inverse of the parent Scene's `tokenVision`.
     */
    global: boolean;

    icon: IconContext;

    /**
     * @remarks The value of
     * {@linkcode foundry.applications.settings.menus.FontConfig | FontConfig}`.getAvailableFontChoices()`.
     */
    fontFamilies: Record<string, string>;

    textAnchors: Record<CONST.TEXT_ANCHOR_POINTS, string>;

    buttons: ApplicationV2.FormFooterButton[];
  }

  /** An entry of {@linkcode RenderContext.entries}. */
  interface JournalEntryChoice {
    value: string;

    label: string;
  }

  /**
   * The localized and sorted icon options, along with whether a custom icon is in use.
   */
  interface IconContext {
    /** @remarks The selected preset icon path, or `""` when a custom icon is in use. */
    selected: string;

    /** @remarks The custom icon path, or `""` when a preset icon is in use. */
    custom: string;

    field: foundry.data.fields.StringField;
  }

  interface Configuration extends PlaceableConfig.Configuration<NoteDocument.Implementation> {}

  interface RenderOptions extends PlaceableConfig.RenderOptions {}
}

declare abstract class AnyNoteConfig extends NoteConfig<
  NoteConfig.RenderContext,
  NoteConfig.Configuration,
  NoteConfig.RenderOptions
> {
  constructor(...args: never);
}

export default NoteConfig;
