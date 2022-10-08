import type { EditorView } from "prosemirror-view";
import type { Editor } from "tinymce";
import type { ProseMirrorKeyMaps, ProseMirrorMenu } from "../../prosemirror/prosemirror.mjs";

declare global {
  interface FormApplicationOptions extends ApplicationOptions {
    /**
     * Whether to automatically close the application when it's contained
     * form is submitted.
     * @defaultValue `true`
     */
    closeOnSubmit: boolean;

    /**
     * Whether to automatically submit the contained HTML form when an input
     * or select element is changed.
     * @defaultValue `false`
     */
    submitOnChange: boolean;

    /**
     * Whether to automatically submit the contained HTML form when the
     * application window is manually closed.
     * @defaultValue `false`
     */
    submitOnClose: boolean;

    /**
     * Whether the application form is editable - if true, it's fields will
     * be unlocked and the form can be submitted. If false, all form fields
     * will be disabled and the form cannot be submitted.
     * @defaultValue `true`
     */
    editable: boolean;

    /**
     * Support configuration of the sheet type used for this application.
     * @defaultValue `false`
     */
    sheetConfig: boolean;
  }

  /**
   * An abstract pattern for defining an Application responsible for updating some object using an HTML form
   *
   * A few critical assumptions:
   * 1) This application is used to only edit one object at a time
   * 2) The template used contains one (and only one) HTML form as it's outer-most element
   * 3) This abstract layer has no knowledge of what is being updated, so the implementation must define _updateObject
   *
   * @typeParam Options        - the type of the options object
   * @typeParam ConcreteObject - the type of the object or {@link foundry.abstract.Document} which is modified by this form
   */
  abstract class FormApplication<
    Options extends FormApplicationOptions = FormApplicationOptions,
    ConcreteObject = unknown
  > extends Application<Options> {
    /**
     * @param object  - Some object or entity which is the target to be updated.
     * @param options - Additional options which modify the rendering of the sheet.
     *                  (default: `{}`)
     * @remarks Foundry allows passing no value to the constructor at all.
     */
    constructor(object: ConcreteObject, options?: Partial<Options>);
    constructor(
      ...args: ConcreteObject extends undefined
        ? [ConcreteObject?, Partial<Options>?]
        : [ConcreteObject, Partial<Options>?]
    );

    /**
     * The object target which we are using this form to modify
     */
    object: ConcreteObject;

    /**
     * A convenience reference to the form HTLMElement
     * @defaultValue `null`
     */
    form: HTMLElement | null;

    /**
     * Keep track of any FilePicker instances which are associated with this form
     * The values of this Array are inner-objects with references to the FilePicker instances and other metadata
     * @defaultValue `[]`
     */
    filepickers: FilePicker[];

    /**
     * Keep track of any mce editors which may be active as part of this form
     * The values of this Array are inner-objects with references to the MCE editor and other metadata
     * @defaultValue `{}`
     */
    editors: Record<string, FormApplication.FormApplicationEditor>;

    /**
     * Assign the default options which are supported by the entity edit sheet.
     * @returns The default options for this FormApplication class
     * @see {@link Application.defaultOptions}
     * @defaultValue
     * ```typescript
     * foundry.utils.mergeObject(super.defaultOptions, {
     *   classes: ["form"],
     *   closeOnSubmit: true,
     *   editable: true,
     *   sheetConfig: false,
     *   submitOnChange: false,
     *   submitOnClose: false
     * });
     * ```
     */
    static override get defaultOptions(): FormApplicationOptions;

    /**
     * Is the Form Application currently editable?
     */
    get isEditable(): boolean;

    /**
     * @param options - (default: `{}`)
     */
    override getData(options?: Partial<Options>): MaybePromise<object>;

    protected override _render(force?: boolean, options?: Application.RenderOptions<Options>): Promise<void>;

    protected override _renderInner(data: object): Promise<JQuery>;

    protected override _activateCoreListeners(html: JQuery): void;

    override activateListeners(html: JQuery): void;

    /**
     * If the form is not editable, disable its input fields
     * @param form - The form HTML
     */
    protected _disableFields(form: HTMLElement): void;

    /**
     * Handle standard form submission steps
     * @param event         - The submit event which triggered this handler
     * @param updateData    - Additional specific data keys/values which override or extend the contents of
     *                        the parsed form. This can be used to update other flags or data fields at the
     *                        same time as processing a form submission to avoid multiple database operations.
     *                        (default: `null`)
     * @param preventClose  - Override the standard behavior of whether to close the form on submit
     *                        (default: `false`)
     * @param preventRender - Prevent the application from re-rendering as a result of form submission
     *                        (default: `false`)
     * @returns A promise which resolves to the validated update data
     */
    protected _onSubmit(
      event: Event,
      { updateData, preventClose, preventRender }?: FormApplication.OnSubmitOptions
    ): Promise<Partial<Record<string, unknown>>>;

    /**
     * Get an object of update data used to update the form's target object
     * @param updateData - Additional data that should be merged with the form data
     *                     (default: `{}`)
     * @returns The prepared update data
     */
    // TODO: Maybe we can calculate how the flattened `updateData` looks like, then it would be Partial<Record<string, unknown>> & Flattened<T>
    protected _getSubmitData(updateData?: object | null): Record<string, unknown>;

    /**
     * Handle changes to an input element, submitting the form if options.submitOnChange is true.
     * Do not preventDefault in this handler as other interactions on the form may also be occurring.
     * @param event - The initial change event
     */
    protected _onChangeInput(event: JQuery.ChangeEvent): void;

    /**
     * Handle the change of a color picker input which enters it's chosen value into a related input field
     * @param event - The color picker change event
     */
    protected _onChangeColorPicker(event: JQuery.ChangeEvent): void;

    /**
     * Handle changes to a range type input by propagating those changes to the sibling range-value element
     * @param event - The initial change event
     */
    protected _onChangeRange(event: JQuery.ChangeEvent): void;

    /**
     * Additional handling which should trigger when a FilePicker contained within this FormApplication is submitted.
     * @param selection  - The target path which was selected
     * @param filePicker - The FilePicker instance which was submitted
     */
    protected _onSelectFile(selection: string, filePicker: FilePicker): void;

    /**
     * This method is called upon form submission after form data is validated
     * @param event    - The initial triggering submission event
     * @param formData - The object of validated form data with which to update the object
     * @returns A Promise which resolves once the update operation has completed
     */
    protected abstract _updateObject(event: Event, formData?: object): Promise<unknown>;

    /**
     * Activate a named TinyMCE text editor
     * @param name           - The named data field which the editor modifies.
     * @param options        - Editor initialization options passed to {@link TextEditor.create}.
     *                         (default: `{}`)
     * @param initialContent - Initial text content for the editor area.
     *                         (default: `""`)
     */
    activateEditor(
      name: string,
      options?: TextEditor.Options,
      initialContent?: string
    ): Promise<tinyMCE.Editor | EditorView>;

    /**
     * Handle saving the content of a specific editor by name
     * @param name   - The named editor to save
     * @param remove - Remove the editor after saving its content
     *                 (default: `true`)
     */
    saveEditor(name: string, { remove }?: { remove?: boolean }): Promise<void>;

    /**
     * Activate an editor instance present within the form
     * @param div - The element which contains the editor
     */
    protected _activateEditor(div: HTMLElement): void;

    /**
     * Configure ProseMirror plugins for this sheet.
     * @param name    - The name of the editor.
     * @param options - Additional options to configure the plugins.
     */
    protected _configureProseMirrorPlugins(
      name: string,
      options: {
        /** Whether the editor should destroy itself on save. */
        remove: boolean;
      }
    ): {
      menu: ReturnType<typeof ProseMirrorMenu["build"]>;
      keyMaps: ReturnType<typeof ProseMirrorKeyMaps["build"]>;
    };

    /**
     * Activate a FilePicker instance present within the form
     * @param event - The mouse click event on a file picker activation button
     */
    protected _activateFilePicker(event: PointerEvent): void;

    /**
     * Determine the configuration options used to initialize a FilePicker instance within this FormApplication.
     * Subclasses can extend this method to customize the behavior of pickers within their form.
     * @param event - The initiating mouse click event which opens the picker
     * @returns Options passed to the FilePicker constructor
     */
    protected _getFilePickerOptions(event: PointerEvent): FilePickerOptions;

    /**
     * @param options - (default: `{}`)
     */
    override close(options?: FormApplication.CloseOptions): Promise<void>;

    /**
     * Submit the contents of a Form Application, processing its content as defined by the Application
     * @param options - Options passed to the _onSubmit event handler
     *                  (default: `{}`)
     * @returns Return a self-reference for convenient method chaining
     */
    submit(options?: FormApplication.OnSubmitOptions): Promise<this> | void;
  }

  namespace FormApplication {
    interface CloseOptions extends Application.CloseOptions {
      submit?: boolean;
    }

    interface FormApplicationEditor {
      target: string;
      button: HTMLElement;
      hasButton: boolean;
      instance: Awaited<ReturnType<typeof TextEditor["create"]>> | null;
      mce: Awaited<ReturnType<typeof TextEditor["create"]>> | null;
      active: boolean;
      changed: boolean;
      options: TextEditor.Options;
      initial: string;
    }

    interface OnSubmitOptions {
      /**
       * Additional specific data keys/values which override or extend the contents of
       * the parsed form. This can be used to update other flags or data fields at the
       * same time as processing a form submission to avoid multiple database operations.
       * @defaultValue `null`
       */
      updateData?: object;

      /**
       * Override the standard behavior of whether to close the form on submit
       * @defaultValue `false`
       */
      preventClose?: boolean;

      /**
       * Prevent the application from re-rendering as a result of form submission
       * @defaultValue `false`
       */
      preventRender?: boolean;
    }
  }

  interface DocumentSheetOptions<
    ConcreteDocument extends foundry.abstract.Document<any, any> = foundry.abstract.Document<any, any>
  > extends FormApplicationOptions {
    /**
     * The default permissions required to view this Document sheet.
     * @defaultValue {@link CONST.DOCUMENT_OWNERSHIP_LEVELS.LIMITED}
     */
    viewPermission: foundry.CONST.DOCUMENT_OWNERSHIP_LEVELS;

    /** An array of {@link HTMLSecret} configuration objects. */
    secrets: HTMLSecretConfiguration<ConcreteDocument>[];
  }

  /**
   * Extend the FormApplication pattern to incorporate specific logic for viewing or editing Document instances.
   * See the FormApplication documentation for more complete description of this interface.
   *
   * @typeParam Options          - the type of the options object
   * @typeParam ConcreteDocument - the type of the Document which should be managed by this form sheet
   */
  abstract class DocumentSheet<
    Options extends DocumentSheetOptions<ConcreteDocument>,
    ConcreteDocument extends foundry.abstract.Document<any, any> = foundry.abstract.Document<any, any>
  > extends FormApplication<Options, ConcreteDocument> {
    /**
     * @param object  - A Document instance which should be managed by this form.
     *                  (default: `{}`)
     * @param options - Optional configuration parameters for how the form behaves.
     *                  (default: `{}`)
     */
    constructor(object?: ConcreteDocument, options?: Partial<Options>);

    /** The list of handlers for secret block functionality. */
    protected _secrets: HTMLSecret<ConcreteDocument>[];

    /**
     * @defaultValue
     * ```typescript
     * foundry.utils.mergeObject(super.defaultOptions, {
     *   classes: ["sheet"],
     *   template: `templates/sheets/${this.name.toLowerCase()}.html`,
     *   viewPermission: CONST.DOCUMENT_OWNERSHIP_LEVELS.LIMITED,
     *   sheetConfig: true,
     *   secrets: []
     * });
     * ```
     */
    static get defaultOptions(): DocumentSheetOptions;

    /**
     * A semantic convenience reference to the Document instance which is the target object for this form.
     */
    get document(): ConcreteDocument;

    override get id(): string;

    override get isEditable(): boolean;

    override get title(): string;

    override close(options?: FormApplication.CloseOptions): Promise<void>;

    override getData(options?: Partial<Options>): MaybePromise<object>;

    protected override _activateCoreListeners(html: JQuery<HTMLElement>): void;

    override activateEditor(
      name: string,
      options?: TextEditor.Options | undefined,
      initialContent?: string | undefined
    ): Promise<Editor | EditorView>;

    override render(force?: boolean, options?: Application.RenderOptions<Options>): this;

    protected override _renderOuter(): Promise<JQuery<HTMLElement>>;

    /**
     * Create an ID link button in the document sheet header which displays the document ID and copies to clipboard
     */
    protected _createDocumentIdLink(html: JQuery<HTMLElement>): void;

    /**
     * Test whether a certain User has permission to view this Document Sheet.
     * @param user - The user requesting to render the sheet
     * @returns Does the User have permission to view this sheet?
     */
    protected _canUserView(user: User): boolean;

    /**
     * Create objects for managing the functionality of secret blocks within this Document's content.
     */
    protected _createSecretHandlers(): HTMLSecret[];

    protected override _getHeaderButtons(): Application.HeaderButton[];

    /**
     * Get the HTML content that a given secret block is embedded in.
     * @param secret - The secret block.
     */
    protected _getSecretContent(secret: HTMLElement): string;

    /**
     * Update the HTML content that a given secret block is embedded in.
     * @param secret  - The secret block.
     * @param content - The new content.
     * @returns The updated Document.
     */
    protected _updateSecret(secret: HTMLElement, content: string): Promise<ConcreteDocument | void>;

    /**
     * Handle requests to configure the default sheet used by this Document
     * @internal
     */
    protected _onConfigureSheet(event: JQuery.ClickEvent): void;

    protected override _updateObject(event: Event, formData: object): Promise<unknown>;
  }
}
