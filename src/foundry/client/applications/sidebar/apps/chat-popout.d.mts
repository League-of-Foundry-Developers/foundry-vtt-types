import type { Identity } from "#utils";
import type ApplicationV2 from "../../api/application.mjs";

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      ChatPopout: ChatPopout.Any;
    }
  }
}

/**
 * A simple application for rendering a single chat message in its own frame.
 * @remarks TODO: Stub
 */
declare class ChatPopout<
  RenderContext extends ChatPopout.RenderContext = ChatPopout.RenderContext,
  Configuration extends ChatPopout.Configuration = ChatPopout.Configuration,
  RenderOptions extends ChatPopout.RenderOptions = ChatPopout.RenderOptions,
> extends ApplicationV2<RenderContext, Configuration, RenderOptions> {}

declare namespace ChatPopout {
  interface Any extends AnyChatPopout {}
  interface AnyConstructor extends Identity<typeof AnyChatPopout> {}

  interface RenderContext extends ApplicationV2.RenderContext {}

  interface Configuration extends ApplicationV2.Configuration {
    /** The message being rendered. */
    message: ChatMessage.Implementation;
  }

  interface RenderOptions extends ApplicationV2.RenderOptions {}
}

declare abstract class AnyChatPopout extends ChatPopout<
  ChatPopout.RenderContext,
  ChatPopout.Configuration,
  ChatPopout.RenderOptions
> {
  constructor(...args: never);
}

export default ChatPopout;
