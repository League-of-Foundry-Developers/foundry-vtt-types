import type { DeepPartial, Identity } from "#utils";
import type ApplicationV2 from "../api/application.d.mts";
import type DocumentSheetV2 from "../api/document-sheet.d.mts";
import type HandlebarsApplicationMixin from "../api/handlebars-application.d.mts";
import type FormDataExtended from "../ux/form-data-extended.d.mts";
import type SceneConfig from "../sheets/scene-config.d.mts";

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
  constructor(options: DocumentSheetV2.InputOptions<Configuration>);

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

  /**
   * @defaultValue
   * ```js
   * {
   *   form: {
   *     template: "templates/scene/grid-config.hbs",
   *     root: true
   *   },
   *   footer: {
   *     template: "templates/generic/form-footer.hbs"
   *   }
   * }
   * ```
   */
  static override PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  /**
   * Track the Scene Configuration sheet reference.
   * @remarks Assigned from `options.document.sheet` in the constructor.
   */
  sheet: SceneConfig.Any;

  override get title(): string;

  protected override _configureRenderOptions(options: DeepPartial<RenderOptions>): void;

  protected override _prepareContext(
    options: DeepPartial<RenderOptions> & { isFirstRender: boolean },
  ): Promise<RenderContext>;

  protected override _onRender(context: DeepPartial<RenderContext>, options: DeepPartial<RenderOptions>): Promise<void>;

  protected override _onClose(options: DeepPartial<RenderOptions>): void;

  protected override _onChangeForm(formConfig: ApplicationV2.FormConfiguration, event: Event): Promise<void>;

  /**
   * @remarks Converts the `scale` field into the `width` and `height` the submitted background texture implies,
   * then removes `scale` from the submit data.
   */
  protected override _processFormData(
    event: SubmitEvent | null,
    form: HTMLFormElement,
    formData: FormDataExtended,
  ): DocumentSheetV2.SubmitData<Scene.Implementation>;

  /**
   * @remarks Prompts for confirmation before applying any change to the Scene's dimensions, grid size, or grid type,
   * and resolves to an empty object when that confirmation is declined.
   */
  protected override _processSubmitData(
    event: SubmitEvent,
    form: HTMLFormElement,
    submitData: DocumentSheetV2.SubmitData<Scene.Implementation>,
    options?: DocumentSheetV2.ProcessSubmitOptions<Scene.Implementation>,
  ): Promise<DocumentSheetV2.SubmitResult<Scene.Implementation>>;

  #GridConfig: true;
}

declare namespace GridConfig {
  interface Any extends AnyGridConfig {}
  interface AnyConstructor extends Identity<typeof AnyGridConfig> {}

  interface RenderContext
    extends HandlebarsApplicationMixin.RenderContext, DocumentSheetV2.RenderContext<Scene.Implementation> {
    /** @remarks The preview clone of the configured Scene; `null` until the application is force-rendered. */
    scene: Scene.Implementation | null;

    /** @remarks The preview Scene's background image path, if it has one. */
    src: string | undefined;

    /** @remarks Grid type value to localized label, from `SceneConfig._getGridTypes()`. */
    gridTypes: Record<foundry.CONST.GRID_TYPES, string>;

    /** @remarks `1` when the preview Scene has no background texture. */
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
