/**
 * An abstract pattern for defining an Application responsible for updating some object using an HTML form
 *
 * A few critical assumptions:
 * 1) This application is used to only edit one object at a time
 * 2) The template used contains one (and only one) HTML form as it's outer-most element
 * 3) This abstract layer has no knowledge of what is being updated, so the implementation must define _updateObject
 *
 * @typeParam P - the type of the options object
 * @typeParam D - The data structure used to render the handlebars template.
 * @typeParam O - the type of the object or entity target which we are using this form to modify
 */
declare abstract class FormApplication<
  P extends FormApplication.Options = FormApplication.Options,
  D extends object = FormApplication.Data<{}, P>,
  O = D extends FormApplication.Data<infer T, P> ? T : {}
> extends Application<P> {
  /**
   * @param object  - Some object or entity which is the target to be updated.
   *                  (default: `{}`)
   * @param options - Additional options which modify the rendering of the sheet.
   *                  (default: `{}`)
   */
  constructor(object?: O, options?: Partial<P>);

  /**
   * The object target which we are using this form to modify
   */
  object: O;

  /**
   * A convenience reference to the form HTLMElement
   * @defaultValue `null`
   */
  form: HTMLElement | null;

  /**
   * Keep track of any FilePicker instances which are associated with this form
   * The values of this Array are inner-objects with references to the FilePicker instances and other metadata
   */
  filepickers: FilePicker[];

  /**
   * Keep track of any mce editors which may be active as part of this form
   * The values of this Array are inner-objects with references to the MCE editor and other metadata
   * @defaultValue `{}`
   */
  editors: Partial<Record<string, FormApplication.FormApplicationEditor>>;

  /**
   * Assign the default options which are supported by the entity edit sheet.
   * @returns The default options for this FormApplication class
   * @override
   * @see {@link Application.defaultOptions}
   */
  static get defaultOptions(): FormApplication.Options;

  /**
   * Is the Form Application currently editable?
   */
  get isEditable(): boolean;

  /**
   * @param options - (unused) (default: `{}`)
   * @override
   */
  getData(options?: Application.RenderOptions): D | Promise<D>;

  /**
   * @override
   */
  protected _render(force?: boolean, options?: Application.RenderOptions): Promise<void>;

  /**
   * @param options - (unused)
   * @override
   */
  protected _renderInner(data: D, options?: Application.RenderOptions): Promise<JQuery>;

  /**
   * Activate the default set of listeners for the Entity sheet
   * These listeners handle basic stuff like form submission or updating images
   *
   * @param html - The rendered template ready to have listeners attached
   * @override
   */
  activateListeners(html: JQuery): void;

  /**
   * If the form is not editable, disable its input fields
   */
  protected _disableFields(form: HTMLElement): void;

  /**
   * Handle standard form submission steps
   * @param event   - The submit event which triggered this handler
   * @param options - (default: `{}`)
   * @returns A promise which resolves to the validated update data
   */
  protected _onSubmit(
    event: Event,
    options?: FormApplication.OnSubmitOptions
  ): Promise<Partial<Record<string, unknown>>>;

  /**
   * Get an object of update data used to update the form's target object
   * @param updateData - Additional data that should be merged with the form data
   *                     (default: `{}`)
   * @returns The prepared update data
   */
  // TODO: Maybe we can calculate how the flattened `updateData` looks like, then it would be Partial<Record<string, unknown>> & Flattened<T>
  protected _getSubmitData(updateData?: object): Partial<Record<string, unknown>>;

  /**
   * Handle changes to an input element, submitting the form if options.submitOnChange is true.
   * Do not preventDefault in this handler as other interactions on the form may also be occurring.
   * @param event - The initial change event
   */
  protected _onChangeInput(event: JQuery.ChangeEvent): void | Promise<Partial<Record<string, unknown>>>;

  /**
   * Handle the change of a color picker input which enters it's chosen value into a related input field
   */
  protected _onChangeColorPicker(event: JQuery.ChangeEvent): void;

  /**
   * Handle changes to a range type input by propagating those changes to the sibling range-value element
   * @param event - The initial change event
   */
  protected _onChangeRange(event: JQuery.ChangeEvent): void;

  /**
   * This method is called upon form submission after form data is validated
   * @param event    - The initial triggering submission event
   *                   (unused)
   * @param formData - The object of validated form data with which to update the object
   *                   (unused)
   * @returns A Promise which resolves once the update operation has completed
   */
  protected abstract _updateObject(event: Event, formData?: object): Promise<unknown>;

  /**
   * Activate a named TinyMCE text editor
   * @param name           - The named data field which the editor modifies.
   * @param options        - TinyMCE initialization options passed to TextEditor.create
   *                         (default: `{}`)
   * @param initialContent - Initial text content for the editor area.
   *                         (default: `''`)
   */
  activateEditor(name: string, options?: TextEditor.Options, initialContent?: string): void;

  /**
   * Handle saving the content of a specific editor by name
   * @param name   - The named editor to save
   * @param remove - Remove the editor after saving its content
   *                 (default: `true`)
   */
  saveEditor(name: string, { remove }?: { remove?: boolean }): Promise<void>;

  /**
   * Activate a TinyMCE editor instance present within the form
   */
  protected _activateEditor(div: HTMLElement): void;

  /**
   * Activate a FilePicker instance present within the form
   */
  protected _activateFilePicker(button: HTMLElement): void;

  /**
   * @param options - (default: `{}`)
   * @override
   */
  close(options?: FormApplication.CloseOptions): Promise<void>;

  /**
   * Submit the contents of a Form Application, processing its content as defined by the Application
   * @param options - Options passed to the _onSubmit event handler
   *                  (default: `{}`)
   * @returns Return a self-reference for convenient method chaining
   */
  submit(options?: FormApplication.OnSubmitOptions): Promise<this>;

  /**
   * @deprecated since 0.7.2
   * @see {@link FormDataExtended}
   */
  static processForm(formElement: HTMLFormElement): FormDataExtended;

  /**
   * @deprecated since 0.7.3
   * @see {@link FormApplication#activateEditor}
   */
  protected _createEditor(name: string, options?: TextEditor.Options, initialContent?: string): void;
}

