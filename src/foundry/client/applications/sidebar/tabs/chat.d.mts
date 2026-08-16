import type { AnyMutableObject, DeepPartial, Identity, IntentionalPartial, MaybePromise, ToMethod } from "#utils";
import type ApplicationV2 from "../../api/application.d.mts";
import type HandlebarsApplicationMixin from "../../api/handlebars-application.d.mts";
import type ContextMenu from "../../ux/context-menu.d.mts";
import type AbstractSidebarTab from "../sidebar-tab.d.mts";

import ProseMirrorPluginsEvent = foundry.applications.elements.HTMLProseMirrorElement.ProseMirrorPluginsEvent;

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
  // Fake override.
  static override DEFAULT_OPTIONS: ChatLog.DefaultOptions;

  /** @defaultValue `"chat"` */
  static override tabName: string;

  static override PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  /**
   * A registry of chat commands with associated regular expression patterns and processing functions.
   *
   * @remarks Commands are matched in insertion order.
   */
  static CHAT_COMMANDS: Record<string, ChatLog.ChatCommandPattern>;

  /**
   * The maximum number of messages to retain in the history in a given session.
   *
   * @defaultValue `16`
   */
  static MAX_MESSAGE_HISTORY: number;

  /**
   * The number of milliseconds to keep a chat card notification until it is automatically dismissed.
   *
   * @defaultValue `5000`
   */
  static NOTIFY_DURATION: number;

  /**
   * The notification ticker frequency.
   *
   * @defaultValue `500`
   */
  static NOTIFY_TICKER: number;

  /**
   * The number of milliseconds to wait before unpausing the notification queue.
   *
   * @defaultValue `2000`
   */
  static NOTIFY_UNPAUSE: number;

  /**
   * The number of milliseconds to display the chat notification pip.
   *
   * @defaultValue `3000`
   */
  static PIP_DURATION: number;

  /**
   * How often, in milliseconds, to update timestamps.
   *
   * @defaultValue `1000 * 15`
   */
  static UPDATE_TIMESTAMP_FREQUENCY: number;

  /**
   * A reference to the Messages collection that the chat log displays.
   */
  get collection(): foundry.documents.collections.ChatMessages.Implementation;

  /**
   * Message history management.
   *
   * @remarks The live object, not a copy. Capped at {@linkcode ChatLog.MAX_MESSAGE_HISTORY} entries.
   */
  get history(): ChatLog.History;

  /**
   * A flag for whether the chat log is currently scrolled to the bottom.
   */
  get isAtBottom(): boolean;

  /**
   * @remarks Later renders preserve the `log` and `input` parts.
   */
  protected override _configureRenderOptions(options: DeepPartial<RenderOptions>): void;

  /**
   * Get context menu entries for chat messages in the log.
   */
  protected _getEntryContextOptions(): ContextMenu.Entry<HTMLElement>[];

  /**
   * @remarks Initializes notifications and renders the first backlog batch.
   *
   * Fires the `getChatMessageContextOptions` hook.
   */
  protected override _onFirstRender(
    context: DeepPartial<RenderContext>,
    options: DeepPartial<RenderOptions>,
  ): Promise<void>;

  protected override _onRender(context: DeepPartial<RenderContext>, options: DeepPartial<RenderOptions>): Promise<void>;

  /** @remarks Scrolls to the bottom once the first render's images have loaded. */
  protected override _postRender(
    context: DeepPartial<RenderContext>,
    options: DeepPartial<RenderOptions>,
  ): Promise<void>;

  protected override _preparePartContext(
    partId: string,
    context: ApplicationV2.RenderContextOf<this>,
    options: DeepPartial<HandlebarsApplicationMixin.RenderOptions>,
  ): Promise<ApplicationV2.RenderContextOf<this>>;

  /**
   * Prepare rendering context for the chat panel's message input component.
   */
  protected _prepareInputContext(context: ChatLog.RenderContext, options: DeepPartial<RenderOptions>): Promise<void>;

  /** @remarks Also caches the jump-to-bottom button. */
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
  protected _preSyncInputState(newElement: HTMLElement, priorElement: HTMLElement, state: ChatLog.InputPartState): void;

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
  protected _syncInputState(newElement: HTMLElement, priorElement: HTMLElement, state: ChatLog.InputPartState): void;

  protected override _attachPartListeners(
    partId: string,
    element: HTMLElement,
    options: DeepPartial<HandlebarsApplicationMixin.RenderOptions>,
  ): void;

  /**
   * Attach listeners to the chat log.
   * @param element - The log element.
   */
  protected _attachLogListeners(element: HTMLElement, options: DeepPartial<RenderOptions>): void;

  protected override _onActivate(): void;

  /**
   * Handle clicking a chat card notification.
   * Treat action button clicks within the Notifications UI as action clicks on the ChatLog instance itself.
   * @param event - The triggering event.
   */
  protected _onClickNotification(event: PointerEvent): void;

  /**
   * @privateRemarks Synchronous at runtime; kept at the base's {@linkcode MaybePromise} width.
   */
  protected override _onClose(options: DeepPartial<RenderOptions>): MaybePromise<void>;

  /**
   * Configure chat-specific plugins.
   * @param event - The plugin configuration event.
   *
   * @remarks Applies only to the chat message editor.
   */
  protected _onConfigurePlugins(event: ProseMirrorPluginsEvent): void;

  protected override _onDeactivate(): void;

  /** @remarks Returns the chat input to the notifications area before the popout closes. */
  protected override _preClose(options: DeepPartial<RenderOptions>): Promise<void>;

  /**
   * Parse a chat string to identify the chat command (if any) which was used.
   * @param message - The message to parse.
   * @returns The identified command, regex match, and associated handler function.
   *
   * @remarks Returns `"invalid"` for unknown commands and `"none"` for ordinary text.
   */
  static parse(message: string): ChatLog.ParseResult;

  /**
   * Prepare the data object of chat message data depending on the type of message being posted.
   * @param message - The original string of the message content
   * @param options - Additional options
   * @returns The created ChatMessage Document, or void if we were executing a macro instead.
   * @throws If an invalid command is found.
   *
   * @remarks Fires the `chatMessage` hook, which can cancel creation by returning `false`.
   */
  processMessage(message: string, options?: ChatLog.ProcessMessageOptions): Promise<ChatMessage.Implementation | void>;

  /**
   * Delete a single message from the chat log.
   * @param messageId - The ID of the ChatMessage Document to remove from the log.
   */
  deleteMessage(messageId: string, options?: ChatLog.DeleteMessageOptions): Promise<void>;

  /**
   * Trigger a notification that alerts the user visually and audibly of new chat activity.
   * @param message - The created or updated message.
   */
  notify(message: ChatMessage.Implementation, options?: ChatLog.NotifyOptions): void;

  /**
   * Post a single chat message to the log.
   * @param message - The chat message.
   * @returns A Promise which resolves once the message has been posted.
   *
   * @remarks Inserts the message in timestamp order.
   */
  postOne(message: ChatMessage.Implementation, options?: ChatLog.PostOneOptions): Promise<void>;

  /**
   * Render a batch of additional messages, prepending them to the top of the log.
   * @param size - The batch size.
   *
   * @remarks Does nothing while a batch is already rendering.
   */
  renderBatch(size: number): Promise<void>;

  /**
   * Scroll the chat log to the bottom.
   */
  scrollBottom(options?: ChatLog.ScrollBottomOptions): Promise<void>;

  /**
   * Update the contents of a previously-posted message.
   * @param message - The ChatMessage instance to update.
   *
   * @remarks Adds or removes the message when its visibility changes.
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
   *
   * @remarks Hidden in pip-only mode, visible chat views, and narrow viewports.
   */
  protected _shouldShowNotifications(options?: ChatLog.ShouldShowNotificationsOptions): boolean;

  /**
   * Update notification display, based on interface state.
   * If the chat log is popped-out, embed chat input into it. Otherwise,
   * if the sidebar is expanded, and the chat log is the active tab, embed chat input into it. Otherwise,
   * embed chat input into the notifications area.
   * If the sidebar is expanded, and the chat log is the active tab, do not display notifications.
   * If the chat log is popped out, do not display notifications.
   * @param options - Options which were passed to the render or close operation that triggered this method.
   *
   * @remarks Fires `renderChatInput` and always updates {@linkcode ui.chat}'s elements.
   *
   * @internal
   */
  _toggleNotifications(options?: ChatLog.ToggleNotificationsOptions): void;

  /**
   * Handle updating the chat message mode display.
   *
   * @internal
   */
  _updateMessageMode(): void;

  /**
   * An enumeration of regular expression patterns used to match chat messages.
   *
   * @deprecated since v14 until v16.
   * @remarks "`ChatLog.MESSAGE_PATTERNS` is deprecated. Use `ChatLog.CHAT_COMMANDS` instead."
   *
   * Reads are proxied to {@linkcode ChatLog.CHAT_COMMANDS}; a write registers a legacy pattern that
   * {@linkcode ChatLog.parse} falls back to once no configured command has matched.
   */
  static MESSAGE_PATTERNS: Record<string, RegExp>;

  /**
   * The set of commands that can be processed over multiple lines.
   *
   * @deprecated since v14 until v16.
   * @remarks "Assigning a `CHAT_COMMANDS` entry to `ChatLog.MULTILINE_COMMANDS` is deprecated in favor of directly
   * configuring `isMultiline: true` in the CHAT_COMMANDS record."
   */
  static MULTILINE_COMMANDS: Set<string>;

  #ChatLog: true;

  static #ChatLogStatic: true;
}

