/**
 * Pause notification in the HUD
 *
 * @typeParam Options - the type of the options object
 * @typeParam Data    - The data structure used to render the handlebars template.
 */
declare class Pause<
  Options extends ApplicationOptions = ApplicationOptions,
  Data extends object = Pause.Data
> extends Application<Options> {
  static get defaultOptions(): ApplicationOptions;

  override getData(options?: Partial<Options>): Data | Promise<Data>;
}

declare namespace Pause {
  interface Data {
    paused: boolean;
  }
}
