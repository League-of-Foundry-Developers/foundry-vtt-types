import type { GetDataReturnType, MaybePromise, Identity } from "#utils";

declare global {
  /**
   * Pause notification in the HUD
   *
   * @typeParam Options - the type of the options object
   */
  class Pause<Options extends Application.Options = Application.Options> extends Application<Options> {
    /**
     * @defaultValue
     * ```ts
     * const options = super.defaultOptions;
     * options.id = "pause";
     * options.template = "templates/hud/pause.html";
     * options.popOut = false;
     * return options;
     * ```
     */
    static get defaultOptions(): Application.Options;

    override getData(options?: Partial<Options>): MaybePromise<GetDataReturnType<Pause.PauseData>>;
  }

  namespace Pause {
    interface Any extends AnyPause {}
    interface AnyConstructor extends Identity<typeof AnyPause> {}

    interface PauseData {
      paused: boolean;
    }
  }
}

declare abstract class AnyPause extends Pause<Application.Options> {
  constructor(...args: never);
}