declare namespace ChatLog {
  interface Any extends AnyChatLog {}
  interface AnyConstructor extends Identity<typeof AnyChatLog> {}

  interface History {
    /** The messages the user has sent this session, most recent last. */
    queue: string[];

    /** The position in the queue the user has scrolled back to, or `-1` when not browsing history. */
    index: number;

    /** The partially-composed message set aside while browsing history. */
    pending: string;
  }

  /**
   * Called in the context of a {@linkcode ChatLog} instance.
   * @param command       - The matched command name.
   * @param match         - The regex match result.
   * @param chatData      - Chat message data.
   * @param createOptions - Options passed to ChatMessage.create.
   * @returns Return `false` to prevent message creation.
   *
   * @privateRemarks Built-in handlers may return synchronously despite Foundry's `Promise<false|void>` typedef.
   */
  type ChatCommandCallback<ChatLog extends ChatLog.Any = ChatLog.Any> = ToMethod<
    (
      this: ChatLog,
      command: string,
      match: ParseMatch,
      chatData: AnyMutableObject,
      createOptions: AnyMutableObject,
    ) => MaybePromise<false | void>
  >;

  /**
   * @remarks Multi-line commands retain unmatched lines as `null`.
   */
  type ParseMatch = string[] | RegExpMatchArray | (RegExpMatchArray | null)[];

