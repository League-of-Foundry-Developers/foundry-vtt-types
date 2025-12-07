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
   * @remarks This just returns {@linkcode HTMLRangePickerElement._getValue | this._getValue()}, making it redundant with the non-overridden
   * {@linkcode HTMLRangePickerElement.value | #value} getter.
   */
  get valueAsNumber(): number;

  /**
   * @remarks Returns `[rangeInput: HTMLInputElement, numberInput: HTMLInputElement]` in {@linkcode HTMLColorPickerElement}.
   * @privateRemarks Return type left wide for ease of subclassing.
   */
  protected override _buildElements(): HTMLElement[];

  protected override _setValue(value: number): void;

  protected override _refresh(): void;

  protected override _activateListeners(): void;

  protected override _toggleDisabled(disabled: boolean): void;

  /**
   * Create a HTMLRangePickerElement using provided configuration data.
   */
  static create(config: HTMLRangePickerElement.Config): HTMLRangePickerElement;

  #HTMLRangePickerElement: true;
}

declare namespace HTMLRangePickerElement {
  /** @internal */
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

  /** @privateRemarks `Options` extended first to use its `value`, which has an accurate `defaultValue` */
  interface Config extends Options, FormInputConfig<number> {}

  /**
   * @deprecated This interface has been renamed for consistency with other elements.
   * Use {@linkcode HTMLRangePickerElement.Config} instead. This alias will be removed in v15.
   */
  type RangePickerInputConfig = Config;
}

export default HTMLRangePickerElement;
