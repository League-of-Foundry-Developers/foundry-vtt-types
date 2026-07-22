import type { DeepPartial, Identity } from "#utils";
import type ApplicationV2 from "../../api/application.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      ChatPopout: ChatPopout.Any;
    }
  }
}

/**
 * A simple application for rendering a single chat message in its own frame.
 */
declare class ChatPopout<
  RenderContext extends ChatPopout.RenderContext = ChatPopout.RenderContext,
  Configuration extends ChatPopout.Configuration = ChatPopout.Configuration,
  RenderOptions extends ChatPopout.RenderOptions = ChatPopout.RenderOptions,
> extends ApplicationV2<RenderContext, Configuration, RenderOptions> {
  constructor(options: ChatPopout.InputOptions<Configuration>);

  /**
   * @defaultValue
   * ```js
   * {
   *   classes: ["chat-popout", "themed", "theme-light"],
   *   position: {
   *     width: 300
   *   }
   * }
   * ```
   */
  static override DEFAULT_OPTIONS: ChatPopout.DefaultOptions;

  /**
   * The message being rendered.
   */
  get message(): ChatMessage.Implementation;

  override get title(): string;

  protected override _initializeApplicationOptions(options: DeepPartial<Configuration>): Configuration;

  protected override _onClose(options: DeepPartial<RenderOptions>): void;

  protected override _onFirstRender(
    context: DeepPartial<RenderContext>,
    options: DeepPartial<RenderOptions>,
  ): Promise<void>;

  protected override _renderHTML(context: RenderContext, options: DeepPartial<RenderOptions>): Promise<HTMLElement>;

  protected override _replaceHTML(result: HTMLElement, content: HTMLElement, options: DeepPartial<RenderOptions>): void;

  protected override _attachFrameListeners(): void;

  #ChatPopout: true;
}

declare namespace ChatPopout {
  interface Any extends AnyChatPopout {}
  interface AnyConstructor extends Identity<typeof AnyChatPopout> {}

  interface RenderContext extends ApplicationV2.RenderContext {}

  interface Configuration<
    ChatPopout extends ChatPopout.Any = ChatPopout.Any,
  > extends ApplicationV2.Configuration<ChatPopout> {
    /** The message being rendered. */
    message: ChatMessage.Implementation;
  }

  // Note(LukeAbby): This `& object` is so that the `DEFAULT_OPTIONS` can be overridden more easily
  // Without it then `static override DEFAULT_OPTIONS = { unrelatedProp: 123 }` would error.
  type DefaultOptions<ChatPopout extends ChatPopout.Any = ChatPopout.Any> = DeepPartial<Configuration<ChatPopout>> &
    object;

  /**
   * @remarks `message` is required, as the constructor throws if it isn't an instance of {@linkcode ChatMessage}.
   */
  type InputOptions<Configuration extends ChatPopout.Configuration = ChatPopout.Configuration> = DeepPartial<
    Omit<Configuration, "message">
  > & { message: Configuration["message"] };

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
