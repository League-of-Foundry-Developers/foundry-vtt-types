/**
 * Pause notification in the HUD
 *
 * @typeParam Options - the type of the options object
 * @typeParam Data    - The data structure used to render the handlebars template.
 */
declare class Pause<
  Options extends Application.Options = Application.Options,
  Data extends object = Pause.Data
> extends Application<Options> {
  static get defaultOptions(): Application.Options;

  /** @override */
  getData(options?: Partial<Options>): Data | Promise<Data>;
}

declare namespace Pause {
  interface Data {
    paused: boolean;
  }
}
