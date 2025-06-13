import type { Identity } from "#utils";
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
> extends ApplicationV2<RenderContext, Configuration, RenderOptions> {}

declare namespace FrameViewer {
  interface Any extends AnyFrameViewer {}
  interface AnyConstructor extends Identity<typeof AnyFrameViewer> {}

  interface RenderContext extends ApplicationV2.RenderContext {}

  interface Configuration extends ApplicationV2.Configuration {
    /** The initial URL to navigate to */
    url: string;
  }

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
