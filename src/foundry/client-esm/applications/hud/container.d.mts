import type ApplicationV2 from "../api/application.d.mts";

/**
 * The Heads-Up Display Container is a canvas-sized Application which renders HTML overtop of the game canvas.
 * @remarks TODO: Stub
 */
declare class HeadsUpDisplayContainer<
  RenderContext extends object = ApplicationV2.RenderContext,
  Configuration extends ApplicationV2.Configuration = ApplicationV2.Configuration,
  RenderOptions extends ApplicationV2.RenderOptions = ApplicationV2.RenderOptions,
> extends ApplicationV2<RenderContext, Configuration, RenderOptions> {}

declare namespace HeadsUpDisplayContainer {}

export default HeadsUpDisplayContainer;
