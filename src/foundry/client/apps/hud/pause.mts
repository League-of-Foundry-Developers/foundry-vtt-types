declare global {
  /**
   * Pause notification in the HUD
   *
   * @typeParam Options - the type of the options object
   */
  class Pause<Options extends ApplicationOptions = ApplicationOptions> extends Application<Options> {
    static get defaultOptions(): ApplicationOptions;

    override getData(options?: Partial<Options>): MaybePromise<object>;
  }
}
