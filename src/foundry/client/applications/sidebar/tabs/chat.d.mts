import type { AnyObject, DeepPartial, Identity, MaybePromise } from "#utils";
import type ApplicationV2 from "../../api/application.d.mts";
import type HandlebarsApplicationMixin from "../../api/handlebars-application.d.mts";
import type AbstractSidebarTab from "../sidebar-tab.d.mts";
import type ContextMenu from "../../ux/context-menu.d.mts";
import type ChatMessages from "#client/documents/collections/chat-messages.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      ChatLog: ChatLog.Any;
    }
  }
}

/**
 * The sidebar chat tab.
 */
declare class ChatLog<
  RenderContext extends ChatLog.RenderContext = ChatLog.RenderContext,
  Configuration extends ChatLog.Configuration = ChatLog.Configuration,
  RenderOptions extends ChatLog.RenderOptions = ChatLog.RenderOptions,
> extends HandlebarsApplicationMixin(AbstractSidebarTab)<RenderContext, Configuration, RenderOptions> {
  /**
   * @defaultValue
   * ```js
   * {
   *   classes: ["flexcol"],
   *   window: {
   *     title: "CHAT.Title"
   *   },
   *   actions: {
   *     deleteMessage: ChatLog.#onDeleteMessage,
   *     dismissMessage: ChatLog.#onDismissNotification,
   *     expandRoll: ChatLog.#onExpandRoll,
   *     export: ChatLog.#onExportLog,
   *     flush: ChatLog.#onFlushLog,
   *     jumpToBottom: ChatLog.#onJumpToBottom,
   *     messageMode: ChatLog.#onChangeMessageMode
   *   }
   * }
   * ```
   */
  static override DEFAULT_OPTIONS: ChatLog.DefaultOptions;

  static override tabName: "chat";

  /**
   * @defaultValue
   * ```js
   * {
   *   log: {
   *     template: "templates/sidebar/tabs/chat/log.hbs",
   *     templates: ["templates/sidebar/tabs/chat/notifications.hbs"]
   *   },
   *   input: {
   *     template: "templates/sidebar/tabs/chat/input.hbs"
   *   }
   * }
   * ```
   */
  static override PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  /**
   * A registry of chat commands with associated regular expression patterns and processing functions.
   */
  static CHAT_COMMANDS: Record<string, ChatLog.ChatCommandPattern>;

  /**
   * The maximum number of messages to retain in the history in a given session.
   * @defaultValue `16`
   */
  static MAX_MESSAGE_HISTORY: number;

  /**
   * The number of milliseconds to keep a chat card notification until it is automatically dismissed.
   * @defaultValue `5000`
   */
  static NOTIFY_DURATION: number;

  /**
   * The notification ticker frequency.
   * @defaultValue `500`
   */
  static NOTIFY_TICKER: number;

  /**
   * The number of milliseconds to wait before unpausing the notification queue.
   * @defaultValue `2000`
   */
  static NOTIFY_UNPAUSE: number;

  /**
   * The number of milliseconds to display the chat notification pip.
   * @defaultValue `3000`
   */
  static PIP_DURATION: number;

  /**
   * How often, in milliseconds, to update timestamps.
   * @defaultValue `1000 * 15`
   */
  static UPDATE_TIMESTAMP_FREQUENCY: number;

  /**
   * A reference to the Messages collection that the chat log displays.
   */
  get collection(): ChatMessages.Implementation;

  /**
   * Message history management.
   */
  get history(): { index: number; pending: string; queue: string[] };

  /**
   * A flag for whether the chat log is currently scrolled to the bottom.
   */
  get isAtBottom(): boolean;

  protected override _configureRenderOptions(options: DeepPartial<RenderOptions>): void;

  /**
   * Get context menu entries for chat messages in the log.
   */
  protected _getEntryContextOptions(): ContextMenu.Entry<HTMLElement>[];

  protected override _onFirstRender(
    context: DeepPartial<RenderContext>,
    options: DeepPartial<RenderOptions>,
  ): Promise<void>;

  protected override _onRender(context: DeepPartial<RenderContext>, options: DeepPartial<RenderOptions>): Promise<void>;

  protected override _postRender(
    context: DeepPartial<RenderContext>,
    options: DeepPartial<RenderOptions>,
  ): Promise<void>;

  protected override _preparePartContext(
    partId: string,
    context: ApplicationV2.RenderContextOf<this>,
    options: DeepPartial<RenderOptions>,
  ): Promise<ApplicationV2.RenderContextOf<this>>;

  /**
   * Prepare rendering context for the chat panel's message input component.
   * @param context - Shared context provided by _prepareContext
   * @param options - Options which configure application rendering behavior
   */
  protected _prepareInputContext(
    context: ApplicationV2.RenderContextOf<this>,
    options: DeepPartial<RenderOptions>,
  ): Promise<void>;

  protected override _renderHTML(
    context: ApplicationV2.RenderContextOf<this>,
    options: DeepPartial<ApplicationV2.RenderOptionsOf<this>>,
  ): Promise<Record<string, HTMLElement>>;

  protected override _preSyncPartState(
    partId: string,
    newElement: HTMLElement,
    priorElement: HTMLElement,
    state: HandlebarsApplicationMixin.PartState,
  ): void;

  /**
   * Prepare data used to synchronize the state of the chat input.
   * @param newElement   - The newly-rendered element.
   * @param priorElement - The existing element.
   * @param state        - A state object which is used to synchronize after replacement.
   */
  protected _preSyncInputState(
    newElement: HTMLElement,
    priorElement: HTMLElement,
    state: HandlebarsApplicationMixin.PartState,
  ): void;

  protected override _syncPartState(
    partId: string,
    newElement: HTMLElement,
    priorElement: HTMLElement,
    state: HandlebarsApplicationMixin.PartState,
  ): void;

  /**
   * Synchronize the state of the chat input.
   * @param newElement   - The newly-rendered element.
   * @param priorElement - The element being replaced.
   * @param state        - The state object used to synchronize the pre- and post-render states.
   */
  protected _syncInputState(
    newElement: HTMLElement,
    priorElement: HTMLElement,
    state: HandlebarsApplicationMixin.PartState,
  ): void;

  protected override _attachPartListeners(
    partId: string,
    htmlElement: HTMLElement,
    options: DeepPartial<RenderOptions>,
  ): void;

  /**
   * Attach listeners to the chat log.
   * @param element - The log element.
   * @param options - Options which configure application rendering behavior
   */
  protected _attachLogListeners(element: HTMLElement, options: DeepPartial<RenderOptions>): void;

  protected override _onActivate(): void;

  /**
   * Handle clicking a chat card notification.
   * Treat action button clicks within the Notifications UI as action clicks on the ChatLog instance itself.
   * @param event - The triggering event.
   */
  protected _onClickNotification(event: PointerEvent): void;

  protected override _onClose(options: DeepPartial<RenderOptions>): void;

  /**
   * Configure chat-specific plugins.
   * @param event - The plugin configuration event.
   * @remarks Foundry types `event` as a `ProseMirrorPluginsEvent` (an internal, unexported `CustomEvent` subclass
   * with a `plugins` getter returning `Record<string, ProseMirror.Plugin>`), but that class isn't part of the
   * public API and ProseMirror's plugin types aren't modeled by fvtt-types; typed loosely as the base `Event`.
   */
  protected _onConfigurePlugins(event: Event): void;

  protected override _onDeactivate(): void;

  protected override _preClose(options: DeepPartial<RenderOptions>): Promise<void>;

  /**
   * Parse a chat string to identify the chat command (if any) which was used.
   * @param message - The message to parse.
   * @returns The identified command, regex match, and associated handler function.
   */
  static parse(
    message: string,
  ): [
    command: string,
    match: string[] | RegExpMatchArray | RegExpMatchArray[],
    fn: ChatLog.ChatCommandCallback | undefined,
  ];

  /**
   * Prepare the data object of chat message data depending on the type of message being posted.
   * @param message - The original string of the message content
   * @param options - Additional options (default: `{}`)
   * @returns The created ChatMessage Document, or void if we were executing a macro instead.
   * @throws If an invalid command is found.
   */
  processMessage(
    message: string,
    options?: ChatLog.ProcessMessageOptions,
  ): Promise<ChatMessage.Implementation | undefined>;

  /**
   * Delete a single message from the chat log.
   * @param messageId - The ID of the ChatMessage Document to remove from the log.
   * @param options   - (default: `{}`)
   */
  deleteMessage(messageId: string, options?: ChatLog.DeleteMessageOptions): Promise<void>;

  /**
   * Trigger a notification that alerts the user visually and audibly of new chat activity.
   * @param message - The created or updated message.
   * @param options - (default: `{}`)
   */
  notify(message: ChatMessage.Implementation, options?: ChatLog.NotifyOptions): void;

  /**
   * Post a single chat message to the log.
   * @param message - The chat message.
   * @param options - (default: `{}`)
   * @returns A Promise which resolves once the message has been posted.
   */
  postOne(message: ChatMessage.Implementation, options?: ChatLog.PostOneOptions): Promise<void>;

  /**
   * Render a batch of additional messages, prepending them to the top of the log.
   * @param size - The batch size.
   */
  renderBatch(size: number): Promise<void>;

  /**
   * Scroll the chat log to the bottom.
   * @param options - (default: `{}`)
   */
  scrollBottom(options?: ChatLog.ScrollBottomOptions): Promise<void>;

  /**
   * Update the contents of a previously-posted message.
   * @param message - The ChatMessage instance to update.
   * @param options - (default: `{}`)
   */
  updateMessage(message: ChatMessage.Implementation, options?: ChatLog.UpdateMessageOptions): Promise<void>;

  /**
   * Update displayed timestamps for every displayed message in the chat log.
   * Timestamps are displayed in a humanized "time-since" format.
   */
  updateTimestamps(): void;

  /**
   * Handles chat message rendering during the ChatMessage#getHTML deprecation period. After that period ends, calls
   * to this method can be replaced by ChatMessage#renderHTML.
   * @param message - The chat message to render.
   * @param options - Options forwarded to the render function.
   * @throws If the message's render methods do not return a usable result.
   */
  static renderMessage(
    message: ChatMessage.Implementation,
    options?: ChatMessage.RenderHTMLOptions,
  ): Promise<HTMLElement>;

  /**
   * Determine whether the notifications pane should be visible.
   * @param options - (default: `{}`)
   */
  protected _shouldShowNotifications(options?: ChatLog.ShouldShowNotificationsOptions): boolean;

  /**
   * Update notification display, based on interface state.
   * If the chat log is popped-out, embed chat input into it. Otherwise,
   * if the sidebar is expanded, and the chat log is the active tab, embed chat input into it. Otherwise,
   * embed chat input into the notifications area.
   * If the sidebar is expanded, and the chat log is the active tab, do not display notifications.
   * If the chat log is popped out, do not display notifications.
   * @param options - (default: `{}`)
   * @remarks Fires the `renderChatInput` hook. Called `@internal`ly by Foundry, but this is also called externally
   * (cross-instance, via {@linkcode ui.chat | ui.chat}) by {@linkcode foundry.applications.apps.av.CameraPopout},
   * {@linkcode foundry.applications.apps.av.CameraViews}, and {@linkcode foundry.applications.sidebar.Sidebar},
   * so it's typed as public here.
   */
  _toggleNotifications(options?: ChatLog.ShouldShowNotificationsOptions): void;

  /**
   * Handle updating the chat message mode display.
   * @remarks Called `@internal`ly by Foundry, but this is also called externally (cross-instance, via
   * {@linkcode ui.chat | ui.chat}) by {@linkcode foundry.Game.initialize | Game#initialize}'s `messageMode`
   * setting's `onChange`, so it's typed as public here.
   */
  _updateMessageMode(): void;

  /**
   * An enumeration of regular expression patterns used to match chat messages.
   * @deprecated since v14
   * @remarks "ChatLog.MESSAGE_PATTERNS is deprecated. Use ChatLog.CHAT_COMMANDS instead." /
   * "Writing to ChatLog.MESSAGE_PATTERNS is deprecated. Register commands via ChatLog.CHAT_COMMANDS instead."
   */
  static MESSAGE_PATTERNS: Record<string, RegExp>;

  /**
   * The set of commands that can be processed over multiple lines.
   * @deprecated since v14
   */
  static MULTILINE_COMMANDS: Set<string>;

  #ChatLog: true;
}

