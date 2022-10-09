/**
 * Support Info and Report
 * @typeParam Options - the type of the options object
 */
declare class SupportDetails<Options extends ApplicationOptions = ApplicationOptions> extends Application<Options> {
  /**
   * @defaultValue
   * ```typescript
   * const options = super.defaultOptions;
   * options.title = "SUPPORT.Title";
   * options.id = "support-details";
   * options.template = "templates/sidebar/apps/support-details.html";
   * options.width = 620;
   * options.height = "auto";
   * return options;
   * ```
   */
  static override get defaultOptions(): ApplicationOptions;

  /**
   * Returns the support report data
   */
  getData(options?: Partial<Options> | undefined): MaybePromise<object>;

  /**
   * Binds the Support Report copy button
   */
  override activateListeners(html: JQuery): void;

  /**
   * Collects a number of metrics that is useful for Support
   */
  static generateSupportReport(): SupportReportData;

  /**
   * Get a WebGL renderer information string
   * @param gl - The rendering context
   * @returns The unmasked renderer string
   */
  static getWebGLRendererInfo(gl: WebGLRenderingContext): string;
}

interface SupportReportData {
  coreVersion: number;
  systemVersion: string;
  activeModuleCount: number;
  os: string;
  client: string;
  gpu: string;
  maxTextureSize: number | string;
  sceneDimensions: string;
  grid: number;
  padding: number;
  walls: number;
  lights: number;
  sounds: number;
  tiles: number;
  tokens: number;
  actors: number;
  items: number;
  journals: number;
  tables: number;
  playlists: number;
  packs: number;
  messages: number;
}
