/**
 * An abstract pattern for defining an Application responsible for updating some
 * object using an HTML form
 *
 * A few critical assumptions:
 * 1) This application is used to only edit one object at a time
 * 2) The template used contains one (and only one) HTML form as it's outer-most
 *    element
 * 3) This abstract layer has no knowledge of what is being updated, so the
 *    implementation must define _updateObject
 * @typeParam T - the type of the data used to render the inner template
 * @typeParam O - the type of the object target which we are using this form to
 *                modify
 */
declare abstract class FormApplication
<T = object, O = object> extends Application<T> {
  /**
   * Keep track of any mce editors which may be active as part of this form
   * The values of this Array are inner-objects with references to the MCE
   * editor and other metadata
   */
  editors: Array<Record<string, FormApplication.Editor>>

  /**
   * Keep track of any FilePicker instances which are associated with this form
   * The values of this Array are inner-objects with references to the
   * FilePicker instances and other metadata
   */
  filepickers: FilePicker[]

  /**
   * A convenience reference to the form HTLMElement
   */
  form: HTMLElement

  /**
   * The object target which we are using this form to modify
   */
  object: O

  options: FormApplication.Options

  /**
   * @param object - Some object or entity which is the target to be updated.
   *                 (default: `{}`)
   * @param options - Additional options which modify the rendering of the
   *                  sheet.
   *                  (default: `{}`)
   */
  constructor (object?: O, options?: FormApplication.Options)

  /**
   * Assign the default options which are supported by the entity edit sheet.
   * @returns The default options for this FormApplication class
   * @override
   * @see {@link Application.defaultOptions}
   */
  static get defaultOptions (): FormApplication.Options

  /**
   * Is the Form Application currently editable?
   */
  get isEditable (): boolean

  /**
   * @deprecated since 0.7.2
   * @see {@link FormDataExtended}
   */
  static processForm (formElement: HTMLFormElement): FormDataExtended

  /**
   * Activate a TinyMCE editor instance present within the form
   * @internal
   */
  _activateEditor (div: HTMLElement): void

  /**
   * Activate a FilePicker instance present within the form
   * @internal
   */
  _activateFilePicker (button: HTMLElement): void

  /**
   * @deprecated since 0.7.3
   * @see {@link FormApplication#activateEditor}
   */
  _createEditor (
    name: string,
    options?: TextEditor.Options,
    initialContent?: string
  ): void

  /**
   * If the form is not editable, disable its input fields
   * @internal
   */
  _disableFields (form: HTMLElement): void

  /**
   * Get an object of update data used to update the form's target object
   * @param updateData - Additional data that should be merged with the form
   *                     data
   *                     (default: `{}`)
   * @returns The prepared update data
   * @internal
   */
  // TODO: update the types here once FormDataExtended is updated
  _getSubmitData<T> (updateData: Partial<T>): T

  /**
   * Handle the change of a color picker input which enters it's chosen value
   * into a related input field
   * @internal
   */
  _onChangeColorPicker (event: Event): void

  /**
   * Handle changes to an input element, submitting the form if
   * options.submitOnChange is true.
   * Do not preventDefault in this handler as other interactions on the form may
   * also be occurring.
   * @param event - The initial change event
   * @internal
   */
  _onChangeInput (event: Event): object

  /**
   * Handle changes to a range type input by propagating those changes to the
   * sibling range-value element
   * @param event - The initial change event
   * @internal
   */
  _onChangeRange (event: Event): void

  /**
   * Handle standard form submission steps
   * @param event - The submit event which triggered this handler
   * @param options - (default: `{}`)
   * @returns A promise which resolves to the validated update data
   * @internal
   */
  // TODO: update the types here once FormDataExtended is updated
  _onSubmit (
    event: Event,
    options?: FormApplication.OnSubmitOptions
  ): Promise<object>

  /**
   * @override
   */
  _render (force?: boolean, options?: Application.RenderOptions): Promise<void>

  /**
   * @param options - (unused)
   * @override
   */
  _renderInner (data: T, options?: any): Promise<JQuery>

  /**
   * Activate a named TinyMCE text editor
   * @param name - The named data field which the editor modifies.
   * @param options - TinyMCE initialization options passed to TextEditor.create
   *                  (default: `{}`)
   * @param initialContent - Initial text content for the editor area.
   *                         (default: `''`)
   */
  activateEditor (
    name: string,
    options?: TextEditor.Options,
    initialContent?: string
  ): void

  /**
   * Activate the default set of listeners for the Entity sheet
   * These listeners handle basic stuff like form submission or updating images
   * @param html - The rendered template ready to have listeners attached
   * @override
   */
  activateListeners (html: JQuery): void

  /**
   * @param options - (default: `{}`)
   * @override
   */
  close (options?: FormApplication.CloseOptions): Promise<void>

  /**
   * @param options - (unused) (default: `{}`)
   * @override
   */
  getData (options?: any): FormApplication.Data<O>

  /**
   * Handle saving the content of a specific editor by name
   * @param name - The named editor to save
   * @param options - (default: `{}`)
   * @param remove - Remove the editor after saving its content
   *                 (default: `true`)
   */
  saveEditor (name: string, options?: { remove?: boolean }): Promise<void>

  /**
   * Submit the contents of a Form Application, processing its content as
   * defined by the Application
   * @param options - Options passed to the _onSubmit event handler
   *                  (default: `{}`)
   * @returns Return a self-reference for convenient method chaining
   */
  submit (options?: FormApplication.OnSubmitOptions): Promise<this>

  /**
   * This method is called upon form submission after form data is validated
   * @param event - The initial triggering submission event
   *                (unused)
   * @param formData - The object of validated form data with which to update
   *                   the object
   *                   (unused)
   * @returns A Promise which resolves once the update operation has completed
   */
  abstract _updateObject (event?: any, formData?: object): void
}

declare namespace FormApplication {
  interface CloseOptions extends Application.CloseOptions {
    submit?: boolean
  }

  interface Data<O> {
    object: O
    options: FormApplication.Options
    title: string
  }

  interface Editor {
    activate: boolean
    button: HTMLElement
    changed: boolean
    hasButton: boolean
    initial: string
    mce: Editor
    options: TextEditor.Options
    target: string
  }

  interface OnSubmitOptions {
    /**
     * Override the standard behavior of whether to close
     * the form on submit
     * @defaultValue `false`
     */
    preventClose?: boolean

    /**
     * Prevent the application from re-rendering as a
     * result of form submission
     * @defaultValue `false`
     */
    preventRender?: boolean

    /**
     * Additional specific data keys/values which override or extend the contents
     * of the parsed form. This can be used to update other flags or data fields
     * at the same time as processing a form submission to avoid multiple database
     * operations.
     * @defaultValue `null`
     */
    updateData?: object
  }

  interface Options extends Application.Options {
    /**
     * @defaultValue `['form']`
     */
    classes?: string[]

    /**
     * Whether to automatically close the application when it's contained
     * form is submitted. Default is true.
     */
    closeOnSubmit?: boolean

    /**
     * Whether the application form is editable - if true, it's fields will
     * be unlocked and the form can be submitted. If false, all form fields
     * will be disabled and the form cannot be submitted. Default is true.
     */
    editable?: boolean

    /**
     * Whether to automatically submit the contained HTML form when an input
     * or select element is changed. Default is false.
     */
    submitOnChange?: boolean

    /**
     * Whether to automatically submit the contained HTML form when the
     * application window is manually closed. Default is false.
     */
    submitOnClose?: boolean
  }
}