  /**
   * @privateRemarks The handler is absent for `"invalid"`, `"none"`, and legacy patterns despite Foundry's tuple.
   */
  type ParseResult = [command: string, match: ParseMatch, fn?: ChatCommandCallback];

  interface ChatCommandPattern {
    /** The regular expression pattern used to match this command. */
    rgx: RegExp;

    /** The processing function invoked when this command is matched. */
    fn: ChatCommandCallback;

    /** A chat message mode to enforce for this command. Otherwise, the default message mode is applied. */
    mode?: keyof CONFIG.ChatMessage.Modes | undefined;

    /** @defaultValue `false` */
    isRoll?: boolean | undefined;

    /** @defaultValue `false` */
    isMultiline?: boolean | undefined;
  }

  interface ProcessMessageOptions {
    /** The speaker data */
    speaker?: ChatMessage.SpeakerData | undefined;
  }

  interface DeleteMessageOptions {
    /**
     * Delete all messages from the log.
     *
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
     *
     * @defaultValue `false`
     */
    notify?: boolean | undefined;

    /**
     * Pass true to always scroll-to-bottom, or false to suppress this. Omitting this option preserves the default
     * conditional scroll-to-bottom.
     */
    scroll?: boolean | undefined;
  }

  interface ScrollBottomOptions {
    /**
     * If a popout exists, scroll it to the bottom too.
     *
     * @defaultValue `false`
     */
    popout?: boolean | undefined;

    /**
     * Wait for any images embedded in the chat log to load first before scrolling.
     *
     * @defaultValue `false`
     */
    waitImages?: boolean | undefined;

    /**
     * Options to configure scrolling behavior.
     *
     * @defaultValue `{}`
     * @remarks Only affects a chat popout.
     */
    scrollOptions?: ScrollIntoViewOptions | undefined;
  }

  interface UpdateMessageOptions {
    /**
     * Trigger a notification which shows the log as having a new unread message.
     *
     * @defaultValue `false`
     */
    notify?: boolean | undefined;
  }

  interface ShouldShowNotificationsOptions {
    /**
     * Whether the chat popout is closing.
     *
     * @defaultValue `false`
     */
    closing?: boolean | undefined;
  }

  interface ToggleNotificationsOptions extends ShouldShowNotificationsOptions, DeepPartial<RenderOptions> {}

  /** @remarks State preserved across input-part renders. */
  interface InputPartState extends HandlebarsApplicationMixin.PartState {
    /** The composed but unsent message, absent when the input had not been rendered yet. */
    message?: string | undefined;
  }

  interface RenderContext
    extends
      HandlebarsApplicationMixin.RenderContext,
      AbstractSidebarTab.RenderContext,
      IntentionalPartial<PreparePartContext> {}

  /** Members added by {@linkcode ChatLog._preparePartContext | #_preparePartContext}. */
  interface PreparePartContext {
    /** @remarks Added for the input part. */
    isAtBottom: boolean;
  }

  interface Configuration<ChatLog extends ChatLog.Any = ChatLog.Any>
    extends HandlebarsApplicationMixin.Configuration, AbstractSidebarTab.Configuration<ChatLog> {
    /**
     * Whether this log is the stream view, which suppresses notifications and the hotbar offset.
     *
     * @remarks Set by {@linkcode foundry.applications.sidebar.apps.ChatPopout} rather than configured directly.
     */
    stream?: boolean | undefined;
  }

  // Note(LukeAbby): This `& object` is so that the `DEFAULT_OPTIONS` can be overridden more easily
  // Without it then `static override DEFAULT_OPTIONS = { unrelatedProp: 123 }` would error.
  type DefaultOptions<ChatLog extends ChatLog.Any = ChatLog.Any> = DeepPartial<Configuration<ChatLog>> & object;

  interface RenderOptions extends HandlebarsApplicationMixin.RenderOptions, AbstractSidebarTab.RenderOptions {}
}

declare abstract class AnyChatLog extends ChatLog<ChatLog.RenderContext, ChatLog.Configuration, ChatLog.RenderOptions> {
  constructor(...args: never);
}

export default ChatLog;
