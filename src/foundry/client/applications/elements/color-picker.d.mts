import type { FormInputConfig } from "../forms/fields.d.mts";
import type AbstractFormInputElement from "./form-element.d.mts";

/**
 * A custom HTMLElement used to select a color using a linked pair of input fields.
 * @privateRemarks The constructor's fallback value is `this.getAttribute("value")`, which will be `null` if there's no value provided at
 * construction/{@link HTMLColorPickerElement.create | creation}, in the latter case despite `.create` calling
 * `setAttribute("value", config.value ?? "")`, since this happens after construction
 */
declare class HTMLColorPickerElement extends AbstractFormInputElement<string | null> {
  /**
   * @remarks This constructor is protected because additional work must be done after creation for this element to be valid in the DOM.
   * Use {@linkcode HTMLColorPickerElement.create} instead.
   */
  protected constructor(options?: HTMLColorPickerElement.Options);

  /** @defaultValue `"color-picker"` */
  static override tagName: string;

  /**
   * @remarks Returns `[colorString: HTMLInputElement, colorSelector: HTMLInputElement]` in {@linkcode HTMLColorPickerElement}
   * @privateRemarks Return type left wide for ease of subclassing
   */
  protected override _buildElements(): HTMLElement[];

  protected override _refresh(): void;

  protected override _activateListeners(): void;

  protected override _toggleDisabled(disabled: boolean): void;

  /**
   * Create a HTMLColorPickerElement using provided configuration data.
   */
  static create(config: HTMLColorPickerElement.Config): HTMLColorPickerElement;

  #HTMLColorPickerElement: true;
}

declare namespace HTMLColorPickerElement {
  interface Options {
    /** A hexadecimal string representation of the color. */
    value: string;
  }

  interface Config extends FormInputConfig<string> {}
}

export default HTMLColorPickerElement;
