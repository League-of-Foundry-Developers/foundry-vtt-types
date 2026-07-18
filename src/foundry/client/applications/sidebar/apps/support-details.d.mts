import type ApplicationV2 from "../../api/application.d.mts";
import type HandlebarsApplicationMixin from "../../api/handlebars-application.d.mts";
import type { DeepPartial, Identity } from "#utils";

import ClientIssues = foundry.helpers.ClientIssues;

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      SupportDetails: SupportDetails.Any;
    }
  }
}

/**
 * An application for configuring data across all installed and active packages.
 */
declare class SupportDetails<
  RenderContext extends SupportDetails.RenderContext = SupportDetails.RenderContext,
  Configuration extends SupportDetails.Configuration = SupportDetails.Configuration,
  RenderOptions extends SupportDetails.RenderOptions = SupportDetails.RenderOptions,
> extends HandlebarsApplicationMixin(ApplicationV2)<RenderContext, Configuration, RenderOptions> {
  /**
   * @defaultValue
   * ```js
   * {
   *   id: "support-details",
   *   position: {
   *     height: 735,
   *     width: 780
   *   },
   *   window: {
   *     contentClasses: ["standard-form"],
   *     icon: "fa-solid fa-handshake-angle",
   *     title: "SUPPORT.Title"
   *   },
   *   actions: {
   *     fullReport: SupportDetails.#onGenerateFullReport,
   *     copyReport: SupportDetails.#onCopyReport,
   *     copyUuid: SupportDetails.#onCopyUuid,
   *     deleteDocument: SupportDetails.#onDeleteDocument
   *   }
   * }
   * ```
   */
  static override DEFAULT_OPTIONS: SupportDetails.DefaultOptions;

  static override PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  /**
   * @defaultValue
   * ```js
   * {
   *   main: {
   *     tabs: [
   *       { id: "support", icon: "fa-solid fa-handshake-angle" },
   *       { id: "documents", icon: "fa-solid file-circle-exclamation" },
   *       { id: "client", icon: "fa-regular fa-window" },
   *       { id: "modules", icon: "fa-solid box-open" }
   *     ],
   *     initial: "support",
   *     labelPrefix: "SUPPORT.TABS"
   *   }
   * }
   * ```
   */
  static override TABS: Record<string, ApplicationV2.TabsConfiguration>;

  protected override _preparePartContext(
    partId: string,
    context: ApplicationV2.RenderContextOf<this>,
    options: DeepPartial<RenderOptions>,
  ): Promise<ApplicationV2.RenderContextOf<this>>;

  /**
   * Marshal information on Documents that failed validation and format it for display.
   */
  protected _getDocumentValidationErrors(): SupportDetails.DocumentValidationErrorGroup[];

  /**
   * Marshal package-related warnings and errors and format it for display.
   */
  protected _getModuleIssues(): SupportDetails.ModuleIssueGroup[];

  /**
   * Collects a number of metrics that is useful for Support
   */
  static generateSupportReport(): Promise<SupportDetails.SupportReportData>;

  /**
   * Get a WebGL renderer information string
   * @param gl - The rendering context
   * @returns The unmasked renderer string
   */
  static getWebGLRendererInfo(gl: WebGLRenderingContext): string;

  #SupportDetails: true;
}

declare namespace SupportDetails {
  interface Any extends AnySupportDetails {}
  interface AnyConstructor extends Identity<typeof AnySupportDetails> {}

  interface DocumentValidationErrorGroup {
    label: string;
    documents: {
      name: string;
      uuid: string;
      validationError: string;
    }[];
  }

  interface ModuleIssueGroup {
    label: string;
    issues: {
      label: string;
      issues: {
        severity: "error" | "warning";
        message: string;
      }[];
    }[];
  }

  /**
   * A bundle of metrics for Support
   */
  interface SupportReportData {
    coreVersion: string;
    systemVersion: string;
    activeModuleCount: number;
    performanceMode: string;
    screen: string;
    viewport: string;
    os: string;
    client: string;
    gpu: string;
    maxTextureSize: number | string;
    hasViewedScene: boolean;
    packs: number;

    /**
     * @remarks Despite the JSDoc claiming this is a `string[]`, it's the elements of `game.world.esmodules` and
     * `game.world.scripts` quoted, comma-joined, and localized to `"COMMON.None"` if empty, i.e. a single `string`.
     */
    worldScripts: string;

    /**
     * @remarks Despite the JSDoc claiming these are `number`s, they're each a formatted `string` containing the
     * collection's `size`, with a suffix noting the count of invalid Documents in the collection, if any.
     */
    actors: string;
    items: string;

    /** @remarks See the remarks on {@linkcode SupportDetails.SupportReportData.actors | actors} */
    journal: string;
    tables: string;
    playlists: string;
    messages: string;

    /** Only included if there is a currently viewed Scene. */
    sceneDimensions?: string | undefined;

    /** Only included if there is a currently viewed Scene. */
    grid?: number | undefined;

    /** Only included if there is a currently viewed Scene. */
    padding?: number | undefined;

    /** Only included if there is a currently viewed Scene. */
    walls?: number | undefined;

    /** Only included if there is a currently viewed Scene. */
    lights?: number | undefined;

    /** Only included if there is a currently viewed Scene. */
    sounds?: number | undefined;

    /** Only included if there is a currently viewed Scene. */
    tiles?: number | undefined;

    /** Only included if there is a currently viewed Scene. */
    tokens?: number | undefined;

    /** Only included if there is a currently viewed Scene. */
    largestTexture?:
      | {
          width: number;
          height: number;
          src?: string | undefined;
        }
      | undefined;
  }

  interface RenderContext extends HandlebarsApplicationMixin.RenderContext, ApplicationV2.RenderContext {
    // The following are only present on the context for the part they're relevant to, set by `_preparePartContext`.
    tabClasses?: string | undefined;
    tab?: ApplicationV2.Tab | undefined;
    report?: SupportReportData | undefined;
    documentIssues?: DocumentValidationErrorGroup[] | undefined;
    moduleIssues?: ModuleIssueGroup[] | undefined;
    clientIssues?: { severity: ClientIssues.Severity; message: string }[] | undefined;
  }

  interface Configuration<SupportDetails extends SupportDetails.Any = SupportDetails.Any>
    extends HandlebarsApplicationMixin.Configuration, ApplicationV2.Configuration<SupportDetails> {}

  // Note(LukeAbby): This `& object` is so that the `DEFAULT_OPTIONS` can be overridden more easily
  // Without it then `static override DEFAULT_OPTIONS = { unrelatedProp: 123 }` would error.
  type DefaultOptions<SupportDetails extends SupportDetails.Any = SupportDetails.Any> = DeepPartial<
    Configuration<SupportDetails>
  > &
    object;

  interface RenderOptions extends HandlebarsApplicationMixin.RenderOptions, ApplicationV2.RenderOptions {}
}

declare abstract class AnySupportDetails extends SupportDetails<
  SupportDetails.RenderContext,
  SupportDetails.Configuration,
  SupportDetails.RenderOptions
> {
  constructor(...args: never);
}

export default SupportDetails;
