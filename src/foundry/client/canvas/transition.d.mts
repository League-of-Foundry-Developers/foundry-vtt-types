import type { Identity } from "#utils";
import type { Scene } from "#client/documents/_module.d.mts";
import type UnboundContainer from "#client/canvas/containers/advanced/unbound-container.d.mts";

/**
 * Persistent overlay dedicated to scene transitions.
 */
declare class TransitionContainer extends UnboundContainer {
  constructor();

  /**
   * Desired transition type to use for transitions when no explicit type is provided.
   * @defaultValue `CONFIG.Canvas.sceneTransitions.fade.id`
   */
  defaultTransitionType: string;

  /**
   * Default transition duration used by {@linkcode TransitionContainer._play | TransitionContainer#_play}
   * when no explicit duration is provided (milliseconds).
   * @defaultValue `1000`
   */
  defaultDuration: number;

  /**
   * Flag indicating whether this container is reserved for an external workflow.
   * When true, core scene transitions should not use this container.
   * @defaultValue `false`
   */
  isLocked: boolean;

  /**
   * Flag indicating whether a transition animation is currently running.
   * Prevents overlapping calls to {@linkcode TransitionContainer._play | TransitionContainer#_play}.
   */
  get isRunning(): boolean;

  /**
   * Promise that resolves when the current transition finishes or is cancelled.
   * Reused to return the same promise on repeated {@linkcode TransitionContainer._play | TransitionContainer#_play} calls.
   */
  get promise(): Promise<void> | null;

  /**
   * Run a full transition around a given canvas operation.
   * Encapsulates `captureCurrentScene => operation/scene switch => captureNextScene => play`.
   *
   * If both {@linkcode TransitionContainer.RunOptions.operation | options.operation} and
   * {@linkcode TransitionContainer.RunOptions.nextScene | options.nextScene} are provided, the operation runs first,
   * then the Scene is switched.
   *
   * If neither {@linkcode TransitionContainer.RunOptions.operation | options.operation} nor
   * {@linkcode TransitionContainer.RunOptions.nextScene | options.nextScene} are provided, a simple demo transition
   * is performed from a black frame to the currently rendered Scene.
   *
   * @example Transition around a camera pan
   * ```js
   * await canvas.transition.run({
   *   operation: async () => {
   *     await canvas.animatePan({
   *       x: 2000,
   *       y: 1500,
   *       scale: 1.25,
   *       duration: 0
   *     });
   *   },
   *   duration: 800,
   *   transitionType: "dots"
   * });
   * ```
   *
   * @example Switch to another Scene with a transition
   * ```js
   * const scene = game.scenes.get("ABC123");
   * await canvas.transition.run({
   *   nextScene: scene,
   *   activate: true,
   *   duration: 1200,
   *   transitionType: "fade"
   * });
   * ```
   *
   * @example Demo the current Scene from black
   * ```js
   * await canvas.transition.run({
   *   fromBlack: true,
   *   duration: 800,
   *   transitionType: "swirl"
   * });
   * ```
   * @returns Promise that resolves when the transition completes.
   */
  run(options?: TransitionContainer.RunOptions): Promise<void>;

  /**
   * Cancel any currently running transition and await its termination.
   */
  cancel(): Promise<void>;

  /**
   * Capture the currently displayed scene into a render texture and show it.
   * If `black` is true, uses a solid black frame instead of capturing.
   * @param options - Capture options.
   * @returns The render texture of the current scene, or null if black.
   * @internal
   */
  _captureCurrentScene(options?: TransitionContainer.CaptureCurrentSceneOptions): PIXI.RenderTexture | null;

  /**
   * Capture the next rendered frame of the new scene into a render texture.
   * Internally waits for the next `postrender` so all canvas groups and caches are fully updated before capturing.
   * The filter class and filter type are resolved from {@linkcode CONFIG.Canvas.sceneTransitions}.
   *
   * @param options - Capture options.
   * @returns Promise resolving to the captured render texture.
   * @internal
   */
  _captureNextScene(options?: TransitionContainer.CaptureNextSceneOptions): Promise<PIXI.RenderTexture>;

  /**
   * Run the transition animation from the captured "from" texture to the "to" texture.
   * If a transition is already running, returns the existing promise.
   * If no filter has been prepared, resolves immediately.
   * @param opts - Animation options.
   * @returns Promise that resolves when the transition completes.
   */
  _play(opts?: TransitionContainer.PlayOptions): Promise<void>;

  /**
   * Reset the internal state of the transition container.
   */
  _reset(): void;

  #TransitionContainer: true;

  static #TransitionContainerStatic: true;
}

declare namespace TransitionContainer {
  interface Any extends AnyTransitionContainer {}
  interface AnyConstructor extends Identity<typeof AnyTransitionContainer> {}

  /**
   * @remarks Easing function mapping `[0,1]` to `[0,1]`. A non-function value is replaced by the
   * identity function.
   */
  type EasingFunction = (percent: number) => number;

  interface RunOptions {
    /**
     * Async function performing canvas changes.
     */
    operation?: (() => Promise<void>) | undefined;

    /** Scene document to view or activate as the "next" scene. */
    nextScene?: Scene.Implementation | undefined;

    /**
     * When true, call {@linkcode Scene.activate | Scene#activate} instead of {@linkcode Scene.view | Scene#view}.
     * @defaultValue `false`
     */
    activate?: boolean | undefined;

    /**
     * RGBA clear color in the 0-1 range.
     * @defaultValue `[0, 0, 0, 1]`
     */
    clearColor?: number[] | undefined;

    /**
     * When true, starts from a black frame instead of capturing.
     * @defaultValue `false`
     */
    fromBlack?: boolean | undefined;

    /**
     * Duration in milliseconds. Defaults to {@linkcode TransitionContainer.defaultDuration | defaultDuration}.
     */
    duration?: number | undefined;

    /** Transition type id to use for this run. */
    transitionType?: string | undefined;

    /**
     * Easing function mapping [0,1] to [0,1].
     * @defaultValue `t => t`
     */
    easing?: EasingFunction | undefined;
  }

  interface CaptureCurrentSceneOptions {
    /**
     * RGBA clear color in the 0-1 range.
     * @defaultValue `[0, 0, 0, 1]`
     */
    clearColor?: number[] | undefined;

    /**
     * When true, uses a black frame instead of capturing.
     * @defaultValue `false`
     */
    black?: boolean | undefined;
  }

  interface CaptureNextSceneOptions {
    /**
     * RGBA clear color in the 0-1 range.
     * @defaultValue `[0, 0, 0, 1]`
     */
    clearColor?: number[] | undefined;

    /**
     * Transition type id to use for this capture.
     * Defaults to {@linkcode TransitionContainer.defaultTransitionType | TransitionContainer#defaultTransitionType}.
     */
    transitionType?: string | undefined;
  }

  interface PlayOptions {
    /**
     * Duration in milliseconds.
     * @defaultValue `this.defaultDuration`
     */
    duration?: number | undefined;

    /**
     * Easing function mapping [0,1] to [0,1].
     * @defaultValue `t => t`
     */
    easing?: EasingFunction | undefined;
  }
}

export default TransitionContainer;

declare abstract class AnyTransitionContainer extends TransitionContainer {
  constructor(...args: never);
}
