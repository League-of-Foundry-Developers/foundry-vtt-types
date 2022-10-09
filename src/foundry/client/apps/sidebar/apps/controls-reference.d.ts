/**
 * Keyboard Controls Reference Sheet
 * @typeParam Options - the type of the options object
 * @deprecated since v9
 */
declare class ControlsReference<Options extends ApplicationOptions = ApplicationOptions> extends Application<Options> {
  /**
   * @defaultValue
   * ```typescript
   * const options = super.defaultOptions;
   * options.title = game.i18n.localize("CONTROLS.Title");
   * options.id = "controls-reference";
   * options.template = "templates/sidebar/apps/controls-reference.html";
   * options.width = 600;
   * ```
   */
  static get defaultOptions(): ApplicationOptions;

  override getData(options?: Partial<Options>): MaybePromise<object>;
}
