interface ApplicationOptions {
	width: number,
	height: number,
	top: number,
	left: number,
	popOut: boolean,
	minimizable: boolean,
	resizable: boolean,
	id: string,
	classes: string[],
	title: string,
	template: string,
	[key: string]: any
}

interface RenderOptions {
	left: number,
	top: number,
	width: number,
	height: number,
	scale: number,
	log: boolean,
	renderContext: string,
	renderData: any
}

interface Position {
	left: number | null;
	top: number | null;
	width: number | null;
	height: number | string | null;
	scale: number;
}

declare const MIN_WINDOW_WIDTH: number,
			  MIN_WINDOW_HEIGHT: number;

/**
 * The standard application window that is rendered for a large variety of UI elements in Foundry VTT
 *
 * @param options				Configuration options which control how the application is rendered
 *
 * @param options.height		The height in pixels (or "auto") for the rendered element
 * @param options.width			The width in pixels (or "auto") for the rendered element
 * @param options.top			The vertical position (from the top) of the rendered element
 * @param options.left			The horizontal position (from the left) of the rendered element
 * @param options.template		The default HTML template path to use for applications of this type
 * @param options.popOut		Display the element wrapped in a containing window frame (true, the default) or
 *								only the inner HTML (false).
 * @param options.minimizable	Customize whether the application is able to be minimized by double-clicking
 *								the header. Default behavior is the value of `options.popOut`
 * @param options.resizable		Customize whether a window application window may be re-sized by dragging a
 *								handle in the bottom-right corner of the window display.
 */
declare class Application {
	/** The options provided to this application upon initialization */
	options: ApplicationOptions;

	/**
	 * The application ID is a unique incrementing integer which is used to identify every application window
	 * drawn by the VTT
	 */
	appId: number;

	/**
	 * Track the current position and dimensions of the Application UI
	 */
	position: object;
	
	constructor();

	/**
	 * Assign the default options which are supported by this Application
	 */
	static get defaultOptions(): ApplicationOptions;

	/**
	 * Return the CSS application ID which uniquely references this UI element
	 */
	get id(): string;

	/**
	 * Return the active application element, if it currently exists in the DOM
	 */
	get element(): JQuery | HTMLElement;

	/**
	 * The path to the HTML template file which should be used to render the inner content of the app
	 */
	get template(): string;

	/**
	 * Control the rendering style of the application. If popOut is true, the application is rendered in its own
	 * wrapper window, otherwise only the inner app content is rendered
	 */
	get popOut(): boolean;

	/**
	 * An Application window should define its own title definition logic which may be dynamic depending on its data
	 */
	get title(): string;

	/**
	 * An application should define the data object used to render its template.
	 * This function may either return an Object directly, or a Promise which resolves to an Object
	 * If undefined, the default implementation will return an empty object allowing only for rendering of static HTML
	 */
	getData(options: object): object | Promise<object>;

	/**
	 * Render the Application by evaluating it's HTML template against the object of data provided by the getData method
	 * If the Application is rendered as a pop-out window, wrap the contained HTML in an outer frame with window controls
	 *
	 * @param force					Add the rendered application to the DOM if it is not already present. If false, the
	 *								Application will only be re-rendered if it is already present.
	 * @param options				Additional rendering options which are applied to customize the way that the Application
	 *								is rendered in the DOM.
	 *
	 * @param options.left			The left positioning attribute
	 * @param options.top			The top positioning attribute
	 * @param options.width			The rendered width
	 * @param options.height		The rendered height
	 * @param options.scale			The rendered transformation scale
	 * @param options.log			Whether to display a log message that the Application was rendered
	 * @param options.renderContext	A context-providing string which suggests what event triggered the render
	 * @param options.renderData	The data change which motivated the render request
	 *
	 */
	render(force: boolean, options?: RenderOptions): Application;

	/**
	 * Once the HTML for an Application has been rendered, activate event listeners which provide interactivity for
	 * the application
	 */
	activateListeners(html: JQuery | HTMLElement): void;

	/**
	 * Close the application and un-register references to it within UI mappings
	 * This function returns a Promise which resolves once the window closing animation concludes
	 */
	close(): Promise<void> | boolean;

	/**
	 * Minimize the pop-out window, collapsing it to a small tab
	 * Take no action for applications which are not of the pop-out variety or apps which are already minimized
	 * @return	A Promise which resolves to true once the minimization action has completed
	 */
	minimize(): Promise<boolean>;

	/**
	 * Maximize the pop-out window, expanding it to its original size
	 * Take no action for applications which are not of the pop-out variety or are already maximized
	 * @return	A Promise which resolves to true once the maximization action has completed
	 */
	maximise(): Promise<boolean>;

	/**
	 * Set the application position and store it's new location
	 */
	setPosition({ left, top, width, height, scale }: Position): void;
}