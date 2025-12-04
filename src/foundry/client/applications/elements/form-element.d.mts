import type { Identity } from "#utils";

/** @privateRemarks `FormInputConfig` only used for links */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { FormInputConfig } from "../forms/fields.d.mts";

/**
 * An abstract custom HTMLElement designed for use with form inputs.
 * @remarks Fires input  - An "input" event when the value of the input changes
 * @remarks Fires change - A "change" event when the value of the element changes
 */
declare abstract class AbstractFormInputElement<FormInputValueType> extends HTMLElement {
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
   * Attributes requiring change notifications
   * @defaultValue `"disabled"`
   */
  static observedAttributes: string[];

  /**
   * Attached ElementInternals which provides form handling functionality.
   * @remarks Initialized at construction
   */
  protected _internals: ElementInternals;

  /**
   * The primary input (if any). Used to determine what element should receive focus when an associated label is clicked
   * on.
   */
  protected _primaryInput: HTMLElement | undefined;

  /**
   * The form this element belongs to.
   */
  get form(): HTMLFormElement | null;

  /**
   * The input element name.
   * @privateRemarks This type intentionally doesn't account for the possibility of a total lack of `name`, leading to a `null` return.
   * Since `name` is required in {@linkcode FormInputConfig}, this class is abstract, and all subclasses have had their constructors
   * protected in favour of static `.create` methods and/or functions in {@linkcode foundry.applications.fields}, this is close enough
   * to accurate.
   */
  get name(): string;

  set name(value);

  /**
   * The value of the input element.
   * @privateRemarks This
   */
  // TODO: finish above remarks and remove |undefined from values, move to including in specific element type params
  get value(): FormInputValueType | undefined;

  set value(value: FormInputValueType);

  /**
   * The underlying value of the element.
   */
  protected _value: FormInputValueType | undefined;

  /**
   * Return the value of the input element which should be submitted to the form.
   */
  protected _getValue(): FormInputValueType | undefined;

  /**
   * Translate user-provided input value into the format that should be stored.
   * @param value - A new value to assign to the element
   * @throws An error if the provided value is invalid
   * @remarks Doesn't do any checking or throwing in `AbstractFormInputElement`, just assigns to {@linkcode this._value}.
   */
  protected _setValue(value: FormInputValueType): void;

  /**
   * Is this element disabled?
   */
  get disabled(): boolean;

  set disabled(value: boolean);

  /**
   * Is this field editable? The field can be neither disabled nor readonly.
   */
  get editable(): boolean;

  /**
   * Special behaviors that the subclass should implement when toggling the disabled state of the input.
   * @param disabled - The new disabled state
   * @remarks No-op in `AbstractFormInputElement`
   */
  protected _toggleDisabled(disabled: boolean): void;

  /**
   * An AbortSignal that can be passed to event listeners registered in subclasses. The signal will ensure that the
   * listener is removed when the element is disconnected from the DOM. Not available in the constructor.
   */
  get abortSignal(): AbortSignal | undefined;

  /**
   * Initialize the custom element, constructing its HTML.
   */
  connectedCallback(): void;

  /** @privateRemarks Erroneously marked `@override` in Foundry JSDoc */
  disconnectedCallback(): void;

  /** @privateRemarks Erroneously marked `@override` in Foundry JSDoc */
  formDisabledCallback(disabled: boolean): void;

  /**
   * @remarks No-op in `AbstractFormInputElement`
   * @privateRemarks Erroneously marked `@override` in Foundry JSDoc, see
   * {@link https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements#responding_to_attribute_changes}
   */
  attributeChangedCallback(attrName: string, oldValue: string | null, newValue: string | null): void;

  /**
   * A method provided for subclasses to perform tear-down workflows as an alternative to overriding
   * disconnectedCallback.
   * @remarks No-op in `AbstractFormInputElement`
   */
  protected _disconnect(): void;

  /**
   * Create the HTML elements that should be included in this custom element.
   * Elements are returned as an array of ordered children.
   */
  protected _buildElements(): HTMLElement[];

  /**
   * Refresh the active state of the custom element.
   * @remarks No-op in `AbstractFormInputElement`
   */
  protected _refresh(): void;

  /**
   * Apply key attributes on the containing custom HTML element to input elements contained within it.
   * @internal
   */
  protected _applyInputAttributes(input: HTMLInputElement): void;

  /**
   * Activate event listeners which add dynamic behavior to the custom element.
   * @remarks No-op in `AbstractFormInputElement`
   */
  protected _activateListeners(): void;

  /**
   * Special handling when the custom element is clicked. This should be implemented to transfer focus to an
   * appropriate internal element.
   * @remarks `AbstractFormInputElement` implementation focuses the {@linkcode AbstractFormInputElement._primaryInput | _primaryInput} by
   * default.
   */
  protected _onClick(event: PointerEvent): void;

  #AbstractFormInputElement: true;
}

declare namespace AbstractFormInputElement {
  interface Any extends AnyAbstractFormInputElement {}
  interface AnyConstructor extends Identity<typeof AnyAbstractFormInputElement> {}
}

export default AbstractFormInputElement;

declare abstract class AnyAbstractFormInputElement extends AbstractFormInputElement<unknown> {
  constructor(...args: never);
}
