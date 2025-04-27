import type { AnyObject, DeepPartial } from "../../../../utils/index.d.mts";
import type ApplicationV2 from "../api/application.d.mts";
import type HandlebarsApplicationMixin from "../api/handlebars-application.d.mts";
import type { FormSelectOption } from "../forms/fields.d.mts";

declare namespace FilePicker {
  interface RenderContext extends ApplicationV2.RenderContext {
    bucket: string | null;
    buckets: FormSelectOption[] | null;
    canGoBack: boolean;
    canUpload: boolean;
    canSelect: boolean;
    dirs: FolderContext[];
    displayMode: DisplayMode;
    extensions: string[];
    files: FileContext[];
    isS3: boolean;
    noResults: boolean;
    selected: string;
    source: SourceInfo | S3SourceInfo;
    sources: Sources;
    target: string;
    tileSize: number | null;
    user: User.Implementation;
    favorites: Record<string, FilePicker.FavoriteFolder>;
    buttons: ApplicationV2.FormFooterButton[];
  }

  interface FolderContext {
    name: string;
    path: string;
    private: boolean;
  }

  interface FileContext {
    name: string;
    url: string;
    img: string;
  }

  interface Configuration extends ApplicationV2.Configuration {
    /**
     * A type of file to target.
     * @defaultValue `"any"`
     */
    type?: Type;

    /** The current file path being modified, if any. */
    current?: string;

    /**
     * A current file source in "data", "public", or "s3".
     * @defaultValue `"data"`
     */
    activeSource?: SourceType;

    /** A callback function to trigger once a file has been selected. */
    callback?: Callback;

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
    redirectToRoot?: string[] | null | undefined;
  }

  interface FavoriteFolder {
    /** The source of the folder (e.g. "data", "public") */
    source: string;

    /** The full path to the folder */
    path: string;

    /** The label for the path */
    label: string;
  }

  type Type = "image" | "audio" | "video" | "text" | "imagevideo" | "font" | "folder" | "any";

  type SourceType = keyof Sources;

  interface SourceInfo {
    target: string;
  }

  interface S3SourceInfo extends SourceInfo {
    bucket: string;
    buckets: string[];
  }

  interface Sources {
    data: SourceInfo;
    public: SourceInfo;
    s3?: S3SourceInfo;
  }

  type Callback = (path: string, picker: FilePicker) => void;

  type DisplayMode = "list" | "thumbs" | "tiles" | "images";

  interface BrowseOptions {
    /** A bucket within which to search if using the S3 source */
    bucket?: string;

    /** An Array of file extensions to filter on */
    extensions?: string[];

    /** The requested dir represents a wildcard path */
    wildcard?: boolean;
  }

  interface UploadOptions {
    /**
     * Display a UI notification when the upload is processed
     * @defaultValue `true`
     * @remarks `null` equivalent to `false`
     */
    notify?: boolean | undefined | null;
  }

  // Unknown if these are all possible properties
  interface BrowseReturn {
    dirs: string[];
    extensions: string[];
    files: string[];
    gridSize: number | null;
    private: boolean;
    privateDirs: string[];
    target: string;
  }

  // Unknown if these are all possible properties
  interface ConfigurePathReturn {
    private?: boolean;
  }

  interface UploadBody extends AnyObject {}
}

/**
 * The FilePicker application renders contents of the server-side public directory.
 * This app allows for navigating and uploading files to the public path.
 */
declare class FilePicker<
  RenderContext extends FilePicker.RenderContext = FilePicker.RenderContext,
  Configuration extends FilePicker.Configuration = FilePicker.Configuration,
  RenderOptions extends
    HandlebarsApplicationMixin.ApplicationV2RenderOptions = HandlebarsApplicationMixin.ApplicationV2RenderOptions,
