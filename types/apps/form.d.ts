interface FormApplicationOptions extends ApplicationOptions {
	closeOnSubmit: boolean,
	submitOnClose: boolean,
	submitOnUnfocus: boolean,
	editable: boolean
}

/**
 * An abstract pattern for defining an Application responsible for updating some object using an HTML form
 *
 * A few critical assumptions:
 * 1) This application is used to only edit one object at a time
 * 2) The template used contains one (and only one) HTML <form> as it's outer-most element
 * 3) This abstract layer has no knowledge of what is being updated, so the implementation must define _updateObject
 *
 * @param object					Some object or entity which is the target to be updated.
 *
 * @param options					Additional options which modify the rendering of the sheet.
 * @param options.editable			(true) Is the form editable, or should its fields be disabled?
 * @param options.closeOnSubmit		(true) Automatically close the form when the submit button is pressed.
 * @param options.submitOnClose		(false) Automatically submit the form if the application window is closed.
 * @param options.submitOnUnfocus	(false) Automatically submit the form if an input field is unfocused.
 */
declare class FormApplication extends Application {
	/** The object target which we are using this form to modify */
	object: FormApplicationOptions;

	/** A convenience reference to the form HTLMElement */
	form: HTMLElement;

	/**
	 * Keep track of any FilePicker instances which are associated with this form
	 * The values of this Array are inner-objects with references to the FilePicker instances and other metadata
	 */
	filepickers: any[];

	/**
	 * Keep track of any mce editors which may be active as part of this form
	 * The values of this Array are inner-objects with references to the MCE editor and other metadata
	 */
	editors: object;

	constructor();

	/**
	 * Assign the default options which are supported by the entity edit sheet
	 */
	static get defaultOptions(): FormApplicationOptions;

	/**
	 * Is the Form Application currently editable?
	 */
	get isEditable(): boolean;

	/**
	 * Provide data to the form
	 * @return	The data provided to the template when rendering the form
	 */
	getData(): object;

	/**
	 * Activate the default set of listeners for the Entity sheet
	 * These listeners handle basic stuff like form submission or updating images
	 *
	 * @param html	The rendered template ready to have listeners attached
	 */
	activateListeners(html: JQuery): void;

	/**
	 * Extend the logic applied when the application is closed to destroy any remaining MCE instances
	 * This function returns a Promise which resolves once the window closing animation concludes
	 */
	close(): Promise<void>

	/**
	 * Manually sumbmit the contents of a Form Application, processing its content as defined by the Application
	 * @returns	Return a self-reference for convenient method chaining
	 */
	submit(): FormApplication;
}

declare class BaseEntitySheet extends FormApplication {
	
}