import type { FormInputConfig } from "../forms/fields.d.mts";
import type AbstractFormInputElement from "./form-element.d.mts";
import type FilePicker from "../apps/file-picker.d.mts";
import type { InexactPartial } from "#utils";

/**
 * A custom HTML element responsible for rendering a file input field and associated FilePicker button.
 * @privateRemarks This element's value type has `| undefined` in it because it both has no real constructor implementation (where it might
 * have set a fallback), and fails to set value in `.create` beyond a `setAttribute` call, so until it is in the DOM, its value will be
 * `undefined`. It has been exposed in case user subclasses want to improve this situation.
 */
declare class HTMLFilePickerElement<
  FormInputValueType extends string | undefined = string | undefined,
> extends AbstractFormInputElement<FormInputValueType> {
  /**
   * @remarks This constructor is protected because additional work must be done after creation for this element to be valid in the DOM.
   * Use {@linkcode HTMLFilePickerElement.create} instead.
   */
  protected constructor();

  /** @defaultValue `"file-picker"` */
  static override tagName: string;

  /**
   * The file path selected.
   * @remarks `undefined` only prior to entering the DOM.
   */
  input: HTMLInputElement | undefined;

  /**
   * A button to open the file picker interface.
   * @remarks `undefined` only prior to entering the DOM.
   */
  button: HTMLButtonElement | undefined;

  /**
   * A reference to the FilePicker application instance originated by this element.
   * @remarks `undefined` until the {@linkcode HTMLFilePickerElement.button | #button} is clicked
   */
  picker: FilePicker | undefined;

  /**
   * A type of file which can be selected in this field.
   * @see {@linkcode FilePicker.FILE_TYPES}
   */
  get type(): FilePicker.Type;

  set type(value);

  /**
   * Prevent uploading new files as part of this element's FilePicker dialog.
   */
  get noupload(): boolean;

  set noupload(value);

  /**
   * @remarks Returns `[HTMLInputElement, HTMLButtonElement]` in `HTMLFilePickerElement`.
   * @privateRemarks Return type left wide for ease of subclassing.
   */
  protected override _buildElements(): HTMLElement[];

  protected override _refresh(): void;

  protected override _toggleDisabled(disabled: boolean): void;

  protected override _activateListeners(): void;

  /**
   * Create a HTMLFilePickerElement using provided configuration data.
   */
  static create(config: HTMLFilePickerElement.Config): HTMLFilePickerElement;

  /**
   * @deprecated This was removed without replacement at some point after v12 became stable but before v13.
   * This warning will be removed in v14.
   */
  protected override _onClick(event: never): never;

  #HTMLFilePickerElement: true;
}

declare namespace HTMLFilePickerElement {
  interface _Config {
    /**
     * Prevent uploading new files as part of this element's FilePicker dialog.
     * @defaultValue `false`
     * @remarks Has no parameter default, the default is provided by the {@linkcode HTMLFilePickerElement.noupload | #noupload}
     * getter checking for `=== true`.
     */
    noupload: boolean;
  }

  interface Config extends InexactPartial<_Config>, FormInputConfig<string> {
    /** @remarks The type of file this picker is limited to. */
    type: FilePicker.Type;
  }

  /**
   * @deprecated This interface has been renamed for consistency with other elements.
   * Use {@linkcode HTMLFilePickerElement.Config} instead. This alias will be removed in v15.
   */
  type FilePickerInputConfig = Config;
}

export default HTMLFilePickerElement;
