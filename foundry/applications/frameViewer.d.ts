/**
 * A simple window application which shows the built documentation pages within an iframe
 */
declare class FrameViewer extends Application {
  url: string;

  /**
   * @override
   * @defaultValue
   * ```
   * mergeObject(super.defaultOptions, {
   *   height: window.innerHeight * 0.9,
   *   width: Math.min(window.innerWidth * 0.9, 1200),
   *   top: (window.innerHeight - height) / 2,
   *   left: (window.innerWidth - width) / 2,
   *   id: "documentation",
   *   template: "templates/apps/documentation.html",
   * })
   * ```
   */
  static get defaultOptions(): typeof Application['defaultOptions'];

  /** @override */
  getData(options?: Application.RenderOptions): Promise<{ src: string }>;

  /** @override */
  close(options?: Application.CloseOptions): ReturnType<Application['close']>;
}
