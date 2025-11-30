import type { GetKey, InexactPartial } from "#utils";
import type {
  HTMLMultiSelectElement,
  HTMLMultiCheckboxElement,
} from "#client/applications/elements/multi-select.d.mts";

/** @privateRemarks `NumberField` is only used for links */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { DataField, NumberField } from "#common/data/fields.d.mts";

/**
 * @remarks A callback to be used in place of a field's {@linkcode DataField#_toInput | #_toInput}
 * @see {@linkcode DataField.toInput | DataField#toInput}
 */
export type CustomFormInput = (field: DataField.Any, config: FormInputConfig<unknown>) => HTMLElement | HTMLCollection;

interface _FormGroupConfig {
  /**
   * An optional units string which is appended to the label
   */
  units: string;

  /**
   * Hint text displayed as part of the form group
   */
  hint: string;

  /**
   * Some parent CSS id within which field names are unique. If provided, this root ID is used to automatically
   * assign "id" attributes to input elements and "for" attributes to corresponding labels
   * @remarks e.g a document ID, or `this.id` for use within {@linkcode foundry.applications.api.ApplicationV2 | AppV2}s.
   * @example
   *
   * ```js
   * const sf = new foundry.data.fields.StringField();
   * foundry.applications.fields.createFormGroup({
   *   label: "A Label",
   *   input: sf.toInput({name: "system.foo", value: "buzz"}),
   *   rootId: "HYIwO4kkI2XOzf99",
   * })
   * ```
   * Produces
   * ```html
   * <div class="form-group">
   *  <label for="bar-fizz">A Label</label>
   *  <div class="form-fields">
   *    <input type="text" name="system.foo" value="buzz" id="HYIwO4kkI2XOzf99-system.foo">
   *  </div>
   * </div>
   * ```
   */
  rootId: string;

  /**
   * An array of CSS classes applied to the form group element
   */
  classes: string[];

  /**
   * Is the "stacked" class applied to the form group
   * @defaultValue `false`
   */
  stacked: boolean;

  /**
   * Should labels or other elements within this form group be automatically localized?
   * @defaultValue `false`
   */
  localize: boolean;

  /**
   * The value of the form group's hidden attribute
   * @defaultValue `false`
   * @remarks Nothing appears to set this to `"until-found"` in core code; the only reference to that string outside the typedef is in CSS.
   */
  hidden: boolean | "until-found";

  // `widget` omitted here and added in DataField.GroupConfig
}

export interface FormGroupConfig extends InexactPartial<_FormGroupConfig> {
  /**
   * A text label to apply to the form group
   */
  label: string;

  /**
   * An HTML element or collection of elements which provide the inputs for the group
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

  /**
   * @remarks Used with {@linkcode DataField.toFormGroup | DataField#toFormGroup}/{@linkcode DataField.toInput | #toInput}: if provided,
   * this function will be used instead of the field's {@linkcode DataField._toInput | #_toInput}.
   */
  input: CustomFormInput;
}

export interface FormInputConfig<FormInputValue> extends InexactPartial<_FormInputConfig<FormInputValue>> {
  /**
   * The name of the form element
   */
  // TODO: make required without breaking things
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

/** @internal */
interface _EditorInputConfig {
  /** @defaultValue `"prosemirror"` */
  engine: string;

  height: number;

  /** @defaultValue `true` */
  editable: boolean;

  /** @defaultValue `false` */
  button: boolean;

  /** @defaultValue `false` */
  collaborate: boolean;
}

export interface EditorInputConfig extends FormInputConfig<string>, InexactPartial<_EditorInputConfig> {}

/**
 * Create a `<div class="editor">` element for a StringField.
 */
export function createEditorInput(config: EditorInputConfig): HTMLDivElement;

export interface MultiSelectInputConfig
  extends FormInputConfig<string[] | number[]>,
    Omit<SelectInputConfig, "blank"> {}

/**
 * {@linkcode createMultiSelectInput}'s returned element is only dependent on whether {@linkcode MultiSelectInputConfig.type | config.type}
 * is `"checkboxes"` or not.
 */
export type MultiSelectInputReturn<Config extends MultiSelectInputConfig> = _MultiSelectInputReturn<
  GetKey<Config, "type", undefined>
>;

/** @internal */
type _MultiSelectInputReturn<Type extends SelectInputConfig["type"]> = Type extends "checkboxes"
  ? HTMLMultiCheckboxElement
  : Type extends Exclude<SelectInputConfig["type"], "checkboxes">
    ? HTMLMultiSelectElement
    : never;

/**
 * Create a `<multi-select>` or `<multi-checkbox>` element for fields supporting multiple choices.
 */
export function createMultiSelectInput<Config extends MultiSelectInputConfig>(
  config: Config,
): MultiSelectInputReturn<Config>;

export interface NumberInputConfig extends FormInputConfig<number> {
  min?: number;
  max?: number;

  /** @remarks Any non-number value is replaced with `"any"` */
  step?: number | "any";

