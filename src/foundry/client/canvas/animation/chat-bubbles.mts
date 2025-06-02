/**
 * The Chat Bubble Class
 * This application displays a temporary message sent from a particular Token in the active Scene.
 * The message is displayed on the HUD layer just above the Token.
 * @remarks TODO: Stub
 */
declare class ChatBubbles {}

declare namespace ChatBubbles {
  interface Options {
    /**
     * An optional array of CSS classes to apply to the resulting bubble
     * @defaultValue `[]`
     */
    cssClasses?: string[] | undefined;

    /**
     * Pan to the token speaker for this bubble, if allowed by the client
     * @defaultValue `true`
     */
    pan?: boolean | undefined;

    /**
     * Require that the token be visible in order for the bubble to be rendered
     * @defaultValue `false`
     */
    requireVisible?: boolean | undefined;
  }
}

export default ChatBubbles;
