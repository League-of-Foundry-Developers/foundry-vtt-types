import type { MaybePromise } from "fvtt-types/utils";

declare global {
  /**
   * Support Info and Report
   * @typeParam Options - the type of the options object
   */
  class SupportDetails<Options extends ApplicationOptions = ApplicationOptions> extends Application<Options> {
    /**
     * @defaultValue
     * ```typescript
     * const options = super.defaultOptions;
     * options.title = "SUPPORT.Title";
     * options.id = "support-details";
     * options.template = "templates/sidebar/apps/support-details.html";
     * options.width = 780;
     * options.height = 680;
     * options.resizable = true;
     * options.classes = ["sheet"];
     * options.tabs = [{navSelector: ".tabs", contentSelector: "article", initial: "support"}];
     * return options;
     * ```
     */
    static override get defaultOptions(): ApplicationOptions;

    /**
     * Returns the support report data
     */
    // TODO: Implement GetDataReturnType
    getData(options?: Partial<Options>): MaybePromise<object>;

    /**
     * Binds the Support Report copy button
     */
    override activateListeners(html: JQuery): void;

    protected override _render(force?: boolean, options?: Application.RenderOptions): Promise<void>;

    /**
     * @internal
     */
    protected override _renderInner(data: ReturnType<this["getData"]>): Promise<JQuery>;

    /**
     * Handle a button click action.
     * @param event - The click event
     */
    protected _onClickAction(event: MouseEvent): void;

    /**
     * Copy the support details report to clipboard.
     */
    protected _copyReport(): void;

    /**
     * Marshal information on Documents that failed validation and format it for display.
     */
    protected _getDocumentValidationErrors(): {
      label: string;
      documents: {
        name: string;
        validationError: string;
      };
    }[];

    /**
     * Marshal package-related warnings and errors and format it for display.
     */
    protected _getModuleIssues(): {
      label: string;
      issues: {
        label: string;
        issues: {
          severity: "error" | "warning";
          message: string;
        }[];
      }[];
    }[];

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

  namespace SupportDetails {
    type Any = SupportDetails<any>;
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
    padding: number; // note: float in actual code
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
}
