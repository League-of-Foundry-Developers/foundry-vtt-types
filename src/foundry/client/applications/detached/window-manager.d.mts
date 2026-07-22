import type { Identity, InexactPartial } from "#utils";
import type ApplicationV2 from "../api/application.d.mts";

/**
 * A singleton class that provides an API for spawning and managing detached windows.
 */
declare class DetachedWindowManager {
  constructor();

  /**
   * The currently-focused window.
   */
  get focused(): WindowProxy | null;

  /**
   * A registry of detached window instances.
   */
  get windows(): Map<string, DetachedWindowManager.DetachedWindowDescriptor>;

  /**
   * Check if a detached window contains any applications, and closes it if there are none.
   * @param win - The window.
   */
  checkEmpty(win: WindowProxy | null | undefined): void;

  /**
   * Open a window detached from the main application window.
   * @param options - (default: `{}`)
   */
  openWindow(options?: DetachedWindowManager.OpenWindowOptions): Promise<WindowProxy>;

  /**
   * Adopt nodes into a new host window and append them to the given target.
   * @param target - The target.
   * @param nodes  - The nodes.
   */
  adoptNodes(target: HTMLElement, ...nodes: Node[]): void;

  /**
   * Copy attributes between two elements.
   * @param from    - The element to copy from.
   * @param to      - The element to copy to.
   * @param options - (default: `{}`)
   */
  copyAttributes(from: HTMLElement, to: HTMLElement, options?: DetachedWindowManager.CopyAttributesOptions): void;

  /**
   * Import nodes into a new host window and append them to the given target.
   * @param target - The target.
   * @param nodes  - The nodes.
   */
  importNodes(target: HTMLElement, ...nodes: Node[]): void;

  /**
   * Performs a DOM query across all detached windows and the main workspace, and return the first match.
   * @param selector - The query selector.
   */
  querySelector(selector: string): HTMLElement | null;

  /**
   * Perform a DOM query across all detached windows and the main workspace, and return all matches.
   * @param selector - The query selector.
   */
  querySelectorAll(selector: string): HTMLElement[];

  /**
   * Handle tear-down when a detached window is closed.
   * @param win - The window instance.
   * @remarks Foundry marks this `@internal`, but it is called externally (e.g. from a `beforeunload`/message
   * listener set up by the detached window harness), which is not a subclass, so it must be public here.
   */
  _onWindowClosed(win: WindowProxy): void;

  #DetachedWindowManager: true;
}

declare namespace DetachedWindowManager {
  interface Any extends AnyDetachedWindowManager {}
  interface AnyConstructor extends Identity<typeof AnyDetachedWindowManager> {}

  interface DetachedWindowDescriptor {
    /** The window instance. */
    window: WindowProxy;

    /** A mapping of applications rendered in the window. */
    applications: Map<string, ApplicationV2.Any>;
  }

  /**
   * @internal
   * @remarks Named `DetachedWindowOptions` in Foundry's `_types.mjs`
   */
  interface _OpenWindowOptions {
    /**
     * A unique identifier for the detached browser window.
     * @defaultValue {@linkcode foundry.utils.randomID | foundry.utils.randomID()}
     */
    id: string;

    /**
     * The time to wait, in milliseconds, for the window to open before considering the operation as failed.
     * @defaultValue `10000`
     */
    timeout: number;

    /**
     * Window position.
     * @defaultValue `{}`
     * @remarks Foundry types this `Omit<ApplicationPosition, "scale"|"zIndex">`, but only the numeric
     * properties are actually supported at runtime (`"auto"` values would break the `Math.max` clamping).
     */
    position: OpenWindowPosition;

    /**
     * The window from which to call open(). Defaults to the main workspace window. Must be the window in which the
     * triggering user gesture occurred, otherwise the browser may block the popup.
     * @defaultValue `window`
     */
    source: WindowProxy;
  }

  interface OpenWindowOptions extends InexactPartial<_OpenWindowOptions> {}

  /** @internal */
  interface _OpenWindowPosition {
    top: number;
    left: number;
    width: number;
    height: number;
  }

  interface OpenWindowPosition extends InexactPartial<_OpenWindowPosition> {}

  /** @internal */
  interface _CopyAttributesOptions {
    /**
     * Copy only the specified attributes.
     */
    attrs: Iterable<string>;
  }

  interface CopyAttributesOptions extends InexactPartial<_CopyAttributesOptions> {}
}

declare abstract class AnyDetachedWindowManager extends DetachedWindowManager {
  constructor(...args: never);
}

export default DetachedWindowManager;