declare namespace ChatLog {
  interface Any extends AnyChatLog {}
  interface AnyConstructor extends Identity<typeof AnyChatLog> {}

  interface RenderContext extends HandlebarsApplicationMixin.RenderContext, AbstractSidebarTab.RenderContext {
    /** @remarks Added by {@linkcode ChatLog._prepareInputContext | #_prepareInputContext}, only for the `input` part */
    isAtBottom?: boolean | undefined;
  }

  interface Configuration<ChatLog extends ChatLog.Any = ChatLog.Any>
    extends HandlebarsApplicationMixin.Configuration, AbstractSidebarTab.Configuration<ChatLog> {
    /**
     * Whether this ChatLog is the special "stream view" instance, which always shows chat notifications and never
     * embeds the chat input.
     */
    stream?: boolean | undefined;
  }

  // Note(LukeAbby): This `& object` is so that the `DEFAULT_OPTIONS` can be overridden more easily
  // Without it then `static override DEFAULT_OPTIONS = { unrelatedProp: 123 }` would error.
  type DefaultOptions<ChatLog extends ChatLog.Any = ChatLog.Any> = DeepPartial<Configuration<ChatLog>> & object;

  interface RenderOptions extends HandlebarsApplicationMixin.RenderOptions, AbstractSidebarTab.RenderOptions {}

