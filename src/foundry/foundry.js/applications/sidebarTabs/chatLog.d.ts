// TODO: Remove when updating this class!!!
// eslint-disable-next-line
// @ts-nocheck

/**
 * The Chat Log application displayed in the Sidebar
 * @see {@link Sidebar}
 */
declare class ChatLog extends SidebarTab<ChatLog.Options> {
  /**
   * Track whether the user currently has pending text in the chat box
   */
  protected _pendingText: string;

  /**
   * Track the history of the past 5 sent messages which can be accessed using the arrow keys
   * @defaultValue `[]`
   */
  protected _sentMessages: string[];

  /**
   * Track which remembered message is being currently displayed to cycle properly
   * @defaultValue `-1`
   */
  protected _sentMessageIndex: number;

  /**
   * Track the time when the last message was sent to avoid flooding notifications
   * @defaultValue `0`
   */
  protected _lastMessageTime: number;

  /**
   * Track the id of the last message displayed in the log
   * @defaultValue `null`
   */
  protected _lastId: string | null;

  /**
   * Track the last received message which included the user as a whisper recipient.
   * @defaultValue `null`
   */
  protected _lastWhisper: ChatMessage | null;

  /**
   * @override
   */
  static get defaultOptions(): ChatLog.Options;

  /**
   * A reference to the Messages collection that the chat log displays
   */
  get collection(): Messages;

  /**
   * @override
   */
  getData(options?: Application.RenderOptions): ChatLog.Data;

  /**
   * @override
   */
  protected _render(force?: boolean, options?: Application.RenderOptions): Promise<void>;

  /**
   * Render a batch of additional messages, prepending them to the top of the log
   * @param size - The batch size to include
   */
  protected _renderBatch(size: number): Promise<void>;

  /**
   * @param original - (unused)
   * @override
   * @throws This always throws.
   */
  renderPopout(original?: any): never;

  /**
   * Delete all message HTML from the log
   */
  deleteAll(): void;

  /**
   * Delete a single message from the chat log
   * @param messageId - The ChatMessage entity to remove from the log
   * @param deleteAll - Is this part of a flush operation to delete all messages?
   *                    (default: `false`)
   */
  deleteMessage(messageId: string, { deleteAll }?: { deleteAll?: boolean }): void;

  /**
   * Trigger a notification that alerts the user visually and audibly that a new chat log message has been posted
   */
  notify(message: ChatMessage): void;

  /**
   * Parse a chat string to identify the chat command (if any) which was used
   * @param message - The message to match
   * @returns The identified command and regex match
   * @remarks The returned RegExpMatchArray or string Array has the entire match as its first value, then the match for
   *          the slash command (or an empty string) and as last element the flavor or message text. The whisper match
   *          is an exception: Its third value is the target user name (optionally in brackets) and the fourth value is
   *          the message text.
   */
  static parse<S extends string>(message: S): [ChatLog.Command, RegExpMatchArray] | ['none', [S, '', S]];

  /**
   * Post a single chat message to the log
   * @param message - A ChatMessage entity instance to post to the log
   * @param notify  - Trigger a notification which shows the log as having a new unread message
   *                  (default: `false`)
   * @returns A Promise which resolves once the message is posted
   */
  postOne(message: ChatMessage, notify?: boolean): Promise<void>;

  /**
   * Scroll the chat log to the bottom
   */
  protected scrollBottom(): void;

  /**
   * Update the content of a previously posted message after its data has been replaced
   * @param message - The ChatMessage instance to update
   * @param notify  - Trigger a notification which shows the log as having a new unread message
   *                  (default: `false`)
   */
  updateMessage(message: ChatMessage, notify?: boolean): void;

  updateTimestamps(): void;

  /**
   * Activate event listeners triggered within the ChatLog application
   */
  activateListeners(html: JQuery): void;

  /**
   * Prepare the data object of chat message data depending on the type of message being posted
   * @param message - The original string of the message content
   * @returns A Promise resolving to the prepared chat data object
   */
  protected processMessage(message: string): Promise<ChatMessage | null | void>;

