import type { DeepPartial, Identity } from "#utils";
import type ApplicationV2 from "../../api/application.d.mts";
import type HandlebarsApplicationMixin from "../../api/handlebars-application.d.mts";
import type CameraViews from "./cameras.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      CameraPopout: CameraPopout.Any;
    }
  }
}

/**
 * An application for a single popped-out camera.
 */
declare class CameraPopout<
  RenderContext extends CameraPopout.RenderContext = CameraPopout.RenderContext,
  Configuration extends CameraPopout.Configuration = CameraPopout.Configuration,
  RenderOptions extends CameraPopout.RenderOptions = CameraPopout.RenderOptions,
> extends HandlebarsApplicationMixin(ApplicationV2)<RenderContext, Configuration, RenderOptions> {
  constructor(options: CameraPopout.InputOptions<Configuration>);

  /**
   * @defaultValue
   * ```js
   * {
   *   id: "camera-view-{id}",
   *   classes: ["camera-view", "popout"],
   *   window: {
   *     resizable: true,
   *     minimizable: false
   *   },
   *   position: {
   *     height: "auto"
   *   },
   *   actions: {
   *     toggleDocked: CameraPopout.#onToggleDocked
   *   }
   * }
   * ```
   */
  static override DEFAULT_OPTIONS: CameraPopout.DefaultOptions;

  /**
   * @defaultValue
   * ```js
   * {
   *   camera: {
   *     root: true,
   *     template: "templates/apps/av/camera.hbs",
   *     templates: ["templates/apps/av/controls.hbs"]
   *   }
   * }
   * ```
   */
  static override PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  /**
   * The user this camera view is for.
   */
  get user(): User.Stored;

  protected override _initializeApplicationOptions(options: DeepPartial<Configuration>): Configuration;

  protected override _onFirstRender(
    context: DeepPartial<RenderContext>,
    options: DeepPartial<RenderOptions>,
  ): Promise<void>;

  protected override _onRender(context: DeepPartial<RenderContext>, options: DeepPartial<RenderOptions>): Promise<void>;

  protected override _prepareContext(
    options: DeepPartial<RenderOptions> & { isFirstRender: boolean },
  ): Promise<RenderContext>;

  protected override _replaceHTML(
    result: Record<string, HTMLElement>,
    content: HTMLElement,
    options: DeepPartial<RenderOptions>,
  ): void;

  protected override _prePosition(position: ApplicationV2.Position): void;

  override setPosition(position?: DeepPartial<ApplicationV2.Position>): ApplicationV2.Position | void;

  protected override _onClickAction(event: PointerEvent, target: ApplicationV2.ActionTarget): void;

  #CameraPopout: true;
}

declare namespace CameraPopout {
  interface Any extends AnyCameraPopout {}
  interface AnyConstructor extends Identity<typeof AnyCameraPopout> {}

  /**
   * @remarks Merged in by {@linkcode CameraViews._prepareUserContext | CameraViews#_prepareUserContext} (accessed
   * via the `ui.webrtc` singleton) in {@linkcode CameraPopout._prepareContext | #_prepareContext}.
   */
  interface RenderContext
    extends HandlebarsApplicationMixin.RenderContext, ApplicationV2.RenderContext, Partial<CameraViews.UserContext> {
    rootId: string;
  }

  interface Configuration<CameraPopout extends CameraPopout.Any = CameraPopout.Any>
    extends HandlebarsApplicationMixin.Configuration, ApplicationV2.Configuration<CameraPopout> {
    user: User.Stored;
  }

  // Note(LukeAbby): This `& object` is so that the `DEFAULT_OPTIONS` can be overridden more easily
  // Without it then `static override DEFAULT_OPTIONS = { unrelatedProp: 123 }` would error.
  type DefaultOptions<CameraPopout extends CameraPopout.Any = CameraPopout.Any> = DeepPartial<
    Configuration<CameraPopout>
  > &
    object;

  /**
   * @remarks `user` is required, as it's used unconditionally (with no nullish-checking) in
   * {@linkcode CameraPopout._initializeApplicationOptions | #_initializeApplicationOptions}.
   */
  type InputOptions<Configuration extends CameraPopout.Configuration = CameraPopout.Configuration> = DeepPartial<
    Omit<Configuration, "user">
  > & { user: Configuration["user"] };

  interface RenderOptions extends HandlebarsApplicationMixin.RenderOptions, ApplicationV2.RenderOptions {}
}

declare abstract class AnyCameraPopout extends CameraPopout<
  CameraPopout.RenderContext,
  CameraPopout.Configuration,
  CameraPopout.RenderOptions
> {
  constructor(...args: never);
}

export default CameraPopout;
