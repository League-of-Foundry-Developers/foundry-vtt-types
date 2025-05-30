import type { Identity } from "#utils";
import type HandlebarsApplicationMixin from "../../api/handlebars-application.d.mts";
import type AbstractSidebarTab from "../sidebar-tab.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      ChatLog: ChatLog.Any;
    }
  }
}

/**
 * The sidebar chat tab.
 * @remarks TODO: Stub
 */
declare class ChatLog<
  RenderContext extends ChatLog.RenderContext = ChatLog.RenderContext,
  Configuration extends ChatLog.Configuration = ChatLog.Configuration,
  RenderOptions extends ChatLog.RenderOptions = ChatLog.RenderOptions,
> extends HandlebarsApplicationMixin(AbstractSidebarTab)<RenderContext, Configuration, RenderOptions> {}

declare namespace ChatLog {
  interface Any extends AnyChatLog {}
  interface AnyConstructor extends Identity<typeof AnyChatLog> {}

  interface RenderContext extends HandlebarsApplicationMixin.RenderContext, AbstractSidebarTab.RenderContext {}
  interface Configuration extends HandlebarsApplicationMixin.Configuration, AbstractSidebarTab.Configuration {}
  interface RenderOptions extends HandlebarsApplicationMixin.RenderOptions, AbstractSidebarTab.RenderOptions {}
}

declare abstract class AnyChatLog extends ChatLog<ChatLog.RenderContext, ChatLog.Configuration, ChatLog.RenderOptions> {
  constructor(...args: never);
}

export default ChatLog;
