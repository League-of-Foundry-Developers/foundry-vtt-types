import type { DeepPartial, Identity, MaybePromise } from "#utils";
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
 */
declare class ChatPopout<
  RenderContext extends ChatPopout.RenderContext = ChatPopout.RenderContext,
  Configuration extends ChatPopout.Configuration = ChatPopout.Configuration,
  RenderOptions extends ChatPopout.RenderOptions = ChatPopout.RenderOptions,
> extends ApplicationV2<RenderContext, Configuration, RenderOptions> {
  /**
   * @param options - Options used to configure the Application instance
   *
   * @throws If `options.message` is not a {@linkcode ChatMessage}.
   */
  constructor(options: ChatPopout.InputOptions<Configuration>);

  // Fake override.
  static override DEFAULT_OPTIONS: ChatPopout.DefaultOptions;

  /**
   * The message being rendered.
   */
  get message(): ChatMessage.Implementation;

  /**
   * @remarks Empty when the message's content is hidden from the current user, and otherwise the message's
   * title, its flavor reduced to plain text, or the speaker's alias, whichever is defined first.
   */
  override get title(): string;

  /** @remarks Derives `uniqueId` from the message's ID, so each message pops out into its own application. */
  protected override _initializeApplicationOptions(options: DeepPartial<Configuration>): Configuration;

  /**
   * @privateRemarks Synchronous at runtime; kept as the base's {@linkcode MaybePromise}`<void>` so that async
   * overrides still fit. Post-close steps are never awaited.
   */
  protected override _onClose(options: DeepPartial<RenderOptions>): MaybePromise<void>;

  /** @remarks Registers this application against the message, so that updates to it re-render the popout. */
  protected override _onFirstRender(
    context: DeepPartial<RenderContext>,
    options: DeepPartial<RenderOptions>,
  ): Promise<void>;

  /** @remarks Delegates to `ChatLog.renderMessage`, which renders the message without a delete control. */
  protected override _renderHTML(context: RenderContext, options: DeepPartial<RenderOptions>): Promise<HTMLElement>;

  protected override _replaceHTML(result: HTMLElement, content: HTMLElement, options: DeepPartial<RenderOptions>): void;

  /** @remarks Listens for changes to a secret block, revealing or hiding it on the message itself. */
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

  type InputOptions<Configuration extends ChatPopout.Configuration> = DeepPartial<Omit<Configuration, "message">> & {
    message: Configuration["message"];
  };

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
