export type CustomFormGroup = (
  field: foundry.data.fields.DataField,
  groupConfig: FormGroupConfig,
  inputConfig: FormInputConfig,
) => HTMLDivElement;

export type CustomFormInput = (
  field: foundry.data.fields.DataField,
  config: FormInputConfig,
) => HTMLElement | HTMLCollection;

export interface FormGroupConfig {
  /**
   * A text label to apply to the form group
   */
  label: string;
  /**
   * An optional units string which is appended to the label
   */
  units?: string;
  /**
   * An HTML element or collection of elements which provide the inputs
   * for the group
   */
  input: HTMLElement | HTMLCollection;
  /**
   * Hint text displayed as part of the form group
   */
  hint?: string;
  /**
   * Some parent CSS id within which field names are unique. If provided,
   *                     this root ID is used to automatically assign "id" attributes to input
   *                     elements and "for" attributes to corresponding labels
   */
  rootId?: string;
  /**
   * An array of CSS classes applied to the form group element
   */
  classes?: string[];
  /**
   * Is the "stacked" class applied to the form group
   */
  stacked?: boolean;
  /**
   * Should labels or other elements within this form group be
   *            automatically localized?
   */
  localize?: boolean;
  /**
   * A custom form group widget function which replaces the default
   *            group HTML generation
   */
  widget?: CustomFormGroup;
}

export interface FormInputConfig<FormInputValue = any> {
  /**
   * The name of the form element
   */
  name: string;
  /**
   * The current value of the form element
   */
  value?: FormInputValue;
  /**
   * Is the field required?
   */
  required?: boolean;
  /**
   * Is the field disabled?
   */
  disabled?: boolean;
  /**
   * Is the field readonly?
   */
  readonly?: boolean;
  /**
   * Is the field autofocused?
   */
  autofocus?: boolean;
  /**
   * Localize values of this field?
   */
  localize?: boolean;
  /**
   * Additional dataset attributes to assign to the input
   */
  dataset?: Record<string, string>;
  /**
   * A placeholder value, if supported by the element type
   */
  placeholder?: string;
  input?: CustomFormInput;
}

/**
 * Create a standardized form field group.
 */
export function createFormGroup(config: FormGroupConfig): HTMLDivElement;

/**
 * Create an `<input type="checkbox">` element for a BooleanField.
 */
export function createCheckboxInput(config: FormInputConfig<boolean>): HTMLInputElement;

export interface EditorInputConfig extends FormInputConfig<string> {
  /** @defaultValue `"prosemirror"` */
  engine?: string;
  height?: number;
  editable?: boolean;
  button?: boolean;
  collaborate?: boolean;
}

/**
 * Create a `<div class="editor">` element for a StringField.
 */
export function createEditorInput(config: EditorInputConfig): HTMLDivElement;

/**
 * Create a `<multi-select>` element for a StringField.
 */
export function createMultiSelectInput(
  config: FormInputConfig<string[]> & Omit<SelectInputConfig, "blank">,
): HTMLSelectElement;

export interface NumberInputConfig extends FormInputConfig<number> {
  min: number;
  max: number;
  step: number | "any";
  type?: "range" | "number";
}

/**
 * Create an `<input type="number">` element for a NumberField.
 */
export function createNumberInput(config: NumberInputConfig): HTMLInputElement;

export interface FormSelectOption {
  value: string;
  label: string;
  group?: string;
  disabled?: boolean;
  selected?: boolean;
  rule?: boolean;
}

// Compatible with multiple different types of FormInputConfig so this does *not* extend that interface
export interface SelectInputConfig {
  options: FormSelectOption[];
  /**
   * An option to control the order and display of optgroup elements. The order of
   *         strings defines the displayed order of optgroup elements.
   *         A blank string may be used to define the position of ungrouped options.
   *         If not defined, the order of groups corresponds to the order of options.
   */
  groups?: string[];
  blank?: string;
  /**
   * An alternative value key of the object passed to the options array
   */
  valueAttr?: string;
  /**
   * An alternative label key of the object passed to the options array
   */
  labelAttr?: string;
  /**
   * Localize value labels
   */
  localize?: boolean;
  /**
   * Sort options alphabetically by label within groups
   */
  sort?: boolean;
  /**
   * Customize the type of select that is created
   */
  type?: "single" | "multi" | "checkboxes";
}

export interface TextAreaInputConfig extends FormInputConfig<string> {
  rows: number;
}

/**
 * Create a `<textarea>` element for a StringField.
 */
export function createTextareaInput(config: TextAreaInputConfig): HTMLTextAreaElement;

/**
 * Create an `<input type="text">` element for a StringField.
 */
export function createTextInput(config: FormInputConfig<string>): HTMLInputElement;

/**
 * Structure a provided array of select options into a standardized format for rendering optgroup and option elements.
 *
 * @example
 * ```js
 * const options = [
 *   {value: "bar", label: "Bar", selected: true, group: "Good Options"},
 *   {value: "foo", label: "Foo", disabled: true, group: "Bad Options"},
 *   {value: "baz", label: "Baz", group: "Good Options"}
 * ];
 * const groups = ["Good Options", "Bad Options", "Unused Options"];
 * const optgroups = foundry.applications.fields.prepareSelectOptionGroups({options, groups, blank: true, sort: true});
 * ```
 */
export function prepareSelectOptionGroups(config: FormInputConfig & SelectInputConfig): {
  group: string;
  options: FormSelectOption[];
}[];

/**
 * Apply standard attributes to all input elements.
 * @param input  - The element being configured
 * @param config - Configuration for the element
 */
export function setInputAttributes(input: HTMLElement, config: FormInputConfig<any>): void;
