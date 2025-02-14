/**
 * A common framework for displaying notifications to the client.
 * Submitted notifications are added to a queue, and up to {@link Notifications.MAX_ACTIVE} notifications are
 * displayed at once. Each notification is displayed for {@link Notifications.LIFETIME_MS} milliseconds before being
 * removed, at which point further notifications are pulled from the queue.
 *
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
 */
declare class Notifications {
  constructor();

  /**
   * The maximum number of active notifications.
   * @defaultValue `5`
   */
  static MAX_ACTIVE: number;

  /**
   * The maximum number of active notifications.
   * @defaultValue `5000`
   */
  static LIFETIME_MS: number;

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
  notify<T extends Notifications.Type = "info">(message: string, type?: T, options?: Notifications.NotifyOptions): Readonly<Notifications.Notification<T>>;

  /**
   * Display a notification with the "info" type
   * @param message - The content of the notification message
   * @param options - Notification options passed to the notify function
   * @returns The ID of the notification (positive integer)
   * @remarks `options` use parameter defaults so `null` causes an error
   */
  info(message: string, options?: Notifications.NotifyOptions): Readonly<Notifications.Notification<"info">>;

  /**
   * Display a notification with the "warning" type
   * @param message - The content of the notification message
   * @param options - Notification options passed to the notify function
   * @returns The ID of the notification (positive integer)
   * @remarks `options` use parameter defaults so `null` causes an error
   */
  warn(message: string, options?: Notifications.NotifyOptions): Readonly<Notifications.Notification<"warning">>;

  /**
   * Display a notification with the "error" type
   * @param message - The content of the notification message
   * @param options - Notification options passed to the notify function
   * @returns The ID of the notification (positive integer)
   * @remarks `options` use parameter defaults so `null` causes an error
   */
  error(message: string, options?: Notifications.NotifyOptions): Readonly<Notifications.Notification<"error">>;

  /**
   * Display a notification with the "success" type.
   * @param message - The content of the success message
   * @param options - Notification options passed to the notify function
   * @returns The registered notification
   */
  success(message: string, options?: Notifications.NotifyOptions): Readonly<Notifications.Notification<"success">>;

  /**
   * Update the progress of the notification.
   * @param notification - A Notification or ID to update
   * @param update       - An incremental progress update
   */
  update(notification: Notifications.Notification | number, update: Notifications.UpdateOptions): void;

  /**
   * Remove the notification linked to the ID.
   * @param id - The Notification or ID to remove
   */
  remove(id: Notifications.Notification | number): void;

  /**
   * Clear all notifications.
   */
  clear(): void;

  #private: true;
}

declare abstract class AnyNotifications extends Notifications {
  constructor(arg0: never, ...args: never[]);
}

declare namespace Notifications {
  type Any = AnyNotifications;
  type AnyConstructor = typeof AnyNotifications;

  type Type = "info" | "warning" | "error" | "success";

  interface Notification<T extends Type = Type> {
    id: number;
    type: T;
    timestamp: number;
    message: string;
    permanent: boolean;
    console: boolean;
    active: boolean;
    progress: boolean;
    pct: number;
    element?: HTMLLIElement;
    remove?: () => void;
    update?: (pct: number) => void;
  }

  interface FormatOptions {
    /**
     * Whether to escape the values of `format`
     * @defaultValue `true`
     */
    escape?: boolean;

    /**
     * Whether to clean the provided message string as untrusted user input.
     * No cleaning is applied if `format` is passed and `escape` is true or `localize` is true and `format` is not passed.
     * @defaultValue `true`
     */
    clean?: boolean;

    /**
     * A mapping of formatting strings passed to Localization#format
     */
    format?: Record<string, string>;
  }

  interface NotifyOptions extends FormatOptions {
    /**
     * Should the notification be permanently displayed until dismissed
     * @defaultValue `false`
     */
    permanent?: boolean;

    /**
     * Does this Notification include a progress bar?
     * @defaultValue `false`
     */
    progress?: boolean;

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

  interface UpdateOptions extends FormatOptions {
    /**
     * An update to the string message
     */
    message?: string;

    /**
     * Localize updates to presented progress text
     * @defaultValue `false`
     */
    localize?: boolean;

    /**
     * An update to the completion percentage
     */
    pct?: number;
  }
}

export default Notifications;
