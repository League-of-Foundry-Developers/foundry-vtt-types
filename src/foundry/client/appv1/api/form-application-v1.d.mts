import type { EditorView } from "prosemirror-view";
import type { AnyObject, GetDataReturnType, MaybePromise, Identity } from "#utils";
import type { ProseMirrorKeyMaps, ProseMirrorMenu } from "#common/prosemirror/_module.d.mts";
import type Application from "./application-v1.d.mts";
import type TextEditor from "#client/applications/ux/text-editor.mjs";
import type FilePicker from "#client/applications/apps/file-picker.mjs";

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationConfig {
      FormApplication: FormApplication.Any;
    }
  }
}

/**
 * An abstract pattern for defining an Application responsible for updating some object using an HTML form
 *
 * A few critical assumptions:
 * 1) This application is used to only edit one object at a time
 * 2) The template used contains one (and only one) HTML form as it's outer-most element
 * 3) This abstract layer has no knowledge of what is being updated, so the implementation must define _updateObject
 *
 * @template Options        - the type of the options object
 * @template ConcreteObject - while this is called object this can actually be any arbitrary value.
 * For example `ImagePopout` sets this to a string. This is still typically a
 * {@linkcode Document} instance or an object in general which is modified by this form
 */
declare abstract class FormApplication<
  ConcreteObject = unknown,
  Options extends FormApplication.Options = FormApplication.Options,
> extends Application<Options> {
  /**
   * @param object  - Some object or entity which is the target to be updated.
   *                  (default: `{}`)
   *
   * @param options - Additional options which modify the rendering of the sheet.
   *                  (default: `{}`)
   * @remarks Foundry allows passing no value to the constructor at all.
   */
  constructor(...args: FormApplication.ConstructorArguments<ConcreteObject, Options>);

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
   * Keep track of any mce editors which may be active as part of this form
   * The values of this Array are inner-objects with references to the MCE editor and other metadata
   * @defaultValue `{}`
   */
  editors: Record<string, FormApplication.FormApplicationEditor>;

  /**
   * An array of custom element tag names that should be listened to for changes.
   */
  protected static _customElements: string[];

  /**
   * Assign the default options which are supported by the entity edit sheet.
   * @returns The default options for this FormApplication class
   * @see {@linkcode Application.defaultOptions}
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
  static override get defaultOptions(): FormApplication.Options;

  /**
   * Is the Form Application currently editable?
   */
  get isEditable(): boolean;

  /**
   * @param options - (default: `{}`)
   */
  override getData(
    options?: Partial<Options>,
  ): MaybePromise<GetDataReturnType<FormApplication.FormApplicationData<Options, ConcreteObject>>>;

  protected override _render(force?: boolean, options?: Application.RenderOptions<Options>): Promise<void>;

  protected override _renderInner(data: ReturnType<this["getData"]>): Promise<JQuery>;

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
    { updateData, preventClose, preventRender }?: FormApplication.OnSubmitOptions,
  ): Promise<Partial<AnyObject>>;

  /**
   * Get an object of update data used to update the form's target object
   * @param updateData - Additional data that should be merged with the form data
   *                     (default: `{}`)
   * @returns The prepared update data
   */
  // TODO: Maybe we can calculate how the flattened `updateData` looks like, then it would be Partial<Record<string, unknown>> & Flattened<T>
  protected _getSubmitData(updateData?: AnyObject | null): AnyObject;

  /**
   * Handle changes to an input element, submitting the form if options.submitOnChange is true.
   * Do not preventDefault in this handler as other interactions on the form may also be occurring.
   * @param event - The initial change event
   */
  protected _onChangeInput(event: JQuery.ChangeEvent): Promise<void | object>;

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
   * This method is called upon form submission after form data is validated
   * @param event    - The initial triggering submission event
   * @param formData - The object of validated form data with which to update the object
   * @returns A Promise which resolves once the update operation has completed
   */
  protected abstract _updateObject(event: Event, formData?: object): Promise<unknown>;

  /**
   * Activate a named TinyMCE text editor
   * @param name           - The named data field which the editor modifies.
   * @param options        - Editor initialization options passed to {@linkcode TextEditor.create}.
   *                         (default: `{}`)
   * @param initialContent - Initial text content for the editor area.
   *                         (default: `""`)
   */
  activateEditor(
    name: string,
    options?: TextEditor.Options,
    initialContent?: string,
  ): Promise<tinyMCE.Editor | EditorView>;

  /**
   * Handle saving the content of a specific editor by name
   * @param name - The named editor to save
   */
  saveEditor(name: string, options?: FormApplication.SaveEditorOptions): Promise<void>;

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
    },
  ): {
    menu: ReturnType<(typeof ProseMirrorMenu)["build"]>;
    keyMaps: ReturnType<(typeof ProseMirrorKeyMaps)["build"]>;
  };

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
  submit(options?: FormApplication.OnSubmitOptions): Promise<this>;

  /**
   * @deprecated since v12, will be removed in v14
   */
  get filepickers(): FilePicker[];

  /**
   * @deprecated since v12, will be removed in v14
   */
  protected _activateFilePicker(event: PointerEvent): void;

  /**
   * @deprecated since v12, will be removed in v14
   */
  protected _getFilePickerOptions(event: PointerEvent): FilePicker.Configuration;

  /**
   * @deprecated since v12, will be removed in v14
   */
  protected _onSelectFile(selection: string, filePicker: FilePicker): void;
}

declare namespace FormApplication {
  interface Any extends AnyFormApplication {}
  interface AnyConstructor extends Identity<typeof AnyFormApplication> {}

  type ConstructorArguments<ConcreteObject, Options extends FormApplication.Options> =
    // Note(LukeAbby): Uses a strict equality test to avoid `object` and `{}` counting as the same.
    // See {@linkcode HandleEmptyObject} for more information.
    (<T>() => T extends FormApplication.NoObject ? 1 : 0) extends <T>() => T extends ConcreteObject ? 1 : 0
      ? [object?: ConcreteObject, options?: Partial<Options>]
      : undefined extends ConcreteObject
        ? [object?: ConcreteObject, options?: Partial<Options>]
        : [object: ConcreteObject, options?: Partial<Options>];

  /**
   * The type for when a form application has no object. Equivalent to `{}` but more semantically appropriate.
   */
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions, @typescript-eslint/no-empty-object-type
  type NoObject = {};

  interface Options extends Application.Options {
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

  interface CloseOptions extends Application.CloseOptions {
    submit?: boolean;
  }

  interface FormApplicationEditor {
    target: string;
    button: HTMLElement;
    hasButton: boolean;
    instance: tinyMCE.Editor | null;
    mce: tinyMCE.Editor | null;
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
    updateData?: AnyObject | null | undefined;

    /**
     * Override the standard behavior of whether to close the form on submit
     * @defaultValue `false`
     */
    preventClose?: boolean | undefined;

    /**
     * Prevent the application from re-rendering as a result of form submission
     * @defaultValue `false`
     */
    preventRender?: boolean | undefined;
  }

  interface FormApplicationData<
    Options extends FormApplication.Options = FormApplication.Options,
    ConcreteObject = unknown,
  > {
    object: ConcreteObject;
    options: Options;
    title: string;
  }

  interface SaveEditorOptions {
    /**
     * Remove the editor after saving its content
     * @defaultValue `true`
     */
    remove?: boolean | undefined;

    /**
     * Prevent normal re-rendering of the sheet after saving.
     */
    preventRender?: boolean | undefined;
  }
}

declare abstract class AnyFormApplication extends FormApplication<any, any> {
  constructor(...args: never);
}

export default FormApplication;
