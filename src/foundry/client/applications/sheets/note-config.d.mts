import type { DeepPartial, Identity } from "#utils";
import type ApplicationV2 from "../api/application.d.mts";
import type HandlebarsApplicationMixin from "../api/handlebars-application.d.mts";
import type PlaceableConfig from "./placeable-config.d.mts";
import type FormDataExtended from "../ux/form-data-extended.d.mts";
import type { StringField } from "#common/data/fields.d.mts";

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
   *   position: { width: 480 },
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
  static override DEFAULT_OPTIONS: PlaceableConfig.DefaultOptions<NoteDocument.Implementation>;

  static override PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  get title(): string;

  protected override _prepareContext(
    options: DeepPartial<RenderOptions> & { isFirstRender: boolean },
  ): Promise<RenderContext>;

  protected override _onChangeForm(formConfig: ApplicationV2.FormConfiguration, event: Event): void;

  protected override _processFormData(
    event: SubmitEvent | null,
    form: HTMLFormElement,
    formData: FormDataExtended,
  ): object;

  protected override _previewChanges(changes: foundry.documents.BaseNote.UpdateData): void;

  #NoteConfig: true;
}

declare namespace NoteConfig {
  interface Any extends AnyNoteConfig {}
  interface AnyConstructor extends Identity<typeof AnyNoteConfig> {}

  interface RenderContext extends PlaceableConfig.RenderContext<NoteDocument.Implementation> {
    author: string;
    entries: { value: string; label: string }[];
    entry: JournalEntry.Implementation | null;
    pages: Record<string, string>;
    global: boolean;
    icon: {
      selected: string;
      custom: string;
      field: StringField;
    };
    fontFamilies: Record<string, string>;
    textAnchors: Record<CONST.TEXT_ANCHOR_POINTS, string>;
    buttons: ApplicationV2.FormFooterButton[];
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
