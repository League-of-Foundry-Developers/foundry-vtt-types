import type { GetKey, InexactPartial } from "#utils";
import type {
  HTMLMultiSelectElement,
  HTMLMultiCheckboxElement,
} from "#client/applications/elements/multi-select.d.mts";

/** @privateRemarks `NumberField` is only used for links */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { DataField, NumberField } from "#common/data/fields.d.mts";

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

  // `widget` omitted here and added in `DataField.GroupConfig`
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
   * An id to assign to the element
   */
  id: string;

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
   * Aria attributes to assign to the input
   */
  aria: Record<string, string>;

  /**
   * A placeholder value, if supported by the element type
   */
  placeholder: string;

  /**
   * Space-delimited class names to apply to the input.
   */
  classes: string;

  // `input` omitted here and added in `DataField.ToFormInput`
}

export interface FormInputConfig<FormInputValue = unknown> extends InexactPartial<_FormInputConfig<FormInputValue>> {
  /**
   * The name of the form element
   */
  name: string;
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
  /**
   * @defaultValue `"prosemirror"`
   * @deprecated TinyMCE is being removed in v14, at which time presumably this property will be removed (since v13, until v14)
   */
  engine: "prosemirror" | "tinymce";

  /** @remarks In `px`, applied to the returned outer `<div>` */
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

/**
 * @remarks This is the value type for methods which pass their config through {@linkcode prepareSelectOptionGroups}, which will:
 * - Iterate over anything iterable passed
 * - Wrap lone primitives in an array
 * - Run every value through `String()`
 *
 * Note that passing more than one value to a non-multi-select will lead to the *last* found value being the effectively selected one.
 *
 * Passing a `Set` or `Collection` of (even mixed) strings/numbers works fine.
 * @privateRemarks This could be widened further to anything `toString`able, but Foundry types {@linkcode createMultiSelectInput} as
 * `(string | number)[]`, so this seems like a fair compromise between what's allowed at runtime and what's expected.
 */
export type SelectOptionsValue = string | number | Iterable<string | number>;

/** @internal */
interface _MultiSelectInputConfig {
  /**
   * Customize the type of select that is created
   * @remarks This is only checked for `=== "checkboxes"`. If true, a {@linkcode HTMLMultiCheckboxElement} is returned; all other values
   * lead to a {@linkcode HTMLMultiSelectElement}.
   *
   * @privateRemarks Foundry puts this in {@linkcode _SelectInputConfig}, but it's only used by {@linkcode createMultiSelectInput}
   */
  type: "single" | "multi" | "checkboxes";
}

/** @remarks See {@linkcode SelectOptionsValue} */
export interface MultiSelectInputConfig
  extends InexactPartial<_MultiSelectInputConfig>,
    FormInputConfig<SelectOptionsValue>,
    Omit<_SelectInputConfig, "blank"> {}

/**
 * {@linkcode createMultiSelectInput}'s returned element is only dependent on whether {@linkcode MultiSelectInputConfig.type | config.type}
 * is `"checkboxes"` or not.
 */
export type MultiSelectInputReturn<Config extends MultiSelectInputConfig> = _MultiSelectInputReturn<
  GetKey<Config, "type", undefined>
>;

/** @internal */
type _MultiSelectInputReturn<Type extends MultiSelectInputConfig["type"]> = Type extends "checkboxes"
  ? HTMLMultiCheckboxElement
  : // all values other than "checkboxes" are effectively the same
    Type extends Exclude<MultiSelectInputConfig["type"], "checkboxes">
    ? HTMLMultiSelectElement
    : never;

/**
 * Create a `<multi-select>` or `<multi-checkbox>` element for fields supporting multiple choices.
 */
export function createMultiSelectInput<Config extends MultiSelectInputConfig>(
  config: Config,
): MultiSelectInputReturn<Config>;

interface _NumberInputConfig {
  min: number;
  max: number;

