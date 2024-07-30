import type AbstractFormInputElement from "./form-element.d.mts";

/**
 * A class designed to standardize the behavior for a hue selector UI component.
 */
export default class HTMLHueSelectorSlider extends AbstractFormInputElement<number> {
  constructor();

  static override tagName: "hue-slider";

  protected override _buildElements(): HTMLInputElement[];

  protected override _refresh(): void;

  protected override _activateListeners(): void;

  protected override _setValue(value: number): void;

  protected override _toggleDisabled(disabled: boolean): void;
}
