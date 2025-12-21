import type { FormInputConfig } from "../forms/fields.d.mts";
import type AbstractFormInputElement from "./form-element.d.mts";

/** @privateRemarks `HTMLDocumentTagsElement` only used for links */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type HTMLDocumentTagsElement from "./document-tags.d.mts";
import type { InexactPartial } from "#utils";

/**
 * A custom HTML element which allows for arbitrary assignment of a set of string tags.
 * This element may be used directly or subclassed to impose additional validation or functionality.
 *
 * @remarks When creating via markup, values can be set either as attribute or as the `innerText` of the element; see
 * {@linkcode HTMLStringTagsElement._initializeTags | #_initializeTags} for examples.
 *
 * @privateRemarks Unlike {@linkcode HTMLDocumentTagsElement}, there's no `single` option here, so no method ever returns/takes
 * `string | null`; `Iterable<string>` *almost* covers everything:
 * - {@linkcode HTMLStringTagsElement._value | #_value} is a `Set<string>`
 * - {@linkcode HTMLStringTagsElement._getValue | #_getValue} (and therefore the {@linkcode HTMLStringTagsElement.value | #value} getter)
 * always return `string[]`
 * - {@linkcode HTMLStringTagsElement._setValue | #_setValue} (and therefore the {@linkcode HTMLStringTagsElement.value | #value} setter)
 * take any `Iterable<string>`, but since that type will allow `string` literals, and `_setValue` does no wrapping of naked primitives, we
 * are forced to use a narrower type; `string[] | Set<string>` covers the vast majority of use cases.
 */
declare class HTMLStringTagsElement extends AbstractFormInputElement<string[] | Set<string>> {
  /**
   * @remarks This constructor is protected because additional work must be done after creation for this element to be valid in the DOM.
   * Use {@linkcode HTMLStringTagsElement.create} instead.
   */
  protected constructor(options?: HTMLStringTagsElement.Options);

  /** @defaultValue `"string-tags"` */
  static override tagName: string;

  static icons: HTMLStringTagsElement.Icons;

  static labels: HTMLStringTagsElement.Labels;

  /**
   * @remarks Initialized to `new Set()` in the class body *and* the constructor (for extra freshness).
   * @privateRemarks Also necessary to narrow from the value type param.
   */
  protected override _value: Set<string>;

  /**
   * @privateRemarks Fake type override to narrow from the value type param. {@linkcode HTMLStringTagsElement._getValue | #_getValue}
   * always returns `string[]`.
   */
  override get value(): string[];

  /** @privateRemarks Fake type override, to the type it would be anyway, that only becomes necessary once the getter override exists. */
  override set value(value: string[] | Set<string>);

  /**
   * Initialize innerText or an initial value attribute of the element as a comma-separated list of currently assigned
   * string tags.
   * @remarks In practice this will always be passed a value by the constructor, but when instantiated by the DOM it'll receive `undefined`,
   * and for all non-array values it falls back to the `value` attribute, or `this.innerText` if there isn't one.
   *
   * @example
   * Attribute
   * ```html
   * <string-tags value="tag-one,tag two,TagThree"></string-tags>
   * ```
   *
   * @example
   * `innerText`
   * ```html
   * <string-tags>tag-one,tag two,TagThree</string-tags>
   * ```
   */
  protected _initializeTags(values?: string[]): void;

  /**
   * Subclasses may impose more strict validation on what tags are allowed.
   * @param tag - A candidate tag
   * @throws An error if the candidate tag is not allowed
   * @remarks The implementation in {@linkcode HTMLStringTagsElement} only throws if the tag is falsey.
   */
  protected _validateTag(tag: string): void;

  /**
   * @remarks Returns `[tags: HTMLDivElement, input: HTMLInputElement, button: HTMLButtonElement]` in {@linkcode HTMLStringTagsElement}.
   * @privateRemarks Return type left wide for ease of subclassing.
   */
  protected override _buildElements(): HTMLElement[];

  protected override _refresh(): void;

  /**
   * Render the tagged string as an HTML element.
   * @param tag      - The raw tag value
   * @param label    - An optional tag label (default: `tag`)
   * @param editable - Is the tag editable? (default: `true`)
   * @returns A rendered HTML element for the tag
   */
  static renderTag(tag: string, label?: string, editable?: boolean): HTMLDivElement;

  protected override _activateListeners(): void;

  /** @remarks `Array.from(`{@linkcode HTMLStringTagsElement._value | this._value}`)` */
  protected override _getValue(): string[];

  protected override _setValue(value: string[] | Set<string>): void;

  protected override _toggleDisabled(disabled: boolean): void;

  /**
   * Create a {@linkcode HTMLStringTagsElement} using provided configuration data.
   */
  static create(config: HTMLStringTagsElement.Config): HTMLStringTagsElement;

  #HTMLStringTagsElement: true;
}

declare namespace HTMLStringTagsElement {
  interface Icons {
    /**
     * @remarks The icon used for the Add Tag button.
     * @defaultValue `"fa-solid fa-tag"`
     */
    add: string;

    /**
     * @remarks The icon for the Remove Tag button on each tag.
     * @defaultValue `"fa-solid fa-xmark"`
     */
    remove: string;
  }

  interface Labels {
    /**
     * @remarks A localization key used as the tooltip text for the Add Tag button.
     * @defaultValue `"ELEMENTS.TAGS.Add"`
     */
    add: string;

    /**
     * @remarks A localization key used as the tooltip text for the Remove Tag button on each tag.
     * @defaultValue `"ELEMENTS.TAGS.Remove"`
     */
    remove: string;

    /**
     * @remarks The placeholder text for the input element.
     * @defaultValue `""`
     */
    placeholder: string;
  }

  interface _Options {
    /**
     * Whether to automatically slugify all strings provided to the element.
     * @defaultValue `this.hasAttribute("slug")`
     */
    slug: boolean;

    /** An array of initial values. */
    values: string[];
  }

  interface Options extends InexactPartial<_Options> {}

  /**
   * @remarks Value type is `string[]` because {@linkcode HTMLStringTagsElement.create} does no massaging of `value` and it must be passable
   * to the constructor, and therefore to {@linkcode HTMLStringTagsElement._initializeTags | #_initializeTags}.
   */
  interface Config extends Pick<Options, "slug">, FormInputConfig<string[]> {}

  /**
   * @deprecated This interface has been renamed for consistency with other elements.
   * Use {@linkcode HTMLStringTagsElement.Config} instead. This alias will be removed in v15.
   */
  type StringTagsInputConfig = Config;
}

export default HTMLStringTagsElement;
