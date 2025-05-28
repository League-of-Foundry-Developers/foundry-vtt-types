import type { FormInputConfig } from "../forms/fields.d.mts";
import type AbstractFormInputElement from "./form-element.d.mts";

/**
 * A custom HTML element responsible for rendering a file input field and associated FilePicker button.
 */
declare class HTMLFilePickerElement extends AbstractFormInputElement<string> {
  constructor();

  static override tagName: "file-picker";

  /**
   * The file path selected.
   */
  input: HTMLInputElement;

  /**
   * A button to open the file picker interface.
   */
  button: HTMLButtonElement;

  /**
   * A reference to the FilePicker application instance originated by this element.
   */
  picker: FilePicker;

  /**
   * A type of file which can be selected in this field.
   * @see {@linkcode FilePicker.FILE_TYPES}
   */
  get type(): FilePicker.Type;
  set type(value: FilePicker.Type);

  /**
   * Prevent uploading new files as part of this element's FilePicker dialog.
   */
  get noupload(): boolean;
  set noupload(value: boolean);

  protected override _buildElements(): (HTMLInputElement | HTMLButtonElement)[];

  protected override _toggleDisabled(disabled: boolean): void;

  protected override _activateListeners(): void;

  protected override _onClick(event: PointerEvent): void;

  /**
   * Create a HTMLFilePickerElement using provided configuration data.
   */
  static create(config: HTMLFilePickerElement.FilePickerInputConfig): HTMLElement;
}

declare namespace HTMLFilePickerElement {
  interface FilePickerInputConfig extends FormInputConfig<string> {
    type?: FilePicker.Type;
    placeholder?: string;
    noupload?: boolean;
  }
}

export default HTMLFilePickerElement;