  /** @remarks Any non-number value is replaced with `"any"` */
  step: number | "any";

  /**
   * @remarks In {@linkcode NumberField._toInput | NumberField#_toInput}, if {@linkcode min}, {@linkcode max}, and {@linkcode step} are all
   * provided, passing `"number"` will prevent the output from being a `<range-picker>`. Passing `"range"` has no effect, the presence of
   * the other three properties is all that matters.
   *
   * This is entirely unused in {@linkcode createNumberInput}.
   */
  // TODO: move to NumberField extension
  type?: "range" | "number";
}

export interface NumberInputConfig extends InexactPartial<_NumberInputConfig>, FormInputConfig<number> {}

/**
 * Create an `<input type="number">` element for a NumberField.
 */
export function createNumberInput(config: NumberInputConfig): HTMLInputElement;

/**
 * @remarks Foundry types `value` and `label` as required, but this doesn't account for the use of
 * {@linkcode _SelectInputConfig.valueAttr | valueAttr} or {@linkcode _SelectInputConfig.labelAttr | labelAttr} in the config containing them.
 * To allow their use, `value` and `label` have been made optional here, despite being required if the config properties are *not* provided.
 */
export interface FormSelectOption {
  value?: string;
  label?: string;
  group?: string;
  disabled?: boolean;
  selected?: boolean;
  rule?: boolean;
  dataset?: Record<string, string>;
}

/**
 * This is the interface that Foundry just calls `SelectInputConfig`. It has been demoted to an `_`, `@internal` interface, because it is
 * never used by itself in core code and we wanted to use the name for a different type. It must be exported despite this due to use by
 * {@linkcode foundry.applications.handlebars.selectOptions}.
 * @internal
 */
export interface _SelectInputConfig {
  /** @remarks See {@linkcode prepareSelectOptionGroups} for examples */
  options: FormSelectOption[];

  /**
   * An option to control the order and display of optgroup elements. The order of strings defines the displayed order of optgroup elements.
   * A blank string may be used to define the position of ungrouped options. If not defined, the order of groups corresponds to the order of
   * options.
   */
  groups?: string[] | undefined;

  /**
   * @remarks If the provided {@linkcode _SelectInputConfig.options | options} don't include an option with a value of `""`, providing this
   * property will cause one to be created at the top of the options list with this value as its label.
   */
  blank?: string | undefined;

  /**
   * An alternative value key of the object passed to the options array
   */
  valueAttr?: string | undefined;

  /**
   * An alternative label key of the object passed to the options array
   */
  labelAttr?: string | undefined;

  /**
   * Localize value labels
   * @defaultValue `false`
   * @privateRemarks Everywhere this interface is used by Foundry, except for the {@linkcode foundry.applications.handlebars.selectOptions}
   * helper, this property is redundant due to being intersected with {@linkcode FormInputConfig}, which has its own `localize`.
   */
  localize?: boolean | undefined;

  /**
   * Sort options alphabetically by label within groups
   * @defaultValue `false`
   */
  sort?: boolean | undefined;

