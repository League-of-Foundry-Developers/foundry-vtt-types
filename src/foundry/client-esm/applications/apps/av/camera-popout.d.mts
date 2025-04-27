import type ApplicationV2 from "../../api/application.d.mts";
import type HandlebarsApplicationMixin from "../../api/handlebars-application.d.mts";

/**
 * An application for a single popped-out camera.
 * @remarks TODO: Stub
 */
declare class CameraPopout<
  RenderContext extends CameraPopout.RenderContext = CameraPopout.RenderContext,
  Configuration extends CameraPopout.Configuration = CameraPopout.Configuration,
  RenderOptions extends
    HandlebarsApplicationMixin.ApplicationV2RenderOptions = HandlebarsApplicationMixin.ApplicationV2RenderOptions,
> extends HandlebarsApplicationMixin(ApplicationV2)<RenderContext, Configuration, RenderOptions> {}

declare namespace CameraPopout {
  interface Configuration extends ApplicationV2.Configuration {
    user: User.Implementation;
  }

  interface RenderContext extends ApplicationV2.RenderContext {}
}

export default CameraPopout;