> extends HandlebarsApplicationMixin(ApplicationV2)<RenderContext, Configuration, RenderOptions> {
  /**
   * The full requested path given by the user
   * @defaultValue `""`
   */
  request: string;

  /**
   * A callback function to trigger once a file has been selected
   * @defaultValue `null`
   */
  callback: FilePicker.Callback | null;

  type: FilePicker.Type;

  /**
   * The target HTML element this file picker is bound to
   * @defaultValue `null`
   */
  field: HTMLElement | null;

  /**
   * A button controlling the display of the picker UI
   * @defaultValue `null`
   */
  button: HTMLElement | null;

  /**
   * The display mode of the FilePicker UI
   * @defaultValue `FilePicker.LAST_DISPLAY_MODE`
   */
  displayMode: string;

  /**
   * The file sources available for browsing
   */
  sources: FilePicker.Sources;

  /**
   * Track the active source tab which is being browsed
   */
  activeSource: FilePicker.SourceType;

  static override PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  static override TABS: Record<string, ApplicationV2.TabsConfiguration>;

  /**
   * The allowed values for the type of this FilePicker instance.
   * @defaultValue `["image", "audio", "video", "text", "imagevideo", "font", "folder", "any"]`
   */
  static FILE_TYPES: FilePicker.Type[];

  /**
   * Record the last-browsed directory path so that re-opening a different FilePicker instance uses the same target
   */
  static LAST_BROWSED_DIRECTORY: FilePicker.SourceType;

  /**
   * Record the last-configured display mode so that re-opening a different FilePicker instance uses the same mode.
   * @defaultValue `"list"`
   */
  static LAST_DISPLAY_MODE: FilePicker.DisplayMode;

  /**
   * Enumerate the allowed FilePicker display modes
   * @defaultValue `["list", "thumbs", "tiles", "images"]`
   */
  static DISPLAY_MODES: FilePicker.DisplayMode[];

  /**
   * Cache the names of S3 buckets which can be used
   * @defaultValue `null`
   */
  static S3_BUCKETS: string[] | null;

  /**
   * Return the upload URL to which the FilePicker should post uploaded files
   */
  static get uploadURL(): string;

  /**
   * The latest set of results browsed from the server
   */
  results: AnyObject;

  /**
   * The current set of file extensions which are being filtered upon
   */
  extensions: FilePicker.Type[];

  /**
   * Get favorite folders for quick access
   */
  get favorites(): Record<string, FilePicker.FavoriteFolder>;

  override get title(): string;

  /**
   * Return the source object for the currently active source
   */
  get source(): FilePicker.SourceType | FilePicker.S3SourceInfo;

  /**
   * Return the target directory for the currently active source
   */
  get target(): string;

  /**
   * Return a flag for whether the current user is able to upload file content
   */
  get canUpload(): boolean;

  /**
   * Test a URL to see if it matches a well known s3 key pattern
   * @param url - An input URL to test
   * @returns A regular expression match
   */
  static matchS3URL(url: string): RegExpMatchArray | null;

  /**
   * Browse files for a certain directory location
   * @param source  - The source location in which to browse: see FilePicker#sources for details.
   * @param target  - The target within the source location
   * @param options - Optional arguments
   *                  (default: `{}`)
   */
  // not: null
  static browse(source: string, target: string, options?: FilePicker.BrowseOptions): Promise<FilePicker.BrowseReturn>;

  /**
   * Configure metadata settings regarding a certain file system path
   * @param source  - The source location in which to browse: see FilePicker#sources for details.
   * @param target  - The target within the source location
   * @param options - Optional arguments modifying the request
   *                  (default: `{}`)
   */
  // not: null
  static configurePath(
    source: string,
    target: string,
    options?: FilePicker.BrowseOptions,
  ): Promise<FilePicker.ConfigurePathReturn>;

  /**
   * Create a subdirectory within a given source. The requested subdirectory path must not already exist.
   * @param source  - The source location in which to browse: see FilePicker#sources for details.
   * @param target  - The target within the source location
   * @param options - Optional arguments which modify the request
   *                  (default: `{}`)
   * @returns The full file path of the created directory
   */
  // not: null
  static createDirectory(source: string, target: string, options?: FilePicker.BrowseOptions): Promise<string>;

  /**
   * Dispatch a POST request to the server containing a directory path and a file to upload
   * @param source  - The data source to which the file should be uploaded
   * @param path    - The destination path
   * @param file    - The File object to upload
   * @param body    - Additional file upload options sent in the POST body
   *                  (default: `{}`)
   * @param options - Additional options to configure how the method behaves
   *                  (default: `{}`)
   * @returns The response object
   */
  // not: null
  static upload(
    source: string,
    path: string,
    file: File,
    body?: FilePicker.UploadBody,
    options?: FilePicker.UploadOptions,
  ): Promise<Response>;

  /**
   * A convenience function that uploads a file to a given package's persistent /storage/ directory
   * @param packageId - The id of the package to which the file should be uploaded. Only supports Systems and Modules.
   * @param path      - The relative destination path in the package's storage directory
   * @param file      - The File object to upload
   * @param body      - Additional file upload options sent in the POST body
   *                    (default: `{}`)
   * @param options   - Additional options to configure how the method behaves
   *                    (default: `{}`)
   * @returns The response object
   */
  // not: null
  static uploadPersistent(
    packageId: string,
    path: string,
    file: File,
    body?: FilePicker.UploadBody,
    options?: FilePicker.UploadOptions,
  ): Promise<Response>;

  /**
   * Browse to a specific location for this FilePicker instance
   * @param target  - The target within the currently active source location.
   * @param options - Browsing options
   *                  (default: `{}`)
   */
  // not: null
  browse(target?: string, options?: FilePicker.BrowseOptions): Promise<this>;

  // Render is overridden for no signature change but omitted here to simplify the deprecation

  protected override _prepareContext(
    options: DeepPartial<RenderOptions> & { isFirstRender: boolean },
  ): Promise<RenderContext>;

  protected override _prepareTabs(group: string): Record<string, ApplicationV2.Tab>;

  override changeTab(tab: string, group: string, options?: ApplicationV2.ChangeTabOptions): void;

  protected override _onRender(context: DeepPartial<RenderContext>, options: DeepPartial<RenderOptions>): Promise<void>;

  /**
   * Handle changes to the tile size.
   * @param event - The triggering event.
   */
  protected _onChangeTileSize(event: Event): void;

  /**
   * Search among shown directories and files.
   * @param event - The triggering event
   * @param query - The search input value
   */
  protected _onSearchFilter(event: KeyboardEvent, query: string, rgx: RegExp, html: HTMLElement): void;

  /**
   * Bind the file picker to a new target field.
   * Assumes the user will provide a HTMLButtonElement which has the data-target and data-type attributes
   * The data-target attribute should provide the name of the input field which should receive the selected file
   * The data-type attribute is a string in ["image", "audio"] which sets the file extensions which will be accepted
   *
   * @param button - The button element
   */
  static fromButton(button: HTMLButtonElement): FilePicker;
}

export default FilePicker;
