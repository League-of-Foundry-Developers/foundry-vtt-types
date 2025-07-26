import type { Brand, Coalesce } from "#utils";

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
  notify<T extends Notifications.Type | undefined = undefined>(
    message: string | Error,
    type?: T,
    options?: Notifications.NotifyOptions,
  ): Notifications.Notification<Coalesce<T, "info">>;

  /**
   * Display a notification with the "info" type
   * @param message - The content of the notification message
   * @param options - Notification options passed to the notify function
   * @returns The registered notification
   */
  info(message: string | Error, options?: Notifications.NotifyOptions): Notifications.Notification<"info">;

  /**
   * Display a notification with the "warning" type
   * @param message - The content of the notification message
   * @param options - Notification options passed to the notify function
   * @returns The registered notification
   */
  warn(message: string | Error, options?: Notifications.NotifyOptions): Notifications.Notification<"warning">;

  /**
   * Display a notification with the "error" type
   * @param message - The content of the notification message
   * @param options - Notification options passed to the notify function
   * @returns The registered notification
   */
  error(message: string | Error, options?: Notifications.NotifyOptions): Notifications.Notification<"error">;

  /**
   * Display a notification with the "success" type.
   * @param message - The content of the success message
   * @param options - Notification options passed to the notify function
   * @returns The registered notification
   */
  success(message: string | Error, options?: Notifications.NotifyOptions): Notifications.Notification<"success">;

  /**
   * Update the progress of the notification.
   * @param notification - A Notification or ID to update
   * @param update       - An incremental progress update
   */
  update(notification: Notifications.Notification | Notifications.ID, update: Notifications.UpdateOptions): void;

  /**
   * Remove the notification linked to the ID.
   * @param id - The Notification or ID to remove
   */
  remove(id: Notifications.Notification | Notifications.ID): void;

  /**
   * Does the notification linked to the ID exist?.
   * @param notification - The Notification or ID to remove
   * @remarks Foundry writing "The Notification or ID to remove" is likely unintentional.
   */
  has(id: Notifications.Notification | Notifications.ID): boolean;

  /**
   * Clear all notifications.
   */
  clear(): void;

  #Notifications: true;
}

declare abstract class AnyNotifications extends Notifications {
  constructor(arg0: never, ...args: never[]);
}

declare namespace Notifications {
  type Any = AnyNotifications;
  type AnyConstructor = typeof AnyNotifications;

  type Type = "info" | "warning" | "error" | "success";

  type ID = Brand<number, "Notifications.ID">;

  interface Notification<T extends Type = Type> {
    id: Notifications.ID;
    type: T;
    timestamp: number;
    message: string;

    /**
     * @remarks Only set when the original `message` is an `Error`.
     */
    error?: Error | undefined;

    permanent: boolean;
    console: boolean;
    active: boolean;
    progress: boolean;
    pct: number;

    /**
     * @remarks Set when the notification is currently being rendered. When the notification is
     * removed {@linkcode HTMLLIElement.remove | HTMLLIElement#remove} is called.
     */
    element?: HTMLLIElement | undefined;

    /**
     * @remarks Foundry claims this is required but always sets it in practice.
     */
    remove: () => void;

    /**
     * @remarks Foundry claims this is required but always sets it in practice.
     */
    update: (update: Notifications.UpdateOptions) => void;
  }

  interface FormatOptions {
    /**
     * Whether to escape the values of `format`
     * @defaultValue `true`
     */
    escape?: boolean | undefined;

    /**
     * Whether to clean the provided message string as untrusted user input.
     * No cleaning is applied if `format` is passed and `escape` is true or `localize` is true and `format` is not passed.
     * @defaultValue `true`
     */
    clean?: boolean | undefined;

    /**
     * A mapping of formatting strings passed to Localization#format
     */
    format?: Record<string, string> | undefined;
  }

  interface NotifyOptions extends FormatOptions {
    /**
     * Should the notification be permanently displayed until dismissed
     * @defaultValue `false`
     */
    permanent?: boolean | undefined;

    /**
     * Does this Notification include a progress bar?
     * @defaultValue `false`
     */
    progress?: boolean | undefined;

    /**
     * Whether to localize the message content before displaying it
     * @defaultValue `false`
     */
    localize?: boolean | undefined;

    /**
     * Whether to log the message to the console
     * @defaultValue `true`
     */
    console?: boolean | undefined;
  }

  interface UpdateOptions extends FormatOptions {
    /**
     * An update to the string message
     */
    message?: string | undefined;

    /**
     * Localize updates to presented progress text
     * @defaultValue `false`
     */
    localize?: boolean | undefined;

    /**
     * An update to the completion percentage
     * @remarks Only allows numbers in the range `[0, 1]`
     */
    pct?: number | undefined;
  }
}

export default Notifications;
