import type { Identity } from "../../../utils/index.d.mts";

declare global {
  /**
   * A common framework for displaying notifications to the client.
   * Submitted notifications are added to a queue, and up to 3 notifications are displayed at once.
   * Each notification is displayed for 5 seconds at which point further notifications are pulled from the queue.
   *
   * @example Displaying Notification Messages
   * ```typescript
   * ui.notifications.info("This is an info message");
   * ui.notifications.warn("This is a warning message");
   * ui.notifications.error("This is an error message");
   * ui.notifications.info("This is a 4th message which will not be shown until the first info message is done");
   * ```
   *
   * @typeParam Options - the type of the options object
   */
  class Notifications<Options extends ApplicationOptions = ApplicationOptions> extends Application<Options> {
    constructor(options?: Partial<Options>);

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
     * @defaultValue
     * ```typescript
     * mergeObject(super.defaultOptions, {
     *   popOut: false,
     *   id: "notifications",
     *   template: "templates/hud/notifications.html"
     * });
     * ```
     */
    static override get defaultOptions(): ApplicationOptions;

    /**
     * Initialize the Notifications system by displaying any system-generated messages which were passed from the server.
     */
    initialize(): void;

    protected override _renderInner(data: ReturnType<this["getData"]>): Promise<JQuery>;

    protected override _render(force?: boolean, options?: Application.RenderOptions<Options>): Promise<void>;

    /**
     * Push a new notification into the queue
     * @param message   - The content of the notification message
     * @param type      - The type of notification, "info", "warning", and "error" are supported
     *                    (default: `"info"`)
     * @param options   - Additional options which affect the notification
     *                    (default: `{}`)
     * @returns The ID of the notification (positive integer)
     */
    notify(message: string, type?: "info" | "warning" | "error", options?: Notifications.NotifyOptions): number;

    /**
     * Display a notification with the "info" type
     * @param message - The content of the notification message
     * @param options - Notification options passed to the notify function
     * @returns The ID of the notification (positive integer)
     */
    info(message: string, options?: Notifications.NotifyOptions): number;

    /**
     * Display a notification with the "warning" type
     * @param message - The content of the notification message
     * @param options - Notification options passed to the notify function
     * @returns The ID of the notification (positive integer)
     */
    warn(message: string, options?: Notifications.NotifyOptions): number;

    /**
     * Display a notification with the "error" type
     * @param message - The content of the notification message
     * @param options - Notification options passed to the notify function
     * @returns The ID of the notification (positive integer)
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

  namespace Notifications {
    interface Any extends AnyNotifications {}
    interface AnyConstructor extends Identity<typeof AnyNotifications> {}

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
       */
      console?: boolean;
    }

    interface Notification {
      message: string;
      type: "info" | "warning" | "error";
      timestamp: number;
      permanent: boolean;
      console: boolean;
    }
  }
}

declare abstract class AnyNotifications extends Notifications<ApplicationOptions> {
  constructor(arg0: never, ...args: never[]);
}
