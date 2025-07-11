import type { DeepPartial, Identity } from "#utils";
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
> extends ApplicationV2<RenderContext, Configuration, RenderOptions> {
  // Fake override.
  static override DEFAULT_OPTIONS: ChatPopout.DefaultOptions;
}

declare namespace ChatPopout {
  interface Any extends AnyChatPopout {}
  interface AnyConstructor extends Identity<typeof AnyChatPopout> {}

  interface RenderContext extends ApplicationV2.RenderContext {}

  interface Configuration<ChatPopout extends ChatPopout.Any = ChatPopout.Any>
    extends ApplicationV2.Configuration<ChatPopout> {
    /** The message being rendered. */
    message: ChatMessage.Implementation;
  }

  // Note(LukeAbby): This `& object` is so that the `DEFAULT_OPTIONS` can be overridden more easily
  // Without it then `static override DEFAULT_OPTIONS = { unrelatedProp: 123 }` would error.
  type DefaultOptions<ChatPopout extends ChatPopout.Any = ChatPopout.Any> = DeepPartial<Configuration<ChatPopout>> &
    object;

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
