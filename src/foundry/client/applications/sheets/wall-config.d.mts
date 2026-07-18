import type { DeepPartial, Identity } from "#utils";
import type ApplicationV2 from "../api/application.d.mts";
import type HandlebarsApplicationMixin from "../api/handlebars-application.d.mts";
import type PlaceableConfig from "./placeable-config.d.mts";
import type FormDataExtended from "../ux/form-data-extended.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      WallConfig: WallConfig.Any;
    }
  }
}

/**
 * The Application responsible for configuring a single Wall document within a parent Scene.
 */
declare class WallConfig<
  RenderContext extends WallConfig.RenderContext = WallConfig.RenderContext,
  Configuration extends WallConfig.Configuration = WallConfig.Configuration,
  RenderOptions extends WallConfig.RenderOptions = WallConfig.RenderOptions,
> extends PlaceableConfig<WallDocument.Implementation, RenderContext, Configuration, RenderOptions> {
  /**
   * @defaultValue
   * ```js
   * {
   *   classes: ["wall-config"],
   *   position: { width: 480 },
   *   window: {
   *     contentClasses: ["standard-form"],
   *     icon: "fa-solid fa-block-brick"
   *   },
   *   form: { closeOnSubmit: true },
   *   actions: { previewSound: WallConfig.#onPreviewSound }
   * }
   * ```
   */
  static override DEFAULT_OPTIONS: PlaceableConfig.DefaultOptions<WallDocument.Implementation>;

  static override PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  protected override _prepareContext(
    options: DeepPartial<RenderOptions> & { isFirstRender: boolean },
  ): Promise<RenderContext>;

  protected override _onChangeForm(formConfig: ApplicationV2.FormConfiguration, event: Event): void;

  protected override _onRender(context: DeepPartial<RenderContext>, options: DeepPartial<RenderOptions>): Promise<void>;

  protected override _prepareSubmitData(
    event: SubmitEvent,
    form: HTMLFormElement,
    formData: FormDataExtended,
    updateData?: unknown,
  ): object;

  #WallConfig: true;
}

declare namespace WallConfig {
  interface Any extends AnyWallConfig {}
  interface AnyConstructor extends Identity<typeof AnyWallConfig> {}

  interface RenderContext extends PlaceableConfig.RenderContext<WallDocument.Implementation> {
    coordinates: string;
    thresholdFields: {
      name: string;
      label: string;
      choices: number[] | Record<number, string> | (() => number[] | Record<number, string>) | undefined;
      disabled: boolean;
    }[];

    /**
     * @remarks Either the persisted `source.animation`, or, if that's `null`, the cleaned default for the
     * `animation` `SchemaField`.
     */
    animation: unknown;
    animationDirections: { value: number; label: string }[];
    animationTypes: typeof CONFIG.Wall.animationTypes;
    animationFieldsetClass: string;
    gridUnits: string;
    doorSounds: typeof CONFIG.Wall.doorSounds;
    buttons: ApplicationV2.FormFooterButton[];
  }

  interface Configuration extends PlaceableConfig.Configuration<WallDocument.Implementation> {}

  interface RenderOptions extends PlaceableConfig.RenderOptions {}
}

declare abstract class AnyWallConfig extends WallConfig<
  WallConfig.RenderContext,
  WallConfig.Configuration,
  WallConfig.RenderOptions
> {
  constructor(...args: never);
}

export default WallConfig;
