/**
 * The Chat Message class is a type of :class:`Entity` which represents individual messages in the chat log.
 *
 * @type {Entity}
 */
declare class ChatMessage extends Entity {
    /**
     * Configure the attributes of the ChatMessage Entity
     */
    static config: any;

    /**
     * If the Message contains a dice roll, store it here
     */
    _roll: any;

    /**
     * Return the recommended String alias for this message. 
     * The alias could be a Token name in the case of in-character messages or dice rolls. 
     * Alternatively it could be a User name in the case of OOC chat or whispers.
     */
    alias: string;

    /**
     * Is the current User the author of this message?
     */
    isAuthor: boolean;

    /**
     * Test whether the chat message contains a dice roll
     */
    isRoll: boolean;

    /**
     * Return the Roll instance contained in this chat message, if one is present
     */
    roll: Roll;

    /**
     * Get a reference to the user who sent the chat message
     */
    user: any;

    /**
     * Return whether the ChatMessage is visible to the current user Messages may not be visible if they are private whispers
     */
    visible: boolean;

    /**
     * Attempt to determine who is the speaking character (and token) for a certain Chat Message First assume that the currently controlled Token is the speaker
     * @returns     The identified speaker data
     */
    static getSpeaker(): Object;

    /**
     * Given a string whisper target, return an Array of the user IDs which should be targeted for the whisper
     * @param name  The target name of the whisper target
     * @returns     An array of user IDs (or possibly none)
     */
    static getWhisperIDs(name: string): any[];

    /**
     * Export the content of the chat message into a standardized log format
     */
    export(): string;

    /**
     * Render the HTML for the ChatMessage which should be added to the log
     */
    render(): Promise<HTMLElement>;
}
