import type { FormInputConfig } from "../forms/fields.d.mts";
import type AbstractFormInputElement from "./form-element.d.mts";

/**
 * A custom HTML element responsible selecting a value on a range slider with a linked number input field.
 */
declare class HTMLRangePickerElement extends AbstractFormInputElement<number> {
  constructor();

  static override tagName: "range-picker";

  /**
   * The value of the input element.
   */
  get valueAsNumber(): number;

  protected override _buildElements(): HTMLInputElement[];

  protected override _setValue(value: number): void;

  protected override _refresh(): void;

  protected override _activateListeners(): void;

  protected override _toggleDisabled(disabled: boolean): void;

  /**
   * Create a HTMLRangePickerElement using provided configuration data.
   */
  static create(config: HTMLRangePickerElement.RangePickerInputConfig): HTMLRangePickerElement;
}

declare namespace HTMLRangePickerElement {
  interface RangePickerInputConfig extends FormInputConfig<number> {
    min: number;
    max: number;
    step?: number;
  }
}

export default HTMLRangePickerElement;
