import type ApplicationV2 from "../../api/application.mjs";

/**
 * A simple application for rendering a single chat message in its own frame.
 * @remarks TODO: Stub
 */
declare class ChatPopout<
  RenderContext extends ChatPopout.RenderContext = ChatPopout.RenderContext,
  Configuration extends ChatPopout.Configuration = ChatPopout.Configuration,
  RenderOptions extends ApplicationV2.RenderOptions = ApplicationV2.RenderOptions,
> extends ApplicationV2<RenderContext, Configuration, RenderOptions> {}

declare namespace ChatPopout {
  interface RenderContext extends ApplicationV2.RenderContext {}

  interface Configuration extends ApplicationV2.Configuration {
    /** The message being rendered. */
    message: ChatMessage.Implementation;
  }
}

export default ChatPopout;
