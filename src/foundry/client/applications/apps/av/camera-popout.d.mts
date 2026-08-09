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

  static override DEFAULT_OPTIONS: CameraPopout.DefaultOptions;

  static override PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  /**
   * The user this camera view is for.
   */
  get user(): User.Stored;

  /** @remarks Sets `uniqueId` to the user's ID and seeds the position from that user's stored AV settings. */
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

  /** @remarks Forces `height` back to `"auto"` so the camera keeps its aspect ratio. */
  protected override _prePosition(position: ApplicationV2.Position): void;

  /** @remarks Persists the new position into the user's AV settings, debounced by one second. */
  override setPosition(position?: DeepPartial<ApplicationV2.Position>): ApplicationV2.Position;

  /** @remarks Forwards every action other than `toggleDocked` to the matching handler on {@linkcode CameraViews}. */
  protected override _onClickAction(event: PointerEvent, target: HTMLElement): void;

  #CameraPopout: true;
}

declare namespace CameraPopout {
  interface Any extends AnyCameraPopout {}
  interface AnyConstructor extends Identity<typeof AnyCameraPopout> {}

  /** The options accepted by the {@linkcode CameraPopout} constructor; `user` is required. */
  type InputOptions<Configuration extends CameraPopout.Configuration> = DeepPartial<Omit<Configuration, "user">> & {
    user: Configuration["user"];
  };

  /**
   * @remarks {@linkcode CameraPopout._prepareContext | CameraPopout#_prepareContext} merges in the same
   * per-user context the dock builds via {@linkcode CameraViews._prepareUserContext | CameraViews#_prepareUserContext}.
   */
  interface RenderContext
    extends HandlebarsApplicationMixin.RenderContext, ApplicationV2.RenderContext, CameraViews.UserContext {
    rootId: string;
  }

  interface Configuration<CameraPopout extends CameraPopout.Any = CameraPopout.Any>
    extends HandlebarsApplicationMixin.Configuration, ApplicationV2.Configuration<CameraPopout> {
    user: User.Stored;
  }

  // Note(LukeAbby): This `& object` is so that the `DEFAULT_OPTIONS` can be overridden more easily
  // Without it then `static override DEFAULT_OPTIONS = { unrelatedProp: 123 }` would error.
  type DefaultOptions<CameraPopout extends CameraPopout.Any = CameraPopout.Any> = DeepPartial<
    Omit<Configuration<CameraPopout>, "user">
  > &
    object;

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
