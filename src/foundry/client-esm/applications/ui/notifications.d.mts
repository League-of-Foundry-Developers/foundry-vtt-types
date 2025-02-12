/**
 * A common framework for displaying notifications to the client.
 * Submitted notifications are added to a queue, and up to {@link Notifications.MAX_ACTIVE} notifications are
 * displayed at once. Each notification is displayed for {@link Notifications.LIFETIME_MS} milliseconds before being
 * removed, at which point further notifications are pulled from the queue.
 *
 * @example Displaying Notification Messages
 * ```js
 * ui.notifications.error("This is a permanent error message", {permanent: true});
 * ui.notifications.warn("LOCALIZED.WARNING.MESSAGE", {localize: true});
 * ui.notifications.success("This is a success message, not logged to the console", {console: false});
 * ui.notifications.info("LOCALIZED.FORMAT.STRING", {format: {key1: "foo", key2: "bar"}});
 * ```
 *
 * @example Progress Bar Notification
 * ```js
 * const progress = ui.notifications.info("Thing Happening!", {progress: true});
 * progress.update({pct: 0.25, message: "Still happening!"});
 * progress.update({pct: 0.50, message: "Almost there!"});
 * progress.update({pct: 0.75, message: "Stay on target!"});
 * progress.update({pct: 1.0, message: "Done!"});
 * ```
 * @remarks TODO: Copied from client/ui, not fully updated to v13
 */
declare class Notifications {
  constructor();

  /**
   * The maximum number of active notifications.
   * @defaultValue `5`
   */
  static MAX_ACTIVE: number;

  /**
   * Submitted notifications which are queued for display
   * @defaultValue `[]`
   */
  queue: Notifications.Notification[];

  /**
   * Notifications which are currently displayed
   * @defaultValue `[]`
   */
  active: JQuery[];

  /**
   * Initialize the Notifications system by displaying any system-generated messages which were passed from the server.
   */
  initialize(): void;

  /**
   * Push a new notification into the queue
   * @param message   - The content of the notification message
   * @param type      - The type of notification, "info", "warning", and "error" are supported
   *                    (default: `"info"`)
   * @param options   - Additional options which affect the notification
   *                    (default: `{}`)
   * @returns The ID of the notification (positive integer)
   * @remarks `type` and `options` use parameter defaults so `null` causes an error
   */
  notify(message: string, type?: "info" | "warning" | "error", options?: Notifications.NotifyOptions): number;

  /**
   * Display a notification with the "info" type
   * @param message - The content of the notification message
   * @param options - Notification options passed to the notify function
   * @returns The ID of the notification (positive integer)
   * @remarks `options` use parameter defaults so `null` causes an error
   */
  info(message: string, options?: Notifications.NotifyOptions): number;

  /**
   * Display a notification with the "warning" type
   * @param message - The content of the notification message
   * @param options - Notification options passed to the notify function
   * @returns The ID of the notification (positive integer)
   * @remarks `options` use parameter defaults so `null` causes an error
   */
  warn(message: string, options?: Notifications.NotifyOptions): number;

  /**
   * Display a notification with the "error" type
   * @param message - The content of the notification message
   * @param options - Notification options passed to the notify function
   * @returns The ID of the notification (positive integer)
   * @remarks `options` use parameter defaults so `null` causes an error
   */
  error(message: string, options?: Notifications.NotifyOptions): number;

  /**
   * Remove the notification linked to the ID.
   * @param id - The ID of the notification
   */
  remove(id: number): void;

  /**
   * Clear all notifications.
   */
  clear(): void;

  /**
   * Retrieve a pending notification from the queue and display it
   */
  protected fetch(): void;
}

declare abstract class AnyNotifications extends Notifications {
  constructor(arg0: never, ...args: never[]);
}

declare namespace Notifications {
  type Any = AnyNotifications;
  type AnyConstructor = typeof AnyNotifications;

  interface NotifyOptions {
    /**
     * Should the notification be permanently displayed until dismissed
     * @defaultValue `false`
     */
    permanent?: boolean;

    /**
     * Whether to localize the message content before displaying it
     * @defaultValue `false`
     */
    localize?: boolean;

    /**
     * Whether to log the message to the console
     * @defaultValue `true`
     * @remarks `null` equivalent to `false`
     */
    console?: boolean | null | undefined;
  }

  interface Notification {
    message: string;
    type: "info" | "warning" | "error";
    timestamp: number;
    permanent: boolean;
    console: boolean;
  }
}

export default Notifications;
