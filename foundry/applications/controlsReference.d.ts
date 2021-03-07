/**
 * Keyboard Controls Reference Sheet
 */
declare class ControlsReference extends Application {
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
  static get defaultOptions(): FormApplication.Options;
}
