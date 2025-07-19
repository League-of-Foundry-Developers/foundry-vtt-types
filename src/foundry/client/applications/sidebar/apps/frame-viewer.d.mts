import type { DeepPartial, Identity } from "#utils";
import type ApplicationV2 from "../../api/application.mjs";

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      FrameViewer: FrameViewer.Any;
    }
  }
}

/**
 * A simple window application which shows the built documentation pages within an iframe
 * @remarks TODO: Stub
 */
declare class FrameViewer<
  RenderContext extends FrameViewer.RenderContext = FrameViewer.RenderContext,
  Configuration extends FrameViewer.Configuration = FrameViewer.Configuration,
  RenderOptions extends FrameViewer.RenderOptions = FrameViewer.RenderOptions,
> extends ApplicationV2<RenderContext, Configuration, RenderOptions> {
  // Fake override.
  static override DEFAULT_OPTIONS: FrameViewer.DefaultOptions;
}

declare namespace FrameViewer {
  interface Any extends AnyFrameViewer {}
  interface AnyConstructor extends Identity<typeof AnyFrameViewer> {}

  interface RenderContext extends ApplicationV2.RenderContext {}

  interface Configuration<FrameViewer extends FrameViewer.Any = FrameViewer.Any>
    extends ApplicationV2.Configuration<FrameViewer> {
    /** The initial URL to navigate to */
    url: string;
  }

  // Note(LukeAbby): This `& object` is so that the `DEFAULT_OPTIONS` can be overridden more easily
  // Without it then `static override DEFAULT_OPTIONS = { unrelatedProp: 123 }` would error.
  type DefaultOptions<FrameViewer extends FrameViewer.Any = FrameViewer.Any> = DeepPartial<Configuration<FrameViewer>> &
    object;

  interface RenderOptions extends ApplicationV2.RenderOptions {}
}

declare abstract class AnyFrameViewer extends FrameViewer<
  FrameViewer.RenderContext,
  FrameViewer.Configuration,
  FrameViewer.RenderOptions
> {
  constructor(...args: never);
}

export default FrameViewer;
