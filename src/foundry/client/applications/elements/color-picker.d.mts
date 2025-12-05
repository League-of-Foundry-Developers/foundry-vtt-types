import type { FormInputConfig } from "../forms/fields.d.mts";
import type AbstractFormInputElement from "./form-element.d.mts";

/**
 * A custom HTMLElement used to select a color using a linked pair of input fields.
 * @privateRemarks The constructor's fallback for `value` is `this.getAttribute("value")`, which will be `null` if there's no value provided
 * at construction/{@link HTMLColorPickerElement.create | creation}/in the markup, so we must include `null` in the value type param. It has
 * been exposed in case user subclasses want to improve this situation.
 */
declare class HTMLColorPickerElement<
  FormInputValueType extends string | null = string | null,
> extends AbstractFormInputElement<FormInputValueType> {
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

  /**
   * @deprecated This was removed without replacement at some point after v12 became stable but before v13.
   * This warning will be removed in v14.
   */
  protected override _onClick(event: never): never;

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
