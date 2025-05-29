import type { NullishProps } from "#utils";

export type CustomFormGroup = (
  field: foundry.data.fields.DataField,
  groupConfig: FormGroupConfig,
  inputConfig: FormInputConfig<unknown>,
) => HTMLDivElement;

export type CustomFormInput = (
  field: foundry.data.fields.DataField,
  config: FormInputConfig<unknown>,
) => HTMLElement | HTMLCollection;

interface _FormGroupConfig {
  /**
   * An optional units string which is appended to the label
   */
  units: string;

  /**
   * Hint text displayed as part of the form group
   */
  hint: string | null | undefined;

  /**
   * Some parent CSS id within which field names are unique. If provided,
   *                     this root ID is used to automatically assign "id" attributes to input
   *                     elements and "for" attributes to corresponding labels
   */
  rootId: string | null | undefined;

  /**
   * An array of CSS classes applied to the form group element
   */
  classes: string[] | null | undefined;

  /**
   * Is the "stacked" class applied to the form group
   */
  stacked: boolean | null | undefined;

  /**
   * Should labels or other elements within this form group be
   *            automatically localized?
   */
  localize: boolean | null | undefined;

  /**
   * A custom form group widget function which replaces the default
   *            group HTML generation
   */
  widget: CustomFormGroup | null | undefined;
}

export interface FormGroupConfig extends NullishProps<_FormGroupConfig> {
  /**
   * A text label to apply to the form group
   */
  label: string;

  /**
   * An HTML element or collection of elements which provide the inputs
   * for the group
   */
  input: HTMLElement | HTMLCollection;
}

interface _FormInputConfig<FormInputValue = unknown> {
  /**
   * The current value of the form element
   */
  value: FormInputValue;

  /**
   * Is the field required?
   * @defaultValue `false`
   */
  required: boolean;

  /**
   * Is the field disabled?
   * @defaultValue `false`
   */
  disabled: boolean;

  /**
   * Is the field readonly?
   * @defaultValue `false`
   */
  readonly: boolean;

  /**
   * Is the field autofocused?
   * @defaultValue `false`
   */
  autofocus: boolean;

  /**
   * Localize values of this field?
   * @defaultValue `false`
   */
  localize: boolean;

  /**
   * Additional dataset attributes to assign to the input
   */
  dataset: Record<string, string>;

  /**
   * A placeholder value, if supported by the element type
   */
  placeholder: string;

  input: CustomFormInput;
}

export interface FormInputConfig<FormInputValue> extends NullishProps<_FormInputConfig<FormInputValue>> {
  /**
   * The name of the form element
   *
   * @remarks
   *
   * An explicit `undefined` is not allowed here because of the line
   * `{name: this.fieldPath, ...config};` in `DataField#toInput`.
   */
  name?: string;
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

interface MultiSelectInputConfig extends FormInputConfig<string[]>, Omit<SelectInputConfig, "blank"> {}

/**
 * Create a `<multi-select>` element for a StringField.
 */
export function createMultiSelectInput(config: MultiSelectInputConfig): HTMLSelectElement;

export interface NumberInputConfig extends FormInputConfig<number> {
  min?: number;
  max?: number;
  step?: number | "any";
  type?: "range" | "number";
}

/**
 * Create an `<input type="number">` element for a NumberField.
 */
export function createNumberInput(config: NumberInputConfig): HTMLInputElement;

export interface FormSelectOption {
  value?: string;
  label?: string;
  group?: string;
  disabled?: boolean;
  selected?: boolean;
  rule?: boolean;
  dataset?: Record<string, string>;
}

interface _SelectInputConfig {
  /**
   * An option to control the order and display of optgroup elements. The order of
   * strings defines the displayed order of optgroup elements.
   * A blank string may be used to define the position of ungrouped options.
   * If not defined, the order of groups corresponds to the order of options.
   */
  groups: string[];

  blank: string;

  /**
   * An alternative value key of the object passed to the options array
   */
  valueAttr: string;

  /**
   * An alternative label key of the object passed to the options array
   */
  labelAttr: string;

  /**
   * Localize value labels
   *
   * @defaultValue `false`
   */
  localize: boolean;

  /**
   * Sort options alphabetically by label within groups
   *
   * @defaultValue `false`
   */
  sort: boolean;

  /**
   * Customize the type of select that is created
   */
  type: "single" | "multi" | "checkboxes";
}

// Compatible with multiple different types of FormInputConfig so this does *not* extend that interface
export interface SelectInputConfig extends NullishProps<_SelectInputConfig> {
  options: FormSelectOption[];
}

/**
 * Create a `<select>` element for a StringField.
 */
export function createSelectInput(config: SelectInputConfig & FormInputConfig<string>): HTMLSelectElement;

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
export function prepareSelectOptionGroups(config: FormInputConfig<unknown> & SelectInputConfig): {
  group: string;
  options: FormSelectOption[];
}[];

/**
 * Apply standard attributes to all input elements.
 * @param input  - The element being configured
 * @param config - Configuration for the element
 */
export function setInputAttributes(input: HTMLElement, config: FormInputConfig<unknown>): void;
