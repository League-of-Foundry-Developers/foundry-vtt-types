import type ApplicationV2 from "../../api/application.d.mts";
import type HandlebarsApplicationMixin from "../../api/handlebars-application.d.mts";
import type AbstractSidebarTab from "../sidebar-tab.d.mts";

/**
 * The sidebar chat tab.
 * @remarks TODO: Stub
 */
declare class ChatLog<
  RenderContext extends ChatLog.RenderContext = ChatLog.RenderContext,
  Configuration extends ApplicationV2.Configuration = ApplicationV2.Configuration,
  RenderOptions extends ApplicationV2.RenderOptions = ApplicationV2.RenderOptions,
> extends HandlebarsApplicationMixin(AbstractSidebarTab)<RenderContext, Configuration, RenderOptions> {}

declare namespace ChatLog {
  interface RenderContext extends AbstractSidebarTab.RenderContext {}
}

export default ChatLog;
