import type ApplicationV2 from "../api/application.d.mts";
import type HandlebarsApplicationMixin from "../api/handlebars-application.d.mts";

declare namespace FilePicker {
  interface RenderContext extends ApplicationV2.RenderContext {}

  interface Configuration extends ApplicationV2.Configuration {
    /**
     * A type of file to target.
     * @defaultValue `"any"`
     */
    type?: "image" | "audio" | "video" | "text" | "imagevideo" | "font" | "folder" | "any";

    /** The current file path being modified, if any. */
    current?: string;

    /**
     * A current file source in "data", "public", or "s3".
     * @defaultValue `"data"`
     */
    activeSource?: "data" | "public" | "s3";

    /** A callback function to trigger once a file has been selected. */
    callback?: (...args: unknown[]) => void;

    /**
     * A flag which permits explicitly disallowing upload, true by default.
     * @defaultValue `true`
     */
    allowUpload?: boolean;

    /** An HTML form field that the result of this selection is applied to. */
    field?: HTMLElement;

    /** An HTML button element which triggers the display of this picker. */
    button?: HTMLButtonElement;

    /** The picker display mode in FilePicker.DISPLAY_MODES. */
    displayMode?: string;

    /** The picker display mode in FilePicker.DISPLAY_MODES. */
    favorites?: Record<string, FavoriteFolder>;

    /**
     * Display the tile size configuration.
     * @defaultValue `false`
     */
    tileSize?: boolean;

    /** Redirect to the root directory rather than starting in the source directory of one of these files. */
    redirectToRoot?: string[];
  }

  interface FavoriteFolder {
    /** The source of the folder (e.g. "data", "public") */
    source: string;

    /** The full path to the folder */
    path: string;

    /** The label for the path */
    label: string;
  }
}

/**
 * The FilePicker application renders contents of the server-side public directory.
 * This app allows for navigating and uploading files to the public path.
 * @remarks TODO: Stub
 */
declare class FilePicker<
  RenderContext extends FilePicker.RenderContext = FilePicker.RenderContext,
  Configuration extends FilePicker.Configuration = FilePicker.Configuration,
  RenderOptions extends
    HandlebarsApplicationMixin.ApplicationV2RenderOptions = HandlebarsApplicationMixin.ApplicationV2RenderOptions,
> extends HandlebarsApplicationMixin(ApplicationV2)<RenderContext, Configuration, RenderOptions> {}

export default FilePicker;
