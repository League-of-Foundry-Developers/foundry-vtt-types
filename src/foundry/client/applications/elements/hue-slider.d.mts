import type AbstractFormInputElement from "./form-element.d.mts";
import type { FormInputConfig } from "../forms/fields.d.mts";

/**
 * A class designed to standardize the behavior for a hue selector UI component.
 * @privateRemarks This element's value type has `| undefined` in it because it both has no real constructor implementation (where it might
 * have set a fallback), and only sets a value in `.create` if passed a finite number, otherwise allowing it to remain `undefined`
 */
declare class HTMLHueSelectorSlider extends AbstractFormInputElement<number | undefined> {
  /**
   * @remarks This constructor is protected because additional work must be done after creation for this element to be valid in the DOM.
   * Use {@linkcode HTMLHueSelectorSlider.create} instead.
   */
  protected constructor();

  /** @defaultValue `"hue-slider"` */
  static override tagName: string;

  /** @remarks Returns `[HTMLInputElement]` in {@linkcode HTMLHueSelectorSlider} */
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

  static create(config: HTMLHueSelectorSlider.Config): HTMLHueSelectorSlider;

  #HTMLHueSelectorSlider: true;
}

declare namespace HTMLHueSelectorSlider {
  interface Config extends FormInputConfig<number> {}
}

export default HTMLHueSelectorSlider;
