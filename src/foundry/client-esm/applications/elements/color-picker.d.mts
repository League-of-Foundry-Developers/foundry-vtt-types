import type { FormInputConfig } from "../forms/fields.d.mts";
import type AbstractFormInputElement from "./form-element.d.mts";

/**
 * A custom HTMLElement used to select a color using a linked pair of input fields.
 */
export default class HTMLColorPickerElement extends AbstractFormInputElement<string> {
  constructor();

  static override tagName: "color-picker";

  protected override _buildElements(): HTMLInputElement[];

  protected override _refresh(): void;

  protected override _activateListeners(): void;

  protected override _toggleDisabled(disabled: boolean): void;

  protected override _onClick(event: PointerEvent): void;

  /**
   * Create a HTMLColorPickerElement using provided configuration data.
   */
  static create(config: FormInputConfig<unknown>): HTMLColorPickerElement;
}
