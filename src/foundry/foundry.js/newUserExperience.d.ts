/**
 * Responsible for managing the New User Experience workflows.
 */
declare class NewUserExperience {
  constructor();

  /**
   * Initialize the new user experience.
   * Currently, this generates some chat messages with hints for getting started if we detect this is a new world.
   */
  initialize(): void;

  /**
   * Add event listeners to the chat card links.
   * @param msg  - The ChatMessage being rendered.
   * @param html - The HTML content of the message.
   * @internal
   */
  protected _activateListeners(msg: ChatMessage, html: JQuery): void;

  /**
   * Perform some special action triggered by clicking on a link in a NUE chat card.
   * @param event - The click event.
   * @internal
   */
  protected _onActionLink(event: Event): void;

  /**
   * Switch to the appropriate tab when a user clicks on a link in the chat message.
   * @param event - The click event.
   * @internal
   */
  protected _onTabLink(event: Event): void;
}
