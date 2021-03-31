/**
 * The Chat Message class is a type of :class:`Entity` which represents individual messages in the chat log.
 *
 */
declare class ChatMessage extends Entity<ChatMessage.Data> {
  /**
   * Get a reference to the user who sent the chat message
   */
  user: User;

  /**
   * If the Message contains a dice roll, store it here
   */
  _roll: Roll | null;

  /**
   * Configure the attributes of the ChatMessage Entity
   */
  static get config(): Entity.Config<ChatMessage>;

  /* -------------------------------------------- */
  /*  Properties and Attributes                   */
  /* -------------------------------------------- */

  /**
   * Return the recommended String alias for this message.
   * The alias could be a Token name in the case of in-character messages or dice rolls.
   * Alternatively it could be a User name in the case of OOC chat or whispers.
   */
  get alias(): string;

  /** @override */
  static can(user: User, action: string, target: ChatMessage): boolean;

  /**
   * Return whether the ChatMessage is visible to the current user
   * Messages may not be visible if they are private whispers
   */
  get visible(): boolean;

  /**
   * Is the current User the author of this message?
   */
  get isAuthor(): boolean;

  /**
   * Test whether the chat message contains a dice roll
   */
  get isRoll(): boolean;

  /**
   * Return whether the content of the message is visible to the current user
   */
  get isContentVisible(): boolean;

  /** @override */
  get permission(): foundry.CONST.EntityPermission;

  /**
   * Return the Roll instance contained in this chat message, if one is present
   */
  get roll(): Roll;

  /* -------------------------------------------- */
  /*  HTML Rendering                              */
  /* -------------------------------------------- */

  /**
   * Render the HTML for the ChatMessage which should be added to the log
   */
  render(force?: boolean, options?: any): Promise<JQuery>;

  /* -------------------------------------------- */
  /*  Socket Listeners and Handlers               */
  /* -------------------------------------------- */

  /** @override */
  static create<T extends ChatMessage, U>(
    this: ConstructorOf<T>,
    data: Expanded<U> extends DeepPartial<ChatMessage.CreateData> ? U : DeepPartial<ChatMessage.CreateData>,
    options?: Entity.CreateOptions
  ): Promise<T | null>;
  static create<T extends ChatMessage, U>(
    this: ConstructorOf<T>,
    data: Expanded<U> extends DeepPartial<ChatMessage.CreateData>
      ? ReadonlyArray<U>
      : ReadonlyArray<DeepPartial<ChatMessage.CreateData>>,
    options?: Entity.CreateOptions
  ): Promise<T | T[] | null>;

  /**
   * Preprocess the data object used to create a new Chat Message to automatically convert some Objects to the
   * data format expected by the database handler.
   * @param data     - Single ChatMessage creation data
   * @param rollMode - The visibility mode applied to all dice rolls
   * @returns Processed message creation data
   */
  protected static _preprocessCreateData(
    data: DeepPartial<ChatMessage.CreateData>,
    {
      rollMode
    }?: {
      rollMode?: string | null;
    }
  ): ChatMessage.Data;

  /** @override */
  protected _onCreate(data: DeepPartial<ChatMessage.Data>, options: Entity.CreateOptions, userId: string): void;

  /** @override */
  protected _onUpdate(data: DeepPartial<ChatMessage.Data>, options: Entity.UpdateOptions, userId: string): void;

  /** @override */
  protected _onDelete(options: Entity.DeleteOptions, userId: string): void;

  /* -------------------------------------------- */
  /*  Saving and Loading                          */
  /* -------------------------------------------- */

  /**
   * Export the content of the chat message into a standardized log format
   */
  export(): string;

  /**
   * Transform a provided object of ChatMessage data by applying a certain rollMode to the data object.
   * @param chatData - The object of ChatMessage data prior to applying a rollMode preference
   * @param rollMode - The rollMode preference to apply to this message data
   * @returns The modified ChatMessage data with rollMode preferences applied
   */
  static applyRollMode(chatData: ChatMessage.Data, rollMode: string): ChatMessage.Data;

  /**
   * Given a string whisper target, return an Array of the user IDs which should be targeted for the whisper
   *
   * @param name - The target name of the whisper target
   * @returns An array of User instances
   */
  static getWhisperRecipients(name: string): User[];

  /**
   * Attempt to determine who is the speaking character (and token) for a certain Chat Message
   * First assume that the currently controlled Token is the speaker
   *
   * @param scene - The Scene in which the speaker resides
   * @param actor - The Actor whom is speaking
   * @param token - The Token whom is speaking
   * @param alias - The name of the speaker to display
   *
   * @returns The identified speaker data
   */
  static getSpeaker(speaker?: ChatMessage.SpeakerCreateData): ChatMessage.SpeakerData;

  /**
   * A helper to prepare the speaker object based on a target Token
   */
  protected static _getSpeakerFromToken({ token, alias }: { token: Token; alias?: string }): ChatMessage.SpeakerData;

  /**
   * A helper to prepare the speaker object based on a target Actor
   */
  protected static _getSpeakerFromActor({
    scene,
    actor,
    alias
  }: {
    scene?: Scene;
    actor: Actor;
    alias?: string;
  }): ChatMessage.SpeakerData;

  /**
   * A helper to prepare the speaker object based on a target User
   */
  protected static _getSpeakerFromUser({
    scene,
    user,
    alias
  }: {
    scene?: Scene;
    user: User;
    alias?: string;
  }): ChatMessage.SpeakerData;

  /* -------------------------------------------- */
  /*  Roll Data Preparation                       */
  /* -------------------------------------------- */

  /**
   * Obtain a data object used to evaluate any dice rolls associated with this particular chat message
   * @remarks
   * Returns Actor.data.data
   */
  getRollData(): any; // Actor.data.data

  /**
   * Obtain an Actor instance which represents the speaker of this message (if any)
   * @param speaker - The speaker data object
   */
  static getSpeakerActor(speaker: ChatMessage.SpeakerData): Actor | null;
}

declare namespace ChatMessage {
  interface ChatData {
    user: string;
    speaker: SpeakerData;
  }

  /**
   * Variant of ChatMessage.Data for use in the `create` method
   */
  interface CreateData extends Entity.Data {
    content: string;
    roll?: string | Roll;
    speaker: SpeakerData | SpeakerCreateData;
    timestamp: number;
    type: foundry.CONST.ChatMessageType;
    user: string | User;
    whisper: Array<string | User>;
    sound?: string;
    flavor?: string;
    blind?: boolean;
  }

  interface Data extends Entity.Data {
    content: string;
    roll?: string;
    speaker: SpeakerData;
    timestamp: number;
    type: foundry.CONST.ChatMessageType;
    user: string;
    whisper: string[];
    sound?: string;
    flavor?: string;
    blind?: boolean;
  }

  interface MessageData {
    alias: string;
    author: User;
    borderColor: string;
    cssClass: string;
    isWhisper: boolean;
    message: object;
    user: User;
    whisperTo: string;
  }

  interface SpeakerData {
    scene: string | null;
    token: string | null;
    actor: string | null;
    alias: string;
  }

  interface SpeakerCreateData {
    scene?: Scene | null;
    token?: Token | null;
    actor?: Actor | null;
    alias?: string;
  }
}
