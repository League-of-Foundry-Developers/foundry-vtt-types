import type { DeepPartial, Identity } from "#utils";
import type ApplicationV2 from "../../api/application.d.mts";
import type HandlebarsApplicationMixin from "../../api/handlebars-application.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      SupportDetails: SupportDetails.Any;
    }
  }
}

declare class SupportDetails<
  RenderContext extends SupportDetails.RenderContext = SupportDetails.RenderContext,
  Configuration extends SupportDetails.Configuration = SupportDetails.Configuration,
  RenderOptions extends SupportDetails.RenderOptions = SupportDetails.RenderOptions,
> extends HandlebarsApplicationMixin(ApplicationV2)<RenderContext, Configuration, RenderOptions> {
  // Fake override.
  static override DEFAULT_OPTIONS: SupportDetails.DefaultOptions;

  static override PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  static override TABS: Record<string, ApplicationV2.TabsConfiguration>;

  /**
   * @remarks Regenerates the support report on every render of the `support` part, so opening that tab re-runs
   * {@linkcode SupportDetails.generateSupportReport}.
   */
  protected override _preparePartContext(
    partId: string,
    context: ApplicationV2.RenderContextOf<this>,
    options: DeepPartial<HandlebarsApplicationMixin.RenderOptions>,
  ): Promise<ApplicationV2.RenderContextOf<this>>;

  /**
   * Marshal information on Documents that failed validation and format it for display.
   */
  protected _getDocumentValidationErrors(): SupportDetails.DocumentValidationErrors[];

  /**
   * Marshal package-related warnings and errors and format it for display.
   *
   * @remarks Returns at most two groups, errors before warnings, and omits either when it has no entries.
   */
  protected _getModuleIssues(): SupportDetails.ModuleIssueGroup[];

  /**
   * Collects a number of metrics that is useful for Support
   *
   * @remarks Creates a throwaway WebGL context when the canvas has none, so this can be called with the canvas
   * disabled.
   */
  static generateSupportReport(): Promise<SupportDetails.SupportReportData>;

  /**
   * Get a WebGL renderer information string
   * @param gl - The rendering context
   * @returns The unmasked renderer string
   *
   * @remarks Firefox reports the masked renderer; every other browser is queried through the
   * `WEBGL_debug_renderer_info` extension.
   */
  static getWebGLRendererInfo(gl: WebGLRenderingContext | WebGL2RenderingContext): string;

  #SupportDetails: true;

  static #SupportDetailsStatic: true;
}

declare namespace SupportDetails {
  interface Any extends AnySupportDetails {}
  interface AnyConstructor extends Identity<typeof AnySupportDetails> {}

  /**
   * @privateRemarks Empty because SupportDetails adds nothing to the shared render context. Its `report`,
   * `documentIssues`, `moduleIssues`, `clientIssues` and `tabClasses` additions are made by `_preparePartContext`
   * and so reach only the part each belongs to.
   */
  interface RenderContext extends HandlebarsApplicationMixin.RenderContext, ApplicationV2.RenderContext {}

  interface Configuration<SupportDetails extends SupportDetails.Any = SupportDetails.Any>
    extends HandlebarsApplicationMixin.Configuration, ApplicationV2.Configuration<SupportDetails> {}

  // Note(LukeAbby): This `& object` is so that the `DEFAULT_OPTIONS` can be overridden more easily
  // Without it then `static override DEFAULT_OPTIONS = { unrelatedProp: 123 }` would error.
  type DefaultOptions<SupportDetails extends SupportDetails.Any = SupportDetails.Any> = DeepPartial<
    Configuration<SupportDetails>
  > &
    object;

  interface RenderOptions extends HandlebarsApplicationMixin.RenderOptions, ApplicationV2.RenderOptions {}

  /** One Document type's worth of validation failures. */
  interface DocumentValidationErrors {
    /** The localized plural label of the Document type. */
    label: string;

    documents: InvalidDocument[];
  }

  interface InvalidDocument {
    /** The Document's name, falling back to the localized singular label of its type. */
    name: string;

    uuid: string;

    /** The validation failure rendered as HTML. */
    validationError: string;
  }

  /** A group of package compatibility issues of a single severity. */
  interface ModuleIssueGroup {
    /** The localized group heading, either "Errors" or "Warnings". */
    label: string;

    issues: ModuleIssues[];
  }

  interface ModuleIssues {
    /** The module's title, falling back to its ID. */
    label: string;

    issues: ModuleIssue[];
  }

  interface ModuleIssue {
    severity: "error" | "warning";

    message: string;
  }

  /**
   * A bundle of metrics for Support
   *
   * @remarks The scene metrics below are only collected when the user has a scene in view, so a report taken with
   * no viewed scene omits them.
   */
  interface SupportReportData {
    /** The release display name and version, comma-separated. */
    coreVersion: string;

    /** The system ID and version, comma-separated. */
    systemVersion: string;

    activeModuleCount: number;

    /** The localized label of the configured performance mode. */
    performanceMode: string;

    screen: string;

    viewport: string;

    os: string;

    client: string;

    gpu: string;

    /** `"Could not detect"` when no WebGL context could be established. */
    maxTextureSize: number | string;

    hasViewedScene: boolean;

    packs: number;

    /**
     * The world's ES modules and scripts, quoted and comma-separated, or the localized "None".
     *
     * @privateRemarks Foundry's typedef documents `string[]`; the runtime joins the list before assigning it.
     */
    worldScripts: string;

    /**
     * @remarks Each of these six is the collection size, with the count of invalid documents appended in
     * parentheses when there are any — so `"12"` or `"12 (2 Invalid)"`, never a plain number.
     *
     * @privateRemarks Foundry's typedef documents them as `number`, and names the journal entry `journals`; the
     * runtime writes strings under the collection names below.
     */
    actors: string;

    items: string;

    journal: string;

    tables: string;

    playlists: string;

    messages: string;

    /** The viewed scene's dimensions, formatted `"<width> x <height>"`. */
    sceneDimensions?: string | undefined;

    grid?: number | undefined;

    padding?: number | undefined;

    walls?: number | undefined;

    lights?: number | undefined;

    sounds?: number | undefined;

    tiles?: number | undefined;

    tokens?: number | undefined;

    largestTexture?: LargestTexture | undefined;
  }

  /** @remarks Zero-sized with no `src` when the scene contains no sprite-backed textures. */
  interface LargestTexture {
    width: number;

    height: number;

    src?: string | undefined;
  }
}

declare abstract class AnySupportDetails extends SupportDetails<
  SupportDetails.RenderContext,
  SupportDetails.Configuration,
  SupportDetails.RenderOptions
> {
  constructor(...args: never);
}

export default SupportDetails;
