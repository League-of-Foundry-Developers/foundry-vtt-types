/**
 * A helper class which manages the refresh workflow for perception layers on the canvas.
 * This controls the logic which batches multiple requested updates to minimize the amount of work required.
 * A singleton instance is available as canvas#perception.
 * @see Canvas#perception
 */
declare class PerceptionManager {
  constructor();

  /**
   * The number of milliseconds by which to throttle non-immediate refreshes
   */
  protected _throttleMS: number | undefined;

  /**
   * An internal tracker for the last time that a perception refresh was executed
   */
  protected _refreshTime: number | undefined;

  /**
   * An internal tracker for the window timeout that applies a debounce to the refresh
   */
  protected _timeout: number | undefined;

  /**
   * Cache a reference to the canvas scene to avoid attempting scheduled refreshes after the scene is changed
   */
  protected _scene: string | undefined;

  /**
   * The default values of update parameters.
   * When a refresh occurs, the staged parameters are reset to these initial values.
   */
  static DEFAULTS: PerceptionManager.Options;

  /**
   * The configured parameters for the next refresh.
   */
  params: PerceptionManager.Options;

  /**
   * Cancel any pending perception refresh.
   */
  cancel(): void;

  /**
   * Schedule a perception update with requested parameters.
   * @param options - (default: `{}`)
   */
  schedule(options?: DeepPartial<PerceptionManager.Options>): void;

  /**
   * Perform an immediate perception update.
   * @param options - (default: `{}`)
   */
  update(options?: DeepPartial<PerceptionManager.Options>): void;

  /**
   * A helper function to perform an immediate initialization plus incremental refresh.
   */
  initialize(): ReturnType<this["update"]>;

  /**
   * A helper function to perform an incremental refresh only.
   */
  refresh(): ReturnType<this["update"]>;

  /**
   * Set option flags which configure the next perception update
   */
  protected _set(options: DeepPartial<PerceptionManager.Options>): void;

  /**
   * Perform the perception update workflow
   * @param immediate - Perform the workflow immediately, otherwise it is throttled
   *                    (default: `false`)
   */
  protected _update(immediate?: boolean): void;

  /**
   * Reset the values of a pending refresh back to their default states.
   */
  protected _reset(): void;
}

declare namespace PerceptionManager {
  interface Options {
    lighting: {
      initialize: boolean;
      refresh: boolean;
    };
    sight: {
      initialize: boolean;
      refresh: boolean;
      skipUpdateFog: boolean;
      forceUpdateFog: boolean;
    };
    sounds: {
      initialize: boolean;
      refresh: boolean;
      fade: boolean;
    };
    foreground: {
      refresh: boolean;
    };
  }
}