  // `type` is only used by `createMultiSelectInput`, so has been moved to `MultiSelectInputConfig`
}

/**
 * This is now the unified config type for {@linkcode createSelectInput}, but this name used to be used for what is now an `@internal`
 * interface. If you need public access to that interface for your project, please let the types project team know.
 *
 * Foundry types the `FormInputConfig` value type as just `string`; see {@linkcode SelectOptionsValue} for why we've widened it.
 */
export interface SelectInputConfig extends _SelectInputConfig, FormInputConfig<SelectOptionsValue> {}

/**
 * Create a `<select>` element for a StringField.
 * @remarks Foundry types this as a `FormInputConfig<string>` only, but given how {@linkcode prepareSelectGroupOptions} works, namely that
 * all values are converted to string before comparison for setting `selected`, passing a `number` value is fine.
 */
export function createSelectInput(config: SelectInputConfig): HTMLSelectElement;

export interface TextAreaInputConfig extends FormInputConfig<string> {
  /**
   * The number of visible text lines for the `<textarea>`
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/textarea#rows}
   * @remarks Foundry provides no support for
   * {@linkcode https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/textarea#cols | cols}
   * @privateRemarks Foundry incorrectly types this as required in 13.351 and 14.352
   */
  rows?: number | undefined;
}

/**
 * Create a `<textarea>` element for a StringField.
 */
export function createTextareaInput(config: TextAreaInputConfig): HTMLTextAreaElement;

export interface TextInputConfig extends FormInputConfig<string> {}

/**
 * Create an `<input type="text">` element for a StringField.
 */
export function createTextInput(config: TextInputConfig): HTMLInputElement;

export interface PrepareSelectOptionGroupsConfig
  extends _SelectInputConfig,
    Pick<FormInputConfig<SelectOptionsValue>, "value"> {}

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
 *
 * @remarks See {@linkcode SelectOptionsValue} remarks
 */
export function prepareSelectOptionGroups(config: PrepareSelectOptionGroupsConfig): PreparedSelectOptionGroup[];

/**
 * This is for the return type of {@linkcode prepareSelectOptionGroups}, which:
 * - Removes `group`, as it's unnecessary given the structure of a {@linkcode PreparedSelectOptionGroup}.
 * - Ensures that all the properties of {@linkcode FormSelectOption} are provided, even if `undefined`
 *  - This includes converting the properties defined by the config's {@linkcode _SelectInputConfig.valueAttr | valueAttr} and
 *  {@linkcode _SelectInputConfig.labelAttr | labelAttr} to `value` and `label` respectively.
 * - Adds an undocumented, and seemingly unused, `type` property that is always set to `"option"`
 */
interface PreparedFormSelectOption extends Required<Omit<FormSelectOption, "group">> {
  /** @remarks This is unused anywhere in core code, but it will exist in any options returned by {@linkcode prepareSelectOptionGroups} */
  type: "option";
}

export interface PreparedSelectOptionGroup {
  group: string;
  options: PreparedFormSelectOption[];
}

/** The attributes that {@linkcode setInputAttributes} cares about */
export type InputAttribute =
  | "aria"
  | "autofocus"
  | "classes"
  | "dataset"
  | "disabled"
  | "id"
  | "placeholder"
  | "readonly"
  | "required";

export interface SetInputAttributeConfig extends Pick<FormInputConfig<unknown>, InputAttribute> {}

/**
 * Apply standard attributes to all input elements.
 * @param input  - The element being configured
 * @param config - Configuration for the element
 */
export function setInputAttributes(input: HTMLElement, config: SetInputAttributeConfig): void;

/** See {@linkcode createFontAwesomeIcon} remarks for legal/licensing information about these. */
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
   * @remarks there are a number of FA-specific classes that could be useful here, see
   * {@link https://docs.fontawesome.com/v6/web/style/style-cheatsheet}.
   */
  classes: string[];
}

export interface CreateFontAwesomeIconOptions extends InexactPartial<_CreateFontAwesomeIconOptions> {}

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
 *
 * @privateRemarks `<i>` elements don't actually have their own subclass, they are just `HTMLElement`s
 */
export function createFontAwesomeIcon(glyph: string, options?: CreateFontAwesomeIconOptions): HTMLElement;

/**
 * @deprecated Since this type is only used by {@linkcode DataField.toFormGroup | DataField#toFormGroup}, and not by any of the functions in
 * this file, it has moved to {@linkcode DataField.CustomFormGroup}. This alias will be removed in v15.
 */
export type CustomFormGroup = DataField.CustomFormGroup;

/**
 * @deprecated Since this type is only used by {@linkcode DataField.toInput | DataField#toInput}, and not by any of the functions in
 * this file, it has moved to {@linkcode DataField.CustomFormInput}. This alias will be removed in v15.
 */
export type CustomFormInput = DataField.CustomFormInput;
