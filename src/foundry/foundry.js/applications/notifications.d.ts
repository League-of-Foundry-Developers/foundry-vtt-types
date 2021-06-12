/**
 * A common framework for displaying notifications to the client.
 * Submitted notifications are added to a queue, and up to 3 notifications are displayed at once.
 * Each notification is displayed for 5 seconds at which point further notifications are pulled from the queue.
 *
 * @example
 * ```typescript
 * ui.notifications.info("This is an info message");
 * ui.notifications.warn("This is a warning message");
 * ui.notifications.error("This is an error message");
 * ui.notifications.info("This is a 4th message which will not be shown until the first info message is done");
 * ```
 */
declare class Notifications extends Application {
  /** Notifications which are currently displayed */
  active: JQuery[];

  /** Submitted notifications which are queued for display */
  queue: Notifications.Notification[];

  /** @override */
  static get defaultOptions(): typeof Application['defaultOptions'];

  /**
   * Initialize the Notifications system by displaying any system-generated messages which were passed from the server.
   */
  initialize(): void;

  /** @override */
  protected _renderInner(data: object): JQuery;

  /** @override */
  protected _render(force?: boolean, options?: Application.RenderOptions): Promise<void>;

  /**
   * Push a new notification into the queue
   * @param message   - The content of the notification message
   * @param type      - The type of notification, currently "info", "warning", and "error" are supported
   *                    (default: `'info'`)
   * @param permanent - Whether the notification should be permanently displayed unless otherwise dismissed
   *                    (default: `false`)
   */
  notify(message: string, type?: 'info' | 'warning' | 'error', { permanent }?: { permanent?: boolean }): void;

  /**
   * Display a notification with the "info" type
   * @param message - The content of the notification message
   * @param options - Notification options passed to the notify function
   */
  info(message: string, options?: { permanent?: boolean }): void;

  /**
   * Display a notification with the "warning" type
   * @param message - The content of the notification message
   * @param options - Notification options passed to the notify function
   */
  warn(message: string, options?: { permanent?: boolean }): void;

  /**
   * Display a notification with the "error" type
   * @param message - The content of the notification message
   * @param options - Notification options passed to the notify function
   */
  error(message: string, options?: { permanent?: boolean }): void;

  /**
   * Retrieve a pending notification from the queue and display it
   */
  protected fetch(): void;
}

declare namespace Notifications {
  interface Notification {
    message: string;
    type: 'info' | 'warning' | 'error';
    timestamp: number;
    permanent: boolean;
  }
}