  /**
   * @remarks In {@linkcode NumberField._toInput | NumberField#_toInput}, if {@linkcode min}, {@linkcode max}, and {@linkcode step} are all
   * provided, passing `"number"` will prevent the output from being a `<range-picker>`. Passing `"range"` has no effect, the presence of
   * the other three properties is all that matters.
   *
   * This is entirely unused in {@linkcode createNumberInput}.
   */
  type?: "range" | "number";
}

/**
 * Create an `<input type="number">` element for a NumberField.
 */
export function createNumberInput(config: NumberInputConfig): HTMLInputElement;

/**
 * @remarks This interface doesn't automatically account for any use of {@linkcode SelectInputConfig.labelAttr} or
 * {@linkcode SelectInputConfig.valueAttr | .valueAttr}. If you need to use either, you'll have to declaration merge
 * them in, or make a wrapper like {@linkcode foundry.abstract.Document.DialogFoldersChoices}.
 */
export interface FormSelectOption {
  value: string;
  label: string;
  group?: string;
  disabled?: boolean;
  selected?: boolean;
  rule?: boolean;
  dataset?: Record<string, string>;
}

/** @internal */
interface _SelectInputConfig {
  /**
   * An option to control the order and display of optgroup elements. The order of strings defines the displayed order of optgroup elements.
   * A blank string may be used to define the position of ungrouped options. If not defined, the order of groups corresponds to the order of
   * options.
   */
  groups: string[];

  /**
   * @remarks If the provided {@linkcode SelectInputConfig.options | options} don't include an option with a value of `""`, providing this
   * property will cause one to be created at the top of the options list with this value as its label.
   */
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
   * @defaultValue `false`
   */
  localize: boolean;

  /**
   * Sort options alphabetically by label within groups
   * @defaultValue `false`
   */
  sort: boolean;

  /**
   * Customize the type of select that is created
   * @remarks This is only used in {@linkcode createMultiSelectInput}, which only checks this for `=== "checkboxes"`. If true, a
   * {@linkcode HTMLMultiCheckboxElement} is returned; all other values lead to a {@linkcode HTMLMultiSelectElement}
   */
  type: "single" | "multi" | "checkboxes";
}

// Compatible with multiple different types of FormInputConfig so this does *not* extend that interface
export interface SelectInputConfig extends InexactPartial<_SelectInputConfig> {
  options: FormSelectOption[];
}

/**
 * Create a `<select>` element for a StringField.
 */
export function createSelectInput(config: SelectInputConfig & FormInputConfig<string>): HTMLSelectElement;

export interface TextAreaInputConfig extends FormInputConfig<string> {
  /**
   * The number of visible text lines for the `<textarea>`
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/textarea#rows}
   * @remarks Foundry provides no support for
   * {@linkcode https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/textarea#cols | cols}
   * @privateRemarks Foundry incorrectly types this as required in 13.351 and 14.352
   */
  rows?: number;
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
 * @remarks
 */
export function prepareSelectOptionGroups(
  config: FormInputConfig<unknown> & SelectInputConfig,
): PreparedSelectOptionGroup[];

/**
 * {@linkcode prepareSelectOptionGroups} adds an undocumented, and seemingly unused, `type` property that is always set to `"option"`
 */
interface PreparedFormSelectOption extends Required<FormSelectOption> {
  type: "option";
}

export interface PreparedSelectOptionGroup {
  group: string;
  options: PreparedFormSelectOption[];
}

/**
 * Apply standard attributes to all input elements.
 * @param input  - The element being configured
 * @param config - Configuration for the element
 */
export function setInputAttributes(input: HTMLElement, config: FormInputConfig<unknown>): void;

/**
 * Create an HTML element for a FontAwesome icon
 * @param glyph   - A FontAwesome glyph name, such as "file" or "user"
 * @param options - Additional options to configure the icon
 * @returns The configured FontAwesome icon element
 * @see {@link https://fontawesome.com/v6/search}
 * @remarks While Foundry has a license to use the FontAwesome Pro icons, you, the user reading this, do not, by default. For legal reasons,
 * if you don't positively know you're licensed to use more, stick to the `Free` list on the page linked above (you used to be able to link
 * directly to a page showing only free icons, but FA broke that recently; the button is top right above the icon grid at time of writing).
 * Said link has been changed from Foundry's to point to the FA v6.7.2 list, as that's what's shipped with Foundry in both 13.351 and 14.352.
 *
 * `glyph` will take identifiers with or without the `fa-` prefix.
 */
export function createFontAwesomeIcon(glyph: string, options?: CreateFontAwesomeIconOptions): HTMLElement;

export type FontAwesomeStyle = "solid" | "regular" | "duotone";

/** @internal */
interface _CreateFontAwesomeIconOptions {
  /**
   * The style name for the icon
   * @defaultValue `"solid"`
   */
  style: FontAwesomeStyle;

  /**
   * Should the icon be fixed-width?
   * @defaultValue `false`
   */
  fixedWidth: boolean;

  /**
   * Additional classes to append to the class list
   * @defaultValue `[]`
   */
  classes: string[];
}

export interface CreateFontAwesomeIconOptions extends InexactPartial<_CreateFontAwesomeIconOptions> {}

/**
 * @deprecated Since this type is only used by {@linkcode DataField.toFormGroup | DataField#toFormGroup}, and not by any of the functions in
 * this file, it has moved to {@linkcode DataField.CustomFormGroup}. This alias will be removed in v15.
 */
export type CustomFormGroup = DataField.CustomFormGroup;
