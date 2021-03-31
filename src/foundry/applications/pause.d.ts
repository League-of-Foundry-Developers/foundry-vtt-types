/**
 * Pause notification in the HUD
 */
declare class Pause<D extends Pause.Data = Pause.Data> extends Application {
  static get defaultOptions(): typeof Application['defaultOptions'];

  /**
   * Prepare the default data which is required to render the Pause UI
   */
  getData(): D | Promise<D>;
}

declare namespace Pause {
  interface Data {
    paused: boolean;
  }
}
