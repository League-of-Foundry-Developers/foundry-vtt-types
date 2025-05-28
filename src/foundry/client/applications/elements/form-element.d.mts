/**
 * An abstract custom HTMLElement designed for use with form inputs.
 * @remarks Fires input  - An "input" event when the value of the input changes
 * @remarks Fires change - A "change" event when the value of the element changes
 */
export default abstract class AbstractFormInputElement<FormInputValueType> extends HTMLElement {
  constructor();

  /**
   * The HTML tag name used by this element.
   */
  static tagName: string;

  /**
   * Declare that this custom element provides form element functionality.
   */
  static formAssociated: boolean;

  /**
   * Attached ElementInternals which provides form handling functionality.
   */
  protected _internals: ElementInternals;

  /**
   * The form this element belongs to.
   */
  get form(): HTMLFormElement;
  set name(value: string);

  /**
   * The input element name.
   */
  get name(): string;
  set value(value: FormInputValueType);

  /**
   * The value of the input element.
   */
  get value(): FormInputValueType;

  /**
   * The underlying value of the element.
   */
  protected _value: FormInputValueType;

  /**
   * Return the value of the input element which should be submitted to the form.
   */
  protected _getValue(): FormInputValueType;

  /**
   * Translate user-provided input value into the format that should be stored.
   * @param value - A new value to assign to the element
   * @throws An error if the provided value is invalid
   */
  protected _setValue(value: FormInputValueType): void;

  set disabled(value: boolean);

  /**
   * Is this element disabled?
   */
  get disabled(): boolean;

  /**
   * Is this field editable? The field can be neither disabled nor readonly.
   */
  get editable(): boolean;

  /**
   * Special behaviors that the subclass should implement when toggling the disabled state of the input.
   * @param disabled - The new disabled state
   */
  protected _toggleDisabled(disabled: boolean): void;

  /**
   * Initialize the custom element, constructing its HTML.
   */
  connectedCallback(): void;

  /**
   * Create the HTML elements that should be included in this custom element.
   * Elements are returned as an array of ordered children.
   */
  protected _buildElements(): HTMLElement[];

  /**
   * Refresh the active state of the custom element.
   */
  protected _refresh(): void;

  /**
   * Apply key attributes on the containing custom HTML element to input elements contained within it.
   * @internal
   */
  protected _applyInputAttributes(input: HTMLInputElement): void;

  /**
   * Activate event listeners which add dynamic behavior to the custom element.
   */
  protected _activateListeners(): void;

  /**
   * Special handling when the custom element is clicked. This should be implemented to transfer focus to an
   * appropriate internal element.
   */
  protected _onClick(event: PointerEvent): void;
}
