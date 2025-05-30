import type { Identity } from "#utils";
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
> extends HandlebarsApplicationMixin(ApplicationV2)<RenderContext, Configuration, RenderOptions> {}

declare namespace CameraPopout {
  interface Any extends AnyCameraPopout {}
  interface AnyConstructor extends Identity<typeof AnyCameraPopout> {}

  interface RenderContext extends HandlebarsApplicationMixin.RenderContext, ApplicationV2.RenderContext {
    rootId: string;
  }

  interface Configuration extends HandlebarsApplicationMixin.Configuration, ApplicationV2.Configuration {
    user: User.Implementation;
  }

  interface RenderOptions extends HandlebarsApplicationMixin.RenderOptions, ApplicationV2.RenderOptions {}
}

declare abstract class AnyCameraPopout extends CameraPopout<
  CameraPopout.RenderContext,
  CameraPopout.Configuration,
  CameraPopout.RenderOptions
> {}

export default CameraPopout;
