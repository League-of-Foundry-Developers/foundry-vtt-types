/**
 * A simple window application which shows the built documentation pages within an iframe
 */
declare class FrameViewer extends Application {
  constructor(url: string, options: Application.Options);

  url: string;

  /** @override */
  static get defaultOptions(): Application.Options;

  /** @override */
  getData(options?: Application.RenderOptions): Promise<{ src: string }>;

  /** @override */
  close(options?: Application.CloseOptions): ReturnType<Application['close']>;
}
