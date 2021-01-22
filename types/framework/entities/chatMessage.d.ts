/**
 * A :class:`EntityCollection` of class:`ChatMessage` entities
 * The Messages collection is accessible within the game as `game.messages`.
 *
 */
declare class Messages extends EntityCollection<ChatMessage> {
  /** @override */
  get entity (): string

  /** @override */
  render (force?: boolean, options?: any): any // Mismatched types

  /**
   * If requested, dispatch a Chat Bubble UI for the newly created message
   * @param message - The ChatMessage entity to say
   */
  sayBubble (message: ChatMessage): void

  /**
   * Handle export of the chat log to a text file
   */
  export (): void

  /**
   * Allow for bulk deletion of all chat messages, confirm first with a yes/no dialog.
   * @see {@link Dialog.confirm}
   */
  flush (): Promise<void>
}

/**
 * The Chat Message class is a type of :class:`Entity` which represents individual messages in the chat log.
 *
 */
declare class ChatMessage<D extends ChatMessage.Data = ChatMessage.Data> extends Entity<D> {
  /**
   * Get a reference to the user who sent the chat message
   */
  user: User

  /**
   * If the Message contains a dice roll, store it here
   */
  _roll: Roll | null

  /**
   * Configure the attributes of the ChatMessage Entity
   */
  static get config (): Entity.Config

  /* -------------------------------------------- */
  /*  Properties and Attributes                   */
  /* -------------------------------------------- */

  /**
   * Return the recommended String alias for this message.
   * The alias could be a Token name in the case of in-character messages or dice rolls.
   * Alternatively it could be a User name in the case of OOC chat or whispers.
   */
  get alias (): string

  /** @override */
  static can (user: User, action: string, target: ChatMessage): boolean

  /**
   * Return whether the ChatMessage is visible to the current user
   * Messages may not be visible if they are private whispers
   */
  get visible (): boolean

  /**
   * Is the current User the author of this message?
   */
  get isAuthor (): boolean

  /**
   * Test whether the chat message contains a dice roll
   */
  get isRoll (): boolean

  /**
   * Return whether the content of the message is visible to the current user
   */
  get isContentVisible (): boolean

  /** @override */
  get permission (): number

  /**
   * Return the Roll instance contained in this chat message, if one is present
   */
  get roll (): Roll

  /* -------------------------------------------- */
  /*  HTML Rendering                              */
  /* -------------------------------------------- */

  /**
   * Render the HTML for the ChatMessage which should be added to the log
   */
  render (force?: boolean, options?: any): Promise<HTMLElement>

  /* -------------------------------------------- */
  /*  Socket Listeners and Handlers               */
  /* -------------------------------------------- */

  /** @override */
  static create (data: ChatMessage.Data|ChatMessage.Data[], options: Entity.CreateOptions): Promise<ChatMessage<ChatMessage.Data>|Array<ChatMessage<ChatMessage.Data>>>

  /**
   * Preprocess the data object used to create a new Chat Message to automatically convert some Objects to the
   * data format expected by the database handler.
   * @param data - Single ChatMessage creation data
   * @param rollMode - The visibility mode applied to all dice rolls
   * @returns Processed message creation data
   */
  static _preprocessCreateData (data: ChatMessage.Data, { rollMode }?: {
    rollMode?: string | null
  }): ChatMessage.Data

  /** @override */
  _onCreate (data: Optional<D>, options: Entity.CreateOptions, userId: string): void

  /** @override */
  _onUpdate (data: Optional<D>, options: Entity.UpdateOptions, userId: string): void

  /** @override */
  _onDelete (options: Entity.DeleteOptions, userId: string): void

  /* -------------------------------------------- */
  /*  Saving and Loading                          */
  /* -------------------------------------------- */

  /**
   * Export the content of the chat message into a standardized log format
   */
  export (): string

  /**
   * Transform a provided object of ChatMessage data by applying a certain rollMode to the data object.
   * @param chatData - The object of ChatMessage data prior to applying a rollMode preference
   * @param rollMode - The rollMode preference to apply to this message data
   * @returns The modified ChatMessage data with rollMode preferences applied
   */
  static applyRollMode (chatData: ChatMessage.Data, rollMode: string): ChatMessage.Data

  /**
   * Given a string whisper target, return an Array of the user IDs which should be targeted for the whisper
   *
   * @param name - The target name of the whisper target
   * @returns An array of User instances
   */
  static getWhisperRecipients (name: string): User[]

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
  static getSpeaker (speaker: Optional<ChatMessage.SpeakerData>): ChatMessage.SpeakerData

  /**
   * A helper to prepare the speaker object based on a target Token
   */
  static _getSpeakerFromToken ({ token, alias }: {
    token: Token
    alias?: string
  }): ChatMessage.SpeakerData

  /**
   * A helper to prepare the speaker object based on a target Actor
   */
  static _getSpeakerFromActor ({ scene, actor, alias }: {
    scene?: Scene
    actor: Actor
    alias?: string
  }): ChatMessage.SpeakerData

  /**
   * A helper to prepare the speaker object based on a target User
   */
  static _getSpeakerFromUser ({ scene, user, alias }: {
    scene?: Scene
    user: User
    alias?: string
  }): ChatMessage.SpeakerData

  /* -------------------------------------------- */
  /*  Roll Data Preparation                       */
  /* -------------------------------------------- */

  /**
   * Obtain a data object used to evaluate any dice rolls associated with this particular chat message
   * @remarks
   * Returns Actor.data.data
   */
  getRollData (): any // Actor.data.data

  /**
   * Obtain an Actor instance which represents the speaker of this message (if any)
   * @param speaker - The speaker data object
   */
  static getSpeakerActor (speaker: ChatMessage.SpeakerData): Actor | null
}

declare namespace ChatMessage {
  interface Data extends Entity.Data {
    content: string
    speaker: SpeakerData
    timestamp: number
    type: number
    user: string
    whisper: string[]
  }

  interface ChatData {
    user: string
    speaker: SpeakerData
  }

  interface MessageData {
    alias: string
    author: User
    borderColor: string
    cssClass: string
    isWhisper: boolean
    message: object
    user: User
    whisperTo: string
  }

  interface SpeakerData {
    scene: string | null
    token: string | null
    actor: string | null
    alias: string
  }

}
