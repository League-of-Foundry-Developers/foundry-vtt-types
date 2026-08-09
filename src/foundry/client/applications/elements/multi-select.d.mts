import type { MultiSelectInputConfig } from "../forms/fields.d.mts";
import type AbstractFormInputElement from "./form-element.d.mts";

/**
 * An abstract base class designed to standardize the behavior for a multi-select UI component.
 * Multi-select components return an array of values as part of form submission.
 * Different implementations may provide different experiences around how inputs are presented to the user.
 * @privateRemarks Union for the `FormInputElementType` is required due to {@linkcode AbstractMultiSelectElement._value | #_value} being a
 * `Set<string>`, but {@linkcode AbstractMultiSelectElement.value | #value}, {@linkcode AbstractMultiSelectElement._getValue | #_getValue},
 * and {@linkcode AbstractMultiSelectElement._setValue | #_setValue} all take/return `string[]`s.
 */
declare abstract class AbstractMultiSelectElement extends AbstractFormInputElement<Set<string> | string[]> {
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

  /**
   * Option values which were originally marked as disabled.
   * @remarks Initialized to `new Set()` in the class body, then populated in
   * {@linkcode AbstractMultiSelectElement._initialize | #_initialize} from any child `<option>` carrying the
   * `disabled` attribute. Values in this set are locked to their current selected state; see
   * {@linkcode AbstractMultiSelectElement.disableOption | #disableOption}.
   */
  protected _disabledOptions: Set<string>;

  /** @remarks Initialized to `new Set()` in the class body */
  protected override _value: Set<string>;

  /** @privateRemarks Fake type override because of the class type param being a union. */
  override get value(): string[];

  /** @privateRemarks Fake type override because of the class type param being a union. */
  override set value(value: string[]);

  override connectedCallback(): void;

  /**
   * Preserve existing `<option>` and `<optgroup>` elements which are defined in the original HTML.
   */
  protected _initialize(): void;

  /**
   * Mark a choice as selected.
   * @param value - The value to add to the chosen set
   * @remarks No-ops if the value is already selected, or if it's in
   * {@linkcode AbstractMultiSelectElement._disabledOptions | this._disabledOptions}.
   * @throws If the passed value isn't already selected and isn't in
   * {@linkcode AbstractMultiSelectElement._choices | this._choices}.
   */
  select(value: string): void;

  /**
   * Mark a choice as un-selected.
   * @param value - The value to delete from the chosen set
   * @remarks No-ops if the value is in {@linkcode AbstractMultiSelectElement._disabledOptions | this._disabledOptions},
   * as disabled values are locked to their current state.
   */
  unselect(value: string): void;

  /**
   * Toggle the disabled state of a specific option.
   * @param value    - The option value to modify
   * @param disabled - Whether the option should be disabled (default: `true`)
   * @throws If the passed value isn't in {@linkcode AbstractMultiSelectElement._choices | this._choices}.
   */
  disableOption(value: string, disabled?: boolean): void;

  protected override _getValue(): string[];

  /**
   * @throws If any element passed is not in {@linkcode AbstractMultiSelectElement._choices | this._choices}
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
declare class HTMLMultiSelectElement extends AbstractMultiSelectElement {
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
   * Create a {@linkcode HTMLMultiSelectElement} using provided configuration data.
   * @remarks Just forwards to {@linkcode foundry.applications.fields.createMultiSelectInput}, overriding
   * {@linkcode MultiSelectInputConfig.type | config.type}, hence its omission here.
   * @privateRemarks Foundry passes `type: "multi-select"`, which isn't one of the values
   * {@linkcode MultiSelectInputConfig.type} allows. This is harmless, as `createMultiSelectInput` only checks for
   * `=== "checkboxes"`, but it means the value can't be narrowed to the documented union.
   */
  static create(config: HTMLMultiSelectElement.Config): HTMLMultiSelectElement;

  #HTMLMultiSelectElement: true;
}

declare namespace HTMLMultiSelectElement {
  /**
   * @remarks {@linkcode MultiSelectInputConfig.type | type} is omitted because
   * {@linkcode HTMLMultiSelectElement.create} sets it itself.
   */
  interface Config extends Omit<MultiSelectInputConfig, "type"> {}
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
declare class HTMLMultiCheckboxElement extends AbstractMultiSelectElement {
  /**
   * @remarks This constructor is protected because additional work must be done after creation for this element to be valid in the DOM.
   * Use {@linkcode HTMLMultiCheckboxElement.create} or {@linkcode foundry.applications.fields.createMultiSelectInput}
   * with `type: "checkboxes"` in the config instead.
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

  /**
   * Create a {@linkcode HTMLMultiCheckboxElement} using provided configuration data.
   * @remarks Just forwards to {@linkcode foundry.applications.fields.createMultiSelectInput}, overriding
   * {@linkcode MultiSelectInputConfig.type | config.type} with `"checkboxes"`, hence its omission here.
   */
  static create(config: HTMLMultiCheckboxElement.Config): HTMLMultiCheckboxElement;

  #HTMLMultiCheckboxElement: true;
}

declare namespace HTMLMultiCheckboxElement {
  /**
   * @remarks {@linkcode MultiSelectInputConfig.type | type} is omitted because
   * {@linkcode HTMLMultiCheckboxElement.create} sets it itself.
   */
  interface Config extends Omit<MultiSelectInputConfig, "type"> {}
}

export { AbstractMultiSelectElement, HTMLMultiCheckboxElement, HTMLMultiSelectElement };