  /**
   * Process messages which are posted using a dice-roll command
   * @param command       - The chat command type
   * @param match         - The matched RegExp expressions
   * @param chatData      - The initial chat data
   * @param createOptions - Options used to create the message
   *                        (unused)
   */
  protected _processDiceCommand(
    command: string,
    match: RegExpMatchArray,
    chatData: ChatMessage.Data,
    createOptions?: Entity.CreateOptions
  ): void;

  /**
   * Process messages which are posted using a chat whisper command
   * @param command       - The chat command type
   * @param match         - The matched RegExp expressions
   * @param chatData      - The initial chat data
   * @param createOptions - Options used to create the message
   * @throws If the user does not have the permission to whisper to other players
   */
  protected _processWhisperCommand(
    command: string,
    match: RegExpMatchArray,
    chatData: ChatMessage.Data,
    createOptions?: Entity.CreateOptions
  ): void;

  /**
   * Process messages which are posted using a chat whisper command
   * @param command       - The chat command type
   * @param match         - The matched RegExp expressions
   * @param chatData      - The initial chat data
   * @param createOptions - Options used to create the message
   */
  protected _processChatCommand(
    command: string,
    match: RegExpMatchArray,
    chatData: ChatMessage.Data,
    createOptions: Entity.CreateOptions
  ): void;

  /**
   * Add a sent message to an array of remembered messages to be re-sent if the user pages up with the up arrow key
   * @param message - The message text being remembered
   */
  protected _remember(message: string): void;

  /**
   * Recall a previously sent message by incrementing up (1) or down (-1) through the sent messages array
   * @param direction - The direction to recall, positive for older, negative for more recent
   * @returns The recalled message, or an empty string
   */
  protected _recall(direction: number): string;

  /**
   * Compendium sidebar Context Menu creation
   */
  protected _contextMenu(html: JQuery): void;

  /**
   * Get the sidebar directory entry context options
   * @returns The sidebar entry context options
   */
  protected _getEntryContextOptions(): ContextMenuEntry[];

  /**
   * Handle keydown events in the chat entry textarea
   */
  protected _onChatKeyDown(event: JQuery.KeyDownEvent): void;

  /**
   * Handle setting the preferred roll mode
   */
  protected _onChangeRollMode(event: JQuery.ChangeEvent): void;

  /**
   * Handle single message deletion workflow
   */
  protected _onDeleteMessage(event: JQuery.ClickEvent): Promise<ChatMessage | null>;

  /**
   * Handle clicking of dice tooltip buttons
   */
  protected _onDiceRollClick(event: JQuery.ClickEvent): void;

  /**
   * Handle click events to export the chat log
   */
  protected _onExportLog(event: JQuery.ClickEvent): void;

  /**
   * Handle click events to flush the chat log
   */
  protected _onFlushLog(event: JQuery.ClickEvent): void;

  /**
   * Handle scroll events within the chat log container
   * @param event - The initial scroll event
   */
  protected _onScrollLog(event: JQuery.ScrollEvent): void;
}

declare namespace ChatLog {
  type Command =
    | 'roll'
    | 'gmroll'
    | 'blindroll'
    | 'selfroll'
    | 'ic'
    | 'ooc'
    | 'emote'
    | 'whisper'
    | 'reply'
    | 'gm'
    | 'players'
    | 'invalid';

  interface Data {
    user: User;

    rollMode: keyof typeof CONFIG['Dice']['rollModes'];

    rollModes: typeof CONFIG['Dice']['rollModes'];

    isStream: boolean;
  }

  interface Options extends SidebarTab.Options {
    /**
     * @defaultValue `'chat'`
     */
    id: string;

    /**
     * @defaultValue `'templates/sidebar/chat-log.html'`
     */
    template: string;

    title: string;

    scrollContainer: null;

    /**
     * @defaultValue `false`
     */
    stream: boolean;
  }
}
