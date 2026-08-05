import type { DeepPartial, Identity, IntentionalPartial } from "#utils";
import type ApplicationV2 from "../api/application.d.mts";
import type DocumentSheetV2 from "../api/document-sheet.d.mts";
import type HandlebarsApplicationMixin from "../api/handlebars-application.d.mts";
import type PlaceableConfig from "./placeable-config.d.mts";
import type FormDataExtended from "../ux/form-data-extended.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      DrawingConfig: DrawingConfig.Any;
    }
  }
}

/**
 * The Application responsible for configuring a single Drawing document within a parent Scene.
 */
declare class DrawingConfig<
  RenderContext extends DrawingConfig.RenderContext = DrawingConfig.RenderContext,
  Configuration extends DrawingConfig.Configuration = DrawingConfig.Configuration,
  RenderOptions extends DrawingConfig.RenderOptions = DrawingConfig.RenderOptions,
> extends PlaceableConfig<DrawingDocument.Implementation, RenderContext, Configuration, RenderOptions> {
  static override DEFAULT_OPTIONS: PlaceableConfig.DefaultOptions;

  static override PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  static override TABS: Record<string, ApplicationV2.TabsConfiguration>;

  protected override _previewChanges(changes: DocumentSheetV2.SubmitData<DrawingDocument.Implementation>): void;

  protected override _prepareContext(
    options: DeepPartial<RenderOptions> & { isFirstRender: boolean },
  ): Promise<RenderContext>;

  protected override _preparePartContext(
    partId: string,
    context: ApplicationV2.RenderContextOf<this>,
    options: DeepPartial<RenderOptions>,
  ): Promise<ApplicationV2.RenderContextOf<this>>;

  protected override _onChangeForm(formConfig: ApplicationV2.FormConfiguration, event: Event): void;

  protected override _processFormData(
    event: SubmitEvent | null,
    form: HTMLFormElement,
    formData: FormDataExtended,
  ): DocumentSheetV2.SubmitData<DrawingDocument.Implementation>;

  protected override _processSubmitData(
    event: SubmitEvent,
    form: HTMLFormElement,
    submitData: DocumentSheetV2.SubmitData<DrawingDocument.Implementation>,
    options?: DocumentSheetV2.ProcessSubmitOptions<DrawingDocument.Implementation>,
  ): Promise<DocumentSheetV2.SubmitResult<DrawingDocument.Implementation>>;
}

declare namespace DrawingConfig {
  interface Any extends AnyDrawingConfig {}
  interface AnyConstructor extends Identity<typeof AnyDrawingConfig> {}

  /**
   * @remarks The part-specific members are `IntentionalPartial`ed because each is only added for the one
   * part that consumes it.
   */
  interface RenderContext
    extends PlaceableConfig.RenderContext<DrawingDocument.Implementation>, IntentionalPartial<PreparePartContext> {
    tabClasses: string;

    /** @remarks The current User's color. */
    userColor: Color;

    units: Units;
  }

  interface Units {
    degrees: string;

    pixels: string;
  }

  /** @remarks Added by {@linkcode DrawingConfig._preparePartContext | #_preparePartContext} */
  interface PreparePartContext {
    /** @remarks Only added when the part being rendered is also a tab of the `sheet` group. */
    tab: ApplicationV2.Tab;

    /** @remarks Added for the `position` part; maps the `interface` field's values to their labels. */
    drawingRoles: Record<"false" | "true", string>;

    /** @remarks Added for the `lines` part; the source `bezierFactor` doubled for display. */
    scaledBezierFactor: number;

    /** @remarks Added for the `fill` part. */
    fillDisabled: boolean;

    /** @remarks Added for the `fill` part. */
    fillTypes: FillTypeChoice[];

    /**
     * @remarks Added for the `text` part; the value of
     * {@linkcode foundry.applications.settings.menus.FontConfig | FontConfig}`.getAvailableFontChoices()`.
     */
    fontFamilies: Record<string, string>;

    /** @remarks Added for the `footer` part. */
    buttons: ApplicationV2.FormFooterButton[];
  }

  interface FillTypeChoice {
    value: CONST.DRAWING_FILL_TYPES;

    label: string;
  }

  interface Configuration extends PlaceableConfig.Configuration<DrawingDocument.Implementation> {}

  interface RenderOptions extends PlaceableConfig.RenderOptions {}
}

declare abstract class AnyDrawingConfig extends DrawingConfig<
  DrawingConfig.RenderContext,
  DrawingConfig.Configuration,
  DrawingConfig.RenderOptions
> {
  constructor(...args: never);
}

export default DrawingConfig;
