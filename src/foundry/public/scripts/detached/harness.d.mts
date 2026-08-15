export {};

declare global {
  interface DocumentEventMap {
    "foundry:openChildWindow": OpenChildWindowEvent;
  }

  interface OpenChildWindowEventDetail {
    /** @remarks A unique identifier for the detached browser window. */
    id: string;

    /** @remarks The comma-separated window features string passed to `window.open`. */
    attrs: string;
  }

  /**
   * @remarks Dispatched by {@linkcode foundry.applications.detached.openWindow} on a detached
   * window's document so that `window.open` is called from within that window's execution context.
   */
  interface OpenChildWindowEvent extends CustomEvent<OpenChildWindowEventDetail> {
    /**
     * @remarks Assigned by the detached window harness while handling the event. Remains `undefined` if
     * the harness has not been applied to the dispatching window, and is `null` if the popup was blocked.
     */
    result?: WindowProxy | null | undefined;
  }

  interface Window {
    /**
     * @remarks Assigned by {@linkcode foundry.applications.detached.openWindow} to the window
     * it opens, and used as that window's key in {@linkcode foundry.applications.detached.windows}.
     */
    id?: string | undefined;
  }
}
