import type HandlebarsApplicationMixin from "../api/handlebars-application.d.mts";
import type DocumentSheetV2 from "../api/document-sheet.d.mts";
import type ApplicationV2 from "../api/application.d.mts";
import type SceneConfig from "../sheets/scene-config.d.mts";
import type FormDataExtended from "../ux/form-data-extended.d.mts";
import type { DeepPartial, Identity } from "#utils";

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      GridConfig: GridConfig.Any;
    }
  }
}

/**
 * A tool for fine-tuning the grid in a Scene
 */
declare class GridConfig<
  RenderContext extends GridConfig.RenderContext = GridConfig.RenderContext,
  Configuration extends GridConfig.Configuration = GridConfig.Configuration,
  RenderOptions extends GridConfig.RenderOptions = GridConfig.RenderOptions,
> extends HandlebarsApplicationMixin(DocumentSheetV2)<
  Scene.Implementation,
  RenderContext,
  Configuration,
  RenderOptions
> {
  /**
   * @defaultValue
   * ```js
   * {
   *   classes: ["grid-config"],
   *   window: {
   *     contentClasses: ["standard-form"],
   *     icon: "fa-solid fa-ruler-combined"
   *   },
   *   position: {width: 480},
   *   form: {
   *     closeOnSubmit: true
   *   },
   *   actions: {
   *     resetChanges: GridConfig.#onResetChanges
   *   },
   *   sheetConfig: false,
   *   ownershipConfig: false
   * }
   * ```
   */
  static override DEFAULT_OPTIONS: DocumentSheetV2.DefaultOptions;

  static override PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  /**
   * Track the Scene Configuration sheet reference.
   */
  sheet: SceneConfig;

  override get title(): string;

  protected override _configureRenderOptions(options: DeepPartial<RenderOptions>): void;

  protected override _prepareContext(
    options: DeepPartial<RenderOptions> & { isFirstRender: boolean },
  ): Promise<RenderContext>;

  protected override _onRender(context: DeepPartial<RenderContext>, options: DeepPartial<RenderOptions>): Promise<void>;

  protected override _onClose(options: DeepPartial<RenderOptions>): void;

  protected override _onChangeForm(formConfig: ApplicationV2.FormConfiguration, event: Event): Promise<void>;

  protected override _processFormData(
    event: SubmitEvent | null,
    form: HTMLFormElement,
    formData: FormDataExtended,
  ): object;

  protected override _processSubmitData(
    event: SubmitEvent,
    form: HTMLFormElement,
    submitData: object,
    options?: unknown,
  ): Promise<DocumentSheetV2.SubmitResult<Scene.Implementation>>;
}

declare namespace GridConfig {
  interface Any extends AnyGridConfig {}
  interface AnyConstructor extends Identity<typeof AnyGridConfig> {}

  interface RenderContext
    extends HandlebarsApplicationMixin.RenderContext, DocumentSheetV2.RenderContext<Scene.Implementation> {
    scene: Scene.Implementation | null;
    src: string | undefined;
    gridTypes: ReturnType<typeof SceneConfig._getGridTypes>;
    scale: number;
    pixelsLabel: string;
    buttons: ApplicationV2.FormFooterButton[];
  }

  interface Configuration
    extends HandlebarsApplicationMixin.Configuration, DocumentSheetV2.Configuration<Scene.Implementation> {}

  interface RenderOptions extends HandlebarsApplicationMixin.RenderOptions, DocumentSheetV2.RenderOptions {}
}

declare abstract class AnyGridConfig extends GridConfig<
  GridConfig.RenderContext,
  GridConfig.Configuration,
  GridConfig.RenderOptions
> {
  constructor(...args: never);
}

export default GridConfig;
