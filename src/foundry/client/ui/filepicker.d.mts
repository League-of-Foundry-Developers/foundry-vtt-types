import type { EmptyObject, MaybePromise, ValueOf } from "../../../utils/index.d.mts";

declare global {
  interface FilePickerOptions extends ApplicationOptions {
    /** A type of file to target */
    type?: FilePicker.Type | undefined;

    /** The current file path being modified, if any */
    current?: string | undefined;

    /** A current file source in "data", "public", or "s3" */
    activeSource?: FilePicker.SourceType | undefined;

    /** A callback function to trigger once a file has been selected */
    callback?: FilePicker.Callback | undefined;

    /** A flag which permits explicitly disallowing upload, true by default */
    allowUpload?: boolean | undefined;

    /** An HTML form field that the result of this selection is applied to */
    field?: HTMLElement | undefined;

    /** An HTML button element which triggers the display of this picker */
    button?: HTMLElement | undefined;

    /** The picker display mode in FilePicker.DISPLAY_MODES */
    favorites?: Record<string, FilePicker.FavoriteFolder>;

    /** The picker display mode in FilePicker.DISPLAY_MODES */
    displayMode?: FilePicker.DisplayMode | undefined;

    /** Display the tile size configuration. */
    tileSize?: boolean | undefined;

    /** Redirect to the root directory rather than starting in the source directory of one of these files. */
    redirectToRoot?: string[];
  }

  /**
   * The FilePicker application renders contents of the server-side public directory.
   * This app allows for navigating and uploading files to the public path.
   * @typeParam Options - the type of the options object
   */
  class FilePicker<Options extends FilePickerOptions = FilePickerOptions> extends Application<Options> {
    /**
     * @param options - Options that configure the behavior of the FilePicker
     */
    constructor(options?: Partial<Options>);

    // placeholder private member
    #filePicker: true;

    /**
     * The full requested path given by the user
     */
    request: string | undefined;

    /**
     * The file sources which are available for browsing
     */
    sources: FilePicker.Sources;

    /**
     * Track the active source tab which is being browsed
     * @defaultValue `"data"`
     */
    activeSource: FilePicker.SourceType;

    /**
     * A callback function to trigger once a file has been selected
     */
    callback: FilePicker.Callback | undefined;

    /**
     * The latest set of results browsed from the server
     * @remarks This is never set.
     */
    results: EmptyObject;

    /**
     * The general file type which controls the set of extensions which will be accepted
     */
    type: FilePicker.Type;

    /**
     * The target HTML element this file picker is bound to
     */
    field: HTMLElement | undefined;

    /**
     * A button which controls the display of the picker UI
     */
    button: HTMLElement | undefined;

    /**
     * The display mode of the FilePicker UI
     * @defaultValue `FilePicker.LAST_DISPLAY_MODE`
     */
    displayMode: FilePicker.DisplayMode;

    /**
     * The current set of file extensions which are being filtered upon
     */
    extensions: string[] | undefined;

    protected _loaded: boolean;

    /**
     * The allowed values for the type of this FilePicker instance.
     */
    static FILE_TYPES: string[];

    /**
     * Record the last-browsed directory path so that re-opening a different FilePicker instance uses the same target
     * @defaultValue `""`
     */
    static LAST_BROWSED_DIRECTORY: string;

    /**
     * Record the last-configured tile size which can automatically be applied to new FilePicker instances
     * @defaultValue `null`
     */
    static LAST_TILE_SIZE: number | null;

    /**
     * Record the last-configured display mode so that re-opening a different FilePicker instance uses the same mode.
     * @defaultValue `"list"`
     */
    static LAST_DISPLAY_MODE: FilePicker.DisplayMode;

    /**
     * Enumerate the allowed FilePicker display modes
     */
    static DISPLAY_MODES: ["list", "thumbs", "tiles", "images"];

    /**
     * Cache the names of S3 buckets which can be used
     * @defaultValue `null`
     */
    static S3_BUCKETS: string[] | null;

    /**
     * Get favorite folders for quick access
     */
    static get favorites(): Record<string, FilePicker.FavoriteFolder>;

    /**
     * Set favorite folders for quick access
     */
    static set favorites(favorites: Record<string, FilePicker.FavoriteFolder>);

    /**
     * Add the given path for the source to the favorites
     * @param source - The source of the folder (e.g. "data", "public")
     * @param path   - The path to a folder
     */
    static setFavorite(source: string, path: string): Promise<void>;

    /**
     * Remove the given path from to the favorites
     * @param source - The source of the folder (e.g. "data", "public")
     * @param path   - The path to a folder
     */
    static removeFavorite(source: string, path: string): Promise<void>;

    /**
     * @defaultValue
     * ```typescript
     * foundry.utils.mergeObject(super.defaultOptions, {
     *   template: "templates/apps/filepicker.html",
     *   classes: ["filepicker"],
     *   width: 520,
     *   tabs: [{navSelector: ".tabs"}],
     *   dragDrop: [{dragSelector: ".file", dropSelector: ".filepicker-body"}],
     *   tileSize: false,
     *   filters: [{inputSelector: 'input[name="filter"]', contentSelector: ".filepicker-body"}]
     * })
     * ```
     */
    static override get defaultOptions(): FilePickerOptions;

    /**
     * Given a current file path, determine the directory it belongs to
     * @param target - The currently requested target path
     * @returns An array of the inferred source and target directory path
     * @internal
     */
    protected _inferCurrentDirectory(target: string): [string, string];

    /**
     * Test a URL to see if it matches a well known s3 key pattern
     * @param url - An input URL to test
     * @returns A regular expression match
     */
    static matchS3URL(url: string): RegExpMatchArray | null;

    override get title(): string;

    /**
     * Return the source object for the currently active source
     */
    get source(): FilePicker.Source;

    /**
     * Return the target directory for the currently active source
     */
    get target(): string;

    /**
     * Return a flag for whether the current user is able to upload file content
     */
    get canUpload(): boolean;

    /**
     * Return the upload URL to which the FilePicker should post uploaded files
     */
    static get uploadURL(): string;

    override getData(options?: Partial<Options>): MaybePromise<object>;

    override setPosition(
      position?: Partial<Omit<Application.Position, "zIndex">>,
    ): void | (Application.Position & { height: number });

    /**
     * Browse to a specific location for this FilePicker instance
     * @param target - The target within the currently active source location.
     * @param options - Browsing options (default: `{}`)
     */
    browse(target?: string, options?: FilePicker.BrowseOptions): Promise<FilePicker.BrowseResult>;

    /**
     * Browse files for a certain directory location
     * @param source  - The source location in which to browse. See FilePicker#sources for details
     * @param target  - The target within the source location (default: `""`)
     * @param options - Optional arguments (default: `{}`)
     *
     * @returns A Promise which resolves to the directories and files contained in the location
     */
    static browse(
      source: FilePicker.SourceType,
      target: string,
      options?: FilePicker.BrowseOptions,
    ): Promise<FilePicker.BrowseResult>;

    /**
     * Configure metadata settings regarding a certain file system path
     * @param source  - The source location in which to browse. See FilePicker#sources for details
     * @param target  - The target within the source location
     * @param options - Optional arguments which modify the request (default: `{}`)
     */
    static configurePath(
      source: FilePicker.SourceType,
      target: string,
      options?: FilePicker.ConfigurePathOptions,
    ): Promise<FilePicker.ConfigurePathResult>;

    /**
     * Create a subdirectory within a given source. The requested subdirectory path must not already exist.
     * @param source  - The source location in which to browse. See FilePicker#sources for details
     * @param target  - The target within the source location
     * @param options - Optional arguments which modify the request (default: `{}`)
     */
    static createDirectory(
      source: FilePicker.SourceType,
      target: string,
      options?: FilePicker.CreateDirectoryOptions,
    ): Promise<string>;

    /**
     * Dispatch a POST request to the server containing a directory path and a file to upload
     * @param source  - The data source to which the file should be uploaded
     * @param path    - The destination path
     * @param file    - The File object to upload
     * @param body    - Additional file upload options sent in the POST body
     *                  (default: `{}`)
     * @param options - Additional options to configure how the method behaves
     *                  (default `{}`)
     * @returns The response object
     */
    static upload(
      source: FilePicker.SourceType,
      path: string,
      file: File,
      body?: FilePicker.UploadBody,
      options?: FilePicker.UploadOptions,
    ): Promise<FilePicker.UploadResult | false | void | EmptyObject>;

    /**
     * A convenience function that uploads a file to a given package's persistent /storage/ directory
     * @param packageId  - The id of the package to which the file should be uploaded.
     *                     Only supports Systems and Modules.
     * @param path       - The relative destination path in the package's storage directory
     * @param file       - The File object to upload
     * @param body       - Additional file upload options sent in the POST body
     *                     (default: `{}`)
     * @param options    - Additional options to configure how the method behaves
     *                     (default `{}`)
     * @returns The response object
     */
    static uploadPersistent(
      packageId: string,
      path: string,
      file: File,
      body?: FilePicker.UploadBody,
      options?: FilePicker.UploadOptions,
    ): Promise<FilePicker.UploadResult | false | void | EmptyObject>;

    /**
     * Additional actions performed when the file-picker UI is rendered
     */
    override render(force?: boolean, options?: Application.RenderOptions<Options>): this;

    override activateListeners(html: JQuery): void;

    protected override _onChangeTab(event: MouseEvent | null, tabs: Tabs, active: this["activeSource"]): void;

    protected override _canDragStart(selector: string | null): boolean;

    protected override _canDragDrop(selector: string | null): boolean;

    protected override _onDragStart(event: DragEvent): void;

    /**
     * @internal
     */
    protected override _onDrop(event: DragEvent): void;

    /**
     * Handle changes to the tile size.
     * @param event - The triggering event.
     */
    _onChangeTileSize(event: Event): void;

    protected override _onSearchFilter(event: KeyboardEvent, query: string, rgx: RegExp, html: HTMLElement): void;

    protected _onSubmit(ev: Event): void;

    /**
     * Bind the file picker to a new target field.
     * Assumes the user will provide a <button> HTMLElement which has the data-target and data-type attributes
     * The data-target attribute should provide the name of the input field which should receive the selected file
     * The data-type attribute is a string in ["image", "audio"] which sets the file extensions which will be accepted
     *
     * @param button - The button element
     */
    static fromButton(button: HTMLButtonElement): FilePicker;
  }

  namespace FilePicker {
    interface BrowseResult {
      target: string;
      private: boolean;
      dirs: string[];
      privateDirs: string[];
      files: string[];
      gridSize: number | null;
      extensions: [];
    }

    interface BrowseOptions {
      /**
       * A bucket within which to search, if using the S3 source
       */
      bucket?: string | undefined;

      /**
       * An Array of file extensions to filter on
       * @defaultValue `[]` (do not filter on extension)
       */
      extensions?: string[] | undefined;

      /**
       * The requested dir represents a wildcard path
       * @defaultValue false
       */
      wildcard?: boolean | undefined;
    }

    type Callback = (path: string) => void;

    interface FavoriteFolder {
      /** The source of the folder (e.g. "data", "public") */
      source: string;
      /** The full path to the folder */
      path: string;
      /** The label for the path */
      label: string;
    }

    interface ConfigurePathOptions {
      bucket?: string | undefined | null;

      private?: boolean | undefined;

      gridSize?: number | undefined;
    }

    interface ConfigurePathResult {
      private?: boolean;
      gridSize?: number;
    }

    interface CreateDirectoryOptions {
      /**
       * @defaultValue `""`
       */
      bucket?: string | null | undefined;
    }

    type SourceType = "data" | "public" | "s3";

    interface Dir {
      name: string;
      path: string;
      private: boolean;
    }

    type DisplayMode = ValueOf<(typeof FilePicker)["DISPLAY_MODES"]>;

    interface ManageFilesDataBase {
      source: string;
      target: string;
    }

    interface BrowseFilesData extends ManageFilesDataBase {
      action: "browseFiles";
    }

    interface ConfigurePathData extends ManageFilesDataBase {
      action: "configurePath";
    }

    interface CreateDirectoryData extends ManageFilesDataBase {
      action: "createDirectory";
    }

    interface Source {
      target: string;
      label: string;
      icon: string;
    }

    interface Sources {
      data: Source;
      public: Source;
      s3?: Source & {
        buckets: string[];
        bucket: string;
      };
    }

    type Type = "image" | "audio" | "video" | "text" | "imagevideo" | "font" | "folder" | "any";

    interface UploadBody {
      /**
       * A bucket to upload to, if using the S3 source
       * @defaultValue `""`
       */
      bucket?: string | null | undefined;
    }

    interface UploadOptions {
      /**
       * Display a UI notification when the upload is processed
       * @defaultValue `true`
       */
      notify?: boolean | undefined;
    }

    interface UploadResult {
      message: string;
      path: string;
      status: "success";
    }
  }
}
