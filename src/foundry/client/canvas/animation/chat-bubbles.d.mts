import type { AnyMutableObject, Identity, InexactPartial } from "#utils";
import type { placeables } from "../_module.d.mts";

/**
 * The Chat Bubble Class
 * This application displays a temporary message sent from a particular {@linkcode placeables.Token | Token} in the active {@linkcode Scene}.
 * The message is displayed on the HUD layer just above the Token.
 */
declare class ChatBubbles {
  /**
   * The Handlebars template used to render Chat Bubbles.
   * @defaultValue `"templates/hud/chat-bubble.html"`
   */
  template: string;

  /**
   * Track active Chat Bubbles
   * @defaultValue `{}`
   * @remarks This appears to not be wired up to anything as of 13.346
   */
  bubbles: AnyMutableObject;

  /**
   * A reference to the chat bubbles HTML container in which rendered bubbles should live
   */
  get element(): HTMLElement;

  /**
   * Create a chat bubble message for a certain token which is synchronized for display across all connected clients.
   * @param token   - The speaking Token Document
   * @param message - The spoken message text
   * @param options - Options which affect the bubble appearance
   * @returns A promise which resolves with the created bubble HTML, or `null`
   */
  broadcast(
    token: placeables.Token.Implementation | TokenDocument.Implementation,
    message: string,
    options?: ChatBubbles.Options,
  ): Promise<HTMLElement | null>;

  /**
   * Create a chat bubble message for a certain token which is synchronized for display across all connected clients.
   * @param token   - The speaking Token Document
   * @param message - The spoken message text
   * @param options - Options which affect the bubble appearance
   * @returns A promise which resolves with the created bubble HTML, or `null`
   * @remarks While {@linkcode broadcast} will take either a placeable or a document, `say` requires a placeable
   */
  say(
    token: placeables.Token.Implementation,
    message: string,
    options?: ChatBubbles.Options,
  ): Promise<HTMLElement | null>;

  /**
   * Activate Socket event listeners which apply to the ChatBubbles UI.
   * @param socket - The active web socket connection
   * @internal
   */
  protected static _activateSocketListeners(socket: io.Socket): void;

  /**
   * @deprecated "`ChatBubbles#container` (jQuery) is deprecated in favor of {@linkcode ChatBubbles.element | ChatBubbles#element} (HTMLElement)" (since v13, until v15)
   */
  get container(): JQuery;

  #ChatBubbles: true;
}

declare namespace ChatBubbles {
  interface Any extends AnyChatBubbles {}
  interface AnyConstructor extends Identity<typeof AnyChatBubbles> {}

  /** @internal */
  type _Options = InexactPartial<{
    /**
     * An optional array of CSS classes to apply to the resulting bubble
     * @defaultValue `[]`
     */
    cssClasses: string[];

    /**
     * Pan to the token speaker for this bubble, if allowed by the client
     * @defaultValue `true`
     */
    pan: boolean;

    /**
     * Require that the token be visible in order for the bubble to be rendered
     * @defaultValue `false`
     */
    requireVisible: boolean;
  }>;

  interface Options extends _Options {}
}

export default ChatBubbles;

declare abstract class AnyChatBubbles extends ChatBubbles {
  constructor(...args: never);
}
