/**
 * Pause notification in the HUD
 *
 * @typeParam Options - the type of the options object
 */
declare class Pause<Options extends Application.Options = Application.Options> extends Application<Options> {
  static get defaultOptions(): Application.Options;

  /** @override */
  getData(options?: Application.RenderOptions): Pause.Data | Promise<Pause.Data>;
}

declare namespace Pause {
  interface Data {
    paused: boolean;
  }
}
