import type { DeepPartial, Identity } from "#utils";
import type ApplicationV2 from "../../api/application.d.mts";
import type HandlebarsApplicationMixin from "../../api/handlebars-application.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      CameraPopout: CameraPopout.Any;
    }
  }
}

/**
 * An application for a single popped-out camera.
 * @remarks TODO: Stub
 */
declare class CameraPopout<
  RenderContext extends CameraPopout.RenderContext = CameraPopout.RenderContext,
  Configuration extends CameraPopout.Configuration = CameraPopout.Configuration,
  RenderOptions extends CameraPopout.RenderOptions = CameraPopout.RenderOptions,
> extends HandlebarsApplicationMixin(ApplicationV2)<RenderContext, Configuration, RenderOptions> {
  static override DEFAULT_OPTIONS: CameraPopout.DefaultOptions;
}

declare namespace CameraPopout {
  interface Any extends AnyCameraPopout {}
  interface AnyConstructor extends Identity<typeof AnyCameraPopout> {}

  interface RenderContext extends HandlebarsApplicationMixin.RenderContext, ApplicationV2.RenderContext {
    rootId: string;
  }

  interface Configuration<CameraPopout extends CameraPopout.Any = CameraPopout.Any>
    extends HandlebarsApplicationMixin.Configuration, ApplicationV2.Configuration<CameraPopout> {
    user: User.Implementation;
  }

  // Note(LukeAbby): This `& object` is so that the `DEFAULT_OPTIONS` can be overridden more easily
  // Without it then `static override DEFAULT_OPTIONS = { unrelatedProp: 123 }` would error.
  type DefaultOptions<CameraPopout extends CameraPopout.Any = CameraPopout.Any> = DeepPartial<
    Configuration<CameraPopout>
  > &
    object;

  interface RenderOptions extends HandlebarsApplicationMixin.RenderOptions, ApplicationV2.RenderOptions {}
}

declare abstract class AnyCameraPopout extends CameraPopout<
  CameraPopout.RenderContext,
  CameraPopout.Configuration,
  CameraPopout.RenderOptions
> {}

export default CameraPopout;
