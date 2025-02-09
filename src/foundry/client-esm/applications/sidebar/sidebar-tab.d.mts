import type ApplicationV2 from "../api/application.d.mts";

/**
 * The sidebar tab interface that allows any sidebar tab to also be rendered as a popout.
 * @remarks TODO: Stub
 */
declare class AbstractSidebarTab<
  RenderContext extends AbstractSidebarTab.RenderContext = AbstractSidebarTab.RenderContext,
  Configuration extends ApplicationV2.Configuration = ApplicationV2.Configuration,
  RenderOptions extends ApplicationV2.RenderOptions = ApplicationV2.RenderOptions,
> extends ApplicationV2<RenderContext, Configuration, RenderOptions> {}

declare namespace AbstractSidebarTab {
  interface RenderContext extends ApplicationV2.RenderContext {
    user: User.ConfiguredInstance;
  }
}

export default AbstractSidebarTab;