  /**
   * Called in the context of a {@linkcode ChatLog} instance.
   * @param command       - The matched command name.
   * @param match         - The regex match result.
   * @param chatData      - Chat message data.
   * @param createOptions - Options passed to ChatMessage.create.
   * @returns Return `false` to prevent message creation.
   */
  type ChatCommandCallback = (
    this: ChatLog.Any,
    command: string,
    match: RegExpMatchArray | RegExpMatchArray[] | string[],
    chatData: AnyObject,
    createOptions: AnyObject,
  ) => MaybePromise<false | void>;

  interface ChatCommandPattern {
    /** The regular expression pattern used to match this command. */
    rgx: RegExp;

    /** The processing function invoked when this command is matched. */
    fn: ChatCommandCallback;

    /**
     * A chat message mode to enforce for this command. Otherwise, the default message mode is applied.
     */
    mode?: string | undefined;

    /**
     * Is this command related to rolling dice?
     * @defaultValue `false`
     */
    isRoll?: boolean | undefined;

    /**
     * Can this command be processed over multiple lines?
     * @defaultValue `false`
     */
    isMultiline?: boolean | undefined;
  }

  interface ProcessMessageOptions {
    /** The speaker data */
    speaker?: ChatMessage.SpeakerData | undefined;
  }

  interface DeleteMessageOptions {
    /**
     * Delete all messages from the log.
     * @defaultValue `false`
     */
    deleteAll?: boolean | undefined;
  }