/**
 * @deprecated since 0.7.0
 * @see {@link FormApplication.processForm}
 */
declare function validateForm(formElement: HTMLFormElement): FormDataExtended;

declare namespace FormApplication {
  interface CloseOptions extends Application.CloseOptions {
    submit?: boolean;
  }

  /**
   * @typeParam O - the type of the object
   * @typeParam P - the type of the options object
   */
  interface Data<O, P extends FormApplication.Options = FormApplication.Options> {
    object: foundry.utils.Duplicated<O>;
    options: P;
    title: string;
  }

  interface FormApplicationEditor {
    active: boolean;
    activate: boolean;
    button: HTMLElement;
    changed: boolean;
    hasButton: boolean;
    initial: string;
    mce: Editor | null;
    options: TextEditor.Options;
    target: string;
  }

  interface OnSubmitOptions {
    /**
     * Override the standard behavior of whether to close
     * the form on submit
     * @defaultValue `false`
     */
    preventClose?: boolean;

    /**
     * Prevent the application from re-rendering as a
     * result of form submission
     * @defaultValue `false`
     */
    preventRender?: boolean;

    /**
     * Additional specific data keys/values which override or extend the contents
     * of the parsed form. This can be used to update other flags or data fields
     * at the same time as processing a form submission to avoid multiple database
     * operations.
     * @defaultValue `null`
     */
    updateData?: object;
  }

  interface Options extends Application.Options {
    /**
     * @defaultValue `['form']`
     */
    classes: string[];

    /**
     * Whether to automatically close the application when it's contained
     * form is submitted. Default is true.
     */
    closeOnSubmit: boolean;

    /**
     * Whether to automatically submit the contained HTML form when an input
     * or select element is changed. Default is false.
     */
    submitOnChange: boolean;

    /**
     * Whether to automatically submit the contained HTML form when the
     * application window is manually closed. Default is false.
     */
    submitOnClose: boolean;

    /**
     * Whether the application form is editable - if true, it's fields will
     * be unlocked and the form can be submitted. If false, all form fields
     * will be disabled and the form cannot be submitted. Default is true.
     */
    editable: boolean;
  }
}
