import type { DeepPartial, Identity } from "#utils";
import type ApplicationV2 from "../api/application.d.mts";
import type HandlebarsApplicationMixin from "../api/handlebars-application.d.mts";
import type PlaceableConfig from "./placeable-config.d.mts";

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
  /**
   * @defaultValue
   * ```js
   * {
   *   classes: ["drawing-config"],
   *   canCreate: true,
   *   window: {
   *     contentClasses: ["standard-form"],
   *     icon: "fa-solid fa-pencil"
   *   },
   *   position: { width: 480 },
   *   form: { closeOnSubmit: true }
   * }
   * ```
   */
  static override DEFAULT_OPTIONS: PlaceableConfig.DefaultOptions<DrawingDocument.Implementation>;

  static override PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  /**
   * @defaultValue
   * ```js
   * {
   *   sheet: {
   *     tabs: [
   *       { id: "position", icon: "fa-solid fa-location-dot" },
   *       { id: "lines", icon: "fa-solid fa-paintbrush" },
   *       { id: "fill", icon: "fa-regular fa-fill-drip" },
   *       { id: "text", icon: "fa-solid fa-font" }
   *     ],
   *     initial: "position",
   *     labelPrefix: "DRAWING.TABS"
   *   }
   * }
   * ```
   */
  static override TABS: Record<string, ApplicationV2.TabsConfiguration>;

  protected override _previewChanges(changes: foundry.documents.BaseDrawing.UpdateData): void;

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
    formData: foundry.applications.ux.FormDataExtended,
  ): object;

  protected override _processSubmitData(
    event: SubmitEvent,
    form: HTMLFormElement,
    submitData: object,
    options?: unknown,
  ): Promise<foundry.applications.api.DocumentSheetV2.SubmitResult<DrawingDocument.Implementation>>;

  #DrawingConfig: true;
}

declare namespace DrawingConfig {
  interface Any extends AnyDrawingConfig {}
  interface AnyConstructor extends Identity<typeof AnyDrawingConfig> {}

  interface RenderContext extends PlaceableConfig.RenderContext<DrawingDocument.Implementation> {
    tabClasses: string;
    userColor: Color;
    units: {
      degrees: string;
      pixels: string;
    };
    tab?: ApplicationV2.Tab | undefined;
    drawingRoles?: Record<"false" | "true", string> | undefined;
    scaledBezierFactor?: number | undefined;
    fillDisabled?: boolean | undefined;
    fillTypes?: { value: CONST.DRAWING_FILL_TYPES; label: string }[] | undefined;
    fontFamilies?: Record<string, string> | undefined;
    buttons?: ApplicationV2.FormFooterButton[] | undefined;
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
