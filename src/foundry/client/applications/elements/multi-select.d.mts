import type { MultiSelectInputConfig } from "../forms/fields.d.mts";
import type AbstractFormInputElement from "./form-element.d.mts";

/**
 * An abstract base class designed to standardize the behavior for a multi-select UI component.
 * Multi-select components return an array of values as part of form submission.
 * Different implementations may provide different experiences around how inputs are presented to the user.
 * @privateRemarks Union for the `FormInputElementType` is required due to the split nature of getting and setting in this class. See
 * {@linkcode AbstractMultiSelectElement._value | _value}, {@linkcode AbstractMultiSelectElement.value | value} (getter and setter),
 * {@linkcode AbstractMultiSelectElement._getValue | _getValue}, and {@linkcode AbstractMultiSelectElement._setValue | _setValue}.
 */
export abstract class AbstractMultiSelectElement extends AbstractFormInputElement<Set<string> | string[]> {
  /**
   * Predefined `<option>` and `<optgroup>` elements which were defined in the original HTML.
   */
  protected _options: (HTMLOptionElement | HTMLOptGroupElement)[];

  /**
   * An object which maps option values to displayed labels.
   * @remarks This is populated in {@linkcode AbstractMultiSelectElement._initialize | AbstractMultiSelectElement#_initialize} via
   * {@linkcode AbstractMultiSelectElement.connectedCallback | #connectedCallback}. The data is from the existing child `<option>`s,
   * which must be appended prior to adding this element to the DOM. Use {@linkcode foundry.applications.fields.createMultiSelectInput}
   * to automate this process.
   */
  protected _choices: Record<string, string>;

  /** @remarks Initialized to `new Set()` in the class body */
  protected override _value: Set<string>;

  /**
   * @privateRemarks Fake type override because of the class type param being a union;
   * getting will always return a `Set`, but setting only takes arrays.
   */
  override get value(): Set<string>;

  /**
   * @privateRemarks Fake type override. Since the {@linkcode AbstractFormInputElement.value AbstractFormInputElement#value} setter forwards
   * to {@linkcode AbstractMultiSelectElement._setValue | this._setValue}, the passed value must be an array.
   */
  override set value(value: string[]);

  override connectedCallback(): void;

  /**
   * Preserve existing `<option>` and `<optgroup>` elements which are defined in the original HTML.
   */
  protected _initialize(): void;

  /**
   * Mark a choice as selected.
   * @param value - The value to add to the chosen set
   * @remarks
   * @throws If the passed value isn't in {@linkcode AbstractMultiSelectElement._choices | this._choices}.
   */
  select(value: string): void;

  /**
   * Mark a choice as un-selected.
   * @param value - The value to delete from the chosen set
   */
  unselect(value: string): void;

  /** @remarks `Array.from(`{@linkcode AbstractMultiSelectElement._value | this._value}`)` */
  protected override _getValue(): string[];

  /**
   * @remarks
   * @throws If `value` is not an Array, or if any element is not in {@linkcode AbstractMultiSelectElement._choices | this._choices}
   */
  protected override _setValue(value: string[]): void;
}

/**
 * Provide a multi-select workflow using a select element as the input mechanism.
 *
 * @example
 * Multi-Select HTML Markup
 * ```html
 * <multi-select name="select-many-things">
 *   <optgroup label="Basic Options">
 *     <option value="foo">Foo</option>
 *     <option value="bar">Bar</option>
 *     <option value="baz">Baz</option>
 *   </optgroup>
 *   <optgroup label="Advanced Options">
 *    <option value="fizz">Fizz</option>
 *     <option value="buzz">Buzz</option>
 *   </optgroup>
 * </multi-select>
 * ```
 */
export class HTMLMultiSelectElement extends AbstractMultiSelectElement {
  /**
   * @remarks This constructor is protected because additional work must be done after creation for this element to be valid in the DOM.
   * Use {@linkcode HTMLMultiSelectElement.create} or {@linkcode foundry.applications.fields.createMultiSelectInput} instead.
   */
  protected constructor();

  /** @defaultValue `"multi-select"` */
  static override tagName: string;

  /**
   * @remarks Returns `[tags: HTMLDivElement, select: HTMLSelectElement]` in {@linkcode HTMLMultiSelectElement}
   * @privateRemarks Return type left wide for ease of subclassing
   */
  protected override _buildElements(): HTMLElement[];

  protected override _refresh(): void;

  protected override _activateListeners(): void;

  protected override _toggleDisabled(disabled: boolean): void;

  /**
   * Create a HTMLMultiSelectElement using provided configuration data.
   * @remarks Just forwards to {@linkcode foundry.applications.fields.createMultiSelectInput} in 13.351
   */
  static create(config: MultiSelectInputConfig): HTMLMultiSelectElement;

  #HTMLMultiSelectElement: true;
}

/**
 * Provide a multi-select workflow as a grid of input checkbox elements.
 *
 * @example
 * Multi-Checkbox HTML Markup
 * ```html
 * <multi-checkbox name="check-many-boxes">
 *   <optgroup label="Basic Options">
 *     <option value="foo">Foo</option>
 *     <option value="bar">Bar</option>
 *     <option value="baz">Baz</option>
 *   </optgroup>
 *   <optgroup label="Advanced Options">
 *    <option value="fizz">Fizz</option>
 *     <option value="buzz">Buzz</option>
 *   </optgroup>
 * </multi-checkbox>
 * ```
 */
export class HTMLMultiCheckboxElement extends AbstractMultiSelectElement {
  /**
   * @remarks This constructor is protected because additional work must be done after creation for this element to be valid in the DOM.
   * Use {@linkcode foundry.applications.fields.createMultiSelectInput} with `type: "checkboxes"` in the config instead.
   */
  protected constructor();

  /** @defaultValue `"multi-checkbox"` */
  static override tagName: string;

  /**
   * @remarks Returns `(HTMLFieldSetElement | HTMLLabelElement)[]` in {@linkcode HTMLMultiCheckboxElement}
   * @privateRemarks Return type left wide for ease of subclassing
   */
  protected override _buildElements(): HTMLElement[];

  protected override _refresh(): void;

  protected override _activateListeners(): void;

  protected override _toggleDisabled(disabled: boolean): void;

  #HTMLMultiCheckboxElement: true;
}
