/**
 * The FilePicker application renders contents of the server-side public directory
 * This app allows for navigating and uploading files to the public path
 */
declare class FilePicker extends Application {
  /** Track the active source tab which is being browsed */
  activeSource: string;

  /** A button which controls the display of the picker UI */
  button: HTMLElement;

  /** The current set of file extensions which are being filtered upon */
  extension: string[];

  /** The target HTML element this file picker is bound to */
  field: HTMLElement;

  /** The full requested path given by the user */
  request: string;

  /** The file sources which are available for browsing */
  sources: any;

  /** The general file type which controls the set of extensions which will be accepted */
  type: string;

  constructor(options: Application.Options);

  /**
   * Return the source object for the currently active source
   */
  get source(): any;

  /**
   * Return the target directory for the currently active source
   */
  get target(): string;

  /**
   * Return a flag for whether the current user is able to upload file content
   */
  get canUpload(): boolean;

  /**
   * Browse files for a certain directory location
   * @param source - The source location in which to browse. See FilePicker#sources for details
   * @param target - The target within the source location
   *
   * @param options - Optional arguments
   * @param bucket - A bucket within which to search if using the S3 source
   * @param extensions - An Array of file extensions to filter on
   * @param wildcard - The requested dir represents a wildcard path
   *
   * @returns A Promise which resolves to the directories and files contained in the location
   */
  static browse(
    source: string,
    target: string,
    options?: { bucket?: string; extensions?: string[]; wildcard?: boolean }
  ): Promise<any>;

  /**
   * Create a subdirectory within a given source. The requested subdirectory path must not already exist.
   * @param source - The source location in which to browse. See FilePicker#sources for details
   * @param target - The target within the source location
   * @param options - Optional arguments which modify the request
   */
  static createDirectory(source: string, target: string, options: object): Promise<object>;

  /**
   * Bind the file picker to a new target field.
   * Assumes the user will provide a <button> HTMLElement which has the data-target and data-type attributes
   * The data-target attribute should provide the name of the input field which should receive the selected file
   * The data-type attribute is a string in ["image", "audio"] which sets the file extensions which will be accepted
   *
   * @param button - The button element
   */
  static fromButton(button: HTMLElement, options: object): FilePicker;

  /**
   * Dispatch a POST request to the server containing a directory path and a file to upload
   * @param source - The data source to which the file should be uploaded
   * @param path - The destination path
   * @param file - The File object to upload
   * @param options - Additional file upload options passed as form data
   */
  static upload(source: string, path: string, file: File, options: object): Promise<boolean>;

  /**
   * Get the valid file extensions for a given named file picker type
   */
  _getExtensions(type: string): string[];

  /**
   * Given a current file path, determine the directory it belongs to
   * @param target - The currently requested target path
   * @returns An array of the inferred source and target path
   */
  _inferCurrentDirectory(target: string): [string, string];

  /**
   * Handle backwards navigation of the folder structure
   */
  _onBack(event: Event): any;

  _onChangeBucket(event: Event): any;

  /**
   * Handle a drop event to support dropping files onto the file picker and automatically uploading them
   */
  _onDrop(event: Event): Promise<any>;

  /**
   * Handle a keyup event in the filter box to restrict the set of files shown in the FilePicker
   */
  _onFilterResults(event: Event): void;

  /**
   * Handle file or folder selection within the file picker
   * @param event - The originating click event
   */
  _onPick(event: Event): any;

  /**
   * Handle user submission of the address bar to request an explicit target
   * @param event - The originating keydown event
   */
  _onRequestTarget(event: Event): void;

  /**
   * Handle file picker form submission
   */
  _onSubmit(ev: Event): any;

  /**
   * Handle file upload
   */
  _onUpload(ev: Event): Promise<any>;

  /**
   * Browse to a specific location for this FilePicker instance
   * @param target - The target within the currently active source location.
   * @param options - Browsing options
   */
  browse(target: string, options?: object): Promise<any>;
}