  interface NotifyOptions {
    /** The existing rendered chat card, if it exists. */
    existing?: HTMLElement | undefined;

    /** Whether this is a new message. */
    newMessage?: boolean | undefined;
  }

  interface PostOneOptions {
    /**
     * An existing message ID to prepend the posted message to, by default the new message is appended to the end
     * of the log.
     */
    before?: string | undefined;

    /**
     * Trigger a notification which shows the log as having a new unread message.
     * @defaultValue `false`
     */
    notify?: boolean | undefined;

    /**
     * Pass `true` to always scroll-to-bottom, or `false` to suppress this. Omitting this option preserves the default
     * conditional scroll-to-bottom.
     */
    scroll?: boolean | undefined;
  }

  interface ScrollBottomOptions {
    /**
     * If a popout exists, scroll it to the bottom too.
     * @defaultValue `false`
     */
    popout?: boolean | undefined;

    /**
     * Wait for any images embedded in the chat log to load first before scrolling.
     * @defaultValue `false`
     */
    waitImages?: boolean | undefined;

    /** Options to configure scrolling behavior. */
    scrollOptions?: ScrollIntoViewOptions | undefined;
  }

  interface UpdateMessageOptions {
    /**
     * Trigger a notification which shows the log as having a new unread message.
     * @defaultValue `false`
     */
    notify?: boolean | undefined;
  }

  /**
   * @remarks The runtime options are whichever options were passed to the render or close operation that triggered
   * this method, plus `closing`.
   */
  interface ShouldShowNotificationsOptions extends DeepPartial<
    ApplicationV2.RenderOptions & ApplicationV2.ClosingOptions
  > {
    /**
     * Whether the chat popout is closing.
     * @defaultValue `false`
     */
    closing?: boolean | undefined;
  }
}

declare abstract class AnyChatLog extends ChatLog<ChatLog.RenderContext, ChatLog.Configuration, ChatLog.RenderOptions> {
  constructor(...args: never);
}

export default ChatLog;
