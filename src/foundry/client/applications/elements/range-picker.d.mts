import type { FormInputConfig } from "../forms/fields.d.mts";
import type AbstractFormInputElement from "./form-element.d.mts";
import type { InexactPartial } from "#utils";

/**
 * A custom HTML element responsible selecting a value on a range slider with a linked number input field.
 */
declare class HTMLRangePickerElement extends AbstractFormInputElement<number> {
  protected constructor(options?: HTMLRangePickerElement.Options);

  /** @defaultValue `"range-picker"` */
  static override tagName: string;

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
  static create(config: HTMLRangePickerElement.Config): HTMLRangePickerElement;
}

declare namespace HTMLRangePickerElement {
  interface _Options {
    /** The slider minimum value*/
    min: number;

    /** The slider maximum value */
    max: number;

    /** The slider's discrete value increments */
    step: number;

    /**
     * The slider's starting value
     * @defaultValue `0`
     */
    value: number;
  }

  interface Options extends InexactPartial<_Options> {}

  interface Config extends Options, Omit<FormInputConfig<number>, "value"> {}

  interface RangePickerInputConfig extends FormInputConfig<number> {
    min: number;
    max: number;
    step?: number;
  }
}

export default HTMLRangePickerElement;
