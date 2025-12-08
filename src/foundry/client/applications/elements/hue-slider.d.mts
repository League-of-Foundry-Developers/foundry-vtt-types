import type AbstractFormInputElement from "./form-element.d.mts";
import type { FormInputConfig } from "../forms/fields.d.mts";

/**
 * A class designed to standardize the behavior for a hue selector UI component.
 * @privateRemarks This element's value type would have `| undefined` in it, if we weren't enforcing passing `value` to `.create` and making
 * the constructor protected.
 */
declare class HTMLHueSelectorSlider extends AbstractFormInputElement<number> {
  /**
   * @remarks This constructor is protected because additional work must be done after creation for this element to be valid in the DOM.
   * Use {@linkcode HTMLHueSelectorSlider.create} instead.
   */
  protected constructor();

  /** @defaultValue `"hue-slider"` */
  static override tagName: string;

  /**
   * @remarks Returns `[input: HTMLInputElement]` in {@linkcode HTMLHueSelectorSlider}.
   * @privateRemarks Return type left wide for ease of subclassing.
   */
  protected override _buildElements(): HTMLElement[];

  // JSDoc identical to super has been omitted here
  protected override _refresh(): void;

  // JSDoc identical to super has been omitted here
  protected override _activateListeners(): void;

  /**
   * @remarks
   * @throws If the provided value is outside the range `[0,1]`
   */
  protected override _setValue(value: number): void;

  protected override _toggleDisabled(disabled: boolean): void;

  /**
   * Create a {@linkcode HTMLHueSelectorSlider} using provided configuration data.
   */
  static create(config: HTMLHueSelectorSlider.Config): HTMLHueSelectorSlider;

  #HTMLHueSelectorSlider: true;
}

declare namespace HTMLHueSelectorSlider {
  interface Config extends Omit<FormInputConfig, "value"> {
    /**
     * The current value of the form element.
     *
     * @privateRemarks This is omitted and redefined as required/non-nullish to prevent
     * `undefined` values prior to the element being added to the DOM.
     */
    value: number;
  }
}

export default HTMLHueSelectorSlider;
