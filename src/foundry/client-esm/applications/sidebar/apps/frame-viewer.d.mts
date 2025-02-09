import type ApplicationV2 from "../../api/application.mjs";

/**
 * A simple window application which shows the built documentation pages within an iframe
 * @remarks TODO: Stub
 */
declare class FrameViewer<
  RenderContext extends FrameViewer.RenderContext = FrameViewer.RenderContext,
  Configuration extends FrameViewer.Configuration = FrameViewer.Configuration,
  RenderOptions extends ApplicationV2.RenderOptions = ApplicationV2.RenderOptions,
> extends ApplicationV2<RenderContext, Configuration, RenderOptions> {}

declare namespace FrameViewer {
  interface RenderContext extends ApplicationV2.RenderContext {}

  interface Configuration extends ApplicationV2.Configuration {
    /** The initial URL to navigate to */
    url: string;
  }
}

export default FrameViewer;
