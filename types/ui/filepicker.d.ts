/**
 * The FilePicker application renders contents of the server-side public directory
 * This app allows for navigating and uploading files to the public path
 */
declare class FilePicker extends Application {
	/** The full requested path given by the user */
	request: string;

	/** The file sources which are available for browsing */
	sources: object;

	/** Track the active source tab which is being browsed */
	activeSource: string;

	/** The general file type which controls the set of extensions which will be accepted */
	type: string;

	/** The target HTML element this file picker is bound to */
	field: HTMLElement;

	/** A button which controls the display of the picker UI */
	button: HTMLElement;

	/** The current set of file extensions which are being filtered upon */
	extension: string[];

	constructor(options: ApplicationOptions);

	/**
	 * Return the source object for the currently active source
	 */
	get source(): object;

	/**
	 * Return the target directory for the currently active source
	 */
	get target(): string;

	/**
	 * Return a flag for whether the current user is able to upload file content
	 */
	get canUpload(): boolean;

	/**
	 * Browse to a specific location for this FilePicker instance
	 * @param target	The target within the currently active source location.
	 * @param options	Browsing options
	 */
	browse(target: string, options: object): Promise<any>;

	/**
	 * Browse files for a certain directory location
	 * @param source		The source location in which to browse
	 * @param target		The target within the source location
	 * @param extensions	[Option] An Array of file extensions to filter on
	 * @param wildcard		[Option] The requested dir represents a wildcard path
	 * @return				A Promise which resolves to the directories and files contained in the location
	 */
	static browse(source: string, target: string,
		{ extensions, wildcard }: { extensions: string[], wildcard: boolean }): Promise<object>;
}